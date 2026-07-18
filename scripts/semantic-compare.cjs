#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const cbor = require('cbor-x');
const core = require('@aikdna/kdna-core');

const TOOLING_FIELDS = new Set([
  'audit_log',
  'human_lock',
  'legacy_subtype',
  'locked',
  'source_authored',
  'status',
]);

function stripTooling(value) {
  if (Array.isArray(value)) return value.map(stripTooling);
  if (!value || typeof value !== 'object') return value;
  const result = {};
  for (const key of Object.keys(value).sort()) {
    if (TOOLING_FIELDS.has(key) || value[key] === undefined) continue;
    result[key] = stripTooling(value[key]);
  }
  return result;
}

function normalizeSelfCheck(value) {
  if (typeof value === 'string') return value;
  const normalized = stripTooling(value);
  return Object.keys(normalized).length === 1 && typeof normalized.question === 'string'
    ? normalized.question
    : normalized;
}

function normalizeFailureMode(value) {
  const normalized = stripTooling(value);
  const wrong = normalized.wrong ?? normalized.mode;
  delete normalized.mode;
  if (wrong !== undefined) normalized.wrong = wrong;
  return stripTooling(normalized);
}

function semanticManifest(manifest) {
  const fields = [
    'access', 'asset_id', 'asset_type', 'asset_uid', 'creator', 'judgment_version',
    'keywords', 'language', 'languages', 'license', 'lineage', 'load_contract',
    'summary', 'title',
  ];
  const result = {};
  for (const field of fields) {
    if (manifest[field] !== undefined) result[field] = stripTooling(manifest[field]);
  }
  return result;
}

function semanticPayload(payload) {
  const corePayload = payload?.core || {};
  const riskModel = Array.isArray(corePayload.risk_model)
    ? { risks: corePayload.risk_model }
    : (corePayload.risk_model || { risks: [] });
  const reasoning = payload?.reasoning || {};
  const evolution = payload?.evolution || {};

  return stripTooling({
    core: {
      highest_question: corePayload.highest_question,
      ...(corePayload.worldview !== undefined ? { worldview: corePayload.worldview } : {}),
      ...(corePayload.value_order !== undefined ? { value_order: corePayload.value_order } : {}),
      ...(corePayload.judgment_role !== undefined ? { judgment_role: corePayload.judgment_role } : {}),
      axioms: corePayload.axioms || [],
      ontology: corePayload.ontology || [],
      core_structure: corePayload.core_structure || [],
      frameworks: corePayload.frameworks || [],
      boundaries: corePayload.boundaries || [],
      stances: corePayload.stances || [],
      risk_model: riskModel,
      aesthetics: corePayload.aesthetics || [],
    },
    patterns: payload?.patterns || [],
    scenarios: payload?.scenarios || [],
    cases: payload?.cases || [],
    reasoning: {
      self_check: (reasoning.self_check || []).map(normalizeSelfCheck),
      failure_modes: (reasoning.failure_modes || []).map(normalizeFailureMode),
      reasoning_chains: reasoning.reasoning_chains || [],
    },
    evolution: {
      stages: evolution.stages || [],
      evolution_layers: evolution.evolution_layers || [],
      measurement: evolution.measurement || [],
      changelog: evolution.changelog || [],
      version_notes: evolution.version_notes || [],
    },
  });
}

function semanticProjection(manifest, payload) {
  return {
    manifest: semanticManifest(manifest || {}),
    payload: semanticPayload(payload || {}),
  };
}

function firstDifference(left, right, pointer = '$') {
  if (Object.is(left, right)) return null;
  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right)) return { pointer, left, right };
    if (left.length !== right.length) {
      return { pointer: `${pointer}.length`, left: left.length, right: right.length };
    }
    for (let index = 0; index < left.length; index += 1) {
      const difference = firstDifference(left[index], right[index], `${pointer}[${index}]`);
      if (difference) return difference;
    }
    return null;
  }
  if (left && right && typeof left === 'object' && typeof right === 'object') {
    const keys = [...new Set([...Object.keys(left), ...Object.keys(right)])].sort();
    for (const key of keys) {
      if (!Object.hasOwn(left, key) || !Object.hasOwn(right, key)) {
        return { pointer: `${pointer}.${key}`, left: left[key], right: right[key] };
      }
      const difference = firstDifference(left[key], right[key], `${pointer}.${key}`);
      if (difference) return difference;
    }
    return null;
  }
  return { pointer, left, right };
}

function readAsset(assetPath) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'kdna-semantic-'));
  try {
    core.unpack(path.resolve(assetPath), directory);
    return {
      manifest: JSON.parse(fs.readFileSync(path.join(directory, 'kdna.json'), 'utf8')),
      payload: cbor.decode(fs.readFileSync(path.join(directory, 'payload.kdnab'))),
    };
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

function compareSemanticAssets(sourcePath, candidatePath) {
  const source = readAsset(sourcePath);
  const candidate = readAsset(candidatePath);
  const sourceProjection = semanticProjection(source.manifest, source.payload);
  const candidateProjection = semanticProjection(candidate.manifest, candidate.payload);
  const difference = firstDifference(sourceProjection, candidateProjection);
  return { equal: difference === null, difference, sourceProjection, candidateProjection };
}

module.exports = {
  compareSemanticAssets,
  firstDifference,
  semanticProjection,
};

if (require.main === module) {
  const [sourcePath, candidatePath] = process.argv.slice(2);
  if (!sourcePath || !candidatePath) {
    console.error('Usage: node scripts/semantic-compare.cjs <source.kdna> <candidate.kdna>');
    process.exit(2);
  }
  const result = compareSemanticAssets(sourcePath, candidatePath);
  if (!result.equal) {
    console.error(JSON.stringify({ equal: false, first_difference: result.difference }, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({ equal: true }, null, 2));
}
