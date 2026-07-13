#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { argValue, failWith, loadIndexes } from './lib.mjs';

const args = process.argv.slice(2);
const root = resolve(argValue(args, '--root', '.'));
const currentPath = resolve(root, argValue(args, '--current', 'index/current.json'));
const archivePath = resolve(root, argValue(args, '--archive', 'archive/index.json'));
const docsRoot = resolve(root, argValue(args, '--docs-root', '.'));
const { current, archive } = loadIndexes(currentPath, archivePath);
const errors = [];
const archiveFiles = new Set((archive.assets || []).map((entry) => entry.file));
const archiveTags = new Set((archive.assets || []).map((entry) => entry.tag));
const archiveDigests = new Set((archive.assets || []).map((entry) => entry.sha256));

for (const entry of [...(current.assets || []), ...(current.clusters || [])]) {
  const path = entry.kind === 'kdna-asset' ? entry.artifact.path : entry.manifest.path;
  const serialized = JSON.stringify(entry);
  if (path.startsWith('archive/') || serialized.includes('/archive/')) {
    errors.push(`${entry.id}: current entry references archive content`);
  }
  if (archiveFiles.has(path.split('/').pop())) errors.push(`${entry.id}: current entry reuses an archive filename`);
  if (archiveDigests.has(entry.digest.value)) errors.push(`${entry.id}: current entry reuses an archive digest`);
  for (const tag of archiveTags) {
    if (entry.download.url.includes(`/download/${tag}/`)) {
      errors.push(`${entry.id}: current download uses archive release tag ${tag}`);
      break;
    }
  }
}

for (const file of walkMarkdown(docsRoot)) {
  const rel = relative(root, file).replaceAll('\\', '/');
  const text = readFileSync(file, 'utf8');
  if (rel.startsWith('archive/')) {
    const forbidden = [
      /\bkdna\s+validate\b/i,
      /\bkdna\s+plan-load\b/i,
      /\bkdna\s+load\b/i,
      /\bkdna\s+use\b/i,
      /^##\s+(how to install|install and load|how to load|load the asset)/im,
    ];
    for (const pattern of forbidden) {
      if (pattern.test(text)) errors.push(`${rel}: archive page contains current loading instruction (${pattern})`);
    }
    continue;
  }

  for (const line of text.split('\n')) {
    if (!/\bkdna\s+(validate|plan-load|load|use)\b/i.test(line)) continue;
    if (/archive\//i.test(line) || [...archiveFiles].some((name) => line.includes(name))) {
      errors.push(`${rel}: current onboarding command references archive material`);
    }
  }
}

failWith(errors, 'Onboarding boundary check');
console.log('Onboarding boundary check: PASS');
console.log(`  current entries: ${(current.assets || []).length + (current.clusters || []).length}`);
console.log(`  archive entries protected: ${(archive.assets || []).length}`);

function walkMarkdown(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (entry === '.git' || entry === 'node_modules') continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walkMarkdown(full, out);
    else if (entry.endsWith('.md')) out.push(full);
  }
  return out;
}
