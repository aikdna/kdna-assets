#!/usr/bin/env node

import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { argValue, failWith, readJson } from './lib.mjs';

const args = process.argv.slice(2);
const root = resolve(argValue(args, '--root', '.'));
const current = readJson(resolve(root, argValue(args, '--current', 'index/current.json')));
const task = argValue(args, '--task', 'Verify a reference Cluster publication decision');
const errors = [];

for (const entry of current.clusters || []) {
  if (entry.manifest.path.endsWith('.kdna')) errors.push(`${entry.id}: Cluster manifest must not be .kdna`);
  const manifestPath = resolve(root, entry.manifest.path);
  const manifest = readJson(manifestPath);
  if (manifest.format !== 'kdna-cluster') errors.push(`${entry.id}: manifest format is not kdna-cluster`);
  if (manifest.cluster_id !== entry.id) errors.push(`${entry.id}: cluster_id does not match index id`);
  if (manifest.version !== entry.version) errors.push(`${entry.id}: manifest version does not match index`);

  const validation = runJson(['cluster', 'validate', manifestPath]);
  if (!validation.ok || validation.value?.valid !== true) {
    errors.push(`${entry.id}: cluster validate failed`);
    continue;
  }
  const plan = runJson(['cluster', 'plan-use', manifestPath, `--task=${task}`, '--as=json']);
  if (!plan.ok || plan.value?.mode !== 'cluster' || plan.value?.cluster_ref?.cluster_id !== entry.id) {
    errors.push(`${entry.id}: cluster plan-use did not produce the expected Cluster plan`);
    continue;
  }
  const observedState = plan.value.load_plan_ref?.status === 'blocked' ? 'blocked' : 'planned';
  if (observedState !== entry.technical_status.plan_state) {
    errors.push(`${entry.id}: index plan_state=${entry.technical_status.plan_state}, observed ${observedState}`);
  }
}

failWith(errors, 'Cluster check');
console.log('Cluster check: PASS');
console.log(`  entries validated/planned: ${(current.clusters || []).length}`);

function runJson(commandArgs) {
  const result = spawnSync('kdna', commandArgs, { encoding: 'utf8' });
  if (result.status !== 0) return { ok: false, result };
  try {
    return { ok: true, value: JSON.parse(result.stdout), result };
  } catch {
    return { ok: false, result };
  }
}
