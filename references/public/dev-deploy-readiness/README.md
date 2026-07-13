# Deploy Readiness

Independent KDNA asset: `@aikdna/dev-deploy-readiness` v0.2.0.

Highest question: can this specific change be deployed to production now with
an appropriate rollout, detection, response, and state-aware recovery path?

```bash
kdna validate dev-deploy-readiness-0.2.0.kdna --json
kdna plan-load dev-deploy-readiness-0.2.0.kdna --json
kdna load dev-deploy-readiness-0.2.0.kdna --profile=compact --as=json
```

This asset is usable without a Cluster. Its technical checks do not constitute
an answer-quality claim. Licensed under CC-BY-4.0; see `LICENSE`.

