# viral-topic-selection — 爆款选题判断

> **A topic is only viral when it carries productive tension, not when it carries controversy.**

A KDNA asset that helps an AI Agent evaluate whether a
content topic has viral potential — checking **tension**
(not shock), **curiosity gap** (not just clickbait),
**emotional resonance** (not pandering), and **social
currency** (not status-seeking).

## When this asset applies

- The Agent is about to pick the next topic to write about
  from a brainstorm list
- The Agent is reviewing a content calendar and pruning
  topics that won't travel
- The user asks "will this go viral?" or "is this a
  strong enough topic?"
- The Agent is about to write a 选题 / topic for a 小红书
  post / 公众号 article / short video

## When NOT to apply

- For long-form evergreen content (Wikipedia-style
  comprehensive guides do not need viral drivers)
- For B2B technical content where the audience is
  pre-qualified and the value is information transfer
  rather than sharing
- For purely transactional content (product listings,
  changelogs, legal pages)

## Failure modes the asset catches

| Failure mode | Symptom |
|---|---|
| Treats "controversy" as a synonym for "viral" | Generates outrage-bait topics that damage trust |
| Generates "safe" consensus topics | Produces content with no tension, no sharing |
| Single-driver optimization | Over-emphasizes one driver (e.g. emotion) at expense of others |
| Topic vs angle confusion | Picks a strong topic, weak angle (or vice versa) |

## The 4 drivers (the framework)

A viral topic must clear at least 2 of the 4 drivers.
A topic clearing 3+ drivers has high viral potential; 4
drivers is canonical.

1. **Conflict** — productive disagreement. Some reasonable
   people would say X, others Y.
2. **Curiosity** — a genuine question the audience wants
   answered.
3. **Emotional value** — a feeling the audience wants to
   re-experience (inspiration, surprise, recognition).
4. **Social currency** — sharing signals something about
   the sharer (taste, intelligence, insider status).

## Provenance

- **Source:** internal namespace (redacted in public release)
- **Version:** 1.1.0 (released 2026-06-23, content-domain legacy)
- **Asset type:** `domain_judgment` (NOT part of the A-layer
  flagship pipeline; this is a legacy released-as-is asset
  from the pre-pipeline era)
- **License:** CC-BY-4.0

## How to install

```bash
curl -L -O https://github.com/aikdna/kdna-assets/releases/download/viral-topic-selection-v1.1.0/viral-topic-selection.kdna
curl -L -O https://github.com/aikdna/kdna-assets/releases/download/viral-topic-selection-v1.1.0/viral-topic-selection.sha256
shasum -a 256 -c viral-topic-selection.sha256
kdna validate viral-topic-selection.kdna
kdna plan-load viral-topic-selection.kdna
kdna load viral-topic-selection.kdna --profile=compact --as=prompt
```

## See also

- `title-attraction` — sibling: judges whether the *title*
  (not the topic) carries the viral signal
- `short-video-script` — sibling: judges whether the *opening
  3 seconds* of a short video carry the signal

## Note

This is a **legacy content-domain asset**, not a flagship
A-layer asset. It was published under the pre-pipeline
strategy (June 2026) and is not part of the new 10-gate
release standard. It is preserved as-is. See
[internal strategy document (redacted in public release)]
for the audit status.
