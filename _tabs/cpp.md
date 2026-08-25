---
title: C++ 专栏
icon: fas fa-code
order: 4
---

<div class="collections-hero" style="--hero-gradient: 135deg, #0c2d48 0%, #145374 100%; --hero-accent: #38bdf8">
  <div class="hero-aurora"></div>
  <div class="hero-body">
    <div class="hero-icon"><i class="fas fa-code"></i></div>
    <h2 class="hero-title">C++ 专栏</h2>
    <p class="hero-desc">现代 C++ 语言特性、工程工具链与高性能编程实践</p>
  </div>
</div>

<div class="collections-grid-section">
  {% assign col_count = 0 %}
  {% for post in site.posts %}
    {% assign in_col = false %}
    {% for cat in post.categories %}
      {% if cat == "C++ 工程实践" %}
        {% assign in_col = true %}
        {% break %}
      {% endif %}
    {% endfor %}
    {% if in_col %}{% assign col_count = col_count | plus: 1 %}{% endif %}
  {% endfor %}

  <div class="collections-grid-label">
    <i class="fas fa-file-alt"></i>
    <span>全部文章</span>
    <span class="grid-count">{{ col_count }} 篇</span>
  </div>

  <div class="collections-grid">
    {% for post in site.posts %}
      {% assign matched = false %}
      {% for cat in post.categories %}
        {% if cat == "C++ 工程实践" %}
          {% assign matched = true %}
          {% break %}
        {% endif %}
      {% endfor %}
      {% if matched %}
        <article class="book-card" style="--card-accent: #38bdf8">
          <div class="book-spine"></div>
          <div class="book-body">
            <div class="book-meta">
              {% for cat in post.categories %}<span class="book-cat">{{ cat }}</span>{% endfor %}
              <time class="book-date">{{ post.date | date: "%Y.%m.%d" }}</time>
            </div>
            <h3 class="book-title"><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
            {% if post.description %}<p class="book-desc">{{ post.description }}</p>{% endif %}
            {% if post.tags.size > 0 %}
              <div class="book-tags">{% for tag in post.tags limit: 4 %}<span class="book-tag">{{ tag }}</span>{% endfor %}</div>
            {% endif %}
          </div>
        </article>
      {% endif %}
    {% endfor %}
  </div>

  {% if col_count == 0 %}
  <div class="collections-empty">
    <i class="fas fa-inbox"></i>
    <p>暂无文章，敬请期待</p>
  </div>
  {% endif %}
</div>
