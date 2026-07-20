> **Development snapshot — release reset in progress**
>
> This repository is not currently a stable, beta, or production-ready
> release. Published packages and documentation may describe an earlier
> development snapshot. A new Development Preview has not been released.

# KDNA Assets

AIKDNA's public reference display for KDNA assets.

## Current public surface

| Surface | Path | Entries |
|---|---|---:|
| Public reference assets | `references/public/` | 2 |
| Licensed reference assets | `references/licensed/` | 0 |
| Cluster manifests | `clusters/` | 0 |

The repository intentionally starts with two independent single-asset
references:

- Laozi-Inspired Wuwei Judgment;
- Epictetus-Inspired Control and Character Judgment.

Both are real `.kdna` files that validate and load through the official KDNA
toolchain. They demonstrate how an author can express a coherent judgment
system as a portable KDNA asset. They are not official truth, content
standards, or judgments that other authors must follow.

The current 0.1.1 artifacts were rebuilt through the published Core 0.20.0,
Studio Core 2.0.2, and Studio CLI 0.10.2 chain. Their accepted cross-profile
semantic, reproducibility, review-boundary, and clean-room evidence is recorded
in [`evidence/rebuild-receipt-2026-07-18.json`](evidence/rebuild-receipt-2026-07-18.json).

There is no current Cluster. Cluster remains a supported, explicit advanced
path, but future Cluster examples will be designed and evaluated from a new
problem definition instead of inheriting earlier experiments.

## Repository model

```text
references/
  public/                  current public `.kdna` references
  licensed/                reserved for future licensed references
clusters/                  reserved for future `kdna.cluster.json` manifests
index/current.json         machine-readable current index
schemas/                   current index contract
scripts/                   validation and publication checks
tests/fixtures/            positive and negative infrastructure fixtures
```

Public and licensed assets never share a directory. A Cluster manifest is JSON
composition metadata; it is not a `.kdna` file and does not use single-asset
load commands.

## Create KDNA anywhere

Anyone may create, package, license, distribute, and publish KDNA without
AIKDNA approval or an entry in this repository. This repository is an optional
reference display, not a protocol registry, marketplace, creation gate, or
content court.

The protocol and this display keep these dimensions separate:

1. structural and runtime validity;
2. provenance;
3. authorization and license;
4. optional behavior or field evidence;
5. display status in this repository.

Passing or failing one dimension does not silently decide another.

## Official consumption boundary

Agents and applications consume `.kdna` assets through the official toolchain:

```text
validate → plan-load → authorization → load → Runtime Capsule
```

The repository checks do not unpack containers or decode `payload.kdnab`
directly. Current assets must complete a live load and Runtime Capsule check.

Run the checks with:

```bash
npm ci
npm test
npm run audit
npm run check:releases
```

## Cluster boundary

The single-asset path is the foundation and default. A future Cluster uses only
the explicit Cluster path:

```text
kdna cluster validate <kdna.cluster.json>
kdna cluster plan-use <kdna.cluster.json> --task="..." --as=json
```

A valid Cluster plan proves a technical contract, not marginal behavior value.
Any behavior claim must compare the Cluster with the correct single asset and
report routing, answer quality, pollution, and cost separately.

## License

See [`LICENSE-POLICY.md`](LICENSE-POLICY.md). Every displayed asset owns its
license; the repository-level license never overrides an entry's license.

## Related

- [KDNA Core](https://github.com/aikdna/kdna)
- [`@aikdna/kdna-cli`](https://www.npmjs.com/package/@aikdna/kdna-cli)
- [`@aikdna/kdna-studio-cli`](https://www.npmjs.com/package/@aikdna/kdna-studio-cli)
- [Contribution and display policy](CONTRIBUTING.md)
- [How the two reference assets were created](docs/creating-laozi-and-epictetus-kdna.md)
- [Accepted 0.1.1 rebuild receipt](evidence/rebuild-receipt-2026-07-18.json)

Branch protection is enforced on `main`; changes land through reviewed pull
requests. Tests never publish, replace, or delete GitHub Releases.
