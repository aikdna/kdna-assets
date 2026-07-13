## What changed?

## Entry type

- [ ] Public reference asset
- [ ] Licensed reference asset
- [ ] Cluster manifest
- [ ] Infrastructure only

## Independent facts

- [ ] Publisher and creator are recorded without implying expertise or endorsement.
- [ ] Access and the entry-local license are accurate.
- [ ] Version, path, Release tag, filename, SHA-256, and sidecar agree.
- [ ] Technical status reports only checks that actually ran.
- [ ] Each optional evidence claim is bounded and links to public evidence.
- [ ] Listing language does not imply correctness, ranking, official truth, or protocol approval.

## Boundary checks

- [ ] A public asset is under `references/public/`.
- [ ] A licensed asset is under `references/licensed/` and does not inherit the root license.
- [ ] A Cluster remains `kdna.cluster.json`, not `.kdna`.
- [ ] No private path, internal plan, credential detail, or private evidence appears here.

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
