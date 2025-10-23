// Search overlay logic: desktop modal (≥715px), mobile fullscreen (<715px)
// Future-ready: will host filters and results grid
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const overlay = document.getElementById('search-overlay');
    if (!overlay) return;

    const modal = overlay.querySelector('.search-modal');
    const closeBtn = overlay.querySelector('.search-overlay-close');
    const overlaySearchSlot = overlay.querySelector('.search-overlay-search-slot');
    const searchResultsContainer = overlay.querySelector('.search-overlay-results');
    const searchPlaceholder = searchResultsContainer
      ? searchResultsContainer.querySelector('.search-overlay-placeholder')
      : null;
    const filterButtons = Array.from(overlay.querySelectorAll('.search-filter-pill'));

    // Existing search bar in header
    const headerSearchForm = document.querySelector('.header-search-bar');
    const headerSearchInput = headerSearchForm ? headerSearchForm.querySelector('.search-input') : null;
    const headerSearchBtn = headerSearchForm ? headerSearchForm.querySelector('.search-btn') : null;

    // Nav trigger button
    const navSearchBtn = document.querySelector('.nav-search-btn');

    const competencesData = Array.isArray(window.CV_COMPETENCES) ? window.CV_COMPETENCES : [];
    const activeFilters = new Set();
    const CATEGORY_LABELS = {
      'soft-skills': 'Soft skills',
      'hard-skills': 'Hard skills',
      frontend: 'Frontend',
      backend: 'Backend',
      projets: 'Projets'
    };
    const PERIODE_LABELS = {
      etudes: 'Études',
      trading: 'Trading',
      leclerc: 'E.Leclerc',
      dev: 'Développement'
    };

    let searchResultsList = null;
    if (searchResultsContainer) {
      searchResultsList = document.createElement('ul');
      searchResultsList.className = 'search-results-list';
      searchResultsList.setAttribute('role', 'list');
      searchResultsContainer.appendChild(searchResultsList);
    }

    let restorePlaceholder = null;
    let lastActiveElement = null;

    function isMobile() {
      return window.matchMedia('(max-width: 714px)').matches; // <715px
    }

    function normalise(value) {
      if (typeof value !== 'string') {
        if (value == null) return '';
        value = String(value);
      }
      return value
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase();
    }

    function getQueryTokens(rawValue) {
      if (!rawValue) return [];
      return rawValue
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((token) => normalise(token));
    }

    function matchesActiveFilters(competence) {
      if (activeFilters.size === 0) return true;
      const categories = Array.isArray(competence?.categories) ? competence.categories : [];
      return categories.some((category) => activeFilters.has(category));
    }

    function evaluateTokenMatch(competence, tokens) {
      if (tokens.length === 0) {
        return { matches: true, score: 0 };
      }

      const nameValue = normalise(competence?.name || '');
      const descriptionValue = normalise(competence?.description || '');
      const periodeRaw = PERIODE_LABELS[competence?.periode] || competence?.periode || '';
      const periodeValue = normalise(periodeRaw);
      const idValue = normalise(competence?.id || '');
      const categories = Array.isArray(competence?.categories)
        ? competence.categories.map((category) => normalise(category))
        : [];
      const keywords = Array.isArray(competence?.['#'])
        ? competence['#'].map((keyword) => normalise(keyword))
        : [];

      let score = 0;

      for (const token of tokens) {
        let tokenScore = 0;

        if (nameValue.includes(token)) {
          tokenScore = Math.max(tokenScore, 6);
        }
        if (categories.some((category) => category.includes(token))) {
          tokenScore = Math.max(tokenScore, 4);
        }
        if (keywords.some((keyword) => keyword.includes(token))) {
          tokenScore = Math.max(tokenScore, 3);
        }
        if (descriptionValue.includes(token)) {
          tokenScore = Math.max(tokenScore, 2);
        }
        if (periodeValue.includes(token) || idValue.includes(token)) {
          tokenScore = Math.max(tokenScore, 1);
        }

        if (tokenScore === 0) {
          return { matches: false, score: 0 };
        }

        score += tokenScore;
      }

      return { matches: true, score };
    }

    function buildResultItem(competence) {
      const item = document.createElement('li');
      item.className = 'search-result-item';
      item.setAttribute('data-periode', competence?.periode || '');
      if (competence?.id) {
        item.setAttribute('data-id', competence.id);
      }
      item.setAttribute('role', 'button');
      item.tabIndex = 0;

      const header = document.createElement('div');
      header.className = 'search-result-header';

      const title = document.createElement('h3');
      title.className = 'search-result-title';
      title.textContent = competence?.name || 'Compétence';
      header.appendChild(title);

      const periodeBadge = document.createElement('span');
      periodeBadge.className = 'search-result-periode';
      periodeBadge.textContent = PERIODE_LABELS[competence?.periode] || competence?.periode || '';
      header.appendChild(periodeBadge);

      item.appendChild(header);

      if (competence?.description) {
        const description = document.createElement('p');
        description.className = 'search-result-description';
        description.textContent = competence.description;
        item.appendChild(description);
      }

      const categories = Array.isArray(competence?.categories) ? competence.categories : [];
      if (categories.length) {
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'search-result-tags';
        categories.forEach((category) => {
          const tag = document.createElement('span');
          tag.className = 'search-result-tag';
          tag.textContent = CATEGORY_LABELS[category] || category;
          tagsContainer.appendChild(tag);
        });
        item.appendChild(tagsContainer);
      }

      if (competence?.link) {
        const link = document.createElement('a');
        link.className = 'search-result-link';
        link.href = competence.link;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Voir la ressource';
        item.appendChild(link);
      }

      return item;
    }

    function updatePlaceholderMessage(message) {
      if (!searchPlaceholder) return;
      searchPlaceholder.hidden = false;
      searchPlaceholder.textContent = message;
    }

    function renderSearchResults() {
      if (!searchResultsContainer || !searchResultsList) return;

      const hasData = Array.isArray(competencesData) && competencesData.length > 0;
      if (!hasData) {
        searchResultsList.replaceChildren();
        updatePlaceholderMessage('Les compétences ne sont pas disponibles pour le moment. Veuillez réessayer plus tard.');
        return;
      }

      const rawQuery = headerSearchInput ? headerSearchInput.value : '';
      const tokens = getQueryTokens(rawQuery);
      const shouldShowPlaceholder = tokens.length === 0 && activeFilters.size === 0;

      if (shouldShowPlaceholder) {
        searchResultsList.replaceChildren();
        updatePlaceholderMessage('Commencez à taper pour rechercher des compétences…');
        return;
      }

      const results = [];
      for (const competence of competencesData) {
        if (!matchesActiveFilters(competence)) continue;
        const evaluation = evaluateTokenMatch(competence, tokens);
        if (!evaluation.matches) continue;
        results.push({ competence, score: evaluation.score });
      }

      if (!results.length) {
        searchResultsList.replaceChildren();
        const hasQuery = tokens.length > 0;
        if (hasQuery && activeFilters.size > 0) {
          updatePlaceholderMessage('Aucun résultat ne correspond à votre recherche et aux filtres sélectionnés.');
        } else if (hasQuery) {
          updatePlaceholderMessage(`Aucun résultat trouvé pour « ${rawQuery.trim()} ».`);
        } else {
          updatePlaceholderMessage('Aucune compétence ne correspond aux filtres sélectionnés.');
        }
        return;
      }

      results.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const aName = a.competence?.name || '';
        const bName = b.competence?.name || '';
        return aName.localeCompare(bName, 'fr', { sensitivity: 'base' });
      });

      const fragment = document.createDocumentFragment();
      results.forEach(({ competence }) => {
        fragment.appendChild(buildResultItem(competence));
      });

      searchResultsList.replaceChildren(fragment);
      if (searchPlaceholder) {
        searchPlaceholder.hidden = true;
      }
      searchResultsContainer.scrollTop = 0;
      attachResultItemInteractions();
    }

    function focusTimelineAfterOverlay() {
      const rangeSlider = document.getElementById('myRange');
      if (rangeSlider) {
        lastActiveElement = rangeSlider;
      }
    }

    function handleResultSelection(item) {
      if (!item) return;

      focusTimelineAfterOverlay();
      const periode = item.getAttribute('data-periode');
      const navigate = typeof window.navigateTimelineToPeriode === 'function'
        ? window.navigateTimelineToPeriode
        : null;

      closeOverlay();

      if (navigate && periode) {
        const performNavigation = () => navigate(periode);
        if (typeof window.requestAnimationFrame === 'function') {
          window.requestAnimationFrame(performNavigation);
        } else {
          setTimeout(performNavigation, 0);
        }
      }
    }

    function attachResultItemInteractions() {
      if (!searchResultsList) return;
      const items = searchResultsList.querySelectorAll('.search-result-item');
      items.forEach((item) => {
        item.addEventListener('click', (event) => {
          event.preventDefault();
          handleResultSelection(item);
        });
        item.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
            event.preventDefault();
            handleResultSelection(item);
          }
        });
      });
    }

    function trapFocus(e) {
      if (!overlay || overlay.getAttribute('aria-hidden') !== 'false') return;
      const focusables = overlay.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      } else if (e.key === 'Escape') {
        closeOverlay();
      }
    }

    function openOverlay(trigger) {
      if (overlay.getAttribute('aria-hidden') === 'false') return; // already open
      if (!overlay || !headerSearchForm) return;
      lastActiveElement = trigger || document.activeElement;

      // Move search form into overlay slot, expand styling via a class
      overlaySearchSlot.appendChild(headerSearchForm);
      headerSearchForm.classList.add('in-overlay');

      // Tweak placeholder for context
      if (headerSearchInput) {
        restorePlaceholder = headerSearchInput.getAttribute('placeholder');
        headerSearchInput.setAttribute('placeholder', 'Recherchez dans toutes les compétences, projets, langues…');
      }

      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('search-overlay-open');

      // Focus input
      setTimeout(() => headerSearchInput && headerSearchInput.focus(), 0);

      // Lock scroll on body
      document.addEventListener('keydown', trapFocus);
      renderSearchResults();
    }

    function closeOverlay() {
      if (!overlay || !headerSearchForm) return;

      // Restore search form to header (before nav) at its original place
      const headerRow = document.querySelector('.header-row');
      if (headerRow) {
        // Insert after the brand block so layout remains as before
        const brand = headerRow.querySelector('.header-home-link');
        if (brand && brand.nextSibling) {
          headerRow.insertBefore(headerSearchForm, brand.nextSibling);
        } else {
          headerRow.appendChild(headerSearchForm);
        }
      } else {
        document.body.appendChild(headerSearchForm);
      }

      headerSearchForm.classList.remove('in-overlay');
      if (headerSearchInput && restorePlaceholder !== null) {
        headerSearchInput.setAttribute('placeholder', restorePlaceholder);
      }
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('search-overlay-open');
      document.removeEventListener('keydown', trapFocus);

      // Return focus to the opener for accessibility
      if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
        lastActiveElement.focus();
      }
    }

    // Open triggers
    if (headerSearchInput) {
      headerSearchInput.addEventListener('focus', () => {
        // Desktop/tablet only: click/focus anywhere in the header search should open the modal
        if (!isMobile()) openOverlay(headerSearchInput);
      });
      // Also react on click on the whole form area
      headerSearchForm.addEventListener('mousedown', (e) => {
        if (!isMobile()) openOverlay(headerSearchForm);
      });
    }
    if (navSearchBtn) {
      navSearchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openOverlay(navSearchBtn);
      });
    }

    if (filterButtons.length) {
      filterButtons.forEach((button) => {
        const filter = button.dataset.filter;
        button.setAttribute('aria-pressed', 'false');
        button.addEventListener('click', () => {
          if (!filter) return;
          if (activeFilters.has(filter)) {
            activeFilters.delete(filter);
            button.classList.remove('is-active');
            button.setAttribute('aria-pressed', 'false');
          } else {
            activeFilters.add(filter);
            button.classList.add('is-active');
            button.setAttribute('aria-pressed', 'true');
          }
          renderSearchResults();
        });
      });
    }

    if (headerSearchForm) {
      headerSearchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (overlay.getAttribute('aria-hidden') !== 'false') {
          openOverlay(headerSearchForm);
        }
        renderSearchResults();
      });
    }

    if (headerSearchInput) {
      ['input', 'change', 'search'].forEach((eventName) => {
        headerSearchInput.addEventListener(eventName, () => {
          renderSearchResults();
        });
      });
    }

    // Close controls
    if (closeBtn) closeBtn.addEventListener('click', closeOverlay);
    overlay.addEventListener('mousedown', (e) => {
      if (e.target === overlay) closeOverlay();
    });

    // Keep modal centered heights updated if CSS uses app-vh
    window.addEventListener('resize', () => {
      // no-op for now; layout is CSS-driven
    });

    function openOverlayWithQuery(query, options = {}) {
      const trigger = options.trigger || null;
      const focusInput = options.focusInput !== false;
      const alreadyOpen = overlay.getAttribute('aria-hidden') === 'false';

      if (!alreadyOpen) {
        openOverlay(trigger);
      } else if (trigger) {
        lastActiveElement = trigger;
      }

      if (headerSearchInput) {
        headerSearchInput.value = query || '';
        headerSearchInput.dispatchEvent(new Event('input', { bubbles: true }));
        if (focusInput) {
          setTimeout(() => headerSearchInput.focus(), 0);
        }
      } else {
        renderSearchResults();
      }
    }

    window.openSearchOverlayWithQuery = openOverlayWithQuery;

    renderSearchResults();
  });
})();
