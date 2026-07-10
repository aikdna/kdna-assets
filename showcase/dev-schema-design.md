# Schema Design

> Schema Design: the judgment threshold that separates good from harmful decisions.

Judges schema design trade-offs in software engineering — distinguishing productive from counter-productive decisions.

**数据 Schema 设计判断框架。核心问题：这个数据结构设计得好不好？Schema 决策的影响比普通代码更长远——一旦数据写入生产数据库，改变 Schema 的成本极高。**

## Core judgment

- **Schema 的变更成本远高于代码变更——数据库 Schema 一旦有生产数据，修改代价是代码修改的 10-100 倍。**
  - *Applies when:* 设计数据库表结构; 设计会被持久化的数据结构（Kafka 事件格式、配置文件格式）
  - *Does not apply when:* 内部纯临时的数据结构（函数内的中间变量）; API 请求/响应 Schema（改起来比数据库更容易，但仍需版本管理）
  - *Failure risk:* 把用户的「偏好设置」设计为数据库中的独立字段（`is_notification_enabled`, `theme`, `language`），后来需要支持动态添加新设置，每次都要 ALTER TABLE，代价极高。如果一开始设计为 JSONB 列或独立的 settings 表，就没有这个问题。

- **NULL 的语义必须明确——NULL 是「未知」、「不适用」还是「明确为空」？不要让 NULL 意味着多种不同的情况。**
  - *Applies when:* 数据库字段允许 NULL 时; 设计可选字段的数据结构
  - *Does not apply when:* NULL 语义在领域内有明确约定（如外键 NULL 表示「无关联」，这是标准用法）
  - *Failure risk:* 统计「用户完成度」时 `COUNT(*) WHERE preference IS NULL` 混合了「从未设置」和「主动清除设置」两种情况，导致统计数据失真。

- **把会一起查询的数据放在一起，把会独立演化的数据分开——数据的访问模式决定 Schema 的结构。**
  - *Applies when:* 设计数据库表结构，需要决定是否规范化; 现有 Schema 出现性能问题，评估是否需要反规范化
  - *Does not apply when:* 事务性数据（如财务记录），数据一致性优先于查询性能，应该保持严格规范化
  - *Failure risk:* 把「用户详情」、「用户设置」、「用户的最后一次登录」都放在一个 `users` 表的不同列，结果每次查询用户列表时都带出了大量用不到的数据，表行宽度极大，索引效率低。

- **ID 的设计决定了分布式系统的可行性——不要在分布式系统中用自增整数 ID。**
  - *Applies when:* 设计新的数据库表的主键; 系统有多服务、多数据库、或分片的可能性
  - *Does not apply when:* 确定是单机单数据库、数据量有限、不会迁移的内部工具系统; 需要顺序 ID 来支持范围查询（如分页游标）的特定场景
  - *Failure risk:* 系统初期用自增 int ID，用户量增长后需要分库分表，整个系统需要迁移到 UUID，涉及所有表的外键、所有 API 的参数类型、所有客户端的本地存储，迁移耗费了数个月。

- **时间字段必须存储 UTC、必须包含时区信息——任何「本地时间」存储都是定时炸弹。**
  - *Applies when:* 任何需要存储时间的字段; 跨时区使用的系统
  - *Does not apply when:* 确定系统永远只在单一时区使用，且时区不会改变（内部工具可能符合这个条件，但要明确声明这个假设）
  - *Failure risk:* 电商系统存储了订单创建时间为服务器本地时间（UTC+8），后来业务扩展到北美，历史订单的时间需要手动迁移，且部分历史数据因夏令时期间的时间歧义而无法确定准确时间。

## Scope

- **Out of scope:** SQL 性能调优（索引选择、查询优化——这是单独的技能域）; NoSQL vs SQL 的选型（这是架构决策，需要更多上下文）

## Common failure modes

## Worked scenarios

## Install and load

```bash
curl -L -o dev-schema-design-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-schema-design-v0.1.0/dev-schema-design-v0.1.0.kdna

echo "ea82bf8da1eaa9103138cd58995787f61a982a31f255df17624ee0003d04000d  dev-schema-design-v0.1.0.kdna" | shasum -a 256 -c -

kdna load dev-schema-design-v0.1.0.kdna --profile=compact --as=prompt
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:6ba08c44-a153-4cb7-83d0-50c070d5b5ad`
- **SHA256:** `ea82bf8da1eaa9103138cd58995787f61a982a31f255df17624ee0003d04000d`
- **Built with:** KDNA Studio CLI
- **License:** CC-BY-4.0
