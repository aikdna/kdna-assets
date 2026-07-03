# agent:project_context — Don't write a project wiki. Write project judgment.

> **AGENTS.md is not a project encyclopedia. It's a compressed layer of project-specific judgment.**

A KDNA asset that judges every candidate line in an Agent-facing
project document (AGENTS.md / CLAUDE.md / codex.md /
.cursorrules) — classifying it into one of four cells:

| Cell | Meaning |
|---|---|
| **CARRY** | line addresses a specific Agent behavior failure or constraint that has been hit. Keep it. |
| **RELOCATE** | line is real but belongs in README, runbook, linter config, or issue tracker, not in the per-task load path. |
| **DROP** | line is a platitude, an aspirational statement, project-tour content, or personal taste. Delete. |
| **CONVERT** | line is a real rule but unenforceable as prose. Convert it to a runnable check (linter, schema validator, test). |

## Why this exists

A 2000-line "Agent bible" gets ignored. A 50-line AGENTS.md
that says "do not write to `models/` directly — enforced by
`make schema:check`" actually changes Agent behavior.

The difference is not length. It's whether each line answers
**"what would the Agent get wrong without this?"**

Most AGENTS.md files fail this test. They contain:

- **Project tours** (Quick Start, repo layout) — belongs in
  README, not in the per-task load path
- **Universal platitudes** ("be careful", "follow best
  practices") — apply to every project, so they say nothing
  about this project
- **Style-guide duplication** (2-space indent, single quotes)
  — enforced by `gofmt`; the prose is noise
- **Personal taste** ("I find that interfaces early help") —
  first-person taste, not project judgment
- **Future plans** ("we are planning to move to a monorepo") —
  not current judgment, rots within a quarter
- **Unenforceable rules** ("all endpoints must validate input")
  — the rule is real but prose cannot check it

The asset exists so an Agent, when asked to add a line to
AGENTS.md, can run the four-cell classification instead of
just appending it.

## Before: a 200-line AGENTS.md that gets ignored

```markdown
# AGENTS.md

## Quick Start
Clone the repo, install Go 1.22, run make setup, then make dev...

## Code Style
Use 2-space indentation, single quotes, import order follows
goimports, naming follows Effective Go...

## Best Practices
- Be careful when refactoring.
- Follow best practices.
- Write clean code.
- Use good judgment when making trade-offs.
- Always consider edge cases.
- Follow the style guide.
- Keep it simple.
- Be consistent.

## Architecture
... 80 lines of project tour ...

## Roadmap
We are planning to move to a monorepo. In the future we will...

## My Preferences
I find that using interfaces early helps. In my experience,
dependency injection is good. We usually use a certain pattern...
```

**What this costs:** 200 lines × ~0.05–0.1s per line =
**10–20 seconds of Agent attention per task** on a document
that contributes zero project-specific judgment.

Worse: the platitudes train the Agent to **ignore the
entire AGENTS.md**. The few real rules in the document are
now skimmed past.

## After: a 50-line AGENTS.md that does the job

```markdown
# AGENTS.md

## Stack
Go 1.22, go modules. No vendoring.

## Architecture
- All HTTP handlers live in internal/api/.
- All DB writes go through repo/. Never write to models/ directly.
- Logging is structured (slog). Never use fmt.Print for logging.

## Forbidden
- Do not edit migrations/ without a backout plan in the PR description.
- Do not add a new direct dependency; use internal/ wrappers.
- Do not commit secrets. .env* is gitignored; copy from .env.example.

## Verification
Run before opening a PR:
- make lint
- make test
- make schema:check

## Releasing
See runbooks/release.md. AGENTS.md does not duplicate it.
```

**What this gains:** every line answers a specific
**"what would the Agent get wrong without this?"** question.
The Agent reads it on every task and the cost is paid back.

## The four-cell classification (how the asset works)

When you load this asset and ask the Agent to add a line,
the Agent runs the following judgment:

```
For each candidate line, ask:
  1. Does this line address a specific behavior failure or
     constraint that has been hit in this project?
     NO  → DROP (platitude / aspirational / tour / taste)
     YES → continue

  2. Does the Agent need this line on every task, or only
     occasionally (e.g. only when releasing)?
     OCCASIONALLY → RELOCATE to runbook / linter config / issue
     EVERY TASK   → continue

  3. Is this a *judgment rule* (the Agent must weigh per-case)
     or a *check rule* (binary correct/incorrect)?
     CHECK RULE  → CONVERT to a runnable check
     JUDGMENT RULE → continue

  4. Is the line project-specific (would not survive a copy
     from another project's AGENTS.md)?
     NO  → DROP (universal platitude)
     YES → CARRY
```

## Examples of the four cells in action

| Candidate line | Cell | Why |
|---|---|---|
| "All HTTP handlers live in `internal/api/`." | CARRY | project-specific, judgment rule, every task |
| "Run `make lint` before opening a PR." | CONVERT | real check, prose is just a wrapper; the check itself enforces it |
| "Be careful when refactoring." | DROP | universal platitude; applies to every project |
| "Quick Start: clone, install, run `make dev`" | RELOCATE | real content, but belongs in README |
| "We are planning to move to a monorepo." | DROP | future plan, rots; not current judgment |
| "I find that using interfaces early helps." | DROP | personal taste, not project judgment |

## How to install

Download the asset:

```bash
curl -L -o agent-project-context-v0.1.2.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/agent-project-context-v0.1.2/agent-project-context-v0.1.2.kdna

# Verify SHA256
echo "3728046081e1e17dd8f540f4902ef908bde5151568a79dcf721fba90d0d059ae  agent-project-context-v0.1.2.kdna" | shasum -a 256 -c -
```

Load the asset as a prompt:

```bash
# Compact profile (~5.7 KB / 31 lines) — for the per-task load path
kdna load agent-project-context-v0.1.2.kdna --profile=compact --as=prompt

# Full profile — for documentation / onboarding
kdna load agent-project-context-v0.1.2.kdna --profile=full --as=prompt
```

Then give the Agent the prompt and your candidate lines.

## When to use it

- The Agent is about to add content to AGENTS.md, CLAUDE.md,
  codex.md, or .cursorrules
- The Agent is auditing an existing project document (the
  file has grown past 100 lines and you're not sure if it's
  doing the work)
- The Agent is migrating AGENTS.md content from one Agent
  to another (Claude Code → Codex etc.) — the same line
  may be CARRY for one Agent and DROP for another
- The user reports "the Agent is not following AGENTS.md"
  — the most common cause is that the document is too long
  or too platitude-heavy

## When NOT to use it

- For non-Agent project documents (README, runbook, ADRs).
  Use RELOCATE for those lines; the asset will tell you
  which lines belong there.
- For personal preference docs (style guides, opinion
  pieces). The asset will DROP those — that's the judgment,
  not a bug.
- For documents that should be project tours (onboarding
  docs, "what is this repo" pages). The four-cell framework
  is for **judgment** docs, not for **explanation** docs.

## Provenance

- **Source:** internal namespace (redacted in public release)
- **Asset UID:** `urn:uuid:7043a65e-f592-43a5-8c48-d214ebcfafc2`
- **SHA256:** `3728046081e1e17dd8f540f4902ef908bde5151568a79dcf721fba90d0d059ae`
- **Built with:** kdna-studio migrate --format v1 (kdna-studio-cli v0.6.4)
- **10-gate verified:** yes (release-gate.mjs passes 10/10)
- **License:** CC-BY-4.0

## See also

- `agent:completion_adjudication` — the sibling asset. This
  one judges project documents. The sibling judges whether
  an Agent's "I'm done" claim is actually done. Together
  they cover the two ends of the Agent self-judgment loop.
- `agent:task_decomposition` (planned) — breaks a task into
  steps before this asset judges the document.
