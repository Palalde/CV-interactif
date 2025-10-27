// Xterm console source (bundled by esbuild into js/dev/console.bundle.js)
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

// Console banner (sobre): séparateurs discrets en dim + titre et rappel help
const BANNER = [
  '\x1b[2m───────────────────────────────\x1b[22m',
  '\x1b[1mConsole CV\x1b[22m',
  '(tapez \x1b[1mhelp\x1b[22m pour l\'aide et naviguer dans la suite du CV)',
  '\x1b[2m───────────────────────────────\x1b[22m',
  ''
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

// Write text with word-boundary wrapping to avoid cutting words at EOL
function writeLn(term, text = '') {
  const cols = Math.max(1, term?.cols || 80);
  // Normalize EOL, then wrap each logical line by spaces
  const rawLines = String(text).replace(/\r\n|\r/g, '\n').split('\n');
  const wrapped = [];
  for (const line of rawLines) {
    if (line.length <= cols) {
      wrapped.push(line);
      continue;
    }
    const words = line.split(/(\s+)/); // keep spaces as tokens
    let cur = '';
    for (const tok of words) {
      if (tok === '') continue;
      // If adding token would exceed width, flush current line
      if (cur.length > 0 && cur.length + tok.length > cols) {
        wrapped.push(cur);
        // If token itself exceeds width (single long word), hard-split
        if (tok.trim() && tok.length > cols) {
          let i = 0;
          while (i < tok.length) {
            const slice = tok.slice(i, i + cols);
            if (slice.length === cols) {
              wrapped.push(slice);
            } else {
              cur = slice; // start next line with remainder
            }
            i += cols;
          }
          if (typeof cur !== 'string') cur = '';
        } else {
          cur = tok.replace(/^\s+/, '');
        }
      } else {
        cur += tok;
      }
    }
    if (cur.length) wrapped.push(cur);
  }
  for (const l of wrapped) term.writeln(l);
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
        '',
        '\x1b[1mCommandes disponibles:\x1b[22m',
        '  \x1b[1mdev\x1b[22m : Mon parcours',
        '  \x1b[1mprojet\x1b[22m : Les projets prévus',
        '  \x1b[1mclear\x1b[22m : Efface l\'écran',
        '  \x1b[1mcontact\x1b[22m : Ouvre la page Contact',
        '  \x1b[1mpdf\x1b[22m : Ouvre le CV PDF',
        '  \x1b[1mgoto\x1b[22m <section> : etudes|trading|leclerc',
      ].join('\r\n');
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
      openUrl('/html/cv-classique.pdf');
      return 'Ouverture du CV PDF…';
    },
    dev() {
      return [
        '',
        '',
        'Je me forme en autodidacte de manière intensive sur mon temps libre.',
        'Je suis la roadmap Fullstack de roadmap.sh étape par étape en m\'appuyant sur des vidéos et des articles.',
        'J\'utilise les agents IA pour accélérer la pratique tout en comprenant précisément chaque portion de code générée.',
        'But : consolider des bases solides avant d\'avancer vers la suite du programme.',
      ].join('\r\n');
    },
    projet() {
      return [
        '',
        '',
        'Ma validation des compétences passe par trois projets phares :',
        '- Projet 1 — CV interactif : maîtriser HTML/CSS/JS sur un site statique soigné.',
        '- Projet 2 — Créateur de planning : passer sur React + Tailwind CSS et renforcer le backend.',
        '- Projet 3 — Classement & planning sportif : bâtir une application complète, publiable et potentiellement commercialisable.',
        'Si ce dernier projet fonctionne, j\'en vis ; sinon il devient la vitrine de ma formation pour décrocher mon premier poste de développeur junior.',
      ].join('\r\n');
    },
    goto(arg) {
      const valid = ['etudes', 'trading', 'leclerc', 'dev'];
      if (!arg || !valid.includes(arg)) {
        return 'Usage: goto etudes|trading|leclerc|dev';
      }
      gotoSection(arg);
      return `Navigation vers ${arg}…`;
    },
  };

  commands.Dev = commands.dev;
  commands.Projet = commands.projet;

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
  // Responsive font sizing based on container width
  function updateFontSize() {
    const w = container?.clientWidth || window.innerWidth || 800;
    // Clamp between 11 and 16 px, scale gently with width
    const target = Math.max(11, Math.min(16, Math.round(w / 28)));
    if (term.options.fontSize !== target) {
      term.options.fontSize = target;
      try { fitAddon.fit(); } catch {}
    }
  }
  const roFont = new ResizeObserver(updateFontSize);
  roFont.observe(container);
  window.addEventListener('resize', () => {
    try { fitAddon.fit(); } catch {}
    updateFontSize();
  });
  window.addEventListener('orientationchange', updateFontSize);
  try { fitAddon.fit(); } catch {}
  updateFontSize();

  // Sync with body theme
  const mo = installThemeSync(term);

  // Shell behavior
  createShell(term);

  // Mobile keyboard toggle: tap to close/open keyboard
  let isClosing = false;
  function toggleMobileKeyboard(e) {
    // Only on touch devices
    if (!('ontouchstart' in window) && window.matchMedia('(pointer: fine)').matches) return;
    
    const textarea = container.querySelector('textarea.xterm-helper-textarea');
    if (!textarea) return;

    // If keyboard is open (textarea has focus), close it
    if (document.activeElement === textarea && !isClosing) {
      e.preventDefault();
      e.stopPropagation();
      isClosing = true;
      textarea.blur();
      // Prevent immediate reopen
      setTimeout(() => { isClosing = false; }, 300);
    }
  }

  // Use touchstart with capture to intercept before Xterm handles it
  container.addEventListener('touchstart', toggleMobileKeyboard, { capture: true });

  // Cleanup hook
  return () => {
    try { ro.disconnect(); } catch {}
    try { roFont.disconnect(); } catch {}
    try { mo.disconnect(); } catch {}
    try { window.removeEventListener('orientationchange', updateFontSize); } catch {}
    try { container.removeEventListener('touchstart', toggleMobileKeyboard, { capture: true }); } catch {}
    try { term.dispose(); } catch {}
  };
}

// Expose a global initializer for the loader
window.devConsoleInit = function (container) {
  initConsole(container);
};
