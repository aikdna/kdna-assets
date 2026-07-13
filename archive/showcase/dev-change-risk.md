# Change Risk

> **Archived demonstration.** This page documents a superseded pre-CBOR AIKDNA example.
> The file is preserved for historical integrity and is intentionally rejected by the current runtime.
> This page provides archive metadata only; do not load this file with the current runtime.

> Change Risk: the judgment threshold that separates good from harmful decisions.

Judges change risk trade-offs in software engineering — distinguishing productive from counter-productive decisions.

**Judge the pre-change and residual risk of a code, configuration, dependency, schema, infrastructure, or rollout change using four cells: blast radius, behavioral uncertainty, recovery cost, and verification gap.**

## Core judgment

- **Change risk follows causal reach, not diff size, file count, or implementation effort.**
  - *Applies when:* estimating or communicating risk for a proposed change
  - *Does not apply when:* a private non-executable draft has no downstream consumer
  - *Failure risk:* Causal reach can be overestimated from hypothetical dependencies; ground the graph in actual callers, contracts, and deployment paths.

- **Use four cells—BLAST_RADIUS, BEHAVIORAL_UNCERTAINTY, RECOVERY_COST, and VERIFICATION_GAP—and let the weakest cell set the risk floor.**
  - *Applies when:* pre-change review, rollout planning, or residual-risk adjudication
  - *Does not apply when:* the change has no executable, persistent, contractual, or external effect
  - *Failure risk:* The four cells can become mechanical labels; every cell must cite concrete evidence and a plausible mechanism.

- **Treat data, schema, security, permission, and external contract changes as asymmetric because recovery may not restore the world.**
  - *Applies when:* the change affects persistent data, identity, access, money, interfaces, or emitted side effects
  - *Does not apply when:* the change is isolated to a disposable local environment
  - *Failure risk:* Calling every data or contract change catastrophic creates review fatigue; assess actual mutation, compatibility, and recovery evidence.

- **Verification must target changed behavior and credible failure modes; broad green status is not enough.**
  - *Applies when:* reviewing test plans, CI evidence, release gates, or completion claims
  - *Does not apply when:* behavior is fully deterministic and directly observed by a complete local check
  - *Failure risk:* Excessive testing can delay low-impact changes; evidence depth should scale with the four-cell ruling.

- **Risk is a changing judgment: update it after implementation, new evidence, rollout controls, incidents, and recovery rehearsal.**
  - *Applies when:* implementation, evidence, deployment plan, or production observations change
  - *Does not apply when:* no material information changed since the last ruling
  - *Failure risk:* Frequent reclassification without evidence can become optimism drift; every reduction must cite the control and what it proves or limits.

## Scope

- **Out of scope:** Approving business priority, legal acceptance, staffing, or organizational accountability.
- **Out of scope:** Claiming formal security, compliance, or safety certification from this asset alone.
- **Out of scope:** False-precision probability scores unsupported by data.
- **Out of scope:** Calling a high-inherent-risk change low risk merely because a flag or rollback command exists.

## Common failure modes

## Worked scenarios

## Archived download and checksum

```bash
curl -L -o dev-change-risk-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-change-risk-v0.1.0/dev-change-risk-v0.1.0.kdna

echo "06df5c58a40be3d0eed7241417764e1ec1cb5a9b52cd87a4be71ff802ab7c963  dev-change-risk-v0.1.0.kdna" | shasum -a 256 -c -

# Current runtime intentionally rejects this archived pre-CBOR artifact.
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:935c0835-ebad-458e-8eeb-7bdd6acb759e`
- **SHA256:** `06df5c58a40be3d0eed7241417764e1ec1cb5a9b52cd87a4be71ff802ab7c963`
- **Built with:** KDNA Studio CLI
- **License:** CC-BY-4.0
