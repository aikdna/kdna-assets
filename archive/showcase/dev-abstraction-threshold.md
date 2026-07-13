# Abstraction Threshold

> **Archived demonstration.** This page documents a superseded pre-CBOR AIKDNA example.
> The file is preserved for historical integrity and is intentionally rejected by the current runtime.
> This page provides archive metadata only; do not load this file with the current runtime.

> Abstraction Threshold: the judgment threshold that separates good from harmful decisions.

Judges abstraction threshold trade-offs in software engineering — distinguishing productive from counter-productive decisions.

**抽象层次的判断框架。核心问题：这里过度抽象了，还是抽象不够？好的抽象让代码更能表达意图、更容易复用；坏的抽象增加复杂度却没有带来真正的收益。**

## Core judgment

- **「三次法则」：第一次写死，第二次忍受，第三次才抽象——不要为假想的重用而提前抽象。**
  - *Applies when:* 第一次或第二次遇到相似代码时; 在没有具体使用场景的情况下设计「通用」接口
  - *Does not apply when:* 已经有三个或以上的具体使用场景; 这是已经经过充分验证的领域，形状已经确定（如标准数据结构实现）
  - *Failure risk:* 为两处相似代码提取了一个公共函数，第三处出现时需求稍有不同，公共函数需要加参数来支持，抽象开始腐烂。

- **过度抽象的信号：调用方需要理解抽象内部才能正确使用它。**
  - *Applies when:* 抽象有多个层级（抽象的抽象）; 使用抽象的代码比不抽象时更难理解; 抽象的接口有 5 个以上的方法或配置项
  - *Does not apply when:* 抽象的目的是隔离外部依赖（如数据库访问层），复杂性是必要的
  - *Failure risk:* 引入了一个「灵活的」事件系统抽象，调用方为了发一个简单事件需要理解 EventBus 的生命周期、订阅/退订机制和事件类型注册——比直接调用函数多了 3 倍的概念负担。

- **抽象不足的信号：同样的逻辑在 3 个以上地方有微小差异地重复，且差异是偶然的而非本质的。**
  - *Applies when:* 代码库中有多处高度相似的逻辑; 修改一处逻辑时需要搜索并修改多处相似代码
  - *Does not apply when:* 相似代码代表了不同的业务概念，未来可能独立演化; 只有两处相似，还不足以确定正确的抽象形状
  - *Failure risk:* 三处日期格式化代码都是 `format(date, 'YYYY-MM-DD')` 但一处缺少了 padding，发现是 bug，需要找出所有同类代码同步修复——因为没有抽象。

- **好的抽象让调用方代码更能「表达意图」，坏的抽象让调用方代码变成「操控机器」。**
  - *Applies when:* 评审使用了抽象的调用方代码; 判断一个抽象是否达到了应有的封装效果
  - *Does not apply when:* 基础设施层代码（如 HTTP 客户端封装），本来就需要描述技术操作
  - *Failure risk:* 支付流程代码：`paymentGateway.init(); paymentGateway.setAmount(100); paymentGateway.setCurrency('USD'); paymentGateway.execute();`——4 行代码才表达了「支付 100 美元」这一个业务意图，抽象不够高。

- **抽象的代价是可见的，抽象的收益有时是假想的——每引入一层抽象，都应该能说清楚它解决了什么具体问题。**
  - *Applies when:* 添加抽象的理由是「以后可能用得到」; 抽象的收益无法从当前已有的使用场景中具体描述
  - *Does not apply when:* 这个扩展点有明确的近期计划（如明确知道下个月会接第二个支付渠道）
  - *Failure risk:* 为「以后可能接入多个数据库」设计了一套 Repository 抽象接口，但两年内从未切换过数据库，这套抽象成了每次开发新功能时都要实现三个额外文件的负担。

## Scope

- **Out of scope:** 具体选择哪种设计模式（那是架构决策）; 性能层面的抽象代价（需要具体 profiling 才能量化）

## Common failure modes

## Worked scenarios

## Archived download and checksum

```bash
curl -L -o dev-abstraction-threshold-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-abstraction-threshold-v0.1.0/dev-abstraction-threshold-v0.1.0.kdna

echo "2a919dc4bc88066f5a9aa48ecb3b665ac0faafc33bdd1e5688c04bd68fc9cf22  dev-abstraction-threshold-v0.1.0.kdna" | shasum -a 256 -c -

# Current runtime intentionally rejects this archived pre-CBOR artifact.
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:90e484b1-e4c8-40d9-9903-0935887dd90a`
- **SHA256:** `2a919dc4bc88066f5a9aa48ecb3b665ac0faafc33bdd1e5688c04bd68fc9cf22`
- **Built with:** KDNA Studio CLI
- **License:** CC-BY-4.0
