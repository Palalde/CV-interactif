function updateNavIcons(isLight) {
  // LOGO
  document.querySelectorAll('.cv-logo').forEach(img => {
    img.src = isLight
  ? '/img/nav-icon/lightmode/cv-noir.png'
  : '/img/nav-icon/darkmode/cv-blanc.png';
  });
  // SEARCH BAR
   document.querySelectorAll('.search-icon').forEach(img => {
    img.src = isLight
  ? '/img/nav-icon/lightmode/loupe-beige.png'
  : '/img/nav-icon/darkmode/loupe-bleu.png';
  });
  // NAV ICON
  // Loupe
  document.querySelectorAll('.icon-loupe.main').forEach(img => {
    img.src = isLight
  ? '/img/nav-icon/lightmode/loupe-noir.png'
  : '/img/nav-icon/darkmode/loupe-blanc.png';
  });
  document.querySelectorAll('.icon-loupe.second').forEach(img => {
    img.src = isLight
  ? '/img/nav-icon/lightmode/loupe-beige.png'
  : '/img/nav-icon/darkmode/loupe-bleu.png';
  });
  // Contact
  document.querySelectorAll('.icon-contact.main').forEach(img => {
    img.src = isLight
  ? '/img/nav-icon/lightmode/contact-noir.png'
  : '/img/nav-icon/darkmode/contact-blanc.png';
  });
  document.querySelectorAll('.icon-contact.second').forEach(img => {
    img.src = isLight
  ? '/img/nav-icon/lightmode/contact-beige.png'
  : '/img/nav-icon/darkmode/contact-bleu.png';
  });
  // PDF
  document.querySelectorAll('.icon-pdf.main').forEach(img => {
    img.src = isLight
  ? '/img/nav-icon/lightmode/pdf-noir.png'
  : '/img/nav-icon/darkmode/pdf-blanc.png';
  });
  document.querySelectorAll('.icon-pdf.second').forEach(img => {
    img.src = isLight
  ? '/img/nav-icon/lightmode/pdf-beige.png'
  : '/img/nav-icon/darkmode/pdf-bleu.png';
  });

  // CONTACT SIDE ICONS
  // Calendrier
  document.querySelectorAll('.contact-icon[alt="Âge"]').forEach(img => {
    img.src = isLight
  ? '/img/contact/lightmode/calendrier-noir.png'
  : '/img/contact/darkmode/calendrier-blanc.png';
  });
  // Ping
  document.querySelectorAll('.contact-icon[alt="Localisation"]').forEach(img => {
    img.src = isLight
  ? '/img/contact/lightmode/ping-noir.png'
  : '/img/contact/darkmode/ping-blanc.png';
  });
  // LinkedIn
  document.querySelectorAll('.contact-icon.social-icon[alt="LinkedIn"]').forEach(img => {
    img.src = isLight
  ? '/img/contact/lightmode/linkedin-noir.png'
  : '/img/contact/darkmode/linkedin-blanc.png';
  });
  // GitHub
  document.querySelectorAll('.contact-icon.social-icon[alt="GitHub"]').forEach(img => {
    img.src = isLight
  ? '/img/contact/lightmode/github-noir.png'
  : '/img/contact/darkmode/github-blanc.png';
  });
}

// THEME TOGGLE
const themeToggle = document.getElementById('theme-toggle');
const themeToggleMock = document.getElementById('theme-toggle-mock');

if (themeToggle) {
  themeToggle.addEventListener('change', e => {
    const isLight = e.target.checked;
    document.body.classList.toggle('light', isLight);
    updateNavIcons(isLight);
    // Sync mock toggle on landing page
    if (themeToggleMock) {
      themeToggleMock.checked = isLight;
    }
  });
}

// System Pref
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
document.body.classList.toggle('light', prefersLight);
if (themeToggle) themeToggle.checked = prefersLight;
if (themeToggleMock) themeToggleMock.checked = prefersLight;

// Initial sync nav icons
updateNavIcons(prefersLight);