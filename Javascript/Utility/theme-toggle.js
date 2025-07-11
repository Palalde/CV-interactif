function updateNavIcons(isLight) {
  // LOGO
  document.querySelectorAll('.cv-logo').forEach(img => {
    img.src = isLight
      ? '../img/NavIcon/LightMode/CvNoir.png'
      : '../img/NavIcon/DarkMode/CvBlanc.png';
  });
  // SEARCH BAR
   document.querySelectorAll('.search-icon').forEach(img => {
    img.src = isLight
      ? '../img/NavIcon/LightMode/LoupeBeige.png'
      : '../img/NavIcon/DarkMode/LoupeBleu.png';
  });
  // NAV ICON
  // Loupe
  document.querySelectorAll('.icon-loupe.main').forEach(img => {
    img.src = isLight
      ? '../img/NavIcon/LightMode/LoupeNoir.png'
      : '../img/NavIcon/DarkMode/LoupeBlanc.png';
  });
  document.querySelectorAll('.icon-loupe.second').forEach(img => {
    img.src = isLight
      ? '../img/NavIcon/LightMode/LoupeBeige.png'
      : '../img/NavIcon/DarkMode/LoupeBleu.png';
  });
  // Contact
  document.querySelectorAll('.icon-contact.main').forEach(img => {
    img.src = isLight
      ? '../img/NavIcon/LightMode/ContactNoir.png'
      : '../img/NavIcon/DarkMode/ContactBlanc.png';
  });
  document.querySelectorAll('.icon-contact.second').forEach(img => {
    img.src = isLight
      ? '../img/NavIcon/LightMode/ContactBeige.png'
      : '../img/NavIcon/DarkMode/ContactBleu.png';
  });
  // PDF
  document.querySelectorAll('.icon-pdf.main').forEach(img => {
    img.src = isLight
      ? '../img/NavIcon/LightMode/PdfNoir.png'
      : '../img/NavIcon/DarkMode/PdfBlanc.png';
  });
  document.querySelectorAll('.icon-pdf.second').forEach(img => {
    img.src = isLight
      ? '../img/NavIcon/LightMode/PdfBeige.png'
      : '../img/NavIcon/DarkMode/PdfBleu.png';
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