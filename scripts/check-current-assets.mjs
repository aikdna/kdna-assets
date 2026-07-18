#!/usr/bin/env node

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { argValue, failWith, readJson } from './lib.mjs';

const args = process.argv.slice(2);
const root = resolve(argValue(args, '--root', '.'));
const indexPath = resolve(root, argValue(args, '--current', 'index/current.json'));
const requireLoad = args.includes('--require-load');
const current = readJson(indexPath);
const errors = [];
let loaded = 0;
let gated = 0;

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
    const temp = mkdtempSync(join(tmpdir(), 'kdna-assets-capsule-'));
    try {
      const capsulePath = join(temp, 'capsule.json');
      writeFileSync(capsulePath, `${JSON.stringify(load.value, null, 2)}\n`);
      const verified = spawnSync(
        'npx',
        ['--no', 'kdna', 'capsule-verify', capsulePath, '--asset', artifact, '--json'],
        { encoding: 'utf8' },
      );
      if (verified.status !== 0) errors.push(`${entry.id}: capsule-verify failed`);
    } finally {
      rmSync(temp, { recursive: true, force: true });
    }
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
  const result = spawnSync('npx', ['--no', 'kdna', ...commandArgs], { encoding: 'utf8' });
  if (result.status !== 0) return { ok: false, result };
  try {
    return { ok: true, value: JSON.parse(result.stdout), result };
  } catch {
    return { ok: false, result };
  }
}
