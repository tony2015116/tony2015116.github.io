# 郭猛的个人主页

[访问主页](https://mguo.dpdns.org/) · [研究成果](https://mguo.dpdns.org/publications/) · [项目](https://mguo.dpdns.org/portfolio/) · [简历](https://mguo.dpdns.org/cv/)

这是基于 [AcademicPages](https://github.com/academicpages/academicpages.github.io) 和 Jekyll 搭建的中文学术主页，用于展示猪遗传育种研究成果、开源工具和个人简历。网站通过 GitHub Actions 构建并部署到 GitHub Pages。

## 一、常用修改入口

| 想改什么 | 到哪里改 |
| --- | --- |
| 首页自我介绍、研究兴趣 | [`_pages/about.md`](_pages/about.md) |
| 首页工作经历、教育经历 | [`_data/experience.yml`](_data/experience.yml) |
| 新增论文、专利、软著或著作 | [`_publications/`](_publications/) |
| 上传论文 PDF | [`files/publications/`](files/publications/)，并在对应论文条目填写 `pdfurl` |
| 新增 R 包、软件、小工具、教程或速查表 | [`_data/projects.yml`](_data/projects.yml) |
| 修改简历文字、教育背景、联系方式 | [`_data/cv.yml`](_data/cv.yml) |
| 修改侧栏个人信息、中国知网链接、主题或作者加粗名单 | [`_config.yml`](_config.yml) |
| 换头像、调整顶部导航 | [`images/profile.png`](images/profile.png)、[`_data/navigation.yml`](_data/navigation.yml) |

### 常改的站点设置

- **网站信息**在 `_config.yml` 中维护 `title`、`name`、`description` 和 `url`。侧栏头像、单位、邮箱和知网等链接在同一文件的 `author` 下。
- **更换头像**时可用同名的正方形 PNG 覆盖 `images/profile.png`。如果改了文件名，同时更新 `author.avatar`。
- **调整导航**时编辑 `_data/navigation.yml` 中的 `main` 列表。修改 `title` 可改菜单文字，调整条目顺序可改显示顺序。要隐藏某个入口，可以移除该条导航。
- **更换主题**时修改 `site_theme`。可选 `default`、`air`、`sunrise`、`mint`、`dirt` 和 `contrast`。

## 二、添加论文和 PDF

1. 复制一份[现有论文条目](_publications/2025-09-01-duroc-feed-efficiency-gs.md)，按 `YYYY-MM-DD-英文短名.md` 命名。保留开头和结尾的 `---`。
2. 将 `collection` 设为 `publications`，将 `category` 设为 `manuscripts`。填写题目 `title`、日期 `date`、作者 `authors`、期刊 `venue`，以及可用的卷期页码 `number` 和 DOI。
3. 有可公开分享的 PDF 时，将原文件放进 `files/publications/`，建议用简短英文文件名。然后在论文条目的两条 `---` 之间填写 PDF 路径。

现有杜洛克饲料效率论文的链接写法：

```yaml
doi: "10.16431/j.cnki.1671-7236.2025.09.014"
pdfurl: "/files/publications/2025-duroc-feed-efficiency.pdf"
```

`doi` 填编号即可。填写 `pdfurl` 后，成果页会显示「PDF 全文」。如果同时填写了 DOI，两条链接会并排显示。PDF 和论文条目可以在同一次提交中更新，发布后点开链接确认文件正确。

其他成果可沿用同样的条目结构。将 `category` 写成 `patents`（专利）、`software`（软著）或 `books`（著作）。分类显示名称与顺序在 `_config.yml` 的 `publication_category` 中维护。

成果条目还可按需填写 `paperurl` 和 `codeurl`，分别显示「全文」和「代码」。`authors` 里的姓名若匹配 `_config.yml` 中的 `highlight_authors`，会在列表中加粗。

## 三、添加项目、工具或教程

打开 `_data/projects.yml`，在对应分类的 `items` 下复制一条现有记录，修改名称和简介。页面按 YAML 中的顺序展示，想让项目靠前就把记录放在该分类的前面。

- **GitHub 项目**填写 `repo: "用户名/仓库名"`。可在 `links` 增加文档、CRAN 或下载链接。
- **站内 HTML**放到相应文件夹，再填 `url`。例如，HIBLUP 速查表放在 `files/cheatsheets/hiblup.html`，项目条目填 `url: "/files/cheatsheets/hiblup.html"`。教程和小工具分别放在 `files/tutorials/` 和 `files/tools/`。

## 四、更新经历和简历

- **首页经历**在 `_data/experience.yml` 中更新。工作经历写在 `work` 下，教育经历写在 `education` 下。沿用现有时间格式，例如 `2012.09 – 2016.07`。
- **简历**在 `_data/cv.yml` 中更新。首页与简历各有自己的经历数据。需要两处同步时，两个文件都要改。简历的研究成果从 `_publications/` 自动读取。
- **导出简历**打开 [简历页](https://mguo.dpdns.org/cv/)，点击「打印 / 保存为 PDF」，在浏览器中选择「另存为 PDF」，检查纸张为 A4，并核对预览页数。

## 五、提交、发布和检查

**用 GitHub 网页改单个文字文件**时，打开文件，点铅笔图标，编辑后提交。需要同时改多个文件或上传附件时，用 RStudio 更容易一次提交相关改动。如果是第一次使用 RStudio，选 **File → New Project → Version Control → Git**，填入仓库地址 `https://github.com/tony2015116/tony2015116.github.io.git`。

**用 RStudio 更新**时，先 **Pull** 同步远端，修改并保存文件后，在 **Git** 面板勾选本次相关文件，依次点击 **Commit → Push**。

也可以在仓库根目录使用终端。以下示例把论文条目和对应 PDF 加入暂存区。提交前用 `git diff --cached --stat` 确认暂存列表只包含本次改动。

```bash
git status --short
git add _publications/2025-09-01-duroc-feed-efficiency-gs.md files/publications/2025-duroc-feed-efficiency.pdf
git diff --cached --stat
git commit -m "更新杜洛克饲料效率论文"
git push
```

**检查是否上线**时，到仓库的 **Actions** 查看对应提交的部署状态。部署成功后，打开受影响的页面，检查文字、链接或附件。

| 遇到的问题 | 先检查 |
| --- | --- |
| Push 后网页还没更新 | 在 **Actions** 检查对应提交是否完成部署。若失败，打开失败步骤查看日志 |
| 「PDF 全文」没出现或打不开 | 核对 `pdfurl` 是否写在论文条目的 `---` 之间，以及路径、文件名大小写是否匹配 |
| 首页经历改了，简历还是旧的 | 也更新 `_data/cv.yml` |
| YAML 修改后构建报错 | 核对缩进、引号和键名，参照同文件里的现有条目 |

## 六、首次上线或复用本站

已经在维护本站时，可以直接从上面的日常操作开始。如果要用这套源码搭一个新的个人主页：

1. 创建一个自己的公开仓库。若希望用 GitHub Pages 的默认个人站点地址，仓库名使用 `你的用户名.github.io`。
2. 将站点源码放入新仓库。发布前替换 `_config.yml` 中的个人信息、`url` 和 `repository`，并改掉首页、经历、成果、项目及简历中的本站内容。同步更新 README 顶部的站点入口。
3. 保留 [Jekyll 部署工作流](.github/workflows/jekyll.yml)。在新仓库的 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。当前工作流会在推送到 `main` 或 `master` 时运行，也可以在 **Actions** 手动运行。
4. 部署成功后打开自己的站点，检查导航、头像和附件。使用自定义域名时，另外在仓库的 **Pages** 设置和域名服务商处完成配置，并将 `_config.yml` 的 `url` 设为最终访问地址。

## 七、本地预览与部署配置

安装 Ruby 和 Bundler 后，在仓库根目录运行：

```bash
bundle install
bundle exec jekyll serve --livereload
```

打开 `http://localhost:4000`。修改 `_config.yml` 后，重启 Jekyll 进程。

部署设置在仓库的 **Settings → Pages → Build and deployment**。本站使用 **GitHub Actions**，工作流见 [`.github/workflows/jekyll.yml`](.github/workflows/jekyll.yml)。调整站点自定义样式时，查看 [`_sass/_custom.scss`](_sass/_custom.scss)。

## 八、相对 AcademicPages 原模板的改动

| 部分 | 本站的做法 |
| --- | --- |
| 中文界面 | 采用 `zh-CN`，调整中文术语、字体和阅读版式，自定义样式集中在 `_sass/_custom.scss` |
| 首页与导航 | 首页展示自我介绍、研究兴趣、经历和联系方式。顶部导航提供研究成果、项目和简历 |
| 研究成果 | 按期刊论文、专利、软著、著作分类，列表按日期倒序展示，支持作者姓名加粗、DOI、代码和 PDF 全文 |
| 项目 | 在同一页面展示 R 包、软件、小工具、教程和速查表，经 `_data/projects.yml` 维护 |
| 简历 | 提供独立的网页简历，支持 A4 打印和保存为 PDF |
| 侧栏和资源 | 支持中国知网、哔哩哔哩和微信公众号等入口。jQuery 和 Academicons 使用站内资源，`baidu_analytics` 可选填写 |

## 九、参考文档

[GitHub 网页编辑文件](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files) · [GitHub Pages 部署设置](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) · [Jekyll 本地预览](https://jekyllrb.com/docs/)
