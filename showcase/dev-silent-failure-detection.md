# Silent Failure Detection

> Silent Failure Detection: the judgment threshold that separates good from harmful decisions.

Judges silent failure detection trade-offs in software engineering — distinguishing productive from counter-productive decisions.

**静默失败的识别与追踪框架。核心问题：「为什么没有报错，但结果不对？」——定义 agent 在面对「代码运行正常但输出不符合预期」时的诊断思路，聚焦于识别错误被静默吞掉的结构性来源。**

## Core judgment

- **静默失败总是来自「错误在某处被处理了，但没有被传递给调用方」——找到那个吞掉错误的地方。**
  - *Applies when:* 代码执行没有异常/错误码，但输出值不正确; 发现 catch 块里只有 console.log 而没有 re-throw 或错误传递; 代码使用了大量 `??`、`||`、`.getOrDefault()` 提供默认值
  - *Does not apply when:* 错误已经有明确的异常堆栈或错误码（此时是显式失败，不是静默失败）; 代码是纯函数且无任何 I/O 操作（静默失败通常来自 I/O 或类型边界）
  - *Failure risk:* agent 看到代码没有抛出异常就认为「代码正确」，没有追踪到 catch 块里有个 `return null` 把错误状态吞掉了，后续所有对 null 的处理都产生了错误的结果。

- **未被 await 的 Promise 是异步代码中最常见的静默失败来源——错误在背景里消失，不会出现在任何日志或堆栈里。**
  - *Applies when:* 异步代码中有返回 Promise 的函数调用; forEach 循环体内有 async/await; 非 async 函数内调用了 async 函数
  - *Does not apply when:* 代码使用的是回调模式（node-style callbacks）而非 Promise; 框架已经全局处理了 unhandled rejection（但即使如此，错误可能在错误的上下文里被报告）
  - *Failure risk:* 用户数据库写入失败（rejected promise），但调用处没有 await，程序继续执行并返回「成功」给用户——数据没有被保存，但没有任何错误提示。

- **「默认值」模式（`value || default`、`value ?? default`）在掩盖真实错误时不会给出任何信号。**
  - *Applies when:* 代码中有大量 `||` 或 `??` 运算符提供默认值; 函数在失败时返回空集合（`[]`）、零值（`0`）、空字符串而不是 null 或异常
  - *Does not apply when:* 默认值是明确有意义的业务逻辑（「未填写名字的用户显示为匿名」，而不是「用户加载失败」）
  - *Failure risk:* 数据库查询失败返回了空数组，调用方用 `results.length === 0` 判断为「没有数据」，实际上是查询报错了，错误被传播为「数据为空」的假象。

- **类型强制转换（弱类型语言）产生的 NaN/null/undefined 可以在代码中静默传播数十步后才显现。**
  - *Applies when:* 代码是 JavaScript/TypeScript（包括 Node.js）; 涉及用户输入转换为数值的代码（parseFloat/parseInt/Number(value)）; 数值计算的结果被用于条件判断或再次计算
  - *Does not apply when:* 强类型语言（Java/Go/Rust）不存在这类隐式转换问题
  - *Failure risk:* 从 API 返回的价格字段是字符串 `"price": "19.99"`，直接用于 `price * quantity` 计算，JavaScript 自动转换，但某次 price 是 `null`，结果是 `0`——订单免费了，没有任何错误。

- **静默失败的定位策略：从错误结果向上追溯，而不是从代码入口向下寻找。**
  - *Applies when:* 已知最终输出是错误的，但不知道错误在哪里引入; 调试过程发现「每个局部函数都返回了看起来正确的值」
  - *Does not apply when:* 错误已经有明确的堆栈（此时可以直接从堆栈出发）
  - *Failure risk:* 开发者从函数入口开始加 log，逐步追踪，发现每个函数都「正常」，最后 2 小时后还没找到问题——应该从错误的输出值出发向上追踪。

## Scope

- **Out of scope:** 具体语言的类型系统细节（每种语言的强制转换规则需要语言专项知识）; 异步框架的具体 API（如何在特定框架里正确处理 Promise rejection）

## Common failure modes

## Worked scenarios

## Install and load

```bash
curl -L -o dev-silent-failure-detection-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-silent-failure-detection-v0.1.0/dev-silent-failure-detection-v0.1.0.kdna

echo "efa1671e410076ecd323db312edffd6c31981713ebe72c34c95beafbb73abe72  dev-silent-failure-detection-v0.1.0.kdna" | shasum -a 256 -c -

kdna load dev-silent-failure-detection-v0.1.0.kdna --profile=compact --as=prompt
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:3d6d03e1-50db-4b7b-91aa-2a26f9290947`
- **SHA256:** `efa1671e410076ecd323db312edffd6c31981713ebe72c34c95beafbb73abe72`
- **Built with:** KDNA Studio CLI
- **License:** CC-BY-4.0
