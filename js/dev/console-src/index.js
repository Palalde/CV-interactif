// Xterm console source (bundled by esbuild into js/dev/console.bundle.js)
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const BANNER = [
  'Bienvenue dans la console du CV — tapez "help" pour la liste des commandes.',
  '',
].join('\r\n');

function makePrompt(path = '~') {
  return `paul@cv:${path}$ `;
}

function getCurrentTheme() {
  return document.body.classList.contains('light') ? 'light' : 'dark';
}

function themeOptions(theme) {
  if (theme === 'light') {
    return {
      background: '#f7f7fb',
      foreground: '#0b0d16',
      cursor: '#2c2c34',
      selectionBackground: '#cde0ffaa',
    };
  }
  return {
    background: '#0b0d16',
    foreground: '#e5e7eb',
    cursor: '#93c5fd',
    selectionBackground: '#1f4277aa',
  };
}

function fitOnResize(term, fit) {
  const ro = new ResizeObserver(() => {
    try {
      fit.fit();
    } catch {}
  });
  return ro;
}

function writeLn(term, text = '') {
  term.writeln(text.replace(/\n/g, '\r\n'));
}

function openUrl(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

function gotoSection(id) {
  const slider = document.getElementById('myRange');
  const order = ['etudes', 'trading', 'leclerc', 'dev'];
  const idx = order.indexOf(id);
  if (slider && idx >= 0) {
    const snap = [1, 50, 100, 150][idx];
    slider.value = String(snap);
    slider.dispatchEvent(new Event('input', { bubbles: true }));
    slider.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

function installThemeSync(term) {
  const mo = new MutationObserver(() => {
    term.options.theme = themeOptions(getCurrentTheme());
  });
  mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  return mo;
}

function createShell(term) {
  let cwd = '~';
  let input = '';

  const commands = {
    help() {
      return [
        'Commandes disponibles:',
        '  help                 Affiche cette aide',
        '  echo <texte>         Affiche le texte',
        '  clear                Efface l\'écran',
        '  contact              Ouvre la page Contact',
        '  pdf                  Ouvre le CV PDF (si disponible)',
        '  theme [light|dark]   Change le thème',
        '  goto <section>       etudes | trading | leclerc | dev',
        '  open <url>           Ouvre une URL',
      ].join('\r\n');
    },
    echo(...args) {
      return args.join(' ');
    },
    clear() {
      term.clear();
      return '';
    },
    contact() {
      openUrl('/html/contact-info.html');
      return 'Ouverture de la page Contact…';
    },
    pdf() {
      openUrl('/cv-classique.pdf');
      return 'Ouverture du CV PDF…';
    },
    theme(arg) {
      if (!arg) {
        return `Thème actuel: ${getCurrentTheme()}`;
      }
      const target = arg.toLowerCase();
      const body = document.body;
      if (target === 'light') body.classList.add('light');
      else if (target === 'dark') body.classList.remove('light');
      else return 'Usage: theme light | dark';
      // xterm theme is synced by MutationObserver
      return `Thème changé en ${target}`;
    },
    goto(arg) {
      const valid = ['etudes', 'trading', 'leclerc', 'dev'];
      if (!arg || !valid.includes(arg)) {
        return 'Usage: goto etudes|trading|leclerc|dev';
      }
      gotoSection(arg);
      return `Navigation vers ${arg}…`;
    },
    open(arg) {
      if (!arg) return 'Usage: open <url>';
      try {
        const u = new URL(arg, window.location.origin);
        openUrl(u.href);
        return `Ouverture ${u.href}…`;
      } catch {
        return 'URL invalide.';
      }
    },
  };

  function printPrompt() {
    term.write('\r\n' + makePrompt(cwd));
  }

  function runCommand(line) {
    const parts = line.trim().split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);
    if (!cmd) return printPrompt();
    if (Object.prototype.hasOwnProperty.call(commands, cmd)) {
      const out = commands[cmd](...args);
      if (out) writeLn(term, out);
    } else {
      writeLn(term, `Commande inconnue: ${cmd}. Tapez 'help'.`);
    }
    printPrompt();
  }

  term.onData((data) => {
    for (const ch of data) {
      const code = ch.charCodeAt(0);
      // Enter
      if (code === 13) {
        runCommand(input);
        input = '';
        continue;
      }
      // Backspace
      if (code === 127 || code === 8) {
        if (input.length > 0) {
          input = input.slice(0, -1);
          term.write('\b \b');
        }
        continue;
      }
      // Ctrl+C
      if (code === 3) {
        writeLn(term, '^C');
        input = '';
        term.write(makePrompt(cwd));
        continue;
      }
      // Printable
      if (code >= 32 && code !== 127) {
        input += ch;
        term.write(ch);
      }
    }
  });

  // Banner + prompt
  writeLn(term, BANNER);
  term.write(makePrompt(cwd));
}

export function initConsole(container) {
  const term = new Terminal({
    fontFamily: 'Menlo, Consolas, "DejaVu Sans Mono", monospace',
    fontSize: 14,
    convertEol: true,
    theme: themeOptions(getCurrentTheme()),
    cursorBlink: true,
    allowProposedApi: true,
    disableStdin: false,
  });

  const fitAddon = new FitAddon();
  term.loadAddon(fitAddon);
  term.open(container);

  // Resize handling
  const ro = fitOnResize(term, fitAddon);
  ro.observe(container);
  window.addEventListener('resize', () => {
    try { fitAddon.fit(); } catch {}
  });
  try { fitAddon.fit(); } catch {}

  // Sync with body theme
  const mo = installThemeSync(term);

  // Shell behavior
  createShell(term);

  // Cleanup hook
  return () => {
    try { ro.disconnect(); } catch {}
    try { mo.disconnect(); } catch {}
    try { term.dispose(); } catch {}
  };
}

// Expose a global initializer for the loader
window.devConsoleInit = function (container) {
  initConsole(container);
};
