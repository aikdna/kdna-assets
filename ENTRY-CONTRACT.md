# Current entry handoff contract

This is the concrete file and metadata contract for the separately assigned
reference-asset and Cluster authors. It reserves paths; it does not create or
endorse their content.

## Agent 3 — two public references

```text
references/public/laozi-wuwei/
  laozi-wuwei-<version>.kdna
  laozi-wuwei-<version>.kdna.sha256
  LICENSE
  README.md

references/public/epictetus-control-and-character/
  epictetus-control-and-character-<version>.kdna
  epictetus-control-and-character-<version>.kdna.sha256
  LICENSE
  README.md
```

Add two objects to `index/current.json.assets` with `access: "public"`.

## Agent 4 — one licensed reference

```text
references/licensed/atomspeak/
  atomspeak-<version>.kdna
  atomspeak-<version>.kdna.sha256
  LICENSE
  README.md
```

Add one object to `index/current.json.assets` with `access: "licensed"` and the
actual AtomSpeak license identifier/path. Do not copy or point at the root
CC-BY `LICENSE`.

## Agent 5 — two explicit Clusters

```text
clusters/<cluster-1-slug>/
  kdna.cluster.json
  kdna.cluster.json.sha256
  LICENSE
  README.md

clusters/<cluster-2-slug>/
  kdna.cluster.json
  kdna.cluster.json.sha256
  LICENSE
  README.md
```

Add two objects to `index/current.json.clusters`. The content author chooses
meaningful slugs and `cluster_id` values; both must match their index entry.
The manifest stays `kdna.cluster.json` and never becomes `.kdna`.

## Asset index object

```json
{
  "kind": "kdna-asset",
  "id": "@scope/asset-id",
  "publisher": {
    "name": "Publisher name",
    "url": "https://publisher.example"
  },
  "creator": {
    "name": "Creator name",
    "url": "https://creator.example"
  },
  "access": "public",
  "license": {
    "id": "SPDX-or-LicenseRef",
    "path": "references/public/asset-slug/LICENSE",
    "scope": "asset-content-and-distribution",
    "repository_license_applies": false
  },
  "version": "1.0.0",
  "digest": {
    "algorithm": "sha256",
    "value": "<64-lowercase-hex>"
  },
  "artifact": {
    "path": "references/public/asset-slug/asset-slug-1.0.0.kdna",
    "media_type": "application/vnd.kdna.asset"
  },
  "download": {
    "url": "https://github.com/aikdna/kdna-assets/releases/download/<tag>/<file>.kdna",
    "checksum_url": "https://github.com/aikdna/kdna-assets/releases/download/<tag>/<file>.kdna.sha256"
  },
  "technical_status": {
    "format": "valid",
    "plan_load": "ready",
    "load": "verified",
    "capsule": "verified",
    "verified_at": "<ISO-8601-date-time>",
    "toolchain": "@aikdna/kdna-cli@0.30.4"
  },
  "evidence_claims": []
}
```

For an unauthenticated licensed or remote check, `plan_load` may truthfully be
one of the schema's authorization states and `load`/`capsule` may be
`authorization-required`. Do not claim `verified` until an authorized load and
Capsule verification actually pass.

## Cluster index object

```json
{
  "kind": "kdna-cluster",
  "id": "@scope/cluster-id",
  "publisher": {
    "name": "Publisher name",
    "url": "https://publisher.example"
  },
  "creator": {
    "name": "Creator name"
  },
  "access": "public",
  "license": {
    "id": "SPDX-or-LicenseRef",
    "path": "clusters/cluster-slug/LICENSE",
    "scope": "asset-content-and-distribution",
    "repository_license_applies": false
  },
  "version": "1.0.0",
  "digest": {
    "algorithm": "sha256",
    "value": "<64-lowercase-hex>"
  },
  "manifest": {
    "path": "clusters/cluster-slug/kdna.cluster.json",
    "media_type": "application/vnd.kdna.cluster+json",
    "format": "kdna-cluster"
  },
  "download": {
    "url": "https://github.com/aikdna/kdna-assets/releases/download/<tag>/kdna.cluster.json",
    "checksum_url": "https://github.com/aikdna/kdna-assets/releases/download/<tag>/kdna.cluster.json.sha256"
  },
  "technical_status": {
    "manifest": "valid",
    "plan_use": "verified",
    "plan_state": "blocked",
    "verified_at": "<ISO-8601-date-time>",
    "toolchain": "@aikdna/kdna-cli@0.30.4"
  },
  "evidence_claims": []
}
```

`plan_state: "blocked"` is honest when the publication check can construct a
Cluster plan but member assets are not installed/authorized in that
environment. It is not a behavior-value claim.

## Required checks

```bash
npm ci
npm test
npm run audit
npm run check:releases
```

The Release check expects the exact artifact and `.sha256` sidecar to exist at
the pinned tag before the index PR can pass.
