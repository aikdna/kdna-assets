# Deploy Readiness

> **Archived demonstration.** This page documents a superseded pre-CBOR AIKDNA example.
> The file is preserved for historical integrity and is intentionally rejected by the current runtime.
> This page provides archive metadata only; do not load this file with the current runtime.

> Deploy Readiness: the judgment threshold that separates good from harmful decisions.

Judges deploy readiness trade-offs in software engineering — distinguishing productive from counter-productive decisions.

**部署就绪性判断框架。核心问题：「这段代码，现在可以 deploy 到生产了吗？」——不是「代码质量够好吗」（那是 code review 的工作），而是「在当前的时机、当前的环境下，部署这个变更的风险是可接受的吗」。**

## Core judgment

- **代码质量合格 ≠ 部署就绪——部署就绪还需要时机、监控、回滚能力三个条件。**
  - *Applies when:* 决定是否在当前时间点执行生产部署; 评估 PR 合并后是否立即触发部署
  - *Does not apply when:* 部署到测试/staging 环境（风险不同）; 内部工具或对外影响极小的服务
  - *Failure risk:* 代码 review 通过后立即部署，但部署在高峰期，出现问题时 oncall 工程师正在会议中，响应延迟了 30 分钟。

- **「这次部署包含什么」决定了「应该如何部署」——大变更用分级发布，小变更可以全量。**
  - *Applies when:* 变更涉及核心业务流程（支付、认证、用户数据）; 变更规模大（多个核心模块同时改动）; 变更行为不可逆（数据格式迁移）
  - *Does not apply when:* 变更是完全隔离的小改动（一个新的工具函数、一行文案修改）
  - *Failure risk:* 认证模块的重大重构直接全量部署，出问题后 100% 的用户无法登录，而分级发布可以把影响控制在 5% 的流量内。

- **没有回滚方案的部署，出问题的代价是不可控的。**
  - *Applies when:* 变更涉及数据库 schema 变更; 变更会触发外部副作用（发送通知、调用外部 API 写入数据）; 变更涉及数据格式变化
  - *Does not apply when:* 变更是纯代码改动，无持久化副作用，代码回滚完全恢复
  - *Failure risk:* 部署了一个包含不兼容 schema 变更的版本，出现问题需要回滚，但旧代码无法读取新 schema 格式，陷入无法回滚的困境。

- **高峰期、周五下午、发布冻结期是部署的高风险时间窗口——不是「不能部署」而是「需要更高的确信度才部署」。**
  - *Applies when:* 即将在高峰期、周五、或冻结期内部署; 团队有明确的部署时间窗口约定
  - *Does not apply when:* 这是紧急 hotfix，不能等到合适的时间窗口
  - *Failure risk:* 团队在周五下午 5 点部署了一个新功能，下班后出现了问题，周末无人响应，持续影响用户整个周末。

- **「这次部署需要哪些监控」必须在部署前就配置好，而不是出了问题再想。**
  - *Applies when:* 新功能首次上线; 核心业务流程的改动; 影响性能的改动（新的数据库查询、新的外部 API 调用）
  - *Does not apply when:* 改动只影响已有的、已经被充分监控的代码路径
  - *Failure risk:* 新的支付流程上线后，没有配置支付成功率监控，出现了一个导致 10% 支付失败的 bug，依靠用户投诉在 2 小时后才发现。

## Scope

- **Out of scope:** 评估代码质量（那是 code review 的工作）; 制定长期的部署策略或 CI/CD pipeline 架构; 决定是否应该开发这个功能（那是产品决策）

## Common failure modes

## Worked scenarios

## Archived download and checksum

```bash
curl -L -o dev-deploy-readiness-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-deploy-readiness-v0.1.0/dev-deploy-readiness-v0.1.0.kdna

echo "cd905dd99177a14996926a3353b407cf75e977120ea28569b041b8dbedd1207e  dev-deploy-readiness-v0.1.0.kdna" | shasum -a 256 -c -

# Current runtime intentionally rejects this archived pre-CBOR artifact.
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:6e012aa5-7299-46e7-ac00-4d8e0be324f7`
- **SHA256:** `cd905dd99177a14996926a3353b407cf75e977120ea28569b041b8dbedd1207e`
- **Built with:** KDNA Studio CLI
- **License:** CC-BY-4.0
