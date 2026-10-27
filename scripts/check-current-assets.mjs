#!/usr/bin/env node

import { join, resolve } from 'node:path';
import { auditIndex } from '../src/catalog.mjs';
import { argValue, failWith, readJson } from './lib.mjs';

const args = process.argv.slice(2);
const repositoryRoot = resolve(import.meta.dirname, '..');
const root = resolve(argValue(args, '--root', '.'));
const currentPath = resolve(root, argValue(args, '--current', 'index/current.json'));
const requireLoad = args.includes('--require-load');
const errors = [];

const repositoryPackage = readJson(join(repositoryRoot, 'package.json'));
const binding = readJson(join(repositoryRoot, 'public-contract-binding.json'));
const declaredCliCoordinate = repositoryPackage.devDependencies?.['@aikdna/kdna-cli'];
const boundCli = (binding.packages ?? []).find((entry) => entry.name === '@aikdna/kdna-cli');
const expectedCliVersion = (() => {
  if (typeof declaredCliCoordinate === 'string' && declaredCliCoordinate.startsWith('file:')) {
    return declaredCliCoordinate.slice('file:'.length) === boundCli?.archive ? boundCli.version : null;
  }
  return /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/u.test(declaredCliCoordinate ?? '')
    ? declaredCliCoordinate
    : null;
})();
const cliPackageRoot = join(repositoryRoot, 'node_modules', '@aikdna', 'kdna-cli');
const cliPackage = readJson(join(cliPackageRoot, 'package.json'));

if (
  expectedCliVersion === null ||
  cliPackage.name !== '@aikdna/kdna-cli' ||
  cliPackage.version !== expectedCliVersion ||
  cliPackage.bin?.kdna !== 'src/cli.js'
) {
  errors.push('installed KDNA CLI does not match the exact repository dependency coordinate');
}
if (requireLoad) {
  errors.push('--require-load is unavailable: current public CLI exposes read but not plan/load');
}

let entries = 0;
let checked = 0;
if (errors.length === 0) {
  try {
    const current = readJson(currentPath);
    const audit = await auditIndex(current, { root, allowRead: false });
    entries = current.assets.length;
    checked = audit.results.length;
  } catch (error) {
    errors.push(error.message);
  }
}

failWith(errors, 'Current asset check');
console.log('Current asset check: PASS');
console.log(`  entries:               ${entries}`);
console.log(`  native admissions:     ${checked}`);
console.log(`  read requested:        false`);
