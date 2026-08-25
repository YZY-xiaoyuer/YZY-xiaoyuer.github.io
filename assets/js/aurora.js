// aurora.js — Cyberpunk Neon ORB Background
(function () {
  'use strict';

  const COLORS = ['#00ffcc', '#ff00aa', '#ff6b00', '#cc00ff', '#00e5ff'];
  const ORB_COUNT = 5;
  const OPACITY = 0.18;

  // 存储 animationId 以便通过 cancelAnimationFrame 终止循环（fix: issue #7）
  let animationId = null;

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }

  function createOrbs(w, h) {
    return Array.from({ length: ORB_COUNT }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: 200 + Math.random() * 250,
      color: COLORS[i % COLORS.length],
    }));
  }

  // 停止动画循环并移除 canvas 元素（fix: issue #6 #7）
  function cleanup() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    const existing = document.getElementById('aurora-canvas');
    if (existing) existing.remove();
  }

  function init() {
    // 不在浅色模式启用（检测 documentElement 的 data-bs-theme）
    if (document.documentElement.getAttribute('data-bs-theme') === 'light') return;

    // 防止重复初始化（主题切换触发时 canvas 可能已存在）
    if (document.getElementById('aurora-canvas')) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'aurora-canvas';
    canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100vw;height:100vh;' +
      'z-index:-1;pointer-events:none;';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    let orbs = createOrbs(w, h);

    window.addEventListener('resize', () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    });

    function draw() {
      ctx.clearRect(0, 0, w, h);

      orbs.forEach((orb) => {
        const rgb = hexToRgb(orb.color);
        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        grad.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${OPACITY})`);
        grad.addColorStop(0.5, `rgba(${rgb.r},${rgb.g},${rgb.b},${OPACITY * 0.4})`);
        grad.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);

        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();

        // Move
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < -orb.radius) orb.x = w + orb.radius;
        if (orb.x > w + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = h + orb.radius;
        if (orb.y > h + orb.radius) orb.y = -orb.radius;
      });

      // fix issue #7: 存储返回值以支持 cancelAnimationFrame
      animationId = requestAnimationFrame(draw);
    }

    draw();
  }

  // fix issue #6: 监听运行时主题切换，浅色模式下清理 canvas；切回暗色模式时重启
  const themeObserver = new MutationObserver(() => {
    const theme = document.documentElement.getAttribute('data-bs-theme');
    if (theme === 'light') {
      cleanup();
    } else {
      init();
    }
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-bs-theme'],
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
