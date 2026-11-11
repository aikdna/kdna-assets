# 《KDNA白皮书》 / KDNA White Paper (`@aikdna/kdna-whitepaper`)

`@aikdna/kdna-whitepaper` (`v1.0.0`) is the official KDNA White Paper
(`《KDNA白皮书》`), authored by **张零 (Zhang Ling / `zhangling`)** and
published under **Creative Commons Attribution 4.0 International (`CC-BY-4.0`)**.

`《KDNA白皮书》`（`@aikdna/kdna-whitepaper` `v1.0.0`）是由 **张零（Zhang Ling / `zhangling`）** 创作并以 **`CC-BY-4.0`** 协议公开发布的官方 KDNA 白皮书判断资产，系统阐述 KDNA 的判断载体定义、与 Markdown / Prompt / Skill 的边界分工、四大能力支柱（创建、最小按需消费 `exact_selection`、无账户本地密码加密、人类阅读与版本对比）、三条创建路径、持续授权与判断污染隔离，以及授权驱动的版本升级机制。

---

## Coordinates / 资产坐标

| Item / 项目 | Value / 取值 |
| --- | --- |
| Catalog coordinate / 目录坐标 | `@aikdna/kdna-whitepaper` |
| Author / 作者 | 张零 (Zhang Ling / `zhangling`) |
| Publisher / 发布方 | AIKDNA (`https://aikdna.com`) |
| Asset version / 资产版本 | `1.0.0` (`judgment_version: 1.0.0`) |
| Judgments / 判题规模 | 45 judgments |
| Artifact / 资产文件 | `kdna-whitepaper-1.0.0.kdna`, 2,570,249 B, `sha256:c299a7b95cdcf1eb0f063d0ec1dd98f7efefee5cc13d53ca1f05983e1f2a88e0` |
| Sidecar / 校验文件 | `kdna-whitepaper-1.0.0.kdna.sha256` |
| Protocol coordinate / 协议坐标 | Native container `0.6.0`; payload `kdna.payload.judgment` `0.5.1`; Core `kdna.core/0.8.2`; Canonical IR `kdna.canonical-ir/0.6.1`; Read `kdna.read/0.7.0-candidate` |
| Bound workspace graph / 绑定工具链 | `@aikdna/kdna-core@0.37.9`, `@aikdna/kdna-read@0.13.3`, `@aikdna/kdna-cli@0.43.2` |
| Access / 访问级别 | `public` |
| License / 许可协议 | `CC-BY-4.0` (`Copyright (c) 2026 张零 (Zhang Ling / zhangling)`), asset content and distribution only (`repository_license_applies: false`) |

---

## Read Locally / 本地读取方式

### 1. Using KDNA Reader / 使用 KDNA Reader 阅读

Open `kdna-whitepaper-1.0.0.kdna` in **KDNA Reader** (`https://aikdna.com/reader/` or the desktop app) to browse the 45-judgment structure, shared concepts, cross-judgment support relations, and boundaries.

### 2. Using `@aikdna/kdna-cli` / 使用官方 CLI 按需消费

```sh
npx -y @aikdna/kdna-cli inspect references/public/kdna-whitepaper/kdna-whitepaper-1.0.0.kdna --json
npx -y @aikdna/kdna-cli validate references/public/kdna-whitepaper/kdna-whitepaper-1.0.0.kdna --system
npx -y @aikdna/kdna-cli read references/public/kdna-whitepaper/kdna-whitepaper-1.0.0.kdna --mode catalog --allow-read
```

### 3. Using This Workspace's Offline Adapter / 使用本仓库离线适配器审计与读取

```sh
npm ci --offline --ignore-scripts --omit=optional --no-audit --no-fund
npm run audit
npm run audit:read
npm run read -- --id @aikdna/kdna-whitepaper --allow-read --mode catalog
```

---

## Technical Observation & Boundaries / 技术观测与协议边界

- This exact artifact is admitted by the bound public Core (`status: accepted`, `reason: null`) and disclosed by the bound public Read (`read_envelope` / `catalog_only` on catalog audit; `ready` on `exact_selection` and `whole_asset`) under explicit per-call local read permission.
- Read permission covers only the local call and checked bytes; it is not a transferable credential, remote delivery acknowledgment, or action authorization.
- Listing in [`index/current.json`](../../../index/current.json) records an exact byte and protocol observation (`proof_limits` remain `not_evaluated` at the adapter layer). The root Apache-2.0 repository license does not apply to this asset; [`LICENSE`](./LICENSE) (`CC-BY-4.0`) governs the asset content and distribution.
