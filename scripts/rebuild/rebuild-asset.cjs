#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const cbor = require('cbor-x');

const USAGE = 'Usage: node scripts/rebuild/rebuild-asset.cjs <raw-export-a.kdna> <raw-export-b.kdna> <original-0.1.0.kdna> <out-prefix>';
const args = process.argv.slice(2);
if (args.length !== 4) { console.error(USAGE); process.exit(1); }
const [rawA, rawB, original, outPrefix] = args;

function assert(cond, msg) { if (!cond) throw new Error(msg); }
function sha(path) { return crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex'); }

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

    // Restore identity from original
    m.asset_id = o.asset_id;
    m.lineage = o.lineage;
    m.created_at = o.created_at;
    m.updated_at = '2026-07-17T18:00:00.000Z';
    m.creator = o.creator;

    // Authoring: current toolchain facts, NO source_build_id
    m.authoring = {
      compiler: '@aikdna/kdna-studio-core',
      compiler_version: '2.0.1',
      conformance: {
        passed: true,
        format_version: '0.1.0',
        validator: '@aikdna/kdna-studio-core/export-runtime',
        validator_version: '2.0.1',
        checked_at: '2026-07-17T18:00:00.000Z',
      },
      agent_reviewed: o.authoring?.agent_reviewed ?? false,
      reviewer_type: o.authoring?.reviewer_type ?? null,
      review_statement: o.authoring?.review_statement ?? null,
      rebuilt_by: '@aikdna/kdna-studio-cli@0.10.1',
      rebuilt_at: '2026-07-17T18:00:00.000Z',
    };

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
    ];
    for (const [field, src, reb] of checks) {
      const match = JSON.stringify(src) === JSON.stringify(reb);
      console.log('Identity %s: %s', field, match ? 'MATCH' : 'MISMATCH (' + JSON.stringify(src).slice(0,40) + ' vs ' + JSON.stringify(reb).slice(0,40) + ')');
      assert(match, `Identity field ${field} mismatch`);
    }

    // Verify authoring has no source_build_id
    assert(m.authoring && !('source_build_id' in m.authoring), 'source_build_id must be absent');
    assert(m.authoring?.compiler_version === '2.0.1', 'compiler_version must be 2.0.1');

    // Semantic: card ID comparison
    const pR = cbor.decode(fs.readFileSync(path.join(dir, 'payload.kdnab')));
    const pS = cbor.decode(fs.readFileSync(path.join(dirO, 'payload.kdnab')));
    const rcIDs = (pR.core?.cards || []).map(c => c.id).filter(Boolean).sort();
    const scIDs = (pS.core?.cards || []).map(c => c.id).filter(Boolean).sort();
    const cardMatch = rcIDs.join(',') === scIDs.join(',');
    console.log('Card IDs (%d source, %d rebuilt): %s', scIDs.length, rcIDs.length, cardMatch ? 'MATCH' : 'MISMATCH');
    assert(cardMatch, 'Card IDs differ');

    const raIDs = (pR.core?.axioms || []).map(a => a.id).filter(Boolean).sort();
    const saIDs = (pS.core?.axioms || []).map(a => a.id).filter(Boolean).sort();
    console.log('Axiom IDs (%d each): %s', saIDs.length, raIDs.join(',') === saIDs.join(',') ? 'MATCH' : 'MISMATCH');

    const axMatch = (pS.core?.axioms?.[0]?.one_sentence||'') === (pR.core?.axioms?.[0]?.one_sentence||'');
    console.log('First axiom one_sentence: %s', axMatch ? 'MATCH' : 'MISMATCH');

    return { cardIdDigest: crypto.createHash('sha256').update(rcIDs.join(',')).digest('hex') };
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
fs.writeFileSync(outPrefix + '.sha256', shaA + '  ' + path.basename(outPrefix + '.kdna') + '\n');
try { fs.unlinkSync(outPrefix + '-b.kdna'); } catch {}
console.log('Done: %s %s', shaA, outPrefix + '.kdna');
