# 《KDNA白皮书》 / KDNA Whitepaper (`v1.0.2` · `@aikdna/kdna-whitepaper` & `@aikdna/kdna-whitepaper-en`)

`@aikdna/kdna-whitepaper` (`zh-CN`) and `@aikdna/kdna-whitepaper-en` (`en`) are the official public `.kdna` editions of **KDNA Whitepaper (`《KDNA白皮书》`)** at **`v1.0.2`**, authored by **张零 (Zhang Ling / `actor:zhangling`)** and published under **Creative Commons Attribution 4.0 International (`CC-BY-4.0`)**.

`《KDNA白皮书》`（`v1.0.2`，同步提供原生中文版 `kdna-whitepaper-1.0.2.zh-CN.kdna` 与独立原生等义英文版 `kdna-whitepaper-1.0.2.en.kdna`）是由 **张零（`Zhang Ling` · `actor:zhangling`）** 独立署名并以 **`CC-BY-4.0`** 协议公开发布的首部官方示范 KDNA 判断作品（共 45 题、5 个核心篇章）。作品从保存与使用上游判断系统的现实需求及“你的思考、判断与品味本身就是‘作品’”出发，系统阐述判断系统的定义、围绕需要保存的判断组织议题、三条创建路径与归属边界、与 Markdown/提示词/Skill/MCP 的分工配合、按需精确选读（`catalog` → `exact_selection`，防“判断污染”）、永久免账号的离线本地口令加密与许可边界、桌面端 `KDNA Reader` 离线精读（永久免费，打开即可免登录离线阅读内置双语白皮书与任意本地 `.kdna` 文件，可选免费登录 `KDNA ID` 开启多标签对照）、成果偏差四因排查，以及拒绝静默覆盖的版本差异确认机制。

---

## Coordinates / 作品坐标 (`v1.0.2`)

| Item / 项目 | Chinese Edition (`zh-CN`) | Native Equivalent English Edition (`en`) |
| --- | --- | --- |
| Catalog coordinate / 目录坐标 | `@aikdna/kdna-whitepaper` | `@aikdna/kdna-whitepaper-en` |
| Container asset ID / 资产标识 | `asset:kdna-whitepaper` (`uid:kdna-whitepaper-20261111`) | `asset:kdna-whitepaper` (`uid:kdna-whitepaper-20261111`) |
| Creator / 创建者 | `张零` (`actor:zhangling`) | `Zhang Ling` (`actor:zhangling`) |
| Publisher / 发布方 | AIKDNA (`https://aikdna.com`) | AIKDNA (`https://aikdna.com`) |
| Asset version / 资产版本 | `1.0.2` (`judgment_version: 1.0.2`) | `1.0.2` (`judgment_version: 1.0.2`) |
| Judgments & Chapters / 判题与篇章 | `45` structured judgments across `5` thematic sections + system kernel & `40` directed relations | `45` structured judgments across `5` thematic sections + system kernel & `40` directed relations |
| Artifact / 资产文件 | `kdna-whitepaper-1.0.2.zh-CN.kdna` (`2,725,359` bytes) | `kdna-whitepaper-1.0.2.en.kdna` (`2,843,386` bytes) |
| SHA-256 | `e344944a53f8d4bb2ca40a8d42bcd3c104e3067bfa92dce99e327cbc5aed40aa` | `6da515820eed210508d72a4ddbf68f7052cb180afe592c64e85e9a3fbb60c49e` |
| Sidecar / 校验文件 | `kdna-whitepaper-1.0.2.zh-CN.kdna.sha256` | `kdna-whitepaper-1.0.2.en.kdna.sha256` |
| Container checksums / 容器校验 | `checksums.json` (`kdna.checksums.document/2`, `verified_document_2`) | `checksums.json` (`kdna.checksums.document/2`, `verified_document_2`) |
| Protocol coordinate / 协议坐标 | Native container `0.6.0`; payload `kdna.payload.judgment` `0.5.1`; Core `kdna.core/0.8.2`; Canonical IR `kdna.canonical-ir/0.6.1`; Read `kdna.read/0.7.0-candidate` | Same exact `0.6.0` protocol tuple (`100%` structural isomorphism, `0` non-English protocol keys) |
| Access & License / 访问与许可 | `public` (permanently account-free) · `CC-BY-4.0` (`repository_license_applies: false`) | `public` (permanently account-free) · `CC-BY-4.0` (`repository_license_applies: false`) |

- **Tooling & offline graph / 公开 CLI 与仓库离线校验链:** Public CLI `@aikdna/kdna-cli@0.45.2` (`--budget` defaults to `1,000,000` bytes on `catalog` & `exact_selection`, and `4,000,000` bytes on `whole_asset`); repository offline test harness vendors `@aikdna/kdna-core@0.37.11`, `@aikdna/kdna-read@0.13.5`, and `@aikdna/kdna-cli@0.44.0`.

---

## Read & Download Immediately / 本地阅读与按需消费方式

### 1. KDNA Reader for macOS & Direct `.kdna` Downloads

- **macOS Desktop App (`KDNA Reader 0.3.4 build 30`, Apple Silicon, Apple Notarized / 苹果公证桌面版):** [https://aikdna.com/en/downloads](https://aikdna.com/en/downloads) · [https://aikdna.com/zh/downloads](https://aikdna.com/zh/downloads) · GitHub Releases mirror & SHA-256: [`aikdna/kdna-reader-releases`](https://github.com/aikdna/kdna-reader-releases)
- **Direct `.kdna` Binary Downloads (Permanently Account-Free Open `.kdna` Files):**
  - Chinese `v1.0.2` (`zh-CN`): [https://aikdna.com/downloads/whitepaper/v1.0.2/kdna-whitepaper-1.0.2.zh-CN.kdna](https://aikdna.com/downloads/whitepaper/v1.0.2/kdna-whitepaper-1.0.2.zh-CN.kdna)
  - Native English `v1.0.2` (`en`): [https://aikdna.com/downloads/whitepaper/v1.0.2/kdna-whitepaper-1.0.2.en.kdna](https://aikdna.com/downloads/whitepaper/v1.0.2/kdna-whitepaper-1.0.2.en.kdna)
- **GitHub Release (`kdna-whitepaper-1.0.2`):** [https://github.com/aikdna/kdna-assets/releases/tag/kdna-whitepaper-1.0.2](https://github.com/aikdna/kdna-assets/releases/tag/kdna-whitepaper-1.0.2)

`KDNA Reader` (`0.3.4 build 30`) is permanently free without usage limits (`中文 / English` UI, `Light / Dark` mode, local password unlock, and lossless `.kdna` export): both built-in bilingual *KDNA Whitepaper* editions and any local public or password-protected `.kdna` file open offline completely without signing in. Optional free `KDNA ID` sign-in unlocks multi-tab side-by-side comparison only.

### 2. Official CLI (`@aikdna/kdna-cli@0.45.2` · macOS / Windows / Linux)

Always start with `--mode catalog --format human`, then read only the judgment IDs relevant to your question with `--format human` or `--compact` (never use `--mode whole_asset` to fetch judgment prose):

```sh
# Validate container integrity, checksums.json, and system checks (Chinese & English v1.0.2)
npx -y @aikdna/kdna-cli@0.45.2 validate references/public/kdna-whitepaper/kdna-whitepaper-1.0.2.zh-CN.kdna --system --format human
npx -y @aikdna/kdna-cli@0.45.2 validate references/public/kdna-whitepaper/kdna-whitepaper-1.0.2.en.kdna --system --format human

# Step 1: Browse the 45-issue catalog (< 1.0s)
npx -y @aikdna/kdna-cli@0.45.2 read references/public/kdna-whitepaper/kdna-whitepaper-1.0.2.zh-CN.kdna --mode catalog --allow-read --format human
npx -y @aikdna/kdna-cli@0.45.2 read references/public/kdna-whitepaper/kdna-whitepaper-1.0.2.en.kdna --mode catalog --allow-read --format human

# Step 2: Selectively read specific judgments with mandatory closure intact
npx -y @aikdna/kdna-cli@0.45.2 read references/public/kdna-whitepaper/kdna-whitepaper-1.0.2.zh-CN.kdna \
  --mode exact_selection --judgment-id judgment:origins,judgment:work-itself --allow-read --format human
npx -y @aikdna/kdna-cli@0.45.2 read references/public/kdna-whitepaper/kdna-whitepaper-1.0.2.en.kdna \
  --mode exact_selection --judgment-id judgment:origins,judgment:work-itself --allow-read --format human

# Compare 1.0.1 -> 1.0.2 explicitly before switching
npx -y @aikdna/kdna-cli@0.45.2 diff \
  references/public/kdna-whitepaper/kdna-whitepaper-1.0.1.en.kdna \
  references/public/kdna-whitepaper/kdna-whitepaper-1.0.2.en.kdna \
  --format human
```

### 3. Offline Workspace Adapter (`kdna-assets`)

```sh
npm ci --offline --ignore-scripts --omit=optional --no-audit --no-fund
npm run audit
npm run audit:read
npm run read -- --id @aikdna/kdna-whitepaper --allow-read --mode catalog
npm run read -- --id @aikdna/kdna-whitepaper-en --allow-read --mode catalog
```

---

## Version Evolution (`1.0.0` → `1.0.1` → `1.0.2`)

Updating a judgment work is never a silent background overwrite (`judgment:version-upgrade-consent`):

- **What Changed in `1.0.2` (`2026-11-18` · Precision Protocol & Editorial Polish, Zero Claim Change):**
  1. **Language-Neutral ASCII `method_roles`:** Migrates all `100` underlying method component role identifiers per edition to canonical ASCII keys (`subject_interpreted`, `interpretive_link`, `premise`, `derivation`, `options`, `factors`, `priority_rule`, `criterion`, `comparison_method`, `decision_rule`) while keeping legacy `1.0.1` roles backward-compatible in `@aikdna/kdna-core@0.37.11`. The English edition (`kdna-whitepaper-1.0.2.en.kdna`) now contains zero Chinese characters anywhere in its raw JSON or CBOR frames.
  2. **Complete Bilingual Entity Display Names (`17/17`):** Populates human-readable `name` titles across all foundation `materials` (`3`), `shared_declarations` (`2`), and `sources` (`4`) alongside the `8` concept `definition` terms so CLI and Reader displays never fall back to raw `source:*` or `material:*` identifiers.
  3. **Five Thematic Reading Sections (`kdna.reading-sections/1`):** Encodes the five chapters (`一·定位与起源 #01–#09`, `二·概念边界 #10–#18`, `三·判断结构 #19–#29`, `四·生命周期 #30–#38`, `五·价值与生态 #39–#45`) in non-critical organization metadata strictly without parent-child semantic inheritance (`parent_ref: null`).
  4. **Editorial & Copy Polish + Container `checksums.json`:** Unifies English typographic curly quotes, grammatical noun-phrase `scope` statements, and `subject` terminology across `#01–#45`; removes redundant parenthetical code tokens and post-period whitespace in Chinese; and embeds verified `kdna.checksums.document/2` container checksums. Both `kdna-whitepaper-1.0.1.zh-CN.kdna` and `kdna-whitepaper-1.0.1.en.kdna` remain preserved in this directory for `kdna diff` inspection and version-pinned links.
- **What Changed in `1.0.1` (`2026-11-12`):**
  1. **Self-Contained KDNA Origins (`#01`, `#21`, `#24`, `#34`, `#36`):** Directly articulates KDNA's practical AI-collaboration origins and upstream judgment need without relying on external non-KDNA book backgrounds (superseding the initial Chinese-only `1.0.0` release).
  2. **Issue Organization Around Judgments (`#08`, `#09`, `#15`, `#41`):** Clarifies that issues organize around the judgments that need to be preserved—supporting both question-first discovery and working backward from existing conclusions, rules, processes, or methods.
  3. **Sole Human Authorship & Licensing Boundaries (`#16`, `#18`, `#23`, `#31`, `#33`, `#38`):** Establishes sole creator attribution (`张零` / `Zhang Ling`) with AI Agents recorded as authorized human tools; separates file holding, intellectual source, adoption, public readability, account-free local password encryption, and content licensing.
  4. **Output-Divergence Four-Cause Diagnosis (`#35`) & Native Equivalent English Edition (`en`):** Distinguishes asset distortion, read/condition mismatch, Agent execution limits, and newly surfaced trade-offs, and introduces the `100%` structurally isomorphic English `.kdna` edition.

---

## Technical Observation & Boundaries / 技术观测与协议边界

- Both `1.0.2` artifacts are admitted by the bound public Core (`status: accepted`, `reason: null`, `checksum_integrity: verified_document_2`) and disclosed by the bound public Read (`read_envelope` / `catalog_only` on catalog audit; `ready` on `exact_selection` and `whole_asset`) under explicit per-call local read permission.
- Public, local, and password-protected (`0.6.0`) `.kdna` reading and verification never require any online account. Read permission covers only the local call and checked bytes; it is not a transferable credential, remote delivery acknowledgment, or action authorization.
- Listings in [`index/current.json`](../../../index/current.json) record exact byte and protocol observations (`proof_limits` remain `not_evaluated` at the adapter layer). The root Apache-2.0 repository license does not apply to these assets; [`LICENSE`](./LICENSE) (`CC-BY-4.0`) governs the asset content and distribution.
