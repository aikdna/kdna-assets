#!/usr/bin/env node

/**
 * Verify that archive showcase download snippets agree with archive/index.json.
 *
 * This intentionally runs offline. The public-metadata audit already checks
 * GitHub Release availability and downloaded SHA values; this script keeps the
 * human-facing showcase commands aligned with that machine-readable truth.
 */

import { readdirSync, readFileSync } from 'fs';
import { join, relative } from 'path';

const ROOT = process.cwd();
const ASSETS_PATH = join(ROOT, 'archive', 'index.json');
const SHOWCASE_DIR = join(ROOT, 'archive', 'showcase');
const RELEASE_URL =
  /https:\/\/github\.com\/aikdna\/kdna-assets\/releases\/download\/([^/\s)]+)\/([^)\s\\]+)/g;
const INLINE_SHA =
  /echo\s+"([a-f0-9]{64})\s+([^"]+\.kdna)"\s*\|\s*shasum\s+-a\s+256\s+-c\s+-/g;
const SIDECAR_CHECK = /shasum\s+-a\s+256\s+-c\s+([^\s]+\.sha256)\b/g;

function lineFor(text, offset) {
  return text.slice(0, offset).split('\n').length;
}

function sidecarNamesFor(file) {
  return new Set([file + '.sha256', file.replace(/\.kdna$/, '.sha256')]);
}

function buildAssetIndex(data) {
  const byTagAndFile = new Map();
  for (const entry of data.assets || []) {
    const tag = entry.tag;
    const file = entry.file;
    if (!tag || !file) continue;
    byTagAndFile.set(`${tag}/${file}`, {
      file,
      name: entry.name,
      sha256: entry.sha256,
      sidecars: sidecarNamesFor(file),
      tag,
    });
  }
  return byTagAndFile;
}

const assets = JSON.parse(readFileSync(ASSETS_PATH, 'utf8'));
const byTagAndFile = buildAssetIndex(assets);
const findings = [];
let showcaseFiles = 0;
let kdnaUrls = 0;
let sidecarUrls = 0;

for (const entry of readdirSync(SHOWCASE_DIR, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith('.md')) continue;

  showcaseFiles += 1;
  const full = join(SHOWCASE_DIR, entry.name);
  const rel = relative(ROOT, full);
  const text = readFileSync(full, 'utf8');
  const inlineShas = new Map();
  const sidecarChecks = new Set();
  const sidecarDownloads = new Map();
  const referencedAssets = new Map();

  for (const match of text.matchAll(INLINE_SHA)) {
    inlineShas.set(match[2], {
      line: lineFor(text, match.index),
      sha256: match[1],
    });
  }

  for (const match of text.matchAll(SIDECAR_CHECK)) {
    sidecarChecks.add(match[1]);
  }

  for (const match of text.matchAll(RELEASE_URL)) {
    const [, tag, file] = match;
    const line = lineFor(text, match.index);

    if (tag === 'latest') {
      findings.push({
        file: rel,
        line,
        message: 'showcase release URLs must pin an explicit tag, not latest',
      });
      continue;
    }

    if (file.endsWith('.kdna')) {
      kdnaUrls += 1;
      const asset = byTagAndFile.get(`${tag}/${file}`);
      if (!asset) {
        findings.push({
          file: rel,
          line,
          message: `download URL ${tag}/${file} is not listed in archive/index.json`,
        });
        continue;
      }
      referencedAssets.set(file, { asset, line });
    } else if (file.endsWith('.sha256')) {
      sidecarUrls += 1;
      if (!sidecarDownloads.has(tag)) sidecarDownloads.set(tag, new Set());
      sidecarDownloads.get(tag).add(file);
    }
  }

  for (const [file, { asset, line }] of referencedAssets) {
    const inline = inlineShas.get(file);
    if (inline) {
      if (inline.sha256 !== asset.sha256) {
        findings.push({
          file: rel,
          line: inline.line,
          message: `${file} inline SHA ${inline.sha256} does not match archive/index.json ${asset.sha256}`,
        });
      }
      continue;
    }

    const downloadedSidecars = sidecarDownloads.get(asset.tag) || new Set();
    const hasSidecarUrl = [...asset.sidecars].some((name) => downloadedSidecars.has(name));
    const hasSidecarCheck = [...asset.sidecars].some((name) => sidecarChecks.has(name));
    if (!hasSidecarUrl || !hasSidecarCheck) {
      findings.push({
        file: rel,
        line,
        message: `${file} needs either an inline archive-index SHA check or a downloaded .sha256 sidecar check`,
      });
    }
  }
}

if (findings.length > 0) {
  console.log(`showcase download check FAILED (${findings.length} finding(s))`);
  for (const finding of findings) {
    console.log(`  ${finding.file}:${finding.line}: ${finding.message}`);
  }
  process.exit(1);
}

console.log('showcase download check: PASS');
console.log(`  scanned ${showcaseFiles} showcase files`);
console.log(`  verified ${kdnaUrls} .kdna download URL(s) and ${sidecarUrls} sidecar URL(s)`);
