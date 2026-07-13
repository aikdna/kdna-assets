# Task Decomposition

> **Archived demonstration.** This page documents a superseded pre-CBOR AIKDNA example.
> The file is preserved for historical integrity and is intentionally rejected by the current runtime.
> This page provides archive metadata only; do not load this file with the current runtime.

> Task Decomposition: the judgment threshold that separates good from harmful decisions.

Judgment asset for task decomposition — criteria, signals, and failure modes.

**Judge whether a complex task has been decomposed into dependency-aware, independently verifiable work units with explicit evidence and stopping conditions.**

## Core judgment

- **Decompose into independently verifiable outcomes, not activity labels.**
  - *Applies when:* planning multi-step implementation, research, analysis, migration, or content work
  - *Does not apply when:* a task is a single deterministic action with immediate verification
  - *Failure risk:* Over-demanding independence can duplicate setup or fragment coherent work; allow shared prerequisites while preserving outcome-level evidence.

- **Dependencies determine order; convenience does not.**
  - *Applies when:* sequencing work or assigning subtasks to multiple agents
  - *Does not apply when:* all units are demonstrably independent and share no mutable surface
  - *Failure risk:* Dependency graphs can be over-specified from uncertain assumptions; mark uncertain edges and revise as evidence arrives.

- **Front-load uncertainty, irreversible decisions, and high-leverage risk.**
  - *Applies when:* the plan contains unknown APIs, data quality, permissions, architecture choices, or irreversible operations
  - *Does not apply when:* the uncertainty cannot be reduced before execution and the experiment itself is the task
  - *Failure risk:* Excessive exploration can delay a straightforward task; time-box probes and tie them to a decision.

- **Every work unit needs entry conditions, an output artifact, verification evidence, and a stop or escalation rule.**
  - *Applies when:* defining a subtask for an Agent or human handoff
  - *Does not apply when:* a trivial unit is immediately observable and no handoff is involved
  - *Failure risk:* Rigid contracts can be disproportionate for tiny tasks; scale detail to consequence and coordination cost.

- **Choose granularity that isolates failure without creating coordination overhead.**
  - *Applies when:* deciding whether to split or combine work units
  - *Does not apply when:* the decomposition is fixed by an external protocol or compliance procedure
  - *Failure risk:* The chosen granularity may become wrong as uncertainty resolves; permit recomposition with traceable reasons.

## Scope

- **Out of scope:** Choosing the substantive domain answer inside each unit.
- **Out of scope:** Pretending estimates are commitments when uncertainty remains unresolved.
- **Out of scope:** Running conflicting edits or mutually dependent analysis in parallel without an integration plan.
- **Out of scope:** Silent plan drift that erases why scope, order, or evidence changed.

## Common failure modes

## Worked scenarios

## Archived download and checksum

```bash
curl -L -o dev-task-decomposition-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-task-decomposition-v0.1.0/dev-task-decomposition-v0.1.0.kdna

echo "044c33a61c589de2b665397ae266753b576dda06f242ae0e1d77dbe0658a1e56  dev-task-decomposition-v0.1.0.kdna" | shasum -a 256 -c -

# Current runtime intentionally rejects this archived pre-CBOR artifact.
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:c48be822-083b-45b4-8955-64a40fe52827`
- **SHA256:** `044c33a61c589de2b665397ae266753b576dda06f242ae0e1d77dbe0658a1e56`
- **Built with:** KDNA Studio CLI
- **License:** CC-BY-4.0
