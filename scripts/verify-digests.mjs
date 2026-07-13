#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { argValue, failWith, parseSidecar, readJson, sha256 } from './lib.mjs';

const args = process.argv.slice(2);
const root = resolve(argValue(args, '--root', '.'));
const currentPath = resolve(root, argValue(args, '--current', 'index/current.json'));
const current = readJson(currentPath);
const errors = [];
let currentChecked = 0;

for (const entry of [...current.assets, ...current.clusters]) {
  const relativePath = entry.kind === 'kdna-asset' ? entry.artifact.path : entry.manifest.path;
  const artifactPath = resolve(root, relativePath);
  const expected = entry.digest.value;
  if (!existsSync(artifactPath)) {
    errors.push(`${entry.id}: artifact missing: ${relativePath}`);
    continue;
  }
  const actual = sha256(artifactPath);
  if (actual !== expected) errors.push(`${entry.id}: digest mismatch (${actual} != ${expected})`);
  const sidecarPath = `${artifactPath}.sha256`;
  if (!existsSync(sidecarPath)) errors.push(`${entry.id}: sidecar missing: ${relativePath}.sha256`);
  else if (parseSidecar(readFileSync(sidecarPath, 'utf8')) !== expected) {
    errors.push(`${entry.id}: local sidecar does not declare index digest`);
  }
  currentChecked++;
}

failWith(errors, 'Digest verification');
console.log('Digest verification: PASS');
console.log(`  current artifacts: ${currentChecked}`);
