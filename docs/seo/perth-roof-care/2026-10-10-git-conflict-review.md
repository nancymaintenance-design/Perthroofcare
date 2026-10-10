# GitHub 与本地 SEO 版本冲突复核

> 状态更新：本地冲突现已解决，119 项检查通过。本文以下内容保留初次复核时的历史结果；最新处理及验收见 [冲突解决报告](2026-10-10-git-conflict-resolution.md)。未推送或上线。

日期：2026-10-10。范围：仅本地核查；未推送、未上线、未修改 Vercel 配置。

## 核对基线

- 本地分支：codex/content-seo-git-release-20261010。
- 本地保存提交：982f6ad（已预览的 62 页 SEO 优化）。
- 最新已获取 GitHub main：d8a7000a160374ca3616d7bfc5357a8785defc38。
- 通过 git merge-tree 模拟合并，不修改工作区或 GitHub main。
- 用户已确认处理原则：保留 GitHub 的现场检查、书面报价、照片可选措辞，融合本地 SEO 优化；合并后先供本地预览确认。
- 本次没有完成源码合并；以下是冲突及回归检查结果，不是上线完成报告。

## 结果摘要

共 73 个 Git 冲突文件：60 个 HTML 页面、3 个生成输出（sitemap.xml、llms.txt、news/feed.xml）、10 个源码/配置/历史文档文件。生成输出应在源代码冲突解决后重建，不能机械选择 ours/theirs。

### 需要处理的 10 个非生成文件

| 文件 | 差异与处理原则 |
| --- | --- |
| build.mjs | 双方均修改模板、服务/FAQ/指南文案、内链和机器可读内容。本地还接入 content 模块及后处理。保留现场评估/书面报价/照片可选业务流程，同时保留本地搜索意图、标题层级、FAQ 同步和上下文内链。 |
| case-studies.json | GitHub 5 条，本地 8 条；原 5 条 ID 全保留且每条仍有 4 张附件。保留原始证据与 ID，合并本地新增的 3 个已有项目记录，并由最终页面同步摘要/正文。 |
| site.css | 本地新增视觉系统与服务页面布局。不能用远端旧样式整体替换；需检查模板类名与最终 CSS 对应关系，防止重复和失效覆盖。 |
| package.json | 本地增加预览命令、内容/技术/性能测试及 cheerio、sharp、lightningcss 依赖；GitHub 的测试命令仅运行 static-smoke。最终命令应包含两边适用的测试。 |
| package-lock.json | 依赖集不同，需依据合并后的 package.json 校验锁文件；不可保留不匹配的远端锁文件。 |
| static-smoke.test.mjs | 对标题、服务模板、指南与案例的预期不同。应保留真实业务/SEO 合同，适配合理的新 DOM；不得通过删除断言掩盖回归。 |
| .gitignore | 本地补充 public、node_modules、环境文件、缓存排除。保留安全排除，避免生成目录和秘密文件入库。 |
| .vercelignore | 两边部署排除规则不同。应合并环境文件、内部报告、缓存、日志、补丁、归档等排除规则，并验证必要 content/tools 构建源码仍上传。 |
| docs/superpowers/plans/2026-09-29-service-page-keyword-and-discovery.md | 历史方案存在不同版本，保留记录与来源，不把旧方案静默当作当前实现事实。 |
| docs/superpowers/specs/2026-09-29-service-page-keyword-and-discovery-design.md | 同上，保留历史设计差异；不影响公开站点发布。 |

### 无 Git 文本冲突，但仍需语义复核

- vercel-build.mjs：本地新增响应式图片、样式打包、favicon 优化及 sitemap 发布白名单；远端采用扫描目录复制。应保留白名单与必要 feed/资源，避免把内部目录发布出去。
- local-server.mjs：本地预览从 public 提供内容、只监听 127.0.0.1，并关闭索引、分析及邮件提交。生产处理与本地预览必须继续隔离。
- vercel.json：本地增加 /index.html 永久跳转，需保留域名重定向、查询参数与既有头部规则。
- brand-hero.css、refinement.css、site.js：检查最终层叠、移动端导航和本地新增转化事件不会重复执行。
- content 与 tools：本地后处理可能覆盖 GitHub 已更新文案；仅合并 build.mjs 并不足以保留远端措辞。
- FAQ/页面知识/JSON-LD/订阅：都应从最终可见内容同步，而不是分别拼接两份答案。

## 实际执行的测试

1. 本地 npm test：102 项通过、0 失败（本轮重新执行）。
2. 读取 GitHub 上的 3 个独有测试文件，在当前本地构建上独立执行，没有写入工作区：
   - conversion-language.test.mjs：2 项，0 通过、2 未通过。
   - deep-conversion-language.test.mjs：8 项，0 通过、8 未通过。
   - stage3-content.test.mjs：4 项，0 通过、4 未通过。
3. 上述 14 项未通过不等于 14 个独立线上故障。有的检查旧 DOM/固定文案，必须按新版结构适配；有的揭示远端业务内容尚未保留，必须真正修复。不能只凭本地 102 项绿灯认定整合完成。

### 测试暴露的具体差异

- repair-options 等页面的现场评估、报价表述，与 GitHub 合同不一致。
- contact 页面应明确照片可选、通过现有邮件发送，不承诺上传能力。
- 部分页面/元描述仍有偏阅读导览或准备对话的旧措辞。
- 服务 FAQ 的组件解释和最终可见答案/结构化数据需要统一检查。
- 四篇实用指南的独特开头及结构已改变，旧提取规则也存在不适配，须分别检查内容与测试。
- gutter-warning-signs 指南缺少 GitHub 版本中部分“清理或维修、清理后再次溢流”的决策内容/标题预期。
- gutter-warning-signs 到 drainage-after-rain 的链接不满足远端合同。
- 两份指南的安全提示与旧版精确措辞不同；应保留明确的不上屋顶/不冒险自行检查边界，再更新合理测试。

## 后续验收门槛

- 完成源码/内容的实质整合，再生成全部 62 页及 feed/schema。
- 保留并适配 GitHub 3 个独有测试文件，纳入最终验证；禁止只执行本地原测试集。
- 核对案例证据、营业时间（七天 09:00–21:00）、集团注册信息、Perth 办公地址及社媒链接。
- 复测全部路由、标题层级、FAQ 一致性、内链、移动端、预览隔离和构建产物。
- 先提供本地 4175 预览。用户确认前不推送生产 main，不 promote CLI 构建。

## 全部 Git 冲突文件

- .gitignore
- .vercelignore
- about/index.html
- areas/bayswater-roof-repairs/index.html
- areas/city-beach-roof-repairs/index.html
- areas/claremont-roof-repairs/index.html
- areas/cottesloe-roof-repairs/index.html
- areas/fremantle-roof-repairs/index.html
- areas/hillarys-roof-repairs/index.html
- areas/joondalup-roof-repairs/index.html
- areas/kalamunda-roof-repairs/index.html
- areas/leederville-roof-repairs/index.html
- areas/mosman-park-roof-repairs/index.html
- areas/nedlands-roof-repairs/index.html
- areas/perth-roof-repairs/index.html
- areas/rockingham-roof-repairs/index.html
- areas/scarborough-roof-repairs/index.html
- areas/subiaco-roof-repairs/index.html
- areas/victoria-park-roof-repairs/index.html
- build.mjs
- case-studies.json
- contact/index.html
- docs/superpowers/plans/2026-09-29-service-page-keyword-and-discovery.md
- docs/superpowers/specs/2026-09-29-service-page-keyword-and-discovery-design.md
- downpipe-repairs/index.html
- faq/index.html
- flashing-repairs/index.html
- gallery/index.html
- gutter-repairs/index.html
- gutters-downpipes/index.html
- index.html
- legal/index.html
- llms.txt
- metal-roof-repairs/index.html
- news/drainage-after-rain/index.html
- news/feed.xml
- news/gutter-warning-signs/index.html
- news/index.html
- news/metal-roof-repairs-perth-guide/index.html
- news/metal-roofing-perth/index.html
- news/ridge-capping-repairs-perth-guide/index.html
- news/roof-flashing-explained/index.html
- news/roof-inspection-perth-guide/index.html
- news/roof-leak-detection-perth/index.html
- news/roof-leak-inspection/index.html
- news/roof-maintenance-basics/index.html
- news/roof-valleys-flashing-repairs-perth/index.html
- news/tile-roof-repairs-perth-guide/index.html
- package-lock.json
- package.json
- privacy/index.html
- projects/metal-roof-fastener-repair-sequence/index.html
- projects/metal-roof-hip-ridge-capping-repair-perth/index.html
- projects/metal-roof-ridge-capping-repair-perth/index.html
- projects/metal-roof-ridge-flashing-repair-perth/index.html
- projects/roleystone-metal-roof-fastener-leak-repair/index.html
- projects/tile-roof-chimney-flashing-repair-perth/index.html
- projects/tile-roof-valley-chimney-flashing-repairs-perth/index.html
- projects/wa-6121-tile-roof-valley-gutter-cleaning/index.html
- repair-options/index.html
- ridge-capping-repointing/index.html
- roof-inspection/index.html
- roof-leak-repairs/index.html
- roof-maintenance/index.html
- roof-repairs/index.html
- roof-restoration/index.html
- service-areas/index.html
- services/index.html
- site.css
- sitemap.xml
- static-smoke.test.mjs
- storm-damage-roof-repairs/index.html
- tile-roof-repairs/index.html
