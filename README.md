# KDNA Assets

> [aikdna.com](https://aikdna.com) · [`@aikdna/kdna-cli`](https://www.npmjs.com/package/@aikdna/kdna-cli)

Public release repository for official KDNA judgment asset files (`.kdna`).

A `.kdna` asset is a portable, inspectable, and verifiable container of domain judgment — the principles an expert reasons from, the traps they avoid, and the self-checks they run before deciding. Load it into any supported AI agent with one command.

```bash
npm install -g @aikdna/kdna-cli
kdna load <asset>.kdna --profile=compact --as=prompt
```

## What this repo is

A **release repository** for downloadable `.kdna` files. Every asset listed here:

- Was produced by the private incubator pipeline (10-gate quality standard)
- Passes `kdna validate` (format, schema, payload, checksums, load contract)
- Ships with SHA256 checksums, public release artifacts, and recorded
  source-to-release evidence

## What this repo is NOT

- **Not a registry** — no `kdna install`, no remote resolution, no automatic indexing
- **Not a marketplace** — no transactions, no rankings, no recommendations
- **Not an archive** — superseded assets are removed; superseded releases keep their download links but are not listed here
- **Not an incubator** — assets are authored and built in a private incubator, not here

## Current assets

See the [Releases page](https://github.com/aikdna/kdna-assets/releases) and `assets.json` index for the current list. The current active set contains 47 assets: 31 developer judgment assets and 16 creator judgment assets. Historical superseded assets remain downloadable for compatibility and are marked as `superseded` in the index.

Many assets include companion `showcase/<asset>.md` notes. The machine-readable truth for all current assets is `assets.json` plus each release's `.kdna` and `.sha256` files.

Public showcase download snippets are checked against `assets.json`:

```bash
node scripts/check-showcase-downloads.mjs
```

## Machine-readable index

An `assets.json` index at the repo root lists all current assets with version, tag, SHA256, and release date. Some entries include a `source_payload_parity` block documenting the source-to-payload field mapping.

```bash
curl -s https://raw.githubusercontent.com/aikdna/kdna-assets/main/assets.json
```

For active assets, the public metadata audit checks the full integrity chain:
`assets.json` SHA, the checked-in `.kdna` file, the checked-in `.kdna.sha256`
sidecar, the GitHub Release download, the release sidecar, and runtime payload
counts.

```bash
python3 scripts/audit-public-metadata.py
```

## How to use with your AI agent

**For agents with the `kdna-loader` skill installed** (Claude Code, Codex, OpenCode, Cursor):
```bash
kdna install <asset>.kdna
# The agent will automatically discover and load it per task
```

**Manual injection** (any agent):
```bash
kdna load <asset>.kdna --profile=compact --as=prompt
# Copy the output into your system prompt or context
```

## Download and verify

```bash
# Download .kdna + .sha256 from the GitHub Release
curl -LO https://github.com/aikdna/kdna-assets/releases/download/<tag>/<asset>.kdna
curl -LO https://github.com/aikdna/kdna-assets/releases/download/<tag>/<asset>.kdna.sha256

# Verify
shasum -a 256 -c <asset>.kdna.sha256
kdna validate <asset>.kdna
```

## Content neutrality

KDNA is content-neutral. Listing an asset means it passed format, safety, and loadability checks. This does not mean AIKDNA endorses the judgment content, guarantees its correctness, or recommends it for all contexts. Content quality and applicability are determined by the asset creator and the user.

## License

CC-BY-4.0. Asset creators retain copyright on the judgment content; users are free to use, modify, and redistribute with attribution to the source.

## Related

- [`@aikdna/kdna-cli`](https://www.npmjs.com/package/@aikdna/kdna-cli) — `npm install -g @aikdna/kdna-cli`
- [`@aikdna/kdna-studio-cli`](https://www.npmjs.com/package/@aikdna/kdna-studio-cli) — authoring tool for `.kdna` files
- [KDNA Core](https://github.com/aikdna/kdna) — protocol specification
- [KDNA Website](https://aikdna.com) — documentation and asset gallery
- [kdna-loader skill](https://github.com/aikdna/kdna-skills) — agent-side auto-loading

---

Branch protection is enforced on `main`: pull request review required before merge.
