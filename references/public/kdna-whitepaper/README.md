# 《KDNA白皮书》 / KDNA Whitepaper (`v1.0.1` · `@aikdna/kdna-whitepaper` & `@aikdna/kdna-whitepaper-en`)

`@aikdna/kdna-whitepaper` (`zh-CN`) and `@aikdna/kdna-whitepaper-en` (`en`) are the official public `.kdna` editions of **KDNA Whitepaper (`《KDNA白皮书》`)** at **`v1.0.1`**, authored by **张零 (Zhang Ling / `actor:zhangling`)** and published under **Creative Commons Attribution 4.0 International (`CC-BY-4.0`)**.

`《KDNA白皮书》`（`v1.0.1`，同步提供原生中文版 `kdna-whitepaper-1.0.1.zh-CN.kdna` 与独立原生等义英文版 `kdna-whitepaper-1.0.1.en.kdna`）是由 **张零（`Zhang Ling` · `actor:zhangling`）** 独立署名并以 **`CC-BY-4.0`** 协议公开发布的首部官方 KDNA 判断作品（共 45 题、5 个核心章节）。作品从保存与使用上游判断系统的现实需求及“你的思考、判断与品味本身就是‘作品’”出发，系统阐述判断系统的定义、围绕需要保存的判断组织议题、三条创建路径与归属边界、与 Markdown/提示词/Skill/MCP 的分工配合、按需精确选读（`catalog` → `exact_selection`，防“判断污染”）、永久免账号的离线本地口令加密与许可边界、免登录桌面端 `KDNA Reader` 阅读、成果偏差四因排查，以及拒绝静默覆盖的版本差异确认机制。

---

## Coordinates / 作品坐标 (`v1.0.1`)

| Item / 项目 | Chinese Edition (`zh-CN`) | Native Equivalent English Edition (`en`) |
| --- | --- | --- |
| Catalog coordinate / 目录坐标 | `@aikdna/kdna-whitepaper` | `@aikdna/kdna-whitepaper-en` |
| Container asset ID / 资产标识 | `asset:kdna-whitepaper` (`uid:kdna-whitepaper-20261111`) | `asset:kdna-whitepaper` (`uid:kdna-whitepaper-20261111`) |
| Creator / 创建者 | `张零` (`actor:zhangling`) | `Zhang Ling` (`actor:zhangling`) |
| Publisher / 发布方 | AIKDNA (`https://aikdna.com`) | AIKDNA (`https://aikdna.com`) |
| Asset version / 资产版本 | `1.0.1` (`judgment_version: 1.0.1`) | `1.0.1` (`judgment_version: 1.0.1`) |
| Judgments / 判题规模 | `45` structured judgments + system kernel & `40` directed relations | `45` structured judgments + system kernel & `40` directed relations |
| Artifact / 资产文件 | `kdna-whitepaper-1.0.1.zh-CN.kdna` (`2,595,031` bytes) | `kdna-whitepaper-1.0.1.en.kdna` (`2,711,958` bytes) |
| SHA-256 | `9f01c10bc06771c6d28c0543cda9aa64118ae470d75a0178ea023b73b812a92b` | `9db199060f5d957b9aaeee38546dfed68b56d9a3a6f479eb2cc93181fba3580e` |
| Sidecar / 校验文件 | `kdna-whitepaper-1.0.1.zh-CN.kdna.sha256` | `kdna-whitepaper-1.0.1.en.kdna.sha256` |
| Protocol coordinate / 协议坐标 | Native container `0.6.0`; payload `kdna.payload.judgment` `0.5.1`; Core `kdna.core/0.8.2`; Canonical IR `kdna.canonical-ir/0.6.1`; Read `kdna.read/0.7.0-candidate` | Same exact `0.6.0` protocol tuple (`100%` structural isomorphism) |
| Access & License / 访问与许可 | `public` (permanently account-free) · `CC-BY-4.0` (`repository_license_applies: false`) | `public` (permanently account-free) · `CC-BY-4.0` (`repository_license_applies: false`) |

- **Tooling & offline graph / 公开 CLI 与仓库离线校验链:** Public CLI `@aikdna/kdna-cli@0.43.5` (`--budget` defaults to `1,000,000` bytes on `catalog` & `exact_selection`, and `4,000,000` bytes on `whole_asset`); repository offline test harness vendors `@aikdna/kdna-core@0.37.9`, `@aikdna/kdna-read@0.13.3`, and `@aikdna/kdna-cli@0.43.2`.

---

## Read & Download Immediately / 本地阅读与按需消费方式

### 1. KDNA Reader for macOS & Direct `.kdna` Downloads (Permanently Account-Free)

- **macOS Desktop App (`KDNA Reader`, Apple Silicon, Apple Notarized / 苹果公证桌面版):** [https://aikdna.com/en/downloads](https://aikdna.com/en/downloads) · [https://aikdna.com/zh/downloads](https://aikdna.com/zh/downloads)
- **Direct `.kdna` Binary Downloads:**
  - Chinese `v1.0.1` (`zh-CN`): [https://aikdna.com/downloads/whitepaper/v1.0.1/kdna-whitepaper-1.0.1.zh-CN.kdna](https://aikdna.com/downloads/whitepaper/v1.0.1/kdna-whitepaper-1.0.1.zh-CN.kdna)
  - Native English `v1.0.1` (`en`): [https://aikdna.com/downloads/whitepaper/v1.0.1/kdna-whitepaper-1.0.1.en.kdna](https://aikdna.com/downloads/whitepaper/v1.0.1/kdna-whitepaper-1.0.1.en.kdna)
- **GitHub Release (`kdna-whitepaper-1.0.1`):** [https://github.com/aikdna/kdna-assets/releases/tag/kdna-whitepaper-1.0.1](https://github.com/aikdna/kdna-assets/releases/tag/kdna-whitepaper-1.0.1)

Browse all 45 connected judgments, shared kernel concepts, boundaries, concrete examples, and SHA-256 verification details offline in `KDNA Reader` (`中文 / English` UI, `Light / Dark` mode, local asset management, and local password encryption/decryption) with zero account registration.

### 2. Official CLI (`@aikdna/kdna-cli@0.43.5` · macOS / Windows / Linux)

Always start with `--mode catalog --format human`, then read only the judgment IDs relevant to your question with `--format human` or `--compact` (never use `--mode whole_asset` to fetch judgment prose):

```sh
# Validate container integrity and system checks (Chinese & English v1.0.1)
npx -y @aikdna/kdna-cli@0.43.5 validate references/public/kdna-whitepaper/kdna-whitepaper-1.0.1.zh-CN.kdna --system --format human
npx -y @aikdna/kdna-cli@0.43.5 validate references/public/kdna-whitepaper/kdna-whitepaper-1.0.1.en.kdna --system --format human

# Step 1: Browse the 45-issue catalog (~1,100 tokens)
npx -y @aikdna/kdna-cli@0.43.5 read references/public/kdna-whitepaper/kdna-whitepaper-1.0.1.zh-CN.kdna --mode catalog --allow-read --format human
npx -y @aikdna/kdna-cli@0.43.5 read references/public/kdna-whitepaper/kdna-whitepaper-1.0.1.en.kdna --mode catalog --allow-read --format human

# Step 2: Selectively read specific judgments with mandatory closure intact
npx -y @aikdna/kdna-cli@0.43.5 read references/public/kdna-whitepaper/kdna-whitepaper-1.0.1.zh-CN.kdna \
  --mode exact_selection --judgment-id judgment:origins,judgment:work-itself --allow-read --format human
npx -y @aikdna/kdna-cli@0.43.5 read references/public/kdna-whitepaper/kdna-whitepaper-1.0.1.en.kdna \
  --mode exact_selection --judgment-id judgment:origins,judgment:work-itself --allow-read --format human
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

## Version Evolution (`1.0.0` → `1.0.1`)

Updating a judgment work is never a silent background overwrite (`judgment:version-upgrade-consent`):

- **Withdrawal of `1.0.0` from Active Downloads:** The initial Chinese-only `1.0.0` artifact (`2,570,249` bytes, `sha256:c299a7b95cdcf1eb0f063d0ec1dd98f7efefee5cc13d53ca1f05983e1f2a88e0`) has been superseded by `1.0.1` and withdrawn from the active public directory and release assets so public distributions carry only the self-contained bilingual `1.0.1` editions.
- **What Changed in `1.0.1` (`2026-11-12`):**
  1. **Self-Contained KDNA Origins (`#01`, `#21`, `#24`, `#34`, `#36`):** Directly articulates KDNA's practical AI-collaboration origins and upstream judgment need without relying on external non-KDNA book backgrounds.
  2. **Issue Organization Around Judgments (`#08`, `#09`, `#15`, `#41`):** Clarifies that issues organize around the judgments that need to be preserved—supporting both question-first discovery and working backward from existing conclusions, rules, processes, or methods without gating creation on whether a question seems "interesting."
  3. **Sole Human Authorship & Licensing Boundaries (`#16`, `#18`, `#23`, `#31`, `#33`, `#38`):** Establishes sole creator attribution (`张零` / `Zhang Ling`) while recording AI Agents honestly in provenance as human tools and capability extensions rather than co-creators; separates file holding, intellectual source, adoption, public readability, permanently account-free local password encryption, and content licensing; preserves holder choice between integrating into one asset or maintaining dedicated separate assets.
  4. **Output-Divergence Four-Cause Diagnosis (`#35`):** Clarifies that "like me" means acting by the holder's standards to produce satisfactory deliverables rather than mimicking past wording, and distinguishes asset distortion, read/condition mismatch, Agent execution limits, and newly surfaced trade-offs.
  5. **Native Equivalent English Edition (`en`):** Publishes `kdna-whitepaper-1.0.1.en.kdna` with 100% structural isomorphism across all 45 judgments, 90 reasons, 45 examples, and 40 directed relationships.

---

## Technical Observation & Boundaries / 技术观测与协议边界

- Both `1.0.1` artifacts are admitted by the bound public Core (`status: accepted`, `reason: null`) and disclosed by the bound public Read (`read_envelope` / `catalog_only` on catalog audit; `ready` on `exact_selection` and `whole_asset`) under explicit per-call local read permission.
- Public, local, and password-protected (`0.6.0`) `.kdna` reading and verification never require any online account. Read permission covers only the local call and checked bytes; it is not a transferable credential, remote delivery acknowledgment, or action authorization.
- Listings in [`index/current.json`](../../../index/current.json) record exact byte and protocol observations (`proof_limits` remain `not_evaluated` at the adapter layer). The root Apache-2.0 repository license does not apply to these assets; [`LICENSE`](./LICENSE) (`CC-BY-4.0`) governs the asset content and distribution.
