# gDEV日签

独立游戏开发者的每日老黄历。做玩法、写代码、画素材、发 Demo，开工前看一眼。

**公开预览：** https://liangdong-ttm.github.io/gdev-fortune/

## 功能

- 保留程序员老黄历的窄栏、黄红宜忌分区和每日趣味提示。
- 60 个独游开发场景，每个场景都有宜、不宜两份原创解释。
- 每天宜、不宜各 2–4 项，不重复；座位朝向、两种饮品和灵感五星指数。
- 使用访问者本地日期生成固定结果，同一天刷新不变；周末使用周末内容池。
- 页面跨午夜自动更新，休眠后重新回到页面也会检查日期。
- 无运行时依赖、无账号、无服务端、无数据采集。仅供娱乐。

## 本地运行

需要 Python 3 启动静态服务器；Node.js 22 或更高版本用于运行测试。

运行 npm start 后打开 http://localhost:4173；运行 npm test 执行测试。

也可使用任意静态服务器托管 public/。请通过 HTTP 访问，不要直接双击 HTML，页面使用 ES modules。

## 内容维护与发布

修改 public/activities.js 中的事项、宜忌解释及周末标记；变更内容库会改变日期对应的抽取结果。
public/fortune.js 负责日期与抽取，public/app.js 负责显示，public/style.css 负责样式。

推送到 main 后，GitHub Actions 运行测试并将 public/ 发布到 GitHub Pages。
仓库 Settings → Pages 的发布来源使用 GitHub Actions。

## 致谢

外观与功能参考 [程序员老黄历](https://raoshaoquan.github.io/)。本站实现和独游文案重新编写，未直接复制其源码。
