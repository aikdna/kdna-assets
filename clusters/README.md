# Current Cluster manifests

A Cluster is an explicit composition manifest, not a `.kdna` asset and not a
second asset container format.

Agent 5 has two reserved entry slots using this exact layout:

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
