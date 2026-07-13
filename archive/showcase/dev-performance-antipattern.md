# Performance Antipattern

> **Archived demonstration.** This page documents a superseded pre-CBOR AIKDNA example.
> The file is preserved for historical integrity and is intentionally rejected by the current runtime.
> This page provides archive metadata only; do not load this file with the current runtime.

> Performance Antipattern: the judgment threshold that separates good from harmful decisions.

Judges performance antipattern trade-offs in software engineering — distinguishing productive from counter-productive decisions.

**生产环境性能问题的判断框架。核心问题：「这里会在真实负载下出现性能问题吗？」——不是分析算法复杂度，而是识别在实际运行中哪些结构性选择会导致不可接受的性能下降。**

## Core judgment

- **在没有真实负载数据之前，所有性能判断都是假设——要用数据说话，不用直觉说话。**
  - *Applies when:* 需要评估某段代码在高负载下的行为; 代码涉及数据库查询、网络调用、文件 I/O、内存分配; 数据规模可能随时间增长
  - *Does not apply when:* 代码运行在已知的固定规模下（如始终处理 <100 条记录的内部工具）; 代码已经有 profile 数据支撑，可以直接优化已知瓶颈
  - *Failure risk:* agent 把一个 O(n²) 的算法（n=10）标注为性能问题，同时漏掉了一个在 N+1 查询下每个请求执行 200 次数据库查询的代码。

- **N+1 查询是最常见的、影响最大的、最容易在 code review 中发现的性能反模式。**
  - *Applies when:* 代码中有「先查一组数据，然后对每条数据再查相关数据」的模式; ORM 代码，尤其是 lazy loading 关系; 循环体内有数据库调用、HTTP 调用、文件读取
  - *Does not apply when:* 循环内的查询已经被 batch/eager loading 替代; 数据集有明确的小规模上限且有业务保证（如最多 5 个配置项）
  - *Failure risk:* agent 看到 for loop 里有 db.find() 但没有意识到这是 N+1，因为代码逻辑上「正确」——每次 find 都返回了正确的数据。

- **在关键路径上的同步阻塞调用是延迟问题的主要来源，不是 CPU 计算。**
  - *Applies when:* 关键路径上有多个独立的数据库查询或外部 API 调用; 代码是顺序执行多个 await/async 操作，但这些操作之间没有依赖关系; 用户感知的响应时间很重要（API、页面加载）
  - *Does not apply when:* 操作之间有真实的依赖关系（B 的结果是 C 的输入）; 并行执行会引入数据竞争或事务问题
  - *Failure risk:* 代码里有 `const user = await getUser(id); const posts = await getPosts(id);`，两个查询串行执行，但它们完全独立，改成 `Promise.all` 可以减少一半延迟。

- **在热路径上创建大量短命对象会触发 GC 压力，在高并发下表现为不可预测的延迟毛刺。**
  - *Applies when:* 热路径（每个请求都执行）上有字符串拼接循环; 请求处理过程中创建了大量只用一次的中间对象; 使用了会隐式创建大量对象的 API（如 Java 的字符串格式化、Python 的列表推导式在热路径上）
  - *Does not apply when:* 代码不在热路径上（只在初始化时执行一次）; 语言运行时有 escape analysis 且这些对象不会逃逸到堆（某些 JVM 优化）
  - *Failure risk:* request handler 里有 `response = json.dumps({...})` 但对象构造过程中创建了大量临时字典，在高并发下导致 GC 压力，但在开发环境完全正常。

- **「过早优化」是真实的反模式——在没有性能数据之前，可读性优先于性能。**
  - *Applies when:* 考虑将可读的实现替换为「更高效」的复杂实现，但没有性能数据; 准备给出「这里可以用 X 代替 Y 以提升性能」的建议
  - *Does not apply when:* 有 profile 数据确认这里是瓶颈; 两种实现可读性相当，效率有明确差异（如避免在热路径上用正则表达式做简单字符串匹配）
  - *Failure risk:* agent 把一个清晰的 O(n) 实现（n=50）建议替换为复杂的 O(1) 哈希表实现，增加了 30 行代码，但实际场景下两者性能差异可以忽略不计。

## Scope

- **Out of scope:** 没有 profile 数据时给出具体的性能数字预测; 评估算法理论复杂度（O 符号分析）而不联系实际负载规模; 优化不在关键路径上的代码

## Common failure modes

## Worked scenarios

## Archived download and checksum

```bash
curl -L -o dev-performance-antipattern-v0.1.0.kdna \
  https://github.com/aikdna/kdna-assets/releases/download/dev-performance-antipattern-v0.1.0/dev-performance-antipattern-v0.1.0.kdna

echo "31933ae324e6fd81567d4629bb8ce0d03bb1a6dd7786b77be9102c3198c482f3  dev-performance-antipattern-v0.1.0.kdna" | shasum -a 256 -c -

# Current runtime intentionally rejects this archived pre-CBOR artifact.
```

## Provenance

- **Version:** 0.1.0
- **Asset UID:** `urn:uuid:bdef7d00-2d5c-43e6-98e0-90c0b8e475ec`
- **SHA256:** `31933ae324e6fd81567d4629bb8ce0d03bb1a6dd7786b77be9102c3198c482f3`
- **Built with:** KDNA Studio CLI
- **License:** CC-BY-4.0
