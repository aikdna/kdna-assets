# Creator Publishing Lifecycle Reference Cluster

Scenario: decide whether content is worth creating, preserve positioning, and
publish at an appropriate quality and cadence.

This is an explicit technical/conformance reference. It does not claim that a
Cluster improves answers over the correct single KDNA.

## Members

The manifest selects exactly one primary and at most two optional advisors.
Every member is an independent, valid, authorizable `.kdna` asset.

| Member | Role |
|---|---|
| `@aikdna/creator-brand-positioning` | primary candidate |
| `@aikdna/creator-topic-selection` | primary candidate |
| `@aikdna/creator-originality-judgment` | primary candidate |
| `@aikdna/creator-publishing-rhythm` | primary candidate |
| `@aikdna/creator-content-depth` | optional advisor |
| `@aikdna/creator-audience-signal` | optional advisor |

```mermaid
flowchart LR
  brand["Brand positioning"] -->|constrains| topic["Topic selection"]
  depth["Content depth advisor"] -->|informs| topic
  depth -->|informs| original["Originality judgment"]
  signal["Audience signal advisor"] -->|tests| brand
  signal -->|informs| rhythm["Publishing rhythm"]
```

The graph records contribution boundaries; it does not load every member.

## Explicit use

```bash
kdna cluster validate kdna.cluster.json
kdna cluster plan-use kdna.cluster.json \
  --task="Change our weekly publishing cadence after retention metrics fell" \
  --as=json
kdna cluster conflicts kdna.cluster.json \
  --task="Change our weekly publishing cadence after retention metrics fell" \
  --as=json
```

Install the independently distributed members before execution, then invoke
the Cluster explicitly:

```bash
kdna use kdna.cluster.json \
  --task="Change our weekly publishing cadence after retention metrics fell" \
  --runner=cli:default \
  --as=trace
```

The manifest is JSON, not a `.kdna` container. A single-asset `plan-load` or
`load` command never invokes this Cluster.

## Verified technical behavior

- exactly one primary;
- at most three loaded assets;
- no all-member fallback;
- missing or unauthorized primary blocks at preflight and execution with zero
  loads;
- an unavailable optional advisor is removed with a structured degradation
  warning while the verified primary continues;
- conflicts are surfaced rather than averaged;
- custom token/character limits propagate, and hard budget overflow blocks
  instead of silently truncating advisors;
- KDNA CLI 0.31.1 reached exact primary, advisor, and applicability results on
  the sealed reference holdout with zero observed contamination.

These are technical/conformance results for the published fixtures. No model
answer-quality or Cluster-over-single improvement claim is made.

Licensed under CC-BY-4.0; see `LICENSE`.
