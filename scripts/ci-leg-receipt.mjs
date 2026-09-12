#!/usr/bin/env node

// CI leg gate for legs whose object may be absent on the committed graph.
//
// Exactly three outcomes are allowed, and they are distinguishable:
//   * required configuration missing  -> KDNA-CI-CONFIG-MISSING on stderr, exit 2,
//     and no not_run receipt is printed;
//   * object unavailable              -> exactly one `KDNA-CI-NOT-RUN: <leg> ...`
//     receipt on stdout, exit 0;
//   * object available                -> the real leg command is executed and its
//     exit status becomes this process's exit status.
//
// The object of both legs is an index published in the retired 1.0.0 metadata
// schema (`technical_status` + `download`) that `scripts/validate-indexes.mjs`,
// `scripts/audit-public-metadata.py` and `scripts/check-release-consistency.mjs`
// consume. The committed index is the current kdna-current-index 2.0.0 format,
// so those three tools cannot run against it; the legs are checked rather than
// skipped, and they run for real again as soon as such an index exists.
//
// `current-assets` guards the other direction: `scripts/check-current-assets.mjs`
// drives every indexed asset through the packed CLI, so it can only run while
// the committed Core admits those assets.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const root = resolve(import.meta.dirname, '..');
const require = createRequire(import.meta.url);

const LEGS = {
  'current-assets': {
    object: 'indexed assets admitted by the committed public Core',
    command: () => ['node', 'scripts/check-current-assets.mjs'],
  },
  'index-metadata': {
    object: 'index published in the retired 1.0.0 metadata schema (technical_status + download)',
    command: (environment) =>
      environment.KDNA_CI_ONLINE === '1'
        ? ['python3', 'scripts/audit-public-metadata.py', '--online-releases']
        : ['python3', 'scripts/audit-public-metadata.py'],
  },
  'online-release-consistency': {
    object: 'index download coordinates for the online GitHub Release comparison',
    command: () => ['node', 'scripts/check-release-consistency.mjs', '--online'],
  },
};

async function admitIndexedAssets(environment) {
  const indexPath = resolve(root, environment.KDNA_ASSETS_METADATA_INDEX);
  const current = readJson(indexPath);
  let admitNode;
  try {
    ({ admitNode } = require('@aikdna/kdna-core/node'));
  } catch (error) {
    // The installed Core has no public admission entry: the object the leg
    // needs is unavailable, which is a not_run receipt, not a red leg.
    return [`installed_core_admission_entry_unavailable:${error.code ?? 'UNKNOWN'}`];
  }
  const rejected = [];
  for (const entry of [...(current.assets ?? []), ...(current.clusters ?? [])]) {
    const artifactPath = entry.artifact?.path ?? entry.manifest?.path;
    if (!artifactPath) continue;
    const admitted = await admitNode(readFileSync(resolve(root, artifactPath)));
    if (admitted.status !== 'accepted') {
      rejected.push(`${entry.id}:${admitted.reason}`);
    }
  }
  return rejected;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function missingRequirements(environment) {
  const indexPath = resolve(root, environment.KDNA_ASSETS_METADATA_INDEX);
  const current = readJson(indexPath);
  const entries = [...(current.assets ?? []), ...(current.clusters ?? [])];
  const requirements = [];
  if (current.schema_version !== '1.0.0') {
    requirements.push(`index_schema_version=${String(current.schema_version)}`);
  }
  const withoutTechnicalStatus = entries.filter((entry) => !entry.technical_status);
  if (withoutTechnicalStatus.length > 0) {
    requirements.push(`entries_without_technical_status=${withoutTechnicalStatus.length}`);
  }
  const withoutDownload = entries.filter((entry) => !entry.download?.url);
  if (withoutDownload.length > 0) {
    requirements.push(`entries_without_download_url=${withoutDownload.length}`);
  }
  const manifest = readJson(resolve(root, environment.KDNA_ASSETS_METADATA_PACKAGE));
  const cliCoordinate = manifest.devDependencies?.['@aikdna/kdna-cli'];
  if (!/^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/u.test(cliCoordinate ?? '')) {
    requirements.push(`exact_semver_kdna_cli_pin=${String(cliCoordinate)}`);
  }
  return { requirements, entries: entries.length, indexPath };
}

async function main(argv) {
  const [leg] = argv;
  if (argv.length !== 1 || !Object.hasOwn(LEGS, leg)) {
    console.error(`usage: node scripts/ci-leg-receipt.mjs <${Object.keys(LEGS).join('|')}>`);
    return 2;
  }
  const environment = {
    ...process.env,
    KDNA_ASSETS_METADATA_INDEX: process.env.KDNA_ASSETS_METADATA_INDEX ?? 'index/current.json',
    KDNA_ASSETS_METADATA_PACKAGE: process.env.KDNA_ASSETS_METADATA_PACKAGE ?? 'package.json',
  };
  if (!process.env.KDNA_ASSETS_METADATA_INDEX) {
    console.error(
      `KDNA-CI-CONFIG-MISSING: ${leg} missing=KDNA_ASSETS_METADATA_INDEX ` +
        '(the leg must name the index document it audits; the workflow sets it explicitly)',
    );
    return 2;
  }
  const definition = LEGS[leg];
  if (leg === 'current-assets') {
    const rejected = await admitIndexedAssets(environment);
    if (rejected.length > 0) {
      console.log(
        `KDNA-CI-NOT-RUN: ${leg} reason=committed_core_rejects_indexed_assets ` +
          `object=${definition.object} index=${environment.KDNA_ASSETS_METADATA_INDEX} ` +
          `rejected=${rejected.join(',')}`,
      );
      return 0;
    }
  }
  const { requirements, entries } = missingRequirements(environment);
  if (requirements.length > 0) {
    console.log(
      `KDNA-CI-NOT-RUN: ${leg} reason=retired_index_metadata_schema ` +
        `object=${definition.object} index=${environment.KDNA_ASSETS_METADATA_INDEX} ` +
        `entries=${entries} unavailable=${requirements.join(' ')}`,
    );
    return 0;
  }
  const [command, ...commandArgs] = definition.command(environment);
  const result = spawnSync(command, commandArgs, { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.signal) throw new Error(`${leg} was interrupted by ${result.signal}`);
  return result.status;
}

if (process.argv[1] === import.meta.filename) process.exitCode = await main(process.argv.slice(2));

export { LEGS, missingRequirements };
