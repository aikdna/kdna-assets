#!/usr/bin/env node

import { rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import * as core from '@aikdna/kdna-core';
import { argValue, failWith, readJson } from './lib.mjs';

const args = process.argv.slice(2);
const repositoryRoot = resolve(import.meta.dirname, '..');
const root = resolve(argValue(args, '--root', '.'));
const indexPath = resolve(root, argValue(args, '--current', 'index/current.json'));
const requireLoad = args.includes('--require-load');
const current = readJson(indexPath);
const errors = [];
let loaded = 0;
let gated = 0;
const repositoryPackage = readJson(join(repositoryRoot, 'package.json'));
const expectedCliVersion = repositoryPackage.devDependencies?.['@aikdna/kdna-cli'];
const cliPackageRoot = join(repositoryRoot, 'node_modules', '@aikdna', 'kdna-cli');
const cliPackage = readJson(join(cliPackageRoot, 'package.json'));
if (
  !/^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/u.test(expectedCliVersion) ||
  cliPackage.name !== '@aikdna/kdna-cli' ||
  cliPackage.version !== expectedCliVersion ||
  cliPackage.bin?.kdna !== 'src/cli.js'
) {
  errors.push('installed KDNA CLI does not match the exact repository dependency coordinate');
}
const cliEntry = join(cliPackageRoot, 'src', 'cli.js');
failWith(errors, 'Current asset check');

for (const entry of current.assets || []) {
  const artifact = resolve(root, entry.artifact.path);
  const validate = runJson(['validate', artifact, '--json']);
  if (!validate.ok || validate.value?.overall_valid !== true) {
    errors.push(`${entry.id}: kdna validate failed`);
    continue;
  }

  const plan = runJson(['plan-load', artifact, '--json']);
  if (!plan.ok) {
    errors.push(`${entry.id}: kdna plan-load failed`);
    continue;
  }
  if (plan.value.state !== entry.technical_status.plan_load) {
    errors.push(`${entry.id}: index plan_load=${entry.technical_status.plan_load}, observed ${plan.value.state}`);
  }

  if (plan.value.can_load_now === true) {
    const load = runJson(['load', artifact, '--profile=compact', '--as=json']);
    if (!load.ok || load.value?.type !== 'kdna.runtime-capsule' || load.value?.contract_version !== '0.1.0') {
      errors.push(`${entry.id}: load did not produce a v1.0 Runtime Capsule`);
      continue;
    }
    // Capsule trust-chain verification is done IN-PROCESS via the pinned
    // KDNA Core, not the CLI. The published CLI removed the standalone
    // `capsule-verify` command (0.36.0 command allowlist; see kdna-cli
    // CHANGELOG), and the sanctioned Runtime path is inspect → validate →
    // plan-load → load, where `load` returns the authorized Capsule. Shelling
    // out to a removed command would break validation against any current CLI.
    const capsuleErrors = verifyCapsuleInProcess(load.value, artifact);
    if (capsuleErrors.length > 0) errors.push(`${entry.id}: capsule-verify failed: ${capsuleErrors.join('; ')}`);
    if (entry.technical_status.load !== 'verified' || entry.technical_status.capsule !== 'verified') {
      errors.push(`${entry.id}: live load passed but index does not record verified load/capsule`);
    }
    loaded++;
  } else {
    const authState = /^needs_(password|license|account|org_auth|runtime)$/.test(plan.value.state);
    if (!authState || entry.access === 'public') {
      errors.push(`${entry.id}: non-loadable current asset is not at an allowed authorization gate`);
    }
    if (
      entry.technical_status.load !== 'authorization-required' ||
      entry.technical_status.capsule !== 'authorization-required'
    ) {
      errors.push(`${entry.id}: authorization-gated asset must report authorization-required load/capsule`);
    }
    if (requireLoad) errors.push(`${entry.id}: --require-load cannot accept authorization-required state`);
    gated++;
  }
}

failWith(errors, 'Current asset check');
console.log('Current asset check: PASS');
console.log(`  entries:               ${(current.assets || []).length}`);
console.log(`  live Capsule verified: ${loaded}`);
console.log(`  authorization-gated:   ${gated}`);

function runJson(commandArgs) {
  const result = runCli(commandArgs);
  if (result.status !== 0) return { ok: false, result };
  try {
    return { ok: true, value: JSON.parse(result.stdout), result };
  } catch {
    return { ok: false, result };
  }
}

function runCli(commandArgs) {
  return spawnSync(process.execPath, [cliEntry, ...commandArgs], {
    cwd: repositoryRoot,
    encoding: 'utf8',
  });
}

// In-process equivalent of the retired CLI `capsule-verify` (removed from the
// 0.36.0 command allowlist). Verifies a produced Runtime Capsule's structure
// and that its claimed asset/content/runtime-entry-set digests match the actual
// asset bytes, using the pinned KDNA Core. No subprocess to a removed command.
function verifyCapsuleInProcess(capsule, assetPath) {
  const errors = [];
  if (!capsule || capsule.type !== 'kdna.runtime-capsule')
    errors.push('missing or invalid type marker');
  if (capsule.contract_version !== '0.1.0')
    errors.push('missing or invalid contract version');
  if (!capsule.asset?.asset_id) errors.push('missing asset identifier');
  if (!capsule.digests?.asset?.value) errors.push('missing packaged asset digest');
  if (!capsule.digests?.content?.value) errors.push('missing content digest');
  if (!capsule.digests?.runtime_entry_set?.value) errors.push('missing runtime entry-set digest');
  if (errors.length > 0) return errors;
  try {
    const actual = core.computeDigestEvidence(assetPath);
    for (const [field, label] of [
      ['asset', 'packaged-asset'],
      ['content', 'content'],
      ['runtime_entry_set', 'runtime entry-set'],
    ]) {
      const claimed = capsule.digests?.[field]?.value;
      if (claimed && actual[field]?.value !== claimed) {
        errors.push(`${label} digest mismatch (capsule ${claimed}, actual ${actual[field]?.value})`);
      }
    }
  } catch (error) {
    errors.push(`unable to verify asset digest evidence: ${error.message}`);
  }
  return errors;
}
