# KDNA Assets

Public release repository for official KDNA judgment asset files.

Each asset is distributed through a **GitHub Release** containing:

- The `.kdna` runtime file
- A `.sha256` checksum file (same basename + `.sha256`)
- A release card with purpose, usage, and limitations

## License

This repository is released under **CC-BY-4.0** (see the
`LICENSE` file at the repo root). Asset creators retain
copyright on the judgment content; users are free to use,
modify, and redistribute with attribution to the source.

## Quick start

> Requires `kdna-cli ≥ 0.27.4` and a Linux / macOS shell.
> `kdna-cli` is the runtime for `.kdna` v1 files; it is
> separate from `kdna-studio-cli` (which authors assets).

### Install kdna-cli

```bash
npm install -g @aikdna/kdna-cli@0.27.4
kdna --version   # should print 0.27.4
```

### Use an asset — the two A-layer flagship assets

```bash
# 1. Download agent:project_context v0.1.2
curl -L -O \
  https://github.com/aikdna/kdna-assets/releases/download/agent-project-context-v0.1.2/agent-project-context-v0.1.2.kdna
curl -L -O \
  https://github.com/aikdna/kdna-assets/releases/download/agent-project-context-v0.1.2/agent-project-context-v0.1.2.kdna.sha256

# 2. Verify the SHA256 (fails loudly if anything is wrong)
shasum -a 256 -c agent-project-context-v0.1.2.kdna.sha256

# 3. Validate the v1 container (format / schema / payload / checksums)
kdna validate agent-project-context-v0.1.2.kdna

# 4. Probe load-readiness
kdna plan-load agent-project-context-v0.1.2.kdna

# 5. Load the compact-profile prompt into your AI agent
kdna load agent-project-context-v0.1.2.kdna --profile=compact --as=prompt
```

```bash
# Same 5 steps for agent:completion_adjudication v0.1.1
curl -L -O https://github.com/aikdna/kdna-assets/releases/download/agent-completion-adjudication-v0.1.1/agent-completion-adjudication-v0.1.1.kdna
curl -L -O https://github.com/aikdna/kdna-assets/releases/download/agent-completion-adjudication-v0.1.1/agent-completion-adjudication-v0.1.1.kdna.sha256
shasum -a 256 -c agent-completion-adjudication-v0.1.1.kdna.sha256
kdna validate agent-completion-adjudication-v0.1.1.kdna
kdna plan-load agent-completion-adjudication-v0.1.1.kdna
kdna load agent-completion-adjudication-v0.1.1.kdna --profile=compact --as=prompt
```

### What the asset does (one-liners)

- **`agent:project_context`** — judges every candidate line
  in an Agent-facing project document (AGENTS.md / CLAUDE.md
  / codex.md / .cursorrules) as CARRY / RELOCATE / DROP /
  CONVERT. Read the
  [showcase](showcase/agent-project-context.md) for the
  full before/after.
- **`agent:completion_adjudication`** — forces the Agent to
  surface four cells (DONE CLAIM / OBSERVABLE PROOF / USER
  INTENT MATCH / UNRESOLVED RISK) before any "I'm done"
  claim. Read the
  [showcase](showcase/agent-completion-adjudication.md).

## Available assets

| Asset | Version | SHA256 | Description |
|---|---|---|---|
| [viral-topic-selection.kdna](https://github.com/aikdna/kdna-assets/releases/tag/viral-topic-selection-v1.1.0) | 1.1.0 | `8cc71e23...` | 爆款选题判断 — 4 axioms, 6 self-checks, 2 cases |
| [title-attraction.kdna](https://github.com/aikdna/kdna-assets/releases/tag/title-attraction-v1.0.0) | 1.0.0 | `c39ce0de...` | 标题吸引力判断 — 4 axioms, 7 self-checks, 2 cases |
| [short-video-script.kdna](https://github.com/aikdna/kdna-assets/releases/tag/short-video-script-v1.0.0) | 1.0.0 | `12242462...` | 短视频前三秒判断 — 4 axioms, 9 self-checks, 2 cases |
| [agent-project-context-v0.1.2.kdna](https://github.com/aikdna/kdna-assets/releases/tag/agent-project-context-v0.1.2) | 0.1.2 | `37280460...` | Project context judgment — 5 axioms, 6 self-checks, 5 cases |
| [agent-completion-adjudication-v0.1.1.kdna](https://github.com/aikdna/kdna-assets/releases/tag/agent-completion-adjudication-v0.1.1) | 0.1.1 | `2f46bccc...` | Completion adjudication — 5 axioms, 6 self-checks, 5 cases |

See [aikdna.com/en/assets](https://aikdna.com/en/assets) for the full gallery.

## Per-asset download / verify (working commands)

All 5 assets now use the unified sidecar naming convention
`<name>-<version>.kdna.sha256`. The 3 legacy content-domain
assets previously had sidecars under the old naming
`<name>.sha256`; those old sidecars are kept on the releases
for a transition period (6-12 months) and will be removed
in a future PR. The commands below use the new naming.

The 2 A-layer flagship assets have their `.kdna` file in the
new naming (`<name>-<version>.kdna`). The 3 legacy content-domain
assets have their `.kdna` file in the old naming (`<name>.kdna`,
no version suffix) — only their sidecar is in the new naming.
This is because the legacy 3 were published before the new
naming was introduced; rebuilding them with the new naming
is a separate (deferred) task.

```bash
# viral-topic-selection v1.1.0 (legacy content-domain)
curl -L -O https://github.com/aikdna/kdna-assets/releases/download/viral-topic-selection-v1.1.0/viral-topic-selection.kdna
curl -L -O https://github.com/aikdna/kdna-assets/releases/download/viral-topic-selection-v1.1.0/viral-topic-selection-v1.1.0.kdna.sha256
shasum -a 256 -c viral-topic-selection-v1.1.0.kdna.sha256
kdna validate viral-topic-selection.kdna
kdna plan-load viral-topic-selection.kdna
kdna load viral-topic-selection.kdna --profile=compact --as=prompt
```

```bash
# title-attraction v1.0.0 (legacy content-domain)
curl -L -O https://github.com/aikdna/kdna-assets/releases/download/title-attraction-v1.0.0/title-attraction.kdna
curl -L -O https://github.com/aikdna/kdna-assets/releases/download/title-attraction-v1.0.0/title-attraction-v1.0.0.kdna.sha256
shasum -a 256 -c title-attraction-v1.0.0.kdna.sha256
kdna validate title-attraction.kdna
kdna plan-load title-attraction.kdna
kdna load title-attraction.kdna --profile=compact --as=prompt
```

```bash
# short-video-script v1.0.0 (legacy content-domain)
curl -L -O https://github.com/aikdna/kdna-assets/releases/download/short-video-script-v1.0.0/short-video-script.kdna
curl -L -O https://github.com/aikdna/kdna-assets/releases/download/short-video-script-v1.0.0/short-video-script-v1.0.0.kdna.sha256
shasum -a 256 -c short-video-script-v1.0.0.kdna.sha256
kdna validate short-video-script.kdna
kdna plan-load short-video-script.kdna
kdna load short-video-script.kdna --profile=compact --as=prompt
```

```bash
# agent:project_context v0.1.2 (A-layer flagship)
curl -L -O https://github.com/aikdna/kdna-assets/releases/download/agent-project-context-v0.1.2/agent-project-context-v0.1.2.kdna
curl -L -O https://github.com/aikdna/kdna-assets/releases/download/agent-project-context-v0.1.2/agent-project-context-v0.1.2.kdna.sha256
shasum -a 256 -c agent-project-context-v0.1.2.kdna.sha256
kdna validate agent-project-context-v0.1.2.kdna
kdna plan-load agent-project-context-v0.1.2.kdna
kdna load agent-project-context-v0.1.2.kdna --profile=compact --as=prompt
```

```bash
# agent:completion_adjudication v0.1.1 (A-layer flagship)
curl -L -O https://github.com/aikdna/kdna-assets/releases/download/agent-completion-adjudication-v0.1.1/agent-completion-adjudication-v0.1.1.kdna
curl -L -O https://github.com/aikdna/kdna-assets/releases/download/agent-completion-adjudication-v0.1.1/agent-completion-adjudication-v0.1.1.kdna.sha256
shasum -a 256 -c agent-completion-adjudication-v0.1.1.kdna.sha256
kdna validate agent-completion-adjudication-v0.1.1.kdna
kdna plan-load agent-completion-adjudication-v0.1.1.kdna
kdna load agent-completion-adjudication-v0.1.1.kdna --profile=compact --as=prompt
```

> **Transition note**: the 3 legacy assets also have sidecars
> under the old naming (`<name>.sha256` without `.kdna`).
> These are kept on the releases for backward compatibility
> but will be removed in a future PR. **Use the new naming
> above for all new work.**

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
  install via `npm install -g @aikdna/kdna-cli@0.27.4`
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
