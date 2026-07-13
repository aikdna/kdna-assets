# Public reference asset entries

Each current public reference asset owns one directory:

```text
references/public/<asset-slug>/
  <asset-slug>-<version>.kdna
  <asset-slug>-<version>.kdna.sha256
  LICENSE
  README.md
```

Reserved handoff paths for the two public reference candidates are:

- `references/public/laozi-wuwei/`
- `references/public/epictetus-control-and-character/`

These directories are entry contracts only. No asset content is supplied by
this repository foundation. Add the completed artifact and its metadata to
`index/current.json` only after the current validation checks pass.
