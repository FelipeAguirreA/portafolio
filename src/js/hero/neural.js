// Red neuronal del hero (canvas)

// ============================================
// Red neuronal del hero (canvas) — reemplaza los anillos (estilo V11)
// ============================================
window.addEventListener('load', function initHeroNeural() {
    const canvas = document.getElementById('hero-neural');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const TEAL = '67,214,192', EMBER = '255,157,107';
    let W, CXn, CYn, nodes;

    function setup() {
        const size = canvas.clientWidth || 480;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = size * dpr; canvas.height = size * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        W = size; CXn = CYn = size / 2;
        const photoR = size * 0.31;
        const bandMin = photoR + size * 0.04;
        const bandWidth = (size / 2 - bandMin) * 0.92;
        const N = 34;
        nodes = [];
        for (let i = 0; i < N; i++) {
            nodes.push({
                base: bandMin + Math.random() * bandWidth,
                a: Math.random() * 6.2832,
                speed: (Math.random() * 0.0004 + 0.00012) * (Math.random() < 0.5 ? 1 : -1),
                phase: Math.random() * 6.2832,
                hue: Math.random() < 0.3 ? EMBER : TEAL  // V11: teal con ~30% ember
            });
        }
    }

    function place() { nodes.forEach(n => { n.x = CXn + Math.cos(n.a) * n.base; n.y = CYn + Math.sin(n.a) * n.base; }); }

    function draw(t) {
        const nr = W * 0.19;
        ctx.clearRect(0, 0, W, W);
        nodes.forEach(n => { n.a += n.speed * 16; const wob = Math.sin(t * 0.001 + n.phase) * (W * 0.018); n.x = CXn + Math.cos(n.a) * (n.base + wob); n.y = CYn + Math.sin(n.a) * (n.base + wob); });
        for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i], b = nodes[j], dd = Math.hypot(a.x - b.x, a.y - b.y);
            if (dd < nr) { ctx.strokeStyle = `rgba(${TEAL},${(1 - dd / nr) * 0.42})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        nodes.forEach(n => { ctx.fillStyle = `rgba(${n.hue},0.9)`; ctx.beginPath(); ctx.arc(n.x, n.y, 2.1, 0, 7); ctx.fill(); });
    }

    setup();
    const animate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (animate) {
        const loop = (t) => { draw(t); requestAnimationFrame(loop); };
        requestAnimationFrame(loop);
    } else {
        place(); draw(0);  // estático: un solo frame
    }

    let rt;
    window.addEventListener('resize', () => {
        clearTimeout(rt);
        rt = setTimeout(() => { setup(); if (!animate) { place(); draw(0); } }, 200);
    });
});
