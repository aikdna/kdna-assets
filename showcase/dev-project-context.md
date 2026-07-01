# Project Context

> Project Context: the judgment threshold that separates good from harmful decisions.

Judgment asset for project context — criteria, signals, and failure modes.

**Judge what belongs in an Agent-facing project context document such as AGENTS.md, CLAUDE.md, codex.md, or .cursorrules.**

## Core judgment

- **Keep a line only when its absence predictably causes a project-specific Agent failure.**
  - *Applies when:* adding or auditing a line in an Agent-facing project context file; investigating repeated Agent mistakes in one repository
  - *Does not apply when:* writing a README, onboarding guide, architecture narrative, or general documentation
  - *Failure risk:* The reviewer may invent hypothetical failures to justify preferred prose; require a plausible or observed behavior consequence.

- **Per-task context carries judgment, not project explanation.**
  - *Applies when:* deciding whether information belongs in AGENTS.md, CLAUDE.md, codex.md, or .cursorrules
  - *Does not apply when:* authoring documents whose purpose is explanation, onboarding, or reference
  - *Failure risk:* Over-compression can remove a small amount of orientation that is genuinely required for correct routing; preserve only the minimum operational fact.

- **Convert binary correctness rules into executable checks whenever a machine can decide them.**
  - *Applies when:* reviewing style rules, file-placement rules, generated-file rules, secret checks, schema constraints, or test requirements
  - *Does not apply when:* a rule requires contextual trade-offs that cannot be reduced to a stable binary check
  - *Failure risk:* A premature conversion can encode the wrong policy or make legitimate exceptions impossible; keep judgment rules as judgment.

- **Current, evidence-backed constraints outrank preferences, aspirations, and future plans.**
  - *Applies when:* a candidate line uses first-person preference, aspirational language, roadmap language, or unverified claims
  - *Does not apply when:* the preference has been adopted as an explicit current project decision with observable consequences
  - *Failure risk:* A real but recently adopted decision may be dropped as 'preference' if evidence is not recorded; seek the decision artifact when material.

- **Context budget is scarce; every retained line must repay its recurring attention cost.**
  - *Applies when:* the context file is growing, duplicated across agents, or ignored despite containing valid rules
  - *Does not apply when:* a one-off incident report or archival document where recurring load cost is irrelevant
  - *Failure risk:* Aggressive shrinking can erase rare but catastrophic constraints; consequence must be weighed alongside frequency.

## Scope

- **Out of scope:** General README, onboarding, architecture education, release runbooks, and project history.
- **Out of scope:** Deciding the underlying product, architecture, legal, or security policy itself.
- **Out of scope:** Personal preferences, team aspirations, roadmap promises, and universal software advice.
- **Out of scope:** Implementing the linter, test, schema, or CI control selected by CONVERT.

## Common failure modes

## Worked scenarios

## Install and load

```bash
curl -L -o dev-project-context-v0.1.2.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-project-context-v0.1.2/dev-project-context-v0.1.2.kdna

echo "2d219d8879bff29f4d84d863a3ef7b02c88de1b5621f84235c3edae2944c5837  dev-project-context-v0.1.2.kdna" | shasum -a 256 -c -

kdna load dev-project-context-v0.1.2.kdna --profile=compact --as=prompt
```

## Provenance

- **Version:** 0.1.2
- **Asset UID:** `urn:uuid:7e4ba8ac-2b26-4a31-8e7e-2400e33a3991`
- **SHA256:** `2d219d8879bff29f4d84d863a3ef7b02c88de1b5621f84235c3edae2944c5837`
- **Built with:** kdna-studio-cli (kdna-assets-internal 10-gate pipeline)
- **Gates:** 10 PASS, 0 SKIP, 0 FAIL of 10
- **License:** CC-BY-4.0
