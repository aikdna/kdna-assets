import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { missingRequirements } from '../scripts/ci-leg-receipt.mjs';
import { registryOf } from '../scripts/verify-ci-leg-receipts.mjs';

// The gate must not invent a condition of its own. The retired
// `exact_semver_kdna_cli_pin` spelling requirement was one: it was not read by
// scripts/audit-public-metadata.py or scripts/check-release-consistency.mjs and
// it would have kept both metadata legs at not_run forever. The pin is now
// checked as a coordinate, and a satisfied index produces no code at all.

const root = resolve(import.meta.dirname, '..');
const ENVIRONMENT = { KDNA_ASSETS_METADATA_INDEX: 'index.json', KDNA_ASSETS_METADATA_PACKAGE: 'package.json' };
const COMMITTED_PIN = 'file:vendor/aikdna-kdna-cli-0.38.0-rc.component-semantics.1.tgz';
const INTEGRITY = 'sha512-' + 'A'.repeat(86) + '==';

function sandbox({ pin = COMMITTED_PIN, index, lock } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'assets-pin-policy-'));
  mkdirSync(join(dir, 'vendor'), { recursive: true });
  cpSync(join(root, 'vendor', 'aikdna-kdna-cli-0.38.0-rc.component-semantics.1.tgz'), join(dir, 'vendor', 'aikdna-kdna-cli-0.38.0-rc.component-semantics.1.tgz'));
  writeFileSync(
    join(dir, 'index.json'),
    `${JSON.stringify(index ?? { schema_version: '2.0.0', assets: [{ id: 'a' }], clusters: [] }, null, 2)}\n`,
  );
  writeFileSync(
    join(dir, 'package.json'),
    `${JSON.stringify({ name: 'probe', devDependencies: pin === null ? {} : { '@aikdna/kdna-cli': pin } }, null, 2)}\n`,
  );
  writeFileSync(
    join(dir, 'package-lock.json'),
    `${JSON.stringify(lock ?? { packages: { 'node_modules/@aikdna/kdna-cli': { resolved: pin, integrity: INTEGRITY } } }, null, 2)}\n`,
  );
  return dir;
}

function codesFor(options) {
  const dir = sandbox(options);
  try {
    return missingRequirements(ENVIRONMENT, dir).codes;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const SATISFIED_INDEX = {
  schema_version: '1.0.0',
  assets: [{ id: 'a', technical_status: 'published', download: { url: 'https://example.invalid/a.kdna' } }],
  clusters: [],
};

test('the committed graph has no unavailability code for the CLI pin', () => {
  const committed = missingRequirements(
    { KDNA_ASSETS_METADATA_INDEX: 'index/current.json', KDNA_ASSETS_METADATA_PACKAGE: 'package.json' },
    root,
  );
  assert.deepEqual(committed.codes, [
    'index_schema_version',
    'entries_without_technical_status',
    'entries_without_download_url',
  ]);
  assert.ok(!committed.codes.includes('exact_semver_kdna_cli_pin'));
});

test('a checkable pin - exact SemVer or integrity-locked file: - produces no code', () => {
  assert.deepEqual(codesFor({ pin: '0.38.0', index: SATISFIED_INDEX }), []);
  assert.deepEqual(codesFor({ index: SATISFIED_INDEX }), []);
  assert.deepEqual(codesFor({ pin: null, index: SATISFIED_INDEX }), []);
});

test('an uncheckable pin produces the coordinate code instead of a spelling code', () => {
  for (const pin of ['^0.38.0', '~0.38.0', '*', 'latest', '0.38.x', '']) {
    assert.deepEqual(
      codesFor({ pin, index: SATISFIED_INDEX }),
      ['kdna_cli_pin_not_checkable'],
      `pin ${JSON.stringify(pin)} must be reported as an uncheckable coordinate`,
    );
  }
  assert.deepEqual(codesFor({ pin: 'file:vendor/absent.tgz', index: SATISFIED_INDEX }), ['kdna_cli_pin_not_checkable']);
  assert.deepEqual(
    codesFor({ index: SATISFIED_INDEX, lock: { packages: { 'node_modules/@aikdna/kdna-cli': { resolved: COMMITTED_PIN } } } }),
    ['kdna_cli_pin_not_checkable'],
  );
  assert.deepEqual(
    codesFor({ index: SATISFIED_INDEX, lock: { packages: { 'node_modules/@aikdna/kdna-cli': { resolved: COMMITTED_PIN, integrity: 'sha512-AAA' } } } }),
    ['kdna_cli_pin_not_checkable'],
  );
});

test('a committed index that satisfies the retired schema takes every metadata leg off not_run', () => {
  assert.deepEqual(missingRequirements({ ...ENVIRONMENT, KDNA_ASSETS_METADATA_INDEX: 'index.json' }, sandbox({ index: SATISFIED_INDEX })), {
    codes: [],
    detail: [],
    entries: 1,
  });
});

test('the registry only names codes this gate can compute', () => {
  const allowed = new Set([
    'index_schema_version',
    'entries_without_technical_status',
    'entries_without_download_url',
    'kdna_cli_pin_not_checkable',
    'installed_core_rejects_indexed_assets',
    'installed_core_admission_entry_unavailable',
  ]);
  for (const entry of registryOf(root).entries) {
    for (const code of entry.unavailable_codes) {
      assert.ok(allowed.has(code), `${entry.leg} registers ${code}, which the gate cannot compute`);
      assert.notEqual(code, 'exact_semver_kdna_cli_pin');
    }
  }
});

test('the committed registry still carries a trigger and an expiry for every leg', () => {
  const entries = registryOf(root).entries;
  assert.equal(entries.length, 3);
  for (const entry of entries) {
    assert.ok(entry.trigger, `${entry.leg} needs a trigger`);
    assert.match(entry.review_by, /^\d{4}-\d{2}-\d{2}$/u, `${entry.leg} needs an expiry`);
    assert.ok(entry.review_by >= new Date().toISOString().slice(0, 10), `${entry.leg} registration is expired`);
  }
  assert.equal(JSON.parse(readFileSync(join(root, 'fixtures', 'ci-leg-registry.json'), 'utf8')).entries.length, 3);
});
