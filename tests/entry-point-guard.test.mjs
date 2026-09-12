'use strict';

// Every entry-point gate in this repository passes the same pair of checks
// before it is merged:
//
//   1. the entry guard survives a symlinked invocation path (on macOS `/tmp`
//      and `/var` are symlinks into `/private`), and
//   2. a clean copy of the repository really runs the gate and prints its
//      success line.
//
// `scripts/verify-ci-leg-receipts.mjs` shipped without either one: reached
// through a symlinked path its guard compared a symlink path against a real
// path, the module exited 0 without printing anything, and that "rc=0" read
// like a passing gate. The pair is deliberately two checks, because rc=0 alone
// is exactly what the defect produced.

import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');

const GATES = Object.freeze([
  { script: 'scripts/check-publish-coordinates.mjs', args: [], success: /KDNA-PUBLISH-COORDINATES: ok /u },
  { script: 'scripts/dependency-coordinate-policy.mjs', args: [], success: /KDNA-DEPENDENCY-COORDINATES: ok /u },
  { script: 'scripts/verify-ci-leg-receipts.mjs', args: [], success: /KDNA-CI-LEG-RECEIPTS: ok /u },
  {
    script: 'scripts/ci-leg-receipt.mjs',
    args: ['index-metadata'],
    environment: { KDNA_ASSETS_METADATA_INDEX: 'index/current.json' },
    success: /KDNA-CI-(?:RECEIPT|NOT-RUN): /u,
  },
]);

function runGate(directory, gate) {
  return spawnSync(process.execPath, [join(directory, gate.script), ...gate.args], {
    cwd: directory,
    encoding: 'utf8',
    env: { ...process.env, ...gate.environment },
  });
}

function cleanCopy() {
  const parent = mkdtempSync(join(tmpdir(), 'kdna-assets-clean-copy-'));
  const copy = join(parent, 'repository');
  cpSync(root, copy, {
    recursive: true,
    filter: (source) => !source.split(sep).includes('.git'),
  });
  return { parent, copy };
}

test('a clean copy of the repository really runs every entry-point gate', () => {
  const { parent, copy } = cleanCopy();
  try {
    for (const gate of GATES) {
      const result = runGate(copy, gate);
      assert.equal(result.status, 0, `${gate.script} exited ${result.status}\n${result.stdout}${result.stderr}`);
      assert.match(result.stdout, gate.success, `${gate.script} did not print its success line`);
    }
  } finally {
    rmSync(parent, { recursive: true, force: true });
  }
});

test('the clean-copy run is not vacuous: removing an input turns it red', () => {
  const { parent, copy } = cleanCopy();
  try {
    rmSync(join(copy, 'fixtures', 'ci-leg-registry.json'), { force: true });
    const result = runGate(copy, GATES[2]);
    assert.notEqual(result.status, 0, 'the leg receipt gate passed without its registry');
    assert.doesNotMatch(result.stdout, GATES[2].success);
  } finally {
    rmSync(parent, { recursive: true, force: true });
  }
});

test('every entry-point gate survives a symlinked invocation path', () => {
  const parent = mkdtempSync(join(tmpdir(), 'kdna-assets-symlink-'));
  const link = join(parent, 'repository');
  symlinkSync(root, link, 'dir');
  try {
    for (const gate of GATES) {
      const result = runGate(link, gate);
      assert.equal(result.status, 0, `${gate.script} exited ${result.status} through ${link}\n${result.stdout}${result.stderr}`);
      assert.match(result.stdout, gate.success, `${gate.script} printed nothing through ${link}`);
    }
  } finally {
    rmSync(parent, { recursive: true, force: true });
  }
});
