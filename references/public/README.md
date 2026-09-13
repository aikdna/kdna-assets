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
- [`verification-scope/`](verification-scope/) — current-contract candidate,
  `unpublished_candidate`, admitted by the bound Core

Each directory supplies the exact `.kdna`, checksum, entry-scoped license, and
usage guide. The two historical reference files passed the current validate,
LoadPlan, compact Runtime Capsule, Capsule verification, isolated install, and
reproducible-build gates. Those are technical claims only; no listing is a
truth, expertise, adoption, external-assessment, outcome, or
protocol-endorsement claim. The current-contract candidate states its own,
narrower observation in its own directory and in `index/current.json`: admitted
by the bound Core and disclosed by the bound Read under explicit local
permission, not published, and not human-reviewed. The isolated install check
covers a published legacy Store surface; it is not the canonical file-first
user model.

Future entries must be independently authored and released through the current
toolchain.
