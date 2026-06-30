# KDNA Assets

> [aikdna.com](https://aikdna.com) · [`@aikdna/kdna-cli`](https://www.npmjs.com/package/@aikdna/kdna-cli)

Public release repository for official KDNA judgment asset files.

A `.kdna` asset is a portable, inspectable, and verifiable container of domain judgment — the principles an expert reasons from, the traps they avoid, and the self-checks they run before deciding. Load it into any supported AI agent with one command.

```bash
npm install -g @aikdna/kdna-cli
kdna load agent-project-context-v0.1.2.kdna --profile=compact --as=prompt
```

## Current assets

Two production-quality assets are available today:

| Asset | Use case | Requires | Showcase |
|---|---|---|---|
| **agent:project_context v0.1.2** | Judges every line of an AGENTS.md / CLAUDE.md / codex.md for CARRY / RELOCATE / DROP / CONVERT | kdna-cli ≥ 0.28.31 | [showcase →](showcase/agent-project-context.md) |
| **agent:completion_adjudication v0.1.1** | Forces the agent to surface DONE CLAIM / OBSERVABLE PROOF / USER INTENT MATCH / UNRESOLVED RISK before any "I'm done" claim | kdna-cli ≥ 0.28.31 | [showcase →](showcase/agent-completion-adjudication.md) |

### Try them now

```bash
npm install -g @aikdna/kdna-cli

# agent:project_context — improve your AGENTS.md quality
curl -LO https://github.com/aikdna/kdna-assets/releases/download/agent-project-context-v0.1.2/agent-project-context-v0.1.2.kdna
kdna validate agent-project-context-v0.1.2.kdna
kdna load    agent-project-context-v0.1.2.kdna --profile=compact --as=prompt

# agent:completion_adjudication — close the "I'm done" gap
curl -LO https://github.com/aikdna/kdna-assets/releases/download/agent-completion-adjudication-v0.1.1/agent-completion-adjudication-v0.1.1.kdna
kdna validate agent-completion-adjudication-v0.1.1.kdna
kdna load    agent-completion-adjudication-v0.1.1.kdna --profile=compact --as=prompt
```

## How to use with your AI agent

Once loaded, the judgment context is injected into your agent's context. The agent behaves differently — it applies the domain's principles, avoids its documented failure modes, and runs its self-checks before responding. The user sees better answers; the KDNA mechanics stay silent.

**For agents with the kdna-loader skill installed** (OpenCode, Codex, Claude Code, Cursor):
```bash
kdna install agent-project-context-v0.1.2.kdna
# The agent will automatically discover and load it per task
```

**Manual injection** (any agent):
```bash
kdna load agent-project-context-v0.1.2.kdna --profile=compact --as=prompt
# Copy the output into your system prompt or context
```

## Download and verify

```bash
# agent:project_context v0.1.2
curl -LO https://github.com/aikdna/kdna-assets/releases/download/agent-project-context-v0.1.2/agent-project-context-v0.1.2.kdna
curl -LO https://github.com/aikdna/kdna-assets/releases/download/agent-project-context-v0.1.2/agent-project-context-v0.1.2.kdna.sha256
shasum -a 256 -c agent-project-context-v0.1.2.kdna.sha256
kdna validate agent-project-context-v0.1.2.kdna
```

```bash
# agent:completion_adjudication v0.1.1
curl -LO https://github.com/aikdna/kdna-assets/releases/download/agent-completion-adjudication-v0.1.1/agent-completion-adjudication-v0.1.1.kdna
curl -LO https://github.com/aikdna/kdna-assets/releases/download/agent-completion-adjudication-v0.1.1/agent-completion-adjudication-v0.1.1.kdna.sha256
shasum -a 256 -c agent-completion-adjudication-v0.1.1.kdna.sha256
kdna validate agent-completion-adjudication-v0.1.1.kdna
```

## Archive: content-domain assets (legacy)

The following three assets were published before the current authoring pipeline and are preserved for reference. They work with current `kdna-cli` but are not maintained. Use the assets above for new work.

| Asset | Description |
|---|---|
| [viral-topic-selection v1.1.0](https://github.com/aikdna/kdna-assets/releases/tag/viral-topic-selection-v1.1.0) | 爆款选题判断 — viral content topic evaluation |
| [title-attraction v1.0.0](https://github.com/aikdna/kdna-assets/releases/tag/title-attraction-v1.0.0) | 标题吸引力判断 — title attraction evaluation |
| [short-video-script v1.0.0](https://github.com/aikdna/kdna-assets/releases/tag/short-video-script-v1.0.0) | 短视频前三秒判断 — short video hook evaluation |

## License

CC-BY-4.0. Asset creators retain copyright on the judgment content; users are free to use, modify, and redistribute with attribution to the source.



## What this is

A release repository for downloadable `.kdna` files —
verified for format, safety, and loadability.

## What this is not

- **Not a registry** — no `kdna install`, no automatic
  indexing, no remote resolution
- **Not a marketplace** — no transactions, no rankings,
  no recommendations
- **Not an endorsement** — listing means format
  verification passed; it does not mean AIKDNA endorses
  the judgment content within

## Content neutrality

KDNA is content-neutral. Assets listed here have passed
file format, safety, and loadability checks. This does
not mean AIKDNA endorses the judgment content, guarantees
its correctness, or recommends it for all contexts.
Content quality and applicability are determined by the
asset creator and the user.

## Related

- [KDNA CLI](https://github.com/aikdna/kdna-cli) —
  install via `npm install -g @aikdna/kdna-cli@0.28.31`
- [KDNA Studio CLI](https://github.com/aikdna/kdna-studio-cli)
  — create assets via `npm install -g @aikdna/kdna-studio-cli`
- [KDNA Core](https://github.com/aikdna/kdna) — protocol
  specification and core library
- [KDNA Website](https://aikdna.com) — documentation and
  asset gallery

## All releases

See the [Releases page](https://github.com/aikdna/kdna-assets/releases)
for the full list of available assets with download links,
checksums, and release cards.

## Machine-readable index

An `assets.json` index is maintained at the repo root for
programmatic discovery:

```bash
curl -s https://raw.githubusercontent.com/aikdna/kdna-assets/main/assets.json
```

The index lists all released assets with their latest
version, tag, SHA256, and release date. The two A-layer
flagship assets include a `source_payload_parity` block
documenting the source-to-payload field mapping (verified
against the actual `payload.kdnab` contents).

## Showcases

The two A-layer flagship assets have dedicated showcase
docs that explain the failure mode they target and walk
through a real before/after:

- [showcase/agent-project-context.md](showcase/agent-project-context.md)
- [showcase/agent-completion-adjudication.md](showcase/agent-completion-adjudication.md)

The 3 legacy content-domain assets also have showcase
docs (added 2026-06-25):

- [showcase/viral-topic-selection.md](showcase/viral-topic-selection.md)
- [showcase/title-attraction.md](showcase/title-attraction.md)
- [showcase/short-video-script.md](showcase/short-video-script.md)

The legacy 3 are released-as-is from before the new
pipeline; see the legacy assets audit plan (private) for their
audit status.

---

Branch protection is enforced on `main`: pull request
review required before merge.
