import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const repoRoot = resolve(import.meta.dirname, '..');
const runner = resolve(repoRoot, 'scripts/run-creation-runtime-matrix.mjs');

test('runtime matrix rejects an explicit receipt inside the public repository', () => {
  const receipt = resolve(repoRoot, 'evidence/forbidden-current-receipt.json');
  const result = spawnSync(process.execPath, [runner, '--receipt', receipt], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /outside this public repository/);
  assert.equal(existsSync(receipt), false);
});

test('runtime matrix rejects a missing receipt path before executing', () => {
  const result = spawnSync(process.execPath, [runner, '--receipt'], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /requires an explicit path/);
});
