#!/usr/bin/env node

// CI leg gate for legs whose object may be absent on the committed graph.
//
// Exactly three outcomes are allowed, and they are distinguishable:
//   * required configuration missing  -> KDNA-CI-CONFIG-MISSING on stderr, exit 2,
//     and no receipt is printed;
//   * object registered as retired and unavailable -> one `KDNA-CI-NOT-RUN:`
//     line plus one machine-readable `KDNA-CI-RECEIPT: {...}` line, exit 0;
//   * object available                -> the real leg command runs and its exit
//     status becomes this process's exit status, with one `run` receipt.
//
// A not_run outcome requires BOTH an explicit registration in
// fixtures/ci-leg-registry.json AND the recomputed unavailability codes it
// names. The gate cannot invent a condition of its own: whenever a code it
// computes is not registered, or a registered code is no longer true, the real
// leg command runs instead. scripts/verify-ci-leg-receipts.mjs re-derives the
// same codes independently and refuses a receipt that disagrees.

import { readFileSync, realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { environmentFor, LEGS, REGISTRY_PATH } from './ci-leg-definitions.mjs';

const root = resolve(import.meta.dirname, '..');
const require = createRequire(import.meta.url);

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

export function inputDigests(environment) {
  return inputDigestsAt(root, environment);
}

export function inputDigestsAt(target, environment) {
  return {
    [environment.KDNA_ASSETS_METADATA_INDEX]: sha256(resolve(target, environment.KDNA_ASSETS_METADATA_INDEX)),
    [environment.KDNA_ASSETS_METADATA_PACKAGE]: sha256(resolve(target, environment.KDNA_ASSETS_METADATA_PACKAGE)),
  };
}

export function legRegistry() {
  return legRegistryAt(root);
}

export function legRegistryAt(target) {
  return readJson(resolve(target, REGISTRY_PATH));
}

function registrationFor(leg) {
  return (legRegistry().entries ?? []).find((entry) => entry.leg === leg);
}

// The installed Core is asked to admit every indexed asset; the codes it
// rejects with are the leg's unavailability codes.
export async function admissionCodes(environment, target = root) {
  const current = readJson(resolve(target, environment.KDNA_ASSETS_METADATA_INDEX));
  let admitNode;
  try {
    ({ admitNode } = require('@aikdna/kdna-core/node'));
  } catch (error) {
    return { codes: [`installed_core_admission_entry_unavailable:${error.code ?? 'UNKNOWN'}`], rejected: 0 };
  }
  const rejected = [];
  for (const entry of [...(current.assets ?? []), ...(current.clusters ?? [])]) {
    const artifactPath = entry.artifact?.path ?? entry.manifest?.path;
    if (!artifactPath) continue;
    const admitted = await admitNode(readFileSync(resolve(target, artifactPath)));
    if (admitted.status !== 'accepted') {
      rejected.push(`${entry.id}:${admitted.reason}`);
    }
  }
  if (rejected.length === 0) return { codes: [], rejected: 0 };
  return { codes: ['installed_core_rejects_indexed_assets'], rejected: rejected.length, rejected_assets: rejected };
}

// Everything the committed index cannot satisfy, as stable codes.
export function missingRequirements(environment, target = root) {
  const current = readJson(resolve(target, environment.KDNA_ASSETS_METADATA_INDEX));
  const entries = [...(current.assets ?? []), ...(current.clusters ?? [])];
  const codes = [];
  const detail = [];
  if (current.schema_version !== '1.0.0') {
    codes.push('index_schema_version');
    detail.push(`index_schema_version=${String(current.schema_version)}`);
  }
  const withoutTechnicalStatus = entries.filter((entry) => !entry.technical_status);
  if (withoutTechnicalStatus.length > 0) {
    codes.push('entries_without_technical_status');
    detail.push(`entries_without_technical_status=${withoutTechnicalStatus.length}`);
  }
  const withoutDownload = entries.filter((entry) => !entry.download?.url);
  if (withoutDownload.length > 0) {
    codes.push('entries_without_download_url');
    detail.push(`entries_without_download_url=${withoutDownload.length}`);
  }
  const manifest = readJson(resolve(target, environment.KDNA_ASSETS_METADATA_PACKAGE));
  const cliCoordinate = manifest.devDependencies?.['@aikdna/kdna-cli'];
  if (!/^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/u.test(cliCoordinate ?? '')) {
    codes.push('exact_semver_kdna_cli_pin');
    detail.push(`exact_semver_kdna_cli_pin=${String(cliCoordinate)}`);
  }
  return { codes, detail, entries: entries.length };
}

function receipt(payload) {
  return `KDNA-CI-RECEIPT: ${JSON.stringify(payload)}`;
}

async function main(argv) {
  const [leg] = argv;
  if (argv.length !== 1 || !Object.hasOwn(LEGS, leg)) {
    console.error(`usage: node scripts/ci-leg-receipt.mjs <${Object.keys(LEGS).join('|')}>`);
    return 2;
  }
  const definition = LEGS[leg];
  const environment = environmentFor();
  if (!process.env.KDNA_ASSETS_METADATA_INDEX) {
    console.error(
      `KDNA-CI-CONFIG-MISSING: ${leg} missing=KDNA_ASSETS_METADATA_INDEX ` +
        '(the leg must name the index document it audits; the workflow sets it explicitly)',
    );
    return 2;
  }
  const registration = registrationFor(leg);
  const unavailable = [];
  if (leg === 'current-assets') {
    const admission = await admissionCodes(environment);
    unavailable.push(...admission.codes);
  } else {
    unavailable.push(...missingRequirements(environment).codes);
  }
  const registered = new Set(registration?.unavailable_codes ?? []);
  const computed = new Set(unavailable);
  const agrees =
    registration?.class === 'not_run' &&
    computed.size === registered.size &&
    [...computed].every((code) => registered.has(code));
  if (agrees) {
    console.log(
      `KDNA-CI-NOT-RUN: ${leg} reason=${registration.reason} object=${definition.object} ` +
        `index=${environment.KDNA_ASSETS_METADATA_INDEX} unavailable=${[...computed].join(',')}`,
    );
    console.log(
      receipt({
        leg,
        class: 'not_run',
        reason: registration.reason,
        object: definition.object,
        unavailable_codes: [...computed].sort(),
        inputs: inputDigests(environment),
      }),
    );
    return 0;
  }
  const [command, ...commandArgs] = definition.command(environment);
  const result = spawnSync(command, commandArgs, { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.signal) throw new Error(`${leg} was interrupted by ${result.signal}`);
  console.log(
    receipt({
      leg,
      class: 'run',
      command: [command, ...commandArgs],
      status: result.status,
      inputs: inputDigests(environment),
    }),
  );
  return result.status;
}

// An entry-point check that survives a symlinked invocation path. Comparing
// `process.argv[1]` with `import.meta.filename` literally is false whenever the
// caller reaches this file through a symlink (macOS /tmp and /var are symlinks
// into /private), and the module then exits 0 without printing anything: a
// silent no-op in the middle of the receipt path.
function isEntryPoint() {
  if (!process.argv[1]) return false;
  try {
    return realpathSync(process.argv[1]) === realpathSync(import.meta.filename);
  } catch {
    return false;
  }
}

if (isEntryPoint()) process.exitCode = await main(process.argv.slice(2));

export { LEGS };
