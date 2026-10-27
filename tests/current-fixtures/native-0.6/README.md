# Native container 0.6 fixture

`asset.kdna` is generated from `author.json` with the exact vendored KDNA CLI
`0.43.2` and its paired Core `0.37.9` / Read `0.13.3` graph:

```sh
node node_modules/@aikdna/kdna-cli/src/cli.js create \
  tests/current-fixtures/native-0.6/author.json \
  --output tests/current-fixtures/native-0.6/asset.kdna \
  --allow-create
```

The fixture exercises native container `0.6.0`, catalog-only disclosure,
exact-selection disclosure, whole-asset disclosure and the explicit-deny path.
It is synthetic technical data. It is not a published public sample, real
author identity, human confirmation, task adoption, quality claim or grant of
action authority.
