# Incident Triage

> Incident Triage: the judgment threshold that separates good from harmful decisions.

Judges incident triage trade-offs in software engineering — distinguishing productive from counter-productive decisions.

**生产事故处置的判断框架。核心问题：「现在应该先止血还是先找根因？」定义在压力下做出正确行动顺序的判断逻辑，而不是提供一份 SRE checklist。**

## Core judgment

- **止血永远优先于诊断——用户正在受损的每一分钟都比找根因更紧迫。**
  - *Applies when:* 服务完全不可用或核心功能中断; 有明确的回滚操作可用（最近的部署、配置变更）; 错误率或延迟超过正常水平的 2 倍以上; 用户正在大规模受影响（非个别用户投诉）
  - *Does not apply when:* 问题是数据静默错误（止血不等于恢复——需要先理解再行动，否则操作可能加重数据损坏）; 已经在止血后的「系统稳定」阶段，此时应该进入根因分析; 无法执行止血操作（没有回滚路径、问题不是部署相关）
  - *Failure risk:* 事故发生后工程师花 30 分钟看 log 分析原因，而此时服务已经全量宕机——理应花 2 分钟做一个回滚操作先恢复服务。

- **「最近的变更」是所有假设中第一个要验证的——80% 的生产事故在最近 24 小时内有直接触发的变更。**
  - *Applies when:* 事故是突发的（之前工作正常，突然出问题）; 错误模式是一致的（而不是随机的，随机错误通常不是单一变更导致的）
  - *Does not apply when:* 事故是缓慢恶化的（数周内逐渐增多），说明可能是资源耗尽或累积性问题，不是单一变更触发; 事故在上次变更后很久才出现（超过 48 小时），说明可能是延迟触发的问题
  - *Failure risk:* 工程师花 1 小时分析 log，最后发现是 30 分钟前上线的一个配置修改导致的——这个事实在事故开始时就应该是第一个检查的。

- **事故范围的「最小化描述」比「最大化描述」更有助于止血：找到受影响和不受影响的边界。**
  - *Applies when:* 初始描述是「系统不工作」或「一切都坏了」; 事故范围不清晰，不知道影响面有多大时
  - *Does not apply when:* 已经有明确的边界信息（「这个 API endpoint 100% 报 500」），可以直接进入假设验证
  - *Failure risk:* 团队全员投入「系统不工作」的假设，三路并行排查，最后发现只是一个特定地区的 CDN 节点出问题，其他地区完全正常——边界信息本来 5 分钟就能确认。

- **在事故中，「足够好的假设 + 立即行动」比「完美的假设 + 继续等待」更有价值。**
  - *Applies when:* 有一个「可能有效」的止血操作（回滚、熔断），且该操作是可逆的; 事故已经持续超过 5-10 分钟，信息收集进展缓慢
  - *Does not apply when:* 考虑的行动是不可逆的（删除数据、发送通知给用户、关闭账号）; 行动本身可能加重问题（如果怀疑是数据库超载，此时做 schema migration 会让问题更严重）
  - *Failure risk:* 事故持续 40 分钟，团队一直在「确认根因」而没有执行任何止血操作，但实际上最近一次部署是高度可疑的根因，回滚操作是安全可逆的，本来应该在第 5 分钟就执行。

- **事故沟通的目标是「减少受影响方的不确定性」，不是「等到有完整信息再沟通」。**
  - *Applies when:* 事故持续超过 5 分钟，有外部用户可见的影响; 有 stakeholder 依赖这个服务做决策
  - *Does not apply when:* 问题在 2 分钟内就解决了，不需要正式通知; 沟通本身会造成混乱（如：内部调试期间不需要对外部用户公告）
  - *Failure risk:* 事故持续 1 小时，状态页没有更新，用户以为是自己网络的问题，继续尝试并重复提交订单，导致重复扣款。

## Scope

- **Out of scope:** 事故后的完整根因分析（RCA）——那是事故处置结束后的独立过程; 预防性工作（如何避免这类事故再次发生）——那是 RCA 之后的输出; 具体的技术排查（log 分析、metrics 追踪）——这个资产给的是行动顺序判断，不是具体排查技术

## Common failure modes

## Worked scenarios

## Install and load

```bash
curl -L -o dev-incident-triage-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-incident-triage-v0.1.0/dev-incident-triage-v0.1.0.kdna

echo "c49fd5b460641cc2bbb2b3fcd6b86bae22f610657b86f1dcde77d79c86a5414b  dev-incident-triage-v0.1.0.kdna" | shasum -a 256 -c -

kdna load dev-incident-triage-v0.1.0.kdna --profile=compact --as=prompt
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:1a424ddb-671c-4415-93af-7b86090cca6e`
- **SHA256:** `c49fd5b460641cc2bbb2b3fcd6b86bae22f610657b86f1dcde77d79c86a5414b`
- **Built with:** kdna-studio-cli (kdna-assets-internal 10-gate pipeline)
- **Gates:** 10 PASS, 0 SKIP, 0 FAIL of 10
- **License:** CC-BY-4.0
