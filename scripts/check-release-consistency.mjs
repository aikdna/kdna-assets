#!/usr/bin/env node

import { createHash } from 'node:crypto';

import {
  argValue,
  canonicalReleaseUrl,
  failWith,
  parseSidecar,
  readJson,
  sidecarCandidates,
} from './lib.mjs';
import { fetchPayloadWithRetry } from './retry-fetch.mjs';

const args = process.argv.slice(2);
const currentPath = argValue(args, '--current', 'index/current.json');
const fixturePath = argValue(args, '--release-fixture');
const online = args.includes('--online');
const current = readJson(currentPath);
const errors = [];

const expected = [
  ...(current.assets || []).map((entry) => ({
    id: entry.id,
    tag: releaseTag(entry.download.url),
    file: entry.kind === 'kdna-asset' ? entry.artifact.path.split('/').pop() : entry.manifest.path.split('/').pop(),
    sha256: entry.digest.value,
    download: entry.download,
  })),
  ...(current.clusters || []).map((entry) => ({
    id: entry.id,
    tag: releaseTag(entry.download.url),
    file: entry.manifest.path.split('/').pop(),
    sha256: entry.digest.value,
    download: entry.download,
  })),
];

for (const item of expected) {
  const canonical = canonicalReleaseUrl(item.tag, item.file);
  if (item.download?.url !== canonical) {
    errors.push(`${item.id}: download URL does not match tag/file`);
  }
  if (item.download?.checksum_url !== `${canonical}.sha256`) {
    errors.push(`${item.id}: checksum URL must be the artifact URL plus .sha256`);
  }
}

// Reject untrusted download coordinates before any network request is made.
failWith(errors, 'Release consistency check');

let releases = null;
if (fixturePath) releases = readJson(fixturePath);

if (releases) {
  const byTag = new Map(releases.map((release) => [release.tag_name, release]));
  for (const item of expected) {
    const release = byTag.get(item.tag);
    if (!release) {
      errors.push(`${item.id}: GitHub Release tag missing`);
      continue;
    }
    const assets = new Map((release.assets || []).map((asset) => [asset.name, asset]));
    if (!assets.has(item.file)) errors.push(`${item.id}: Release artifact ${item.file} missing`);
    const sidecarName = sidecarCandidates(item.file).find((name) => assets.has(name));
    if (!sidecarName) {
      errors.push(`${item.id}: Release checksum sidecar missing`);
      continue;
    }
    const sidecar = assets.get(sidecarName);
    if (sidecar.content !== undefined) {
      if (parseSidecar(sidecar.content) !== item.sha256) {
        errors.push(`${item.id}: Release sidecar digest disagrees with index`);
      }
    }
  }
}

if (online) {
  for (const item of expected) {
    const canonical = canonicalReleaseUrl(item.tag, item.file);
    const { response: sidecarResponse, payload: sidecarText } = await fetchPayloadWithRetry(
      `${canonical}.sha256`,
      { headers: publicDownloadHeaders() },
      { read: (response) => response.text() },
    );
    if (!sidecarResponse.ok) {
      errors.push(`${item.id}: Release sidecar download returned ${sidecarResponse.status}`);
    } else if (parseSidecar(sidecarText) !== item.sha256) {
      errors.push(`${item.id}: Release sidecar digest disagrees with index`);
    }

    const { response: artifactResponse, payload: artifactBuffer } = await fetchPayloadWithRetry(
      canonical,
      { headers: publicDownloadHeaders() },
      { read: async (response) => Buffer.from(await response.arrayBuffer()) },
    );
    if (!artifactResponse.ok) {
      errors.push(`${item.id}: Release artifact download returned ${artifactResponse.status}`);
      continue;
    }
    const actualHash = createHash('sha256').update(artifactBuffer).digest('hex');
    if (actualHash !== item.sha256) {
      errors.push(`${item.id}: Release artifact SHA-256 mismatch (${actualHash.slice(0, 12)}... vs index ${item.sha256.slice(0, 12)}...)`);
    }
  }
}

failWith(errors, 'Release consistency check');
console.log('Release consistency check: PASS');
console.log(`  indexed release artifacts: ${expected.length}`);
console.log(`  GitHub state checked:      ${Boolean(releases || online)}`);

function releaseTag(url) {
  const match = url?.match(/\/releases\/download\/([^/]+)\//);
  return match?.[1] || '';
}

function publicDownloadHeaders() {
  return {
    Accept: 'application/octet-stream',
    'User-Agent': 'kdna-assets-release-consistency',
  };
}
