# Test Strategy Discretion

> Test Strategy Discretion: the judgment threshold that separates good from harmful decisions.

Judges test strategy discretion trade-offs in software engineering — distinguishing productive from counter-productive decisions.

**Judge the smallest sufficient portfolio of tests and other verification evidence for a software change, based on behavior at risk, contract edges, semantic fidelity, failure modes, and residual uncertainty.**

## Core judgment

- **Begin with a credible failure hypothesis and an observable contract, not with a preferred test layer or coverage target.**
  - *Applies when:* selecting tests for a code or configuration change; reviewing whether proposed evidence is relevant to the changed behavior
  - *Does not apply when:* the task is only to format or relocate non-executable documentation with no behavioral contract
  - *Failure risk:* The Agent may invent implausible failures; anchor hypotheses in the change surface, historical defects, contracts, and operating environment.

- **Use the lowest-cost test layer that preserves the semantics needed to reveal the feared failure.**
  - *Applies when:* choosing among unit, component, integration, contract, end-to-end, and operational checks
  - *Does not apply when:* a mandated compliance or platform gate requires a specific layer in addition to engineering judgment
  - *Failure risk:* Lowest cost can be mistaken for cheapest to write; include maintenance, diagnosis time, determinism, and fidelity.

- **A material change needs evidence for its changed behavior and credible regressions, but not every behavior needs every test layer.**
  - *Applies when:* deciding whether current tests are sufficient; removing redundant or low-signal tests
  - *Does not apply when:* independent duplicated evidence is explicitly required for safety, financial, or regulatory assurance
  - *Failure risk:* Portfolio minimization can delete defense-in-depth; preserve tests that catch different mechanisms or fail at different operational stages.

- **A test double is trustworthy only to the extent that its fidelity assumptions are explicit and checked at a real contract edge.**
  - *Applies when:* external services, databases, queues, clocks, filesystems, browsers, or infrastructure are replaced in tests
  - *Does not apply when:* the substitute is the production implementation or its equivalence is mechanically enforced
  - *Failure risk:* Demanding real dependencies everywhere creates slow brittle suites; constrain realism to the contract dimensions that matter.

- **Stop adding tests when the remaining risk is explicit, proportionate, and better addressed by another control.**
  - *Applies when:* declaring the test plan sufficient; deciding whether another test adds meaningful confidence
  - *Does not apply when:* a known high-consequence failure remains untested and no compensating control exists
  - *Failure risk:* Residual-risk language can excuse weak testing; every accepted gap must have an owner, rationale, and proportionate control.

## Scope

- **Out of scope:** Organization-wide QA staffing, budgeting, or performance management.
- **Out of scope:** Certifying legal, regulatory, or safety compliance.
- **Out of scope:** Usability research, market validation, or product desirability.
- **Out of scope:** Using 'minimum sufficient' to waive a known high-consequence gap.
- **Out of scope:** Rewriting production architecture merely to make every detail unit-testable.

## Common failure modes

## Worked scenarios

## Install and load

```bash
curl -L -o dev-test-strategy-discretion-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-test-strategy-discretion-v0.1.0/dev-test-strategy-discretion-v0.1.0.kdna

echo "a14e9a78af3af6158c7ff373741c493e7d0572c91bceb0a493333e8819102bbb  dev-test-strategy-discretion-v0.1.0.kdna" | shasum -a 256 -c -

kdna load dev-test-strategy-discretion-v0.1.0.kdna --profile=compact --as=prompt
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:d30dc59a-bde8-4efc-9679-fc4bc60ced2d`
- **SHA256:** `a14e9a78af3af6158c7ff373741c493e7d0572c91bceb0a493333e8819102bbb`
- **Built with:** KDNA Studio CLI
- **License:** CC-BY-4.0
