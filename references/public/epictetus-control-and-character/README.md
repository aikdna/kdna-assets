# Epictetus-Inspired Control and Character Judgment

`@aikdna/epictetus-control-and-character@0.1.0` is a public, experimental
judgment asset. It is an AI-authored modern interpretation inspired by
Epictetus, not an authoritative or complete account of Epictetus or Stoicism.

## Highest question

When facing uncertainty, loss, other people's judgment, or external change,
what belongs to one's choice, what can only be influenced, and what responsible
action expresses good character now?

面对不确定、损失、他人评价或外部变化，什么属于自己的选择，什么只能影响；
此刻哪种负责的行动体现良好品格？

## Judgment role

Use it to separate direct governance, influence, and external outcomes; test
impressions before assent; separate action quality from outcome guarantee; and
return action to legitimate roles, responsibility, and character.

Do not use it to delay urgent protection, suppress emotion, blame victims,
excuse negligence, erase structural causes, waive rights, replace mental-health
care, or forbid collective and legal action.

## Contents and access

- 6 axioms, 5 patterns, 8 scenarios, 8 cases, 6 reasoning chains
- 9 ontology distinctions, 5 boundaries, 6 risks, 6 misunderstandings
- 8 self-check cards and 3 evolution stages
- access: `public`
- license: `CC-BY-4.0`
- runtime payload: English; public metadata: English and Simplified Chinese

## Provenance and evidence

Creator: OpenAI Codex agent. No model-specific identity, human review, expert
endorsement, field evidence, or protocol endorsement is claimed. The public
sources, modern transformations, authoring path, failures, and corrections are
described in [the creation article](../../../docs/creating-laozi-and-epictetus-kdna.md).

The asset passes current-format Runtime validation, LoadPlan, compact Capsule,
Capsule verification, inspection, and clean-room install/load. All 8 authored
self-checks appear in both the full payload and compact Runtime Capsule under
the final release toolchain. Exploratory behavior runs predate the final
artifact digest and did not prove a benefit over wrong-KDNA or no-KDNA
controls.

## Load through the official toolchain

```bash
npm install -g @aikdna/kdna-cli@0.31.0
curl -LO https://github.com/aikdna/kdna-assets/releases/download/sage-reference-assets-v0.1.0/epictetus-control-and-character-0.1.0.kdna
curl -LO https://github.com/aikdna/kdna-assets/releases/download/sage-reference-assets-v0.1.0/epictetus-control-and-character-0.1.0.kdna.sha256
shasum -a 256 -c epictetus-control-and-character-0.1.0.kdna.sha256
kdna validate epictetus-control-and-character-0.1.0.kdna
kdna plan-load epictetus-control-and-character-0.1.0.kdna --json
kdna load epictetus-control-and-character-0.1.0.kdna --profile=compact --as=json
```

Agents consume the returned Runtime Capsule. They must not unzip or directly
decode the `.kdna` container.
