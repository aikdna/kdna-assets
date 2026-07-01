# Dependency Selection

> Dependency Selection: the judgment threshold that separates good from harmful decisions.

Judges dependency selection trade-offs in software engineering — distinguishing productive from counter-productive decisions.

**第三方依赖引入判断框架。核心问题：这个库/包值得引入吗？依赖决策既涉及当下的开发效率，也涉及未来的维护风险、安全风险和技术债务。**

## Core judgment

- **引入依赖前先问：「这件事我自己实现需要多少行？」——如果答案是 20 行以内，不要引入依赖。**
  - *Applies when:* 功能需求简单，可以用少量代码实现; 功能逻辑稳定，不需要频繁更新（如日期格式化、简单的字符串处理）
  - *Does not apply when:* 安全相关功能（加密、哈希、token 验证）——必须用经过验证的库，不要自己实现; 功能复杂度高（图像处理、PDF 生成、数据可视化），自己实现成本远超收益
  - *Failure risk:* 引入了一个「判断是否是质数」的 npm 包，该包 3 年未更新，Node.js 升级后不兼容，需要花时间排查依赖冲突。

- **看依赖的「健康指标」：最近 commit 时间、issue 响应速度、维护者数量——停止维护的库是定时炸弹。**
  - *Applies when:* 引入新的第三方依赖时; 评审依赖时发现某个库很久没有更新
  - *Does not apply when:* 非常成熟的、功能稳定的库（如某些加密库），低频更新不等于停止维护
  - *Failure risk:* 引入了一个流行度高但维护者已两年未活跃的 JSON 解析库，Node.js 大版本升级后该库抛出弃用警告，最终不得不紧急替换。

- **引入的依赖应该做一件事并做好——拒绝「把厨房水槽都打包进来」的重量级依赖，当你只需要其中 5% 的功能时。**
  - *Applies when:* 需要一个大型库中的某一个或几个功能; 前端项目对包大小敏感
  - *Does not apply when:* 你确实需要这个库的大部分功能; 这个库是生态标准（如 React——你不太可能只用其中 5%）
  - *Failure risk:* 引入 moment.js（300KB）只用了它的日期格式化功能，而 `date-fns` 的 `format` 函数可以只打包进几 KB。

- **安全相关功能必须用成熟的、经过密码学审计的库——任何「自己实现」的加密都是错误的。**
  - *Applies when:* 任何涉及加密、哈希、签名、token 的功能; 任何用户认证和授权相关的功能
  - *Does not apply when:* 非安全用途的哈希（如哈希表的 key 哈希，不需要密码学安全）
  - *Failure risk:* 自己实现了一个「基于时间戳的 token 生成」逻辑，被发现可以通过枚举时间戳来伪造有效 token，因为没有密码学随机性。

- **依赖的「替换成本」决定了引入时的审慎程度——越难替换的依赖越要在引入前仔细评估。**
  - *Applies when:* 引入会被大量代码直接依赖的库（框架、ORM）; 引入后替换成本高的依赖
  - *Does not apply when:* 通过适配层/接口隔离的依赖（即使是数据库，如果有良好的 Repository 层，替换成本也较低）
  - *Failure risk:* 直接在所有模块里用 `import axios from 'axios'`，后来需要切换到带有重试/熔断功能的 HTTP 客户端，发现需要修改几十个文件。如果当初通过统一的 httpClient 模块封装，只需要修改一处。

## Scope

- **Out of scope:** 开源许可证的法律合规性（需要法务团队确认）; 具体的版本选择和 semver 策略（这是依赖管理，不是依赖选择）

## Common failure modes

## Worked scenarios

## Install and load

```bash
curl -L -o dev-dependency-selection-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-dependency-selection-v0.1.0/dev-dependency-selection-v0.1.0.kdna

echo "44055527743606ffcf8c4c73fa2bb54874045e2f28dd1951d0081dfbd3e4e0c5  dev-dependency-selection-v0.1.0.kdna" | shasum -a 256 -c -

kdna load dev-dependency-selection-v0.1.0.kdna --profile=compact --as=prompt
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:595c6a69-1e37-4ed1-8668-c0e1ba8ba888`
- **SHA256:** `44055527743606ffcf8c4c73fa2bb54874045e2f28dd1951d0081dfbd3e4e0c5`
- **Built with:** kdna-studio-cli (kdna-assets-internal 10-gate pipeline)
- **Gates:** 10 PASS, 0 SKIP, 0 FAIL of 10
- **License:** CC-BY-4.0
