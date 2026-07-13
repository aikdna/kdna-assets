# Current Cluster manifests

A Cluster is an explicit composition manifest, not a `.kdna` asset and not a
second asset container format.

Current Cluster entries use this exact layout:

```text
clusters/<cluster-1-slug>/kdna.cluster.json
clusters/<cluster-1-slug>/LICENSE
clusters/<cluster-1-slug>/README.md

clusters/<cluster-2-slug>/kdna.cluster.json
clusters/<cluster-2-slug>/LICENSE
clusters/<cluster-2-slug>/README.md
```

Each manifest receives a `kind: "kdna-cluster"` entry in
`index/current.json`. Do not rename it to `.kdna`, embed it inside an asset, or
use single-asset loading commands for it.

The current slugs are:

- `developer-change-lifecycle`
- `creator-publishing-lifecycle`

Both are technical/conformance references with exact Release manifests and
checksum sidecars. Their members remain independently installable `.kdna`
assets, and the single-asset path remains the default. No behavioral evidence
claim is attached without a separately passing preregistered Cluster Assay.
