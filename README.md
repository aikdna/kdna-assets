# `kdna-assets` — Public KDNA Reference Works

[Website](https://aikdna.com) · [Download KDNA Reader (EN)](https://aikdna.com/en/downloads) · [下载 KDNA Reader (中文)](https://aikdna.com/zh/downloads) · [Protocol (`aikdna/kdna`)](https://github.com/aikdna/kdna) · [CLI (`aikdna/kdna-cli`)](https://github.com/aikdna/kdna-cli) · [Skills (`aikdna/kdna-skills`)](https://github.com/aikdna/kdna-skills)

Public repository for openly licensed `.kdna` judgment works, reproducible provenance records, version evolution notes, and current container/Read conformance checks.

---

## Featured Public Judgment Work

### 1. *KDNA Whitepaper* (`《KDNA白皮书》`) `v1.0.1` — Native Chinese & Equivalent English Editions

Our first official public `.kdna` judgment work, authored by KDNA originator **Zhang Ling (张零)**. Across **45 connected judgments** organized into 5 thematic sections (with 40 directed relationships), it sets out why human thinking, judgment, and taste deserve an independent file format in the AI era, how issues organize around the judgments that need to be preserved, how `.kdna` works are consumed selectively (`catalog` → `exact_selection`), protected locally without an online account, and evolved via explicit diffs rather than silent overwrites.

| Field | Chinese Edition (`zh-CN`) | Native Equivalent English Edition (`en`) |
| --- | --- | --- |
| **Catalog & Asset ID** | `@aikdna/kdna-whitepaper` (`asset:kdna-whitepaper`) · `1.0.1` | `@aikdna/kdna-whitepaper-en` (`asset:kdna-whitepaper`) · `1.0.1` |
| **Container Format** | Native KDNA `0.6.0` | Native KDNA `0.6.0` |
| **Creator** | `张零` (`actor:zhangling`) | `Zhang Ling` (`actor:zhangling`) |
| **Content License** | [`CC-BY-4.0`](https://creativecommons.org/licenses/by/4.0/) | [`CC-BY-4.0`](https://creativecommons.org/licenses/by/4.0/) |
| **Judgments** | `45` structured judgments + system kernel & `40` directed relations | `45` structured judgments + system kernel & `40` directed relations |
| **Artifact Path** | [`references/public/kdna-whitepaper/kdna-whitepaper-1.0.1.zh-CN.kdna`](./references/public/kdna-whitepaper/kdna-whitepaper-1.0.1.zh-CN.kdna) | [`references/public/kdna-whitepaper/kdna-whitepaper-1.0.1.en.kdna`](./references/public/kdna-whitepaper/kdna-whitepaper-1.0.1.en.kdna) |
| **Size** | `2,595,031` bytes | `2,711,958` bytes |
| **SHA-256** | `9f01c10bc06771c6d28c0543cda9aa64118ae470d75a0178ea023b73b812a92b` | `9db199060f5d957b9aaeee38546dfed68b56d9a3a6f479eb2cc93181fba3580e` |

- **Release Notes, Provenance & `1.0.0` → `1.0.1` Evolution Summary:** [`references/public/kdna-whitepaper/README.md`](./references/public/kdna-whitepaper/README.md) (supersedes the initial `1.0.0` Chinese-only release, which has been withdrawn from active downloads).

#### Read & Download Locally (Permanently Account-Free)

- **KDNA Reader for macOS (Apple Silicon, Apple Notarized, `中文 / English` & `Light / Dark` UI):** [https://aikdna.com/en/downloads](https://aikdna.com/en/downloads) · [https://aikdna.com/zh/downloads](https://aikdna.com/zh/downloads)
- **Direct `.kdna` Downloads:**
  - Chinese `v1.0.1` (`zh-CN`): [https://aikdna.com/downloads/whitepaper/v1.0.1/kdna-whitepaper-1.0.1.zh-CN.kdna](https://aikdna.com/downloads/whitepaper/v1.0.1/kdna-whitepaper-1.0.1.zh-CN.kdna)
  - English `v1.0.1` (`en`): [https://aikdna.com/downloads/whitepaper/v1.0.1/kdna-whitepaper-1.0.1.en.kdna](https://aikdna.com/downloads/whitepaper/v1.0.1/kdna-whitepaper-1.0.1.en.kdna)
- **GitHub Release (`kdna-whitepaper-1.0.1`):** [https://github.com/aikdna/kdna-assets/releases/tag/kdna-whitepaper-1.0.1](https://github.com/aikdna/kdna-assets/releases/tag/kdna-whitepaper-1.0.1)

#### Inspect & Selectively Read via `@aikdna/kdna-cli@0.43.5` (macOS / Windows / Linux)

```sh
# 1. Verify container structure, digests, and system checks
npx -y @aikdna/kdna-cli@0.43.5 validate \
  references/public/kdna-whitepaper/kdna-whitepaper-1.0.1.en.kdna \
  --system --format human

# 2. Browse the 45-question catalog in plain text (~1,100 tokens)
npx -y @aikdna/kdna-cli@0.43.5 read \
  references/public/kdna-whitepaper/kdna-whitepaper-1.0.1.en.kdna \
  --mode catalog --allow-read --format human

# 3. Read selected judgments in English human text with mandatory closure intact
npx -y @aikdna/kdna-cli@0.43.5 read \
  references/public/kdna-whitepaper/kdna-whitepaper-1.0.1.en.kdna \
  --mode exact_selection \
  --judgment-id judgment:work-itself,judgment:creation-restraint,judgment:safe-consumption \
  --allow-read --format human

# 4. Emit closure-preserving compact JSON for AI Agent context windows
npx -y @aikdna/kdna-cli@0.43.5 read \
  references/public/kdna-whitepaper/kdna-whitepaper-1.0.1.en.kdna \
  --mode exact_selection \
  --judgment-id judgment:origins,judgment:work-itself \
  --allow-read --compact
```

---

## Repository Layout & Verification Boundaries

- [`references/public/`](./references/public) — Openly licensed `.kdna` works distributed in this repository, each accompanied by its provenance notes, license declaration, and SHA-256 digest.
- [`index/`](./index), [`src/`](./src) & [`tests/`](./tests) — Automated admission, `catalog` / `exact_selection` / `whole_asset` read checks, public-surface hygiene gates, and offline vendored dependency-pinning checks (`@aikdna/kdna-core@0.37.9`, `@aikdna/kdna-read@0.13.3`, and the repository's vendored `@aikdna/kdna-cli@0.43.2` dev fixture; interactive CLI users should use `@aikdna/kdna-cli@0.43.5`).
- [`evidence/`](./evidence) — Allowlisted historical rebuild receipts retained for auditability and verified by `scripts/check-public-surface.mjs`.

**Trust & Scope Reminder:**

- Passing technical validation (`kdna validate` and `npm test`) proves that the `.kdna` artifact bytes match their declared container specification, digests, and Read closure rules. Evaluating the substantive claims inside any work remains a human reader's responsibility.
- Public, local, and password-protected (`0.6.0`) `.kdna` verification and reading are permanently account-free.

---

## Run All Verification Checks Locally

Requires **Node.js `>=22`** (all required dependencies are vendored under `vendor/` for offline installation):

```sh
npm ci --offline --ignore-scripts --omit=optional --no-audit --no-fund
node scripts/check-public-surface.mjs --strict
npm run validate:indexes
npm run audit
npm run audit:read
npm test
```

## License

Repository code and test tooling are licensed under [Apache-2.0](./LICENSE). Individual `.kdna` works under `references/public/` carry their own explicit content licenses (such as `CC-BY-4.0`) documented alongside each artifact.
