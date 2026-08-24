# 🚀 YZY 的个人技术博客

[![Jekyll](https://img.shields.io/badge/Jekyll-CC0000?style=flat&logo=Jekyll&logoColor=white)](https://jekyllrb.com/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=flat&logo=GitHub%20Pages&logoColor=white)](https://pages.github.com/)
[![Chirpy Theme](https://img.shields.io/badge/Theme-Chirpy-brightgreen)](https://github.com/cotes2020/jekyll-theme-chirpy)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 记录技术学习、项目实践和个人思考的个人博客，基于 Jekyll Chirpy 主题构建。

📖 **在线访问**：[https://YZY-xiaoyuer.github.io](https://YZY-xiaoyuer.github.io)

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/YZY-xiaoyuer/YZY-xiaoyuer.github.io.git
cd YZY-xiaoyuer.github.io

# 安装 Ruby 依赖
bundle install

# 本地预览（浏览器访问 http://localhost:4000）
bundle exec jekyll serve --livereload
```

## 目录结构

```
YZY-xiaoyuer.github.io/
├── .github/workflows/pages.yml  # CI/CD 自动部署到 GitHub Pages
├── _config.yml                   # 博客全局配置（主题/评论/搜索/SEO）
├── _posts/                       # 博客文章（命名：YYYY-MM-DD-slug.md）
├── _tabs/                        # 固定导航页（about/archives/categories/tags）
├── assets/img/                   # 图片资源（建议 WebP 格式）
├── Gemfile                       # Ruby 依赖声明
└── README.md
```

## 博客工作流

本博客通过两个 AI 工作流驱动日常维护：

### 博客优化（新功能 / 内容改进 / SEO）

```bash
/blog-optimize-loop /path/to/blog YZY-xiaoyuer/YZY-xiaoyuer.github.io "迭代N — 目标描述"
```

**适用**：新文章、主题定制、评论系统、搜索功能、SEO 优化

### 博客修复（问题定位与修复）

```bash
/blog-fix-loop /path/to/blog YZY-xiaoyuer/YZY-xiaoyuer.github.io "问题：现象 | 预期：结果 | 已尝试：排查项"
```

**适用**：构建失败、样式异常、死链、HTTPS 配置、插件兼容性问题

## 文章投稿规范

文件命名：`_posts/YYYY-MM-DD-slug.md`（slug 使用小写字母和连字符）

必填 Front Matter：

```yaml
---
title: 文章标题
date: 2026-08-24 10:00:00 +0800
categories: [分类]
tags: [标签]
description: SEO 描述（150 字以内）
---
```

详细规范见 [博客写作与发布教程](https://github.com/YZY-xiaoyuer/YZY-xiaoyuer.github.io/wiki/博客写作与发布教程)

## Wiki 文档

| 文档 | 说明 |
|---|---|
| [📐 博客架构文档](https://github.com/YZY-xiaoyuer/YZY-xiaoyuer.github.io/wiki/博客架构文档) | 技术选型、目录结构、CD 流水线配置 |
| [🔄 工作流使用指南](https://github.com/YZY-xiaoyuer/YZY-xiaoyuer.github.io/wiki/工作流使用指南) | blog-optimize-loop 和 blog-fix-loop 使用说明 |
| [✍️ 博客写作与发布教程](https://github.com/YZY-xiaoyuer/YZY-xiaoyuer.github.io/wiki/博客写作与发布教程) | 写作规范、图片处理、发布流程 |
| [📋 迭代设计文档模板](https://github.com/YZY-xiaoyuer/YZY-xiaoyuer.github.io/wiki/迭代设计文档模板) | 功能迭代记录标准模板 |

## License

[MIT](LICENSE) © 2026 YZY
