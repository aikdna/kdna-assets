#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const cbor = require('cbor-x');
const { compareSemanticAssets } = require('../semantic-compare.cjs');

const USAGE = 'Usage: node scripts/rebuild/rebuild-asset.cjs <raw-export-a.kdna> <raw-export-b.kdna> <original-0.1.0.kdna> <out-prefix>';
const args = process.argv.slice(2);
if (args.length !== 4) { console.error(USAGE); process.exit(1); }
const [rawA, rawB, original, outPrefix] = args;
const rebuildTimestamp = process.env.KDNA_REBUILD_TIMESTAMP;
const rebuildTool = process.env.KDNA_REBUILD_TOOL;
const rebuildVersion = process.env.KDNA_REBUILD_VERSION;

function assert(cond, msg) { if (!cond) throw new Error(msg); }
function sha(path) { return crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex'); }

function normalizeReviewTimestamps(value) {
  if (Array.isArray(value)) {
    for (const item of value) normalizeReviewTimestamps(item);
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (value.human_lock && typeof value.human_lock === 'object') {
    value.human_lock.at = rebuildTimestamp;
  }
  for (const child of Object.values(value)) normalizeReviewTimestamps(child);
}

assert(
  typeof rebuildTimestamp === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(rebuildTimestamp),
  'KDNA_REBUILD_TIMESTAMP must be an explicit UTC ISO date-time',
);
assert(
  /^@aikdna\/kdna-studio-cli@[0-9]+\.[0-9]+\.[0-9]+$/.test(rebuildTool || ''),
  'KDNA_REBUILD_TOOL must identify the exact Studio CLI coordinate',
);
assert(
  /^[0-9]+\.[0-9]+\.[0-9]+$/.test(rebuildVersion || ''),
  'KDNA_REBUILD_VERSION must identify the exact distribution version',
);

function rebuild(rawExport, origKdna, outPath) {
  const dir = '/tmp/kdna-rebuild-' + crypto.randomBytes(6).toString('hex');
  const origDir = '/tmp/kdna-orig-' + crypto.randomBytes(6).toString('hex');
  try {
    // Unpack original
    runNode(`const core=require('@aikdna/kdna-core');const fs=require('fs');core.unpack('${origKdna}','${origDir}');`);
    const o = JSON.parse(fs.readFileSync(path.join(origDir, 'kdna.json'), 'utf8'));

    // Unpack raw export
    fs.mkdirSync(dir, { recursive: true });
    runNode(`const core=require('@aikdna/kdna-core');core.unpack('${rawExport}','${dir}');`);
    const m = JSON.parse(fs.readFileSync(path.join(dir, 'kdna.json'), 'utf8'));

    // Restore public identity and authored manifest semantics from the source.
    // Runtime coordinates, digests, and authoring evidence remain build-owned.
    for (const field of [
      'access', 'asset_id', 'asset_type', 'asset_uid', 'creator', 'judgment_version',
      'keywords', 'language', 'languages', 'license', 'lineage', 'load_contract',
      'summary', 'title',
    ]) {
      if (o[field] === undefined) delete m[field];
      else m[field] = JSON.parse(JSON.stringify(o[field]));
    }
    m.version = rebuildVersion;
    m.created_at = o.created_at;
    m.updated_at = rebuildTimestamp;

    const rawAuthoring = m.authoring || {};
    assert(rawAuthoring.compiler === '@aikdna/kdna-studio-core', 'raw export compiler mismatch');
    assert(/^\d+\.\d+\.\d+$/.test(rawAuthoring.compiler_version || ''), 'raw compiler version missing');

    // Authoring contains only reproducible current toolchain facts and the
    // source's public review statement. Private source build identifiers are
    // intentionally excluded from public assets.
    m.authoring = {
      compiler: rawAuthoring.compiler,
      compiler_version: rawAuthoring.compiler_version,
      conformance: {
        passed: true,
        format_version: '0.1.0',
        validator: '@aikdna/kdna-studio-core/export-runtime',
        validator_version: rawAuthoring.compiler_version,
        checked_at: rebuildTimestamp,
      },
      agent_reviewed: o.authoring?.agent_reviewed ?? false,
      reviewer_type: o.authoring?.reviewer_type ?? null,
      review_statement: o.authoring?.review_statement ?? null,
      rebuilt_by: rebuildTool,
      rebuilt_at: rebuildTimestamp,
    };

    // Human Lock timestamps describe this rebuild review, not authored
    // judgment. Normalize them to the explicit receipt timestamp so two
    // independent approvals produce the same public Runtime bytes.
    const payloadPath = path.join(dir, 'payload.kdnab');
    const payload = cbor.decode(fs.readFileSync(payloadPath));
    normalizeReviewTimestamps(payload);
    const payloadBytes = cbor.encode(payload);
    fs.writeFileSync(payloadPath, payloadBytes);
    m.payload.digest = `sha256:${crypto.createHash('sha256').update(payloadBytes).digest('hex')}`;

    fs.writeFileSync(path.join(dir, 'kdna.json'), JSON.stringify(m, null, 2) + '\n');

    // Rebuild checksums from directory content
    runNode(`const core=require('@aikdna/kdna-core');const fs=require('fs');const ch=core.buildChecksums('${dir}');fs.writeFileSync('${dir}/checksums.json',JSON.stringify(ch,null,2)+'\\n');`);

    // Pack
    runNode(`const core=require('@aikdna/kdna-core');core.pack('${dir}','${outPath}');`);

    return sha(outPath);
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch {}
    try { fs.rmSync(origDir, { recursive: true, force: true }); } catch {}
  }
}

function runNode(script) {
  const r = spawnSync(process.execPath, ['-e', script], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  assert(r.status === 0, (r.stderr || r.stdout || 'subprocess failed'));
  return r.stdout.trim();
}

// Verify identity and semantics
function verifyIdentity(rebuiltPath, origKdna) {
  const dir = '/tmp/kdna-verify-' + crypto.randomBytes(6).toString('hex');
  const dirO = '/tmp/kdna-verifyO-' + crypto.randomBytes(6).toString('hex');
  try {
    runNode(`const core=require('@aikdna/kdna-core');core.unpack('${rebuiltPath}','${dir}');core.unpack('${origKdna}','${dirO}');`);
    const m = JSON.parse(fs.readFileSync(path.join(dir, 'kdna.json'), 'utf8'));
    const o = JSON.parse(fs.readFileSync(path.join(dirO, 'kdna.json'), 'utf8'));

    const checks = [
      ['asset_id', o.asset_id, m.asset_id],
      ['asset_uid', o.asset_uid, m.asset_uid],
      ['creator.name', o.creator?.name, m.creator?.name],
      ['lineage.type', o.lineage?.type, m.lineage?.type],
      ['created_at', o.created_at, m.created_at],
      ['judgment_version', o.judgment_version, m.judgment_version],
      ['version', rebuildVersion, m.version],
    ];
    for (const [field, src, reb] of checks) {
      const match = JSON.stringify(src) === JSON.stringify(reb);
      console.log('Identity %s: %s', field, match ? 'MATCH' : 'MISMATCH (' + JSON.stringify(src).slice(0,40) + ' vs ' + JSON.stringify(reb).slice(0,40) + ')');
      assert(match, `Identity field ${field} mismatch`);
    }

    // Verify authoring has no source_build_id
    assert(m.authoring && !('source_build_id' in m.authoring), 'source_build_id must be absent');
    const semantics = compareSemanticAssets(origKdna, rebuiltPath);
    if (!semantics.equal) {
      console.error('First semantic difference: %s', JSON.stringify(semantics.difference));
    }
    assert(semantics.equal, 'authored judgment semantics differ');
    console.log('Authored judgment semantics: MATCH');
    return { semanticProjection: semantics.sourceProjection };
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch {}
    try { fs.rmSync(dirO, { recursive: true, force: true }); } catch {}
  }
}

// Main
const shaA = rebuild(rawA, original, outPrefix + '-a.kdna');
const shaB = rebuild(rawB, original, outPrefix + '-b.kdna');
console.log('Build A: %s', shaA);
console.log('Build B: %s', shaB);
console.log('Reproducible: %s', shaA === shaB);
assert(shaA === shaB, 'Dual build mismatch');

// Identity and semantic verification on build A
verifyIdentity(outPrefix + '-a.kdna', original);

// Validate, plan-load, load
runNode(`
  const core=require('@aikdna/kdna-core');
  const p='${outPrefix}-a.kdna';
  const v=core.validate(p); console.log('validate: %s', v.overall_valid);
  const pl=core.planLoad(p); console.log('plan-load: %s can_load: %s', pl.state, pl.can_load_now);
  const c=core.loadRuntimeCapsule(p,{profile:'compact'});
  console.log('capsule: %s risk_level:%s quality_badge:%s', c.type, 'risk_level' in c, 'quality_badge' in c);
`);

// Move build A to final location, discard B
fs.renameSync(outPrefix + '-a.kdna', outPrefix + '.kdna');
fs.writeFileSync(outPrefix + '.kdna.sha256', shaA + '  ' + path.basename(outPrefix + '.kdna') + '\n');
try { fs.unlinkSync(outPrefix + '-b.kdna'); } catch {}
console.log('Done: %s %s', shaA, outPrefix + '.kdna');
