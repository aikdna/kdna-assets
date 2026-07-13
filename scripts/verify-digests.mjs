#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import {
  argValue,
  failWith,
  loadIndexes,
  parseSidecar,
  sha256,
  sidecarCandidates,
} from './lib.mjs';

const args = process.argv.slice(2);
const root = resolve(argValue(args, '--root', '.'));
const currentPath = resolve(root, argValue(args, '--current', 'index/current.json'));
const archivePath = resolve(root, argValue(args, '--archive', 'archive/index.json'));
const archiveChecksums = resolve(root, argValue(args, '--archive-checksums', 'archive/checksums'));
const archiveArtifacts = resolve(root, argValue(args, '--archive-artifacts', 'archive/artifacts'));
const expectedArchiveSidecars = Number(argValue(args, '--expected-archive-sidecars', '47'));
const expectedArchiveArtifacts = Number(argValue(args, '--expected-archive-artifacts', '47'));
const { current, archive } = loadIndexes(currentPath, archivePath);
const errors = [];
let currentChecked = 0;
let archiveChecked = 0;
let archiveArtifactsChecked = 0;

for (const entry of [...current.assets, ...current.clusters]) {
  const relativePath = entry.kind === 'kdna-asset' ? entry.artifact.path : entry.manifest.path;
  const artifactPath = resolve(root, relativePath);
  const expected = entry.digest.value;
  if (!existsSync(artifactPath)) {
    errors.push(`${entry.id}: artifact missing: ${relativePath}`);
    continue;
  }
  const actual = sha256(artifactPath);
  if (actual !== expected) errors.push(`${entry.id}: digest mismatch (${actual} != ${expected})`);
  const sidecarPath = `${artifactPath}.sha256`;
  if (!existsSync(sidecarPath)) errors.push(`${entry.id}: sidecar missing: ${relativePath}.sha256`);
  else if (parseSidecar(readFileSync(sidecarPath, 'utf8')) !== expected) {
    errors.push(`${entry.id}: local sidecar does not declare index digest`);
  }
  currentChecked++;
}

for (const entry of archive.assets) {
  const archivedArtifact = resolve(archiveArtifacts, entry.file);
  if (existsSync(archivedArtifact)) {
    const actual = sha256(archivedArtifact);
    if (actual !== entry.sha256) {
      errors.push(`${entry.tag}/${entry.file}: archived artifact changed (${actual} != ${entry.sha256})`);
    }
    archiveArtifactsChecked++;
  }
  const candidate = sidecarCandidates(entry.file)
    .map((name) => resolve(archiveChecksums, basename(name)))
    .find((path) => existsSync(path));
  if (!candidate) continue;
  const declared = parseSidecar(readFileSync(candidate, 'utf8'));
  if (declared !== entry.sha256) {
    errors.push(`${entry.tag}/${entry.file}: archived sidecar changed (${declared} != ${entry.sha256})`);
  }
  archiveChecked++;
}

if (archiveChecked !== expectedArchiveSidecars) {
  errors.push(`archive sidecar count expected ${expectedArchiveSidecars}, found ${archiveChecked}`);
}
if (archiveArtifactsChecked !== expectedArchiveArtifacts) {
  errors.push(`archive artifact count expected ${expectedArchiveArtifacts}, found ${archiveArtifactsChecked}`);
}

failWith(errors, 'Digest verification');
console.log('Digest verification: PASS');
console.log(`  current artifacts: ${currentChecked}`);
console.log(`  archive artifacts: ${archiveArtifactsChecked}`);
console.log(`  archive sidecars:  ${archiveChecked}`);
