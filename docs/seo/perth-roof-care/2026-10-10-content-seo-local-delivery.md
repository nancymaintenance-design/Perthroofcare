# Perth Roof Care｜全站内容 SEO 本地优化交付

日期：2026-10-10。状态：本地验收版，未部署、未推送代码，线上仍为上一版本。

## 预览与验收入口

- 首页：http://127.0.0.1:4175/
- 漏水维修：http://127.0.0.1:4175/roof-leak-repairs/
- 检查费用与范围：http://127.0.0.1:4175/roof-inspection/
- 知识文章目录：http://127.0.0.1:4175/news/roof-leak-detection-perth/
- FAQ：http://127.0.0.1:4175/faq/

端口复用现有4175预览进程。预览仅绑定回环地址、返回 noindex/nofollow、抑制分析脚本、不发送询盘邮件。等业务方确认后才能进行新的生产部署。

## 本轮实际完成

| 页面类别 | 数量 | 内容调整 |
| --- | ---: | --- |
| 服务及维修决策页 | 16 | 每页增加独立的选择问题、范围边界、准备信息和相关知识/询盘链接；FAQ标题改为具体服务主题 |
| 已有地区页 | 16 | 按材料、交界、通行、既有修补或排水线索补充差异化内容；不新增地点、地址或虚构当地工程 |
| 知识文章 | 12 | 增加可跳转目录、预约前判断说明、对应服务入口；署名链接到公司介绍 |
| 已有项目案例 | 8 | 保留原照片/叙事和地点边界；补充相似工作询盘的准备信息和对应服务入口 |
| 首页、目录、公司、联系与政策页 | 10 | 首页解释先判断问题再选择范围；目录引导不同意图；公司强调证据类型；联系页补充预约前确认项；政策页只补理解与联系路径 |

保留英文直接、克制的服务语气，以及现有品牌颜色、页面路径和图片。没有按关键词单复数、词序或地名批量造页。

### 搜索意图与内容重点

首页承担品牌与综合维修发现，/roof-repairs/ 解释局部维修与报价范围；漏水页聚焦水进入路径及复漏；材料页说明可保留与需更换的组件；检查页区分检查费用、维修报价、记录形式和专项报告；维修选择页区分局部维修、翻新和整体更换评估。

新增内容回答：太阳能安装后发现漏水不等于已证明安装造成故障；天窗本体与周围泛水不同；无降雨潮湿也可能需要其他工种；喷漆不替代缺陷维修；报价和保修条款需针对实际范围确认。急修说明保留可约时间、安全与天气限制，没有新增24/7、免费检查或当天必到承诺。

### 标题、FAQ与信息同步

- 62页保留一个H1，H1–H3顺序检查通过，没有跳级。
- 服务页保留原有3个折叠FAQ，新增决策问题作为H3开放显示，避免堆积重复折叠项。
- FAQ汇总页从30题增至36题，补充费用、太阳能、干天潮湿、天窗、保修确认、箱式/内部天沟范围。
- FAQPage及page-knowledge由最终可见的折叠问题生成，答案、实体编码和链接一致。
- 12篇文章目录均指向真实且唯一的标题ID，相关服务链接可抓取。
- 知识文章JSON/RSS正文继续同步；项目核心叙事及原有记录日期未被新CTA改写为新的施工日期。
- 修正跨页指向Roleystone案例的拼写，不改变URL。
- 隐私/法律页只是增加理解与联系路径，未把导航性更新标成新的实质性政策修改日期。

## 172条候选词承接表

见同目录 [2026-10-10-content-keyword-map.md](2026-10-10-content-keyword-map.md)。逐条保留编号，并映射到实际URL或标记为未发布专项服务。来源为用户提供的词表，不是实际搜索量或排名数据。

箱式天沟、全天候服务、整体重铺、平屋面及石棉更换等未确认范围没有被发布成新服务承诺。报告、保险资料、strata授权和检查费用以预约前确认表达，不捏造金额、许可、报告能力或理赔结果。

## 内容质量与E-E-A-T编辑评估

以下是按照seo-content维度做的人工编辑判断，不是Google评分、排名预测、已验证AI引用效果，也没有伪造前后分数提升。

内容质量：84/100（意图与答复22/25、结构与可扫描性22/25、实用决策信息20/25、内链和下一步20/25）。

| E-E-A-T维度 | 编辑评分 | 现有证据与限制 |
| --- | ---: | --- |
| Experience | 20/25 | 保留现场照片及独立项目叙事；不把其他案例写成某地区工程 |
| Expertise | 17/25 | 解释组件、检查和工序区别；没有新增未经验证的个人资质或审阅者 |
| Authoritativeness | 10/25 | 存在公司登记及官方/厂家参考路径；未独立测量外链、媒体认可或口碑，不假称权威认证 |
| Trustworthiness | 22/25 | 清楚说明集团运营、真实Perth办公室、联系方式、营业时段与范围限制；具体合同条款需个案确认 |

E-E-A-T合计：69/100。AI引用准备度：82/100（结构23/25、直接回答21/25、实体/署名22/25、可验证证据16/25）；这只是内容可理解、可摘取的编辑评估，不保证任何AI平台引用。

本轮没有使用关键词密度或字数硬凑内容。地区页及部分指南仍低于技能中的参考字数，保留真实信息边界；扩写需要新的实际工艺、项目或业务证据，而不是添加通用文字。

## 验证结果

- npm test：102项通过，0失败；包括构建与新增内容回归测试。
- 本地62条站点地图URL：全部HTTP200、保留预览noindex保护、新内容可见。
- 本地询盘接口GET返回503；预览安全回归测试验证POST也不发送邮件。
- 现有全站可达性、资源、单一业务实体、集团关系、社媒、营业时间及动态FAQ回归均通过。
- 浏览器1280px桌面检查：文章目录链接可跳转、阅读列无横向溢出。
- 浏览器390px手机检查：新增费用FAQ可展开，答案与相关检查服务入口可见，无横向溢出。临时视口已恢复。
- 没有实际发送客户询盘，没有修改GSC/GA4/GBP，没有进行本轮部署。

## 后续边界

等待你确认本地文案及页面。若今后要发布固定价格、完整报告、具体保修期限、个人资质或额外专项服务，需要相应真实资料；这不阻止当前采用范围确认式文案的本地版本验收。

本轮不声称自然排名、收录数量、点击率或AI引用已经改善。上线后的效果需要在得到部署授权后，再结合真实搜索表现评估。

## 全站页面清单

字数为主内容文本的近似空白分词结果，用于规模参考，不是排名指标。FAQ数仅计折叠问答，开放显示的H3问题不计入；目录数为文章锚链接。

| URL | 主内容约词数 | 折叠FAQ | 文章目录项 |
| --- | ---: | ---: | ---: |
| `/` | 506 | 0 | 0 |
| `/services/` | 520 | 0 | 0 |
| `/roof-repairs/` | 905 | 3 | 0 |
| `/roof-leak-repairs/` | 1136 | 3 | 0 |
| `/tile-roof-repairs/` | 885 | 3 | 0 |
| `/metal-roof-repairs/` | 906 | 3 | 0 |
| `/ridge-capping-repointing/` | 700 | 3 | 0 |
| `/flashing-repairs/` | 888 | 3 | 0 |
| `/gutter-repairs/` | 670 | 3 | 0 |
| `/gutters-downpipes/` | 633 | 3 | 0 |
| `/downpipe-repairs/` | 580 | 3 | 0 |
| `/roof-maintenance/` | 649 | 3 | 0 |
| `/roof-cleaning-painting/` | 615 | 3 | 0 |
| `/commercial-roof-repairs/` | 576 | 3 | 0 |
| `/storm-damage-roof-repairs/` | 699 | 3 | 0 |
| `/roof-restoration/` | 500 | 3 | 0 |
| `/roof-inspection/` | 659 | 3 | 0 |
| `/repair-options/` | 423 | 3 | 0 |
| `/service-areas/` | 716 | 0 | 0 |
| `/gallery/` | 489 | 0 | 0 |
| `/faq/` | 1483 | 36 | 0 |
| `/news/` | 954 | 0 | 0 |
| `/news/metal-roofing-perth/` | 930 | 3 | 8 |
| `/news/gutter-warning-signs/` | 857 | 3 | 8 |
| `/news/roof-leak-inspection/` | 918 | 3 | 8 |
| `/news/roof-maintenance-basics/` | 807 | 3 | 8 |
| `/news/roof-flashing-explained/` | 630 | 0 | 7 |
| `/news/drainage-after-rain/` | 843 | 3 | 8 |
| `/projects/roleystone-metal-roof-fastener-leak-repair/` | 676 | 0 | 0 |
| `/projects/metal-roof-fastener-repair-sequence/` | 593 | 0 | 0 |
| `/projects/wa-6121-tile-roof-valley-gutter-cleaning/` | 665 | 0 | 0 |
| `/about/` | 1226 | 6 | 0 |
| `/contact/` | 193 | 0 | 0 |
| `/privacy/` | 217 | 0 | 0 |
| `/legal/` | 256 | 0 | 0 |
| `/areas/cottesloe-roof-repairs/` | 365 | 0 | 0 |
| `/areas/mosman-park-roof-repairs/` | 388 | 0 | 0 |
| `/areas/city-beach-roof-repairs/` | 379 | 0 | 0 |
| `/areas/scarborough-roof-repairs/` | 358 | 0 | 0 |
| `/areas/claremont-roof-repairs/` | 369 | 0 | 0 |
| `/areas/nedlands-roof-repairs/` | 361 | 0 | 0 |
| `/areas/subiaco-roof-repairs/` | 361 | 0 | 0 |
| `/areas/perth-roof-repairs/` | 455 | 0 | 0 |
| `/areas/leederville-roof-repairs/` | 448 | 0 | 0 |
| `/areas/joondalup-roof-repairs/` | 455 | 0 | 0 |
| `/areas/hillarys-roof-repairs/` | 367 | 0 | 0 |
| `/areas/fremantle-roof-repairs/` | 458 | 0 | 0 |
| `/areas/rockingham-roof-repairs/` | 353 | 0 | 0 |
| `/areas/kalamunda-roof-repairs/` | 373 | 0 | 0 |
| `/areas/victoria-park-roof-repairs/` | 376 | 0 | 0 |
| `/areas/bayswater-roof-repairs/` | 461 | 0 | 0 |
| `/news/roof-leak-detection-perth/` | 889 | 2 | 9 |
| `/news/tile-roof-repairs-perth-guide/` | 663 | 2 | 7 |
| `/news/metal-roof-repairs-perth-guide/` | 694 | 2 | 7 |
| `/news/ridge-capping-repairs-perth-guide/` | 693 | 2 | 7 |
| `/news/roof-valleys-flashing-repairs-perth/` | 675 | 2 | 7 |
| `/news/roof-inspection-perth-guide/` | 629 | 2 | 7 |
| `/projects/metal-roof-ridge-capping-repair-perth/` | 620 | 0 | 0 |
| `/projects/tile-roof-chimney-flashing-repair-perth/` | 630 | 0 | 0 |
| `/projects/metal-roof-hip-ridge-capping-repair-perth/` | 623 | 0 | 0 |
| `/projects/tile-roof-valley-chimney-flashing-repairs-perth/` | 627 | 0 | 0 |
| `/projects/metal-roof-ridge-flashing-repair-perth/` | 592 | 0 | 0 |

