# Contributing to AIKDNA's reference display

This document governs only what AIKDNA chooses to display in this repository.
It is not the KDNA protocol's creation or publication policy.

## You do not need this repository

Anyone may create, package, license, distribute, or publish KDNA without:

- joining this repository;
- AIKDNA review or approval;
- Human Lock;
- behavior evidence or field validation;
- an “expert” credential;
- an entry in any registry or catalog.

KDNA Core validates protocol structure and runtime contracts. It does not judge
whether content is correct, valuable, tasteful, expert, or worthy of existence.

## Separate dimensions

AIKDNA reviews reference entries across independent dimensions:

| Dimension | Question | Does not prove |
|---|---|---|
| Structure/runtime | Does the file validate, plan, load when authorized, and produce the required Capsule/plan? | Content quality or truth |
| Provenance | Are creator and publisher recorded? | Expertise or endorsement |
| Authorization/license | Is distribution and use authorized under the entry's own license? | Runtime validity or value |
| Evidence | Is a bounded optional claim linked to evidence? | Universal usefulness |
| Display status | Has AIKDNA chosen to show it here? | Protocol approval or official truth |

Human review, Human Lock, comparison tests, and field evidence may support a
specific claim or AIKDNA's own display decision. They are never KDNA creation
credentials.

## Entry kinds

### Public reference asset

Use:

```text
references/public/<asset-slug>/
```

The artifact is a current `.kdna` container with an entry-local license.

### Licensed reference asset

Use:

```text
references/licensed/<asset-slug>/
```

The artifact is a current `.kdna` container. Its own license and authorization
terms govern it. Do not point at the root `LICENSE`; repository CC-BY does not
override or absorb licensed content.

### Cluster manifest

Use:

```text
clusters/<cluster-slug>/kdna.cluster.json
```

A Cluster manifest is not `.kdna`. Validate and plan it with Cluster commands,
never single-asset loading commands.

### Historical material

Do not add old material to current paths. Historical entries belong only in
`archive/` and may not include current onboarding or Agent load commands.

## Required current metadata

Add one entry to `index/current.json` following
`schemas/current-index.schema.json`. Every entry requires:

- `kind`, stable `id`, and `version`;
- `publisher` and `creator`;
- `access`;
- per-entry `license` with `repository_license_applies: false`;
- SHA-256 `digest`;
- local artifact or manifest path;
- pinned GitHub Release download and checksum URLs;
- technical status and verification time;
- optional `evidence_claims` only when a public evidence URL supports the
  exact bounded claim.

Do not use listing language that implies endorsement, official status,
correctness, quality ranking, expert certification, or protocol truth.

## Submission sequence

1. Create the entry directory and its own `LICENSE` and `README.md`.
2. Add the exact current `.kdna` plus `.sha256`, or the exact
   `kdna.cluster.json` manifest plus `.sha256`.
3. Run the applicable toolchain checks.
4. Create a pinned GitHub Release containing the exact artifact and sidecar.
5. Add the entry to `index/current.json` with matching version, digest, and
   URLs.
6. Run `npm test` and `npm run audit`.
7. Open a signed-off pull request. Do not merge your own public PR without the
   required review.

Creating a GitHub Release is a deliberate maintainer action. Repository tests
never publish, replace, or delete Releases.

## Technical gates

For current assets:

```bash
node scripts/check-current-assets.mjs
```

For current Clusters:

```bash
node scripts/check-clusters.mjs
```

For indexes, digests, licensing, archive isolation, and Release consistency:

```bash
npm run audit
```

The checks fail if current onboarding points into `archive/`, an archive entry
appears in the current index, a Cluster is named `.kdna`, a digest drifts, a
Release URL disagrees with its index entry, or a current license is missing or
inherits the root license.

## Historical protection

Never:

- delete one of the 52 archive entries;
- edit a historical SHA-256;
- regenerate an old binary;
- decode an old JSON payload and repackage it as current CBOR;
- add a compatibility fallback to make an old release load;
- move archive URLs or commands into current onboarding.

If legitimate historical source inspires a new asset, author a new identity
through the current toolchain and publish it as a distinct versioned work.

## Sign-off

Sign off commits:

```bash
git commit -s
```
