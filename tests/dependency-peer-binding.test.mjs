import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, copyFileSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  checkRepository,
  peerBindingFindings,
} from '../scripts/dependency-coordinate-policy.mjs';

const root = resolve(import.meta.dirname, '..');
const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const lock = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8'));

const peerCoordinators = Object.entries(lock.packages)
  .filter(([, entry]) => Object.keys(entry.peerDependencies ?? {}).length > 0)
  .map(([key, entry]) => ({ key, peers: entry.peerDependencies }));

test('no committed member may leave a peer coordinate for npm to resolve at install time', () => {
  assert.ok(peerCoordinators.length > 0, 'the committed graph is expected to declare at least one peer range');
  const direct = new Set([
    ...Object.keys(manifest.dependencies ?? {}),
    ...Object.keys(manifest.devDependencies ?? {}),
  ]);
  const bound = [];
  for (const { key, peers } of peerCoordinators) {
    for (const name of Object.keys(peers)) {
      if (!direct.has(name)) continue;
      if (lock.packages[key].peerDependenciesMeta?.[name]?.optional === true) continue;
      bound.push(name);
      assert.equal(
        manifest.overrides?.[name],
        `$${name}`,
        `${key} declares peer ${name}; the root must bind it with overrides["${name}"] = "$${name}"`,
      );
    }
  }
  assert.ok(bound.includes('@aikdna/kdna-core'), `expected @aikdna/kdna-core among the bound peers, got ${bound}`);
  assert.deepEqual(checkRepository(root), []);
});

test('an optional peer is not required to carry an override (npm does not look it up)', () => {
  const unbound = structuredClone(manifest);
  delete unbound.overrides['@aikdna/kdna-core'];
  const optionalHolder = {
    packages: {
      'node_modules/optional-holder': {
        peerDependencies: { '@aikdna/kdna-core': '0.24.0-rc.component-semantics.2' },
        peerDependenciesMeta: { '@aikdna/kdna-core': { optional: true } },
      },
    },
  };
  assert.deepEqual(peerBindingFindings({ manifest: unbound, lock: optionalHolder }), []);
  const requiredHolder = {
    packages: {
      'node_modules/required-holder': {
        peerDependencies: { '@aikdna/kdna-core': '0.24.0-rc.component-semantics.2' },
      },
    },
  };
  assert.equal(peerBindingFindings({ manifest: unbound, lock: requiredHolder }).length, 1);
});

test('the peer binding gate goes red for every mutation that reopens a registry lookup', () => {
  const peerName = '@aikdna/kdna-core';
  const mutations = [
    ['override removed', (next) => { delete next.manifest.overrides[peerName]; }],
    ['override replaced by the exact registry range', (next) => { next.manifest.overrides[peerName] = '0.24.0-rc.component-semantics.2'; }],
    ['override replaced by a floating range', (next) => { next.manifest.overrides[peerName] = '^0.24.0'; }],
    ['override replaced by the bare range from the vendor declaration', (next) => { next.manifest.overrides[peerName] = '*'; }],
    ['override pointed at another repository', (next) => { next.manifest.overrides[peerName] = 'file:../elsewhere/aikdna-kdna-core.tgz'; }],
  ];
  for (const [label, mutate] of mutations) {
    const next = { manifest: structuredClone(manifest), lock };
    mutate(next);
    const findings = peerBindingFindings(next);
    assert.ok(
      findings.some((finding) => finding.rule === 'unbound_peer_coordinate' && finding.name === peerName),
      `mutation "${label}" must be rejected, got ${JSON.stringify(findings)}`,
    );
  }
});

test('the standalone gate is red on a mutated tree and green on this one', () => {
  const sandbox = mkdtempSync(join(tmpdir(), 'assets-peer-binding-'));
  try {
    for (const name of ['package.json', 'package-lock.json']) {
      copyFileSync(join(root, name), join(sandbox, name));
    }
    for (const [, spec] of Object.entries(manifest.devDependencies ?? {})) {
      if (!spec.startsWith('file:')) continue;
      mkdirSync(dirname(join(sandbox, spec.slice('file:'.length))), { recursive: true });
      copyFileSync(join(root, spec.slice('file:'.length)), join(sandbox, spec.slice('file:'.length)));
    }
    const script = join(root, 'scripts', 'dependency-coordinate-policy.mjs');
    const green = spawnSync(process.execPath, [script, '--root', sandbox], { encoding: 'utf8' });
    assert.equal(green.status, 0, green.stdout + green.stderr);
    assert.match(green.stdout, /KDNA-DEPENDENCY-COORDINATES: ok/);

    const mutated = JSON.parse(readFileSync(join(sandbox, 'package.json'), 'utf8'));
    delete mutated.overrides['@aikdna/kdna-core'];
    writeFileSync(join(sandbox, 'package.json'), `${JSON.stringify(mutated, null, 2)}\n`);
    const red = spawnSync(process.execPath, [script, '--root', sandbox], { encoding: 'utf8' });
    assert.equal(red.status, 1, red.stdout + red.stderr);
    assert.match(red.stdout, /unbound_peer_coordinate/);
  } finally {
    rmSync(sandbox, { recursive: true, force: true });
  }
});
