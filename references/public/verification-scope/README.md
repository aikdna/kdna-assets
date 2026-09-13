# Verification Scope Judgment

`@aikdna/verification-scope` is the catalog coordinate for a public,
current-contract reference asset. It is an AI-authored judgment asset about
what may be reported when a verification was not performed on the bytes being
reported. It is not official guidance, not a compliance rule, and not an
endorsement of any tool, process or organization.

## Highest question

What may be reported about a verification that the reporter did not perform
on the bytes being reported?

## What it contains

- `verification-state`: states a check can be in with respect to the bytes
  actually being reported (a check exists; checked on the current bytes;
  checked on other bytes; not checked), authored as a taxonomy.
- `missing-check`: the candidate reasons a check is absent (not run; run on
  other bytes; not applicable) and the observations that separate them,
  authored as a candidate set with a discriminator set.

Both judgments are disclosed with their component interpretations. The
selected alternatives state the verified scope before the conclusion and name
the absent check instead of substituting an inference.

## Coordinates

| Item | Value |
| --- | --- |
| Catalog coordinate | `@aikdna/verification-scope` |
| Asset version | `0.1.5` |
| Artifact | `verification-scope-0.1.5.kdna`, 13864 B, `sha256:5c32fff6e1c0846bbcb726935d9f55b7b0b77d26fda6771706483fb543677dd5` |
| Judgment ids | `judgment:3af0b1fe11a3d6bf5d85c2c5f881e935ee532b9dc81ee0d47a771270867d4675`, `judgment:f4c69c39d5364c605ab7699791448f36d196ba38bbef131e35f354a4bfd78def` |
| Protocol coordinate | `kdna.read/0.2.0`; container `0.2.0`; payload `kdna.payload.judgment` `0.2.0` |
| Core | `@aikdna/kdna-core@0.24.0-rc.component-semantics.2` |
| Read | `@aikdna/kdna-read@0.3.0-rc.component-semantics.2` |
| Component definition | `sha256:3087cd19542e72322aec19b3015c916d2cfb074fa42e3fd76b3756bb4f097de3` |
| Access | `public` |
| License | `CC-BY-4.0`, asset content and distribution only; the repository license does not cover the asset |
| Publication status | `unpublished_candidate` — no GitHub Release coordinate exists yet |

The asset carries its own minted identity (`asset:58063a12-2ff2-496a-924a-46f87e7eab1b`)
inside the container. `@aikdna/verification-scope` is the catalog coordinate
this index lists; the two are recorded separately because the current
creation flow mints the container identity per session and it is not
authoritative for listing.

## How it was made

The bytes were produced by one complete current-contract creation through the
public Studio terminal Host (`@aikdna/kdna-studio-cli@0.13.0-rc.components.1`
consuming `@aikdna/kdna-studio-core@4.0.0-rc.components.1`): declared
materials, two judgment groups with substantive alternatives, a live selection,
a complete pre-compiler preview, and a fresh final adoption on the separate
authorized-Agent channel, exported as a private bundle whose saved bytes were
re-read and admitted before completion.

Adoption was `delegated_agent_editorial`. The author and adopter are both the
recording Agent. **No human reviewed or previewed this asset**, and the asset
does not claim human review, expert endorsement, or verified identity. The
private creation evidence stays outside this repository.

## Current observation

This exact artifact is **admitted by the current public Core**
`0.24.0-rc.component-semantics.2` (`status: accepted`), and the current public
Read discloses its catalog and its selected judgments under an explicit local
read permission. The observation, including the exact bytes and digests it
was taken on, is recorded in [`index/current.json`](../../../index/current.json).
The two earlier reference assets in this repository keep their original bytes
and remain rejected with `READ_CORE_INVALID` by the same graph.

## Read it

From a checkout of this workspace, with the vendored graph installed:

```sh
npm ci --offline --ignore-scripts --omit=optional --no-audit --no-fund
npm run read -- --id @aikdna/verification-scope --allow-read --mode catalog
```

The command reads the exact bytes listed in the index, admits them with the
installed public Core, and discloses the catalog only under explicit local
read permission. Permission covers that call and those bytes; it is not a
transferable credential, an identity proof, an action authorization, or a
delivery acknowledgment.

## What it does not claim

- It does not claim that any listed judgment is correct, complete, or
  endorsed by a person or organization.
- It does not claim that a human reviewed or adopted it.
- It does not claim production readiness, adoption by a real consumer, or an
  outcome.
- Its listing is not an endorsement of its content, and no download
  coordinate exists until it is actually published.
