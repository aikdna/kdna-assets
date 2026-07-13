# Breaking Change Detection

> **Archived demonstration.** This page documents a superseded pre-CBOR AIKDNA example.
> The file is preserved for historical integrity and is intentionally rejected by the current runtime.
> This page provides archive metadata only; do not load this file with the current runtime.

> Breaking Change Detection: the judgment threshold that separates good from harmful decisions.

Judges breaking change detection trade-offs in software engineering — distinguishing productive from counter-productive decisions.

**Breaking change 判断框架。核心问题：「这个改动会让现有调用方在不修改自身代码的情况下出现错误吗？」——区分真正的 breaking change 和兼容的演进，避免错判（把兼容改动当 breaking 而过度保守）或漏判（把 breaking 改动当兼容而破坏调用方）。**

## Core judgment

- **Breaking change 的定义是「现有调用方，在不修改自身代码的情况下，会出现运行时错误或行为改变」。**
  - *Applies when:* 变更涉及公开 API、函数签名、数据格式、配置格式; 有外部调用方（其他服务、SDK 用户、前端、第三方集成）
  - *Does not apply when:* 改动的接口只有当前代码库内部使用，且所有调用点都在同一次 PR 里同步更新了
  - *Failure risk:* agent 把「重命名了一个内部变量」标注为 breaking change，同时漏掉了「把 API response 中的 `user_id` 改名为 `userId`」这个对所有 API 消费者都是 breaking 的变更。

- **「向后兼容」是调用方不需要修改任何代码就能继续工作——不是「改动看起来向后兼容」。**
  - *Applies when:* 新增了必填参数或字段; 改变了任何现有字段的语义、类型、或取值范围; 改变了错误码、错误格式、或错误触发条件
  - *Does not apply when:* 只新增了带合理默认值的可选字段或可选方法
  - *Failure risk:* agent 看到「只是新增了一个字段」就认为向后兼容，但该字段是必填的，所有现有调用方的请求会因为缺少该字段而被拒绝。

- **Breaking change 的影响范围取决于「谁是调用方」——内部 API 和公共 API 的 breaking change 代价完全不同。**
  - *Applies when:* 需要决定如何处理一个已识别的 breaking change
  - *Does not apply when:* 该判断不适用于以下情况尚未确定的早期探索阶段（proof-of-concept 阶段）
  - *Failure risk:* agent 把内部 monorepo 里两个服务之间的 API 重构标注为「breaking change，不能这样改」，但实际上可以在同一个 PR 里同步修改所有调用点，完全可接受。

- **「行为变更」是比「接口变更」更难发现的 breaking change——调用方的代码不报错，但行为不同了。**
  - *Applies when:* 函数在边界条件（null、空集合、错误状态）下的行为改变; 函数返回值的语义改变（字段含义变化、数据格式变化）; 异步行为改变（之前串行现在并行，之前同步现在异步）
  - *Does not apply when:* 行为变更是 bug fix（之前的行为是错的），且有充分的文档说明
  - *Failure risk:* agent 看到函数签名没有改变就判断「不是 breaking change」，但实际上函数的返回格式从 `{data: [...]}` 改成了 `[...]`，所有调用方都需要更新。

## Scope

- **Out of scope:** 决定是否应该发布一个 breaking change（那是产品/版本策略决策）; 制定弃用计划的具体时间线（那是项目管理决策）

## Common failure modes

## Worked scenarios

## Archived download and checksum

```bash
curl -L -o dev-breaking-change-detection-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-breaking-change-detection-v0.1.0/dev-breaking-change-detection-v0.1.0.kdna

echo "9801e2a28418bb24fc073bcbddbab1994e5d7821a1eb532d89873feda697c151  dev-breaking-change-detection-v0.1.0.kdna" | shasum -a 256 -c -

# Current runtime intentionally rejects this archived pre-CBOR artifact.
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:7ad5a6d4-d5aa-4d50-82a5-47705386679e`
- **SHA256:** `9801e2a28418bb24fc073bcbddbab1994e5d7821a1eb532d89873feda697c151`
- **Built with:** KDNA Studio CLI
- **License:** CC-BY-4.0
