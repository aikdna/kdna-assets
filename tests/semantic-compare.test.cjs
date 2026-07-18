'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { firstDifference, semanticProjection } = require('../scripts/semantic-compare.cjs');

function fixture() {
  return {
    manifest: {
      asset_id: 'kdna:test:fixture',
      asset_uid: 'urn:uuid:00000000-0000-4000-8000-000000000001',
      asset_type: 'domain',
      title: 'Fixture Judgment',
      version: '0.1.0',
      judgment_version: '0.1.0',
      access: 'public',
      summary: 'A semantic fixture.',
    },
    payload: {
      core: {
        highest_question: 'What changes the decision?',
        axioms: [{ id: 'ax_01', one_sentence: 'Preserve meaning.', source_refs: ['source:1'] }],
        ontology: [], core_structure: [], frameworks: [], boundaries: [], stances: [],
        risk_model: { risks: [] }, aesthetics: [],
      },
      patterns: [{ type: 'failure_pattern', id: 'pt_01', one_sentence: 'Do not drop fields.' }],
      scenarios: [], cases: [],
      reasoning: {
        self_check: ['Did meaning survive?'], failure_modes: [],
        reasoning_chains: [{ id: 'rc_01', tradeoffs: ['speed'] }],
      },
      evolution: { stages: [], evolution_layers: [], measurement: [], changelog: [], version_notes: [] },
    },
  };
}

test('semantic projection ignores declared tooling lifecycle fields only', () => {
  const source = fixture();
  const candidate = structuredClone(source);
  candidate.payload.core.axioms[0].status = 'locked';
  candidate.payload.core.axioms[0].human_lock = { by: 'reviewer' };
  candidate.payload.evolution.stages.push({ id: 'tooling', source_authored: false, audit_log: [] });
  source.payload.evolution.stages.push({ id: 'tooling', source_authored: false, audit_log: [] });
  assert.equal(
    firstDifference(
      semanticProjection(source.manifest, source.payload),
      semanticProjection(candidate.manifest, candidate.payload),
    ),
    null,
  );
});

test('semantic projection detects nested provenance and relation loss', () => {
  const source = fixture();
  const candidate = structuredClone(source);
  candidate.payload.core.axioms[0].source_refs = [];
  const difference = firstDifference(
    semanticProjection(source.manifest, source.payload),
    semanticProjection(candidate.manifest, candidate.payload),
  );
  assert.equal(difference.pointer, '$.payload.core.axioms[0].source_refs.length');

  candidate.payload.core.axioms[0].source_refs = ['source:1'];
  source.payload.core.core_structure.push({ from: 'ax_01', to: 'pt_01', via: 'constrains' });
  assert.match(
    firstDifference(
      semanticProjection(source.manifest, source.payload),
      semanticProjection(candidate.manifest, candidate.payload),
    ).pointer,
    /core_structure/,
  );
});

test('semantic projection normalizes equivalent self-check and failure-mode wire shapes', () => {
  const source = fixture();
  const candidate = structuredClone(source);
  source.payload.reasoning.self_check = ['Did meaning survive?'];
  candidate.payload.reasoning.self_check = [{ question: 'Did meaning survive?' }];
  source.payload.reasoning.failure_modes = [{ id: 'fm_01', mode: 'Field loss', correct: 'Preserve fields' }];
  candidate.payload.reasoning.failure_modes = [{ id: 'fm_01', wrong: 'Field loss', correct: 'Preserve fields' }];
  assert.equal(
    firstDifference(
      semanticProjection(source.manifest, source.payload),
      semanticProjection(candidate.manifest, candidate.payload),
    ),
    null,
  );
});

test('distribution version may advance without changing authored judgment semantics', () => {
  const source = fixture();
  const candidate = structuredClone(source);
  candidate.manifest.version = '0.1.1';
  assert.equal(
    firstDifference(
      semanticProjection(source.manifest, source.payload),
      semanticProjection(candidate.manifest, candidate.payload),
    ),
    null,
  );

  candidate.manifest.judgment_version = '0.1.1';
  assert.equal(
    firstDifference(
      semanticProjection(source.manifest, source.payload),
      semanticProjection(candidate.manifest, candidate.payload),
    ).pointer,
    '$.manifest.judgment_version',
  );
});
