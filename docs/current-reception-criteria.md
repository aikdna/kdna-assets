# Receiving Public Reference Assets (Container `0.6.0`)

This page defines the technical reception criteria and current status for openly licensed `.kdna` works indexed in `aikdna/kdna-assets`. It describes verification boundaries only; listing an asset in `index/current.json` records a concrete technical and licensing observation and never implies endorsement, truth, or legal clearance.

## 1. Five-Step Reception Criteria

A public reference work is received into `index/current.json` only after one identified toolchain graph completes all five steps in order:

1. **Creation & Export** — Bytes are authored and exported by an identified Container `0.6.0` toolchain (`@aikdna/kdna-cli@0.46.0` or its exact recorded release version).
2. **Core Admission** — Public `@aikdna/kdna-core` admits the exact bytes (`status: "accepted"`, `reason: null`, verified container checksums when present).
3. **Selective Read Disclosure** — Public `@aikdna/kdna-read` discloses `catalog` and `exact_selection` under explicit per-call local permission (`--allow-read`).
4. **Human Preview** — A human reviewer opens and inspects the work in desktop **KDNA Reader** (macOS Apple Silicon; hosted Web Reader is permanently closed) or via plain-text `kdna review` / `kdna read --format human`.
5. **Indexed Provenance & License** — The entry records exact byte count, SHA-256 sidecar, creator attribution, per-work content license (`repository_license_applies: false`), and explicit `not_evaluated` `proof_limits`.

Steps 2, 3, and 4 are independent observations. Passing `kdna validate` or running a synthetic fixture never substitutes for human review or licensing review.

## 2. Current Active Status (`2026-11-26`)

- **Indexed Repository Reference Works (`index/current.json`):**
  - `@aikdna/kdna-whitepaper` (`zh-CN`, `v1.0.2`, `2,725,359` bytes, `CC-BY-4.0`, 45 judgments) — [`references/public/kdna-whitepaper/kdna-whitepaper-1.0.2.zh-CN.kdna`](../references/public/kdna-whitepaper/kdna-whitepaper-1.0.2.zh-CN.kdna)
  - `@aikdna/kdna-whitepaper-en` (`en`, `v1.0.2`, `2,843,386` bytes, `CC-BY-4.0`, 45 judgments) — [`references/public/kdna-whitepaper/kdna-whitepaper-1.0.2.en.kdna`](../references/public/kdna-whitepaper/kdna-whitepaper-1.0.2.en.kdna)
  - Both `v1.0.1` editions remain preserved alongside `v1.0.2` for explicit `kdna diff` verification and version-pinned links.
- **Companion Domain Exemplars (Account-Free via `aikdna.com/en/explore/systems` & GitHub Releases):**
  - `human-writing-system` `v1.0.1` (`Apache-2.0`, bilingual `zh-CN` & `en`, 22 judgments)
  - `code-review-system` `v1.0.2` (`Apache-2.0`, bilingual `zh-CN` & `en`, 22 judgments)
- **Active Toolchain vs. Offline CI Harness:**
  - Live public CLI: `@aikdna/kdna-cli@0.46.0` (Container `0.6.0`, Payload `kdna.payload.judgment/0.5.1`, Core `kdna.core/0.8.2`, Canonical IR `kdna.canonical-ir/0.6.1`, Read `kdna.read/0.7.0-candidate`).
  - Self-contained offline CI harness in this repository (`vendor/`): pins `@aikdna/kdna-core@0.37.11`, `@aikdna/kdna-read@0.13.5`, `@aikdna/kdna-cli@0.44.0`, and `fast-uri@3.1.9` for deterministic offline auditing (`npm run audit`, `npm run audit:read`, `npm test`).
- **Desktop Distribution Boundary:** Desktop **KDNA Reader** (`v0.3.4 build 30`, macOS Apple Silicon) ships with only the built-in bilingual *KDNA Whitepaper* (`v1.0.2`) and opens any local public or password-protected `.kdna` file completely offline without signing in. Hosted Web Reader is permanently closed; non-Mac users consume `.kdna` works via `@aikdna/kdna-cli@0.46.0`, `@aikdna/kdna-mcp-server@0.8.4`, or `/explore/*` pages.
- **Withdrawn Historical Entries:** Early pre-`0.6.0` references (`@aikdna/laozi-wuwei@0.1.1`, `@aikdna/epictetus-control-and-character@0.1.1`, `@aikdna/verification-scope@0.1.5`) remain withdrawn from the public surface and index; their historical rebuild notes remain in [`docs/creating-laozi-and-epictetus-kdna.md`](./creating-laozi-and-epictetus-kdna.md) and [`evidence/README.md`](../evidence/README.md).

## 3. Non-Negotiable Integrity Rules

- **Never mutate registered bytes.** Updating a work always produces a new semantic version (`1.0.1` → `1.0.2`) inspectable via `kdna diff`, never a silent in-place overwrite.
- **Never relabel synthetic test fixtures as user-facing works.** Fixtures under `tests/` and `fixtures/` exist strictly for conformance testing.
- **Never imply external endorsement.** Every entry declares explicit creator attribution, independent per-asset license, and `not_evaluated` `proof_limits`.

## 4. Reception Checklist for Future Works

| Step | What the Entry Must Record | What Fails Reception |
| --- | --- | --- |
| Creation | Exporting CLI/tool exact version and Core/Read graph | Unversioned or "latest" claim |
| Bytes | Artifact path, media type, exact byte length, SHA-256 sidecar | Reused or unverified digest |
| Core admission | Observed `status: "accepted"` and checksum verification state | Treating version strings as admission proof |
| Selective Read | Verified `catalog` and `exact_selection` observations under `--allow-read` and declared budget | Claiming disclosure from container validation alone |
| Human preview | Desktop KDNA Reader or `kdna review` human inspection scope | Treating preview as truth or identity proof |
| Source & license | Creator attribution, referenced public sources, explicit per-asset `LICENSE` (`repository_license_applies: false`) | Assuming repo `Apache-2.0` covers content |
| Protocol tuple | Asset version, Container `0.6.0` / Payload `0.5.1` tuple, `judgment_version` | Conflating asset version with protocol version |
| Proof limits | Explicit `not_evaluated` boundaries for creation truth, identity, and action authority | Implicit or omitted boundaries |

## Related

- [`README.md`](../README.md) — Current featured works, companion exemplars, and offline verification commands.
- [`references/public/kdna-whitepaper/README.md`](../references/public/kdna-whitepaper/README.md) — *KDNA Whitepaper* `v1.0.2` coordinates and `1.0.0` → `1.0.1` → `1.0.2` evolution notes.
- [`docs/collection-workspace.md`](./collection-workspace.md) — Offline adapter layout for separately supplied collections.
- [`docs/creating-laozi-and-epictetus-kdna.md`](./creating-laozi-and-epictetus-kdna.md) — Retained historical archive note for withdrawn early references.
