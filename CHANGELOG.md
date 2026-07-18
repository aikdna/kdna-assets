# Changelog

## Unreleased

- Advanced the current validation and consumption baseline to the published
  `@aikdna/kdna-cli@0.35.0` release without changing either reference asset or
  its checksum. Historical rebuild receipts remain frozen at the exact
  toolchain that produced their evidence.
- Added a validation gate that requires every current index toolchain claim to
  match the repository's exact CLI dependency.

## 0.1.1 (2026-07-18)

- Rebuilt both public references through the published Studio CLI 0.10.2,
  Studio Core 2.0.2, and Core 0.20.0 toolchain.
- Replaced the rejected initial 0.1.1 candidates, which had silently dropped
  pattern subtypes and provenance fields, with semantically lossless artifacts.
- Added machine-readable cross-profile semantic comparison and deterministic
  dual-build gates. The current assets preserve 90 and 92 imported Studio
  cards respectively and produce byte-identical independent builds.
- Published `@aikdna/laozi-wuwei@0.1.1` and
  `@aikdna/epictetus-control-and-character@0.1.1` as the current references.
- Added exact checksums, entry-scoped licenses, official-toolchain usage
  guides, and an article describing their creation.
- Added current-index, digest, lifecycle, Runtime Capsule, Cluster-contract,
  license, public-surface, and GitHub Release checks.
- Kept the Cluster surface empty while preserving the explicit Cluster
  protocol and validation path for future work.
- Made no behavior-lift, expert, field-value, truth, or protocol-endorsement
  claim for either reference asset.
