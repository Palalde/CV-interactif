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
        if (v >= 37.5 && v < 75) {
          img = "trading-beige.png";
          imgFocus = "trading-noir.png";
        } else if (v >= 75 && v < 112.5) {
          img = "leclerc-beige.png";
          imgFocus = "leclerc-noir.png";
        } else if (v >= 112.5 && v <= 150) {
          img = "code-beige.png";
          imgFocus = "code-noir.png";
        } else {
          img = "etudes-beige.png";
          imgFocus = "etudes-noir.png";
        }
      } else {
        // Dark mode mapping
        if (v >= 37.5 && v < 75) {
          img = "trading-bleu.png";
          imgFocus = "trading-blanc.png";
        } else if (v >= 75 && v < 112.5) {
          img = "leclerc-bleu.png";
          imgFocus = "leclerc-blanc.png";
        } else if (v >= 112.5 && v <= 150) {
          img = "code-bleu.png";
          imgFocus = "code-blanc.png";
        } else {
          img = "etudes-bleu.png";
          imgFocus = "etudes-blanc.png";
        }
      }
      const base = isFocus ? imgFocus : img;
      const mode = isLight ? 'lightmode' : 'darkmode';
      slider.style.setProperty('--thumb-img', `url("../img/rangeslider/${mode}/${base}")`);
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
// EMPLACEMENT TEMPORAIRE DU SLIDE
  const slider = document.querySelector('.content-slider');
  const rangeSlider = document.getElementById('myRange'); // Your existing range slider
  const sections = document.querySelectorAll('.content-section');
  const sectionCount = sections.length;
  
  // Variables for touch handling
  let startX = 0;
  let currentTranslate = 0;
  let isDragging = false;
  let currentIndex = 0;
  
  // Initialize range slider value
  rangeSlider.min = 0;
  rangeSlider.max = (sectionCount - 1) * 37.5 + 37.5; 
  rangeSlider.value = 0;
  
  // Function to update content based on slider value
  function updateContent() {
    const value = parseInt(rangeSlider.value);
    const newIndex = Math.floor(value / 50);
    
    if (newIndex !== currentIndex) {
      currentIndex = newIndex;
    }
    
    // Calculate precise position within the section (for smooth transitions)
    const sectionProgress = (value % 50) / 50;
    const exactPosition = -(currentIndex + sectionProgress) * (100 / sectionCount);
    
    slider.style.transform = `translateX(${exactPosition}%)`;
    
    // Apply different styling based on the active section
    updateStyling(currentIndex);
  }
  
  // Function to update section-specific styling
  function updateStyling(index) {
    // You can add custom styling transitions here
    sections.forEach((section, i) => {
      if (i === index) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });
  }
  
  // Range slider event listener
  rangeSlider.addEventListener('input', updateContent);
  
  // Touch events for swiping
  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    // Save the current position
    const transformMatrix = window.getComputedStyle(slider).getPropertyValue('transform');
    if (transformMatrix !== 'none') {
      currentTranslate = parseInt(transformMatrix.split(',')[4]);
    }
  });
  
  slider.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    const containerWidth = slider.parentElement.offsetWidth;
    
    // Augmenter l'amplitude nécessaire pour déclencher le swipe
    const swipeSensitivity = 20; // Plus la valeur est grande, plus il faut bouger le doigt

    // Calculate how much to move and update slider position
    const moveX = currentTranslate + diff;
    const percentMove = (moveX / containerWidth) * 100;

    // Update slider value based on swipe, en divisant le déplacement par la sensibilité
    const newRangeValue = Math.max(0, Math.min(
      rangeSlider.max,
      rangeSlider.value - (diff / (containerWidth * swipeSensitivity)) * 50
    ));
    
    rangeSlider.value = newRangeValue;
    updateContent();
  });
  
  slider.addEventListener('touchend', () => {
    isDragging = false;
    
    // Snap to nearest section
    const value = Math.round(rangeSlider.value / 50) * 50;
    rangeSlider.value = value;
    updateContent();
  });
  
  // Initialize content position
  updateContent();
});

