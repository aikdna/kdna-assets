import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { validateCatalog } from '../scripts/check-creation-acceptance-catalog.mjs';

const catalog = readJson(new URL('../fixtures/creation-acceptance/catalog.json', import.meta.url));
const schema = readJson(new URL('../schemas/creation-acceptance-catalog.schema.json', import.meta.url));

test('complete static catalog passes schema and semantic invariants', () => {
  assert.deepEqual(validateCatalog(catalog, schema), []);
});

test('schema rejects an incomplete role purpose', () => {
  const candidate = copyCatalog();
  delete candidate.roles[0].purpose.scope;
  expectInvalid(candidate, 'schema/roles/0/purpose');
});

test('schema rejects a receipt that claims real authority', () => {
  const candidate = copyCatalog();
  candidate.roles[0].confirmation.receipts[0].receipt_authority = 'real-human';
  expectInvalid(candidate, 'receipt_authority');
});

test('schema rejects external acceptance authority', () => {
  const candidate = copyCatalog();
  candidate.roles[0].expected.creation_acceptance.external_claim_permitted = true;
  expectInvalid(candidate, 'external_claim_permitted');
});

test('semantic gate rejects a human receipt on an Agent-authored fixture', () => {
  const candidate = copyCatalog();
  const agent = candidate.roles.find((fixture) => fixture.role === 'agent-authored-non-human');
  const human = candidate.roles.find((fixture) => fixture.role === 'content-creator');
  agent.confirmation.receipts.push(structuredClone(human.confirmation.receipts[0]));
  expectInvalid(candidate, 'agent-authored mode cannot synthesize a human receipt');
});

test('semantic gate requires applicable and counterexample coverage for every core judgment', () => {
  const candidate = copyCatalog();
  const role = candidate.roles[0];
  for (const semanticTest of role.tests) {
    if (semanticTest.kind === 'counterexample') semanticTest.judgment_refs = [];
  }
  expectInvalid(candidate, 'missing counterexample test');
});

test('semantic gate rejects a dangling source reference', () => {
  const candidate = copyCatalog();
  candidate.roles[0].candidates[0].source_refs = ['source-does-not-exist'];
  expectInvalid(candidate, 'unknown reference source-does-not-exist');
});

test('semantic gate recomputes source digests from exact UTF-8 fixture material', () => {
  const candidate = copyCatalog();
  candidate.roles[0].sources[0].fixture_material += ' Changed after hashing.';
  expectInvalid(candidate, 'content_digest does not match exact UTF-8 fixture_material bytes');
});

test('semantic gate rejects a receipt for the wrong represented subject', () => {
  const candidate = copyCatalog();
  candidate.roles[0].confirmation.receipts[0].subject_ref = 'synthetic-human-different-subject';
  expectInvalid(candidate, 'receipt subject does not match represented subject');
});

test('catalog cannot omit a required hostile case', () => {
  const candidate = copyCatalog();
  candidate.hostile_cases.pop();
  expectInvalid(candidate, 'schema/hostile_cases');
});

test('hostile oracle rejects an unsafe disposition', () => {
  const candidate = copyCatalog();
  const hostile = candidate.hostile_cases.find(
    (fixture) => fixture.id === 'hostile-forged-confirmation',
  );
  hostile.expected.primary_disposition = 'pause';
  expectInvalid(candidate, 'expected primary_disposition="refuse"');
});

test('forged confirmation variants isolate current-digest binding failures', () => {
  const candidate = copyCatalog();
  const hostile = candidate.hostile_cases.find(
    (fixture) => fixture.id === 'hostile-forged-confirmation',
  );
  hostile.input.material_conditions = hostile.input.material_conditions.filter(
    (condition) => !condition.includes('omits the actor'),
  );
  expectInvalid(candidate, 'missing isolated binding condition');
});

test('hostile cases must reference a cataloged baseline role', () => {
  const candidate = copyCatalog();
  candidate.hostile_cases[0].input.baseline_role = 'role-unknown';
  expectInvalid(candidate, 'unknown baseline role role-unknown');
});

test('comparison lanes must keep task input identical', () => {
  const candidate = copyCatalog();
  const comparison = candidate.roles
    .flatMap((fixture) => fixture.tests)
    .find((semanticTest) => semanticTest.kind === 'comparison');
  comparison.comparison_lanes.without_kdna.task = 'A different task input.';
  expectInvalid(candidate, 'comparison lanes must use identical task input');
});

function copyCatalog() {
  return structuredClone(catalog);
}

function expectInvalid(candidate, expectedFragment) {
  const errors = validateCatalog(candidate, schema);
  assert.ok(errors.length > 0, 'mutated catalog unexpectedly passed');
  assert.ok(
    errors.some((error) => error.includes(expectedFragment)),
    `expected error containing ${JSON.stringify(expectedFragment)}, received:\n${errors.join('\n')}`,
  );
}

function readJson(url) {
  return JSON.parse(readFileSync(url, 'utf8'));
}
