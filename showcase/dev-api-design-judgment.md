# API Design Judgment

> **Archived demonstration.** This page documents a superseded pre-CBOR AIKDNA example.
> The file is preserved for historical integrity and is intentionally rejected by the current runtime.
> Re-export legitimate source through current Studio/CLI tooling before attempting to load it.

> Api Design Judgment: the judgment threshold that separates good from harmful decisions.

Judges api design judgment trade-offs in software engineering — distinguishing productive from counter-productive decisions.

**API 设计好坏的判断框架。核心问题：这个 API 设计会让调用方痛苦吗？好的 API 让正确的使用比错误的使用更容易，让调用方不需要理解实现就能正确使用。**

## Core judgment

- **「调用方不需要理解实现就能正确使用」是 API 设计的唯一标准。**
  - *Applies when:* 设计任何供他人调用的函数或类方法; 设计 HTTP REST API 端点; 设计 SDK 或库的公开接口
  - *Does not apply when:* 纯内部函数，只有一个调用点，不会被多人使用
  - *Failure risk:* 调用方必须看源码才能知道参数顺序或必须了解内部状态机才能判断何时可以调用某个方法。

- **API 名字应该让调用方在看到它的一秒内猜对它的行为——如果需要查文档才知道参数顺序，命名有问题。**
  - *Applies when:* 函数有 2 个以上同类型参数（如多个 string、多个 number）; 函数参数顺序不直觉（不是「从哪来」「到哪去」这种自然顺序）; 函数名是动词但没有明确说明作用对象
  - *Does not apply when:* 函数只有一个参数，没有歧义; 参数顺序有强烈的领域约定（如数学函数 `pow(base, exponent)`）
  - *Failure risk:* 调用方把 `sendEmail(to, from, subject)` 的 to 和 from 传反，编译通过，发出的邮件发件人和收件人颠倒，只在测试时发现。

- **必填参数用位置参数，可选参数用配置对象——不要让调用方用 null 占位。**
  - *Applies when:* 函数有 3 个以上参数，其中部分是可选的; 可选参数之后还有其他必填参数; 调用方代码中出现了传 null/undefined 的参数
  - *Does not apply when:* 所有参数都是必填且数量 ≤ 3，语义清晰; 性能极敏感的热路径，对象分配有代价
  - *Failure risk:* 新增一个可选参数 `timeout` 放在第 4 位，所有现有调用方要改，或者调用方传了 4 个 null 才能设置第 5 个参数。

- **API 的错误信息应该告诉调用方「你做错了什么」和「你应该怎么做」——而不是「内部出了什么错」。**
  - *Applies when:* API 会因为调用方传参错误而失败; API 有前置条件（调用顺序、状态要求）; API 集成了外部服务，可能因外部原因失败
  - *Does not apply when:* 内部日志——内部日志可以包含实现细节，这是给维护者的
  - *Failure risk:* 调用方收到 `Error: validation failed` 不知道哪个字段、什么规则，需要阅读源码或猜测才能修复。

- **设计 API 时想象最懒的调用方——他会误用吗？如果会，让正确用法成为最简单的用法。**
  - *Applies when:* API 有使用前置条件（必须先初始化、必须成对调用 open/close）; API 有容易被忽略的副作用; API 的危险操作（删除、覆盖）和安全操作有相似的调用方式
  - *Does not apply when:* API 面向的是熟悉领域的专家用户，有足够的领域背景
  - *Failure risk:* `db.query(sql, callback)` 既是异步的又有同步版本，懒调用方忘记检查 callback 模式，结果错误被静默忽略。

## Scope

- **Out of scope:** API 的性能优化（好的 API 设计和高性能有时存在张力，这需要在具体场景中权衡）; API 的版本化策略（那是 breaking change 资产的范围）

## Common failure modes

## Worked scenarios

## Install and load

```bash
curl -L -o dev-api-design-judgment-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-api-design-judgment-v0.1.0/dev-api-design-judgment-v0.1.0.kdna

echo "c25dc1a786c068cd49bf1d9c50f384ee34b085597eb8d4326bed71baf03899ee  dev-api-design-judgment-v0.1.0.kdna" | shasum -a 256 -c -

# Current runtime intentionally rejects this archived pre-CBOR artifact.
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:61ea244f-f623-4e8b-87f0-782d6b6cff4e`
- **SHA256:** `c25dc1a786c068cd49bf1d9c50f384ee34b085597eb8d4326bed71baf03899ee`
- **Built with:** KDNA Studio CLI
- **License:** CC-BY-4.0
