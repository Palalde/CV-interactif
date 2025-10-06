document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('competences-mobile-btn');
  const titre = document.getElementById('competences-mobile-titre');
  const dyn = document.getElementById('competences-dynamiques');
  let isOpen = false;

  // Si la structure n'est pas présente sur cette page, ne rien faire
  if (!btn || !titre || !dyn) return;

  function toggleCompetencesPanel(forceOpen = null) {
    const next = (typeof forceOpen === 'boolean') ? forceOpen : !isOpen;
    if (next === isOpen) return; // no change
    isOpen = next;
    if (isOpen) {
      btn.classList.add('open');
      if (typeof updateCompetencesDynamiquesBySlider === 'function') {
        updateCompetencesDynamiquesBySlider();
      }
    } else {
      btn.classList.remove('open');
    }
  }

  // --- Drag gesture (vertical) ---
  let dragStartY = 0;
  let dragCurrentY = 0;
  let wasOpenAtDragStart = false;
  let isDraggingPanel = false;
  let lastMoveTime = 0;
  let lastMoveY = 0;
  let dynMaxHeight = 0;

  function ensureDynMaxHeight() {
    if (!dyn) return 0;
    if (dynMaxHeight > 0) return dynMaxHeight;
    // Temporarily simulate open to measure natural height (capped by CSS max-height)
    const prevOpen = btn.classList.contains('open');
    const prevTransform = btn.style.transform;
    btn.classList.add('open');
    btn.style.transform = 'translateY(0)';
    dyn.style.maxHeight = '';
    dyn.style.opacity = '1';
    dyn.style.paddingTop = '6px';
    dyn.style.paddingBottom = '14px';
    dynMaxHeight = dyn.scrollHeight;
    if (!prevOpen) btn.classList.remove('open');
    btn.style.transform = prevTransform;
    dyn.style.maxHeight = '';
    dyn.style.opacity = '';
    dyn.style.paddingTop = '';
    dyn.style.paddingBottom = '';
    return dynMaxHeight;
  }

  function onDragStart(clientY) {
    isDraggingPanel = true;
    dragStartY = clientY;
    dragCurrentY = clientY;
    wasOpenAtDragStart = isOpen;
    btn.classList.add('dragging');
    // Prepare dynamic content for progressive reveal if starting closed
    if (!wasOpenAtDragStart) {
      ensureDynMaxHeight();
      dyn.style.overflow = 'hidden';
      dyn.style.pointerEvents = 'none';
      dyn.style.paddingTop = '6px';
      dyn.style.paddingBottom = '14px';
    } else {
      // Starting open, allow smooth hide
      dyn.style.overflow = 'hidden';
    }
  }

  function onDragMove(clientY) {
    if (!isDraggingPanel) return;
    dragCurrentY = clientY;
    const delta = dragCurrentY - dragStartY; // positive = moving down
    lastMoveTime = performance.now();
    lastMoveY = clientY;
    // Compute a partial translate based on open/closed state
    const panelHeight = btn.offsetHeight;
    let progress; // 0 (closed position transform) -> 1 (fully open)
    if (wasOpenAtDragStart) {
      // Dragging down to close
      progress = 1 - Math.max(0, delta) / panelHeight;
    } else {
      // Dragging up to open
      progress = Math.max(0, -delta) / panelHeight;
    }
    progress = Math.min(1, Math.max(0, progress));
    const translateYClosed = `translateY(calc(100% - var(--panel-collapsed-height)))`;
    const translateYOpen = 'translateY(0)';
    // Interpolate by progress; since we can't calc inside easily, compute pixel fallback
    const closedOffsetPx = btn.getBoundingClientRect().height - 44; // approx collapsed visible
    const interpPx = closedOffsetPx * (1 - progress);
    btn.style.transform = wasOpenAtDragStart
      ? `translateY(${interpPx}px)`
      : `translateY(${Math.max(interpPx,0)}px)`;

    // Progressive content reveal/hide
    if (!wasOpenAtDragStart) {
      // Opening: progress 0->1
      const maxH = dynMaxHeight || ensureDynMaxHeight();
      dyn.style.maxHeight = (maxH * progress) + 'px';
      dyn.style.opacity = String(Math.min(1, Math.max(0, progress * 1.15)));
      if (progress > 0.15) dyn.style.pointerEvents = 'auto';
    } else {
      // Closing: invert progress (remaining open ratio)
      const closingProgress = progress; // 1 -> 0
      const maxH = dynMaxHeight || ensureDynMaxHeight();
      dyn.style.maxHeight = (maxH * closingProgress) + 'px';
      dyn.style.opacity = String(Math.min(1, Math.max(0, closingProgress * 1.1)));
      if (closingProgress < 0.1) dyn.style.pointerEvents = 'none';
    }
  }

  function onDragEnd(clientY) {
    if (!isDraggingPanel) return;
    isDraggingPanel = false;
    btn.classList.remove('dragging');
    // Determine velocity / direction
    const delta = clientY - dragStartY;
    const elapsed = performance.now() - lastMoveTime;
    let velocity = 0;
    if (elapsed < 120) {
      // simple velocity calc (px/ms)
      velocity = (clientY - lastMoveY) / elapsed;
    }
    const panelHeight = btn.offsetHeight;
    let shouldOpen;
    if (wasOpenAtDragStart) {
      // Closing gesture if dragged down enough or flicked down
      shouldOpen = !(delta > panelHeight * 0.25 || velocity > 0.9);
    } else {
      // Opening gesture if dragged up enough or flicked up
      shouldOpen = (delta < -panelHeight * 0.25) || velocity < -0.9;
    }
    btn.style.transform = ''; // revert to CSS controlled transform
    toggleCompetencesPanel(shouldOpen);
    // Cleanup inline styles; rely on CSS states
    dyn.style.maxHeight = '';
    dyn.style.opacity = '';
    dyn.style.pointerEvents = '';
    dyn.style.overflow = '';
    dyn.style.paddingTop = '';
    dyn.style.paddingBottom = '';
  }

  // Pointer / touch bindings (attach on grab zone or whole header area)
  function isValidDragStartTarget(target) {
    // Avoid starting drag from inside the dynamic list
    return !target.closest('#competences-dynamiques');
  }

  // Touch
  btn.addEventListener('touchstart', (e) => {
    if (!isValidDragStartTarget(e.target)) return;
    const t = e.touches[0];
    onDragStart(t.clientY);
  }, { passive: true });
  btn.addEventListener('touchmove', (e) => {
    if (!isDraggingPanel) return;
    const t = e.touches[0];
    onDragMove(t.clientY);
  }, { passive: true });
  btn.addEventListener('touchend', (e) => {
    if (!isDraggingPanel) return;
    const t = (e.changedTouches && e.changedTouches[0]) || { clientY: dragCurrentY };
    onDragEnd(t.clientY);
  });
  btn.addEventListener('touchcancel', () => {
    if (!isDraggingPanel) return;
    onDragEnd(dragCurrentY);
  });

  // Mouse
  btn.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    if (!isValidDragStartTarget(e.target)) return;
    onDragStart(e.clientY);
    e.preventDefault();
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDraggingPanel) return;
    onDragMove(e.clientY);
  });
  window.addEventListener('mouseup', (e) => {
    if (!isDraggingPanel) return;
    onDragEnd(e.clientY);
  });

  // Toggle en cliquant sur le conteneur ou le H3 externe
  btn.addEventListener('click', function(e) {
    // Toggle quand clic sur le grab (pseudo via ::before), le titre ou l'arrière-plan du panneau (hors liste)
    const clickedInsideDyn = e.target.closest && e.target.closest('#competences-dynamiques');
    if (clickedInsideDyn) return; // ne pas fermer/ouvir en cliquant dans la liste
    toggleCompetencesPanel();
  });

  // Ouvrir en cliquant sur les titres des sections (hors panneau dynamique)
  document.querySelectorAll('.competences-section .competence-titre').forEach((h3) => {
    h3.addEventListener('click', function() {
      // Ignorer si ce H3 est celui cloné à l'intérieur du panneau dynamique
      if (h3.closest('#competences-dynamiques')) return;
      toggleCompetencesPanel(true);
    });
  });

  // À l'intérieur du panneau dynamique: seul le H3 (entête) doit fermer; les items ne ferment pas
  // Les clics à l'intérieur du contenu dynamique ne ferment plus le panneau
  dyn.addEventListener('click', function(e) {
    // Intentionally empty to swallow but not toggle
  });

  // Par défaut, cacher dynamiques
  // Initial state: closed (handled by CSS transform)
  btn.classList.remove('open');
});
