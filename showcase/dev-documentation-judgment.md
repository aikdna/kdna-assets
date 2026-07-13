# Documentation Judgment

> **Archived demonstration.** This page documents a superseded pre-CBOR AIKDNA example.
> The file is preserved for historical integrity and is intentionally rejected by the current runtime.
> Re-export legitimate source through current Studio/CLI tooling before attempting to load it.

> Documentation Judgment: the judgment threshold that separates good from harmful decisions.

Judges documentation judgment trade-offs in software engineering — distinguishing productive from counter-productive decisions.

**代码文档与注释的判断框架。核心问题：「这段代码需要注释/文档吗？」——不是「越多越好」，而是判断什么时候文字说明能比代码本身更有效地传递信息。**

## Core judgment

- **注释应该解释「为什么」，不是「什么」——好的代码已经在解释「什么」了。**
  - *Applies when:* 准备写注释时，先问「这个注释是否告诉了读者代码本身无法告诉他们的信息」; review 中评估注释质量时
  - *Does not apply when:* API 文档（JSDoc/docstring）——这类注释的受众是调用方，需要解释「什么」，而不只是「为什么」
  - *Failure risk:* 代码里有大量注释，但都是「// 检查用户是否登录」「// 返回结果」，完全没有添加信息，且在代码修改后变成了过时的噪音。

- **需要注释的三类情况：隐性约束、绕过常规的特殊处理、非显而易见的业务规则。**
  - *Applies when:* 代码包含看起来「不对」但实际上是正确的特殊处理; 代码有隐性的调用前提（必须在某个状态下调用）; 代码实现了一个不了解业务背景就无法理解的规则
  - *Does not apply when:* 代码逻辑直接、命名清晰，且不包含任何上述三类情况
  - *Failure risk:* 隐性约束没有注释，新工程师「修复」了一个「看起来多余」的 lock，导致了竞争条件 bug。

- **「自解释代码」优先于注释——如果代码需要注释才能理解，先考虑改代码。**
  - *Applies when:* 准备写注释来解释一个复杂的变量名或函数逻辑; 代码 review 中发现了需要大量注释才能理解的代码
  - *Does not apply when:* 代码的复杂性来自业务规则本身（而不是实现方式），这时注释是必要的; 代码是性能优化的结果，清晰性被牺牲了，此时应该同时有注释说明为什么
  - *Failure risk:* 一段有 10 行注释的 5 行代码，注释和代码都难以理解——但实际上只要把函数名从 `process` 改为 `calculateTaxWithHolidayDiscount` 就可以不需要注释了。

- **文档的受众决定文档的内容——API 文档、架构文档、行内注释是三种不同的东西。**
  - *Applies when:* 决定一段文档应该写在哪里（行内注释 vs docstring vs 架构文档）; 评估一段文档是否对其预期读者有价值
  - *Does not apply when:* 该判断不适用于以下情况尚未确定的早期探索阶段（proof-of-concept 阶段）
  - *Failure risk:* 一个 docstring 里有大量架构背景，但调用方只需要知道「参数是什么，返回什么」，花了大量时间读了一堆不相关的信息。

- **过期注释比没有注释更危险——它提供了看起来可信但实际上错误的信息。**
  - *Applies when:* 修改了代码后，是否需要同时更新相关注释; 阅读到一个「告诫性」注释（「不要这样做」「必须在 X 之后调用」）时，验证它是否还有效
  - *Does not apply when:* 注释只描述了永恒为真的事实（业务规则、数学原理），不会随实现变化而过期
  - *Failure risk:* 注释写「必须在调用 init() 后才能调用此函数」，但 init() 已经在重构中被改为自动调用，注释变成了误导。

## Scope

- **Out of scope:** 用户文档、产品文档（非代码文档）; 代码注释的具体格式规范（JSDoc 语法等）

## Common failure modes

## Worked scenarios

## Install and load

```bash
curl -L -o dev-documentation-judgment-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-documentation-judgment-v0.1.0/dev-documentation-judgment-v0.1.0.kdna

echo "ae7ac12a121fbc3e3b3b0337d906eefa69853133cf10a0064361f9085f95d438  dev-documentation-judgment-v0.1.0.kdna" | shasum -a 256 -c -

# Current runtime intentionally rejects this archived pre-CBOR artifact.
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:e0e9ebd7-87e9-4240-86cf-e29a1ff72280`
- **SHA256:** `ae7ac12a121fbc3e3b3b0337d906eefa69853133cf10a0064361f9085f95d438`
- **Built with:** KDNA Studio CLI
- **License:** CC-BY-4.0
