#!/usr/bin/env node

import { createHash } from 'node:crypto';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

import { canonicalReleaseUrl } from '../scripts/lib.mjs';

const repo = resolve(import.meta.dirname, '..');
const fixtures = join(repo, 'tests/fixtures');
const temp = mkdtempSync(join(tmpdir(), 'kdna-assets-fixtures-'));
const cliToolchain = `@aikdna/kdna-cli@${JSON.parse(readFileSync(join(repo, 'package.json'), 'utf8')).devDependencies['@aikdna/kdna-cli']}`;
const results = [];

try {
  testLocalCliAuthority();
  testReleaseDownloadAuthority();
  testIndexes();
  testDigests();
  testCurrentAssets();
  testClusters();
  testLicenses();
  testReleases();
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log(`Fixture suite: PASS (${results.length} positive/negative assertions)`);
for (const result of results) console.log(`  ✓ ${result}`);

function testLocalCliAuthority() {
  const source = readFileSync(join(repo, 'scripts/check-current-assets.mjs'), 'utf8');
  if (/spawnSync\(['"]npx['"]/u.test(source)) {
    throw new Error('current asset checks must not delegate CLI authority to npx');
  }
  if (!source.includes('spawnSync(process.execPath, [cliEntry')) {
    throw new Error('current asset checks must execute the exact installed CLI with current Node');
  }
  results.push('current asset CLI authority');
}

function testReleaseDownloadAuthority() {
  const source = readFileSync(join(repo, 'scripts/check-release-consistency.mjs'), 'utf8');
  if (/api\.github\.com|Authorization|GH_TOKEN|GITHUB_TOKEN/u.test(source)) {
    throw new Error('release byte checks must use anonymous canonical downloads without REST API credentials');
  }
  if (/fetchPayloadWithRetry\(\s*item\.download/u.test(source)) {
    throw new Error('release byte checks must not fetch an index-provided URL directly');
  }
  const canonicalGuard = source.indexOf('// Reject untrusted download coordinates');
  const onlineDownloads = source.indexOf('if (online)');
  if (canonicalGuard < 0 || onlineDownloads < 0 || canonicalGuard > onlineDownloads) {
    throw new Error('canonical release coordinates must fail before online downloads begin');
  }
  if (!source.includes('const canonical = canonicalReleaseUrl(item.tag, item.file);')) {
    throw new Error('online release downloads must reconstruct the canonical URL');
  }
  for (const workflow of ['public-metadata.yml', 'release-verification.yml']) {
    const workflowSource = readFileSync(join(repo, '.github/workflows', workflow), 'utf8');
    if (/GH_TOKEN|GITHUB_TOKEN|Authorization/u.test(workflowSource)) {
      throw new Error(`${workflow} must not expose a credential to public Release downloads`);
    }
    if (
      workflow === 'public-metadata.yml' &&
      !workflowSource.includes('python3 scripts/audit-public-metadata.py --online-releases')
    ) {
      throw new Error('public metadata CI must execute the online canonical Release audit');
    }
  }
  results.push('release download authority');
}

function testIndexes() {
  const common = ['--current-schema', join(repo, 'schemas/current-index.schema.json')];
  expectPass('index positive', 'scripts/validate-indexes.mjs', [
    '--current', join(fixtures, 'index/current-empty-valid.json'),
    ...common,
  ]);
  expectFail('index negative', 'scripts/validate-indexes.mjs', [
    '--current', join(fixtures, 'index/current-invalid.json'),
    ...common,
  ]);

  const staleToolchain = join(temp, 'index-stale-toolchain.json');
  const entry = assetEntry(
    'references/public/current-demo/current-demo-1.0.0.kdna',
    'a'.repeat(64),
  );
  entry.technical_status.toolchain = '@aikdna/kdna-cli@0.34.0';
  writeJson(staleToolchain, currentIndex({ assets: [entry] }));
  expectFail('index stale CLI baseline', 'scripts/validate-indexes.mjs', [
    '--current', staleToolchain,
    ...common,
  ]);
}

function testDigests() {
  const positive = join(temp, 'digests-positive');
  prepareArtifactRoot(positive, join(fixtures, 'digests/positive'));
  expectPass('digest positive', 'scripts/verify-digests.mjs', ['--root', positive]);

  const negative = join(temp, 'digests-negative');
  prepareArtifactRoot(negative, join(fixtures, 'digests/negative'));
  expectFail('digest negative', 'scripts/verify-digests.mjs', ['--root', negative]);
}

function testCurrentAssets() {
  const positive = join(temp, 'asset-positive');
  mkdirSync(join(positive, 'references/public/current-demo'), { recursive: true });
  mkdirSync(join(positive, 'index'), { recursive: true });
  mkdirSync(join(positive, 'source'), { recursive: true });
  runExternal('kdna', ['demo', 'judgment', join(positive, 'source')]);
  const artifactRel = 'references/public/current-demo/current-demo-1.0.0.kdna';
  const artifact = join(positive, artifactRel);
  runExternal('kdna', ['pack', join(positive, 'source'), artifact]);
  writeFileSync(`${artifact}.sha256`, `${sha256(artifact)}  ${basename(artifact)}\n`);
  writeFileSync(join(dirname(artifact), 'LICENSE'), 'Fixture-only license.\n');
  writeJson(join(positive, 'index/current.json'), currentIndex({
    assets: [assetEntry(artifactRel, sha256(artifact))],
  }));
  expectPass('current asset positive', 'scripts/check-current-assets.mjs', ['--root', positive]);

  const negative = join(temp, 'asset-negative');
  mkdirSync(join(negative, 'references/public/broken'), { recursive: true });
  mkdirSync(join(negative, 'index'), { recursive: true });
  const brokenRel = 'references/public/broken/broken-1.0.0.kdna';
  copyFileSync(join(fixtures, 'assets/negative.kdna'), join(negative, brokenRel));
  writeJson(join(negative, 'index/current.json'), currentIndex({
    assets: [assetEntry(brokenRel, sha256(join(negative, brokenRel)))],
  }));
  expectFail('current asset negative', 'scripts/check-current-assets.mjs', ['--root', negative]);
}

function testClusters() {
  const manifestRel = 'clusters/reference-cluster/kdna.cluster.json';
  const positive = join(temp, 'cluster-positive');
  mkdirSync(join(positive, dirname(manifestRel)), { recursive: true });
  mkdirSync(join(positive, 'index'), { recursive: true });
  copyFileSync(join(fixtures, 'clusters/positive/kdna.cluster.json'), join(positive, manifestRel));
  copyFileSync(join(fixtures, 'clusters/positive/LICENSE'), join(positive, dirname(manifestRel), 'LICENSE'));
  writeFileSync(`${join(positive, manifestRel)}.sha256`, `${sha256(join(positive, manifestRel))}  kdna.cluster.json\n`);
  writeJson(join(positive, 'index/current.json'), currentIndex({
    clusters: [clusterEntry(manifestRel, sha256(join(positive, manifestRel)), '@fixture/reference-cluster')],
  }));
  expectPass('cluster positive', 'scripts/check-clusters.mjs', ['--root', positive]);

  const negative = join(temp, 'cluster-negative');
  mkdirSync(join(negative, dirname(manifestRel)), { recursive: true });
  mkdirSync(join(negative, 'index'), { recursive: true });
  copyFileSync(join(fixtures, 'clusters/negative/kdna.cluster.json'), join(negative, manifestRel));
  writeJson(join(negative, 'index/current.json'), currentIndex({
    clusters: [clusterEntry(manifestRel, sha256(join(negative, manifestRel)), '@fixture/broken-cluster')],
  }));
  expectFail('cluster negative', 'scripts/check-clusters.mjs', ['--root', negative]);
}

function testLicenses() {
  const artifactRel = 'references/public/licensed-fixture/licensed-fixture-1.0.0.kdna';
  const positive = join(temp, 'license-positive');
  mkdirSync(join(positive, dirname(artifactRel)), { recursive: true });
  mkdirSync(join(positive, 'index'), { recursive: true });
  copyFileSync(join(fixtures, 'licenses/positive/LICENSE'), join(positive, dirname(artifactRel), 'LICENSE'));
  writeJson(join(positive, 'index/current.json'), currentIndex({
    assets: [assetEntry(artifactRel, 'a'.repeat(64))],
  }));
  expectPass('license positive', 'scripts/check-licenses.mjs', ['--root', positive]);

  const negative = join(temp, 'license-negative');
  mkdirSync(join(negative, dirname(artifactRel)), { recursive: true });
  mkdirSync(join(negative, 'index'), { recursive: true });
  writeFileSync(join(negative, 'LICENSE'), 'Root-only fixture license.\n');
  const entry = assetEntry(artifactRel, 'a'.repeat(64));
  entry.access = 'licensed';
  entry.license = {
    id: 'CC-BY-4.0',
    path: 'LICENSE',
    scope: 'asset-content-and-distribution',
    repository_license_applies: false,
  };
  writeJson(join(negative, 'index/current.json'), currentIndex({ assets: [entry] }));
  expectFail('license negative', 'scripts/check-licenses.mjs', ['--root', negative]);
}

function testReleases() {
  const root = join(temp, 'releases');
  const currentPath = join(root, 'current.json');
  const releasePositive = join(root, 'positive.json');
  const releaseNegative = join(root, 'negative.json');
  const digest = 'a'.repeat(64);
  const entry = assetEntry('references/public/current-demo/current-demo-1.0.0.kdna', digest);
  writeJson(currentPath, currentIndex({ assets: [entry] }));
  writeJson(releasePositive, [{
    tag_name: 'current-demo-1.0.0',
    assets: [
      { name: 'current-demo-1.0.0.kdna' },
      { name: 'current-demo-1.0.0.kdna.sha256', content: `${digest}  current-demo-1.0.0.kdna\n` },
    ],
  }]);
  writeJson(releaseNegative, [{
    tag_name: 'current-demo-1.0.0',
    assets: [{ name: 'current-demo-1.0.0.kdna' }],
  }]);
  expectPass('release positive', 'scripts/check-release-consistency.mjs', [
    '--current', currentPath,
    '--release-fixture', releasePositive,
  ]);
  expectFail('release negative', 'scripts/check-release-consistency.mjs', [
    '--current', currentPath,
    '--release-fixture', releaseNegative,
  ]);

  const preload = join(repo, 'tests/fake-release-fetch.cjs');
  const canonicalInvalid = join(root, 'canonical-invalid.json');
  const canonicalEntry = assetEntry(
    'references/public/current-demo/current-demo-1.0.0.kdna',
    digest,
  );
  canonicalEntry.download.url = 'https://example.invalid/untrusted.kdna';
  writeJson(canonicalInvalid, currentIndex({ assets: [canonicalEntry] }));
  const canonicalLog = join(root, 'canonical-invalid-fetch.log');
  const canonicalResult = runScriptWithEnv(
    'scripts/check-release-consistency.mjs',
    ['--current', canonicalInvalid, '--online'],
    {
      NODE_OPTIONS: `--require=${preload}`,
      KDNA_TEST_FETCH_LOG: canonicalLog,
    },
  );
  if (canonicalResult.status === 0) throw new Error('canonical mismatch unexpectedly passed');
  if (existsSync(canonicalLog) && readFileSync(canonicalLog, 'utf8') !== '') {
    throw new Error('canonical mismatch performed a network request');
  }
  results.push('release canonical mismatch zero network');

  const missingCoordinate = join(root, 'missing-coordinate.json');
  const missingEntry = assetEntry(
    'references/public/current-demo/current-demo-1.0.0.kdna',
    digest,
  );
  delete missingEntry.download.checksum_url;
  writeJson(missingCoordinate, currentIndex({ assets: [missingEntry] }));
  const missingLog = join(root, 'missing-coordinate-fetch.log');
  const missingResult = runScriptWithEnv(
    'scripts/check-release-consistency.mjs',
    ['--current', missingCoordinate, '--online'],
    {
      NODE_OPTIONS: `--require=${preload}`,
      KDNA_TEST_FETCH_LOG: missingLog,
    },
  );
  if (missingResult.status === 0) throw new Error('missing Release coordinate unexpectedly passed');
  if (existsSync(missingLog) && readFileSync(missingLog, 'utf8') !== '') {
    throw new Error('missing Release coordinate performed a network request');
  }
  results.push('release missing coordinate zero network');

  const digestMismatch = join(root, 'digest-mismatch.json');
  writeJson(digestMismatch, currentIndex({
    assets: [assetEntry('references/public/current-demo/current-demo-1.0.0.kdna', digest)],
  }));
  const digestLog = join(root, 'digest-mismatch-fetch.log');
  const digestResult = runScriptWithEnv(
    'scripts/check-release-consistency.mjs',
    ['--current', digestMismatch, '--online'],
    {
      NODE_OPTIONS: `--require=${preload}`,
      KDNA_TEST_FETCH_LOG: digestLog,
      KDNA_TEST_FETCH_DIGEST: digest,
    },
  );
  if (digestResult.status === 0) throw new Error('release digest mismatch unexpectedly passed');
  const requests = readFileSync(digestLog, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
  if (requests.length !== 2) {
    throw new Error(`release digest mismatch made ${requests.length} requests instead of 2`);
  }
  if (requests.some((request) => request.authorization)) {
    throw new Error('public Release download included an Authorization header');
  }
  const canonical = canonicalReleaseUrl('current-demo-1.0.0', 'current-demo-1.0.0.kdna');
  if (requests[0].url !== `${canonical}.sha256` || requests[1].url !== canonical) {
    throw new Error('release digest mismatch did not use canonical download URLs');
  }
  results.push('release digest mismatch no retry');
}

function prepareArtifactRoot(root, source) {
  const artifactRel = 'references/public/fixture/fixture.kdna';
  mkdirSync(join(root, dirname(artifactRel)), { recursive: true });
  mkdirSync(join(root, 'index'), { recursive: true });
  copyFileSync(join(source, 'fixture.kdna'), join(root, artifactRel));
  copyFileSync(join(source, 'fixture.kdna.sha256'), `${join(root, artifactRel)}.sha256`);
  writeJson(join(root, 'index/current.json'), currentIndex({
    assets: [assetEntry(artifactRel, sha256(join(root, artifactRel)))],
  }));
}

function currentIndex({ assets = [], clusters = [] } = {}) {
  return {
    schema_version: '1.0.0',
    kind: 'kdna-current-index',
    updated: '2026-07-13T12:00:00+08:00',
    repository: 'https://github.com/aikdna/kdna-assets',
    listing_policy: 'Fixture only; no endorsement, correctness, quality, expertise, approval, or truth is implied.',
    assets,
    clusters,
  };
}

function assetEntry(path, digest) {
  const file = basename(path);
  return {
    kind: 'kdna-asset',
    id: '@fixture/current-demo',
    publisher: { name: 'Fixture Publisher', url: 'https://example.com/publisher' },
    creator: { name: 'Fixture Creator' },
    access: 'public',
    license: {
      id: 'LicenseRef-Fixture',
      path: `${dirname(path)}/LICENSE`,
      scope: 'asset-content-and-distribution',
      repository_license_applies: false,
    },
    version: '1.0.0',
    digest: { algorithm: 'sha256', value: digest },
    artifact: { path, media_type: 'application/vnd.kdna.asset' },
    download: {
      url: `https://github.com/aikdna/kdna-assets/releases/download/current-demo-1.0.0/${file}`,
      checksum_url: `https://github.com/aikdna/kdna-assets/releases/download/current-demo-1.0.0/${file}.sha256`,
    },
    technical_status: {
      format: 'valid',
      plan_load: 'ready',
      load: 'verified',
      capsule: 'verified',
      verified_at: '2026-07-13T12:00:00+08:00',
      toolchain: cliToolchain,
    },
  };
}

function clusterEntry(path, digest, id) {
  const file = basename(path);
  return {
    kind: 'kdna-cluster',
    id,
    publisher: { name: 'Fixture Publisher', url: 'https://example.com/publisher' },
    creator: { name: 'Fixture Creator' },
    access: 'public',
    license: {
      id: 'LicenseRef-Fixture',
      path: `${dirname(path)}/LICENSE`,
      scope: 'asset-content-and-distribution',
      repository_license_applies: false,
    },
    version: '1.0.0',
    digest: { algorithm: 'sha256', value: digest },
    manifest: {
      path,
      media_type: 'application/vnd.kdna.cluster+json',
      format: 'kdna-cluster',
    },
    download: {
      url: `https://github.com/aikdna/kdna-assets/releases/download/reference-cluster-1.0.0/${file}`,
      checksum_url: `https://github.com/aikdna/kdna-assets/releases/download/reference-cluster-1.0.0/${file}.sha256`,
    },
    technical_status: {
      manifest: 'valid',
      plan_use: 'verified',
      plan_state: 'blocked',
      verified_at: '2026-07-13T12:00:00+08:00',
      toolchain: cliToolchain,
    },
  };
}

function expectPass(name, script, args) {
  const result = runScript(script, args);
  if (result.status !== 0) throw new Error(`${name} unexpectedly failed:\n${result.stdout}\n${result.stderr}`);
  results.push(name);
}

function expectFail(name, script, args) {
  const result = runScript(script, args);
  if (result.status === 0) throw new Error(`${name} unexpectedly passed:\n${result.stdout}`);
  results.push(name);
}

function runScript(script, args) {
  return spawnSync(process.execPath, [join(repo, script), ...args], {
    cwd: repo,
    encoding: 'utf8',
  });
}

function runScriptWithEnv(script, args, environment) {
  return spawnSync(process.execPath, [join(repo, script), ...args], {
    cwd: repo,
    encoding: 'utf8',
    env: { ...process.env, ...environment },
  });
}

function runExternal(command, args) {
  const result = spawnSync(command, args, { cwd: repo, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} failed:\n${result.stdout}\n${result.stderr}`);
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}
