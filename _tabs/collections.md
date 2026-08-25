---
title: 专栏
icon: fas fa-book-open
order: 0
layout: page
permalink: /collections/
---

<div class="collections-page" id="collections-page">

  <!-- Hero 区域 -->
  <div class="collections-hero" id="collections-hero">
    <div class="hero-aurora"></div>
    <div class="hero-body">
      <div class="hero-icon" id="hero-icon"><i class="fas fa-book-open"></i></div>
      <h2 class="hero-title" id="hero-title">专栏知识库</h2>
      <p class="hero-desc" id="hero-desc">从左侧选择感兴趣的技术专栏，探索系统整理的知识体系。</p>
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

</div>

<!-- 专栏数据供 JS 读取 -->
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

  // 将专栏目录注入 Chirpy 主侧边栏（博客名下方）
  function injectSidebarCollections() {
    var sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    var subtitle = sidebar.querySelector('.site-subtitle');
    if (!subtitle) return;

    var counts = {};
    document.querySelectorAll('.book-card').forEach(function (card) {
      var col = card.dataset.col;
      counts[col] = (counts[col] || 0) + 1;
    });

    var section = document.createElement('div');
    section.className = 'sidebar-collections';
    section.innerHTML =
      '<div class="sidebar-col-label"><i class="fas fa-bookmark"></i> 专栏目录</div>' +
      '<ul class="sidebar-col-list">' +
      collectionsData.map(function (col) {
        return '<li>' +
          '<button class="sidebar-col-btn" data-col="' + col.key + '" ' +
          'style="--col-accent:' + col.accent + '" ' +
          'onclick="selectCollection(\'' + col.key + '\')">' +
          '<i class="' + col.icon + '"></i>' +
          '<span class="col-title">' + col.title + '</span>' +
          '<span class="col-badge">' + (counts[col.key] || 0) + '</span>' +
          '</button>' +
          '</li>';
      }).join('') +
      '</ul>';

    subtitle.after(section);
  }

  window.selectCollection = function (key) {
    var col = getColData(key);
    if (!col) return;

    currentCol = key;
    currentGroup = null;

    document.querySelectorAll('.sidebar-col-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.col === key);
    });

    var hero = document.getElementById('collections-hero');
    hero.style.setProperty('--hero-gradient', col.gradient);
    hero.style.setProperty('--hero-accent', col.accent);
    document.getElementById('hero-icon').innerHTML = '<i class="' + col.icon + '"></i>';
    document.getElementById('hero-title').textContent = col.title;
    document.getElementById('hero-desc').textContent = col.description;

    renderSpheres(col);
    showCards(key, null);

    document.getElementById('group-spheres-section').style.display = '';
    document.getElementById('collections-grid-section').style.display = '';
  };

  function renderSpheres(col) {
    var container = document.getElementById('group-spheres');
    container.innerHTML = '';
    col.groups.forEach(function (group) {
      var btn = document.createElement('button');
      btn.className = 'group-sphere';
      btn.dataset.group = group.key;
      btn.style.setProperty('--sphere-accent', col.accent);
      btn.innerHTML = '<i class="' + group.icon + '"></i><span>' + group.title + '</span>';
      btn.onclick = function () { toggleGroup(group.key); };
      container.appendChild(btn);
    });
    document.getElementById('group-clear-btn').style.display = 'none';
  }

  function toggleGroup(key) {
    if (currentGroup === key) {
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

    var labelText = groupKey
      ? (getColData(currentCol).groups.find(function (g) { return g.key === groupKey; }) || {}).title || '分组文章'
      : '全部文章';
    document.getElementById('grid-label-text').textContent = labelText;
    document.getElementById('grid-count').textContent = visible + ' 篇';
    document.getElementById('collections-empty').style.display = visible === 0 ? '' : 'none';
  }

  injectSidebarCollections();

  var firstKey = collectionsData.length ? collectionsData[0].key : null;
  if (firstKey) {
    setTimeout(function () { selectCollection(firstKey); }, 50);
  }
})();
</script>
