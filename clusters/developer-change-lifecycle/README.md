# Developer Change Lifecycle Reference Cluster

Scenario: turn user intent into a safe, verifiable, genuinely complete, and
publishable code change.

This is an explicit technical/conformance reference. It does not claim that a
Cluster improves answers over the correct single KDNA.

## Members

The manifest selects exactly one primary and at most two optional advisors.
Every member is an independent, valid, authorizable `.kdna` asset.

| Member | Role |
|---|---|
| `@aikdna/dev-intent-boundary` | primary candidate |
| `@aikdna/dev-task-decomposition` | primary candidate |
| `@aikdna/dev-completion-adjudication` | primary candidate |
| `@aikdna/dev-deploy-readiness` | primary candidate |
| `@aikdna/dev-change-risk` | optional advisor |
| `@aikdna/dev-test-strategy-discretion` | optional advisor |

```mermaid
flowchart LR
  intent["Intent boundary"] -->|constrains| plan["Task decomposition"]
  risk["Change risk advisor"] -->|informs| plan
  tests["Test strategy advisor"] -->|informs| done["Completion adjudication"]
  risk -->|constrains| deploy["Deploy readiness"]
  tests -->|informs| deploy
```

The graph records allowed contributions; it is not an all-member pipeline.

## Explicit use

```bash
kdna cluster validate kdna.cluster.json
kdna cluster plan-use kdna.cluster.json \
  --task="Can we call this fix complete after the regression test passed?" \
  --as=json
kdna cluster conflicts kdna.cluster.json \
  --task="Can we call this fix complete after the regression test passed?" \
  --as=json
```

Install the independently distributed members before execution, then invoke
the Cluster explicitly:

```bash
kdna use kdna.cluster.json \
  --task="Can we call this fix complete after the regression test passed?" \
  --runner=cli:default \
  --as=trace
```

The manifest is JSON, not a `.kdna` container. A single-asset `plan-load` or
`load` command never invokes this Cluster.

## Bounds and known limits

- exactly one primary;
- at most three loaded assets;
- no all-member fallback;
- missing primary blocks execution;
- optional-advisor failure is declared as continue-with-warning, but CLI
  0.30.4 currently fails the whole run;
- the declared block conflict is surfaced by CLI 0.30.4 but does not yet stop
  execution;
- custom manifest token/character limits are declared but not yet propagated
  into the generated plan.

Licensed under CC-BY-4.0; see `LICENSE`.

