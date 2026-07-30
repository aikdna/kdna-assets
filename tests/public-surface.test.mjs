import assert from 'node:assert/strict';
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const scanner = resolve(import.meta.dirname, '../scripts/check-public-surface.mjs');

test('public surface accepts only the exact historical evidence allowlist', () => {
  const root = mkdtempSync(join(tmpdir(), 'kdna-assets-public-surface-'));
  try {
    mkdirSync(join(root, 'evidence'), { recursive: true });
    writeFileSync(join(root, 'evidence/rebuild-receipt-2026-07-17.json'), '{}\n');
    writeFileSync(join(root, 'evidence/rebuild-receipt-2026-07-18.json'), '{}\n');
    const result = runScanner(root);
    assert.equal(result.status, 0, result.stderr || result.stdout);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('public surface rejects a current runtime receipt in evidence', () => {
  const root = mkdtempSync(join(tmpdir(), 'kdna-assets-public-surface-'));
  try {
    mkdirSync(join(root, 'evidence'), { recursive: true });
    writeFileSync(join(root, 'evidence/creation-runtime-matrix-latest.json'), '{}\n');
    const result = runScanner(root);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /unexpected-public-evidence/);
    assert.match(result.stdout, /creation-runtime-matrix-latest\.json/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('public surface rejects an unapproved evidence subdirectory', () => {
  const root = mkdtempSync(join(tmpdir(), 'kdna-assets-public-surface-'));
  try {
    mkdirSync(join(root, 'evidence/private-run'), { recursive: true });
    writeFileSync(join(root, 'evidence/private-run/result.json'), '{}\n');
    const result = runScanner(root);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /unexpected-public-evidence/);
    assert.match(result.stdout, /evidence[/\\]private-run/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('public surface rejects a symlink using an allowlisted evidence name', () => {
  const root = mkdtempSync(join(tmpdir(), 'kdna-assets-public-surface-'));
  const external = mkdtempSync(join(tmpdir(), 'kdna-assets-external-evidence-'));
  try {
    mkdirSync(join(root, 'evidence'), { recursive: true });
    const target = join(external, 'receipt.json');
    writeFileSync(target, '{}\n');
    symlinkSync(target, join(root, 'evidence/rebuild-receipt-2026-07-17.json'));
    const result = runScanner(root);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /unexpected-public-evidence/);
    assert.match(result.stdout, /non-regular-entry/);
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(external, { recursive: true, force: true });
  }
});

function runScanner(cwd) {
  return spawnSync(process.execPath, [scanner], {
    cwd,
    encoding: 'utf8',
  });
}
