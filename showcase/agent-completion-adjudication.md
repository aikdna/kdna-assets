# agent:completion_adjudication v0.1.0

> **Agent 说做完了，不代表真的完成了：完成必须含可观察证据。**

A loadable judgment asset that teaches an AI Agent that "I'm done" is not completion. Forces a four-cell ruling — DONE CLAIM, OBSERVABLE PROOF, USER INTENT MATCH, UNRESOLVED RISK — before any completion claim can be made.

**SHA256:** `76a97828955490a72a5ac83bd74205c5a30ffc87468878158d0517b1669a3696`
**Release tag:** `agent-completion-adjudication-v0.1.0`
**Download:** <https://github.com/aikdna/kdna-assets/releases/tag/agent-completion-adjudication-v0.1.0>

---

## What it judges

A four-cell completion ruling that every "done" claim must surface before the Agent can declare completion:

| Cell | Question |
|------|----------|
| `DONE CLAIM` | What specifically is being claimed as done? (Not "I fixed the bug" but the specific change and the specific test.) |
| `OBSERVABLE PROOF` | What specific command, file, log line, or URL can a third party check? (Not the Agent's confidence.) |
| `USER INTENT MATCH` | Does the proof address the user's actual intent, or only the literal words they used? |
| `UNRESOLVED RISK` | What could still go wrong despite the proof? A claim with non-empty risk is "done pending X", not "done". |

The asset ships 5 axioms, 5 failure-modes, and 5 worked cases in the runtime payload. The source tree in `kdna-x/A-agent-meta/completion-adjudication/` additionally defines 6 misjudgment patterns, 6 self-check rules, 18 banned phrases, and 5 principle-to-action reasoning chains; the kdna-studio build does not currently surface all of those in the compact profile, see [the team's known gap list](#source-vs-payload-gap) for the open follow-up.

---

## Before

The Agent declares completion on a hope-based claim:

> 已完成。财务报表已经导出，邮件已经发送。

Three problems: the `DONE CLAIM` is vague ("exported"), the `OBSERVABLE PROOF` is empty (no path, no message-id), the `UNRESOLVED RISK` is empty (what if the email bounced? what if the CSV is malformed?). The user cannot audit the claim in 30 seconds.

## After

The same Agent, with the asset loaded:

> **已完成（待确认两点）**：
>
> **DONE CLAIM**: 2026 年 8 月份的财务报表已导出为 `/shared-drive/exports/customers-2026-06-24.csv`，并通过 `finance@company.com` 邮件发送给 12 名财务团队成员。
>
> **OBSERVABLE PROOF**:
> - Excel 文件存在，大小 248 KB
> - 文件已通过 LibreOffice 打开验证，表头列正确
> - 邮件已通过 `mailq` 验证，message-id 在 outbound queue 中
> - 收件人列表与 `team/finance.yaml` 中的 12 人匹配
>
> **USER INTENT MATCH**: 我把你的请求理解为 "8 月财务报表导出成 Excel，财务团队能直接看到数据"。表头和数据范围已匹配你的历史 Excel 模板。
>
> **UNRESOLVED RISK**:
> 1. 收件人是否都成功接收 — 我只验证了 outbound queue，没有等待 delivery confirmation
> 2. Excel 在不同软件中可能显示异常 — 验证用的是 LibreOffice
> 3. 历史对比数据用的是 2026-07 单月 — 如果你通常用季度对比，缺少 Q2 季度列

---

## Install (3 minutes)

```bash
# 1. Install kdna-cli
npm install -g @aikdna/kdna-cli

# 2. Download
curl -L -o agent-completion-adjudication.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/agent-completion-adjudication-v0.1.0/agent-completion-adjudication.kdna
curl -L -o agent-completion-adjudication.kdna.sha256 \
  https://github.com/aikdna/kdna-assets/releases/download/agent-completion-adjudication-v0.1.0/agent-completion-adjudication.kdna.sha256

# 3. Verify + validate + load
shasum -a 256 -c agent-completion-adjudication.kdna.sha256
kdna validate ./agent-completion-adjudication.kdna
kdna plan-load ./agent-completion-adjudication.kdna
kdna load ./agent-completion-adjudication.kdna --profile=compact --as=prompt
```

Requires `kdna-cli ≥ 0.27`. No external dependencies. Works with any AI agent that loads KDNA assets.

---

## When to load

- The Agent is about to say "I'm done", "finished", "all set", "completed", or any equivalent
- The user asks "is it done?" and the Agent is about to answer yes or no
- A long-running task has just finished and the next user-visible message will be the completion claim
- The user is reviewing a PR or handoff that the Agent prepared
- The user is debugging a situation where "the Agent said it was done but the user is not sure"

## When NOT to load

- The user has explicitly overridden: "I don't need proof, just tell me when you've moved on"
- The task is exploratory and the user understands the output is a draft
- The Agent is providing a status update, not a completion claim
- The task is a single-step, single-environment action with deterministic verification

---

## License

CC-BY-4.0.

## Source vs payload gap

The source tree in `kdna-x/A-agent-meta/completion-adjudication/KDNA_*.json`
defines a richer judgment content than the runtime `.kdna` payload
currently carries. The 6 misjudgment patterns, 6 self-check rules,
18 banned phrases, and 5 principle-to-action reasoning chains in
the source tree are not in the compact-profile payload that
`kdna load` renders. The compact payload has 5 axioms, 5
failure-modes (in `reasoning.failure_modes`), and 5 cases. The
full profile may surface more; the team's follow-up is to either
(a) update `KDNA_*.json` to use field names that kdna-studio
surfaces in compact, or (b) extend the kdna-studio migrate path
to map the source fields into the payload.
