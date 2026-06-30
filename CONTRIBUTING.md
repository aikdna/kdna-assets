# Contributing to kdna-assets

Official KDNA judgment asset releases. Each asset here is a
validated, loadable `.kdna` file that gives an AI agent a
specific, scoped judgment framework.

---

## What qualifies as a publishable KDNA asset

A KDNA asset is not a prompt, a template, or a checklist. It is a
**scoped judgment framework** — the principles an expert consistently
applies in a specific domain, the traps they avoid, the questions
they ask before deciding.

An asset is ready to publish when it passes all of the following:

### Scope

- **One domain, one question.** The asset answers a single
  `highest_question` (e.g. "Does this line of AGENTS.md earn its
  load cost?"). If you find yourself answering two different questions,
  split into two assets.
- **Declared audience layer.** L1 (developers using AI coding tools),
  L2 (content creators), or L3 (domain experts in a specific field).
- **Specific task scope.** "writing" is too broad. "Judging whether an
  argument structure supports the thesis" is scoped.

### Content (minimum viable)

- At least **3 axioms**, each with `one_sentence`, `applies_when`,
  `does_not_apply_when`, and `failure_risk`.
- At least **3 self-checks** — questions the agent runs on its own
  output before responding.
- At least **1 real case** with a before/after or decision trace that
  shows the judgment in action.
- **No fabricated evidence.** Every pattern and case must come from
  real practice, not from generating examples to fill the schema.

### Human verification

Every card in the asset must have been reviewed by a human — not just
generated and accepted. The Human Lock mechanism in KDNA Studio CLI
(`kdna-studio card approve`) records this confirmation. For assets
submitted without Studio CLI, include a provenance note explaining
how cards were verified.

### Format and integrity

1. The `.kdna` file passes `kdna validate` with `overall_valid: true`.
2. SHA-256 checksum matches: `shasum -a 256 <asset>.kdna`.
3. `kdna load <asset>.kdna --profile=compact --as=prompt` produces
   readable output (not empty, not malformed).

### Comparison evidence

Before submitting, demonstrate the difference. Give the same prompt
to an agent with and without the asset loaded, and include the
comparison in your PR description. This is the minimum signal that
the asset actually changes behavior.

---

## Asset organization

Assets in this repository are organized by audience layer and workflow
position:

**L1 — Developer tools** (for developers using AI coding agents)
- Agent meta: project context, intent, scope, completion judgment
- Code writing: API design, abstraction, naming
- Code review: security, severity, AI output quality
- Debugging: triage, silent failure patterns
- Maintenance: docs, refactoring, tech debt

**L2 — Content creator tools** (for bloggers, self-media creators)
- Strategy: positioning, niche, mix
- Creation: authenticity, depth, originality
- Audience: signal, community
- Monetization: timing, offer design

**L3 — Domain expert tools** (open — any expertise domain)
- Any domain where expert judgment differs significantly from
  generic AI output

When submitting, state which layer and workflow position your asset
targets.

---

## Submission process

1. Create a GitHub Release with:
   - The `.kdna` file (`<name>-<version>.kdna`)
   - The SHA-256 sidecar (`<name>-<version>.kdna.sha256`)
2. Open a PR that updates `assets.json` with the new entry.
3. Include in the PR description:
   - What domain and audience layer
   - The before/after comparison showing behavioral difference
   - How cards were verified (Human Lock record or equivalent)

## What NOT to do

- Do NOT create a registry, marketplace, or install service.
- Do NOT submit assets built entirely by AI without human card review.
- Do NOT submit assets that duplicate an existing asset's domain
  without clearly explaining the differentiation.
- Do NOT pin to specific CLI versions in documentation.

## Sign-off

Sign off all commits: `git commit -s`
