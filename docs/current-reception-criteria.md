# Receiving new example assets under the current contract

> Last verified: 2026-09-13. This page records the criteria and the current
> blocker. It does not accept, create or register any asset by itself.

## What "received" means here

An example is received only when one exact graph has completed the whole loop,
in order:

1. the bytes were created and exported by an identified toolchain,
2. public Core admitted them,
3. public Read disclosed the intended selection under explicit local
   permission,
4. a human actually previewed the result, and
5. the entry records identity, source, license and the applicable version.

Steps 2, 3 and 4 are separate observations. A passing `validate`, a listing, a
synthetic fixture or a technical receipt does not substitute for any of them.

## Current blocker

The two registered public reference assets,
`@aikdna/laozi-wuwei@0.1.1` and
`@aikdna/epictetus-control-and-character@0.1.1`, **retain their original bytes
and licenses and are rejected with `READ_CORE_INVALID` by the current candidate
graph** (`checked_at` 2026-09-10, method `public_node_adapter`, recorded in
`index/current.json`). Their historical acceptance belongs to the older
toolchain recorded alongside them; it is not current compatibility, and this
adapter implements no legacy decoder or conversion.

Consequence: the repository currently holds **no example that completes the
loop on the current contract**. A reader who downloads the present examples and
uses the current candidates will see an explicit rejection. That is the honest
current state, not a defect to be papered over.

## What must not be done to unblock it

- Do not edit the registered bytes. The two `.kdna` files, their per-asset
  files, `index/current.json` and `index/legacy-current.json` are registered
  observations of exact bytes. Rewriting them to satisfy a newer graph would
  destroy the evidence and would not constitute an acceptance.
- Do not relabel an existing synthetic technical fixture as a user-facing
  example. Test material is not a user work.
- Do not present an asset by a philosopher's name as that philosopher's
  authorized or endorsed material. The existing entries are AI-created modern
  interpretations with `human_review=false` and keep that boundary.
- Do not let a listing imply endorsement, correctness, expertise, protocol
  approval or official truth.

## Reception checklist for a new sample

| Step | What the entry must record | What fails it |
|---|---|---|
| Creation | Exporting tool and its exact version, plus the exact Core/Read graph used | "Created with the latest" or an unversioned tool |
| Bytes | Path, media type, byte count, SHA-256 | A digest copied from another asset or from a version label |
| Core admission | Observed status; on rejection the public `states`, `diagnostics` and `component_failure` unchanged | Treating a version string as admission evidence |
| Read | Mode (`catalog`, `whole_asset`, `exact_selection`), the source of local read permission, the delivered channel or the explicit refusal, and the budget | Claiming disclosure from a transport success alone |
| Human preview | Which platform and engine rendered it, and the observed range | Treating a preview as identity proof or quality proof |
| Source and license | Creator identity claim, referenced public sources, per-asset license and its scope | Repository license assumed to cover the asset content |
| Applicable version | Asset version, container/payload tuple and judgment version | Merging the asset version with the protocol version |
| Proof limits | Explicit `not_evaluated` fields for creation, identity, action authorization and legal clearance | Leaving them implicit |

## Next steps (needs its own authorization)

1. Create a small set of **new** samples under the current design, with new
   identities; leave the two registered references untouched.
2. Run the offline audit for each sample and keep the raw observation.
3. Add new entries to the schema-2 index instead of replacing existing ones, so
   history and current state stay separable.
4. Record which platform actually rendered each sample; do not generalize from
   one machine.
5. Publish an entry only after the loop above completed, and report the rest as
   pending.

## Related

- [`README.md`](../README.md) - current status and the exact bound graph.
- [`docs/collection-workspace.md`](./collection-workspace.md) - offline layout
  for a separately supplied collection.
- [`docs/creating-laozi-and-epictetus-kdna.md`](./creating-laozi-and-epictetus-kdna.md)
  - how the two registered references were created and what they do not claim.
