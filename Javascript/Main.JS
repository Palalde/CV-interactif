// Page d'accueil 
document.addEventListener('DOMContentLoaded', function() {
  const homeLink = document.getElementById('header-home-link');
  if (homeLink) {
    homeLink.addEventListener('click', function() {
      window.location.href = 'cv.html';
    });
  }
// RANGE SLIDER
// Focus + Thumb dynamique adapté au lightmode
  document.querySelectorAll('.range-slider').forEach(function(slider) {
    // Blur on mouseleave
    slider.addEventListener('mouseleave', function() {
      this.blur();
    });

    function updateThumb(slider, isFocus) {
      const v = parseInt(slider.value, 10);
      const isLight = document.body.classList.contains('light');
      let img, imgFocus;

      if (isLight) {
        // Light mode mapping
        if (v >= 50 && v < 100) {
          img = "TradingBeige.png";
          imgFocus = "TradingNoir.png";
        } else if (v >= 100 && v < 150) {
          img = "LeclercBeige.png";
          imgFocus = "LeclercNoir.png";
        } else if (v >= 150 && v <= 200) {
          img = "CodeBeige.png";
          imgFocus = "CodeNoir.png";
        } else {
          img = "EtudesBeige.png";
          imgFocus = "EtudesNoir.png";
        }
      } else {
        // Dark mode mapping
        if (v >= 50 && v < 100) {
          img = "TradingBleu.png";
          imgFocus = "TradingBlanc.png";
        } else if (v >= 100 && v < 150) {
          img = "LeclercBleu.png";
          imgFocus = "LeclercBlanc.png";
        } else if (v >= 150 && v <= 200) {
          img = "CodeBleu.png";
          imgFocus = "CodeBlanc.png";
        } else {
          img = "EtudesBleu.png";
          imgFocus = "EtudesBlanc.png";
        }
      }
      const base = isFocus ? imgFocus : img;
      const mode = isLight ? 'LightMode' : 'DarkMode';
      slider.style.setProperty('--thumb-img', `url("../img/RANGESLIDER/${mode}/${base}")`);
    }

    // Initial
    updateThumb(slider, false);

    // On input
    slider.addEventListener('input', function() {
      updateThumb(this, this === document.activeElement);
    });

    // On focus/blur
    slider.addEventListener('focus', function() {
      updateThumb(this, true);
    });
    slider.addEventListener('blur', function() {
      updateThumb(this, false);
    });

    // Update thumb on theme change
    const observer = new MutationObserver(() => {
      updateThumb(slider, slider === document.activeElement);
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  });
});