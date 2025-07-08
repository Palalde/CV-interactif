// Page d'accueil 
document.addEventListener('DOMContentLoaded', function() {
  const homeLink = document.getElementById('header-home-link');
  if (homeLink) {
    homeLink.addEventListener('click', function() {
      window.location.href = 'CV.HTML';
    });
  }
// RANGE SLIDER
// Focus + Thumb dynamique
  document.querySelectorAll('.range-slider').forEach(function(slider) {
    // Blur on mouseleave
    slider.addEventListener('mouseleave', function() {
      this.blur();
    });

    // THUMB DYNAMIQUE
    function updateThumb(slider, isFocus) {
      const v = parseInt(slider.value, 10);
      let img = "EtudesNoir.png";
      let imgFocus = "EtudesBlanc.png";
      if (v >= 50 && v < 100) {
        img = "TradingNoir.png";
        imgFocus = "TradingBlanc.png";
      } else if (v >= 100 && v < 150) {
        img = "LeclercNoir.png";
        imgFocus = "LeclercBlanc.png";
      } else if (v >= 150 && v <= 200) {
        img = "CodeNoir.png";
        imgFocus = "CodeBlanc.png";
      }
      const base = isFocus ? imgFocus : img;
      // Webkit
      slider.style.setProperty('--thumb-img', `url("../img/RANGESLIDER/${base}")`);
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
  });
});