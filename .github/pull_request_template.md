## What changed?

## Why?

## Self-review checklist (the 2026-06-25 audit found these blind spots)

Run through these BEFORE requesting review. The 3 review rounds
that produced external-audit findings all had at least one
of these missed.

### Public facts

- [ ] **PR body matches the diff.** Every version number, SHA,
      tag, and gate result in the body is the actual diff
      value. (R7 in the 2026-06-25 audit — body said v0.1.1
      while diff was v0.1.2.)
- [ ] **All SHAs verified against actual dist file.** Run
      `shasum -a 256 dist/<name>-<version>.kdna` and confirm
      the value matches what's in `assets.json` and the PR body.
- [ ] **All release URLs return 200.** Test every download
      link in the body before submitting.
- [ ] **`assets.json` `contains` matches the actual payload.**
      Run
      ```bash
      python3 -c "
      import zipfile, json
      z = zipfile.ZipFile('dist/<name>.kdna')
      p = json.loads(z.read('payload.kdnab'))
      print('axioms:', len(p.get('core', {}).get('axioms', [])))
      print('self_checks:', len(p.get('reasoning', {}).get('self_checks', [])))
      print('scenarios:', len(p.get('scenarios', [])))
      print('cases:', len(p.get('cases', [])))
      print('failure_modes:', len(p.get('reasoning', {}).get('failure_modes', [])))
      "
      ```
      and confirm the numbers match the entry in `assets.json`.
- [ ] **`source_payload_parity` block has no fabricated numbers.**
      Every value in `source_payload_parity` should be either
      a real count from the source tree or an honest
      `build_coverage_notes` explanation. (R2 in the 2026-06-25
      audit — `payload_evolution_stages: 4` was actually 48.)

### Distributable artifacts

- [ ] **Sidecar `.kdna.sha256` uploaded to the GitHub release.**
      For every `.kdna` asset added in this PR, the matching
      `<name>.kdna.sha256` file must be present on the release.
      (R1 — `shasum -a 256 -c` must work for every asset.)
- [ ] **Sidecar content uses `<name>.kdna.sha256` format for
      new flagships.** Legacy content-domain assets may keep
      the `<name>.sha256` format until R4 unification.

### README

- [ ] **No links to files that don't exist in this repo.**
      Run
      ```bash
      grep -oE '\]\([^)]+\.md\)' README.md
      ```
      and verify each target file exists. (R3 + R4 + the
      2026-06-25 audit: `policy/submission-guidelines.md` and
      `policy/content-neutrality.md` were dead links 3
      separate times.)
- [ ] **No "## Submission" / "coming soon" sections** that
      reference docs that don't exist.
- [ ] **Download/verify commands are copy-paste-runnable**
      for every asset listed in the Available assets table.
      Don't write a template that works for one and hope the
      rest follow.
- [ ] **Quick start with `kdna-cli ≥ 0.27.4`** is included
      for any PR that adds an A-layer flagship.
- [ ] **License section** is included if a `LICENSE` file is
      added.

### License / governance

- [ ] **No "registry / v2 / legacy / install" language** has
      been reintroduced. (kdna-assets is content-neutral, not
      a package registry.)
- [ ] **If this PR adds a `LICENSE` file**, confirm the
      content matches what's in `kdna.json.license.type` for
      every affected asset.

### Public-only references (no private repo leaks)

- [ ] **No references to private-repo internals in the PR
      body, commit messages, comments, or workflow files.**
      Specifically: no private-repo file paths, no private-repo
      commit hashes, no hardcoded private-repo URLs in
      workflows (especially `git clone` lines).
- [ ] **CI workflows do not depend on cloning private repos.**
      If a workflow needs an audit/check script, it must be
      vendored into kdna-assets (not cloned from a private
      repo with hardcoded URL).
- [ ] **Workflows that need a private-repo tool** use a
      GitHub Actions secret (not a hardcoded URL or token).
- [ ] **References to internal strategy / process names** in
      public PR bodies are replaced with neutral descriptions
      ("internal release pipeline" rather than naming the
      specific private repo).

## Verification
- [ ] Asset validates: `kdna validate ./<asset>.kdna` → overall_valid: true
- [ ] SHA256 provided and matches
- [ ] Release card complete

## Does this reintroduce registry / v2 / legacy / install?
- [ ] No
