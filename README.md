# `kdna-assets` — Public KDNA Reference Works

[Website](https://aikdna.com) · [Read in KDNA Reader](https://aikdna.com/reader/?sample=kdna-whitepaper) · [Protocol (`aikdna/kdna`)](https://github.com/aikdna/kdna) · [CLI (`aikdna/kdna-cli`)](https://github.com/aikdna/kdna-cli)

Public repository for openly licensed `.kdna` judgment works, reproducible provenance records, and current container/read conformance checks.

---

## Featured Public Judgment Work

### 1. *KDNA Whitepaper* (`《KDNA白皮书》`) `v1.0.0`

Our first official public `.kdna` judgment work, authored by KDNA originator **Zhang Ling (张零)**. Across **45 connected judgments** organized into 9 thematic sections, it sets out why human thinking, judgment, and taste deserve an independent file format in the AI era, how a `.kdna` work is structured and protected locally, and where technical verification stops and human judgment begins.

| Field | Value |
| --- | --- |
| **Catalog & Asset ID** | `@aikdna/kdna-whitepaper` (`asset:kdna-whitepaper`) · `1.0.0` |
| **Container Format** | Native KDNA `0.6.0` |
| **Author** | 张零 (`Zhang Ling` · `actor:zhangling`) |
| **Content License** | [`CC-BY-4.0`](https://creativecommons.org/licenses/by/4.0/) |
| **Language** | `zh-CN` (readable with English/Chinese UI switch and optional local AI reading translation in KDNA Reader) |
| **Judgments** | `45` structured judgments + system kernel & directed relationship graph |
| **Artifact Path** | [`references/public/kdna-whitepaper/kdna-whitepaper-1.0.0.kdna`](./references/public/kdna-whitepaper/kdna-whitepaper-1.0.0.kdna) |
| **Release Notes & Provenance** | [`references/public/kdna-whitepaper/README.md`](./references/public/kdna-whitepaper/README.md) |
| **Size** | `2,570,249` bytes |
| **SHA-256** | `c299a7b95cdcf1eb0f063d0ec1dd98f7efefee5cc13d53ca1f05983e1f2a88e0` |

#### Read Immediately in KDNA Reader (Permanently Account-Free)

- **Web Reader (1-click open):** [https://aikdna.com/reader/?sample=kdna-whitepaper](https://aikdna.com/reader/?sample=kdna-whitepaper)
- **macOS Desktop App (Apple Silicon, Apple Notarized):** [https://aikdna.com/en/downloads](https://aikdna.com/en/downloads)

#### Inspect & Read via `@aikdna/kdna-cli`

```sh
# 1. Verify container structure and cryptographic digests
npx -y @aikdna/kdna-cli@0.43.4 validate \
  references/public/kdna-whitepaper/kdna-whitepaper-1.0.0.kdna

# 2. Inspect the 45-question catalog in plain text
npx -y @aikdna/kdna-cli@0.43.4 read \
  references/public/kdna-whitepaper/kdna-whitepaper-1.0.0.kdna \
  --mode catalog --allow-read --format human

# 3. Read a specific judgment with its required supporting & qualifying context
npx -y @aikdna/kdna-cli@0.43.4 read \
  references/public/kdna-whitepaper/kdna-whitepaper-1.0.0.kdna \
  --mode exact_selection \
  --judgment-id judgment:work-itself \
  --allow-read --format human
```

---

## Repository Layout & Verification Boundaries

- [`references/public/`](./references/public) — Openly licensed `.kdna` works distributed in this repository, each accompanied by its provenance notes, license declaration, and SHA-256 digest.
- [`index/`](./index), [`src/`](./src) & [`tests/`](./tests) — Automated admission, `catalog` / `exact_selection` / `whole_asset` read checks, vendored dependency-pinning checks (`@aikdna/kdna-core@0.37.9`, `@aikdna/kdna-read@0.13.3`, `@aikdna/kdna-cli@0.43.2`), and public-surface hygiene gates.
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
