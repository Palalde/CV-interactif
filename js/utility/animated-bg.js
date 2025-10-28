// Animated background for index (landing)
// - Three lightweight motifs: typing code lines, drawing charts, floating fruits/veggies
// - Theme-aware, responsive to DPR and resize
// - Non-blocking: runs only on index (body.landing) and pauses when tab hidden

(function () {
  if (!document.body.classList.contains('landing')) return;
  // Force animations to work on all devices (removed prefers-reduced-motion check)
  const prefersReduced = false;
  const canvas = document.getElementById('animated-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // DPR-aware sizing
  function sizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = { w: window.innerWidth, h: window.innerHeight };
    canvas.width = Math.max(1, Math.floor(rect.w * dpr));
    canvas.height = Math.max(1, Math.floor(rect.h * dpr));
    canvas.style.width = rect.w + 'px';
    canvas.style.height = rect.h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // reset and scale to dpr
  }

  // Colors based on theme
  function getTheme() {
    const light = document.body.classList.contains('light');
    return light
      ? {
          bg: '#ecf0f7',
          code: 'rgba(26,26,46,0.45)',
          codeStrong: 'rgba(26,26,46,0.65)',
          grid: 'rgba(0,0,0,0.06)',
          chartUp: 'rgba(59,130,246,0.7)',
          chartDown: 'rgba(239,68,68,0.6)',
          fruit: 'rgba(34,139,34,0.45)'
        }
      : {
          bg: '#151b2d',
          code: 'rgba(231,231,231,0.4)',
          codeStrong: 'rgba(231,231,231,0.65)',
          grid: 'rgba(255,255,255,0.07)',
          chartUp: 'rgba(99,179,237,0.8)',
          chartDown: 'rgba(239,83,80,0.75)',
          fruit: 'rgba(191,219,139,0.55)'
        };
  }

  // Motif A: typing code lines
  const codeSnippets = [
    'const slider = document.getElementById("myRange");',
    'function snap(v){ return Math.round(v/50)*50; }',
    'updateNavIcons(document.body.classList.contains("light"));',
    'createTradingChart("#trading-live-chart");',
    'window.setTradingPhaseTexts([...]);',
    'cloneCompetencesToMobile();'
  ];
  let codeLines = [];
  function initCode() {
    const rows = Math.max(4, Math.min(8, Math.floor(window.innerHeight / 180)));
    codeLines = new Array(rows).fill(0).map((_, i) => ({
      y: 60 + i * 28,
      text: codeSnippets[i % codeSnippets.length],
      progress: Math.random(),
      speed: 2 + Math.random() * 0.6
    }));
  }

  // Motif B: chart polylines drawing
  function makeChartPts(width, height) {
    const cols = Math.max(12, Math.floor(width / 90));
    const baseY = height * 0.62;
    let x = 30;
    const step = (width - 60) / (cols - 1);
    const pts = [];
    let y = baseY;
    for (let i = 0; i < cols; i++) {
      const drift = Math.sin(i * 0.8) * 14 + (Math.random() - 0.5) * 18;
      y = Math.max(30, Math.min(height - 30, baseY - 60 + drift));
      pts.push({ x, y });
      x += step;
    }
    return pts;
  }
  let chartPtsUp = [], chartPtsDown = [], chartProgress = 0;

  // Motif C: floating emojis (fruits/veggies)
  const fruitSet = ['🍎', '🍌', '🍇', '🍓', '🥑', '🥕', '🍊'];
  let floaters = [];
  function initFloaters() {
    const count = Math.max(6, Math.floor((window.innerWidth * window.innerHeight) / 160000));
    const used = [];
    floaters = new Array(count).fill(0).map(() => {
      const emoji = fruitSet[Math.floor(Math.random() * fruitSet.length)];
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const s = 18 + Math.random() * 18; // px font size
      const speed = 6 + Math.random() * 10; // px/s
      const phase = Math.random() * Math.PI * 2;
      return { emoji, x, y, s, speed, phase };
    });
  }

  function drawGrid(theme) {
    ctx.save();
    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    const step = 36;
    for (let x = 0; x < window.innerWidth; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, window.innerHeight);
      ctx.stroke();
    }
    for (let y = 0; y < window.innerHeight; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(window.innerWidth, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawCode(theme, dt) {
    const t = theme;
    ctx.save();
    ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New", monospace';
    ctx.textBaseline = 'top';
    codeLines.forEach((line, idx) => {
      if (!prefersReduced) {
        line.progress += line.speed * dt * 0.5;
        if (line.progress > line.text.length + 12) {
          line.text = codeSnippets[(Math.floor(Math.random() * codeSnippets.length))];
          line.progress = 0;
        }
      } else {
        // Static lines in reduced motion mode
        line.progress = line.text.length;
      }
      const shown = Math.max(0, Math.min(line.text.length, Math.floor(line.progress)));
      const x = 24 + (idx % 2) * 14;
      const text = line.text.slice(0, shown);
      ctx.fillStyle = t.code;
      ctx.fillText(text, x, line.y);
      // blinking caret (skip in reduced motion)
      if (!prefersReduced && Math.floor(line.progress) % 2 === 0) {
        ctx.fillStyle = t.codeStrong;
        const caretX = x + ctx.measureText(text).width + 1;
        ctx.fillRect(caretX, line.y + 1, 6, 12);
      }
    });
    ctx.restore();
  }

  function drawChart(theme, dt) {
    chartProgress += dt * 0.6;
    if (chartProgress > 1.2) chartProgress = 0;
  const t = theme;
    const maxIndex = Math.floor(chartPtsUp.length * Math.min(1, chartProgress));
    ctx.save();
    // up trend
    ctx.strokeStyle = t.chartUp;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < maxIndex; i++) {
      const p = chartPtsUp[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    // down trend
    ctx.strokeStyle = t.chartDown;
    ctx.beginPath();
    const maxIdx2 = Math.floor(chartPtsDown.length * Math.max(0, Math.min(1, chartProgress - 0.2)));
    for (let i = 0; i < maxIdx2; i++) {
      const p = chartPtsDown[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawFloaters(theme, dt) {
    ctx.save();
    floaters.forEach(f => {
      f.y -= (f.speed * dt);
      f.x += Math.sin((f.y + f.phase) * 0.02) * 0.6; // gentle horizontal sway
      if (f.y < -20) {
        f.y = window.innerHeight + 20;
        f.x = Math.random() * window.innerWidth;
      }
      ctx.font = `${f.s}px system-ui, Apple Color Emoji, Segoe UI Emoji`;
      ctx.globalAlpha = 0.8;
      ctx.fillText(f.emoji, f.x, f.y);
    });
    ctx.restore();
  }

  function clear(theme) {
    ctx.save();
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.restore();
  }

  let last = performance.now();
  let rafId = 0;
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); // cap dt for stability
    last = now;
    const theme = getTheme();
    clear(theme);
    drawGrid(theme);
    if (!prefersReduced) {
      drawChart(theme, dt);
      drawFloaters(theme, dt);
    }
    drawCode(theme, dt);
    rafId = requestAnimationFrame(frame);
  }

  function rebuild() {
    sizeCanvas();
    initCode();
    chartPtsUp = makeChartPts(window.innerWidth, window.innerHeight);
    chartPtsDown = makeChartPts(window.innerWidth, window.innerHeight).map(p => ({ x: p.x, y: window.innerHeight - p.y }));
    initFloaters();
  }

  // React to theme toggle
  const themeObserver = new MutationObserver(() => {
    // No need to rebuild; colors come from getTheme(); just repaint next frame
  });
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // Pause when hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else {
      last = performance.now();
      rafId = requestAnimationFrame(frame);
    }
  });

  // Resize handling: debounce to avoid reset on mobile scroll/slide
  let resizeTimeout;
  let lastWidth = window.innerWidth;
  let lastHeight = window.innerHeight;
  
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const widthChanged = Math.abs(window.innerWidth - lastWidth) > 50;
      const heightChanged = Math.abs(window.innerHeight - lastHeight) > 100;
      
      // Only rebuild if significant size change (not just mobile URL bar)
      if (widthChanged || heightChanged) {
        lastWidth = window.innerWidth;
        lastHeight = window.innerHeight;
        rebuild();
      } else {
        // Just resize canvas without resetting animations
        sizeCanvas();
      }
    }, 150);
  });

  // Start
  rebuild();
  rafId = requestAnimationFrame(frame);
})();
