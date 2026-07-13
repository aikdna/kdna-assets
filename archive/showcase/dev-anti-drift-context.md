# Anti Drift Context

> **Archived demonstration.** This page documents a superseded pre-CBOR AIKDNA example.
> The file is preserved for historical integrity and is intentionally rejected by the current runtime.
> This page provides archive metadata only; do not load this file with the current runtime.

> Anti Drift Context: the judgment threshold that separates good from harmful decisions.

Judgment asset for anti drift context — criteria, signals, and failure modes.

**Judge whether an Agent's active context still matches the user's accepted goal, scope, constraints, decisions, evidence, and unresolved questions during long or interrupted work.**

## Core judgment

- **Maintain an explicit active contract: goal, deliverable, scope, constraints, accepted decisions, proof state, and open loops.**
  - *Applies when:* work spans multiple turns, tools, agents, sessions, or substantial context compression
  - *Does not apply when:* the task is a single short action whose full contract remains visible
  - *Failure risk:* An overgrown ledger can become a second source of drift; keep only decision-bearing state and trace authority.

- **Context changes only through explicit user revision or verified evidence that invalidates an accepted assumption.**
  - *Applies when:* new information appears after work has begun
  - *Does not apply when:* the user explicitly replaces the earlier instruction or verified evidence makes it impossible
  - *Failure risk:* Rigid preservation can ignore real corrections; verified contradiction must update the contract with a traceable reason.

- **Recency does not determine authority; source and semantic scope determine authority.**
  - *Applies when:* new and old context appear inconsistent
  - *Does not apply when:* the latest instruction explicitly and validly supersedes the earlier one
  - *Failure risk:* Authority rules can become brittle when the user speaks informally; confirm material conflicts rather than inventing hierarchy.

- **Preserve rejected alternatives, unresolved branches, and rationale as history without treating them as active requirements.**
  - *Applies when:* the task contains competing approaches, deferred decisions, or resumed work
  - *Does not apply when:* the alternative is trivial and has no plausible effect on future choices
  - *Failure risk:* Excessive history can overload context; retain only decision-relevant rationale and reopening conditions.

- **Checkpoint at semantic state changes, not arbitrary time intervals or after every action.**
  - *Applies when:* the work reaches a decision, handoff, resume, integration, or side-effect boundary
  - *Does not apply when:* a minor reversible action leaves goal, scope, constraints, and evidence unchanged
  - *Failure risk:* The Agent may miss a subtle semantic change; use trigger signals rather than elapsed time alone.

## Scope

- **Out of scope:** Inventing goals, decisions, or constraints the user never supplied or delegated.
- **Out of scope:** Replacing original evidence or source documents with an untraceable summary.
- **Out of scope:** Blocking legitimate adaptation when evidence invalidates the current plan.
- **Out of scope:** Treating a handoff summary as more authoritative than accepted decisions and evidence.

## Common failure modes

## Worked scenarios

## Archived download and checksum

```bash
curl -L -o dev-anti-drift-context-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-anti-drift-context-v0.1.0/dev-anti-drift-context-v0.1.0.kdna

echo "f5d1437176440ecc10e765e02862a394132d2bb57b5ce54dcde17bb8971f5421  dev-anti-drift-context-v0.1.0.kdna" | shasum -a 256 -c -

# Current runtime intentionally rejects this archived pre-CBOR artifact.
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:cc0dd56f-28e0-4c0b-8eda-457a71189b60`
- **SHA256:** `f5d1437176440ecc10e765e02862a394132d2bb57b5ce54dcde17bb8971f5421`
- **Built with:** KDNA Studio CLI
- **License:** CC-BY-4.0
