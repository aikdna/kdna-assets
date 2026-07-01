# Fix Vs Workaround

> Fix Vs Workaround: the judgment threshold that separates good from harmful decisions.

Judges fix vs workaround trade-offs in software engineering — distinguishing productive from counter-productive decisions.

**Fix vs Workaround 裁定框架。核心问题：「在当前时间压力和风险条件下，该消除根因还是先绕过症状？」——不是二选一的原则问题，而是在具体场景下做出最优决策的判断框架。**

## Core judgment

- **Workaround 是时间借贷，不是解决方案——必须在选择时就定好归还（fix）的时间，否则借贷会变成永久债务。**
  - *Applies when:* 任何选择了 workaround 而不是 fix 的决策时刻
  - *Does not apply when:* 问题根本不需要 fix（workaround 就是最终解决方案，例如第三方 bug 的临时绕过，第三方已确认会在下个版本修复）
  - *Failure risk:* 团队选了 workaround 但没有创建 ticket，6 个月后没有人记得这里有 workaround，代码继续维护时触发了 workaround 掩盖的根因，事故重演。

- **如果 workaround 本身有副作用（增加边界情况、掩盖关联问题），它的代价可能超过直接等 fix 的代价。**
  - *Applies when:* 考虑一个 workaround 方案时
  - *Does not apply when:* workaround 是完全隔离的（如：在配置文件里临时注释掉一个功能），没有代码层面的副作用
  - *Failure risk:* 团队加了一个 workaround 修复了显示问题，但 workaround 绕过了数据校验逻辑，导致了静默的数据完整性问题，比原来的显示 bug 更严重。

- **问题是否会「自我加剧」是决定 fix 优先级的关键——会持续恶化的问题不能只靠 workaround。**
  - *Applies when:* 问题的严重性随时间或使用量增长; 问题需要人工周期性干预（如每周重启）来维持系统运行
  - *Does not apply when:* 问题是固定触发条件的离散错误（每次在 X 条件下触发，不会自我扩大）
  - *Failure risk:* 团队用「每天凌晨重启服务」作为内存泄漏的 workaround，6 个月后随着用户增长，需要每 4 小时重启，最终服务在白天高峰期崩溃，才被迫做 fix。

- **在生产故障中，workaround 先止血是正确的；在正常开发迭代中，选 workaround 通常是在拖延。**
  - *Applies when:* 评估是否有真实的时间压力需要 workaround
  - *Does not apply when:* 生产故障场景下，止血优先的判断不需要额外理由
  - *Failure risk:* 开发者在正常迭代中遇到复杂 bug，选择了「先 workaround，下个 sprint 再 fix」，但实际上并没有真正的时间压力——只是 fix 更难。下个 sprint 的 workaround ticket 被其他需求挤掉，循环往复。

- **Fix 的风险本身是选 workaround 的合法理由——高风险的 fix 在时间充裕时也应该谨慎。**
  - *Applies when:* fix 需要改动测试覆盖率低的核心逻辑; fix 的改动量和影响面远大于 bug 本身的影响
  - *Does not apply when:* fix 风险评估是主观感受而非客观分析（「感觉很复杂」不是合法理由）
  - *Failure risk:* 开发者说「fix 风险高所以先 workaround」，但没有具体说明高在哪里，也没有制定降低风险的计划——这是用「风险」来合理化拖延。

## Scope

- **Out of scope:** 制定 fix 的具体技术方案（那是后续的技术实现任务）; 评估 workaround 的具体实现是否正确（那是代码审查任务）

## Common failure modes

## Worked scenarios

## Install and load

```bash
curl -L -o dev-fix-vs-workaround-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-fix-vs-workaround-v0.1.0/dev-fix-vs-workaround-v0.1.0.kdna

echo "2c1a1502e69c7b061e8073f00805bdb37ed29f0d6ccf216e4091ad70deaeb260  dev-fix-vs-workaround-v0.1.0.kdna" | shasum -a 256 -c -

kdna load dev-fix-vs-workaround-v0.1.0.kdna --profile=compact --as=prompt
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:b74582cd-164a-48e1-98ec-4f9a5aaaacfd`
- **SHA256:** `2c1a1502e69c7b061e8073f00805bdb37ed29f0d6ccf216e4091ad70deaeb260`
- **Built with:** kdna-studio-cli (kdna-assets-internal 10-gate pipeline)
- **Gates:** 10 PASS, 0 SKIP, 0 FAIL of 10
- **License:** CC-BY-4.0
