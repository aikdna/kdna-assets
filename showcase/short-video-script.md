# short-video-script — 短视频前三秒判断

> **The first 3 seconds decide whether the audience stays. Everything after is the content's job.**

A KDNA asset that helps an AI Agent evaluate whether the
opening 3 seconds of a short video carry the
**information gap**, **scene conflict**, **speakability**,
and **audience retention** signals.

## When this asset applies

- The Agent is writing or reviewing the opening 3 seconds
  of a short video (抖音 / 快手 / 小红书 video / YouTube Shorts
  / TikTok)
- The Agent has a script and needs to know where the
  3-second cutoff is
- The user asks "will viewers stay past the first 3
  seconds?" or "is the hook strong enough?"

## When NOT to apply

- For long-form video (the 3-second rule doesn't apply —
  see `viral-topic-selection` for the topic judgment, and
  judge long-form on structure not hook)
- For audio-only content (no opening visual to judge)
- For content where the platform algorithm has decided
  the audience already (e.g. follow-up videos in a
  series)

## The 4 signals (the framework)

A strong opening 3 seconds scores on all 4 signals. A
weak opening may score 1-2.

1. **Information gap** — within 1 second, the audience
   wants to know what happens next
2. **Scene conflict** — there's a visible tension (a
   person, a question, a contrast, an unexpected detail)
3. **Speakability** — the opening is spoken naturally,
   not read-from-script
4. **Audience retention** — the opening works for the
   *target* audience, not for everyone (broad = shallow
   for short-form)

## Failure modes the asset catches

| Failure mode | Symptom |
|---|---|
| "Hi I'm X and today..." openings | Wastes 1.5-2 seconds on intro |
| Hook without payoff | Opening is interesting, content is not |
| Speaking-style mismatch | Reads from script, not speaking |
| Generic hook | Could be for anyone, is for no one |
| Visual mismatch | Opening says one thing, video shows another |

## Provenance

- **Source:** internal namespace (redacted in public release)
- **Version:** 1.0.0 (released 2026-06-23, content-domain legacy)
- **Asset type:** `domain_judgment` (NOT part of the A-layer
  flagship pipeline; this is a legacy released-as-is asset
  from the pre-pipeline era)
- **License:** CC-BY-4.0

## How to install

```bash
curl -L -O https://github.com/aikdna/kdna-assets/releases/download/short-video-script-v1.0.0/short-video-script.kdna
curl -L -O https://github.com/aikdna/kdna-assets/releases/download/short-video-script-v1.0.0/short-video-script.sha256
shasum -a 256 -c short-video-script.sha256
kdna validate short-video-script.kdna
kdna plan-load short-video-script.kdna
kdna load short-video-script.kdna --profile=compact --as=prompt
```

## See also

- `viral-topic-selection` — sibling: judges the *topic*
- `title-attraction` — sibling: judges the *title*

## Note

This is a **legacy content-domain asset**, not a flagship
A-layer asset. It was published under the pre-pipeline
strategy (June 2026) and is not part of the new 10-gate
release standard. It is preserved as-is. See
[internal strategy document (redacted in public release)]
for the audit status.
