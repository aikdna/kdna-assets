# 《KDNA白皮书》 / KDNA Whitepaper (`@aikdna/kdna-whitepaper`)

`@aikdna/kdna-whitepaper` (`v1.0.0`, container ID `asset:kdna-whitepaper`) is our first official public `.kdna` judgment work (`《KDNA白皮书》`), authored by **张零 (Zhang Ling / `actor:zhangling`)** and published under **Creative Commons Attribution 4.0 International (`CC-BY-4.0`)**.

`《KDNA白皮书》`（`@aikdna/kdna-whitepaper` `v1.0.0`）是由 **张零（Zhang Ling / `actor:zhangling`）** 创作并以 **`CC-BY-4.0`** 协议公开发布的首部官方 KDNA 判断作品（共 45 题、9 个核心章节），系统阐述为何在 AI 时代人的思想、判断与品味需要独立的 `.kdna` 文件格式、它与普通文档/Prompt/Skill 的分工边界、四大能力支柱（共创与编译、按需最小读取 `exact_selection`、永久免账号的离线本地口令加密、人类沉浸式阅读与版本差异对比），以及审慎采用与版本升级机制。

---

## Coordinates / 作品坐标

| Item / 项目 | Value / 取值 |
| --- | --- |
| Catalog coordinate / 目录坐标 | `@aikdna/kdna-whitepaper` |
| Container asset ID / 资产标识 | `asset:kdna-whitepaper` |
| Author / 作者 | 张零 (`Zhang Ling` · `actor:zhangling`) |
| Publisher / 发布方 | AIKDNA (`https://aikdna.com`) |
| Asset version / 资产版本 | `1.0.0` (`judgment_version: 1.0.0`) |
| Judgments / 判题规模 | `45` structured judgments + system kernel & directed relations |
| Artifact / 资产文件 | `kdna-whitepaper-1.0.0.kdna`, `2,570,249` bytes, `sha256:c299a7b95cdcf1eb0f063d0ec1dd98f7efefee5cc13d53ca1f05983e1f2a88e0` |
| Sidecar / 校验文件 | `kdna-whitepaper-1.0.0.kdna.sha256` |
| Protocol coordinate / 协议坐标 | Native container `0.6.0`; payload `kdna.payload.judgment` `0.5.1`; Core `kdna.core/0.8.2`; Canonical IR `kdna.canonical-ir/0.6.1`; Read `kdna.read/0.7.0-candidate` |
| Bound workspace graph / 仓库离线校验链 | `@aikdna/kdna-core@0.37.9`, `@aikdna/kdna-read@0.13.3`, `@aikdna/kdna-cli@0.43.2` |
| Access / 访问级别 | `public` (permanently account-free / 永久免账号) |
| License / 许可协议 | `CC-BY-4.0` (`Copyright (c) 2026 张零 (Zhang Ling / zhangling)`), asset content and distribution only (`repository_license_applies: false`) |

---

## Read Immediately / 阅读与按需消费方式

### 1. KDNA Reader (Web & Apple-Notarized macOS App · Permanently Account-Free)

- **Web Reader (1-click open / 浏览器即开即读):** [https://aikdna.com/reader/?sample=kdna-whitepaper](https://aikdna.com/reader/?sample=kdna-whitepaper)
- **macOS Desktop App (Apple Silicon, Apple Notarized / 苹果公证桌面版):** [https://aikdna.com/en/downloads](https://aikdna.com/en/downloads)

Browse all 45 connected judgments, shared kernel concepts, directed support/qualifying edges, concrete examples, and SHA-256 verification details with zero installation or registration.

### 2. Official CLI (`@aikdna/kdna-cli@0.43.4`)

`@aikdna/kdna-cli@0.43.4` defaults `--budget` to `4194304` bytes (`4 MB`), so `catalog`, `exact_selection`, and `whole_asset` reads on this `2.57 MB` work run out of the box without manual byte-budget flags:

```sh
npx -y @aikdna/kdna-cli@0.43.4 inspect references/public/kdna-whitepaper/kdna-whitepaper-1.0.0.kdna --format human
npx -y @aikdna/kdna-cli@0.43.4 validate references/public/kdna-whitepaper/kdna-whitepaper-1.0.0.kdna --system --format human
npx -y @aikdna/kdna-cli@0.43.4 read references/public/kdna-whitepaper/kdna-whitepaper-1.0.0.kdna --mode catalog --allow-read --format human
npx -y @aikdna/kdna-cli@0.43.4 read references/public/kdna-whitepaper/kdna-whitepaper-1.0.0.kdna --mode exact_selection --judgment-id judgment:work-itself --allow-read --format human
```

### 3. Offline Workspace Adapter (`kdna-assets`)

```sh
npm ci --offline --ignore-scripts --omit=optional --no-audit --no-fund
npm run audit
npm run audit:read
npm run read -- --id @aikdna/kdna-whitepaper --allow-read --mode catalog
```

---

## Technical Observation & Boundaries / 技术观测与协议边界

- This exact artifact is admitted by the bound public Core (`status: accepted`, `reason: null`) and disclosed by the bound public Read (`read_envelope` / `catalog_only` on catalog audit; `ready` on `exact_selection` and `whole_asset`) under explicit per-call local read permission.
- Public, local, and password-protected (`0.6.0`) `.kdna` reading and verification never require any online account. Read permission covers only the local call and checked bytes; it is not a transferable credential, remote delivery acknowledgment, or action authorization.
- Listing in [`index/current.json`](../../../index/current.json) records an exact byte and protocol observation (`proof_limits` remain `not_evaluated` at the adapter layer). The root Apache-2.0 repository license does not apply to this asset; [`LICENSE`](./LICENSE) (`CC-BY-4.0`) governs the asset content and distribution.
