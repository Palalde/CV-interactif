(function () {
  // Simple loader: load built bundle if present; else show a hint in the container.
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  onReady(function () {
    var host = document.getElementById('dev-terminal');
    if (!host) return;

    function showHint(message) {
      host.innerHTML = '';
      var wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;align-items:center;justify-content:center;height:100%;padding:16px;text-align:center;color:#cbd5e1;';
      var inner = document.createElement('div');
      inner.style.maxWidth = '720px';
      inner.innerHTML = '<strong>Console développeur</strong><br>' +
        message +
        '<br><br><small>Astuce: exécutez la commande de build, puis rechargez la page.</small>';
      wrap.appendChild(inner);
      host.appendChild(wrap);
    }

  // Attempt to load xterm base CSS shipped by the bundle process (optional, since we import it in the bundle)
  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = '/js/dev/dist/index.css';
  css.onload = function () { /* ok */ };
  css.onerror = function () { /* ignore, CSS is in bundle via import */ };
  document.head.appendChild(css);

  // Load the built JS bundle from dist
  var script = document.createElement('script');
  script.src = '/js/dev/dist/index.js';
  script.async = true;
    script.onload = function () {
      try {
        if (typeof window.devConsoleInit === 'function') {
          window.devConsoleInit(host);
        } else {
          showHint('Le bundle est chargé mais window.devConsoleInit est introuvable.');
        }
      } catch (e) {
        console.error(e);
        showHint('Erreur lors de l\'initialisation de la console. Consultez la console navigateur.');
      }
    };
    script.onerror = function () {
      showHint('Bundle manquant: js/dev/dist/index.js. Installez Node.js, puis npm i et npm run build:console.');
    };
    document.head.appendChild(script);
  });
})();
