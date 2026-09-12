import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  checkRepository,
  coordinateFindings,
} from '../scripts/dependency-coordinate-policy.mjs';

const root = resolve(import.meta.dirname, '..');
const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const lock = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8'));
const coordinate = manifest.devDependencies['@aikdna/kdna-core'];
const integrity = lock.packages['node_modules/@aikdna/kdna-core'].integrity;

function findingsFor(spec, mutateLock) {
  const next = structuredClone(manifest);
  next.devDependencies['policy-probe'] = spec;
  const nextLock = structuredClone(lock);
  nextLock.packages['node_modules/policy-probe'] = {
    version: '1.0.0',
    resolved: spec.startsWith('file:') ? spec : undefined,
    integrity,
  };
  if (mutateLock) mutateLock(nextLock);
  return coordinateFindings({ manifest: next, lock: nextLock, root });
}

test('every direct declaration is an exact SemVer or an integrity-locked file: pin', () => {
  const direct = [
    ...Object.entries(manifest.dependencies ?? {}),
    ...Object.entries(manifest.devDependencies ?? {}),
  ];
  assert.ok(direct.length > 0);
  for (const [name, spec] of direct) {
    assert.ok(
      /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u.test(spec) || spec.startsWith('file:'),
      `${name} must be an exact SemVer or a file: pin, got ${spec}`,
    );
  }
  assert.deepEqual(checkRepository(root), []);
});

test('floating ranges are rejected in every shape the retired assertion rejected', () => {
  for (const spec of ['^1.2.3', '~1.2.3', '*', 'latest', '1.2.x', '1.2.*', '>=1.0.0', '1.2.3 || 2.0.0', '1.2.3 - 2.0.0', '1', '1.2', 'next', '']) {
    const findings = findingsFor(spec);
    assert.ok(
      findings.some((finding) => finding.rule === 'floating_or_unpinned_range' && finding.spec === spec),
      `spec ${JSON.stringify(spec)} must be rejected, got ${JSON.stringify(findings)}`,
    );
  }
});

test('exact SemVer forms stay accepted', () => {
  for (const spec of ['1.2.3', '0.24.0-rc.component-semantics.2', '1.2.3+build.1']) {
    assert.deepEqual(findingsFor(spec), [], `spec ${spec} should be accepted`);
  }
});

test('a file: pin is only accepted with a matching lock coordinate and a full sha512 integrity', () => {
  assert.deepEqual(findingsFor(coordinate), []);
  assert.deepEqual(
    findingsFor(coordinate, (nextLock) => { delete nextLock.packages['node_modules/policy-probe'].integrity; })
      .map((finding) => finding.rule),
    ['file_coordinate_without_sha512_integrity'],
  );
  assert.deepEqual(
    findingsFor(coordinate, (nextLock) => { nextLock.packages['node_modules/policy-probe'].integrity = 'sha512-AAA'; })
      .map((finding) => finding.rule),
    ['file_coordinate_without_sha512_integrity'],
  );
  assert.deepEqual(
    findingsFor(coordinate, (nextLock) => { nextLock.packages['node_modules/policy-probe'].resolved = 'file:vendor/elsewhere.tgz'; })
      .map((finding) => finding.rule),
    ['file_coordinate_lock_drift'],
  );
  assert.deepEqual(
    findingsFor('file:vendor/not-committed.tgz').map((finding) => finding.rule),
    ['file_coordinate_target_missing'],
  );
});

test('the standalone gate is red when a committed pin loses its integrity', () => {
  const sandbox = mkdtempSync(join(tmpdir(), 'assets-range-policy-'));
  try {
    for (const name of ['package.json', 'package-lock.json']) {
      copyFileSync(join(root, name), join(sandbox, name));
    }
    for (const [, spec] of Object.entries(manifest.devDependencies ?? {})) {
      if (!spec.startsWith('file:')) continue;
      mkdirSync(dirname(join(sandbox, spec.slice('file:'.length))), { recursive: true });
      copyFileSync(join(root, spec.slice('file:'.length)), join(sandbox, spec.slice('file:'.length)));
    }
    const script = join(root, 'scripts', 'dependency-coordinate-policy.mjs');
    const green = spawnSync(process.execPath, [script, '--root', sandbox], { encoding: 'utf8' });
    assert.equal(green.status, 0, green.stdout + green.stderr);

    const mutantLock = JSON.parse(readFileSync(join(sandbox, 'package-lock.json'), 'utf8'));
    delete mutantLock.packages['node_modules/@aikdna/kdna-cli'].integrity;
    writeFileSync(join(sandbox, 'package-lock.json'), `${JSON.stringify(mutantLock, null, 2)}\n`);
    const red = spawnSync(process.execPath, [script, '--root', sandbox], { encoding: 'utf8' });
    assert.equal(red.status, 1, red.stdout + red.stderr);
    assert.match(red.stdout, /file_coordinate_without_sha512_integrity/);
  } finally {
    rmSync(sandbox, { recursive: true, force: true });
  }
});
