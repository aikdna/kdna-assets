# Cluster manifest surface

A Cluster is an explicit composition manifest, not a `.kdna` asset and not a
second asset container format.

There are currently no Cluster entries. The directory remains as the governed
surface for future work created from a new problem definition.

A future Cluster uses this exact layout:

```text
clusters/<cluster-slug>/kdna.cluster.json
clusters/<cluster-slug>/LICENSE
clusters/<cluster-slug>/README.md
```

Each manifest receives a `kind: "kdna-cluster"` entry in
`index/current.json`. Do not rename it to `.kdna`, embed it inside an asset, or
use single-asset loading commands for it.

The single-asset path remains the foundation and default. A future Cluster must
give every member a distinct judgment responsibility, preserve exactly one
owning primary, and pass a separately admitted Host contract. Technical
validity does not create an adoption, external-assessment, or outcome claim.
