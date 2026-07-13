# Contributing to AIKDNA's reference display

This policy governs only what AIKDNA chooses to display in this repository. It
does not govern who may create or publish KDNA.

## Open creation

Anyone may create, package, license, distribute, or publish KDNA without:

- joining this repository;
- AIKDNA review or approval;
- behavior evidence or field validation;
- an expert credential;
- an entry in any registry or catalog.

KDNA Core validates protocol structure and runtime contracts. It does not judge
whether content is correct, valuable, tasteful, expert, or worthy of existence.

## Independent dimensions

| Dimension | Question | Does not prove |
|---|---|---|
| Structure/runtime | Does the file validate, plan, load when authorized, and produce the required Capsule or plan? | Content quality or truth |
| Provenance | Are creator and publisher recorded? | Expertise or endorsement |
| Authorization/license | Is distribution and use authorized under the entry's own license? | Runtime validity or value |
| Evidence | Is a bounded optional claim linked to evidence? | Universal usefulness |
| Display status | Has AIKDNA chosen to show it here? | Protocol approval or official truth |

Evidence may support a specific claim or display decision. It is never a KDNA
creation credential.

## Entry kinds

### Public reference asset

```text
references/public/<asset-slug>/
  <asset-slug>-<version>.kdna
  <asset-slug>-<version>.kdna.sha256
  LICENSE
  README.md
```

### Licensed reference asset

Use the same layout under `references/licensed/<asset-slug>/`. Its own license
and authorization terms govern it; it must not inherit the root license.

### Cluster manifest

```text
clusters/<cluster-slug>/
  kdna.cluster.json
  kdna.cluster.json.sha256
  LICENSE
  README.md
```

A Cluster manifest is not `.kdna`. Validate and plan it with Cluster commands,
never single-asset loading commands.

## Required metadata

Add one entry to `index/current.json` following
`schemas/current-index.schema.json`. Every entry records:

- stable identity and version;
- publisher and creator;
- access mode and entry-local license;
- SHA-256 digest;
- local artifact or manifest path;
- pinned GitHub Release download and checksum URLs;
- technical status and verification time;
- optional evidence claims only when a public URL supports the exact claim.

Do not use listing language that implies endorsement, official status,
correctness, quality ranking, expert certification, or protocol truth.

## Submission sequence

1. Create the entry directory, artifact or manifest, checksum, license, and
   public usage guide.
2. Run the applicable official toolchain checks.
3. Create a pinned GitHub Release containing the exact artifact and sidecar.
4. Add the matching entry to `index/current.json`.
5. Run `npm test`, `npm run audit`, and `npm run check:releases`.
6. Open a signed-off pull request for review.

Repository tests never publish, replace, or delete Releases.

## Technical gates

```bash
node scripts/check-current-assets.mjs
node scripts/check-clusters.mjs
npm run audit
```

The checks reject path, digest, license, lifecycle, Runtime Capsule, Cluster
manifest, and Release inconsistencies. Technical success does not create a
behavior or field-value claim.

## Sign-off

```bash
git commit -s
```
