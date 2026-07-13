#!/usr/bin/env node

import {
  argValue,
  canonicalReleaseUrl,
  failWith,
  loadIndexes,
  parseSidecar,
  readJson,
  sidecarCandidates,
} from './lib.mjs';

const args = process.argv.slice(2);
const currentPath = argValue(args, '--current', 'index/current.json');
const archivePath = argValue(args, '--archive', 'archive/index.json');
const fixturePath = argValue(args, '--release-fixture');
const online = args.includes('--online');
const { current, archive } = loadIndexes(currentPath, archivePath);
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
  ...(archive.assets || []).map((entry) => ({
    id: `${entry.tag}/${entry.file}`,
    tag: entry.tag,
    file: entry.file,
    sha256: entry.sha256,
  })),
];

for (const item of expected) {
  const canonical = canonicalReleaseUrl(item.tag, item.file);
  if (item.download?.url && item.download.url !== canonical) {
    errors.push(`${item.id}: download URL does not match tag/file`);
  }
  if (item.download?.checksum_url && item.download.checksum_url !== `${canonical}.sha256`) {
    errors.push(`${item.id}: checksum URL must be the artifact URL plus .sha256`);
  }
}

let releases = null;
if (fixturePath) releases = readJson(fixturePath);
else if (online) releases = await fetchReleases();

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
    } else if (online) {
      const response = await fetch(sidecar.browser_download_url, { headers: githubHeaders() });
      if (!response.ok) errors.push(`${item.id}: Release sidecar download returned ${response.status}`);
      else if (parseSidecar(await response.text()) !== item.sha256) {
        errors.push(`${item.id}: Release sidecar digest disagrees with index`);
      }
    }
  }
}

failWith(errors, 'Release consistency check');
console.log('Release consistency check: PASS');
console.log(`  indexed release artifacts: ${expected.length}`);
console.log(`  GitHub state checked:      ${Boolean(releases)}`);

function releaseTag(url) {
  const match = url?.match(/\/releases\/download\/([^/]+)\//);
  return match?.[1] || '';
}

async function fetchReleases() {
  const releases = [];
  let url = 'https://api.github.com/repos/aikdna/kdna-assets/releases?per_page=100';
  while (url) {
    const response = await fetch(url, { headers: githubHeaders() });
    if (!response.ok) throw new Error(`GitHub Releases API returned ${response.status}`);
    releases.push(...await response.json());
    url = nextLink(response.headers.get('link'));
  }
  return releases;
}

function githubHeaders() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'kdna-assets-release-consistency',
  };
  if (process.env.GH_TOKEN) headers.Authorization = `Bearer ${process.env.GH_TOKEN}`;
  return headers;
}

function nextLink(link) {
  if (!link) return null;
  for (const part of link.split(',')) {
    const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (match?.[2] === 'next') return match[1];
  }
  return null;
}
