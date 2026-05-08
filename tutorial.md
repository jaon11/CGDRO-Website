# Tutorial: 从 0 开始和 Codex 协作搭建 MkDocs 网站

这份教程以本仓库的 CGDRO 文档站为例，说明如何从零开始，通过和 Codex 协作，快速搭建一个基于 MkDocs Material 的学术/软件包文档网站。

核心思路不是一次性把所有代码写完，而是把需求拆成：网站结构、配置文件、页面内容、样式资源、预览与构建。每一步都让 Codex 先读项目，再按现有风格修改。

---

## 1. 什么是 MkDocs？

MkDocs 是一个用 Markdown 写文档、自动生成静态网站的工具。你只需要维护：

- `*.md` 文档内容
- `*.ipynb` notebook 教程
- `mkdocs.yml` 或自定义 YAML 配置文件
- 图片、CSS、JavaScript 等静态资源

然后运行 MkDocs 命令，就可以生成一个可以部署到 GitHub Pages、服务器或本地查看的网站。

本项目使用的是：

- **MkDocs**：负责把文档生成网站
- **Material for MkDocs**：负责主题、导航、搜索、深浅色模式等外观
- **mkdocs-jupyter**：让 `.ipynb` notebook 可以直接变成网页
- **mkdocstrings**：从 Python docstring 自动生成 API 文档
- **enumerate-headings**：自动给标题编号

### 安装

从零开始时，可以先安装常用依赖：

```bash
pip install mkdocs mkdocs-material mkdocs-jupyter mkdocstrings[python] mkdocs-enumerate-headings-plugin
```

如果项目已经有 `requirements.txt`、`pyproject.toml` 或 `environment.yml`，优先让 Codex 读取项目文件后判断应该用哪个安装方式。

可以这样告诉 Codex：

> 请先检查这个项目的依赖管理方式。如果没有依赖文件，请告诉我 MkDocs Material、mkdocs-jupyter、mkdocstrings 和 enumerate-headings 应该如何安装。

### 一个 MkDocs 网站的主要部分

以本项目为例，根目录结构大致是：

```text
CGDRO-Website/
├── cgdro.yml
├── docs/
│   ├── index.md
│   ├── setup/
│   ├── method/
│   ├── python/
│   ├── R/
│   ├── about/
│   ├── assets/
│   ├── stylesheets/
│   └── javascripts/
├── overrides/
├── site/
├── README.md
└── tutorial.md
```

每个部分的作用：

| 路径 | 放什么 | 在网站中的作用 |
| --- | --- | --- |
| `cgdro.yml` | MkDocs 配置 | 网站名称、主题、插件、导航、CSS/JS、外部链接 |
| `docs/index.md` | 首页内容 | 网站入口页面 |
| `docs/setup/` | 入门文档 | Introduction、安装、背景说明 |
| `docs/method/` | 方法介绍 | 算法、数学公式、理论说明 |
| `docs/python/` | Python 文档 | Python package 介绍、API、notebook 教程 |
| `docs/R/` | R 文档 | R package 介绍、API、notebook 教程 |
| `docs/about/` | 作者、引用、团队信息 | About 页面 |
| `docs/assets/` | 图片、logo、截图 | Markdown 和 CSS 中引用的资源 |
| `docs/stylesheets/extra.css` | 自定义 CSS | 首页 hero、页脚颜色、logo 文字、按钮样式 |
| `docs/javascripts/mathjax.js` | 自定义 JS | 配置数学公式渲染 |
| `overrides/` | 主题模板覆盖 | 自定义 Material 主题 HTML |
| `site/` | build 后生成的网站 | 自动生成，不建议手动编辑 |

和 Codex 协作时，可以先说清楚：

> 请先读取 `cgdro.yml`、`docs/index.md` 和 `docs/stylesheets/extra.css`，总结当前 MkDocs 网站结构，然后再帮我新增/修改页面。

这样 Codex 会根据已有项目风格修改，而不是重新发明一套结构。

---

## 2. YAML 文件

MkDocs 的 YAML 文件决定网站的整体行为。本项目没有使用默认的 `mkdocs.yml`，而是使用 `cgdro.yml`。因此运行命令时通常要加：

```bash
mkdocs serve -f cgdro.yml
mkdocs build -f cgdro.yml
```

下面按照本项目的 `cgdro.yml` 逐段说明：配置内容、如何告诉 Codex、最终效果。

### 2.1 网站基本信息

当前配置：

```yaml
site_name: CGDRO Documentation
site_description: Comprehensive documentation for CGDRO Python and R packages.
copyright: "Copyright © 2025"

use_directory_urls: true
```

如何告诉 Codex：

> 请把网站名称设置为 CGDRO Documentation，描述为 CGDRO Python 和 R packages 的综合文档，页脚版权年份为 2025，并使用目录式 URL。

最终效果：

- 浏览器标题、header 和搜索结果中会显示 `CGDRO Documentation`
- 页脚显示版权信息
- 页面链接会使用类似 `/setup/intro/` 的目录式 URL，而不是 `/setup/intro.html`

注意：`use_directory_urls: true` 对部署更友好，但本地直接打开 HTML 文件时可能不如 `false` 方便。

### 2.2 外观主题

当前配置：

```yaml
theme:
  name: material
  custom_dir: overrides
  language: en
  features:
    - navigation.sections       # Render top-level navigation groups as sidebar sections.
    - navigation.tabs           # Show top-level navigation items as tabs below the header.
    - navigation.tabs.sticky    # Keep navigation tabs visible while scrolling.
    - navigation.top            # Show a back-to-top button after scrolling down.
    - toc.follow                # Keep the active table-of-contents item in view.
    - content.code.copy         # Add copy buttons to code blocks.
    - search.suggest            # Show search suggestions while typing.
    - search.highlight          # Highlight search terms after opening a search result.
```

如何告诉 Codex：

> 请使用 Material for MkDocs 主题。导航要显示顶部 tabs，滚动时 tabs 固定在页眉，左侧导航按 section 展开，右侧目录跟随滚动，代码块提供复制按钮，搜索支持建议和高亮。

最终效果：

- 顶部出现主导航 tabs，比如 Home、Introduction、Methods、Python Package、R Package
- 滚动页面时可以回到顶部
- 代码块右上角有复制按钮
- 搜索框输入时会有建议和高亮结果

### 2.3 深浅色模式和品牌颜色

当前配置：

```yaml
theme:
  palette:
    - scheme: default
      primary: "#80AF7E"
      accent:  "#B4D269"
      toggle:
        icon: material/weather-night
        name: Switch to dark mode
    - scheme: slate
      primary: "#9CCF9C"
      accent:  "#EBCB64"
      toggle:
        icon: material/weather-sunny
        name: Switch to light mode
```

如何告诉 Codex：

> 请给网站配置浅色和深色两套主题。浅色模式用绿色系作为主色和强调色，深色模式用较亮的绿色和金色作为主色与强调色，并在右上角提供深浅色切换按钮。

最终效果：

- 用户可以在浅色和深色主题之间切换
- header、按钮、链接、搜索等 Material 组件会使用指定颜色

### 2.4 页眉、页脚和额外样式

YAML 中引入 CSS：

```yaml
extra_css:
  - stylesheets/extra.css
```

本项目的 `docs/stylesheets/extra.css` 做了这些事情：

- 首页全宽 hero 区域
- 首页背景图 `docs/assets/home_bg.png`
- header 中用文字 `CGDRO` 替代图片 logo
- 页脚渐变背景
- 深色模式下自定义 CSS 变量

如何告诉 Codex：

> 请不要只改 YAML。请同时检查 `docs/stylesheets/extra.css`，让首页 hero、按钮、页脚和 header logo 的样式与现有 CGDRO 风格一致。如果要新增图片，请放到 `docs/assets/` 并使用相对路径引用。

最终效果：

- 首页不是普通文档页，而是有大图背景和按钮的 landing page
- 页脚和 header 有项目自己的视觉识别
- 所有自定义样式集中在 `extra.css`，不会污染正文 Markdown

### 2.5 页脚社交链接和外部超链接

当前配置：

```yaml
extra:
  social:
    - icon: fontawesome/brands/github
      link: https://github.com/jaon11/CGDRO-Py
      name: CGDRO Python repo
    - icon: fontawesome/brands/github
      link: https://github.com/jaon11/CGDRO
      name: CGDRO R repo
```

导航里也有外部链接：

```yaml
nav:
  - "Python repo ↗": https://github.com/jaon11/CGDRO-Py
  - "R repo ↗": https://github.com/jaon11/CGDRO
```

如何告诉 Codex：

> 请在页脚添加 Python repo 和 R repo 的 GitHub 图标链接，并在顶部导航最后添加两个外部链接，文字后面带向外跳转符号。

最终效果：

- 页脚会显示 GitHub 图标
- 顶部导航最后会出现 `Python repo ↗` 和 `R repo ↗`
- 用户可以直接跳转到代码仓库

### 2.6 Jupyter notebook 兼容

当前配置：

```yaml
plugins:
  - mkdocs-jupyter:
      execute: false
```

这一段属于 `plugins` 配置。MkDocs 插件会在构建网站时扩展默认能力；这里的 `mkdocs-jupyter` 负责把 notebook 文件转换成网站页面。

| 配置 | 作用 |
| --- | --- |
| `mkdocs-jupyter` | 让 `.ipynb` 文件可以像 Markdown 页面一样放进 `nav` 并渲染到网站中 |
| `execute: false` | 构建网站时不重新运行 notebook，而是使用 notebook 里已经保存的输出 |

导航中直接引用 notebook：

```yaml
nav:
  - Python Package:
      - Tutorials:
          - Linear Regression (lowdim): python/reg_ld.ipynb
          - Linear Regression (highdim): python/reg_hd.ipynb
          - Regression (machine learning): python/reg_ml.ipynb
          - Classification: python/cls.ipynb
```

如何告诉 Codex：

> 我希望 notebook 教程可以直接出现在网站里，但 build 时不要重新执行 notebook。请配置 mkdocs-jupyter，并把 `docs/python/*.ipynb` 和 `docs/R/*.ipynb` 加入导航。

最终效果：

- `.ipynb` 文件会像普通页面一样出现在网站导航里
- `execute: false` 表示构建网站时不会重新运行 notebook，构建更快，也避免因为本地环境缺包而失败

注意：

- 如果 notebook 输出很大，网站 build 会变慢
- 如果 notebook 依赖图片或数据，要确认路径相对 `docs/` 能正常访问
- 如果希望每次 build 都重新执行 notebook，可以改为 `execute: true`，但要保证环境完整

### 2.7 数学公式、Markdown 扩展和 HTML

当前配置：

```yaml
markdown_extensions:
  - md_in_html
  - admonition
  - footnotes
  - toc:
      permalink: true
  - pymdownx.arithmatex:
      generic: true
  - pymdownx.superfences
  - pymdownx.details
  - pymdownx.tabbed
  - attr_list

extra_javascript:
  - javascripts/mathjax.js
  - https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js
```

这一段不是主题设置，而是 Markdown 解析能力设置。`markdown_extensions` 决定 Markdown 文件里可以使用哪些额外语法；`extra_javascript` 引入 JavaScript 文件，用来支持数学公式渲染等功能。

| 配置 | 作用 |
| --- | --- |
| `md_in_html` | 允许在 HTML 标签内部继续写 Markdown，例如 `<figure markdown="block">` |
| `admonition` | 支持提示框语法，例如 `!!! note`、`!!! warning` |
| `footnotes` | 支持脚注语法，例如 `[^1]` |
| `toc.permalink: true` | 给标题生成可复制的永久链接 |
| `pymdownx.arithmatex` | 让 Markdown 中的 LaTeX 数学公式交给 MathJax 渲染 |
| `generic: true` | 使用通用 MathJax 兼容模式，适合 Material 官方推荐配置 |
| `pymdownx.superfences` | 增强代码块，支持复杂嵌套和更多扩展语法 |
| `pymdownx.details` | 支持可折叠内容块，常和 `??? note` 一起使用 |
| `pymdownx.tabbed` | 支持内容 tabs，例如 Python/R 示例切换 |
| `attr_list` | 允许给 Markdown 元素加属性，例如 `{ .class #id }` |
| `javascripts/mathjax.js` | 本项目自己的 MathJax 配置文件，位于 `docs/javascripts/mathjax.js` |
| `tex-mml-chtml.js` | MathJax 官方渲染脚本，用于显示 LaTeX 公式 |

如何告诉 Codex：

> 这个网站需要支持 LaTeX 数学公式、脚注、提示框、可折叠 details、tabs、代码块增强、HTML 内嵌 Markdown，以及标题永久链接。请配置 Material 常用的 Markdown extensions，并用 MathJax 渲染公式。

最终效果：

- 可以写块级公式：


$$
f_{\theta^*}
= \arg\min_{\theta} \max_{\mathbf{T} \in \mathcal{C}}
\mathbb{E}_{(X, Y)\sim \mathbf{T}} \ell(X, Y; f_\theta)
$$


- 可以在 Markdown 中使用 HTML：

```html
<figure id="fig-msda" markdown="block">
  <img src="../assets/MSDA.png" alt="MSDA illustration">
  <figcaption markdown="span">Figure 1. MSDA setup.</figcaption>
</figure>
```

- 标题旁边会出现 permalink，方便复制章节链接

### 2.8 搜索、API 文档和标题编号

当前配置：

```yaml
plugins:
  - search:
      lang: [en, zh]
  - mkdocstrings:
      handlers:
        python:
          options:
            show_source: false
            docstring_style: google
  - enumerate-headings:
      toc_depth: 3
      increment_across_pages: false
      strict: true
```

这一段也是 `plugins` 配置，分别负责搜索、API 文档生成和标题自动编号。

| 配置 | 作用 |
| --- | --- |
| `search` | 启用 MkDocs Material 内置搜索 |
| `lang: [en, zh]` | 搜索索引同时支持英文和中文 |
| `mkdocstrings` | 根据代码里的 docstring 自动生成 API 文档 |
| `handlers.python` | 使用 Python handler 解析 Python 模块、类、函数 |
| `show_source: false` | API 页面不显示源码链接/源码块 |
| `docstring_style: google` | 按 Google 风格解析 docstring 的参数、返回值等部分 |
| `enumerate-headings` | 自动给页面标题编号 |
| `toc_depth: 3` | 编号和目录最多处理到三级标题 |
| `increment_across_pages: false` | 每个页面单独从 1 开始编号，不跨页面连续编号 |
| `strict: true` | 更严格地检查标题编号相关问题，发现问题时让构建失败 |

如何告诉 Codex：

> 请配置英文和中文搜索。Python API 文档用 mkdocstrings，从 Google 风格 docstring 生成页面，并隐藏源码。标题自动编号到三级目录，不跨页面连续编号。

最终效果：

- 搜索支持英文和中文
- API Reference 页面可以通过 `::: package.module` 之类的语法自动生成
- 标题会自动编号，右侧目录也会更清晰

### 2.9 outline 和文件目录格式怎么匹配

MkDocs 的核心规则是：`nav` 中的路径都相对于 `docs/` 目录。

当前配置：

```yaml
nav:
  - Home: index.md
  - Introduction: setup/intro.md
  - Methods:
      - CGDRO-Regression: method/cgdro-reg.md
      - CGDRO-Classification: method/cgdro-cls.md
  - Python Package:
      - Getting Started: python/index.md
      - API Reference: python/ref.md
      - Tutorials:
          - Linear Regression (lowdim): python/reg_ld.ipynb
          - Linear Regression (highdim): python/reg_hd.ipynb
          - Regression (machine learning): python/reg_ml.ipynb
          - Classification: python/cls.ipynb
  - R Package:
      - Getting Started: R/index.md
      - API Reference: R/ref.md
      - Tutorials:
          - Linear Regression (lowdim): R/reg_ld.ipynb
          - Linear Regression (highdim): R/reg_hd.ipynb
          - Regression (machine learning): R/reg_ml.ipynb
          - Classification: R/cls.ipynb
  - About:
      - Authors: about/authors.md
  - "Python repo ↗": https://github.com/jaon11/CGDRO-Py
  - "R repo ↗": https://github.com/jaon11/CGDRO
```

对应文件目录：

```text
docs/
├── index.md
├── setup/
│   └── intro.md
├── method/
│   ├── cgdro-reg.md
│   └── cgdro-cls.md
├── python/
│   ├── index.md
│   ├── ref.md
│   ├── reg_ld.ipynb
│   ├── reg_hd.ipynb
│   ├── reg_ml.ipynb
│   └── cls.ipynb
├── R/
│   ├── index.md
│   ├── ref.md
│   ├── reg_ld.ipynb
│   ├── reg_hd.ipynb
│   ├── reg_ml.ipynb
│   └── cls.ipynb
└── about/
    └── authors.md
```

如何告诉 Codex：

> 请按照我的 outline 创建 MkDocs 导航。注意 `nav` 里的路径必须相对于 `docs/`，不要写成 `docs/python/index.md`。每一个导航项都要确认文件存在；如果不存在，请先创建对应 Markdown 文件。

最终效果：

- 顶部 tab 是一级导航
- 二级、三级导航在左侧 sidebar 中展开
- 点击 Python/R tutorials 时可以直接进入 notebook 页面

---

## 3. 其他部分

YAML 决定网站结构，但真正的网站质量主要来自内容文件、图片、样式和模板。

### 3.1 首页 `docs/index.md`

本项目首页使用了 front matter：

```markdown
---
title: Home
hide:
  - navigation
  - toc
---
```

作用：

- 设置页面标题为 `Home`
- 隐藏首页左侧导航
- 隐藏首页右侧目录

首页还使用 HTML 写 hero：

```html
<div class="cgdro-hero">
  <div class="cgdro-hero__overlay">
    <h1 class="cgdro-hero__title">CGDRO, multi-source learning with no target labeled data.</h1>
    <p class="cgdro-hero__subtitle">
      Integrate diverse data sources, provide robust prediction and statistical inference on your target domain.
    </p>
    <div class="cgdro-hero__actions">
      <a class="md-button md-button--primary" href="setup/intro/">Get started</a>
      <a class="md-button" href="#learn-more">Learn more</a>
    </div>
  </div>
</div>
```

如何告诉 Codex：

> 请把首页做成 full-width landing page，隐藏默认导航和目录。首页上半部分使用 `docs/assets/home_bg.png` 做背景图，叠加标题、副标题和两个 Material 按钮。按钮分别链接到 Introduction 和页面下方内容。

### 3.2 普通文档页

方法介绍、安装介绍、API 使用说明等普通页面建议放在：

```text
docs/setup/
docs/method/
docs/python/
docs/R/
docs/about/
```

写法建议：

- 每页只讲一个主题
- 标题层级从 `#`、`##`、`###` 递进
- 数学公式用 LaTeX
- 图片放在 `docs/assets/`
- 表格用于对比模块、参数、功能
- 引用文献可以放在页面底部

可以这样告诉 Codex：

> 请根据 `docs/setup/intro.md` 的写作风格，帮我新增一个 `docs/method/example.md` 页面。页面需要包含问题背景、数学定义、算法直觉、图示位置和 references。公式用 MathJax，图片引用从 `docs/assets/` 读取。

### 3.3 API Reference 页面

本项目有：

```text
docs/python/ref.md
docs/R/ref.md
docs/python/ref/*.ipynb
docs/R/ref/*.ipynb
```

如果是 Python 包，常见做法是用 `mkdocstrings` 自动读取 docstring。你可以让 Codex：

> 请检查 Python package 的模块路径，然后用 mkdocstrings 为主要类和函数生成 API Reference 页面。要求隐藏源码，使用 Google 风格 docstring。

如果 API 示例更适合 notebook，也可以继续用 `.ipynb` 放在 `docs/python/ref/` 下。

### 3.4 图片和静态资源

图片建议统一放在：

```text
docs/assets/
```

Markdown 中引用图片时，要根据当前页面位置写相对路径。例如：

```markdown
![CGDRO illustration](../assets/CGDRO.png)
```

CSS 中引用图片时，相对路径是从 CSS 文件所在位置开始算。本项目 `extra.css` 在 `docs/stylesheets/`，所以首页背景图这样写：

```css
background: url('../assets/home_bg.png') center/cover no-repeat;
```

可以这样告诉 Codex：

> 请检查我要引用图片的页面位置，帮我写正确的相对路径。如果图片用于 CSS 背景，请从 `docs/stylesheets/extra.css` 的位置计算路径。

### 3.5 自定义模板 `overrides/`

本项目配置了：

```yaml
theme:
  custom_dir: overrides
```

这表示可以在 `overrides/` 中覆盖 Material 主题模板。例如：

```text
overrides/main.html
```

适合放：

- 自定义 header 内容
- 额外 meta 标签
- 全站 HTML 插槽
- 主题级别的轻量修改

本站中 `overrides/main.html` 在页脚添加了两个Github package的链接图标。

协作建议：

> 请先检查 `overrides/main.html` 是否已经覆盖了 Material 模板。如果需要加全站元素，请尽量通过 Material 的 block 机制扩展，不要整份复制主题模板。

---

## 4. 做好之后如何预览、build，以及常用命令

因为本项目配置文件叫 `cgdro.yml`，命令都建议加 `-f cgdro.yml`。

### 本地预览

```bash
mkdocs serve -f cgdro.yml
```

默认访问：

```text
http://127.0.0.1:8000/
```

如果 8000 端口被占用：

```bash
mkdocs serve -f cgdro.yml -a 127.0.0.1:8001
```

### 构建静态网站

```bash
mkdocs build -f cgdro.yml
```

生成结果在：

```text
site/
```

### 清理后重新构建

```bash
mkdocs build -f cgdro.yml --clean
```

### 严格模式检查

```bash
mkdocs build -f cgdro.yml --strict
```

严格模式会把 warning 当作 error，适合发布前检查：

- 导航路径是否不存在
- 内部链接是否写错
- 图片路径是否无效
- 插件配置是否有问题


### 部署静态网站

MkDocs build 完成后，真正需要部署的是生成出来的 `site/` 文件夹，而不是 `docs/` 或 `cgdro.yml`。

#### GitHub Pages

适合长期维护的网站。文档源码放在 GitHub 仓库里，网站由 GitHub Pages 托管。

最简单的方式是使用 MkDocs 自带命令：

```bash
mkdocs gh-deploy -f cgdro.yml
```

如果遇到mkdocs版本不兼容的情况，使用

```bash
mkdocs gh-deploy -f cgdro.yml --ignore-version
```

这个命令会：

- 先构建网站
- 把生成结果推送到仓库的 `gh-pages` 分支
- 让 GitHub Pages 可以从 `gh-pages` 分支发布网站

第一次使用前，需要在 GitHub 仓库中确认 Pages 设置：

1. 打开 GitHub 仓库。
2. 进入 `Settings` -> `Pages`。
3. Source 选择 `Deploy from a branch`。
4. Branch 选择 `gh-pages`。
5. Folder 选择 `/ (root)`。

之后每次更新网站，只需要重新运行：

```bash
mkdocs gh-deploy -f cgdro.yml
```

如果想用 GitHub Actions 自动部署，也可以配置 workflow，让每次 push 到 `main` 后自动运行 `mkdocs build` 并发布到 GitHub Pages。

### 查看 MkDocs 帮助

```bash
mkdocs --help
mkdocs serve --help
mkdocs build --help
```

### 常用协作指令

让 Codex 预览：

> 请运行 `mkdocs serve -f cgdro.yml`，如果 8000 被占用就换 8001，并告诉我本地预览 URL。

让 Codex 构建检查：

> 请运行 `mkdocs build -f cgdro.yml --strict`，如果失败，请根据错误信息修复配置、链接或路径。

让 Codex 加页面：

> 请新增一个 `docs/.../*.md` 页面，并把它加入 `cgdro.yml` 的 `nav`。修改后运行 strict build 检查。

让 Codex 整理导航：

> 请检查 `cgdro.yml` 中所有 `nav` 路径是否存在，并确认每个 section 的顺序和 `docs/` 目录结构一致。

---

## 5. 注意事项

### 5.1 不要手动编辑 `site/`

`site/` 是 MkDocs build 后自动生成的目录。修改这里不会反向更新源码。应该修改：

- `cgdro.yml`
- `docs/**/*.md`
- `docs/**/*.ipynb`
- `docs/assets/*`
- `docs/stylesheets/extra.css`
- `docs/javascripts/*`
- `overrides/*`

### 5.2 `nav` 路径是相对于 `docs/`

正确：

```yaml
- Getting Started: python/index.md
```

错误：

```yaml
- Getting Started: docs/python/index.md
```

### 5.3 配置文件不是默认名时要加 `-f`

本项目使用：

```bash
mkdocs serve -f cgdro.yml
mkdocs build -f cgdro.yml
```

如果忘记 `-f cgdro.yml`，MkDocs 会默认找 `mkdocs.yml`，可能直接失败。

### 5.4 图片路径要按文件位置计算

Markdown 页面中：

```markdown
![Image](../assets/image.png)
```

CSS 中：

```css
background: url('../assets/home_bg.png');
```

两者起点不同，不要混用。

### 5.5 Notebook 构建要控制执行

当前配置：

```yaml
- mkdocs-jupyter:
    execute: false
```

这是比较稳妥的选择。它使用 notebook 已有输出，不在 build 时重新运行代码。

如果设置 `execute: true`，发布机器必须安装 notebook 里所有依赖，而且数据路径也要正确。

### 5.6 YAML 缩进非常重要

YAML 用缩进表达层级。错误缩进会导致网站构建失败。

建议让 Codex 修改 YAML 后一定运行：

```bash
mkdocs build -f cgdro.yml --strict
```

### 5.7 中英文搜索需要配置语言

本项目配置：

```yaml
plugins:
  - search:
      lang: [en, zh]
```

如果文档中有中文内容，不要只写 `lang: en`。

### 5.8 自定义样式尽量集中

不要在每个 Markdown 页面里写大量 style。建议：

- 页面结构写在 Markdown/HTML 中
- 全站样式写在 `docs/stylesheets/extra.css`
- JavaScript 写在 `docs/javascripts/`

### 5.9 每次大改后做三件事

1. 检查 `nav` 路径是否存在
2. 运行 `mkdocs build -f cgdro.yml --strict`
3. 本地 `mkdocs serve -f cgdro.yml` 看页面效果

### 5.10 给 Codex 的完整需求模板

可以直接复制下面这段作为新项目需求：

> 我想从 0 搭建一个 MkDocs Material 文档网站。请先检查当前目录结构，然后创建 `docs/`、配置 YAML、首页、入门页、方法页、Python/R package 页面、About 页面、assets/css/js 目录。网站需要支持深浅色切换、顶部 tabs、搜索、代码复制、数学公式、Jupyter notebook 页面、Python API Reference、页脚 GitHub 链接。请按照我的 outline 写 `nav`，确保所有路径相对于 `docs/`。完成后运行 `mkdocs build -f cgdro.yml --strict` 检查并修复错误。

如果是在本项目中继续修改，可以说：

> 请基于当前 `cgdro.yml` 和 `docs/` 结构修改，不要重建项目。新增页面时保持 CGDRO 现有写作风格、首页视觉风格和导航层级。修改后运行 strict build。
