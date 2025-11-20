// Search overlay logic: desktop modal (≥715px), mobile fullscreen (<715px)
// Future-ready: will host filters and results grid
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const overlay = document.getElementById('search-overlay');
    if (!overlay) return;

    const modal = overlay.querySelector('.search-modal');
    const closeBtn = overlay.querySelector('.search-overlay-close');
    const overlaySearchSlot = overlay.querySelector('.search-overlay-search-slot');
    const resultsContainer = overlay.querySelector('.search-overlay-results');

    // Existing search bar in header
    const headerSearchForm = document.querySelector('.header-search-bar');
    const headerSearchInput = headerSearchForm ? headerSearchForm.querySelector('.search-input') : null;
    const headerSearchBtn = headerSearchForm ? headerSearchForm.querySelector('.search-btn') : null;

    // Nav trigger button
    const navSearchBtn = document.querySelector('.nav-search-btn');

    let restorePlaceholder = null;
    let lastActiveElement = null;

    function isMobile() {
      return window.matchMedia('(max-width: 714px)').matches; // <715px
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

    function showInitialHistory() {
      // Import dynamically to access createHistoryBlock
      import('../search/search-history.js').then(module => {
        const historyBlock = module.createHistoryBlock();
        if (historyBlock && resultsContainer) {
          // Clear previous content and show history
          resultsContainer.innerHTML = '';
          resultsContainer.appendChild(historyBlock);
        }
      }).catch(err => {
        console.warn('Could not load search history:', err);
      });
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

      // Show history if input is empty
      if (!headerSearchInput || !headerSearchInput.value.trim()) {
        showInitialHistory();
      }

      // Focus input
      setTimeout(() => headerSearchInput && headerSearchInput.focus(), 0);

      // Lock scroll on body
      document.addEventListener('keydown', trapFocus);
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
      // Clear history when user starts typing
      headerSearchInput.addEventListener('input', () => {
        if (overlay.getAttribute('aria-hidden') === 'false' && headerSearchInput.value.trim()) {
          // If overlay is open and user is typing, remove history display
          // (results will be shown by smart-filter.js)
          const historyBlock = resultsContainer?.querySelector('.search-history-block');
          if (historyBlock) {
            historyBlock.remove();
          }
        }
      });
    }
    if (navSearchBtn) {
      navSearchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openOverlay(navSearchBtn);
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

    // Expose global API for opening overlay with a specific query
    window.openSearchOverlayWithQuery = function(query, options = {}) {
      openOverlay(options.trigger || null);
      if (headerSearchInput && query) {
        headerSearchInput.value = query;
        headerSearchInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };
  });
})();
