# KDNA Assets

> [aikdna.com](https://aikdna.com) · [`@aikdna/kdna-cli`](https://www.npmjs.com/package/@aikdna/kdna-cli)

Historical release archive for AIKDNA-published KDNA reference assets
(`.kdna`).

The archived releases predate the single current CBOR payload contract and are
not loadable by the current runtime. They remain downloadable with their
original checksums as historical demonstration artifacts; they are not the
current asset catalog and do not define what KDNA authors should create.

## Current quick start

Generate a canonical demonstration locally with the official toolchain:

```bash
npm install -g @aikdna/kdna-cli
kdna demo judgment ./demo-judgment
kdna pack ./demo-judgment ./demo-judgment.kdna
kdna validate ./demo-judgment.kdna --runtime
kdna plan-load ./demo-judgment.kdna --json
kdna load ./demo-judgment.kdna --profile=compact --as=json
```

The last command returns a Runtime Capsule. Agents and applications consume
the Capsule projection; they must not unpack the asset or decode
`payload.kdnab` directly.

## Archive status

`assets.json` is the machine-readable historical index. It currently contains
52 `superseded` entries and zero active entries. Forty-seven local showcase
artifacts are preserved from the pre-CBOR generation; five older releases are
kept by release URL only.

Every archived entry records:

- its original filename, version, tag, and SHA256;
- its original GitHub Release URL and checksum sidecar;
- `compatible_with_current_format: false`;
- a `superseded_reason` that points authors to current Studio/CLI export.

Public showcase download snippets are checked against the index:

```bash
node scripts/check-showcase-downloads.mjs
```

The public metadata audit keeps historical checksums and release URLs honest.
If a future current-format reference asset is added, its payload counts are
checked through the official CLI and Runtime Capsule rather than direct ZIP or
payload decoding:

```bash
python3 scripts/audit-public-metadata.py
```

## What this repository is not

- Not a registry, marketplace, ranking, or recommendation service.
- Not an authoring workspace or private asset incubator.
- Not the source of truth for the KDNA protocol or current wire format.
- Not a requirement that the KDNA project produce official content assets.

Anyone may create, package, publish, modify, license, or sell their own KDNA
assets through the open protocol and official/compatible toolchain. AIKDNA is
not the judge of whether the asset's judgment is good, true, or worthy of
existence.

## Content neutrality

KDNA represents judgment, taste, values, standards, boundaries, and decision
patterns. It does not define truth or facts. An archived or current-format
listing can describe format, integrity, compatibility, and evidence claims;
it never means AIKDNA endorses the judgment content or guarantees task fit.

## License

CC-BY-4.0 for the archived reference content. Asset creators retain copyright
in their judgment content.

## Related

- [`@aikdna/kdna-cli`](https://www.npmjs.com/package/@aikdna/kdna-cli) — inspect, validate, authorize, load, and manage assets
- [`@aikdna/kdna-studio-cli`](https://www.npmjs.com/package/@aikdna/kdna-studio-cli) — create and export assets
- [KDNA Core](https://github.com/aikdna/kdna) — protocol and runtime contract
- [kdna-loader skill](https://github.com/aikdna/kdna-skills) — Agent-side toolchain integration

---

Branch protection is enforced on `main`: pull request review required before merge.
