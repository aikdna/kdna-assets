# Completion Adjudication

> Completion Adjudication: the judgment threshold that separates good from harmful decisions.

Judgment asset for completion adjudication — criteria, signals, and failure modes.

**Judge whether an Agent's completion claim is supported by a specific claim, observable proof, user-intent match, and explicit unresolved risk.**

## Core judgment

- **Completion is an evidence ruling, not a status declaration.**
  - *Applies when:* the Agent is about to say done, completed, fixed, finished, ready, or equivalent
  - *Does not apply when:* the Agent is clearly reporting interim progress without claiming completion
  - *Failure risk:* The framework can make trivial deterministic actions verbose; scale presentation while still retaining the four judgments.

- **The done claim must name the exact bounded outcome being adjudicated.**
  - *Applies when:* claiming completion of implementation, analysis, content, operations, or file delivery
  - *Does not apply when:* the task is a single obvious deterministic action and the artifact itself fully identifies the outcome
  - *Failure risk:* Over-narrow claims can technically pass while evading the user's broader intended outcome; pair with intent match.

- **Proof must be observable, change-specific, and capable of falsifying the claim.**
  - *Applies when:* presenting evidence for a completion claim
  - *Does not apply when:* the artifact is self-evident and directly inspectable without an additional test
  - *Failure risk:* A passing check may itself be weak or misconfigured; disclose evidence coverage and limitations.

- **Literal task completion is insufficient when the user's intended outcome remains unverified.**
  - *Applies when:* the request is a means to a broader outcome; multiple layers can affect the observed behavior
  - *Does not apply when:* the user explicitly limits success to the literal artifact and accepts its constraints
  - *Failure risk:* Inferring intent can overreach; state the basis and distinguish literal satisfaction from inferred goal.

- **Residual risk must be named or explicitly stated as none within the tested boundary.**
  - *Applies when:* every nontrivial completion ruling
  - *Does not apply when:* a trivial deterministic action has no plausible residual risk beyond the directly observed result
  - *Failure risk:* Enumerating every theoretical risk creates noise; include material risks connected to scope and evidence.

## Scope

- **Out of scope:** Estimating future completion or motivating a team.
- **Out of scope:** Inventing test results, deployments, user observations, or third-party confirmation.
- **Out of scope:** Speculating about hidden motives or broadening the accepted success condition.
- **Out of scope:** An exhaustive list of every theoretical failure in the system.
- **Out of scope:** Using one completed subtask as evidence that the entire multi-step task is done.

## Common failure modes

## Worked scenarios

## Install and load

```bash
curl -L -o dev-completion-adjudication-v0.1.1.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-completion-adjudication-v0.1.1/dev-completion-adjudication-v0.1.1.kdna

echo "490bb03222b359b9d56ed539d7120aa5264e55a86497cda8ec7c15cacf01b3d3  dev-completion-adjudication-v0.1.1.kdna" | shasum -a 256 -c -

kdna load dev-completion-adjudication-v0.1.1.kdna --profile=compact --as=prompt
```

## Provenance

- **Version:** 0.1.1
- **Asset UID:** `urn:uuid:6879a2d3-6cc9-4f46-9950-4916a39f7f20`
- **SHA256:** `490bb03222b359b9d56ed539d7120aa5264e55a86497cda8ec7c15cacf01b3d3`
- **Built with:** kdna-studio-cli (kdna-assets-internal 10-gate pipeline)
- **Gates:** 10 PASS, 0 SKIP, 0 FAIL of 10
- **License:** CC-BY-4.0
