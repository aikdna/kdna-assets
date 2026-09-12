#!/usr/bin/env node

// C01 publish-coordinate gate.
//
// `file:` coordinates are the offline-installable form inside this workspace,
// but they cannot be published: a consumer that installs the packed artifact
// from a registry has no `vendor/` directory next to it. Therefore any package
// that is NOT `private` and still declares a `file:` dependency is a finding,
// and this gate has to be green before a push/publish batch starts.
//
// usage: node scripts/check-publish-coordinates.mjs [--root <dir>] [--report-only]

import { readFileSync, realpathSync } from 'node:fs';
import { resolve } from 'node:path';

export const DEPENDENCY_FIELDS = Object.freeze([
  'dependencies',
  'optionalDependencies',
  'peerDependencies',
  'devDependencies',
]);

export function findingsFor(manifest) {
  const findings = [];
  if (manifest.private === true) return findings;
  for (const field of DEPENDENCY_FIELDS) {
    for (const [name, spec] of Object.entries(manifest[field] ?? {})) {
      if (typeof spec === 'string' && spec.startsWith('file:')) {
        findings.push({ rule: 'non_private_package_declares_file_coordinate', package: manifest.name, field, name, spec });
      }
    }
  }
  return findings;
}

export function check(root) {
  const manifest = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
  return { manifest, findings: findingsFor(manifest) };
}

function main(argv) {
  const rootIndex = argv.indexOf('--root');
  const root = rootIndex === -1 ? resolve(import.meta.dirname, '..') : resolve(argv[rootIndex + 1]);
  const { manifest, findings } = check(root);
  if (findings.length === 0) {
    console.log(`KDNA-PUBLISH-COORDINATES: ok root=${root} private=${manifest.private === true} findings=0`);
    return 0;
  }
  console.log(
    `KDNA-PUBLISH-COORDINATES: findings=${findings.length} root=${root} ` +
      'replace every file: coordinate in a non-private package with the exact registry version before publishing ' +
      JSON.stringify(findings),
  );
  return argv.includes('--report-only') ? 0 : 1;
}

// Realpath comparison: a literal `process.argv[1] === import.meta.filename`
// check is false whenever the caller reaches this file through a symlink
// (macOS /tmp and /var are symlinks), and the module would then exit 0 without
// reporting anything.
function isEntryPoint() {
  if (!process.argv[1]) return false;
  try {
    return realpathSync(process.argv[1]) === realpathSync(import.meta.filename);
  } catch {
    return false;
  }
}

if (isEntryPoint()) process.exitCode = main(process.argv.slice(2));
