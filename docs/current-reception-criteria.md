# Receiving new example assets under the current contract

> Last verified: 2026-10-27. This page records the criteria and the current
> blocker. It does not accept, create or register any asset by itself.
> See [Status update](#status-update-2026-09-13) for what changed after the
> blocker below was written; the blocker paragraph is kept as the record of
> the state it described.

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

## Current graph (2026-10-27)

The public adapter now binds the stable package graph Core `0.37.9`, Read
`0.13.3` and CLI `0.43.2`. Its current tuple is container `0.6.0`, payload
`kdna.payload.judgment` `0.5.1`, Core `kdna.core/0.8.2`, Canonical IR
`kdna.canonical-ir/0.6.1`, Runtime Capsule `kdna.runtime-capsule/0.3.1`,
Consumption Plan `kdna.consumption-plan/0.3.1`, Agent Host
`kdna.agent-host/0.3.1`, Judgment Trace `kdna.judgment-trace/0.3.1` and Read
`kdna.read/0.7.0-candidate`.

Core admits the exact checked bytes through its native byte-entry route. Read
uses the prepared retained-section route under explicit per-call permission.
The adapter has no second container parser. A catalog-only success is recorded
as `read_envelope` / `catalog_only`; a denied default-deny call is recorded as
`retained_failure` with `authority_denied`; an admission failure is recorded
as `admission_rejection`. None of these observations establishes human
preview, publication or action authorization.

## Current blocker

**No public reference asset is registered.** Three earlier entries -
`@aikdna/laozi-wuwei@0.1.1`,
`@aikdna/epictetus-control-and-character@0.1.1` and
`@aikdna/verification-scope@0.1.5` - have been removed from the current public
surface together with their index entries and downloads, because the first
public asset published from this repository will be the KDNA white paper.

Their bytes remain readable from this repository's Git history
(`git show 1423769:references/public/<slug>/<file>`), and the releases that
carried them were emptied as well: the five assets of `0.1.1` and the four of
`sage-reference-assets-v0.1.0` are withdrawn, so both releases now host no
download. The accurate statement is "removed from the current public surface",
not "never published". The two historical
references were rejected with `READ_CORE_INVALID` by the historical candidate
graph they were checked against (`checked_at` 2026-09-10, method
`public_node_adapter`); that rejection remains their accurate recorded
outcome. It is not evidence of compatibility with the current graph. This
adapter implements no legacy decoder or conversion.

Consequence: the repository currently holds **no example that completes the
loop on the current contract**. A reader who downloads the present examples and
uses the current candidates will see an explicit rejection. That is the honest
current state, not a defect to be papered over.

### Status update (2026-09-13)

The consequence sentence above is **superseded**, and the two rejection
statements above it are **not**. The two registered historical references
still retain their bytes and are still rejected with `READ_CORE_INVALID`.

The withdrawn `@aikdna/verification-scope@0.1.5` had been recorded as
`unpublished_candidate`: its bytes came from one complete creation through the
public Studio terminal Host, were admitted by the bound Core
`0.24.0-rc.component-semantics.2`, and were disclosed by the bound Read under
explicit local read permission. That covered steps 1-3 of the loop below and is
recorded here as the prior observation, not as a current listing.

Steps 4 and 5 are still incomplete for this entry and are not claimed: no
human previewed it, and it has no Release coordinate, so it is not published.
The loop is therefore closed for admission and disclosure, and open for human
preview and publication. The obligation not to edit the registered bytes, not
to relabel a fixture, and not to let a listing imply endorsement is unchanged.

### Status update (2026-10-27)

The historical `0.24.0-rc.component-semantics.2` admission and disclosure
statement above is preserved as history. It is not upgraded into current
acceptance. The current public adapter admits native container `0.6`, but the
committed public index still lists no reference asset. A successful local read
of separately supplied bytes covers steps 2 and 3 only; steps 1, 4 and 5
remain separate and must be evidenced independently.

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
| Read | Mode (`catalog`, `whole_asset`, `exact_selection`), the source of local read permission, the channel and status (`read_envelope` / `catalog_only`, `retained_failure`, `admission_rejection`, `no_body_control`, or `transport_failure`), and the budget | Claiming disclosure from a transport success alone |
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

Step 1 previously had one instance (`@aikdna/verification-scope`, created
through the current public creation flow rather than rebuilt from a legacy
asset) for which steps 2 and 3 were carried out; it has since been withdrawn
from the public surface. Steps 4 and 5 were pending for it, and step 4 is why it
was listed as an `unpublished_candidate` rather than a released asset.

## Related

- [`README.md`](../README.md) - current status and the exact bound graph.
- [`docs/collection-workspace.md`](./collection-workspace.md) - offline layout
  for a separately supplied collection.
- [`docs/creating-laozi-and-epictetus-kdna.md`](./creating-laozi-and-epictetus-kdna.md)
  - the retained creation record for the two withdrawn references, and what they
  did not claim.
