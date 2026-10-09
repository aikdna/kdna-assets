# Historical rebuild receipts

`rebuild-receipt-2026-07-17.json` and `rebuild-receipt-2026-07-18.json` are
kept as history: they record how the `laozi-wuwei` and
`epictetus-control-and-character` reference assets were rebuilt, what the
cleanroom acceptance observed, and which toolchain produced the recorded bytes.

**They describe assets that are no longer offered.** Those three entries -
both references and `verification-scope` - were withdrawn from the current
public surface: they are gone from `index/current.json`, from
`index/legacy-current.json` and from this repository's downloads, and the
releases that carried them have been emptied (the five assets of `0.1.1` and
the four of `sage-reference-assets-v0.1.0`).

Two consequences to read correctly:

1. The receipts are **not** a current listing, an availability claim or a
   download path. Nothing here offers an asset.
2. They are also not rewritten. A receipt states what was observed when it was
   written, so editing one to remove the withdrawn asset names would falsify
   the record; the withdrawal is recorded where it belongs - in `CHANGELOG.md`,
   in `README.md` and in `index/`.

The first public asset published from this repository will be the KDNA white
paper.
