# Tech Debt Signal

> **Archived demonstration.** This page documents a superseded pre-CBOR AIKDNA example.
> The file is preserved for historical integrity and is intentionally rejected by the current runtime.
> This page provides archive metadata only; do not load this file with the current runtime.

> Tech Debt Signal: the judgment threshold that separates good from harmful decisions.

Judges tech debt signal trade-offs in software engineering — distinguishing productive from counter-productive decisions.

**技术债信号识别框架。核心问题：「这是真的技术债，还是只是不够整洁？」——并非所有不完美的代码都是技术债；技术债特指「当前设计决策正在拖慢未来工作速度」的情况。**

## Core judgment

- **技术债的本质是「利息」：你现在每次在这段代码上工作，都要额外支付时间成本——这个额外成本是技术债。**
  - *Applies when:* 判断一段代码问题是否应该被定义为技术债; 评估技术债的优先级
  - *Does not apply when:* 代码存在安全漏洞或功能性 bug——那不是技术债，是必须修的缺陷
  - *Failure risk:* 团队把「代码不够整洁」都定义为技术债，导致技术债列表有几百项，全部降级为低优先级，实际上没有任何一项被真正解决。

- **技术债有三个强信号：频繁在同一个地方修 bug、新功能总是比预估慢很多、没有人愿意碰某个模块。**
  - *Applies when:* 汇报给管理层时需要量化技术债的影响; 在做重构优先级排序时需要证据
  - *Does not apply when:* 代码是新写的，还没有足够的历史数据来观察这些信号
  - *Failure risk:* 团队说「这里有技术债」但没有具体的利息数据，管理层认为这是工程师的审美偏好，不批准资源。

- **技术债分两类：「故意的技术债」（为了速度有意做的简化）和「意外的技术债」（当时不知道更好的方案）——管理方式不同。**
  - *Applies when:* 记录技术债时，应该注明债务类型; 评估技术债的修复复杂度时
  - *Does not apply when:* 该判断不适用于以下情况尚未确定的早期探索阶段（proof-of-concept 阶段）
  - *Failure risk:* 把所有技术债都当作「以后规划一下就能修」的故意债务，忽视了意外债务可能影响范围不明确、修复成本比预估高很多。

- **技术债是否紧急，由「增长曲线」决定：线性增长的债务可以等，指数增长的债务不能等。**
  - *Applies when:* 决定是否需要中断现有工作来优先处理技术债; 在技术债列表中做优先级排序
  - *Does not apply when:* 公司整体业务量短期内不会增长，技术债的利率不会因为规模增长而变化
  - *Failure risk:* 核心数据模型设计有问题但被标记为「以后再说」，随着业务增长，每个新功能都需要在错误的数据模型上做绕路，最终重构成本比早期修复高 10 倍。

- **向非工程师汇报技术债时，用业务影响（速度、风险、成本）而不是技术问题（架构、耦合、测试覆盖率）。**
  - *Applies when:* 向非工程师汇报技术债; 申请技术债处理的资源和时间
  - *Does not apply when:* 在技术委员会或工程内部会议中，技术细节是必要的
  - *Failure risk:* 工程师说「我们需要时间解决耦合问题和提高测试覆盖率」，产品经理认为这是工程师的偏好而不是业务需求，拒绝分配资源。

## Scope

- **Out of scope:** 具体的重构策略——那是 code:refactoring_timing 的范围; 如何选择技术栈和架构——那是设计决策，不是技术债管理

## Common failure modes

## Worked scenarios

## Archived download and checksum

```bash
curl -L -o dev-tech-debt-signal-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-tech-debt-signal-v0.1.0/dev-tech-debt-signal-v0.1.0.kdna

echo "55d140fc35f8526687b34227ef150cfbe67513a260d9fb9550ed522e289c783c  dev-tech-debt-signal-v0.1.0.kdna" | shasum -a 256 -c -

# Current runtime intentionally rejects this archived pre-CBOR artifact.
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:a3208802-c29b-4a3d-b5cb-b5ef8d09bedb`
- **SHA256:** `55d140fc35f8526687b34227ef150cfbe67513a260d9fb9550ed522e289c783c`
- **Built with:** KDNA Studio CLI
- **License:** CC-BY-4.0
