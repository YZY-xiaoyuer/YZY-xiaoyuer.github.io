# YZY Blog 迭代设计文档

> 目标：将 YZY Blog（Jekyll Chirpy）从内容初建阶段推进至可自动部署、5大分类知识体系完整、具备评论与SEO能力的成熟技术博客

---

## 项目概述

- **博客仓库**：`YZY-xiaoyuer/YZY-xiaoyuer.github.io`
- **主题**：Jekyll Chirpy ~> 7.0
- **访问地址**：https://yzy-xiaoyuer.github.io
- **技术栈**：Jekyll / Ruby / GitHub Actions / GitHub Pages
- **内容方向**：嵌入式基础与驱动 | Linux 应用开发 | C++ 工程实践 | AI Agent 开发 | 工具与效率

---

## 已完成的迭代

### [DONE] 迭代 1 — 仓库初始化与基础配置
- 创建 GitHub 仓库，初始化 git
- 写入最简 `_config.yml`（title/url/paginate/search）
- 写入 `README.md`
- 提交：`Initial commit`

### [DONE] 迭代 2 Phase 1 — 知识库文章（嵌入式/Linux）
- 写入 `_posts/2026-08-24-embedded-driver-learning-path.md`
  - 嵌入式/驱动知识图谱、4阶段学习路径、精选资源
- 写入 `_posts/2026-08-24-linux-app-learning-path.md`
  - Linux应用开发知识图谱、4阶段学习路径、精选资源
- 提交：`feat: 迭代2 — 知识库Phase1：嵌入式/驱动/Linux应用知识框架文章`

### [DONE] 迭代 2 收尾 — CI/CD + 基础设施
- `.github/workflows/pages.yml` — GitHub Actions 自动部署工作流
- `Gemfile` — Ruby 依赖（chirpy ~>7.0 + sitemap + paginate）
- `_tabs/about.md` — 个人技术背景介绍页
- `_tabs/archives.md / categories.md / tags.md` — 导航页
- `assets/img/.gitkeep` — 图片目录占位
- `_config.yml` — 扩展配置（avatar/social/giscus注释/GA注释）
- `assets/css/jekyll-theme-chirpy.scss` — 蓝绿科技感配色定制
- `robots.txt` — SEO 爬虫声明 + sitemap URL

### [DONE] 迭代 3 Phase 1 — C++/AI Agent 知识框架
- `_posts/2026-08-25-cpp-learning-path.md`
  - 现代C++ 4阶段学习路径、精选书籍、工具链、避坑指南
- `_posts/2026-08-25-ai-agent-learning-path.md`
  - AI Agent 4阶段学习路径、RAG工程、多智能体、陷阱指南

---

## 剩余迭代计划

### 迭代 4（P2）— GitHub 首次部署验证

**目标：** 将上述所有文件推送到 GitHub，验证 Actions 自动构建并正常部署到 Pages。

**执行指令：**

```bash
# 在 blog-working 目录执行
cd /home/yzy/workspace/contexts/blog-working

# 查看所有待提交文件
git status

# 分批提交：基础设施（迭代2收尾）
git add .github/workflows/pages.yml Gemfile _tabs/ assets/ robots.txt
git commit -m "feat: 迭代2收尾 — CI/CD+Gemfile+导航页+assets+robots [blog-optimize-loop]"

# 提交内容更新（迭代3）
git add _posts/2026-08-25-cpp-learning-path.md \
        _posts/2026-08-25-ai-agent-learning-path.md
git commit -m "feat: 迭代3 — C++/AI Agent 知识框架文章 [blog-optimize-loop]"

# 提交配置与样式（迭代2收尾-config）
git add _config.yml assets/css/jekyll-theme-chirpy.scss
git commit -m "feat: 迭代2收尾 — 扩展_config+蓝绿配色定制 [blog-optimize-loop]"

# 推送到 GitHub
git push origin main
```

**手动操作（一次性，需浏览器）：**
1. 打开 GitHub 仓库 → Settings → Pages
2. 将 Source 从 `Deploy from a branch` 切换为 `GitHub Actions`
3. 保存后等待第一次 Actions 执行完成

**验收标准：**
- GitHub Actions 工作流绿色通过
- https://yzy-xiaoyuer.github.io 可访问
- 5篇文章均显示在首页列表

---

### 迭代 5（P2）— 本地构建验证

**目标：** 在本地验证 Jekyll 构建无报错，sitemap 正常生成。

**执行指令：**

```bash
cd /home/yzy/workspace/contexts/blog-working

# 安装依赖（首次执行）
bundle install

# 本地构建
bundle exec jekyll build

# 验证 sitemap 存在
ls _site/sitemap.xml

# 可选：本地预览
bundle exec jekyll serve --livereload
# 访问 http://localhost:4000
```

**常见问题处理：**
- `bundle install` 缺少依赖：确认 Ruby >= 3.0，`gem install bundler`
- `jekyll build` 报 `_config.yml` 字段错误：检查 YAML 缩进（用空格，不用 tab）
- Chirpy 主题报错缺少 `_data/` 目录：从 Chirpy 仓库复制 starter 模板

**验收标准：**
- `bundle exec jekyll build` 无 ERROR 输出
- `_site/sitemap.xml` 文件存在
- `_site/index.html` 包含所有文章条目

---

### 迭代 6（P3）— Giscus 评论系统接入

**目标：** 为博客文章启用 GitHub Discussions 驱动的评论功能。

**前置步骤（浏览器手动操作）：**
1. 打开 GitHub 仓库 → Settings → 勾选 `Discussions`
2. 访问 https://giscus.app，选择仓库 `YZY-xiaoyuer/YZY-xiaoyuer.github.io`
3. Discussion Category 选择 `General`（或新建 `Blog Comments`）
4. 记录生成的 `data-repo-id` 和 `data-category-id`

**配置指令：**

```bash
# 编辑 _config.yml，取消注释 comments 块，填入真实 ID
# 将以下内容中的 YOUR_REPO_ID / YOUR_CATEGORY_ID 替换为 giscus.app 提供的值
```

需要在 `_config.yml` 中替换的配置块（将注释去掉并填入真实值）：

```yaml
comments:
  active: giscus
  giscus:
    repo: YZY-xiaoyuer/YZY-xiaoyuer.github.io
    repo_id: "YOUR_REPO_ID"
    category: General
    category_id: "YOUR_CATEGORY_ID"
    mapping: pathname
    input_position: bottom
    lang: zh-CN
    reactions_enabled: 1
```

对应的 `defaults` 中将 `comments: false` 改为 `comments: true`。

**提交指令：**

```bash
git add _config.yml
git commit -m "feat: 迭代6 — 接入 Giscus 评论系统 [blog-optimize-loop]"
git push origin main
```

**验收标准：**
- 任意文章页面底部出现 Giscus 评论框
- 未登录用户看到"使用 GitHub 登录"提示

---

### 迭代 7（P4）— Google Analytics 与 SEO 完善

**目标：** 接入 GA4 统计，完善 SEO 配置，确认 sitemap 被 Google Search Console 收录。

**前置步骤：**
1. 访问 https://analytics.google.com 创建 GA4 属性
2. 记录 Measurement ID（格式：`G-XXXXXXXXXX`）
3. 在 Google Search Console 添加并验证域名 `yzy-xiaoyuer.github.io`
4. 提交 sitemap：`https://yzy-xiaoyuer.github.io/sitemap.xml`

**配置指令：**

在 `_config.yml` 中取消注释并填入 GA4 ID：

```yaml
google_analytics:
  id: "G-XXXXXXXXXX"   # 替换为真实 GA4 Measurement ID
```

**提交指令：**

```bash
git add _config.yml
git commit -m "feat: 迭代7 — 接入 Google Analytics GA4 [blog-optimize-loop]"
git push origin main
```

**验收标准：**
- GA4 实时报告中出现访问数据
- Google Search Console sitemap 状态为"成功"
- `robots.txt` 中 sitemap URL 与实际路径一致

---

### 迭代 8（P4）— 头像与视觉完善

**目标：** 添加博主头像，完成 Chirpy 侧边栏视觉配置。

**执行指令：**

```bash
# 准备头像图片（400x400 推荐）
# 将头像文件命名为 avatar.jpg 放入 assets/img/ 目录
cp /path/to/your/avatar.jpg \
   /home/yzy/workspace/contexts/blog-working/assets/img/avatar.jpg

# _config.yml 中 avatar 字段已配置为 /assets/img/avatar.jpg（无需修改）

# 可选：生成 favicon（使用 https://realfavicongenerator.net）
# 将生成的文件放入 assets/img/favicons/ 目录

git add assets/img/
git commit -m "feat: 迭代8 — 添加博主头像 [blog-optimize-loop]"
git push origin main
```

**验收标准：**
- 侧边栏显示头像图片
- 浏览器标签页显示 favicon

---

### 迭代 9（P5）— 第五领域文章：工具与效率

**目标：** 补全第 5 个知识方向（工具与效率），完成 5 大分类知识体系。

**文章规划：**

```bash
# 写入第五篇知识框架文章
cat > _posts/2026-09-01-dev-tools-efficiency.md << 'EOF'
---
title: "开发工具与效率：工程师必备工具链"
date: 2026-09-01 09:00:00 +0800
categories: [工具与效率]
tags: [开发工具, Neovim, tmux, Git, 效率, 工具链]
description: 工程师效率工具体系：终端/编辑器/版本控制/调试/性能分析工具的最优实践。
---
（文章正文：参考前几篇的格式，包含知识图谱/学习路径/工具清单）
EOF
```

**验收标准：**
- 博客首页显示 5 个不同类别
- 分类页面（/categories/）正确列出 5 个分类

---

## 技术债务与注意事项

### 高优先级
1. **Chirpy starter 文件缺失**：完整的 Chirpy 主题需要 `_data/` 目录（`locales/`、`origin/`）。如果本地构建报错，从 [chirpy-starter](https://github.com/cotes2004/chirpy-starter) 复制缺失文件。
2. **Gemfile.lock 应提交**：`bundle install` 后将 `Gemfile.lock` 加入版本控制，确保 CI 环境版本一致。

### 中优先级
3. **图片资源优化**：文章中如有截图，使用 WebP 格式，控制在 200KB 以内，避免 Pages 加载过慢。
4. **_config.yml 中注释掉的 GA/Giscus**：迭代 6/7 完成后记得取消对应注释，否则配置不生效。

### 低优先级
5. **Chirpy 版本升级**：Gemfile 中 `~> 7.0` 允许小版本更新，定期运行 `bundle update` 跟进修复。
6. **自定义域名**：若未来绑定自定义域名，需添加 `CNAME` 文件并在 `_config.yml` 中更新 `url`。

---

## 当前文件结构

```
blog-working/
├── .github/
│   └── workflows/
│       └── pages.yml          # CI/CD 自动部署
├── _posts/
│   ├── 2026-08-24-embedded-driver-learning-path.md   # [DONE] 迭代2
│   ├── 2026-08-24-linux-app-learning-path.md          # [DONE] 迭代2
│   ├── 2026-08-25-cpp-learning-path.md                # [DONE] 迭代3
│   └── 2026-08-25-ai-agent-learning-path.md           # [DONE] 迭代3
├── _tabs/
│   ├── about.md
│   ├── archives.md
│   ├── categories.md
│   └── tags.md
├── assets/
│   ├── css/
│   │   └── jekyll-theme-chirpy.scss   # 蓝绿配色定制
│   └── img/
│       └── .gitkeep                   # 占位，后续放 avatar.jpg
├── _config.yml                        # 扩展配置
├── Gemfile                            # Ruby 依赖
├── robots.txt                         # SEO 爬虫声明
└── README.md
```
