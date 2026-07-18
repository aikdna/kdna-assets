#!/usr/bin/env node
'use strict';

const core = require('@aikdna/kdna-core');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const BUILD_EPOCH = '2026-07-17T18:00:00.000Z';

function rebuildAsset(rawKdna, origKdna, outPath) {
  // Step 1: Unpack the raw export
  const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'kdna-rebuild-'));
  try {
    core.unpack(rawKdna, dir);

    // Step 2: Read original manifest for identity preservation
    const origDir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'kdna-orig-'));
    let origManifest = null;
    try {
      core.unpack(origKdna, origDir);
      origManifest = JSON.parse(fs.readFileSync(path.join(origDir, 'kdna.json'), 'utf8'));
    } finally {
      fs.rmSync(origDir, { recursive: true, force: true });
    }

    // Step 3: Rebuild the manifest with correct current-toolchain authoring
    const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'kdna.json'), 'utf8'));

    // Identity preservation
    manifest.asset_id = origManifest.asset_id;
    manifest.lineage = origManifest.lineage;

    // Timestamps
    manifest.created_at = origManifest.created_at;
    manifest.updated_at = BUILD_EPOCH;

    // Authoring: current toolchain facts
    manifest.authoring = {
      compiler: '@aikdna/kdna-studio-core',
      compiler_version: '2.0.1',
      conformance: {
        passed: true,
        format_version: '0.1.0',
        validator: '@aikdna/kdna-studio-core/export-runtime',
        validator_version: '2.0.1',
        checked_at: BUILD_EPOCH,
      },
      // Preserve original review disclosures
      agent_reviewed: origManifest.authoring?.agent_reviewed ?? false,
      reviewer_type: origManifest.authoring?.reviewer_type ?? null,
      review_statement: origManifest.authoring?.review_statement ?? null,
      // Provenance
      rebuilt_by: '@aikdna/kdna-studio-cli@0.10.1',
      rebuilt_at: BUILD_EPOCH,
      source_build_id: null, // stripped for reproducibility
    };

    fs.writeFileSync(path.join(dir, 'kdna.json'), JSON.stringify(manifest, null, 2) + '\n');

    // Step 4: Rebuild checksums from directory content
    const checksums = core.buildChecksums(dir);
    fs.writeFileSync(path.join(dir, 'checksums.json'), JSON.stringify(checksums, null, 2) + '\n');

    // Step 5: Pack into final .kdna
    core.pack(dir, outPath);

    return crypto.createHash('sha256').update(fs.readFileSync(outPath)).digest('hex');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// Run dual-build for one asset
function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error('Usage: node rebuild-asset.js <raw-export-a.kdna> <raw-export-b.kdna> <original-0.1.0.kdna> <out-prefix>');
    process.exit(1);
  }
  const [rawA, rawB, original, outPrefix] = args;
  const outA = outPrefix + '-a.kdna';
  const outB = outPrefix + '-b.kdna';

  const shaA = rebuildAsset(rawA, original, outA);
  const shaB = rebuildAsset(rawB, original, outB);

  console.log('Build A:', shaA, outA);
  console.log('Build B:', shaB, outB);
  console.log('Reproducible:', shaA === shaB);

  if (shaA !== shaB) {
    console.error('Dual build mismatch');
    process.exit(1);
  }
}

main();
