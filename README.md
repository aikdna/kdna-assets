# KDNA Assets

Public release repository for official KDNA judgment asset files.

Each asset is distributed through a **GitHub Release** containing:

- The `.kdna` file
- A SHA256 checksum file
- A release card with purpose, usage, and limitations

## Download and use

```bash
# 1. Download
curl -LO https://github.com/aikdna/kdna-assets/releases/download/<tag>/<asset>.kdna
curl -LO https://github.com/aikdna/kdna-assets/releases/download/<tag>/<asset>.sha256

# 2. Verify checksum
shasum -a 256 -c <asset>.sha256

# 3. Validate
kdna validate ./<asset>.kdna

# 4. Generate LoadPlan
kdna plan-load ./<asset>.kdna

# 5. Load into an AI agent
kdna load ./<asset>.kdna --profile=compact --as=prompt
```

## Quick start: `agent:project_context` v0.1.0

The flagship release is `agent:project_context` — a judgment asset
that teaches an AI Agent to evaluate every line of `AGENTS.md` /
`CLAUDE.md` / `.cursorrules` before adding it.

```bash
# 1. Install kdna-cli (one-time)
npm install -g @aikdna/kdna-cli

# 2. Download the asset and its checksum
curl -L -o agent-project-context.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/agent-project-context-v0.1.0/agent-project-context.kdna
curl -L -o agent-project-context.kdna.sha256 \
  https://github.com/aikdna/kdna-assets/releases/download/agent-project-context-v0.1.0/agent-project-context.kdna.sha256

# 3. Verify (expected SHA: 521ad68e…dae0)
shasum -a 256 -c agent-project-context.kdna.sha256

# 4. Validate
kdna validate ./agent-project-context.kdna

# 5. Plan the load
kdna plan-load ./agent-project-context.kdna

# 6. Load into your AI agent
kdna load ./agent-project-context.kdna --profile=compact --as=prompt
```

See [`showcase/agent-project-context.md`](showcase/agent-project-context.md)
for what the asset judges, when to load it, and a worked
before/after.

## Available assets

| Asset | Version | SHA256 | Description |
|---|---|---|---|
| [viral-topic-selection.kdna](https://github.com/aikdna/kdna-assets/releases/tag/viral-topic-selection-v1.1.0) | 1.1.0 | `0b10ecc4...` | 爆款选题判断 — 4 axioms, 5 scenarios, 5 cases |
| [title-attraction.kdna](https://github.com/aikdna/kdna-assets/releases/tag/title-attraction-v1.0.0) | 1.0.0 | `c39ce0de...` | 标题吸引力判断 — 4 axioms, 5 scenarios, 4 cases |
| [short-video-script.kdna](https://github.com/aikdna/kdna-assets/releases/tag/short-video-script-v1.0.0) | 1.0.0 | `12242462...` | 短视频前三秒判断 — 4 axioms, 5 scenarios, 4 cases |
| [agent-project-context.kdna](https://github.com/aikdna/kdna-assets/releases/tag/v0.1.0-agent-project-context) | 0.1.0 | `521ad68e...` | Project context judgment — 5 axioms, 6 self-checks, 5 cases |
| [agent-completion-adjudication.kdna](https://github.com/aikdna/kdna-assets/releases/tag/v0.1.0-agent-completion-adjudication) | 0.1.0 | `76a97828...` | Completion adjudication — 5 axioms, 6 self-checks, 5 cases |

See [aikdna.com/en/assets](https://aikdna.com/en/assets) for the full gallery.

## What this is

A release repository for downloadable `.kdna` files — verified for format, safety, and loadability.

## What this is not

- **Not a registry** — no `kdna install`, no automatic indexing, no remote resolution
- **Not a marketplace** — no transactions, no rankings, no recommendations
- **Not an endorsement** — listing means format verification passed; it does not mean AIKDNA endorses the judgment content within

## Content neutrality

KDNA is content-neutral. Assets listed here have passed file format, safety, and loadability checks. This does not mean AIKDNA endorses the judgment content, guarantees its correctness, or recommends it for all contexts. Content quality and applicability are determined by the asset creator and the user.

## Related

- [KDNA CLI](https://github.com/aikdna/kdna-cli) — install via `npm install -g @aikdna/kdna-cli`
- [KDNA Studio CLI](https://github.com/aikdna/kdna-studio-cli) — create assets via `npm install -g @aikdna/kdna-studio-cli`
- [KDNA Core](https://github.com/aikdna/kdna) — protocol specification and core library
- [KDNA Website](https://aikdna.com) — documentation and asset gallery

## All releases

See the [Releases page](https://github.com/aikdna/kdna-assets/releases) for the full list of available assets with download links, checksums, and release cards.

## Machine-readable index

An `assets.json` index is maintained at the repo root for programmatic discovery:

```bash
curl -s https://raw.githubusercontent.com/aikdna/kdna-assets/main/assets.json
```

The index lists all released assets with their latest version, tag, SHA256, and release date.

---

Branch protection is enforced on `main`: pull request review required before merge.
