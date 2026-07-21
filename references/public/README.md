# Public reference asset entries

Each current public reference asset owns one directory:

```text
references/public/<asset-slug>/
  <asset-slug>-<version>.kdna
  <asset-slug>-<version>.kdna.sha256
  LICENSE
  README.md
```

Current public references:

- [`laozi-wuwei/`](laozi-wuwei/)
- [`epictetus-control-and-character/`](epictetus-control-and-character/)

Each directory supplies the exact `.kdna`, checksum, entry-scoped license, and
usage guide. The files passed the current validate, LoadPlan, compact Runtime
Capsule, Capsule verification, isolated install, and reproducible-build gates.
Those are technical claims only; neither listing is a truth, expertise,
adoption, external-assessment, outcome, or protocol-endorsement claim. The
isolated install check covers a published legacy Store surface; it is not the
canonical file-first user model.

Future entries must be independently authored and released through the current
toolchain.
