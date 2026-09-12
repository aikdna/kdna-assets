# KDNA Assets

This private source workspace provides an index and adapter for the current public KDNA Core and Read contracts. An index entry records a concrete observation of exact asset bytes. It does not certify content quality, expertise, human confirmation, or permission to act.

## Current status

This candidate binds Core `0.24.0-rc.component-semantics.2`, Read `0.3.0-rc.component-semantics.2`, and CLI `0.38.0-rc.component-semantics.1` through exact archive and installed-file digests. The Read protocol coordinate is `kdna.read/0.2.0`; package versions and protocol versions are different coordinates. See `public-contract-binding.json` for the complete tuple and `toolchain-files.json` for all 945 dependency files.

The two existing public reference assets retain their original bytes and licenses. Both are **rejected with `READ_CORE_INVALID` by this current graph**. Their historical acceptance belongs to its recorded older toolchain; it does not establish current compatibility. The schema 2 index records this rejection explicitly. `index/legacy-current.json` preserves the former index as history.

This source bundle contains those two public references and a synthetic technical test fixture. The separately held official 100-asset collection is not distributed here. Finite taxonomy, candidate-set and discriminator-set interpretation comes exclusively from the accepted public Core definition `3087cd19542e72322aec19b3015c916d2cfb074fa42e3fd76b3756bb4f097de3`. This adapter does not interpret containers or component content itself. Technical readability does not establish the completeness of judgment content.

## Offline setup

Use Node.js 22 or newer. The exact graph has been exercised on macOS arm64 with Node.js 26.5.0. All required package archives are included under `vendor/`:

```sh
npm ci --offline --ignore-scripts --omit=optional --no-audit --no-fund
npm test
npm run validate:indexes
npm run audit
npm run audit:read
```

Optional native packages are omitted; no install hooks are required. Run these commands from the extracted source workspace. This is an offline workspace distribution, not an assertion that installing this private package as another package's dependency supplies its development graph. No registry publication is configured.

The adapter verifies the exact dependency bytes before loading them. Extra, changed, missing, or unexpected symbolic-link dependency files fail closed. Asset paths, digests, per-asset file manifests, and license attachments are checked before calling the official Node Core and Read entry points. The adapter does not unpack `.kdna` containers or define a second payload parser.

## Dependency coordinates and publication

A direct declaration is either an exact SemVer or an integrity-locked `file:` coordinate. Placement follows what the documented entry needs: the vendored `@aikdna/*` pins belong in `devDependencies`, because here every documented command (`npm test`, `npm run audit`, `npm run audit:read`, `npm run read`) is a validation or inspection path for this workspace rather than a runtime surface of a publishable package, and `npm ci --omit=dev` intentionally leaves the workspace without an adapter graph. The peer that a vendored member declares is bound to this repository's own coordinate through `overrides`, so an unreadable vendor archive fails locally instead of sending npm to the registry.

If a release is ever published from this repository, every `file:` coordinate must first be replaced by the **exact registry version** (the `@aikdna/kdna-cli` pin included), because a consumer that installs the packed artifact from a registry has no `vendor/` directory next to it. `npm run check:publish-coordinates` reports the coordinates that are still local; it is green here because the package is `private` and no publication is configured.

## Gate entry points

A script that is a gate entry point starts its work behind `isEntryPoint()` from
`scripts/lib.mjs`, which compares realpaths instead of path strings. A literal
`process.argv[1] === import.meta.filename` comparison is false whenever the
caller reaches the file through a symlink (on macOS `/tmp` and `/var` are
symlinks into `/private`), and the module then exits 0 without printing
anything: a silent no-op that reads exactly like a passing gate.

Every gate entry point carries the same pair of checks before it is merged, and
`npm test` enforces the pair in `tests/entry-point-guard.test.mjs`:

1. invoking it through a symlinked path must still run it, and
2. a clean copy of this repository must really run it and print its success line.

An exit status of 0 is not evidence on its own; the success line is.

## Reading and observations

`npm run audit` checks the recorded Core outcomes with local read permission denied by default. `npm run audit:read` additionally gives explicit permission for that call and compares the current Read outcome with the indexed observation. A successful audit means the observation matches, including an accurately recorded rejection. When Core successfully admits an asset, the indexed `version` must exactly match its observed `asset_version`; a mismatch raises `ASSETS_ENTRY_VERSION_MISMATCH` before Read. Assets rejected by Core retain their original rejection and its public `states`, `diagnostics` and `component_failure` unchanged; their version is not guessed from rejected bytes. A Core-valid asset with blocked interpretation remains rejected, distinct from structurally invalid bytes. The adapter does not infer a more permissive state.

```sh
npm run read -- --id @aikdna/laozi-wuwei --allow-read --mode catalog
```

The preserved reference above is currently rejected, so this command returns its rejection and exits with code 1. For an authorized schema 2 collection, supply `--root /path/to/collection --index /path/to/index.json --id catalog-id`. The module API exports `observeAsset` and the catalog entry point exports `validateIndex` and `auditIndex`.

Supported modes are `catalog`, `whole_asset`, and `exact_selection`. Selection additionally requires `--judgment-id` with the actual judgment ID returned in the catalog. In this public contract, `whole_asset` returns asset declarations and the catalog; its judgment closure is empty. `exact_selection` supplies the selected judgment's mandatory closure. `--budget` sets a nonnegative byte budget; insufficient budget may produce an explicit no-body control result.

Read permission applies to the current process call, request, snapshot, and checked asset bytes. It is not a transferable credential, human confirmation, identity proof, remote delivery acknowledgment, or action authorization. All Read result channels and unavailable states remain explicit. The adapter does not provide handle expansion.

## Separately supplied collections

See [External collection workspace](docs/collection-workspace.md) for an actual offline layout and commands. A private collection remains outside this source archive; its catalog and explicit revision map do not enlarge the adapter's authority.

## History and licenses

Existing source checkouts retain older scripts, synthetic Creation fixtures, and historical evidence. They are not the default current command path. Old LoadPlan and Runtime Capsule instructions belong to the corresponding historical graph, not to this adapter. No historical receipt is upgraded into current acceptance.

The repository license is Apache-2.0. Each reference's own license governs that asset; see `LICENSE-POLICY.md` and the per-entry files. The synthetic fixture has its own Apache-2.0 notice and is only a technical test, with no claim of real human adoption.

KDNA creation and distribution do not require a listing in this reference repository. Listing, structural compatibility, provenance, license, adoption, and evidence of useful outcomes are separate claims.
