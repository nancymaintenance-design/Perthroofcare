# 本地后台操作约定

用户于2026-10-17确认复用现有后台：选页、编辑中文、保存磁盘草稿、桌面/手机预览和恢复历史，修改后由助手同步英文；不自动发布。此处仅记录界面后果，不改变网站运营条款。

## Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | editor/ui/client.mjs + native select | 用户批准复用 Perth Pipe Power 后台 | 平台弹出菜单 | 浏览器键盘选择 |
| Form | editor/ui/client.mjs | 原后台保存/冲突流程 | 中文草稿 | local-editor.test.mjs |
| Scrollbar | editor/ui/field-design.css | 复用后台运行时令牌 | 面板滚动 | 浏览器窄屏检查 |
| Toast | client.mjs message + #status live region | 原后台统一反馈 | 保存/错误 | 浏览器保存 |
| CRUD | tools/editor/server.mjs + store.mjs | 用户批准本地草稿和恢复历史 | 不提供删除/发布 | local-editor.test.mjs |

## 状态与边界

保存成功留在本页；未保存切页使用现有dialog，失败保留输入。搜索使用本地69页清单，IME结束后筛选，支持清除；当前页URL保留page参数，搜索词不持久化（短时操作，不对外共享）。文本框/按钮和预览延用同一后台布局，不引入新设计系统。恢复明确提示修订并创建新修订，原记录保留最近20条。英文预览只读，不自动翻译、不显示未审核英文提案。

只监听127.0.0.1，检查Host/Origin和本机会话token；token不写URL和磁盘。预览禁止咨询和外部脚本。固定联系方式、注册事实、原始评价和全站导航页尾不开放修改。编辑权限不是公网身份认证；同机可信进程可访问后台。无图片上传、新页面、拖拽重排或在线发布。
