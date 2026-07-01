# AI Collaboration

> Ai Collaboration: the judgment threshold that separates good from harmful decisions.

Judgment asset for ai collaboration — criteria, signals, and failure modes.

**与 AI agent 高效协作的判断框架。覆盖两个核心决策：(1) 给 AI 什么上下文（多少、哪些、什么格式）才能获得最好的输出；(2) AI 输出什么时候可以信任，什么时候必须人工核验。这是 Claude Code、Cursor、Codex 用户的元技能资产。**

## Core judgment

- **给 AI 的上下文应该是「任务需要什么就给什么」，不是「越多越好」或「越少越好」。**
  - *Applies when:* 开始一个新任务前决定给 AI 什么上下文时; AI 输出明显偏离预期，怀疑是上下文不足时; 任务涉及代码库特定约定、业务规则、或技术约束时
  - *Does not apply when:* 任务是完全通用的（如「帮我写一个排序算法」），不需要项目特定上下文
  - *Failure risk:* 用户把整个 README + 所有相关文件粘贴给 AI，AI 的输出反而不如只给关键片段时准确——因为关键信息被淹没在大量无关内容中。

- **AI 在「代码逻辑」上可信，在「系统集成」和「当前状态」上必须核验。**
  - *Applies when:* AI 的输出涉及调用你代码库里的函数、使用你的 API、或与你的系统集成; AI 提到了具体的版本号、API 用法、或外部库的特性; AI 的输出需要和现有代码合并
  - *Does not apply when:* 任务是纯算法实现，与外部系统无关; 任务是生成独立的脚本，不集成到现有代码库
  - *Failure risk:* AI 生成了一段调用 `userService.findByEmail()` 的代码，用户直接使用，但实际上代码库里这个方法叫 `userService.getUserByEmail()`，运行时报错。

- **AI 的高置信度输出比低置信度输出更需要核验——因为高置信度时更容易被直接接受。**
  - *Applies when:* AI 的输出非常具体（函数名、文件路径、配置值）; AI 声称某个功能已经实现或某个函数已经存在; AI 给出了外部库的用法或 API 调用方式
  - *Does not apply when:* AI 的输出是明确可验证的（一段可以直接运行的代码，运行结果可以立即确认）
  - *Failure risk:* AI 非常自信地说「你可以用 config.getFeatureFlag('newCheckout') 来获取 feature flag 状态」，用户直接使用，但实际上这个函数不存在，因为你的 feature flag 系统用的是完全不同的 API。

- **任务越复杂，越需要在中间检查点确认 AI 的方向，而不是等到最后。**
  - *Applies when:* 任务涉及多个相互依赖的步骤; 任务涉及架构决策（如何组织代码）; 任务结果难以部分验证（需要全部完成才能测试）
  - *Does not apply when:* 任务是简单且独立的（如「帮我写一个把字符串转为驼峰命名的函数」）
  - *Failure risk:* 用户让 AI 「帮我重构整个认证模块」，AI 用了一个用户不认可的架构方案，但等到 AI 输出了 500 行代码后才发现，需要全部重来。

- **「让 AI 做计划，人来批准计划，AI 再执行」比「让 AI 直接执行」成功率更高。**
  - *Applies when:* 任务涉及多个文件或系统的修改; 任务结果不容易撤销（如数据库变更、API 设计决策）; 用户对任务的范围或方法有不确定性
  - *Does not apply when:* 任务是自包含的小修改（改一行代码、写一个函数）; 用户已经对 AI 的方法有充分了解并信任
  - *Failure risk:* 用户让 AI 「重构这个模块使其更可测试」，AI 直接改了 8 个文件，引入了一个用户不认可的 dependency injection 框架，返工成本极高。

## Scope

- **Out of scope:** 评估 AI agent 的底层能力（这个 model 比那个 model 好）; 如何写好 prompt（那是 prompt engineering，不是判断）; 评估 AI 输出的代码是否正确（那是 code review 的工作）

## Common failure modes

## Worked scenarios

## Install and load

```bash
curl -L -o dev-ai-collaboration-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-ai-collaboration-v0.1.0/dev-ai-collaboration-v0.1.0.kdna

echo "65b5511868dada45519d55616283df66807e08bf604f42c429a8c5a3ab9e6964  dev-ai-collaboration-v0.1.0.kdna" | shasum -a 256 -c -

kdna load dev-ai-collaboration-v0.1.0.kdna --profile=compact --as=prompt
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:667d4a65-f22b-4a73-9043-ce06e2958d85`
- **SHA256:** `65b5511868dada45519d55616283df66807e08bf604f42c429a8c5a3ab9e6964`
- **Built with:** kdna-studio-cli (kdna-assets-internal 10-gate pipeline)
- **Gates:** 10 PASS, 0 SKIP, 0 FAIL of 10
- **License:** CC-BY-4.0
