# Change Risk

Independent KDNA asset: `@aikdna/dev-change-risk` v0.2.0.

Highest question: what can this change break, how far can failure propagate,
how uncertain is behavior, how completely can we recover, and what evidence
would reveal failure before unacceptable harm?

```bash
kdna validate dev-change-risk-0.2.0.kdna --json
kdna plan-load dev-change-risk-0.2.0.kdna --json
kdna load dev-change-risk-0.2.0.kdna --profile=compact --as=json
```

This asset is usable without a Cluster. Its technical checks do not constitute
an answer-quality claim. Licensed under CC-BY-4.0; see `LICENSE`.

