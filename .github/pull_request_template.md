## What changed?

## Entry type

- [ ] Public reference asset
- [ ] Licensed reference asset
- [ ] Cluster manifest
- [ ] Archive/infrastructure only

## Independent facts

- [ ] Publisher and creator are recorded without implying expertise or endorsement.
- [ ] Access and the entry-local license are accurate.
- [ ] Version, local path, Release tag, filename, SHA-256, and sidecar agree.
- [ ] Technical status reports only checks that actually ran.
- [ ] Each optional evidence claim is bounded and links to public evidence.
- [ ] Listing language does not imply correctness, ranking, official truth, or protocol approval.

## Boundary checks

- [ ] A current public asset is under `references/public/`.
- [ ] A current licensed asset is under `references/licensed/` and does not inherit root CC-BY.
- [ ] A Cluster remains `kdna.cluster.json`, not `.kdna`.
- [ ] Current onboarding does not reference `archive/`.
- [ ] No historical checksum, tag, binary, or evidence record was rewritten.
- [ ] No private repository path, internal plan, credential detail, or private evidence appears here.

## Verification

```text
npm test:
npm run audit:
npm run check:releases:
git diff --check:
```

## What this PR does not claim

Describe any content-quality, behavior-value, field-validation, endorsement, or
authorization claim that this PR intentionally does **not** make.
