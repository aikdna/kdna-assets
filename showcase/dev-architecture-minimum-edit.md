# Architecture Minimum Edit

> Architecture Minimum Edit: the judgment threshold that separates good from harmful decisions.

Judges architecture minimum edit trade-offs in software engineering — distinguishing productive from counter-productive decisions.

**Judge the smallest architecture-level intervention that enables the required behavior while preserving existing responsibility boundaries, contracts, migration safety, reversibility, and reviewability.**

## Core judgment

- **The minimum architecture edit is the smallest causal and contract change, not the fewest lines or files.**
  - *Applies when:* comparing architectural options for a requirement or defect; someone argues that the smallest diff is automatically safest
  - *Does not apply when:* the task has no executable, persistent, or contractual system effect
  - *Failure risk:* Semantic minimality can be used to rationalize under-designed patches; explicitly test responsibility, contract, and migration consequences.

- **Use an existing extension seam when it preserves responsibility and contract clarity; do not force-fit a seam that moves the problem into the wrong owner.**
  - *Applies when:* an existing abstraction or hook could host the new behavior
  - *Does not apply when:* the existing seam is explicitly deprecated or structurally unable to represent the required contract
  - *Failure risk:* The Agent may overvalue conformity and preserve a harmful architecture; record evidence that the seam still has coherent ownership.

- **Introduce a new abstraction only when it resolves a demonstrated responsibility, variation, or contract boundary—not a speculative future.**
  - *Applies when:* adding an interface, base class, framework layer, service, plugin system, or generic mechanism
  - *Does not apply when:* a platform or regulatory boundary mandates a separate component
  - *Failure risk:* Waiting for repetition can also entrench duplication; evaluate volatility and ownership, not only occurrence count.

- **Preserve public and persistent contracts by default; when a contract must change, make compatibility and migration part of the edit.**
  - *Applies when:* the change affects persisted state, external consumers, shared libraries, protocols, or independently deployed components
  - *Does not apply when:* the contract is private, disposable, and all consumers change atomically
  - *Failure risk:* Compatibility layers can become permanent complexity; assign an owner and exit criterion.

- **Separate required structural work from opportunistic cleanup, and trace every included edit to the behavior, contract, or risk it serves.**
  - *Applies when:* a proposed architecture edit grows beyond the immediate requirement; the team wants to clean up adjacent code while making the change
  - *Does not apply when:* the existing structure literally prevents the required safe edit and the prerequisite is narrowly demonstrated
  - *Failure risk:* Over-splitting can leave an unsafe temporary state; include all support required for one coherent safe claim.

## Scope

- **Out of scope:** Aesthetic rewrites or technology replacement without a concrete need.
- **Out of scope:** Product prioritization or whether the requirement should exist.
- **Out of scope:** Using local minimalism to bypass security, privacy, reliability, or ownership controls.
- **Out of scope:** Guaranteeing that every historical behavior remains forever.
- **Out of scope:** Artificially splitting a change into states that are unsafe, uncompilable, or unverifiable.

## Common failure modes

## Worked scenarios

## Install and load

```bash
curl -L -o dev-architecture-minimum-edit-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-architecture-minimum-edit-v0.1.0/dev-architecture-minimum-edit-v0.1.0.kdna

echo "a6fdf15ce011d11446e5072f05cfe05ab325f697e4faf8cf52dee1e92635dc2e  dev-architecture-minimum-edit-v0.1.0.kdna" | shasum -a 256 -c -

kdna load dev-architecture-minimum-edit-v0.1.0.kdna --profile=compact --as=prompt
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:ad6aa859-7fc7-4785-9705-a6f6f86e2e21`
- **SHA256:** `a6fdf15ce011d11446e5072f05cfe05ab325f697e4faf8cf52dee1e92635dc2e`
- **Built with:** KDNA Studio CLI
- **License:** CC-BY-4.0
