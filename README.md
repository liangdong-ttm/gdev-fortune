# gDEV日签

独立游戏开发者的每日老黄历。做玩法、写代码、画素材、发 Demo，开工前看一眼。

**公开预览：** https://liangdong-ttm.github.io/gdev-fortune/

## 功能

- 保留程序员老黄历的窄栏、黄红宜忌分区和每日趣味提示；直接从日期开始，底部仅保留娱乐提示。
- 48 个独游、二次元和游戏逻辑事项，每项都有宜、不宜两份无厘头解释。
- 每天宜、不宜各 2–4 项，不重复；座位朝向、两种饮品和灵感五星指数。
- 使用访问者本地日期生成固定结果，同一天刷新不变；周末使用周末内容池。
- 日期彩蛋每天最多一条，替换普通事项，不增加数量；纪念日优先于星期四。
- 页面跨午夜自动更新，休眠后重新回到页面也会检查日期。
- 无运行时依赖、无账号、无服务端、无数据采集。仅供娱乐。

## 本地运行

需要 Python 3 启动静态服务器；Node.js 22 或更高版本用于运行测试。

运行 npm start 后打开 http://localhost:4173；运行 npm test 执行测试。

也可使用任意静态服务器托管 public/。请通过 HTTP 访问，不要直接双击 HTML，页面使用 ES modules。

## 内容维护与发布

### 内嵌到其他网站

打开本站的 embed.html，选择主题及透明背景，复制生成的 iframe 代码。
生成器始终输出正式 GitHub Pages 地址；本地预览时须先发布代码，参数才能在正式站点生效。

示例（默认暗黑地牢）：

```html
<iframe
  src="https://liangdong-ttm.github.io/gdev-fortune/?embed=1&amp;theme=dungeon"
  title="gDEV日签 · 独立游戏开发者老黄历"
  width="380" height="820"
  style="display:block;width:100%;max-width:380px;border:0"
  loading="lazy"
  referrerpolicy="no-referrer"
></iframe>
```

| 参数 | 含义 |
| --- | --- |
| theme | classic、island、farm、dungeon、cyber、pixel、wasteland、steampunk；缺省或未知值使用暗黑地牢，经典版需显式传 classic |
| embed=1 | 内嵌模式：适应 iframe 宽度、减少外围空白，底部仅保留娱乐提示 |
| transparent=1 | 仅配合 embed=1 使用；外围背景透明，卡片本身保持主题配色 |

- iframe 的宽高由宿主页面设置，不接受任意 CSS/HTML 参数；建议宽度不小于 280px。
- 内容每天不同，固定高度不足时保留框内滚动，不会截断；可自行增大 height。
- 无自动高度通信或外部 SDK。无需为普通 iframe 嵌入设置 CORS。
- 宿主须支持 iframe；普通 GitHub README 不支持此交互嵌入。
- 宿主有 CSP 时需允许 frame-src https://liangdong-ttm.github.io；添加 sandbox 时至少允许
  allow-scripts allow-same-origin。
- 日期以访问者本地时区为准，主题和内嵌参数不改变当日内容。

### 样式与内容

样式对比页：styles.html。默认首页使用暗黑地牢，经典老黄历通过 ?theme=classic 选择；通过 ?theme=island、farm、dungeon、cyber、pixel、wasteland、steampunk
分别预览岛屿生活（动森氛围启发）、温暖农场、暗黑地牢、赛博、像素、废土与蒸汽朋克。
全部为原创界面，未使用游戏官方角色、标志或素材。主题仅改变外观，不影响每日内容。
星愿风格已移除，旧 ?theme=anime 链接回到默认暗黑地牢。
经典版说明文字使用 12px 字号，允许自然换行，不截断文案。主题不加载外部字体或图片。

修改 public/activities.js 中的事项、宜忌解释及周末标记；变更内容库会改变日期对应的抽取结果。
public/specials.js 维护日期彩蛋：星期四（四组文案逐周轮换）、3 月 9 日初音日、3 月 10 日马力欧日、
4 月 1 日愚人节、10 月 31 日万圣节。周末纪念日允许一条彩蛋，其余事项仍从周末池抽取。
public/fortune.js 负责日期与抽取，public/app.js 负责显示，public/style.css 负责样式。

推送到 main 后，GitHub Actions 运行测试并将 public/ 发布到 GitHub Pages。
仓库 Settings → Pages 的发布来源使用 GitHub Actions。

## 致谢

外观与功能参考 [程序员老黄历](https://raoshaoquan.github.io/)。本站实现和独游文案重新编写，未直接复制其源码。
