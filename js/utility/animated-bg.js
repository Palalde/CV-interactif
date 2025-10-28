// Animated background for index (landing)
// - Three lightweight motifs: typing code lines, drawing charts, floating fruits/veggies
// - Theme-aware, responsive to DPR and resize, respects prefers-reduced-motion
// - Non-blocking: runs only on index (body.landing) and pauses when tab hidden

(function () {
  if (!document.body.classList.contains('landing')) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('animated-bg');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) {
    console.error('Canvas context not available');
    return;
  }

  // Safari-compatible timestamp
  const now = () => performance.now ? performance.now() : Date.now();

  // DPR-aware sizing
  function sizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = { w: window.innerWidth, h: window.innerHeight };
    canvas.width = Math.max(1, Math.floor(rect.w * dpr));
    canvas.height = Math.max(1, Math.floor(rect.h * dpr));
    canvas.style.width = rect.w + 'px';
    canvas.style.height = rect.h + 'px';
    // Reset transform completely before scaling (iOS fix)
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
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
    ctx.lineCap = 'butt';
    const step = 36;
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    // Vertical lines
    ctx.beginPath();
    for (let x = 0; x < w; x += step) {
      ctx.moveTo(Math.round(x), 0);
      ctx.lineTo(Math.round(x), h);
    }
    try {
      ctx.stroke();
    } catch (e) {}
    
    // Horizontal lines
    ctx.beginPath();
    for (let y = 0; y < h; y += step) {
      ctx.moveTo(0, Math.round(y));
      ctx.lineTo(w, Math.round(y));
    }
    try {
      ctx.stroke();
    } catch (e) {}
    
    ctx.restore();
  }

  function drawCode(theme, dt) {
    const t = theme;
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
      
      // Draw each line separately with save/restore for iOS stability
      ctx.save();
      ctx.font = '12px Menlo, Monaco, Consolas, "Courier New", monospace';
      ctx.textBaseline = 'top';
      ctx.fillStyle = t.code;
      try {
        ctx.fillText(text, Math.round(x), Math.round(line.y));
      } catch (e) {
        // Fallback if text rendering fails
      }
      
      // blinking caret (skip in reduced motion)
      if (!prefersReduced && Math.floor(line.progress) % 2 === 0) {
        ctx.fillStyle = t.codeStrong;
        const caretX = x + ctx.measureText(text).width + 1;
        ctx.fillRect(Math.round(caretX), Math.round(line.y + 1), 6, 12);
      }
      ctx.restore();
    });
  }

  function drawChart(theme, dt) {
    if (prefersReduced) return; // Skip in reduced motion
    
    chartProgress += dt * 0.6;
    if (chartProgress > 1.2) chartProgress = 0;
    const t = theme;
    const maxIndex = Math.floor(chartPtsUp.length * Math.min(1, chartProgress));
    
    // up trend
    ctx.save();
    ctx.strokeStyle = t.chartUp;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let i = 0; i < maxIndex; i++) {
      const p = chartPtsUp[i];
      if (i === 0) ctx.moveTo(Math.round(p.x), Math.round(p.y));
      else ctx.lineTo(Math.round(p.x), Math.round(p.y));
    }
    try {
      ctx.stroke();
    } catch (e) {
      // iOS stroke rendering can fail
    }
    ctx.restore();
    
    // down trend
    ctx.save();
    ctx.strokeStyle = t.chartDown;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    const maxIdx2 = Math.floor(chartPtsDown.length * Math.max(0, Math.min(1, chartProgress - 0.2)));
    for (let i = 0; i < maxIdx2; i++) {
      const p = chartPtsDown[i];
      if (i === 0) ctx.moveTo(Math.round(p.x), Math.round(p.y));
      else ctx.lineTo(Math.round(p.x), Math.round(p.y));
    }
    try {
      ctx.stroke();
    } catch (e) {
      // iOS stroke rendering can fail
    }
    ctx.restore();
  }

  function drawFloaters(theme, dt) {
    floaters.forEach(f => {
      f.y -= (f.speed * dt);
      f.x += Math.sin((f.y + f.phase) * 0.02) * 0.6; // gentle horizontal sway
      if (f.y < -20) {
        f.y = window.innerHeight + 20;
        f.x = Math.random() * window.innerWidth;
      }
      // Draw each emoji separately with save/restore for iOS stability
      ctx.save();
      ctx.font = `${f.s}px Arial, Helvetica, sans-serif`;
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = theme.fruit;
      try {
        ctx.fillText(f.emoji, Math.round(f.x), Math.round(f.y));
      } catch (e) {
        // iOS emoji rendering can fail silently
      }
      ctx.restore();
    });
  }

  function clear(theme) {
    ctx.save();
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.restore();
  }

  let last = now();
  let rafId = 0;
  function frame(timestamp) {
    const currentTime = timestamp || now();
    const dt = Math.min(0.05, (currentTime - last) / 1000); // cap dt for stability
    last = currentTime;
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
    if (document.hidden) {
      if (rafId) cancelAnimationFrame(rafId);
    } else {
      last = now();
      rafId = requestAnimationFrame(frame);
    }
  });

  // Resize handling
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      rebuild();
    }, 150);
  });

  // Start
  try {
    console.log('🎨 Starting animated background...');
    rebuild();
    last = now();
    console.log('🎨 Animation initialized, starting RAF...');
    rafId = requestAnimationFrame(frame);
    console.log('🎨 RAF started with ID:', rafId);
  } catch (e) {
    console.error('❌ Animation error:', e);
  }
})();
