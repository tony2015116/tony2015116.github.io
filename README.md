# 我的个人主页

基于 [AcademicPages](https://github.com/academicpages/academicpages.github.io) 模板改造的中文学术个人主页。

## 一、首次上线（只需做一次）

1. 在 GitHub 新建一个**公开**仓库，名字必须是 `你的用户名.github.io`。
2. 把本文件夹的全部内容上传到该仓库（RStudio 方法见第三节）。
3. 打开仓库 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**。
   （本站使用 `.github/workflows/jekyll.yml` 自动构建，`main` 或 `master` 分支推送都会触发。）
4. 等 1–3 分钟，在仓库的 **Actions** 页看到绿色对勾后，访问 `https://你的用户名.github.io` 即可。

## 二、需要修改的地方（搜索 `TODO` 可以全部找到）

| 文件 | 改什么 |
| --- | --- |
| `_config.yml` | 网站标题、姓名、网址 `url`、单位、邮箱、各种主页链接、`highlight_authors`（论文中要加粗的你的名字）、主题配色 `site_theme` |
| `images/profile.png` | 换成你的头像（正方形，建议 400×400 以上，同名覆盖即可） |
| `_pages/about.md` | 首页：自我介绍、研究兴趣 |
| `_data/experience.yml` | 首页的教育经历、研究/实习经历 |
| `_data/navigation.yml` | 顶部导航栏；不需要的栏目删掉对应几行即可 |

> 修改 `_config.yml` 后，本地预览需要重启；推送到 GitHub 则会自动生效。

## 三、日常更新（RStudio）

**首次关联仓库：** RStudio → File → New Project → Version Control → Git，填入仓库地址
`https://github.com/你的用户名/你的用户名.github.io.git`，克隆到本地后，把本文件夹内容复制进去。

**以后每次更新：**

1. 在 RStudio 里编辑文件并保存；
2. 右上角 **Git** 面板 → 勾选改动的文件 → **Commit** → 写一句说明 → **Push**；
3. 等 1–3 分钟网站自动更新。

也可以在 RStudio 的 Terminal 里执行：

```bash
git add .
git commit -m "更新论文列表"
git push
```

## 四、怎么添加内容

所有内容都是 Markdown 文件，**复制一份示例改一改**最省事。文件名格式：`年-月-日-英文短名.md`。

| 内容 | 文件夹 | 示例文件 |
| --- | --- | --- |
| 研究成果（论文、专利、软著、著作） | `_publications/` | `2026-09-01-sample-paper-2.md`（字段说明都写在里面） |
| GitHub 项目 | `_data/projects.yml` | 文件里有字段说明；分类和项目都按文件中的顺序显示 |
| PDF 等文件 | `files/` | 链接写成 `/files/文件名.pdf` |
| 图片 | `images/` | 链接写成 `/images/图片名.png` |

**研究成果的字段：**

- `category`：`manuscripts` 期刊论文 / `patents` 专利 / `software` 软件著作权 / `books` 著作。分类名称和顺序可以在 `_config.yml` 的 `publication_category` 里改，也可以照样子新增分类。
- `authors`：作者、发明人或著作权人，你的名字会自动加粗
- `venue`：期刊名、出版社，或"中国发明专利"等
- `number`：可选，卷期页码、专利号、登记号、ISBN
- `paperurl` / `codeurl` / `doi`：可选，有就会显示对应的文字链接

列表中每一项的格式是：作者. 标题. 刊物, 编号, 年份.

上线前请删除或替换掉所有 `sample` 示例文件。

## 五、本站相对原模板的改动

- 全站中文界面（`locale: zh-CN`），修正了模板自带中文翻译中的错误
- 中文字体与排版优化（苹方 / 微软雅黑 / 思源黑体），安静的墨色配色，适合长文阅读
- 新首页：以文字为主的朴素风格，包括自我介绍、研究兴趣、经历、联系方式
- 研究成果页：按分类切换显示（期刊论文、专利、软件著作权、著作），每项左侧年份、右侧标题与作者；去掉了学术报告和教学页面
- 项目页：GitHub 项目按分类切换显示，在 `_data/projects.yml` 中维护
- 整体字号偏小（手机 14px，电脑 15px）
- 成果列表中自动加粗本人姓名
- 去掉了简历页和博客页
- 侧边栏新增 中国知网、哔哩哔哩、微信公众号；知乎、微博显示中文
- 国内访问优化：jQuery、Academicons 图标改为本地加载；MathJax 仅在需要的页面加载并优先使用国内镜像；关闭海外社交分享按钮
- 可选百度统计（在 `_config.yml` 填 `baidu_analytics`）
- 自定义样式集中在 `_sass/_custom.scss`，方便以后同步上游模板更新
- 删除了模板示例内容和仅对模板仓库有用的工作流

## 六、本地预览（可选）

需要安装 Ruby，然后在项目目录执行：

```bash
bundle install
bundle exec jekyll serve -l -H localhost
```

浏览器打开 http://localhost:4000 。不做本地预览也完全没问题，直接推送到 GitHub 即可。
