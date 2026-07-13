# KDNA Assets

AIKDNA's public reference display repository for current KDNA assets, licensed
references, explicit Cluster manifests, and historical release records.

## Current status

| Surface | Path | Current entries |
|---|---|---:|
| Public reference assets | `references/public/` | 0 |
| Licensed reference assets | `references/licensed/` | 0 |
| Cluster manifests | `clusters/` | 0 |
| Historical archive | `archive/` | 52 |

`index/current.json` is valid when both `assets` and `clusters` are empty. New
entries appear only after their own artifact, license, digest, release, and
technical checks exist.

## Repository model

```text
references/
  public/                  current public `.kdna` references
  licensed/                current licensed `.kdna` references
clusters/                  current `kdna.cluster.json` manifests
index/current.json         machine-readable current index
archive/
  index.json               machine-readable 52-entry archive index
  artifacts/               47 repository-tracked historical binaries
  checksums/               preserved historical sidecars
  showcase/                historical descriptive pages
schemas/                   current and archive index schemas
scripts/                   validation and publication checks
tests/fixtures/            positive and negative infrastructure fixtures
```

Current and historical material never share an index or onboarding path.
Public and licensed assets never share a directory. A Cluster manifest is JSON
composition metadata; it is not a `.kdna` file and does not use single-asset
load commands.

## What a current listing records

Every current Asset or Cluster entry records:

- publisher and creator;
- access mode and per-entry license;
- version and SHA-256 digest;
- checked-in artifact/manifest path and GitHub Release download URLs;
- technical validation state;
- optional, bounded evidence claims.

Listing means only that AIKDNA chose to display the entry under this
repository's policy. It does not mean AIKDNA, KDNA Core, or the protocol
endorses the content, certifies expertise, guarantees correctness, recommends
the judgment, or treats it as official truth.

## Create KDNA anywhere

No author needs this repository, AIKDNA approval, Human Lock, behavior
evidence, or expert status to create or publish KDNA. This repository is one
optional AIKDNA display surface, not a protocol registry, marketplace,
creation gate, or content court.

The protocol separates:

1. structural/runtime validity;
2. provenance;
3. authorization and license;
4. optional behavior or field evidence;
5. display status in this repository.

Passing or failing one dimension does not silently decide another.

## Current asset lifecycle check

Agents and applications consume current assets only through the official
toolchain:

```text
validate → plan-load → authorization → load → Runtime Capsule
```

Run the repository checks with:

```bash
npm ci
npm test
npm run audit
```

The asset check never unpacks a container or decodes `payload.kdnab`. Public
assets must complete a live load and Capsule check. Licensed/remote assets may
truthfully report an authorization-required state in unauthenticated CI; a
release owner must complete the authorized load before claiming it as verified.

## Cluster lifecycle check

Cluster entries use only the explicit Cluster path:

```text
kdna cluster validate <kdna.cluster.json>
kdna cluster plan-use <kdna.cluster.json> --task="..." --as=json
```

Cluster plan success is a technical claim, not proof of marginal behavior
value. Cluster remains explicit and advanced; it is never invoked by current
single-asset onboarding.

## Historical archive

`archive/index.json` retains all 52 superseded entries and their unchanged
SHA-256 values and release identities. Forty-seven matching checksum sidecars
and the historical showcase pages remain in the repository; the other five
entries remain represented by their release records.

These releases predate the sole current CBOR payload contract. Do not restore
them through direct decode, JSON fallback, binary regeneration, or relabeling.
Archive pages provide historical download/integrity information only and do
not provide current Agent loading commands.

The July 2026 behavior experiments did not prove the preregistered incremental
value gates for the tested old assets or Cluster. That limits claims about
those tested artifacts; it does not limit the KDNA protocol or anyone's right
to author new assets.

## License

See [`LICENSE-POLICY.md`](LICENSE-POLICY.md). The repository-level
CC-BY-4.0 notice does not override an entry's own license and must never be
treated as licensing a current licensed reference by implication.

## Related

- [KDNA Core](https://github.com/aikdna/kdna)
- [`@aikdna/kdna-cli`](https://www.npmjs.com/package/@aikdna/kdna-cli)
- [`@aikdna/kdna-studio-cli`](https://www.npmjs.com/package/@aikdna/kdna-studio-cli)
- [Contribution and display policy](CONTRIBUTING.md)
- [Current entry handoff contract](ENTRY-CONTRACT.md)

Branch protection is enforced on `main`; changes land through reviewed pull
requests. This repository does not publish Releases as part of ordinary tests.
