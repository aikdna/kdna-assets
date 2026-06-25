# title-attraction — 标题吸引力判断

> **A title that promises nothing is read by no one. A title that promises everything is read but not trusted.**

A KDNA asset that helps an AI Agent evaluate whether a
title carries the 4 signals of attractive titles:
**audience clarity**, **information gap**, **specific
benefit**, **credibility**, and **promise-content alignment**.

## When this asset applies

- The Agent is writing a 标题 / headline for an article,
  short video, 小红书 cover, or ad copy
- The Agent has 5+ title candidates and needs to pick
- The user asks "which title is stronger?" or "rewrite
  this title"

## When NOT to apply

- For SEO-driven titles where the constraint is keyword
  density (this asset judges reader pull, not search rank)
- For titles in a specific genre where the rules are
  different (academic papers, legal documents, technical
  RFCs)
- For series titles (the rules are different for a
  recurring column — the audience is already in)

## The 5 signals (the framework)

A strong title scores on all 5 signals. A title that scores
3-4 has a real chance. A title that scores 0-2 is
"wallpaper" — looks like a title, isn't.

1. **Audience clarity** — the reader can tell at a glance
   that this is for them, not for someone else
2. **Information gap** — there's a question the reader
   wants answered
3. **Specific benefit** — names a concrete outcome, not
   a vague aspiration
4. **Credibility** — sounds like someone who would know
5. **Promise-content alignment** — the title promises
   what the content delivers (no bait-and-switch)

## Failure modes the asset catches

| Failure mode | Symptom |
|---|---|
| Vague aspiration titles | "How to live better" — wallpaper |
| Clickbait with no delivery | Title promises, content doesn't deliver |
| Audience ambiguity | Title could be for anyone → is for no one |
| Specificity theater | Specific numbers with no substance |
| Over-promise | Title makes claim the content can't back |

## Provenance

- **Source:** internal namespace (redacted in public release)
- **Version:** 1.0.0 (released 2026-06-23, content-domain legacy)
- **Asset type:** `domain_judgment` (NOT part of the A-layer
  flagship pipeline; this is a legacy released-as-is asset
  from the pre-pipeline era)
- **License:** CC-BY-4.0

## How to install

```bash
curl -L -O https://github.com/aikdna/kdna-assets/releases/download/title-attraction-v1.0.0/title-attraction.kdna
curl -L -O https://github.com/aikdna/kdna-assets/releases/download/title-attraction-v1.0.0/title-attraction.sha256
shasum -a 256 -c title-attraction.sha256
kdna validate title-attraction.kdna
kdna plan-load title-attraction.kdna
kdna load title-attraction.kdna --profile=compact --as=prompt
```

## See also

- `viral-topic-selection` — sibling: judges the *topic*
  (not the title)
- `short-video-script` — sibling: judges the *opening
  3 seconds* of a short video

## Note

This is a **legacy content-domain asset**, not a flagship
A-layer asset. It was published under the pre-pipeline
strategy (June 2026) and is not part of the new 10-gate
release standard. It is preserved as-is. See
[internal strategy document (redacted in public release)]
for the audit status.
