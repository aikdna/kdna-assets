# Licensed reference asset entries

Each licensed reference owns one directory and its own license:

```text
references/licensed/<asset-slug>/
  <asset-slug>-<version>.kdna
  <asset-slug>-<version>.kdna.sha256
  LICENSE
  README.md
```

Reserved handoff path for the licensed AtomSpeak reference:

- `references/licensed/atomspeak/`

The root repository CC-BY-4.0 license does not license a current asset. Every
current entry must name its own license file in `index/current.json`; licensed
content must not point at the root `LICENSE` or claim CC-BY by inheritance.
