# License scope

The root `LICENSE` applies to repository-authored documentation and the
historical AIKDNA reference material for which AIKDNA has applied CC-BY-4.0.

It does **not** automatically license current reference assets or Cluster
manifests. Every current entry in `index/current.json` must provide a license
file inside its own entry directory and set:

```json
{
  "license": {
    "id": "<SPDX-or-LicenseRef>",
    "path": "<entry-directory>/LICENSE",
    "scope": "asset-content-and-distribution",
    "repository_license_applies": false
  }
}
```

This prevents the repository-level CC-BY notice from being mistaken for a
license grant over licensed third-party content such as AtomSpeak. The creator
or authorized publisher remains responsible for the accuracy and sufficiency
of each asset-specific license.
