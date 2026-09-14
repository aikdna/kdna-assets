# Contributing to AIKDNA's reference display

This policy governs only what AIKDNA chooses to display in this repository. It
does not govern who may create or publish KDNA.

## Open creation

Anyone may create, package, license, distribute, or publish KDNA without:

- joining this repository;
- AIKDNA review or approval;
- adoption, external-assessment, or field evidence;
- an expert credential;
- an entry in any registry or catalog.

KDNA Core validates protocol structure and runtime contracts. It does not judge
whether content is correct, valuable, tasteful, expert, or worthy of existence.

## Independent dimensions

| Dimension | Question | Does not prove |
|---|---|---|
| Structure/Read | What does the exact bound Core admit, and what public Read result is observed under explicit permission? | Content quality or truth |
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

A Cluster manifest is not `.kdna`. The retained Cluster layout and checks belong
to their historical toolchain. The current Read index requires an empty cluster
list; it does not provide a current Cluster planning or loading workflow.

## Required metadata

Add one entry to `index/current.json` following
the current schema 2 contract in `schemas/public-read-index.schema.json`.
`src/catalog.mjs` validates this schema and the current toolchain binding.
Every entry records:

- stable identity and version;
- publisher and creator;
- access mode and entry-local license;
- SHA-256 digest;
- local artifact or manifest path;
- a complete file inventory, explicit publication status and proof limits;
- the actual current Core/Read observation and verification time;
- `evidence_claims: []`, as required by the current schema's empty-array bound.

Do not add claims to the current index array. Any separately documented claim
belongs in the entry's documentation with its exact evidence and scope; it does
not change the index schema, technical observation or proof limits. Historical
claims retain their original scope.

Historical Release coordinates and receipts remain in their original reference
documents. An `unpublished_candidate` entry does not require or imply a new
Release; do not invent a download coordinate or change its publication status
from a successful local audit.

Do not use listing language that implies endorsement, official status,
correctness, quality ranking, expert certification, or protocol truth.

## Submission sequence

1. Create the entry directory, artifact or manifest, checksum, license, and
   public usage guide.
2. Run the applicable official toolchain checks.
3. Record the actual publication status and preserve existing Release evidence.
   A repository entry or test run is not permission to publish a new Release.
4. Add the matching schema 2 entry and file inventory to `index/current.json`.
5. Run `npm test`, `npm run validate:indexes`, `npm run audit`, and
   `npm run audit:read` with the exact current installed graph.
6. Open a signed-off pull request for review.

Repository tests never publish, replace, or delete Releases.

## Technical gates

```bash
npm run validate:indexes
npm run audit
npm run audit:read
```

The current checks reject inconsistent schema, paths, digests, file inventories,
licenses, dependency bytes and Core/Read observations. A faithfully recorded
Core rejection is an observation, not current readability. Old Capsule, Cluster
and Release checkers retain their historical scope; they do not replace these
current entry points. Technical success does not create an adoption,
external-assessment, or field-outcome claim.

## Sign-off

```bash
git commit -s
```
