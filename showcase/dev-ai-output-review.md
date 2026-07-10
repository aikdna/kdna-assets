# AI Output Review

> Ai Output Review: the judgment threshold that separates good from harmful decisions.

Judges ai output review trade-offs in software engineering — distinguishing productive from counter-productive decisions.

**AI 生成代码的审查判断框架。核心问题：「这段 AI 生成的代码，我需要核验什么，信任什么？」——AI 生成代码的失败模式与人写的代码不同，需要不同的审查策略。这个资产专门针对 Claude Code、Cursor、Copilot 等 AI 编码工具的用户。**

## Core judgment

- **AI 写的代码在「通用逻辑」上通常是对的，在「项目集成」上经常是错的。**
  - *Applies when:* AI 输出调用了代码库中已有的函数、类、或模块; AI 输出涉及项目特定的命名约定、错误处理、数据格式
  - *Does not apply when:* AI 输出是完全独立的算法实现或工具函数，不集成到现有系统
  - *Failure risk:* AI 输出的代码逻辑无懈可击，但把所有字段都命名为 camelCase，而项目约定是 snake_case，上线后数据库存入了格式错误的字段名。

- **AI 倾向于「过度实现」——给了比需要更多的功能、抽象、防御性代码。**
  - *Applies when:* AI 输出比预期长很多; AI 输出包含了用户没有要求的额外功能; AI 输出中有大量 TODO、扩展点、可配置参数
  - *Does not apply when:* 用户明确要求「全面的实现」或「考虑各种边界情况」
  - *Failure risk:* 用户让 AI 「写一个读取配置文件的函数」，AI 实现了一个支持 JSON/YAML/TOML、有缓存、有 hot reload 的完整配置管理系统，但用户只需要读一个静态 JSON 文件。

- **AI 写的测试测的是「AI 对代码的理解」，不一定测的是「代码应该满足的业务需求」。**
  - *Applies when:* AI 生成了测试代码; 使用 AI 来补全现有代码的测试覆盖
  - *Does not apply when:* AI 基于用户提供的具体测试用例（输入/期望输出对）来生成测试
  - *Failure risk:* AI 生成了 20 个单元测试，覆盖率 85%，全部通过，用户很放心。但所有测试都基于 happy path，没有测试「余额不足时的拒绝行为」这个最重要的业务规则。

- **AI 对安全性的判断需要特别核验——它经常「逻辑上安全」但「集成后不安全」。**
  - *Applies when:* AI 代码涉及用户输入处理; AI 代码涉及认证、授权、数据访问控制; AI 代码声称「这里的输入已经被验证了」
  - *Does not apply when:* AI 输出是独立的安全工具（如加密函数），不依赖外部安全假设
  - *Failure risk:* AI 生成的 API handler 中注释写着「input is already validated by middleware」，但实际上那个中间件只在 Web 请求时运行，这段代码还会被内部批处理任务调用，绕过了中间件。

- **AI 生成的代码在「主路径」上通常正确，在「错误路径」和「边界条件」上经常不完整。**
  - *Applies when:* AI 生成了完整的函数或模块; 代码会处理外部输入或调用外部服务
  - *Does not apply when:* AI 输出是纯计算函数，无外部依赖，边界条件清晰
  - *Failure risk:* AI 生成的文件上传处理代码在正常上传时工作完美，但对于超大文件（超过内存限制）、网络中断、或同时上传同名文件，行为是未定义的或错误的。

## Scope

- **Out of scope:** 评估哪个 AI 工具生成的代码质量更好; AI 代码的一般性 code review（那与人工代码的 review 相同，用其他资产）; prompt engineering——如何写出让 AI 生成更好代码的提示

## Common failure modes

## Worked scenarios

## Install and load

```bash
curl -L -o dev-ai-output-review-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-ai-output-review-v0.1.0/dev-ai-output-review-v0.1.0.kdna

echo "7b3dbdd10a752899ebd1238aacf25c8b26c18112569e5bf9daea8f683fb113aa  dev-ai-output-review-v0.1.0.kdna" | shasum -a 256 -c -

kdna load dev-ai-output-review-v0.1.0.kdna --profile=compact --as=prompt
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:410f1e48-fcce-408f-8736-3aa469b4bcd2`
- **SHA256:** `7b3dbdd10a752899ebd1238aacf25c8b26c18112569e5bf9daea8f683fb113aa`
- **Built with:** KDNA Studio CLI
- **License:** CC-BY-4.0
