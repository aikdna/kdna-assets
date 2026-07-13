# PR Scope Adjudication

> **Archived demonstration.** This page documents a superseded pre-CBOR AIKDNA example.
> The file is preserved for historical integrity and is intentionally rejected by the current runtime.
> This page provides archive metadata only; do not load this file with the current runtime.

> Pr Scope Adjudication: the judgment threshold that separates good from harmful decisions.

Judges pr scope adjudication trade-offs in software engineering — distinguishing productive from counter-productive decisions.

**Judge which changes belong in one pull request or review unit by separating the coherent change claim, required support, incidental repair, and independently reviewable follow-up.**

## Core judgment

- **A PR should make one coherent, externally verifiable change claim; line count and file count are secondary.**
  - *Applies when:* defining or reviewing the purpose of a change set; deciding whether a PR is too broad or artificially narrow
  - *Does not apply when:* the repository uses a generated or vendor-only update with its own review contract
  - *Failure risk:* A broad claim such as 'improve reliability' can absorb anything; require an observable before/after or invariant.

- **Include all support required for the claim to be safe, deployable, observable, reversible, and verifiable.**
  - *Applies when:* supporting edits are challenged as out of scope; a split would leave code uncompilable, unsafe, or behaviorally incomplete
  - *Does not apply when:* the support has independent value and can be merged safely before or after with an explicit contract
  - *Failure risk:* Required-support reasoning can be abused to bundle convenience work; each support edit must have a direct dependency on the claim.

- **Split changes when they have independent purpose, owner, uncertainty, review expertise, deployment sequence, or rollback.**
  - *Applies when:* a change set contains multiple tickets, refactors, dependencies, or ownership domains
  - *Does not apply when:* the system cannot safely represent an intermediate state and the dependency is intrinsic
  - *Failure risk:* Over-splitting can create review overhead and invalid intermediate states; split on decision boundaries, not arbitrary chunks.

- **Incidental cleanup is out of scope unless it is inseparable from the core change or materially reduces its risk.**
  - *Applies when:* the author expands scope because nearby code is already open; reviewers cannot tell which differences are necessary
  - *Does not apply when:* the cleanup is a narrow prerequisite or removes a directly exercised obsolete path
  - *Failure risk:* Rigid exclusion can perpetuate harmful debt; allow tightly evidenced risk-reducing repair.

- **Make the scope ruling explicit with four cells: CORE_CHANGE, REQUIRED_SUPPORT, INCIDENTAL_REPAIR, and SEPARATE_FOLLOW_UP.**
  - *Applies when:* planning or reviewing a non-trivial PR; scope changes after implementation begins
  - *Does not apply when:* a truly trivial deterministic change has one obvious edit and one direct check
  - *Failure risk:* Classification can become ceremony; keep it concise and focused on contested or material edits.

## Scope

- **Out of scope:** Deciding product priority or whether the work should be funded.
- **Out of scope:** Mandating one branching or release workflow for every repository.
- **Out of scope:** Using scope discipline to omit tests, docs, security controls, migrations, or observability.
- **Out of scope:** Personal evaluation of the author or reviewer.
- **Out of scope:** Creating vague future tasks to make the present PR appear smaller.

## Common failure modes

## Worked scenarios

## Archived download and checksum

```bash
curl -L -o dev-pr-scope-adjudication-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-pr-scope-adjudication-v0.1.0/dev-pr-scope-adjudication-v0.1.0.kdna

echo "4b90b14afffde1f866736f5b6195f93ae3bf1f76fb3503f1654332b76328439a  dev-pr-scope-adjudication-v0.1.0.kdna" | shasum -a 256 -c -

# Current runtime intentionally rejects this archived pre-CBOR artifact.
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:5e6cafc7-38dc-4525-9388-162da7bbd4e9`
- **SHA256:** `4b90b14afffde1f866736f5b6195f93ae3bf1f76fb3503f1654332b76328439a`
- **Built with:** KDNA Studio CLI
- **License:** CC-BY-4.0
