# Refactoring Timing

> Refactoring Timing: the judgment threshold that separates good from harmful decisions.

Judges refactoring timing trade-offs in software engineering — distinguishing productive from counter-productive decisions.

**重构时机判断框架。核心问题：「现在该重构还是等以后？」——重构的价值随时机而变化：在正确的时机重构事半功倍，在错误的时机重构引入风险或浪费精力。**

## Core judgment

- **重构有两个最佳时机：修 bug 时（顺路改）和添加功能之前（为新功能清理路径）——不是随机的空闲时间。**
  - *Applies when:* 即将修 bug，发现周围代码结构混乱; 即将添加新功能，但现有代码结构阻碍了新功能的整洁实现
  - *Does not apply when:* 代码是别人当前正在修改的热点，重构会引起严重的 merge conflict; 临近发布截止日期，引入任何额外变更的风险不可接受
  - *Failure risk:* 每次进入一段乱代码都「留着以后再改」，结果这段代码越来越难改，以后的重构成本比现在高 10 倍。

- **「童子军规则」：每次离开代码时比进来时更干净一点点——渐进改善比一次性大重构风险更低。**
  - *Applies when:* 任何时候发现了可以用小改动明显改善的地方; 不适合做大重构但代码质量持续下滑时
  - *Does not apply when:* 当前任务在时间压力下，连微改善的时间都没有; 改善需要跨越多个文件，「顺手改」会超出当前 PR 的范围
  - *Failure risk:* 团队严格遵守「不在 bug fix PR 里改任何不相关的东西」，结果代码质量只进不出，只有在专门重构迭代（很少发生）时才改善。

- **重构的价值随「代码被修改的频率」放大——经常改的代码值得重构，很少动的代码不值得。**
  - *Applies when:* 评估是否值得投入时间重构一段代码; 在多个重构候选中确定优先级
  - *Does not apply when:* 代码有安全漏洞或严重 bug，无论修改频率都需要修
  - *Failure risk:* 团队花了 2 周重构一个稳定运行的配置解析模块（「它代码很乱」），但这个模块在接下来 1 年里只被修改了 1 次，重构带来的收益远低于成本。

- **重构的风险随「依赖代码的范围」增加——越多地方依赖的代码，重构时越需要谨慎。**
  - *Applies when:* 准备重构一个被大量代码依赖的核心函数或模块; 重构涉及到公共接口（API、shared library）
  - *Does not apply when:* 重构只影响内部实现，接口不变，且有充分的集成测试覆盖
  - *Failure risk:* 重构了一个工具函数，认为「改动很简单」，但有 3 个调用方依赖了它的一个边界行为（返回 null 而不是空数组），这 3 个调用方在测试中没有覆盖，生产中出现了 bug。

- **「等以后再重构」很少真的发生——「以后」需要有 ticket、时间预算、owner，否则等于永远不会。**
  - *Applies when:* 说「以后再重构」时，问自己：有没有 ticket？有没有 owner？
  - *Does not apply when:* 团队有专门的技术债处理机制（如每 sprint 留出一定比例的时间），且有记录和跟踪系统
  - *Failure risk:* 代码库里有数十个「TODO: refactor this」的注释，没有对应的 ticket，没有人负责，几年后这些 TODO 仍然存在，代码继续在这个基础上堆叠。

## Scope

- **Out of scope:** 具体的重构技术（如何重命名、如何提取函数）——那是实现层面的问题; 是否要做某个特定的重构（那需要结合代码具体情况判断）

## Common failure modes

## Worked scenarios

## Install and load

```bash
curl -L -o dev-refactoring-timing-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-refactoring-timing-v0.1.0/dev-refactoring-timing-v0.1.0.kdna

echo "8fbb3b49139128756189cbdfe775938c85653a4a4c2e56d9f92a5b6ef2433988  dev-refactoring-timing-v0.1.0.kdna" | shasum -a 256 -c -

kdna load dev-refactoring-timing-v0.1.0.kdna --profile=compact --as=prompt
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:7a6fc14d-1fd5-4f22-96a2-08053d76c9b0`
- **SHA256:** `8fbb3b49139128756189cbdfe775938c85653a4a4c2e56d9f92a5b6ef2433988`
- **Built with:** KDNA Studio CLI
- **License:** CC-BY-4.0
