# Git 冲突解决与本地验收

日期：2026-10-10。

## 状态

73 个 Git 冲突文件已在本地解决，使用合并提交保留双方历史。分支：codex/content-seo-git-release-20261010。整合基线：本地 982f6ad 与 GitHub main d8a7000a160374ca3616d7bfc5357a8785defc38。

本轮未推送 GitHub、未发布 Vercel、未切换域名，未修改环境变量或权限。预览：http://127.0.0.1:4175/。

## 根因与发布约束

直接通过 Vercel CLI 从本地发布不会把源码自动提交回 GitHub。这会让线上内容超前于 GitHub，后续 Git 自动构建可能重新发布 main 中的旧内容。

但 Git 文本冲突并非 Vercel 产生：本地旧分支和 GitHub main 分别修改了同一模板、文案和生成文件，且未及时合并。因此本次既要消除版本脱节，也要实质整合两边内容。之后应在确认预览后，将测试过的源码按正常 Git 流程合入生产 main，由 Vercel Git 集成发布并核对提交 SHA；不再以未同步源码的 CLI 构建作为正式发布来源。

## 保留与修复

- 保留 GitHub 的现场评估、书面报价、照片可选措辞及 3 个独有测试文件。
- 保留本地 62 页内容优化、2 个新增服务入口、8 条案例、FAQ/结构化数据同步、内链和性能优化。
- 原有 5 条案例 ID 与各 4 张附件保留；新增 3 条已有项目记录仍在订阅中。
- 解决构建模板、样式、package/lockfile、Git/Vercel 排除规则、历史方案文档冲突；生成页面、sitemap 和 feeds 从整合后的源码重建。
- 修复地区页 enquiry 锚点与 textarea 的重复 ID，保持表单 label 指向唯一控件。
- 恢复 gutter 溢流“清理、局部修理、反复溢流”决策模块及 drainage-after-rain 内链；调整到新文章容器。
- 修复新标题到面包屑、Article、WebPage 和 JSON/RSS feed 的同步，以及 HTML 实体解码差异。
- FAQ 补充明确的组件解释、安全和照片可选边界；不新增免费、24 小时、质保、保险或执照承诺。
- 旧测试仅对不再成立的结构提取方式、固定旧开头和 5 条案例总数进行适配；保留业务、安全和数据一致性断言。
- 历史方案冲突保留双方版本，不删除用户的内部报告和未跟踪文件。

## 验收证据

- npm test：119 项通过，0 失败，包含全部 13 个根目录测试文件。
- 包含 GitHub 原有 14 项检查及新增 gutter 面包屑同步检查。
- npm install --package-lock-only --ignore-scripts：完成；审计 31 个包，0 vulnerabilities（仅代表本次 npm 审计结果）。
- 本地 HTTP 检查 62 个页面：全部 200、单一 H1、noindex 预览头、无 Google Analytics 标签。
- 本地 API enquiry GET 返回 503，预览不发送邮件；未发送任何实际询盘。
- 浏览器刷新首页，确认 CTA 为 Request a roof assessment；保留预览页。
- 浏览器 390px 手机视口检查 gutter 指南：文档宽度 380px，小于视口，未见横向溢出；完成后恢复默认视口。
- 本地截图：C:/Users/UFTR/Documents/ChatGPT/Ellis Services Group 2/Perth-SEO-audit-20261010/merged-content-preview.jpg。

## 下一步

用户确认当前本地预览后，才把整合源码发布到 GitHub 生产 main 并等待 Vercel 自动构建。发布后核对 Git commit SHA、域名指向、62 个页面与生产表单配置；不把本地预览的 503/noindex 带到生产。
