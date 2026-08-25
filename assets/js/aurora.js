(function () {
  function init() {
    // 文章详情页不加载极光（检测 Chirpy post 布局标志元素）
    if (document.querySelector('#post-wrapper, .post-content article, article.post')) return;

    // 创建并插入 canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'aurora-bg';
    canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;pointer-events:none;';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let W, H, stars = [];
    let mountainPath = null;

    // ── resize ─────────────────────────────────────────────────────
    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      buildStars();
      buildMountain();
    }

    // ── stars ───────────────────────────────────────────────────────
    function buildStars() {
      stars = Array.from({ length: 300 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H * 0.75,
        r: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.15 + 0.02,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function drawStars(t) {
      stars.forEach(s => {
        const alpha = 0.4 + 0.6 * Math.abs(Math.sin(s.phase + t * s.speed));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
        ctx.fill();
      });
    }

    // ── mountain silhouette ─────────────────────────────────────────
    function buildMountain() {
      mountainPath = new Path2D();
      const pts = [
        [0,         H],
        [0,         H * 0.82],
        [W * 0.06,  H * 0.70],
        [W * 0.13,  H * 0.76],
        [W * 0.20,  H * 0.60],
        [W * 0.27,  H * 0.72],
        [W * 0.35,  H * 0.55],
        [W * 0.42,  H * 0.67],
        [W * 0.50,  H * 0.50],
        [W * 0.58,  H * 0.63],
        [W * 0.65,  H * 0.53],
        [W * 0.73,  H * 0.68],
        [W * 0.80,  H * 0.58],
        [W * 0.87,  H * 0.73],
        [W * 0.94,  H * 0.64],
        [W,         H * 0.78],
        [W,         H],
      ];
      mountainPath.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) mountainPath.lineTo(pts[i][0], pts[i][1]);
      mountainPath.closePath();
    }

    function drawMountain() {
      ctx.fillStyle = '#1A1A3E';
      ctx.fill(mountainPath);
      ctx.strokeStyle = 'rgba(30, 30, 80, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke(mountainPath);
    }

    // ── aurora beam ─────────────────────────────────────────────────
    function drawBeam(cx, cy, angle, spread, c1, c2, alpha, t, phase) {
      const a = angle + Math.sin(t * 0.3 + phase) * 0.08;
      const len = Math.hypot(W, H) * 1.4;
      const x0 = cx + Math.cos(a - spread / 2) * len;
      const y0 = cy + Math.sin(a - spread / 2) * len;
      const x1 = cx + Math.cos(a + spread / 2) * len;
      const y1 = cy + Math.sin(a + spread / 2) * len;

      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, len);
      g.addColorStop(0,   c1.replace('A', (alpha * 0.9).toFixed(2)));
      g.addColorStop(0.35, c1.replace('A', (alpha * 0.5).toFixed(2)));
      g.addColorStop(0.7,  c2.replace('A', (alpha * 0.2).toFixed(2)));
      g.addColorStop(1,    c2.replace('A', '0'));

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.closePath();
      ctx.fillStyle = g;
      ctx.fill();
    }

    // ── render loop ─────────────────────────────────────────────────
    function render(ts) {
      const t = ts * 0.001;

      ctx.fillStyle = '#0A0A14';
      ctx.fillRect(0, 0, W, H);

      drawStars(t);

      // cyan main beam
      drawBeam(W * 0.50, H * 1.05, -Math.PI / 2, 2.0,
        'rgba(0,229,255,A)', 'rgba(0,180,220,A)', 0.45, t, 0);

      // magenta secondary beam
      drawBeam(W * 0.55, H * 1.10, -Math.PI / 2 + 0.3, 1.2,
        'rgba(255,45,120,A)', 'rgba(180,0,90,A)', 0.42, t, 1.8);

      // soft teal accent
      drawBeam(W * 0.44, H * 1.05, -Math.PI / 2 - 0.25, 0.8,
        'rgba(0,255,200,A)', 'rgba(0,200,160,A)', 0.25, t, 3.2);

      drawMountain();

      // top vignette
      const v = ctx.createLinearGradient(0, 0, 0, H * 0.35);
      v.addColorStop(0, 'rgba(10,10,20,0.7)');
      v.addColorStop(1, 'rgba(10,10,20,0)');
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, W, H);

      requestAnimationFrame(render);
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
