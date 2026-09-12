import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { findingsFor } from '../scripts/check-publish-coordinates.mjs';

// C01: a non-private package may not carry `file:` coordinates into a publish.
// This repository is `private` (no publication is configured), so the gate is
// green here; the negatives below keep it from being green for the wrong
// reason.

const root = resolve(import.meta.dirname, '..');
const checker = join(root, 'scripts', 'check-publish-coordinates.mjs');

test('the committed private manifest carries no publish-coordinate finding', () => {
  const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  assert.equal(manifest.private, true);
  assert.deepEqual(findingsFor(manifest), []);
  const result = spawnSync(process.execPath, [checker], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /KDNA-PUBLISH-COORDINATES: ok .*private=true/);
});

test('dropping the private flag turns the same dev graph into findings', () => {
  const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  delete manifest.private;
  const findings = findingsFor(manifest);
  assert.ok(findings.length > 0);
  for (const finding of findings) assert.ok(finding.spec.startsWith('file:'));
});

test('a non-private package on exact registry coordinates is not a finding', () => {
  assert.deepEqual(
    findingsFor({ name: '@aikdna/probe', devDependencies: { '@aikdna/kdna-core': '0.24.0-rc.component-semantics.2' } }),
    [],
  );
});

test('the gate points at the tree it is given and still runs through a symlinked path', () => {
  const sandbox = mkdtempSync(join(tmpdir(), 'assets-publish-coordinates-'));
  try {
    writeFileSync(
      join(sandbox, 'package.json'),
      `${JSON.stringify({ name: '@aikdna/probe', devDependencies: { '@aikdna/kdna-core': 'file:vendor/a.tgz' } }, null, 2)}\n`,
    );
    const direct = spawnSync(process.execPath, [checker, '--root', sandbox], { encoding: 'utf8' });
    assert.equal(direct.status, 1, direct.stdout + direct.stderr);
    assert.match(direct.stdout, /non_private_package_declares_file_coordinate/);
    // Reaching the checker itself through a symlink must not turn it into a
    // silent no-op (macOS /var and /tmp are symlinks).
    const link = join(sandbox, 'repo-link');
    symlinkSync(root, link);
    const linkedChecker = spawnSync(process.execPath, [join(link, 'scripts', 'check-publish-coordinates.mjs')], { encoding: 'utf8' });
    assert.equal(linkedChecker.status, 0, linkedChecker.stdout + linkedChecker.stderr);
    assert.match(linkedChecker.stdout, /KDNA-PUBLISH-COORDINATES: ok/);
  } finally {
    rmSync(sandbox, { recursive: true, force: true });
  }
});
