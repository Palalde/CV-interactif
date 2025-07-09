// THEME TOGGLE
const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
  themeToggle.addEventListener('change', e =>
    document.body.classList.toggle('light', e.target.checked)
  );
}

// System Pref
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
document.body.classList.toggle('light', prefersLight);
if (themeToggle) themeToggle.checked = prefersLight;