# agent:project_context v0.1.0

> **别再乱写 AGENTS.md 了：项目文档不是项目百科，是 Agent 的判断压缩层。**

A loadable judgment asset that teaches an AI Agent to evaluate every line of `AGENTS.md` / `CLAUDE.md` / `.cursorrules` before adding it.

**SHA256:** `521ad68e8902b1083587e3bc642b9546462baacd9ff3336aafdd9902db93dae0`
**Release tag:** `agent-project-context-v0.1.0`
**Download:** <https://github.com/aikdna/kdna-assets/releases/tag/agent-project-context-v0.1.0>

---

## What it judges

Every candidate line of an Agent-facing project document must be
classified into one of four cells before being added:

| Cell | Question | Action |
|------|----------|--------|
| `CARRY` | Would the Agent make a mistake on the next task without this line? | Keep in AGENTS.md |
| `RELOCATE` | True about the project, but not for the Agent's long-term context | Move to README / docs / runbooks / issues |
| `DROP` | Pollutes judgment: vague, opinionated, redundant, or true everywhere | Delete |
| `CONVERT` | A real rule that is unenforceable as prose | Rewrite as a runnable command, linter rule, or schema check |

The asset ships 5 axioms, 5 failure-modes, and 5 worked cases in the runtime payload. The source tree in `kdna-x/A-agent-meta/project-context/` additionally defines 6 misjudgment patterns, 6 self-check rules, and 4 principle-to-action reasoning chains; the kdna-studio build does not currently surface all of those in the compact profile, see [the team's known gap list](#source-vs-payload-gap) for the open follow-up.

---

## Before

The Agent writes AGENTS.md like a project tour:

- A "Quick Start" section copied from README
- Universal platitudes ("be careful", "follow best practices", "use good judgment")
- Aspirational content ("we are planning to move to a monorepo")
- Style-guide duplication the linter already enforces
- Personal taste ("I prefer using interfaces early")

Result: a 100+ line document the Agent re-reads on every task and learns nothing from.

## After

The same Agent, with the asset loaded:

- Refuses to duplicate Quick Start ("the Agent has already read README")
- Rejects universal platitudes ("training the next reader to skim the document")
- Routes aspirational content to ROADMAP.md or issues
- Points at the linter instead of duplicating style rules
- Drops personal taste without project-specific reason

Result: a 30–50 line AGENTS.md that pays for itself on every task.

---

## Install (3 minutes)

```bash
# 1. Install kdna-cli
npm install -g @aikdna/kdna-cli

# 2. Download
curl -L -o agent-project-context.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/agent-project-context-v0.1.0/agent-project-context.kdna
curl -L -o agent-project-context.kdna.sha256 \
  https://github.com/aikdna/kdna-assets/releases/download/agent-project-context-v0.1.0/agent-project-context.kdna.sha256

# 3. Verify + validate + load
shasum -a 256 -c agent-project-context.kdna.sha256
kdna validate ./agent-project-context.kdna
kdna plan-load ./agent-project-context.kdna
kdna load ./agent-project-context.kdna --profile=compact --as=prompt
```

Requires `kdna-cli ≥ 0.27`. No external dependencies. Works with any AI agent that loads KDNA assets (Claude Code, Codex, OpenCode, custom Agent runtimes).

---

## When to load

- You are writing or expanding an `AGENTS.md` / `CLAUDE.md` for a project
- You are auditing an existing AGENTS.md that has grown past 100 lines
- The Agent keeps producing AGENTS.md-style content that does not match how you actually work
- You are migrating AGENTS.md content from one Agent to another
- The Agent is about to add a new line to AGENTS.md on its own

## When NOT to load

- You want a project `README.md` (different document, different reader)
- You want a `CONTRIBUTING.md` (human contributors, not the Agent)
- You are writing a one-off task prompt that will not be repeated
- You want a comprehensive Agent onboarding manual (this asset produces a judgment layer, not a manual)

---

## License

CC-BY-4.0.

## Source vs payload gap

The source tree in `kdna-x/A-agent-meta/project-context/KDNA_*.json`
defines a richer judgment content than the runtime `.kdna` payload
currently carries. The 6 misjudgment patterns, 6 self-check rules,
12 banned phrases, and 4 principle-to-action reasoning chains in
the source tree are not in the compact-profile payload that
`kdna load` renders. The compact payload has 5 axioms, 5
failure-modes (in `reasoning.failure_modes`), and 5 cases. The
full profile may surface more; the team's follow-up is to either
(a) update `KDNA_*.json` to use field names that kdna-studio
surfaces in compact, or (b) extend the kdna-studio migrate path
to map the source fields into the payload.
