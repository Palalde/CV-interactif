// Page d'accueil 
document.addEventListener('DOMContentLoaded', function() {
  // Stable viewport height to avoid mobile URL/tab bars causing jumps
  (function setupStableVh() {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--app-vh', `${vh}vh`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);
  })();
  const homeLink = document.getElementById('header-home-link');
  if (homeLink) {
    homeLink.addEventListener('click', function() {
      // Si on est sur cv.html, rediriger vers index.html
      // Sinon, rediriger vers cv.html
      const currentPath = window.location.pathname;
      const isCvPage = currentPath.includes('cv.html') || currentPath.endsWith('/cv.html');
      
      if (isCvPage) {
        window.location.href = '/';
      } else {
        window.location.href = '/html/cv.html';
      }
    });
  }

  // Classic CV download overlay management
  const downloadOverlay = document.getElementById('cv-download-overlay');
  const classicCvLink = document.querySelector('.classic-cv-block');
  const downloadOverlayCloseBtn = downloadOverlay ? downloadOverlay.querySelector('.download-overlay-close') : null;
  const downloadOverlayPrimaryAction = downloadOverlay ? downloadOverlay.querySelector('[data-download-primary]') : null;
  let downloadOverlayLastFocus = null;

  function isDownloadOverlayOpen() {
    return downloadOverlay && downloadOverlay.getAttribute('aria-hidden') === 'false';
  }

  function focusFirstDownloadControl() {
    if (!downloadOverlay) return;
    const focusable = downloadOverlay.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  }

  function handleDownloadOverlayKeydown(event) {
    if (!isDownloadOverlayOpen()) {
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDownloadOverlay();
      return;
    }
    if (event.key !== 'Tab') {
      return;
    }
    const focusable = downloadOverlay.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) {
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function openDownloadOverlay(trigger) {
    if (!downloadOverlay) {
      return;
    }
    if (isDownloadOverlayOpen()) {
      return;
    }
    downloadOverlayLastFocus = trigger || document.activeElement;
    downloadOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('download-overlay-open');
    document.addEventListener('keydown', handleDownloadOverlayKeydown);
    setTimeout(() => {
      if (downloadOverlayPrimaryAction) {
        downloadOverlayPrimaryAction.focus();
      } else {
        focusFirstDownloadControl();
      }
    }, 0);
  }

  function closeDownloadOverlay() {
    if (!downloadOverlay || !isDownloadOverlayOpen()) {
      return;
    }
    downloadOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('download-overlay-open');
    document.removeEventListener('keydown', handleDownloadOverlayKeydown);
    if (downloadOverlayLastFocus && typeof downloadOverlayLastFocus.focus === 'function') {
      downloadOverlayLastFocus.focus();
    }
  }

  if (classicCvLink) {
    classicCvLink.addEventListener('click', (event) => {
      if (!downloadOverlay) {
        return;
      }
      event.preventDefault();
      openDownloadOverlay(classicCvLink);
    });
    classicCvLink.addEventListener('keydown', (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && downloadOverlay) {
        event.preventDefault();
        openDownloadOverlay(classicCvLink);
      }
    });
  }

  if (downloadOverlayCloseBtn) {
    downloadOverlayCloseBtn.addEventListener('click', () => {
      closeDownloadOverlay();
    });
  }

  if (downloadOverlay) {
    downloadOverlay.addEventListener('mousedown', (event) => {
      if (event.target === downloadOverlay) {
        closeDownloadOverlay();
      }
    });
    downloadOverlay.addEventListener('click', (event) => {
      if (event.target === downloadOverlay) {
        closeDownloadOverlay();
      }
    });
  }

  if (downloadOverlayPrimaryAction) {
    downloadOverlayPrimaryAction.addEventListener('click', () => {
      setTimeout(() => {
        closeDownloadOverlay();
      }, 120);
    });
  }

  const competencesData = Array.isArray(window.CV_COMPETENCES) ? window.CV_COMPETENCES : [];
  const competencesByPeriode = competencesData.reduce((accumulator, competence) => {
    if (!competence || !competence.periode) {
      return accumulator;
    }
    const key = competence.periode;
    if (!accumulator[key]) {
      accumulator[key] = [];
    }
    accumulator[key].push(competence);
    return accumulator;
  }, {});
  const competencesById = competencesData.reduce((accumulator, competence) => {
    if (competence && competence.id) {
      accumulator[competence.id] = competence;
    }
    return accumulator;
  }, {});
  const desktopMediaQuery = window.matchMedia('(min-width: 715px)');

  function buildCompetencesList(competences, options = {}) {
    const interactive = options.interactive === true;
    const listElement = document.createElement('ul');
    listElement.className = 'liste-competences';

    competences.forEach((competence) => {
      if (!competence || !competence.name) {
        return;
      }
      const listItem = document.createElement('li');
      listItem.className = 'item-competence';

      if (competence.description) {
        listItem.setAttribute('title', competence.description);
      }

      if (competence.id) {
        listItem.dataset.competenceId = competence.id;
      }
      listItem.dataset.competenceName = competence.name;
      if (competence.periode) {
        listItem.dataset.competencePeriode = competence.periode;
      }

      if (interactive) {
        listItem.classList.add('interactive');
        listItem.setAttribute('role', 'button');
        listItem.tabIndex = 0;
      }

      if (!interactive && competence.link) {
        const link = document.createElement('a');
        link.href = competence.link;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = competence.name;
        listItem.appendChild(link);
      } else {
        listItem.textContent = competence.name;
      }

      listElement.appendChild(listItem);
    });

    return listElement;
  }

  function renderCompetencesInContainer(container, periode) {
    if (!container) {
      return;
    }

    const competences = competencesByPeriode[periode] || [];
    container.innerHTML = '';

    if (competences.length === 0) {
      return;
    }

    const isDynamicPanel = container.id === 'competences-dynamiques';
    const isStaticSection = !isDynamicPanel && container.classList.contains('competences-list');
    const shouldBeInteractive = isDynamicPanel || (isStaticSection && desktopMediaQuery.matches);
    const listElement = buildCompetencesList(competences, { interactive: shouldBeInteractive });
    container.appendChild(listElement);

    if (shouldBeInteractive) {
      attachCompetenceItemActions(listElement);
    }

    // Déclencher un événement pour que favorites-ui.js puisse ajouter les étoiles
    const event = new CustomEvent('competences-updated', { 
      detail: { container, periode, isDynamicPanel } 
    });
    document.dispatchEvent(event);
  }

  function populateStaticCompetenceSections() {
    const staticContainers = document.querySelectorAll('.competences-section .competences-list');
    staticContainers.forEach((container) => {
      let periode = container.getAttribute('data-periode');
      if (!periode) {
        const section = container.closest('.competences-section');
        if (section && section.id) {
          periode = section.id.replace('competences-', '');
        }
      }
      renderCompetencesInContainer(container, periode || '');
    });
  }

  function attachCompetenceItemActions(listElement) {
    if (!listElement) {
      return;
    }

    const items = listElement.querySelectorAll('.item-competence');
    items.forEach((item) => {
      const competenceId = item.dataset.competenceId;
      const fallbackName = item.dataset.competenceName || item.textContent || '';
      const competence = competenceId ? competencesById[competenceId] : null;
      const searchTerm = competence ? competence.name : fallbackName.trim();
      if (!searchTerm) {
        return;
      }

      function triggerSearchOverlay() {
        if (typeof window.openSearchOverlayWithQuery === 'function') {
          window.openSearchOverlayWithQuery(searchTerm, { trigger: item });
        }
      }

      item.addEventListener('click', (event) => {
        // NE PAS déclencher si on clique sur l'étoile de favoris
        if (event.target.closest('.favorite-star')) {
          return;
        }
        event.preventDefault();
        // NE PAS stopPropagation() pour permettre la délégation d'événements
        triggerSearchOverlay();
      });

      item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          // NE PAS déclencher si on est focus sur l'étoile
          if (event.target.closest('.favorite-star')) {
            return;
          }
          event.preventDefault();
          triggerSearchOverlay();
        }
      });
    });
  }

  populateStaticCompetenceSections();

  function handleDesktopBreakpointChange() {
    populateStaticCompetenceSections();
  }

  if (typeof desktopMediaQuery.addEventListener === 'function') {
    desktopMediaQuery.addEventListener('change', handleDesktopBreakpointChange);
  } else if (typeof desktopMediaQuery.addListener === 'function') {
    desktopMediaQuery.addListener(handleDesktopBreakpointChange);
  }
// RANGE SLIDER
// Focus + Thumb dynamique adapté au lightmode
  document.querySelectorAll('.range-slider').forEach(function(slider) {
    // Blur on mouseleave
    slider.addEventListener('mouseleave', function() {
      this.blur();
    });

    function updateThumb(slider, isFocus) {
      const v = parseInt(slider.value, 10);
      const isLight = document.body.classList.contains('light');
      let img, imgFocus;

      if (isLight) {
        // Light mode mapping
        if (v >= 37.5 && v < 75) {
          img = "trading-beige.png";
          imgFocus = "trading-noir.png";
        } else if (v >= 75 && v < 112.5) {
          img = "leclerc-beige.png";
          imgFocus = "leclerc-noir.png";
        } else if (v >= 112.5 && v <= 150) {
          img = "code-beige.png";
          imgFocus = "code-noir.png";
        } else {
          img = "etudes-beige.png";
          imgFocus = "etudes-noir.png";
        }
      } else {
        // Dark mode mapping
        if (v >= 37.5 && v < 75) {
          img = "trading-bleu.png";
          imgFocus = "trading-blanc.png";
        } else if (v >= 75 && v < 112.5) {
          img = "leclerc-bleu.png";
          imgFocus = "leclerc-blanc.png";
        } else if (v >= 112.5 && v <= 150) {
          img = "code-bleu.png";
          imgFocus = "code-blanc.png";
        } else {
          img = "etudes-bleu.png";
          imgFocus = "etudes-blanc.png";
        }
      }
  const base = isFocus ? imgFocus : img;
  const mode = isLight ? 'lightmode' : 'darkmode';
  slider.style.setProperty('--thumb-img', `url("/img/rangeslider/${mode}/${base}")`);
    }

    // Initial
    updateThumb(slider, false);

    // On input
    slider.addEventListener('input', function() {
      updateThumb(this, this === document.activeElement);
    });

    // On focus/blur
    slider.addEventListener('focus', function() {
      updateThumb(this, true);
    });
    slider.addEventListener('blur', function() {
      updateThumb(this, false);
    });

    // Update thumb on theme change
    const observer = new MutationObserver(() => {
      updateThumb(slider, slider === document.activeElement);
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  });
// EMPLACEMENT TEMPORAIRE DU SLIDE
  const slider = document.querySelector('.content-slider');
  const rangeSlider = document.getElementById('myRange'); // Your existing range slider
  const sections = document.querySelectorAll('.content-section');
  const sectionCount = sections.length;
  const sectionsOrder = Array.from(sections);
  const periodeToRangeValue = sectionsOrder.reduce((accumulator, section, index) => {
    if (section && section.id) {
      accumulator[section.id] = index * 50;
    }
    return accumulator;
  }, {});
  
  // Variables for touch handling
  let startX = 0;
  let currentTranslate = 0;
  let isDragging = false;
  let currentIndex = 0;
  // Helpers to control snap markers visibility during interactions
  let hideSnapMarkers = function(){};
  let showSnapMarkers = function(){};
  // Helper to emit input event so thumb image updates on mobile
  function emitRangeInput() {
    try {
      rangeSlider.dispatchEvent(new Event('input', { bubbles: true }));
    } catch (e) {
      // Fallback for older browsers
      const ev = document.createEvent('Event');
      ev.initEvent('input', true, true);
      rangeSlider.dispatchEvent(ev);
    }
  }
  
  // Initialize range slider value
  rangeSlider.min = 0;
  rangeSlider.max = (sectionCount - 1) * 37.5 + 37.5; 
  rangeSlider.value = 0;
  
  // Function to update content based on slider value
  function updateContent() {
    const value = parseInt(rangeSlider.value);
    const newIndex = Math.floor(value / 50);
    
    if (newIndex !== currentIndex) {
      currentIndex = newIndex;
    }
    
    // Calculate precise position within the section (for smooth transitions)
    const sectionProgress = (value % 50) / 50;
    const exactPosition = -(currentIndex + sectionProgress) * (100 / sectionCount);
    
    slider.style.transform = `translateX(${exactPosition}%)`;
    
    // Apply different styling based on the active section
    updateStyling(currentIndex);
  }
  
  // Function to update section-specific styling
  function updateStyling(index) {
    // You can add custom styling transitions here
    sections.forEach((section, i) => {
      if (i === index) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });
    // When Trading slide is active, reset the press hint overlay
    const activeSection = sections[index];
    if (activeSection && activeSection.id === 'trading' && typeof window.resetTradingPressHint === 'function') {
      try { window.resetTradingPressHint(); } catch (_) {}
    }
  }
  
  // Ajouter des marqueurs visuels pour les points de snap
  function addSnapMarkers() {
    const sliderContainer = document.querySelector('.range-slider-container');
    
    // Positions des snaps (en pourcentage)
    const snapPositions = [0.5, 33.33, 66.66, 99.5];
    
    // Créer un conteneur pour les marqueurs
    const markersContainer = document.createElement('div');
    markersContainer.className = 'snap-markers-container';
    markersContainer.style.cssText = `
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 0;
      pointer-events: none;
    `;
    
  const markerElements = [];
  let markersForcedHidden = false;
    
    // Créer chaque marqueur
    snapPositions.forEach(position => {
      const marker = document.createElement('div');
      marker.className = 'snap-marker';
      marker.style.cssText = `
        position: absolute;
        top: 50%;
        left: ${position}%;
        transform: translate(-50%, -50%);
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: var(--background-general-light);
        border: 2px solid var(--background-surface-dark);
        pointer-events: none;
        transition: opacity 0.2s ease;
      `;
      markersContainer.appendChild(marker);
      markerElements.push({ element: marker, position: position });
    });
    
    // Ajouter le conteneur au slider
    sliderContainer.appendChild(markersContainer);
    
    // Helpers opacity + visibilité contextuelle
    function setAllMarkersOpacity(opacity) {
      markerElements.forEach(m => { m.element.style.opacity = opacity; });
    }

    // Fonction pour cacher les marqueurs sous le thumb
    function updateSnapMarkersVisibility() {
      if (markersForcedHidden) return;
      const thumbPosition = (rangeSlider.value / rangeSlider.max) * 100;
      
      markerElements.forEach(marker => {
        // Calculer la proximité du thumb avec le marqueur
        const distance = Math.abs(thumbPosition - marker.position);
        
        // Si le thumb est proche du marqueur, le cacher
        if (distance < 15) {
          marker.element.style.opacity = '0';
        } else {
          marker.element.style.opacity = '1';
        }
      });
    }
    
    // Écouter les changements sur le slider pour mettre à jour la visibilité des marqueurs
    rangeSlider.addEventListener('input', updateSnapMarkersVisibility);
    
    // Mise à jour des marqueurs pour le mode clair/sombre
    const observer = new MutationObserver(() => {
      const isLight = document.body.classList.contains('light');
      markerElements.forEach(marker => {
        if (isLight) {
          marker.element.style.background = 'var(--background-general-dark)';
          marker.element.style.borderColor = 'var(--background-surface-light)';
        } else {
          marker.element.style.background = 'var(--background-general-light)';
          marker.element.style.borderColor = 'var(--background-surface-dark)';
        }
      });
    });
    
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    // Appel initial pour définir la visibilité
    updateSnapMarkersVisibility();

    // Expose des helpers pour masquer/afficher pendant l'interaction
    hideSnapMarkers = function() {
      markersForcedHidden = true;
      setAllMarkersOpacity('0');
    };
    showSnapMarkers = function() {
      markersForcedHidden = false;
      updateSnapMarkersVisibility();
    };
  }
  
  // Appeler la fonction pour ajouter les marqueurs
  addSnapMarkers();

  // Ajouter un fin bandeau de swipe sous la chart trading (slide 2)
  (function addTradingSwipeStrip() {
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    const container = document.querySelector('#trading .contenu-principal');
    if (!container) return;

    const existing = document.getElementById('trading-swipe-strip');
    if (!isTouch) {
      // Supprimer si présent sur un device non-touch
      if (existing) existing.remove();
      return;
    }
    // Device tactile: ajouter si pas déjà en place
    if (existing) return; // déjà ajouté

    const strip = document.createElement('div');
    strip.id = 'trading-swipe-strip';
    strip.className = 'trading-swipe-strip';
    strip.setAttribute('aria-label', 'Balayez horizontalement pour changer de section');
    strip.innerHTML = '<div class="swipe-hint" aria-hidden="true"><span class="arrow left">◀</span><span class="dots"></span><span class="arrow right">▶</span></div>';
    container.appendChild(strip);
  })();
  
  // Range slider event listener
  rangeSlider.addEventListener('input', function() {
    updateContent();
    updateCompetencesDynamiquesBySlider();
  });
  // Masquer les marqueurs pendant interaction directe avec le range slider
  rangeSlider.addEventListener('pointerdown', () => hideSnapMarkers());
  rangeSlider.addEventListener('mousedown', () => hideSnapMarkers());
  rangeSlider.addEventListener('touchstart', () => hideSnapMarkers(), { passive: true });
  
  // Touch events for swiping
  let startIndex = 0;
  let startRangeValue = 0;
  let blockSwipe = false; // Empêche le swipe si on interagit avec la chart
  slider.addEventListener('touchstart', (e) => {
    // Si le touch commence sur la chart, ne pas initier le swipe
    const chartEl = document.getElementById('trading-live-chart');
    blockSwipe = !!(chartEl && e.target && e.target.closest && e.target.closest('#trading-live-chart'));
    if (blockSwipe) return;

  // masquer les marqueurs pendant le swipe
  hideSnapMarkers();

    startX = e.touches[0].clientX;
    isDragging = true;
    // État de départ
    startRangeValue = parseFloat(rangeSlider.value);
    startIndex = Math.round(startRangeValue / 50);
  }, { passive: true });

  slider.addEventListener('touchmove', (e) => {
    if (blockSwipe || !isDragging) return;

    const currentX = e.touches[0].clientX;
    const diff = currentX - startX; // >0 vers la droite, <0 vers la gauche
    const containerWidth = slider.parentElement.offsetWidth || 1;

    // Mapping du déplacement du doigt -> valeur du slider (max 1 slide)
    const deltaRange = -(diff / containerWidth) * 50; // 1 largeur = 1 slide
    const minAllowed = Math.max(0, (startIndex - 1) * 50);
    const maxAllowed = Math.min(parseFloat(rangeSlider.max), (startIndex + 1) * 50);
    const tentative = Math.min(maxAllowed, Math.max(minAllowed, startIndex * 50 + deltaRange));

    rangeSlider.value = tentative;
    updateContent();
    emitRangeInput();
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
  if (blockSwipe) { blockSwipe = false; return; }
  if (!isDragging) return;
    isDragging = false;

    const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : startX;
    const diff = endX - startX;
    const containerWidth = slider.parentElement.offsetWidth || 1;

    // Seuil "classique": ~20% de la largeur pour changer de slide
    const swipeThresholdRatio = 0.2;
    const shouldGoNext = diff < -containerWidth * swipeThresholdRatio;
    const shouldGoPrev = diff > containerWidth * swipeThresholdRatio;

    let targetIndex = startIndex;
    if (shouldGoNext) {
      targetIndex = Math.min(sectionCount - 1, startIndex + 1);
    } else if (shouldGoPrev) {
      targetIndex = Math.max(0, startIndex - 1);
    }

    const finalValue = targetIndex * 50;
    rangeSlider.value = finalValue;
    updateContent();
    updateCompetencesDynamiquesBySlider();
    emitRangeInput();
  // ré-afficher les marqueurs après le swipe
  showSnapMarkers();
  });

  // Gère l'annulation (perte du contact)
  slider.addEventListener('touchcancel', () => {
  if (blockSwipe) { blockSwipe = false; return; }
  isDragging = false;
    const value = Math.round(rangeSlider.value / 50) * 50;
    rangeSlider.value = value;
    updateContent();
    updateCompetencesDynamiquesBySlider();
    emitRangeInput();
  // ré-afficher les marqueurs
  showSnapMarkers();
  });
  
  // Fonction pour accrocher le slider à la position la plus proche
  function snapSliderToNearestPosition() {
    const value = Math.round(rangeSlider.value / 50) * 50;
    rangeSlider.value = value;
    updateContent();
    emitRangeInput();
  }
  
  // Snap au relâchement de la souris
  rangeSlider.addEventListener('mouseup', function() {
    snapSliderToNearestPosition();
    updateCompetencesDynamiquesBySlider();
  showSnapMarkers();
  });
  
  // Snap lorsque l'utilisateur clique directement sur le slider
  rangeSlider.addEventListener('click', function() {
    snapSliderToNearestPosition();
    updateCompetencesDynamiquesBySlider();
  showSnapMarkers();
  });
  
  // S'assurer que le snap s'applique même si la souris est relâchée en dehors du slider
  document.addEventListener('mouseup', () => {
    if (document.activeElement === rangeSlider) {
      snapSliderToNearestPosition();
      updateCompetencesDynamiquesBySlider();
    }
    showSnapMarkers();
  });

  // Mobile: snap + markers après touchend sur le range slider
  rangeSlider.addEventListener('touchend', function() {
    snapSliderToNearestPosition();
    updateCompetencesDynamiquesBySlider();
    showSnapMarkers();
  }, { passive: true });
  
  // Fonction pour mettre à jour les compétences dynamiques selon la position du slider
  function getPeriodeFromSliderValue(value) {
    if (value < 37.5) {
      return 'etudes';
    }
    if (value < 75) {
      return 'trading';
    }
    if (value < 112.5) {
      return 'leclerc';
    }
    return 'dev';
  }

  function updateCompetencesDynamiquesBySlider() {
    const dynContainer = document.getElementById('competences-dynamiques');
    if (!dynContainer) {
      return;
    }

    const sliderValue = parseFloat(rangeSlider.value);
    const periode = getPeriodeFromSliderValue(Number.isNaN(sliderValue) ? 0 : sliderValue);
    renderCompetencesInContainer(dynContainer, periode);
  }

  window.updateCompetencesDynamiquesBySlider = updateCompetencesDynamiquesBySlider;

  function normalisePeriodeKey(value) {
    if (typeof value !== 'string') {
      if (value == null) {
        return '';
      }
      value = String(value);
    }
    return value
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase();
  }

  function navigateTimelineToPeriode(periode) {
    if (!rangeSlider || !periode) {
      return;
    }

    const targetKey = Object.keys(periodeToRangeValue).find((key) => {
      return normalisePeriodeKey(key) === normalisePeriodeKey(periode);
    });

    if (!targetKey) {
      return;
    }

    const targetValue = periodeToRangeValue[targetKey];
    const minValue = Number.isNaN(parseFloat(rangeSlider.min)) ? 0 : parseFloat(rangeSlider.min);
    const maxValue = Number.isNaN(parseFloat(rangeSlider.max)) ? targetValue : parseFloat(rangeSlider.max);
    const clampedValue = Math.min(Math.max(targetValue, minValue), maxValue);

    rangeSlider.value = clampedValue;
    updateContent();
    updateCompetencesDynamiquesBySlider();
    emitRangeInput();
    showSnapMarkers();
  }

  window.navigateTimelineToPeriode = navigateTimelineToPeriode;
  
  // Initialisation du contenu dynamique au chargement
  updateCompetencesDynamiquesBySlider();
  
  // Initialize content position
  updateContent();
});
