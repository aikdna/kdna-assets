# Laozi-Inspired Wuwei Judgment

`@aikdna/laozi-wuwei@0.1.1` is a public, experimental judgment asset. It is an
AI-authored modern interpretation inspired by the received *Daodejing*
tradition, not an authoritative or complete account of Laozi or Daoism.

## Highest question

When facing complexity, conflict, or excessive control, what is the minimum
responsible intervention—and when should one continue, soften, wait, or stop?

面对复杂、冲突或过度控制的局势，什么是最小但足够负责的干预；何时应继续、
减力、等待或停止？

## Judgment role

Use it to calibrate intervention intensity, useful space, flexibility,
counterforce, stopping, and accountable release of control. Do not use it as
emergency, medical, legal, safeguarding, incident-response, or command
authority.

Its safety floor is explicit: non-forcing is not inaction; softness is not
submission; stopping is not escape; useful space is not missing ownership;
completion without possession is not disappearance before handoff.

## Contents and access

- 6 axioms, 25 patterns, 8 scenarios, 8 cases, 6 reasoning chains
- 8 ontology distinctions, 5 boundaries, 6 risks, 6 misunderstandings
- 8 self-check cards and 3 evolution stages
- access: `public`
- license: `CC-BY-4.0`
- runtime payload: English; public metadata: English and Simplified Chinese

## Provenance and evidence

Creator: OpenAI Codex agent. No model-specific identity, human review, expert
endorsement, field evidence, or protocol endorsement is claimed. The public
sources, modern transformations, authoring path, failures, and corrections are
described in [the creation article](../../../docs/creating-laozi-and-epictetus-kdna.md).

Version 0.1.1 was rebuilt from the retained 0.1.0 source with the published
Studio CLI 0.10.2 and Studio Core 2.0.2. A machine-readable cross-profile
comparison confirms that the authored judgment semantics are identical; two
independent rebuilds produced the same bytes. The asset passes current-format
Runtime validation, LoadPlan, compact Capsule, Capsule verification,
inspection, and clean-room install/load. All 8 authored self-checks appear in
both the full payload and compact Runtime Capsule. Exploratory behavior runs
predate the final artifact digest and did not prove a benefit over wrong-KDNA
or no-KDNA controls.

## Load through the official toolchain

```bash
npm install -g @aikdna/kdna-cli@0.34.0
curl -LO https://github.com/aikdna/kdna-assets/releases/download/0.1.1/laozi-wuwei-0.1.1.kdna
curl -LO https://github.com/aikdna/kdna-assets/releases/download/0.1.1/laozi-wuwei-0.1.1.kdna.sha256
shasum -a 256 -c laozi-wuwei-0.1.1.kdna.sha256
kdna validate laozi-wuwei-0.1.1.kdna
kdna plan-load laozi-wuwei-0.1.1.kdna --json
kdna load laozi-wuwei-0.1.1.kdna --profile=compact --as=json
```

Agents consume the returned Runtime Capsule. They must not unzip or directly
decode the `.kdna` container.
