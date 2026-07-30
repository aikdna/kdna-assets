# Creation acceptance fixture catalog

This directory contains a public-safe, synthetic fixture contract for
multi-role Creation Engine acceptance work. It covers eight role paths and
thirteen hostile cases. The static gate has no Creation Engine dependency; a
separate adapter runs the same catalog through an available Studio Core
`creationEngine`.

The catalog and runner output are not `.kdna` release artifacts or evidence
that Core, CLI, and an independent Runtime agree. They do not establish
real-user value, external authorship, publication authority, or Creation
Acceptance for any external subject.

## Authority boundary

Every human or organization confirmation receipt uses
`synthetic_fixture_authority`, binds only a synthetic subject and fixture
semantic digest, and sets `external_evidence` to `false`. Such a receipt may
exercise a confirmation contract, but it can never be cited as evidence that a
real person or organization confirmed anything.

The hostile confirmation checks establish only exact binding to the represented
subject, current semantic digest, and a declared organization authority. They
do not authenticate a real actor. External Host identity assurance remains
outside this synthetic evidence.

The Agent-authored fixture has no human or organization receipt. Across every
mode, receipts stay in private Creation evidence and must not synthesize Human
Lock records or Runtime creator identity.

## Coverage

The eight complete role paths are:

- content creator;
- instructor;
- graphic designer;
- architect;
- writer;
- programmer;
- Agent-authored non-human;
- organization-confirmed.

Each path includes purpose, source, promoted candidates, complete judgments,
explicit relations, confirmation state, applicable and counterexample tests, a
global-boundary test, a held-out task, and expected split and acceptance data.
Purpose records include `highest_question`, `worldview`, `value_order`, and
`judgment_role`. Candidate boundary fields are explicit rather than inferred
by the adapter.

The programmer path also contains an explicit `comparison` test. Its with-KDNA
and without-KDNA lanes receive byte-for-byte identical task text, declare the
bounded expected improvement, and require an exit without an invented blocker
when the compatibility concern does not apply.

The hostile set covers:

- contradictory historical materials;
- changed current judgment;
- client work misattributed as personal work;
- all-positive materials;
- stated principles conflicting with observed choices;
- sensitive material;
- Prompt Injection in source material;
- forged confirmation;
- modification after confirmation;
- an overbroad problem domain;
- slogan collapse;
- activation for an inapplicable task;
- semantic round-trip loss.

Every hostile oracle selects `refuse`, `pause`, `split`, or
`honest-downgrade` and records required recovery actions and prohibited claims.

## Static validation

From the repository root:

```bash
node scripts/check-creation-acceptance-catalog.mjs
node --test tests/creation-acceptance-catalog.test.mjs
```

The validator has no Creation Engine or Runtime dependency.
For every source, it recomputes SHA-256 from the exact UTF-8 bytes of
`fixture_material`; a stale or placeholder `content_digest` fails closed.

## Creation Engine execution

When a sibling Studio Core checkout is available:

```bash
node scripts/run-creation-acceptance.mjs
```

An explicit repository, installed package, or entry-file path can be supplied:

```bash
node scripts/run-creation-acceptance.mjs \
  --studio-core ../kdna-studio-core
```

The dynamically loaded runner executes the unreleased source-candidate
`creationEngine` operations for all eight roles, requires `assessReadiness` and
`compileProject` to pass, verifies the compiled judgment core, loading
condition, admitted Runtime priority/exception relations, judgment boundaries,
and misuse risks, verifies that comparison lanes were created and passed,
binds the current test-report digest into acceptance, and then exercises all
thirteen hostile mutations. Support and limit relations remain creation
evidence and are not expected in Runtime. Use `--json` for a machine-readable
receipt.

The catalog's `adapter_contract` records every deterministic translation:
confidence values, card type, relation state, test kinds, source metadata, and
runtime confirmation binding. Human and organization confirmations bind to the
Engine's current semantic revision and digest at record time. The runner never
upgrades them beyond `synthetic_fixture_authority`.

This runner deliberately stops before `.kdna` export or an independent
Runtime. Those require their own tool coordinates, build receipt, load checks,
and semantic round-trip evidence.

## Independent Runtime matrix

An explicit optional gate saves the accepted Agent-authored Engine workspace,
invokes the local Studio CLI `export-agent` command to produce and receipt a
temporary `.kdna`, validates and loads that exact file through JavaScript Core,
and then generates a temporary Swift Package that loads the same bytes through
Swift Core:

```bash
node scripts/run-creation-runtime-matrix.mjs \
  --studio-core ../kdna-studio-core \
  --studio-cli ../kdna-studio-cli \
  --swift-core ../kdna-core-swift
```

Both paths require a ready LoadPlan plus successful compact and full Runtime
Capsules. The command compares their asset identity, digest evidence, access,
profile, complete semantic `context`, and stable trace fields rather than only
Capsule headers. It reports the actual artifact SHA-256 and exact Studio,
JavaScript, and Swift source coordinates and source digests. Asset bytes are
created afresh; no digest is hard-coded.

On success the matrix prints its result and writes no receipt by default.
Private coordination may opt in with `--receipt <path>`; the target must be
outside this public repository or the runner fails closed before executing the
matrix. A private receipt labels its scope precisely: an explicit Studio CLI
source checkout, the JavaScript package resolved by Studio Core, and an
explicit Swift Core source checkout. It binds the redacted `export-agent`
command contract, exit result, CLI build receipt, tool coordinates, and exact
artifact digest. Current dirty-source coordinates and latest development
receipts are private coordination evidence, never repository fixtures. This
remains source-candidate integration rather than release evidence;
clean-install behavior is not evaluated and remains a release gate.

The temporary asset, Swift package, and Swift build directory are deleted on
success or failure. This matrix is intentionally not part of normal
`npm test`, because a standalone KDNA Assets checkout does not promise a Swift
toolchain or sibling Swift Core source. Use
`npm run check:creation-runtime-matrix` when both are available.
