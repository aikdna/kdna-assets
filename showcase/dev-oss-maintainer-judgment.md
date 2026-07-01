# OSS Maintainer Judgment

> Oss Maintainer Judgment: the judgment threshold that separates good from harmful decisions.

Judgment asset for oss maintainer judgment — criteria, signals, and failure modes.

**OSS 维护者判断框架（E4+E5 合并）。覆盖两个核心场景：贡献质量评估（什么 PR 该合，什么不该合）和 Issue 分诊（什么问题该优先处理，什么可以关闭）。OSS 维护者面对资源有限、贡献者期望多样的特殊压力，判断框架与纯内部项目不同。**

## Core judgment

- **OSS 维护者的核心资源是「注意力」，不是「代码」——不合并一个 PR，通常是因为「未来维护这段代码的成本」高于「现在合并的价值」。**
  - *Applies when:* 评估一个 PR 是否应该合并; 作为贡献者理解 PR 被拒绝的原因
  - *Does not apply when:* 项目有专门的付费贡献者，维护责任有明确分工
  - *Failure risk:* 维护者因为「这段代码很好」就合并了所有高质量 PR，导致项目范围膨胀，维护成本超过了维护者的能力，最终维护者 burnout。

- **「我们欢迎贡献，但需要先讨论」是避免浪费贡献者时间的最重要实践——在 PR 被提交后才发现「我们不接受这类功能」，是对双方时间的极大浪费。**
  - *Applies when:* 维护者看到一个未经讨论的大型 PR 时; 制定项目的 CONTRIBUTING 指南时
  - *Does not apply when:* 小型 bug fix 或文档改进，不需要事先讨论
  - *Failure risk:* 贡献者花了 3 周实现了一个功能，提交 PR 后被告知「这不在我们的路线图上」，贡献者对项目产生负面印象，在社区传播负面评价。

- **Issue 分诊的核心是区分「可重现的 bug」「功能请求」「使用问题」「重复 issue」——每类需要完全不同的处理方式。**
  - *Applies when:* 处理 OSS 项目的 Issue 队列; 决定 Issue 的优先级
  - *Does not apply when:* 该判断不适用于以下情况尚未确定的早期探索阶段（proof-of-concept 阶段）
  - *Failure risk:* Issue 队列积累了几百个 Issue，其中 60% 是「使用问题」和「重复 Issue」，真正的 bug 报告被淹没，维护者在低价值 Issue 上消耗时间。

- **「友善地拒绝」是 OSS 维护者的核心技能——拒绝的方式决定了贡献者是否会再次贡献，以及社区对项目的印象。**
  - *Applies when:* 拒绝一个 PR 或关闭一个 Issue 时
  - *Does not apply when:* 明显的 spam 或恶意提交，不需要详细解释
  - *Failure risk:* 维护者因为「写太多解释太累了」而简单关闭了 PR，贡献者在社交媒体发帖抱怨「这个项目对贡献者不友好」，影响项目的社区形象。

- **维护者 burnout 是 OSS 最大的可持续性威胁——设置明确的边界（范围、响应时间、接受贡献的类型）是预防 burnout 的必要条件，不是傲慢。**
  - *Applies when:* 维护者感到被 Issue 和 PR 淹没时; 为项目制定贡献指南和范围说明时
  - *Does not apply when:* 项目有专职的维护团队和明确的资金支持
  - *Failure risk:* 维护者因为「不想让用户失望」而从不拒绝 Issue，三年后项目有 2000 个未处理 Issue，维护者 burnout，项目废弃，用户损失更大。

## Scope

- **Out of scope:** OSS 许可证选择——那是法律和业务决策; OSS 商业化策略——那是超出代码维护范围的问题; OSS 安全漏洞的处理流程——那需要专门的安全响应框架

## Common failure modes

## Worked scenarios

## Install and load

```bash
curl -L -o dev-oss-maintainer-judgment-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-oss-maintainer-judgment-v0.1.0/dev-oss-maintainer-judgment-v0.1.0.kdna

echo "69afd120e4e4385d7b5d650bc7c16f0e428efcabf627de8959a4f468af536075  dev-oss-maintainer-judgment-v0.1.0.kdna" | shasum -a 256 -c -

kdna load dev-oss-maintainer-judgment-v0.1.0.kdna --profile=compact --as=prompt
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:99d55aec-1d57-420f-8bde-b78606bffb51`
- **SHA256:** `69afd120e4e4385d7b5d650bc7c16f0e428efcabf627de8959a4f468af536075`
- **Built with:** kdna-studio-cli (kdna-assets-internal 10-gate pipeline)
- **Gates:** 10 PASS, 0 SKIP, 0 FAIL of 10
- **License:** CC-BY-4.0
