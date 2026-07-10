# Review Severity Judgment

> Review Severity Judgment: the judgment threshold that separates good from harmful decisions.

Judges review severity judgment trade-offs in software engineering — distinguishing productive from counter-productive decisions.

**代码审查意见的严重性裁定框架。定义「这条 review 意见应该 block 合并还是作为建议（nit）留下」的判断逻辑——不是从语气或感觉，而是从「如果不改，会发生什么」推导优先级。**

## Core judgment

- **严重性来自「不改会发生什么」，不来自「写法多难看」或「和我的风格不同」。**
  - *Applies when:* 任何需要标注 review 意见的场景; 需要决定是否 block 一个 PR 合并时; 需要给出多条意见并按优先级排序时
  - *Does not apply when:* 团队已经建立了明确的 review 规范，且该规范将风格一致性定义为 block 条件（此时遵守团队规范优先）
  - *Failure risk:* agent 把风格偏好标注为 block，导致 PR 作者花大量时间在不影响功能的修改上，真正的风险点反而被掩盖。

- **Block 意见只有一类：「如果不改，这段代码在合理预期的使用场景下会产生错误的行为。」**
  - *Applies when:* 决定是否用 'must fix' / 'blocking' / 'required' 等词标注意见时; 给出建议时需要明确区分「我认为应该改」和「必须改才能合并」时
  - *Does not apply when:* 存在团队约定的「代码风格一致性也是 block 条件」的规范
  - *Failure risk:* agent 把 5 条意见全标为 block，其中 3 条是风格问题，PR 作者无法分辨优先级，真正的安全漏洞被淹没在噪音中。

- **Nit（小问题/建议）应该明确标注为 nit，不要让作者猜测这是建议还是要求。**
  - *Applies when:* 写任何 review 意见时; 批量生成 review 意见需要输出时
  - *Does not apply when:* 该判断不适用于以下情况尚未确定的早期探索阶段（proof-of-concept 阶段）
  - *Failure risk:* agent 写了 10 条意见，没有任何标注，PR 作者不知道哪些是必须改的，要么全改（浪费时间），要么全不改（遗漏真正问题）。

- **一条意见的严重性随「触发该问题的场景频率」和「该场景下的伤害程度」共同决定。**
  - *Applies when:* 需要对多条 block 意见排优先级时; 需要决定「这个问题必须在这个 PR 里修复」还是「可以留给下个 sprint」时
  - *Does not apply when:* 安全合规场景中，即使触发频率极低的安全漏洞也必须修复（合规要求覆盖了频率判断）
  - *Failure risk:* agent 把「理论上存在但实际上几乎无法触发」的问题标注为最高优先级，让开发者把时间花在理论修复上，忽略了高频的数据准确性问题。

- **当一个意见的核心是「我会用不同的方式实现」，它几乎不是 block。**
  - *Applies when:* 想到了一个「更好」的实现方式但当前实现也是正确的时候; 觉得代码可以更优雅/更简洁但不能举出具体的功能风险时
  - *Does not apply when:* 可以举出具体场景证明当前实现会产生错误或性能问题
  - *Failure risk:* agent 把「我会用 map 而不是 for loop」写成 block，但两种方式在这个场景下性能相同、逻辑相同，只是语法偏好。

## Scope

- **Out of scope:** 判断代码功能是否正确（那是功能 review，不是严重性裁定）; 评估 PR 是否应该被合并（严重性是合并决策的输入，不等于合并决策本身）; 替代团队已经明确建立的 review 规范（已有明确规范时，遵守规范优先）

## Common failure modes

## Worked scenarios

## Install and load

```bash
curl -L -o dev-review-severity-judgment-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-review-severity-judgment-v0.1.0/dev-review-severity-judgment-v0.1.0.kdna

echo "00e19d2f1565be87cbc2cc67c8d654105308e6edad41b8fc3e280c7007fa1051  dev-review-severity-judgment-v0.1.0.kdna" | shasum -a 256 -c -

kdna load dev-review-severity-judgment-v0.1.0.kdna --profile=compact --as=prompt
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:74d89fec-3349-4e10-b9a4-ddb2f0808465`
- **SHA256:** `00e19d2f1565be87cbc2cc67c8d654105308e6edad41b8fc3e280c7007fa1051`
- **Built with:** KDNA Studio CLI
- **License:** CC-BY-4.0
