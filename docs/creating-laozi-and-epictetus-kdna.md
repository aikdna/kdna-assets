# 老子与爱比克泰德参考 KDNA 的创建说明

本仓库提供两个公开参考资产：

- `@aikdna/laozi-wuwei@0.1.1`
- `@aikdna/epictetus-control-and-character@0.1.1`

它们用于展示来源记录、结构化判断、边界、打包、验证、LoadPlan 和 Runtime
Capsule 互操作，不是官方哲学解释、真人背书、行为价值证明或使用推荐。

## 来源与作者边界

两个资产由 AI 创作流程产生，`human_review=false`。创建者不是老子或爱比克泰德
的代言人；内容是有明确边界的现代解释。

老子资产以《道德经》古代文本、Chinese Text Project 章次文本和 Project
Gutenberg 的 James Legge 公版译本作创作参考。爱比克泰德资产以《手册》《论说集》
及 Project Gutenberg、Scaife Viewer、Perseus 的公共材料作参考。运行时 payload
没有把原典或译本复制成知识库。

## 判断范围

老子资产围绕复杂局势中的干预强度、继续、减力、等待和停止，明确排除把“无为”
误解为面对安全事件、暴力、医疗紧急情况、骚扰、虐待或不可转让义务时的不作为。

爱比克泰德资产围绕直接支配、可以影响与外部决定的区分，以及不确定条件下的负责
行动，明确排除受害者归责、情绪压抑、逃避责任，以及把制度问题缩减为个人心态。

这些选择被表达为有作用域的判断单元、边界、风险、场景和自检，而不是名言集合。

## 技术构建

0.1.1 文件由保留的创作材料通过公开 Studio 与 Core 工具链重建。精确工具链、
Git 坐标、npm 完整性和制品摘要记录在
[`rebuild-receipt-2026-07-18.json`](../evidence/rebuild-receipt-2026-07-18.json)。

每个文件可以用当前兼容工具链执行：

```bash
kdna validate ./asset.kdna
kdna plan-load ./asset.kdna --json
kdna load ./asset.kdna --profile=compact --as=json
```

技术有效只说明对应容器、完整性、授权计划和投影合同成立。它不说明解释正确、
Agent 已采用其中判断，或结果获得任何人的偏好。

## 公开来源

- Chinese Text Project: https://ctext.org/dao-de-jing/zh
- Project Gutenberg, *Tao Teh King*: https://www.gutenberg.org/ebooks/216
- Project Gutenberg, Epictetus: https://www.gutenberg.org/ebooks/10661
- Scaife Viewer, *Enchiridion*: https://scaife.perseus.org/reader/urn:cts:greekLit:tlg0557.tlg002.perseus-grc2:1.1/
- Perseus, *Discourses*: https://www.perseus.tufts.edu/hopper/text?doc=urn:cts:greekLit:tlg0557.tlg001.perseus-eng1:1.28
