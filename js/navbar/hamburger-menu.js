// Hamburger menu management for responsive navbar (≤1000px)
document.addEventListener('DOMContentLoaded', function() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const hamburgerMenu = document.getElementById('hamburger-menu');
  let lastFocusedElement = null;

  if (!hamburgerBtn || !hamburgerMenu) {
    return;
  }

  // Helper: check if menu is open
  function isMenuOpen() {
    return hamburgerMenu.getAttribute('aria-hidden') === 'false';
  }

  // Helper: get all focusable elements in the menu
  function getFocusableElements() {
    return hamburgerMenu.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
  }

  // Open menu
  function openMenu() {
    if (isMenuOpen()) return;

    lastFocusedElement = document.activeElement;
    hamburgerMenu.setAttribute('aria-hidden', 'false');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('hamburger-menu-open');

    // Focus first item
    setTimeout(() => {
      const focusable = getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }, 100);
  }

  // Close menu
  function closeMenu() {
    if (!isMenuOpen()) return;

    hamburgerMenu.setAttribute('aria-hidden', 'true');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('hamburger-menu-open');

    // Restore focus to button
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    } else {
      hamburgerBtn.focus();
    }
  }

  // Toggle menu
  function toggleMenu() {
    if (isMenuOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Focus trap
  function handleMenuKeydown(event) {
    if (!isMenuOpen()) return;

    // Escape closes menu
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }

    // Tab trap
    if (event.key === 'Tab') {
      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  // Click outside to close
  function handleOverlayClick(event) {
    if (event.target === hamburgerMenu) {
      closeMenu();
    }
  }

  // Event listeners
  hamburgerBtn.addEventListener('click', toggleMenu);
  hamburgerMenu.addEventListener('click', handleOverlayClick);
  document.addEventListener('keydown', handleMenuKeydown);

  // Handle clicks on menu items that should close the menu
  const menuLinks = hamburgerMenu.querySelectorAll('.hamburger-menu-item');
  menuLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      // For search button, trigger the search overlay
      if (this.classList.contains('nav-search-btn-mobile')) {
        event.preventDefault();
        closeMenu();
        // Trigger search overlay if the function is available
        if (typeof window.openSearchOverlayWithQuery === 'function') {
          window.openSearchOverlayWithQuery('', { trigger: this });
        } else {
          // Fallback: try to click the desktop search button
          const desktopSearchBtn = document.querySelector('.nav-search-btn');
          if (desktopSearchBtn) {
            desktopSearchBtn.click();
          }
        }
        return;
      }

      // For PDF (opens in new tab) and contact page, close after a short delay
      setTimeout(() => {
        closeMenu();
      }, 200);
    });
  });

  // Close menu when window is resized above 1000px
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth > 1000 && isMenuOpen()) {
        closeMenu();
      }
    }, 150);
  });
});
