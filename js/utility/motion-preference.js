(function () {
  const STORAGE_KEY = 'cv-motion-preference';
  const reduceMotionQuery = (function () {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return null;
    }
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)');
    } catch (error) {
      return null;
    }
  })();

  function getStoredPreference() {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'reduced' || stored === 'full') {
        return stored;
      }
    } catch (error) {
      // Ignore storage access issues (private mode, etc.)
    }
    return null;
  }

  function storePreference(value) {
    try {
      if (!value || value === 'auto') {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, value);
      }
    } catch (error) {
      // Ignore storage access issues
    }
  }

  function getSystemPreference() {
    return !!(reduceMotionQuery && reduceMotionQuery.matches);
  }

  function applyPreference() {
    const stored = getStoredPreference();
    const shouldReduce = stored ? stored === 'reduced' : getSystemPreference();

    document.body.classList.toggle('motion-reduced', shouldReduce);
    document.body.classList.toggle('motion-full', stored === 'full');

    const detail = {
      shouldReduce,
      source: stored ? 'user' : 'system'
    };
    document.dispatchEvent(new CustomEvent('motion-preference-change', { detail }));
  }

  if (reduceMotionQuery) {
    const listener = typeof reduceMotionQuery.addEventListener === 'function'
      ? reduceMotionQuery.addEventListener.bind(reduceMotionQuery, 'change')
      : reduceMotionQuery.addListener && reduceMotionQuery.addListener.bind(reduceMotionQuery);
    if (listener) {
      listener(applyPreference);
    }
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-motion-pref]');
    if (!trigger) {
      return;
    }
    const pref = trigger.getAttribute('data-motion-pref');
    if (!pref) {
      return;
    }
    if (pref === 'reduced' || pref === 'full' || pref === 'auto') {
      storePreference(pref);
      applyPreference();
      trigger.blur();
    }
  });

  window.setMotionPreference = function setMotionPreference(pref) {
    if (pref === 'reduced' || pref === 'full' || pref === 'auto') {
      storePreference(pref);
      applyPreference();
    }
  };

  // Apply immediately on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyPreference, { once: true });
  } else {
    applyPreference();
  }
})();
