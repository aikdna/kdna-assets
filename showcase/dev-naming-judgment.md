# Naming Judgment

> Naming Judgment: the judgment threshold that separates good from harmful decisions.

Judges naming judgment trade-offs in software engineering — distinguishing productive from counter-productive decisions.

**命名判断框架。核心问题：这个名字好不好？命名是开发者最频繁的判断之一，直接决定代码的可读性和维护成本。好的名字让读者不看实现就能理解意图，坏的名字是隐藏的债务。**

## Core judgment

- **好名字让读者在读到名字的那一刻就知道它是什么——不需要看实现，不需要注释。**
  - *Applies when:* 给新变量、函数、类、模块取名时; 评审代码时评估已有命名
  - *Does not apply when:* 标准数学符号（如线性代数中的矩阵 A、B，或循环变量 i、j、k）——这类名字有领域共识，不需要长名字
  - *Failure risk:* 代码注释和名字不同步——名字没更新但注释被删了，或者名字误导了但注释无人阅读，结果读者信了名字被误导。

- **名字的长度应该和它的作用域成正比——越宽范围越需要精确的名字。**
  - *Applies when:* 全局变量、模块级别的函数、导出的公共 API; 跨多个文件使用的变量或函数
  - *Does not apply when:* 循环计数器、短函数内的临时变量; 领域约定的短名字（数学公式、标准算法）
  - *Failure risk:* 全局配置对象叫 `cfg`，在 50 个文件中被使用，每次看到 `cfg.x` 都需要去查 `x` 是什么配置项。

- **布尔类型用 is/has/can/should 前缀——让条件表达式像英语句子一样可读。**
  - *Applies when:* 定义布尔类型的变量; 定义返回布尔值的函数
  - *Does not apply when:* 枚举值（即使可能只有两个选项，用枚举而不是布尔更扩展）; 动态类型语言中返回多种类型的函数（需要在函数名上体现返回值类型而不是 is 前缀）
  - *Failure risk:* `const enabled = config.enabled` 后又 `if (enabled)` ——如果后来 `enabled` 被改为三值逻辑（true/false/null），`if (enabled)` 会因为 null 被当作 false 而产生 bug，但命名没有给出任何提示。

- **函数名表达「做了什么」而不是「怎么做」——隐藏实现细节，暴露业务意图。**
  - *Applies when:* 设计和命名函数/方法; 评审现有函数名是否揭示了过多实现细节
  - *Does not apply when:* 底层工具函数，调用方确实需要知道实现（如 `sortInPlace` vs `sortCopy` 的区别对调用方有实质影响）
  - *Failure risk:* `sendEmailViaSmtp(user)` 这个函数后来改成了 SendGrid API 发送，但函数名没更新，调用方代码留着误导性的 `sendEmailViaSmtp`，新工程师以为代码用的是 SMTP。

- **避免「误导性名字」比使用「好名字」更紧迫——误导比模糊更危险。**
  - *Applies when:* 评审代码时检查命名的准确性; 修改了函数/变量的行为但没有同步更新名字
  - *Does not apply when:* 已经废弃的代码（即将删除），不值得花精力更名
  - *Failure risk:* `getUserData(userId)` 函数里有 `console.log` 和数据库写操作（写入访问日志），调用方以为是纯读操作，在事务回滚时没有考虑到这个副作用。

## Scope

- **Out of scope:** 团队命名约定的选择（camelCase vs snake_case——这是风格统一，不是命名质量）; 领域术语的正确性（需要业务专家确认）

## Common failure modes

## Worked scenarios

## Install and load

```bash
curl -L -o dev-naming-judgment-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-naming-judgment-v0.1.0/dev-naming-judgment-v0.1.0.kdna

echo "7a049af6afe88552b64f9c8f28bec34f69794ce7c921dfbed46863cd13bbebda  dev-naming-judgment-v0.1.0.kdna" | shasum -a 256 -c -

kdna load dev-naming-judgment-v0.1.0.kdna --profile=compact --as=prompt
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:f5ced2ca-c4c8-45e1-8717-f248581e5b5e`
- **SHA256:** `7a049af6afe88552b64f9c8f28bec34f69794ce7c921dfbed46863cd13bbebda`
- **Built with:** kdna-studio-cli (kdna-assets-internal 10-gate pipeline)
- **Gates:** 10 PASS, 0 SKIP, 0 FAIL of 10
- **License:** CC-BY-4.0
