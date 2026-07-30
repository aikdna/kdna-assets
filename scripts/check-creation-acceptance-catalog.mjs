#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

import Ajv2020 from 'ajv/dist/2020.js';

const REQUIRED_ROLES = new Set([
  'content-creator',
  'instructor',
  'graphic-designer',
  'architect',
  'writer',
  'programmer',
  'agent-authored-non-human',
  'organization-confirmed',
]);

const REQUIRED_HOSTILE_CASES = new Set([
  'hostile-historical-material-conflict',
  'hostile-current-judgment-changed',
  'hostile-client-work-misattributed',
  'hostile-all-positive-samples',
  'hostile-spoken-observed-conflict',
  'hostile-sensitive-material',
  'hostile-prompt-injection',
  'hostile-forged-confirmation',
  'hostile-post-confirmation-modification',
  'hostile-overbroad-domain',
  'hostile-slogan-collapse',
  'hostile-inapplicable-activation',
  'hostile-round-trip-loss',
]);

const HOSTILE_ORACLE = new Map([
  ['hostile-historical-material-conflict', {
    primary_disposition: 'pause',
    creation_acceptance: 'blocked',
  }],
  ['hostile-current-judgment-changed', {
    primary_disposition: 'pause',
    creation_acceptance: 'blocked',
    invalidate_receipts: true,
  }],
  ['hostile-client-work-misattributed', {
    primary_disposition: 'honest-downgrade',
    creation_acceptance: 'honest-downgrade',
  }],
  ['hostile-all-positive-samples', {
    primary_disposition: 'pause',
    creation_acceptance: 'blocked',
  }],
  ['hostile-spoken-observed-conflict', {
    primary_disposition: 'pause',
    creation_acceptance: 'blocked',
  }],
  ['hostile-sensitive-material', {
    primary_disposition: 'refuse',
    creation_acceptance: 'blocked',
    public_payload_allowed: false,
  }],
  ['hostile-prompt-injection', {
    primary_disposition: 'refuse',
    creation_acceptance: 'blocked',
    public_payload_allowed: false,
  }],
  ['hostile-forged-confirmation', {
    primary_disposition: 'refuse',
    creation_acceptance: 'blocked',
    invalidate_receipts: true,
  }],
  ['hostile-post-confirmation-modification', {
    primary_disposition: 'pause',
    creation_acceptance: 'blocked',
    invalidate_receipts: true,
  }],
  ['hostile-overbroad-domain', {
    primary_disposition: 'split',
    creation_acceptance: 'blocked',
    split_recommendation: 'required',
  }],
  ['hostile-slogan-collapse', {
    primary_disposition: 'honest-downgrade',
    creation_acceptance: 'honest-downgrade',
    invalidate_receipts: true,
  }],
  ['hostile-inapplicable-activation', {
    primary_disposition: 'refuse',
    creation_acceptance: 'blocked',
  }],
  ['hostile-round-trip-loss', {
    primary_disposition: 'refuse',
    creation_acceptance: 'blocked',
    invalidate_receipts: true,
  }],
]);

const ROLE_MODE = new Map([
  ['agent-authored-non-human', 'agent-authored'],
  ['organization-confirmed', 'organization-confirmed'],
]);

export function validateCatalog(catalog, schema) {
  const errors = [];
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  const validateSchema = ajv.compile(schema);
  if (!validateSchema(catalog)) {
    for (const error of validateSchema.errors || []) {
      errors.push(`schema${error.instancePath || '/'} ${error.message}`);
    }
    return errors;
  }

  requireExactSet(
    catalog.roles.map((fixture) => fixture.role),
    REQUIRED_ROLES,
    'roles',
    errors,
  );
  requireExactSet(
    catalog.hostile_cases.map((fixture) => fixture.id),
    REQUIRED_HOSTILE_CASES,
    'hostile cases',
    errors,
  );
  requireUnique(catalog.roles.map((fixture) => fixture.id), 'role fixture id', errors);
  requireUnique(catalog.hostile_cases.map((fixture) => fixture.id), 'hostile fixture id', errors);

  const roleIds = new Set(catalog.roles.map((fixture) => fixture.id));
  for (const fixture of catalog.roles) validateRole(fixture, errors);
  for (const fixture of catalog.hostile_cases) validateHostile(fixture, roleIds, errors);
  const comparisons = catalog.roles.flatMap((fixture) => (
    fixture.tests.filter((semanticTest) => semanticTest.kind === 'comparison')
  ));
  if (comparisons.length === 0) {
    errors.push('roles: at least one explicit with-KDNA versus without-KDNA comparison is required');
  }

  return errors;
}

export function validateCatalogFiles(
  catalogPath = 'fixtures/creation-acceptance/catalog.json',
  schemaPath = 'schemas/creation-acceptance-catalog.schema.json',
) {
  const catalog = readJson(catalogPath);
  const schema = readJson(schemaPath);
  return validateCatalog(catalog, schema);
}

function validateRole(fixture, errors) {
  const prefix = fixture.id;
  const expectedMode = ROLE_MODE.get(fixture.role) || 'human-confirmed';
  if (fixture.creation_mode !== expectedMode) {
    errors.push(`${prefix}: ${fixture.role} must use ${expectedMode} mode`);
  }

  const sourceIds = new Set(fixture.sources.map((source) => source.id));
  const candidateIds = new Set(fixture.candidates.map((candidate) => candidate.id));
  const judgmentIds = new Set(fixture.judgments.map((judgment) => judgment.id));
  const boundaryIds = new Set(fixture.purpose.boundaries.map((boundary) => boundary.id));
  requireUnique([...sourceIds], `${prefix} source id`, errors, fixture.sources.length);
  requireUnique([...candidateIds], `${prefix} candidate id`, errors, fixture.candidates.length);
  requireUnique([...judgmentIds], `${prefix} judgment id`, errors, fixture.judgments.length);
  requireUnique([...boundaryIds], `${prefix} boundary id`, errors, fixture.purpose.boundaries.length);
  requireUnique(
    fixture.relations.map((relation) => relation.id),
    `${prefix} relation id`,
    errors,
  );
  requireUnique(
    fixture.confirmation.receipts.map((receipt) => receipt.id),
    `${prefix} receipt id`,
    errors,
  );
  requireUnique(fixture.tests.map((test) => test.id), `${prefix} test id`, errors);

  for (const source of fixture.sources) {
    const computed = createHash('sha256')
      .update(Buffer.from(source.fixture_material, 'utf8'))
      .digest('hex');
    if (source.content_digest.value !== computed) {
      errors.push(
        `${prefix}/${source.id}: content_digest does not match exact UTF-8 fixture_material bytes`,
      );
    }
  }

  for (const candidate of fixture.candidates) {
    requireRefs(candidate.source_refs, sourceIds, `${prefix}/${candidate.id} source`, errors);
    if ((candidate.origin === 'agent-inference') !== candidate.agent_inference) {
      errors.push(
        `${prefix}/${candidate.id}: origin and agent_inference must label Agent inference consistently`,
      );
    }
  }

  for (const judgment of fixture.judgments) {
    if (!candidateIds.has(judgment.candidate_ref)) {
      errors.push(`${prefix}/${judgment.id}: unknown candidate_ref ${judgment.candidate_ref}`);
    }
    requireRefs(judgment.source_refs, sourceIds, `${prefix}/${judgment.id} source`, errors);
  }

  for (const relation of fixture.relations) {
    if (!judgmentIds.has(relation.from)) {
      errors.push(`${prefix}/${relation.id}: unknown from judgment ${relation.from}`);
    }
    if (!judgmentIds.has(relation.to)) {
      errors.push(`${prefix}/${relation.id}: unknown to judgment ${relation.to}`);
    }
    if (relation.from === relation.to) {
      errors.push(`${prefix}/${relation.id}: relation cannot point to itself`);
    }
  }

  for (const test of fixture.tests) {
    requireRefs(test.judgment_refs, judgmentIds, `${prefix}/${test.id} judgment`, errors);
    requireRefs(test.boundary_refs, boundaryIds, `${prefix}/${test.id} boundary`, errors);
    if (test.judgment_refs.length === 0 && test.boundary_refs.length === 0) {
      errors.push(`${prefix}/${test.id}: test must reference a judgment or boundary`);
    }
    if (test.kind === 'comparison') {
      const lanes = test.comparison_lanes;
      if (
        lanes.without_kdna.task !== lanes.with_kdna.task ||
        lanes.with_kdna.task !== test.prompt
      ) {
        errors.push(`${prefix}/${test.id}: comparison lanes must use identical task input`);
      }
    } else if (test.comparison_lanes !== undefined) {
      errors.push(`${prefix}/${test.id}: only comparison tests may declare comparison lanes`);
    }
  }

  for (const judgment of fixture.judgments) {
    for (const kind of ['applicable', 'counterexample']) {
      const covered = fixture.tests.some(
        (test) => test.kind === kind && test.judgment_refs.includes(judgment.id),
      );
      if (!covered) errors.push(`${prefix}/${judgment.id}: missing ${kind} test`);
    }
  }
  for (const boundary of fixture.purpose.boundaries) {
    const covered = fixture.tests.some(
      (test) => test.kind === 'global-boundary' && test.boundary_refs.includes(boundary.id),
    );
    if (!covered) errors.push(`${prefix}/${boundary.id}: missing global-boundary test`);
  }
  if (!fixture.tests.some((test) => test.kind === 'held-out-real-task')) {
    errors.push(`${prefix}: missing held-out-real-task test`);
  }

  if (fixture.creation_mode === 'agent-authored') {
    if (fixture.confirmation.required) {
      errors.push(`${prefix}: agent-authored mode cannot require human confirmation`);
    }
    if (fixture.confirmation.receipts.length !== 0) {
      errors.push(`${prefix}: agent-authored mode cannot synthesize a human receipt`);
    }
    if (!fixture.confirmation.absence_reason) {
      errors.push(`${prefix}: agent-authored mode must state why no receipt exists`);
    }
    for (const judgment of fixture.judgments) {
      if (judgment.confirmation_state !== 'not-required-agent-authored') {
        errors.push(`${prefix}/${judgment.id}: invalid agent-authored confirmation state`);
      }
    }
  } else {
    if (!fixture.confirmation.required || fixture.confirmation.receipts.length === 0) {
      errors.push(`${prefix}: representational mode requires a synthetic fixture receipt`);
    }
    for (const receipt of fixture.confirmation.receipts) {
      if (receipt.subject_ref !== fixture.purpose.represented_subject) {
        errors.push(`${prefix}/${receipt.id}: receipt subject does not match represented subject`);
      }
      if (receipt.receipt_authority !== 'synthetic_fixture_authority') {
        errors.push(`${prefix}/${receipt.id}: receipt is not synthetic fixture authority`);
      }
      if (receipt.external_evidence !== false || receipt.fixture_only !== true) {
        errors.push(`${prefix}/${receipt.id}: receipt cannot be real-world evidence`);
      }
    }
    if (
      !fixture.confirmation.receipts.some(
        (receipt) => receipt.confirmer_ref === fixture.confirmation.acceptance_actor,
      )
    ) {
      errors.push(`${prefix}: acceptance actor is not a synthetic receipt confirmer`);
    }
    for (const judgment of fixture.judgments) {
      if (judgment.confirmation_state !== 'synthetic-fixture-confirmed') {
        errors.push(`${prefix}/${judgment.id}: representational fixture lacks fixture confirmation`);
      }
    }
  }

  if (
    fixture.expected.creation_acceptance.external_claim_permitted ||
    fixture.expected.format_validity !== 'not-evaluated' ||
    fixture.expected.runtime_consistency !== 'not-evaluated'
  ) {
    errors.push(`${prefix}: fixture expectation exceeds its static authority boundary`);
  }
}

function validateHostile(fixture, roleIds, errors) {
  const prefix = fixture.id;
  if (!roleIds.has(fixture.input.baseline_role)) {
    errors.push(`${prefix}: unknown baseline role ${fixture.input.baseline_role}`);
  }
  const oracle = HOSTILE_ORACLE.get(fixture.id);
  if (!oracle) {
    errors.push(`${prefix}: no static hostile oracle`);
    return;
  }
  for (const [field, expected] of Object.entries(oracle)) {
    if (fixture.expected[field] !== expected) {
      errors.push(`${prefix}: expected ${field}=${JSON.stringify(expected)}`);
    }
  }
  if (!['refuse', 'pause', 'split', 'honest-downgrade'].includes(
    fixture.expected.primary_disposition,
  )) {
    errors.push(`${prefix}: hostile case lacks an explicit safe disposition`);
  }
  if (fixture.expected.required_actions.length === 0) {
    errors.push(`${prefix}: hostile case has no required recovery action`);
  }
  if (fixture.expected.prohibited_claims.length === 0) {
    errors.push(`${prefix}: hostile case has no prohibited claim`);
  }
  if (fixture.id === 'hostile-forged-confirmation') {
    const requiredConditions = [
      'Both synthetic hostile receipts bind the correct current semantic digest.',
      'One receipt supplies a declared organization authority but names a different organization subject.',
      'One receipt names the represented organization subject but omits the actor\'s declared authority.',
    ];
    for (const condition of requiredConditions) {
      if (!fixture.input.material_conditions.includes(condition)) {
        errors.push(`${prefix}: missing isolated binding condition ${condition}`);
      }
    }
    if (!fixture.expected.prohibited_claims.some(
      (claim) => claim.includes('external Host identity assurance'),
    )) {
      errors.push(`${prefix}: fixture must disclaim external Host identity assurance`);
    }
  }
}

function requireExactSet(actualValues, expectedValues, label, errors) {
  const actual = new Set(actualValues);
  requireUnique(actualValues, label, errors);
  for (const value of expectedValues) {
    if (!actual.has(value)) errors.push(`${label}: missing ${value}`);
  }
  for (const value of actual) {
    if (!expectedValues.has(value)) errors.push(`${label}: unexpected ${value}`);
  }
}

function requireUnique(values, label, errors, originalLength = values.length) {
  if (new Set(values).size !== originalLength) errors.push(`${label}: duplicate value`);
}

function requireRefs(refs, known, label, errors) {
  for (const ref of refs) {
    if (!known.has(ref)) errors.push(`${label}: unknown reference ${ref}`);
  }
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function run() {
  const errors = validateCatalogFiles(process.argv[2], process.argv[3]);
  if (errors.length > 0) {
    console.error(`Creation acceptance fixture catalog: FAIL (${errors.length} error(s))`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }
  console.log('Creation acceptance fixture catalog: PASS');
  console.log(`  roles:         ${REQUIRED_ROLES.size}`);
  console.log(`  hostile cases: ${REQUIRED_HOSTILE_CASES.size}`);
  console.log('  authority:     static synthetic fixture contract only');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) run();
