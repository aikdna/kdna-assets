#!/usr/bin/env node

import { resolve } from 'node:path';
import { loadCluster, detectDomainConflicts } from '@aikdna/kdna-core';
import { argValue, failWith, readJson } from './lib.mjs';

const args = process.argv.slice(2);
const root = resolve(argValue(args, '--root', '.'));
const current = readJson(resolve(root, argValue(args, '--current', 'index/current.json')));
const errors = [];

function validateClusterManifest(manifest) {
  const issues = [];
  if (!manifest || typeof manifest !== 'object') return ['Manifest is not a valid object'];
  if (manifest.format !== 'kdna-cluster') issues.push('Missing or invalid format: must be "kdna-cluster"');
  if (!manifest.cluster_id) issues.push('Missing cluster_id');
  if (!manifest.name) issues.push('Missing name');
  if (!manifest.version) issues.push('Missing version');
  const rawDomains = manifest.domains;
  const domains = Array.isArray(rawDomains) ? rawDomains : [];
  if (!Array.isArray(rawDomains) || domains.length < 2) issues.push('Cluster must have at least 2 domains');
  const primaryCandidates = domains.filter((domain) => domain.role === 'primary-candidate');
  if (primaryCandidates.length !== 1) issues.push('Cluster must have exactly one primary-candidate domain');
  for (const domain of domains) {
    if (!domain.id) issues.push('Domain is missing id');
    if (!domain.role) issues.push(`Domain ${domain.id || '?'} is missing role`);
  }
  return issues;
}

for (const entry of current.clusters || []) {
  if (entry.manifest.path.endsWith('.kdna')) errors.push(`${entry.id}: Cluster manifest must not be .kdna`);
  const manifestPath = resolve(root, entry.manifest.path);
  const manifest = readJson(manifestPath);
  if (manifest.format !== 'kdna-cluster') errors.push(`${entry.id}: manifest format is not kdna-cluster`);
  if (manifest.cluster_id !== entry.id) errors.push(`${entry.id}: cluster_id does not match index id`);
  if (manifest.version !== entry.version) errors.push(`${entry.id}: manifest version does not match index`);

  // kdna-cli 0.36.0 removed the separate cluster subcommands; Core's
  // loadCluster + detectDomainConflicts now own cluster planning.
  const issues = validateClusterManifest(manifest);
  if (issues.length > 0) {
    errors.push(`${entry.id}: cluster validate failed: ${issues.join('; ')}`);
    continue;
  }
  const loaded = loadCluster(manifestPath, () => null);
  const conflicts = detectDomainConflicts(loaded.domains);
  const loadBlocked = loaded.errors.length > 0 || loaded.domains.some((domain) => domain.required && domain.core === null);
  const conflictBlocked = conflicts.some((conflict) => conflict.type === 'error');
  const observedState = loadBlocked || conflictBlocked ? 'blocked' : 'planned';
  if (observedState !== entry.technical_status.plan_state) {
    errors.push(`${entry.id}: index plan_state=${entry.technical_status.plan_state}, observed ${observedState}`);
  }
}

failWith(errors, 'Cluster check');
console.log('Cluster check: PASS');
console.log(`  entries validated/planned: ${(current.clusters || []).length}`);
