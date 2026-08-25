---
title: 专栏
icon: fas fa-book-open
order: 0
layout: page
permalink: /collections/
---

<div class="collections-page" id="collections-page">

  <!-- 移动端 toggle -->
  <button class="collections-nav-toggle" onclick="toggleNav()" aria-label="切换专栏导航">
    <i class="fas fa-bars"></i>
    <span id="nav-toggle-label">选择专栏</span>
  </button>

  <!-- 左侧专栏导航 -->
  <nav class="collections-nav" id="collections-nav">
    <div class="collections-nav-header">
      <i class="fas fa-bookmark"></i> 专栏目录
    </div>
    <ul class="collections-nav-list">
      {% for col in site.data.collections %}
        {% assign post_count = 0 %}
        {% for post in site.posts %}
          {% for cat in post.categories %}
            {% if col.category_match contains cat %}
              {% assign post_count = post_count | plus: 1 %}
              {% break %}
            {% endif %}
          {% endfor %}
        {% endfor %}
        <li class="collections-nav-item">
          <button
            class="collections-nav-btn"
            data-col="{{ col.key }}"
            data-accent="{{ col.accent }}"
            onclick="selectCollection('{{ col.key }}')"
          >
            <i class="{{ col.icon }}"></i>
            <span class="nav-title">{{ col.title }}</span>
            <span class="nav-badge">{{ post_count }}</span>
          </button>
        </li>
      {% endfor %}
    </ul>
  </nav>

  <!-- 右侧内容区 -->
  <div class="collections-content" id="collections-content">

    <!-- Hero 区域 -->
    <div class="collections-hero" id="collections-hero">
      <div class="hero-aurora"></div>
      <div class="hero-body">
        <div class="hero-icon" id="hero-icon"><i class="fas fa-book-open"></i></div>
        <h2 class="hero-title" id="hero-title">选择一个专栏</h2>
        <p class="hero-desc" id="hero-desc">从左侧导航选择感兴趣的技术专栏，探索系统整理的知识体系。</p>
      </div>
    </div>

    <!-- 分组圆球区 -->
    <div class="group-spheres-section" id="group-spheres-section" style="display:none">
      <div class="group-spheres-label">
        <i class="fas fa-filter"></i> 按分组筛选
        <button class="group-clear-btn" id="group-clear-btn" onclick="clearGroupFilter()" style="display:none">
          <i class="fas fa-times"></i> 清除筛选
        </button>
      </div>
      <div class="group-spheres" id="group-spheres"></div>
    </div>

    <!-- 文章卡片区 -->
    <div class="collections-grid-section" id="collections-grid-section" style="display:none">
      <div class="collections-grid-label">
        <i class="fas fa-file-alt"></i>
        <span id="grid-label-text">全部文章</span>
        <span class="grid-count" id="grid-count"></span>
      </div>
      <div class="collections-grid" id="collections-grid">
        <!-- 所有专栏的卡片都渲染在这里，由 JS 控制显示 -->
        {% for col in site.data.collections %}
          {% for post in site.posts %}
            {% assign matched = false %}
            {% for cat in post.categories %}
              {% if col.category_match contains cat %}
                {% assign matched = true %}
                {% break %}
              {% endif %}
            {% endfor %}
            {% if matched %}
              {% comment %} 计算该文章属于哪些分组 {% endcomment %}
              {% assign post_groups = "" %}
              {% for group in col.groups %}
                {% assign group_matched = false %}
                {% for ptag in post.tags %}
                  {% if group.tags contains ptag %}
                    {% assign group_matched = true %}
                    {% break %}
                  {% endif %}
                {% endfor %}
                {% if group_matched %}
                  {% if post_groups == "" %}
                    {% assign post_groups = group.key %}
                  {% else %}
                    {% assign post_groups = post_groups | append: "," | append: group.key %}
                  {% endif %}
                {% endif %}
              {% endfor %}
              <article
                class="book-card"
                data-col="{{ col.key }}"
                data-groups="{{ post_groups }}"
                data-accent="{{ col.accent }}"
                style="--card-accent: {{ col.accent }}; display:none"
              >
                <div class="book-spine"></div>
                <div class="book-body">
                  <div class="book-meta">
                    {% for cat in post.categories %}
                      <span class="book-cat">{{ cat }}</span>
                    {% endfor %}
                    <time class="book-date">{{ post.date | date: "%Y.%m.%d" }}</time>
                  </div>
                  <h3 class="book-title">
                    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
                  </h3>
                  {% if post.description %}
                    <p class="book-desc">{{ post.description | truncate: 120 }}</p>
                  {% endif %}
                  {% if post.tags.size > 0 %}
                    <div class="book-tags">
                      {% for tag in post.tags limit: 4 %}
                        <span class="book-tag">{{ tag }}</span>
                      {% endfor %}
                    </div>
                  {% endif %}
                </div>
              </article>
            {% endif %}
          {% endfor %}
        {% endfor %}
      </div>
      <div class="collections-empty" id="collections-empty" style="display:none">
        <i class="fas fa-inbox"></i>
        <p>该分组暂无文章</p>
      </div>
    </div>

  </div><!-- .collections-content -->
</div><!-- .collections-page -->

<!-- 专栏数据（供 JS 读取 Hero 信息）-->
<script type="application/json" id="collections-data">
[
  {% for col in site.data.collections %}
  {
    "key": "{{ col.key }}",
    "title": "{{ col.title }}",
    "description": "{{ col.description }}",
    "icon": "{{ col.icon }}",
    "accent": "{{ col.accent }}",
    "gradient": "{{ col.gradient }}",
    "groups": [
      {% for group in col.groups %}
      {
        "key": "{{ group.key }}",
        "title": "{{ group.title }}",
        "icon": "{{ group.icon }}"
      }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ]
  }{% unless forloop.last %},{% endunless %}
  {% endfor %}
]
</script>

<script>
(function () {
  'use strict';

  // 添加专栏页专用 body class
  document.body.classList.add('page-collections');

  var collectionsData = [];
  try {
    collectionsData = JSON.parse(document.getElementById('collections-data').textContent);
  } catch (e) {}

  var currentCol = null;
  var currentGroup = null;

  function getColData(key) {
    return collectionsData.find(function (c) { return c.key === key; }) || null;
  }

  // 专栏切换
  window.selectCollection = function (key) {
    var col = getColData(key);
    if (!col) return;

    currentCol = key;
    currentGroup = null;

    // 更新左侧导航高亮
    document.querySelectorAll('.collections-nav-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.col === key);
    });

    // 关闭移动端导航
    document.getElementById('collections-nav').classList.remove('open');

    // 更新 Hero
    var hero = document.getElementById('collections-hero');
    hero.style.setProperty('--hero-gradient', col.gradient);
    hero.style.setProperty('--hero-accent', col.accent);
    document.getElementById('hero-icon').innerHTML = '<i class="' + col.icon + '"></i>';
    document.getElementById('hero-title').textContent = col.title;
    document.getElementById('hero-desc').textContent = col.description;

    // 渲染分组圆球
    renderSpheres(col);

    // 显示该专栏全部文章
    showCards(key, null);

    // 显示分组区和卡片区
    document.getElementById('group-spheres-section').style.display = '';
    document.getElementById('collections-grid-section').style.display = '';
    document.getElementById('nav-toggle-label').textContent = col.title;
  };

  function renderSpheres(col) {
    var container = document.getElementById('group-spheres');
    container.innerHTML = '';
    col.groups.forEach(function (group) {
      var btn = document.createElement('button');
      btn.className = 'group-sphere';
      btn.dataset.group = group.key;
      btn.style.setProperty('--sphere-accent', col.accent);
      btn.innerHTML =
        '<i class="' + group.icon + '"></i>' +
        '<span>' + group.title + '</span>';
      btn.onclick = function () { toggleGroup(group.key, btn); };
      container.appendChild(btn);
    });
    document.getElementById('group-clear-btn').style.display = 'none';
  }

  // 分组圆球点击
  function toggleGroup(key, btn) {
    if (currentGroup === key) {
      // 再次点击 → 取消过滤
      clearGroupFilter();
      return;
    }
    currentGroup = key;
    document.querySelectorAll('.group-sphere').forEach(function (b) {
      b.classList.toggle('active', b.dataset.group === key);
    });
    document.getElementById('group-clear-btn').style.display = '';
    showCards(currentCol, key);
  }

  window.clearGroupFilter = function () {
    currentGroup = null;
    document.querySelectorAll('.group-sphere').forEach(function (b) {
      b.classList.remove('active');
    });
    document.getElementById('group-clear-btn').style.display = 'none';
    showCards(currentCol, null);
  };

  function showCards(colKey, groupKey) {
    var cards = document.querySelectorAll('.book-card');
    var visible = 0;

    cards.forEach(function (card) {
      var colMatch = card.dataset.col === colKey;
      var groupMatch = true;
      if (groupKey) {
        var groups = card.dataset.groups ? card.dataset.groups.split(',') : [];
        groupMatch = groups.indexOf(groupKey) !== -1;
      }
      var show = colMatch && groupMatch;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    // 更新标签和计数
    var labelText = groupKey
      ? (getColData(currentCol).groups.find(function (g) { return g.key === groupKey; }) || {}).title || '分组文章'
      : '全部文章';
    document.getElementById('grid-label-text').textContent = labelText;
    document.getElementById('grid-count').textContent = visible + ' 篇';

    var empty = document.getElementById('collections-empty');
    empty.style.display = visible === 0 ? '' : 'none';
  }

  // 移动端导航 toggle
  window.toggleNav = function () {
    document.getElementById('collections-nav').classList.toggle('open');
  };

  // 默认激活第一个专栏
  var firstKey = collectionsData.length ? collectionsData[0].key : null;
  if (firstKey) {
    setTimeout(function () { selectCollection(firstKey); }, 50);
  }
})();
</script>
