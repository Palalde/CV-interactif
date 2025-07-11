function updateNavIcons(isLight) {
  // LOGO
  document.querySelectorAll('.cv-logo').forEach(img => {
    img.src = isLight
      ? '../img/nav-icon/lightmode/cv-noir.png'
      : '../img/nav-icon/darkmode/cv-blanc.png';
  });
  // SEARCH BAR
   document.querySelectorAll('.search-icon').forEach(img => {
    img.src = isLight
      ? '../img/nav-icon/lightmode/loupe-beige.png'
      : '../img/nav-icon/darkmode/loupe-bleu.png';
  });
  // NAV ICON
  // Loupe
  document.querySelectorAll('.icon-loupe.main').forEach(img => {
    img.src = isLight
      ? '../img/nav-icon/lightmode/loupe-noir.png'
      : '../img/nav-icon/darkmode/loupe-blanc.png';
  });
  document.querySelectorAll('.icon-loupe.second').forEach(img => {
    img.src = isLight
      ? '../img/nav-icon/lightmode/loupe-beige.png'
      : '../img/nav-icon/darkmode/loupe-bleu.png';
  });
  // Contact
  document.querySelectorAll('.icon-contact.main').forEach(img => {
    img.src = isLight
      ? '../img/nav-icon/lightmode/contact-noir.png'
      : '../img/nav-icon/darkmode/contact-blanc.png';
  });
  document.querySelectorAll('.icon-contact.second').forEach(img => {
    img.src = isLight
      ? '../img/nav-icon/lightmode/contact-beige.png'
      : '../img/nav-icon/darkmode/contact-bleu.png';
  });
  // PDF
  document.querySelectorAll('.icon-pdf.main').forEach(img => {
    img.src = isLight
      ? '../img/nav-icon/lightmode/pdf-noir.png'
      : '../img/nav-icon/darkmode/pdf-blanc.png';
  });
  document.querySelectorAll('.icon-pdf.second').forEach(img => {
    img.src = isLight
      ? '../img/nav-icon/lightmode/pdf-beige.png'
      : '../img/nav-icon/darkmode/pdf-bleu.png';
  });
}

// THEME TOGGLE
const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
  themeToggle.addEventListener('change', e => {
    const isLight = e.target.checked;
    document.body.classList.toggle('light', isLight);
    updateNavIcons(isLight);
  });
}

// System Pref
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
document.body.classList.toggle('light', prefersLight);
if (themeToggle) themeToggle.checked = prefersLight;

// Initial sync nav icons
updateNavIcons(prefersLight);