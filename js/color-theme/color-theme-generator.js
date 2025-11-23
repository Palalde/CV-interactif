// =============================================
// Color Theme Generator (Exercice 6)
// =============================================
// Import history functions
import { addToColorHistory, displayColorHistory, clearColorHistory } from './color-history.js';
// Import palette functions
import { generatePalette, fetchColorPalette } from './color-palette.js';
// Import theme functions
import { applyColorTheme, resetColorTheme } from './color-theme.js';

document.addEventListener('DOMContentLoaded', function() {
  // ====================================
  // Sélection des éléments DOM
  // ====================================
  const colorGeneratorBtn = document.getElementById('color-generator-btn');
  const colorGeneratorBtnMobile = document.getElementById('color-generator-btn-mobile');
  const colorGeneratorOverlay = document.getElementById('color-generator-overlay');
  const colorGeneratorClose = document.querySelector('.color-generator-close');
  const colorHexInput = document.getElementById('color-hex-input');
  const analyzeColorBtn = document.getElementById('analyze-color-btn');
  const colorLoading = document.getElementById('color-loading');
  const colorResults = document.getElementById('color-results');
  const colorError = document.getElementById('color-error');
  // color picker
  const colorPicker = document.getElementById('color-picker');
  // couleur aléatoire 
  const randomColorBtn = document.getElementById('random-color-btn');
  // bouton clear history
  const clearHistoryBtn = document.getElementById('clear-history-btn');
  // Original Theme Button 
  const applyThemeBtn = document.getElementById('apply-theme-btn');
  const resetThemeBtn = document.getElementById('reset-theme-btn');
  // theme toggle
  const themeToggle = document.getElementById('theme-switch');
  
  // ===================================
  // Variables state
  // ==================================
  const state = {
    colorData: null,
    monochromeColors: null,
    currentColorHex: null,
    lastFocusedElement: null
  };

  // ====================================
  // ouverture/fermeture / focus management
  // ====================================
  // Helper Focus management
  function getFocusableElements() {
    return colorGeneratorOverlay.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
  }
  
  // helper isOpen
  function isColorGeneratorOpen() {
    return colorGeneratorOverlay.getAttribute('aria-hidden') === 'false';
  }

  // open
  function openColorGenerator() {
    if (isColorGeneratorOpen()) return;
    // Mémoriser l'élément qui avait le focus
    state.lastFocusedElement = document.activeElement;
    // aria-hidden / expanded false
    colorGeneratorOverlay.setAttribute('aria-hidden', 'false');
    colorGeneratorBtn.setAttribute('aria-expanded', 'true');
    // Focus first item
    setTimeout(() => {
      const focusable = getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }, 100);
    // synchroniser le color picker
    const currentHex = colorHexInput.value.trim();
    if (/^[0-9A-Fa-f]{6}$/.test(currentHex)) {
      colorPicker.value = '#' + currentHex;
    }
  }

  // close
  function closeColorGenerator() {
    if (!isColorGeneratorOpen()) return;
    // aria-hidden / expanded true
    colorGeneratorOverlay.setAttribute('aria-hidden', 'true');
    colorGeneratorBtn.setAttribute('aria-expanded', 'false');
    // Restore focus to button
    if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === 'function') {
      state.lastFocusedElement.focus();
    } else {
      colorGeneratorBtn.focus();
    }
  }

  // focus trap
  function trapFocus(event) {
    if (!isColorGeneratorOpen()) return;
    // escape
    if (event.key === 'Escape') {
      closeColorGenerator();
      return;
    }
    // tab trap
    if (event.key === 'Tab') {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;
      // loop focus
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  // Event listeners 
  colorGeneratorBtn.addEventListener('click', openColorGenerator);
  colorGeneratorBtnMobile.addEventListener('click', openColorGenerator);
  colorGeneratorClose.addEventListener('click', closeColorGenerator);
  // Focus trap pour l'overlay
  colorGeneratorOverlay.addEventListener('keydown', trapFocus);
  // Click outside to close
  colorGeneratorOverlay.addEventListener('click', function(event) {
    if (event.target === colorGeneratorOverlay) {
      closeColorGenerator();
    }
  });
  
  // ====================================
  // Random Color
  // ====================================
  // Variables
  const hexChars = '0123456789ABCDEF';

  // random color generator
  function getRandomHexColor() {
    return Array(6)
    .fill(0)
    .map(() => hexChars[Math.floor(Math.random() * hexChars.length)])
    .join('');
  }

  // Event listener
  randomColorBtn.addEventListener('click', function() {
    const randomHex = getRandomHexColor();
    colorHexInput.value = randomHex;
    colorPicker.value = `#` + randomHex;
    analyzeColor();
  });

  // ====================================
  // Color picker
  // =================================
  // Event listener
  // value 
  // input color picker
  colorPicker.addEventListener('input', function() {
    colorHexInput.value = colorPicker.value.substring(1);
  });
  // change color picker
  colorPicker.addEventListener('change', function() {
    colorHexInput.value = colorPicker.value.substring(1);
    // analyze color
    analyzeColor();
  });

  // ===============================
  // Original Theme 
  // =============================
  // event listener apply original theme
  applyThemeBtn.addEventListener('click', function() {
    // check
    if (!state.colorData || !state.monochromeColors) {
      showError('Veuillez analyser une couleur avant d\'appliquer un thème.');
      return;
    }
    // apply original theme
    applyColorTheme(state.colorData, state.monochromeColors);
    // hide theme toggles
    themeToggle.style.display = 'none';
  });

  // event listener reset original theme
  resetThemeBtn.addEventListener('click', function() {
    resetColorTheme();
    // show theme toggles
    themeToggle.style.display = 'flex';
  });

  // ====================================
  // fonction async and results display
  // ====================================
  // loading state
  function showLoading () {
    colorLoading.style.display = 'block';
    colorResults.style.display = 'none';
    colorError.style.display = 'none';
  }

  // results state
  function showResults () {
    colorLoading.style.display = 'none';
    colorResults.style.display = 'block';
    colorError.style.display = 'none';
  }

  // error state
  function showError (message) {
    colorLoading.style.display = 'none';
    colorResults.style.display = 'none';
    colorError.style.display = 'flex';
    // set message
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
  }
  
  // fetch function
  async function fetchColorData(hexColor) {
    const apiUrl = `https://www.thecolorapi.com/id?hex=${hexColor}`;
    // fetch data
    const response = await fetch(apiUrl);
    const data = await response.json();
    // return data
    return data;
  }

  // analyze color function
  async function analyzeColor(hexColor) {
    const hexInput = hexColor || colorHexInput.value;
    // mettre à jour la couleur actuelle 
    state.currentColorHex = hexInput;
    // Show loading state
    showLoading();
    
    // fetch data with try/catch
    try {
      state.colorData = await fetchColorData(hexInput);
      // display results
      displayColorResults(state.colorData);
      // History
      addToColorHistory(state.colorData);
      displayColorHistory();
      // Generate Palette async
      await generatePalette(state.colorData.hex.clean);
      // themes variables
      state.monochromeColors = await fetchColorPalette(hexInput, 'monochrome', 5);
      // refresh UI
      showResults();
    } catch (error) {
      console.error('Error fetching color data:', error);
      showError('Failed to fetch color data. Please try again.');
    }
  }

  // display results function
  function displayColorResults(colorData) {
    // Color preview (background)
    const colorPreview = document.getElementById('color-preview');
    colorPreview.style.backgroundColor = colorData.hex.value;
   
    // Infos
    document.getElementById('color-name').textContent = colorData.name.value;
    document.getElementById('color-hex').textContent = colorData.hex.value;
    document.getElementById('color-rgb').textContent = colorData.rgb.value;
    document.getElementById('color-hsl').textContent = colorData.hsl.value;
  }

  // Event listeners
  // analyze button
  analyzeColorBtn.addEventListener('click', function() {
    analyzeColor();
  });
  // enter
  colorHexInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      analyzeColor();
    }
  });
  // input for color picker
  colorHexInput.addEventListener('input', function() {
    const hexValue = colorHexInput.value.trim();

    if (/^[0-9A-Fa-f]{6}$/.test(hexValue)) {
      colorPicker.value = `#` + hexValue;
    }
  });
 
  // event listener palette mode change
  const paletteSelect = document.getElementById('palette-mode');
  paletteSelect.addEventListener('change', async function() {
    if (state.currentColorHex) {
      await generatePalette(state.currentColorHex);
    }
  });

  // ====================================
  // History
  // ===================================
  // afficher l'historique au chargement
  displayColorHistory();
  // clear history event listener
  clearHistoryBtn.addEventListener('click', function() {
      // clear history
      clearColorHistory();
      displayColorHistory();
  });

  // ===================================
  // event listener custom events
  // ====================================
  // history custom event listener
  document.addEventListener('color-history-select', function(event) {
    // Récupérer le hex depuis event.detail
    const hexColor = event.detail.hex.replace('#', '');
    // Mettre à jour l'input visuel (sans le #)
    colorHexInput.value = hexColor;
    // Mettre à jour le color picker
    colorPicker.value = event.detail.hex;
    // Analyser la couleur
    analyzeColor();
  });
  // palette custom event listener
  document.addEventListener('palette-color-select', function(event) {
    // Récupérer le hex depuis event.detail
    const hexColor = event.detail.hex.replace('#', '');
    // Mettre à jour l'input visuel (sans le #)
    colorHexInput.value = hexColor;
    // Mettre à jour le color picker
    colorPicker.value = event.detail.hex;
    // Analyser la couleur
    analyzeColor();
  });
});


