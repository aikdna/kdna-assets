# 一个 Codex Agent 如何把老子与爱比克泰德的判断创建为两个 KDNA 资产

这次工作的产物不是两篇哲学摘要，也不是把名言塞进 Prompt。产物是两个可独立
验证、规划加载并生成 Runtime Capsule 的 `.kdna` 判断资产：

- `@aikdna/laozi-wuwei@0.1.1`
- `@aikdna/epictetus-control-and-character@0.1.1`

创建者是一个 OpenAI Codex agent。执行环境没有为用户要求的模型身份提供可验证
证据，因此公开元数据和 provenance 不作任何模型专名署名。创建者也不是老子或
爱比克泰德的代言人；两个资产都是有明确边界的现代解释，而不是唯一、权威或完整
的思想版本。

## 从来源材料进入判断外化

老子资产以《道德经》古代文本为主要创作输入，章节阅读使用 Chinese Text Project
的章次文本，并用 Project Gutenberg 收录的 James Legge 公版译本做英文交叉核对。
重点章节包括第 2、3、8、9、10、11、17、22、29、30、32、36、37、40、43、44、
46、48、57、64、76、78 章。

爱比克泰德资产以《手册》和《论说集》为主要输入，使用 Project Gutenberg 收录的
George Long 公版材料、Scaife Viewer 的希腊文本，以及 Perseus 的公共阅读面。
重点包括《手册》1、2、4、5、8、9、10、13、17、20、23、24、30、33、45、48，
以及《论说集》1.1、1.18、1.28、2.5、2.10、2.18、3.2、3.24、4.1。

原典只承担“创作证据”的角色。每个核心判断都在 source ledger 中记录三件事：它
来自哪些章节、如何转化为可用于新情境的选择标准、加入了哪些现代解释。运行时
payload 没有把原典或译本当成文档库复制进去。

版权处理遵守一个简单边界：不复制现代受版权保护的翻译、注释或出版社内容；古代
文本和明确的公版材料只用于核对；最终英文判断由创建者自主表述。公版状态有地域
边界，Project Gutenberg 的标注针对美国，其他地区仍需自行判断当地规则。

## 先确定最高判断问题

老子资产的最高问题是：

> 面对复杂、冲突或过度控制的局势，什么是最小但足够负责的干预；何时应继续、
> 减力、等待或停止？

这个问题把“无为”从抽象口号变成干预强度判断。它要求先识别安全、责任、同意和
不可转让义务，再比较继续、柔化、等待和停止，而不是默认“什么都不做”。

爱比克泰德资产的最高问题是：

> 面对不确定、损失、他人评价或外部变化，什么属于自己的选择，什么只能影响；
> 此刻哪种负责的行动体现良好品格？

这里没有把世界粗暴切成“可控/不可控”两格，而是区分直接支配、可以影响、外部
决定三个区域。这个中间层防止“不可控”被误读成“不值得行动”。

## 把边界和 failure risks 写在判断里面

老子资产明确区分：无为与不作为、柔弱与软弱、知止与逃避、留白与缺失、反作用
与普通困难、功成不居与未交接就离场。遇到火灾、暴力、医疗紧急状态、正在发生的
安全事件、骚扰、虐待、同意缺失或不可转让义务时，必须先采取保护行动。这里的
现代安全门不是宣称古代章节原文就包含现代制度词汇，而是创建者为防止误用加入的
解释层。

爱比克泰德资产明确区分：控制与影响、印象与同意、行动质量与结果保证、品格与
声誉、合法角色义务与服从虐待、接受事实与放弃行动。它明确禁止受害者归责、情绪
压抑、以哲学替代心理健康支持、用结果不可保证来逃避疏忽责任，以及把贫困、歧视、
暴力或制度失败缩减为个人心态问题。

这些内容被写成 axioms、ontology、frameworks、boundaries、risks、
misunderstandings、patterns、scenarios、reasoning chains、cases、self-check cards
和 evolution stages。每一条都要能回答“什么情况下适用、什么情况下不适用、误用
会造成什么风险”，而不只是改写一句名言。

## 用公开工具链编译成当前 `.kdna`

0.1.0 的原始创作使用 KDNA Studio CLI 0.9.0、Studio Core 1.8.0、Core 0.16.0
和 CLI 0.31.0。当前 0.1.1 发行版则从保留的 0.1.0 文件出发，使用已发布的
Studio CLI 0.10.2、Studio Core 2.0.2、Core 0.20.0 和 Runtime CLI 0.34.0
重建；精确 npm 完整性、Git 提交和制品摘要记录在
[`rebuild-receipt-2026-07-18.json`](../evidence/rebuild-receipt-2026-07-18.json)。
该版本号是不可改写的历史重建坐标；后续 Runtime 验证基线见当前索引和各资产的
加载说明，不会反向改写这份重建证据。

原始创作路径是：

1. `kdna-studio create` 创建独立 Studio 项目；
2. `kdna-studio target declare` 声明任务范围、包含项、排除项和加载条件；
3. `kdna-studio import` 导入 source ledger；
4. `kdna-studio card add` 创建判断卡；
5. 记录 AI 作者复核，并明确 `human_review=false`；
6. Studio Core `compileDomain` 生成结构化编译结果；
7. Studio Core `exportRuntimeAsset` 生成 CBOR runtime payload；
8. KDNA Core `pack` 生成当前 `.kdna` 文件。

0.1.1 又在两个独立临时项目中分别导入旧 profile、编译和导出。Laozi 与
Epictetus 分别完整导入 90 与 92 张 Studio 卡片；机器可读比较覆盖所有判断字段、
来源引用、关系、推理和源作者 evolution 内容。两轮构建逐字节一致。由于没有人类
审阅，发行 payload 不写入 `human_lock`。没有手工制作 ZIP，也没有手工伪造
`payload.kdnab`。Agent 消费仍只能走 `plan-load` 和工具链产生的 Runtime Capsule。

## LoadPlan 和 Runtime Capsule

结构验证通过后，CLI 先为每个文件生成 LoadPlan。两个资产都是 `access=public`，
最终计划状态均为 `ready`、`can_load_now=true`、`required_action=load`，投影策略为
`minimal`。随后使用 `--profile=compact --as=json` 生成
`kdna.runtime-capsule`（contract 0.1.0），再用 `capsule-verify` 绑定原资产验证。

验证还包括 `inspect`，以及在空 HOME 中从单个 `.kdna` 文件安装后按包名重新
`plan-load` 和 `load`。两个资产都是未签名文件，Capsule 的 `signature.state` 因此
如实为 `absent`；这不影响公开访问和 checksum 验证，但不能被写成“已签名发布”。

## 真实失败和修复

过程里出现了多次失败：

- Studio target 的初始 category 和 owner scope 使用了无效枚举，改成当前 CLI 接受
  的值后才继续；
- Studio 导出的 `updated_at` 一度只有日期，Runtime schema 要求 RFC 3339
  `date-time`，因此首轮 LoadPlan 正确阻断；生成器改为使用记录好的标准时间点后
  重新从源编译；
- Studio Core 会把“卡片已锁定”自动写成 `Human judgment confirmed`，还会在没有
  来源治理数据时生成 `migration_status: human_authored`。这与 AI 创建事实冲突。
  编译后、Runtime 导出前执行了确定性的 provenance 归一化：删除自动生成的伪人审
  evolution stages，保留三条源作者 evolution stages，并把 manifest、KDNA Card 和
  报告明确标成 AI authored、human reviewed false；
- 首轮工具链暴露了 `reasoning.self_check` 与 compact 投影字段不一致的问题。发布
  前先修复 Core 并发布最终工具链，再从 Studio 源项目完整重建；最终两份资产的 8 条
  self-check 在 full payload 和 compact Runtime Capsule 中全部存在；
- 2026-07-17 的首批 0.1.1 候选又暴露出更严重的迁移缺陷：每份资产丢失 5 类
  legacy pattern，并丢失来源引用；当时的收据还比较了不存在的 `payload.core.cards`
  路径，形成了空比较。该收据已明确标记为 rejected，候选未发布。Studio Core
  2.0.2 与 Studio CLI 0.10.2 修复后，当前候选通过完整跨 profile 语义比较；
- 客户端测试首轮没有关闭 stdin，导致部分进程在任何 KDNA 调用前等待；修正 runner
  后重跑，失败记录仍保留；
- OpenCode 有一次并发数据库锁失败，隔离重跑成功；Codex 的初始模型请求在加载前
  失败，最终以明确的 GPT-5.5 client override 完成双资产加载。

## 行为验证没有证明“有效”

保留的 0.1.0 来源文件分别以 SHA-256
`ea0de0950b0217fb9421aa65c2d3d775fb5857efe18a93e82df52cda1815f924`
和 `04da31b0e7deb66eded8d55d369692504c013196ee644a75fc9460b9c0d1a800`
冻结。当前 0.1.1 发行文件的 SHA-256 为
`4a90b91fe955ec3a563a7c2b598568f0eedbd04d3393211692490dfde2e09ffc`
和 `d8513486bc033523359b8a582ca5d879d5ec01c926601d2fde34813a793c5ccf`。
Codex、Claude Code、OpenCode 曾分别对两个 0.1.0 来源文件完成 LoadPlan 和 compact
Capsule 加载，共 6 个 digest 绑定的客户端用例，使用 KDNA CLI 0.31.0 并成功退出；
这些历史运行不是当前 0.1.1 制品的客户端接受证据。

更早的探索性 fixtures 覆盖正向适用、非适用、误用、对抗、wrong-KDNA、
no-KDNA 和 holdout；任务与 rubric 分离，holdout 只运行一次。但这些对照与
holdout 记录早于当时的 artifact digest，不能被当成 0.1.0 或当前 0.1.1 文件的
行为验证。

但对照结果不支持“正确 KDNA 带来稳定提升”：在两个 anchor 上，correct-KDNA、
wrong-KDNA 和 no-KDNA 都能产生合格回答；部分 no-KDNA 回答甚至更具体。另有
Claude Code 输出直接打印卡片 ID 和接近原文的 Capsule 措辞，违反静默应用要求。
因此这些旧对照只保留为研发观察，不能宣传最终资产的行为增益、因果价值或真实
场景价值；6 个最终 digest 用例也只证明跨客户端加载与应用路径真实可运行。

## 发布边界

KDNA Core 验证的是结构、校验和、访问与加载合同，不验证哲学解释是否正确。两个
资产由 Codex agent 创建，并不代表老子或爱比克泰德本人；AIKDNA 发布示例也不等于
协议认可其中的判断。未来任何“更有效”“更安全”或“经专家认可”的说法，都需要
新的、独立的证据。

## 公开来源

- Chinese Text Project: https://ctext.org/dao-de-jing/zh
- Project Gutenberg, *Tao Teh King*: https://www.gutenberg.org/ebooks/216
- Project Gutenberg, Epictetus: https://www.gutenberg.org/ebooks/10661
- Scaife Viewer, *Enchiridion*: https://scaife.perseus.org/reader/urn:cts:greekLit:tlg0557.tlg002.perseus-grc2:1.1/
- Perseus, *Discourses*: https://www.perseus.tufts.edu/hopper/text?doc=urn:cts:greekLit:tlg0557.tlg001.perseus-eng1:1.28
