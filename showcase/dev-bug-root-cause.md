# Bug Root Cause

> Bug Root Cause: the judgment threshold that separates good from harmful decisions.

Judges bug root cause trade-offs in software engineering — distinguishing productive from counter-productive decisions.

**Judge whether a bug diagnosis identifies the observed failure, trigger, causal defect, propagation path, contributing conditions, and verified control-point fix instead of stopping at a symptom or suspicious line.**

## Core judgment

- **Preserve the observed failure and establish the smallest reliable reproduction before explaining it.**
  - *Applies when:* a bug or incident is reported and the mechanism is not already proven
  - *Does not apply when:* emergency containment must precede full reproduction; evidence should still be captured proportionately
  - *Failure risk:* Reproduction can damage data or alter timing; use safe copies, observability, and containment for high-consequence systems.

- **Separate trigger, defect, propagation, and symptom; they are different causal roles.**
  - *Applies when:* multiple components or states lie between input and visible failure
  - *Does not apply when:* failure is a directly observed single-step invariant violation with no propagation
  - *Failure risk:* Forcing a neat linear chain can omit feedback loops or multiple contributors; allow branching graphs when evidence requires them.

- **A root cause is a necessary, evidence-supported, controllable condition in the observed mechanism—not merely the first abnormal line or last change.**
  - *Applies when:* selecting the primary cause or writing the diagnosis
  - *Does not apply when:* evidence supports only a bounded contributing factor; label it honestly
  - *Failure risk:* Complex systems may have multiple necessary conditions; do not erase contributors or control failures.

- **Competing hypotheses must be separated by discriminating evidence, not confidence or narrative elegance.**
  - *Applies when:* more than one mechanism can explain the symptom
  - *Does not apply when:* a direct invariant violation already proves the causal path
  - *Failure risk:* Experiments can perturb the system or be underpowered; record limitations and avoid treating absence of evidence as disproof.

- **Validate the fix by breaking the causal chain and proving intended behavior, not merely by making the original symptom disappear once.**
  - *Applies when:* implementing or reviewing a bug fix
  - *Does not apply when:* temporary containment is explicitly labeled and a permanent fix remains open
  - *Failure risk:* A broad fix may remove the symptom by disabling useful behavior; verify non-regression and intended semantics.

## Scope

- **Out of scope:** Assigning blame, performance evaluation, or organizational accountability.
- **Out of scope:** Claiming universal explanation for every similar symptom without evidence.
- **Out of scope:** Reproducing destructive behavior on production or sensitive data without containment and authority.
- **Out of scope:** Calling retries, restarts, guards, or disabled features a root-cause fix without evidence.

## Common failure modes

## Worked scenarios

## Install and load

```bash
curl -L -o dev-bug-root-cause-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-bug-root-cause-v0.1.0/dev-bug-root-cause-v0.1.0.kdna

echo "96c93ca160ce5330df2e438214856a504951524158544b017bc68196cf1a7bb7  dev-bug-root-cause-v0.1.0.kdna" | shasum -a 256 -c -

kdna load dev-bug-root-cause-v0.1.0.kdna --profile=compact --as=prompt
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:1af6f220-b9ec-44bd-b2e6-67c1699b8f54`
- **SHA256:** `96c93ca160ce5330df2e438214856a504951524158544b017bc68196cf1a7bb7`
- **Built with:** kdna-studio-cli (kdna-assets-internal 10-gate pipeline)
- **Gates:** 10 PASS, 0 SKIP, 0 FAIL of 10
- **License:** CC-BY-4.0
