# agent:completion_adjudication — "Done" is an evidence ruling, not a status declaration.

> **Archived demonstration.** This page documents a superseded pre-CBOR AIKDNA example.
> The file is preserved for historical integrity and is intentionally rejected by the current runtime.
> This page provides archive metadata only; do not load this file with the current runtime.

> **An Agent saying "I'm done" is not completion. Completion is an evidence ruling.**

A KDNA asset that forces the Agent to surface four cells
before any completion claim can be made:

| Cell | Question it answers |
|---|---|
| **DONE CLAIM** | What specifically is being claimed as done? (Not "I fixed the bug" but "I fixed bug #142 by changing line 47 in `foo.py` from X to Y") |
| **OBSERVABLE PROOF** | A command, file, log line, URL, or any artifact a third party can check. Not the Agent's confidence. |
| **USER INTENT MATCH** | Does the proof address what the user actually wanted? (Not what they literally said — what they were trying to accomplish.) |
| **UNRESOLVED RISK** | What could still go wrong despite the proof? (An empty list is fine, but it must be stated.) |

A "done" claim that cannot fill all four cells is **not done**.

## Why this exists

The most common Agent failure is not "the work was not done".
It is **"the work was done but the Agent declared done without
checking."** The user accepts the false completion, then
discovers later that a deliverable was missing, a test was
skipped, or the user's intent was not actually addressed.

The six failure modes the asset targets:

| ID | Failure mode | What the Agent claims as "done" |
|---|---|---|
| MIS-001 | Tests-pass-is-done | "All tests pass, I'm done." (without naming a test for the new code) |
| MIS-002 | Compiled-is-done | "Compiles cleanly, ready to merge." (syntax-level, not behavior-level) |
| MIS-003 | Committed-is-done | "Pushed to the branch, ready for review." (bookkeeping, not verification) |
| MIS-004 | I-looked-at-it-is-done | "I reviewed the code and it looks correct." (self-review, biased) |
| MIS-005 | Verify-later-is-done | "Should work in production. Let's see." (defer without naming) |
| MIS-006 | Satisfaction-is-done | "All set!" "Looks good." (effort, not evidence) |

The asset trains the Agent to recognize these lexical
signatures and convert them into four-cell rulings.

## Before: a premature "Done!"

```
User:   Fix the bug where the dashboard doesn't show the new
        engagement rate metric.

Agent:  Done. I changed line 47 of internal/api/dashboard.go
        to add `WHERE active = true`. The dashboard should
        now show the engagement rate.
```

**What this hides:**
- No test was run after the change
- The render layer was not checked (the metric could be
  excluded by the UI even if the query returns rows)
- `WHERE active = true` may exclude test data the user
  wanted
- Other dashboard sections that depended on
  `SELECT * FROM metrics` may now return fewer rows

The user accepts "done", waits for the next deploy, and
discovers the metric is still missing — or worse, has
regressed.

## After: a four-cell ruling

```
Agent:  DONE CLAIM: internal/api/dashboard.go line 47 changed
        from `SELECT * FROM metrics` to
        `SELECT id, name, value FROM metrics WHERE active = true`.

        OBSERVABLE PROOF: the file diff is reviewable; however
        I have not actually run the dashboard to verify the
        new metric now renders, and I have not run any test
        that covers this path. Specifically: `make test` was
        not run after the change.

        USER INTENT MATCH: the user wanted the dashboard to
        show the engagement rate. Fixing the SQL query is
        necessary but not sufficient — the bug could also be
        in the render layer, the data-ingest path, or the
        UI component. I have not verified any of these.

        UNRESOLVED RISK:
          1. No test run on the changed path.
          2. Render layer not checked.
          3. The `active = true` filter may exclude test data.
          4. Regression: other dashboard sections that
             depended on `SELECT * FROM metrics` may now
             return fewer rows.

        Verdict: not done. Done pending items 1-4.
```

The user can now decide: do the work to verify, accept the
partial state, or unblock the Agent. Either way, no
surprises.

## The four-cell ruling (how the asset works)

```
Before saying "done", the Agent must surface:

  1. DONE CLAIM — the specific claim, not a category
     ❌ "fixed the bug"
     ✅ "fixed bug #142 by changing line 47 in foo.py from X to Y"

  2. OBSERVABLE PROOF — a third party can check
     ❌ "tests pass"
     ✅ "`pnpm test src/foo.test.ts` exits 0 with the new case"

  3. USER INTENT MATCH — literal ≠ goal
     ❌ "I added the button"  (when the user actually wanted
        "users can sign out cleanly")
     ✅ "I added the button, but the session-end flow is
        unverified — the literal ask is met, the intent is not"

  4. UNRESOLVED RISK — empty or named, not missing
     ❌ no list
     ✅ "1) production not run, 2) rollback plan missing, ..."

If any cell is unfilled: the claim is "done pending X", not done.
```

## Banned terms (signals of premature done)

The asset bans 18 phrases that correlate with under-evidenced
completion claims. Both English and Chinese:

| Banned | Why | Replace with |
|---|---|---|
| "should work" | future-tense hope, not evidence | "verified by [specific command/file/URL]" |
| "I checked it" | self-check is ungrounded | "[third-party command output]" |
| "all set" / "looks good" | satisfaction-reporting | "[four-cell ruling]" |
| "ready to merge" | conflates merge-readiness with completion | "[verification result + merge status]" |
| "tests pass" / "all green" / "CI is green" | suite-level, not change-level | "[specific test for the specific change]" |
| "completed" / "finished" / "all done" | status declaration without ruling | "[four-cell ruling]" |
| "搞定" / "完成了" / "可以合并" | Chinese versions of the same | "[四项完成裁定]" |

## Archived download and checksum

Download the asset:

```bash
curl -L -o agent-completion-adjudication-v0.1.1.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/agent-completion-adjudication-v0.1.1/agent-completion-adjudication-v0.1.1.kdna

# Verify SHA256
echo "2f46bccc47a9be987eb74262af60b7344850178dfa478a078df00ab178f107e4  agent-completion-adjudication-v0.1.1.kdna" | shasum -a 256 -c -
```

No current load command is provided for this archived artifact.

```bash
# Compact profile (~5.9 KB / 31 lines) — for the per-task completion gate
# Current runtime intentionally rejects this archived pre-CBOR artifact.
```

Apply at every "I'm done" / "completed" / "all set" moment.

## When to use it

- The Agent is about to claim completion in a user-visible
  message
- The user asks "is it done?" and the Agent must answer
- A long-running task has just finished and the next message
  is the completion claim
- The user is reviewing a PR / handoff the Agent prepared
- The user is debugging "the Agent said it was done but I'm
  not sure"
- The Agent is summarizing a multi-step task and claiming
  each step is complete

## When NOT to use it

- The user has explicitly overridden: "I don't need proof,
  just tell me when you've moved on" (rare; respects user
  override)
- The task is exploratory and the user understands the
  output is a draft ("give me your best guess about X")
- The Agent is providing a status update, not a completion
  claim ("here is what I have done so far, still working on X")
- The user is asking the Agent to brainstorm or speculate,
  where "done" is not a relevant concept
- The task is a single-step, single-environment action
  with deterministic verification the Agent has already
  run ("rename this variable")

## Evidence this asset works

> **Historical evidence note:** the table below records an early
> single-model self-evaluation. The locked July 2026 multi-Agent experiment did
> not meet the preregistered incremental-value gate for the tested old assets.
> This page therefore preserves the old observation without making a current
> behavioral-maturity, field-validation, or production claim.

The first external-Agent evaluation (3 task types × 2
conditions, single-model self-eval, 2026-06) showed:

| | Baseline (no KDNA) | With KDNA v0.1.1 | Delta |
|---|---|---|---|
| Total score (12 max) | 3 / 12 | 12 / 12 | +9 (+75%) |
| Premature "Done!" | 3 / 3 tasks | 0 / 3 tasks | -3 |
| Specific evidence named | 0 / 3 | 3 / 3 | +3 |
| Intent gap surfaced | 0 / 3 | 3 / 3 | +3 |
| UNRESOLVED RISK enumerated | 0 / 3 | 3 / 3 | +3 |

No public comparative evaluation report is included with this release.

This is single-model evidence (single-model self-evaluation). Cross-model
runs (Claude, Codex) are planned follow-up.

## Provenance

- **Source:** release metadata
- **Asset UID:** `urn:uuid:cb688d37-1d5e-4a7b-820f-e6a794288e5c`
- **SHA256:** `2f46bccc47a9be987eb74262af60b7344850178dfa478a078df00ab178f107e4`
- **Built with:** kdna-studio migrate --format v1 (kdna-studio-cli v0.6.4)
- **Historical pre-CBOR gate record:** 10/10 under the former release process;
  this is not current-format validation.
- **License:** CC-BY-4.0

## See also

- `agent:project_context` — sibling asset. This one judges
  completion claims. The sibling judges project documents.
  Together they cover the two ends of the Agent
  self-judgment loop.
