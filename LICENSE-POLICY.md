# License scope

The root `LICENSE` applies to repository-authored documentation and supporting
repository code.

It does not automatically license a current reference asset or Cluster
manifest. Every current entry in `index/current.json` must provide a license
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

This prevents the repository-level license from being mistaken for a license
grant over an asset. The creator or authorized publisher remains responsible
for the accuracy and sufficiency of each entry-specific license.
