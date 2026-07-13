#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { dirname, resolve, sep } from 'node:path';
import { argValue, failWith, readJson } from './lib.mjs';

const args = process.argv.slice(2);
const root = resolve(argValue(args, '--root', '.'));
const current = readJson(resolve(root, argValue(args, '--current', 'index/current.json')));
const errors = [];

for (const entry of [...(current.assets || []), ...(current.clusters || [])]) {
  const contentPath = entry.kind === 'kdna-asset' ? entry.artifact.path : entry.manifest.path;
  const entryDir = resolve(root, dirname(contentPath));
  const licensePath = resolve(root, entry.license.path);
  if (!existsSync(licensePath)) errors.push(`${entry.id}: per-entry license file missing: ${entry.license.path}`);
  if (licensePath === resolve(root, 'LICENSE')) errors.push(`${entry.id}: root LICENSE cannot license a current entry`);
  if (!licensePath.startsWith(`${entryDir}${sep}`)) {
    errors.push(`${entry.id}: license must live inside the entry directory`);
  }
  if (entry.license.repository_license_applies !== false) {
    errors.push(`${entry.id}: repository_license_applies must be false`);
  }
  if (entry.access === 'licensed' && entry.license.id === 'CC-BY-4.0') {
    errors.push(`${entry.id}: licensed entry must not inherit the archive CC-BY license`);
  }
  if (entry.kind === 'kdna-asset') {
    const expectedPrefix = entry.access === 'public' ? 'references/public/' : 'references/licensed/';
    if (!entry.artifact.path.startsWith(expectedPrefix)) {
      errors.push(`${entry.id}: access=${entry.access} must use ${expectedPrefix}`);
    }
  }
}

failWith(errors, 'License check');
console.log('License check: PASS');
console.log(`  current entries checked: ${(current.assets || []).length + (current.clusters || []).length}`);
