# 全站UI修复视觉验收 — 2026-10-21

最新对齐反馈已修复：目录从第一节正文上移到整篇文章开头齐平。最终截图aligned-top-desktop.png，1440×900 CSS；中英目录与正文开头容器top均125.594px。滚动后仍为77px吸附，1024px为120.266px，手机保持原顺序及static。详见reports/2026-10-21-site-ui-review/目录顶部对齐补充.md。字体、色彩、原图和文案保持；最终340测试通过，无控制台警告或错误。此前“初始位置不变”的记录是上一轮状态，现以最新对齐反馈为准。

本轮追加：用户要求指南目录滚至网页上端后跟随。已将固定136px改为实际页头高度：1440px中英页77px，1024px约120.266px，均实测目录顶部贴合页头下缘；手机仍为static。初始与滚动状态证据见reports/2026-10-21-site-ui-review/sticky-natural-before-scroll.png和sticky-follow-desktop.png，量测见sticky-follow-checks.json。相对于上一轮已选版式，仅吸附起点和章节避让更新，字体、网格、颜色、图片与内容保持。已打开合并对照sticky-layout-comparison.png：同一1440×900 CSS初始状态，前后均为1425×889像素采集，等比缩为720×450并排；标题换行、照片、目录和正文起点一致。滚动后截图与77px/约120px实测补足行为复核。最终340测试通过，无控制台警告/错误；追加结果passed。

Source visual truth：本轮before-*截图及用户已确认的FAQ左目录/右正文语言；范围为已确认问题的受控修复，非品牌重设计。
Implementation：../reports/2026-10-21-site-ui-review/after-*、after-top-*。
Full comparison：comparison-guide-desktop.png、comparison-news-mobile.png、comparison-areas-mobile.png、comparison-service-mobile.png，均在同一张图内左旧右新。

Viewport：主要1440×900、390×900 CSS px；桌面浏览器截图1425px有效宽，手机375px有效宽（捕获排除滚动条，保持原比例）。比较使用相同CSS尺寸和相同页面顶部状态，无密度差异拉伸。额外320/768/1024px，共24种代表状态。

## Findings and history

- P1已修复：46页手机正文相关导航原被隐藏。所属页面层显示规则恢复，并实点进入对应服务。
- P2已修复：长指南目录占整块正文宽度，照片容器空白较多。桌面旁置目录，竖版原图与首段并排；手机目录限制高度、有滚动条，图片恢复独立自然宽度；原图等比完整展示，正文更早出现。
- P2已修复：News卡片标题大间距及单卡分组留空。四分类捷径、紧凑卡片与单卡满行，完整指南内容保留。
- P2已修复：地区组固定最小高度造成空白，改为自然高度。
- P2已修复：平板FAQ/指南侧栏顶部位于固定页头下方。768px页头77→侧栏96；1024px页头约120→侧栏136。证据sticky-recheck.json。

## Required fidelity surfaces

- Typography：沿用Arial及中文系统回退；原H1不改，目录/卡片字号保持层级与阅读行距；未截断业务文本。
- Spacing/layout：目录和正文利用现有内容区域；减少固定空高和标题48px空隙；服务触控目标最小44px。手机单列，目录可独立滚动。
- Colors/tokens：现有白/炭黑/琥珀/深赭及中性底，未引入新调色板或夸张装饰。
- Assets：原照片、logo、图标保持，图片按自然比例显示，懒加载和响应式构建沿用。
- Copy/content：138页保护快照通过，除新增分类锚点和布局容器外的HTML一致，包含所有客户评价、FAQ与schema。

## Interaction and validation

手机分类、指南尾项、恢复的服务入口实点成功；标题落点在页头以下。桌面目录在长阅读区域随滚动定位，阅读末端受父内容边界约束。浏览器检查无控制台错误/警告。最终完整复跑340测试通过；276组逐页复验无横向溢出和隐藏正文导航；额外24组断点检查及3组侧栏间距复验通过。最终指南截图确认目录、正文和原图在1440px首屏内形成连续阅读顺序。

Focused comparison：comparison-news-mobile.png可辨识文字、卡片与导航间距；comparison-service-mobile.png核对恢复的正文入口；宽屏指南对照用于布局和图片比例。交付报告记录了首屏/代表模板人工检查与完整辅助技术验收之间的边界。

Implementation checklist：已确认缺陷修复、同屏宽视觉比较、交互、双语、回归测试和报告均完成。无待处理P0/P1/P2；未部署。

final result: passed
