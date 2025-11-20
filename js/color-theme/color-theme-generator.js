// =============================================
// Color Theme Generator (Exercice 6)
// =============================================
// 🎯 Mission : Créer un générateur de couleurs qui utilise The Color API
// 📚 Concepts : fetch, async/await, try/catch, promises, API REST
import { addToColorHistory, displayColorHistory, clearColorHistory } from './color-history.js';

document.addEventListener('DOMContentLoaded', function() {

  // Sélection des éléments DOM nécessaires
  const colorGeneratorBtn = document.getElementById('color-generator-btn');
  const colorGeneratorBtnMobile = document.getElementById('color-generator-btn-mobile');
  const colorGeneratorOverlay = document.getElementById('color-generator-overlay');
  const colorGeneratorClose = document.querySelector('.color-generator-close');
  const colorHexInput = document.getElementById('color-hex-input');
  const analyzeColorBtn = document.getElementById('analyze-color-btn');
  const colorLoading = document.getElementById('color-loading');
  const colorResults = document.getElementById('color-results');
  const colorError = document.getElementById('color-error');
  // couleur aléatoire 
  const randomColorBtn = document.getElementById('random-color-btn');
  // bouton clear history
  const clearHistoryBtn = document.getElementById('clear-history-btn');

  // ====================================
  // ouverture/fermeture / focus management
  // ====================================
  // Variable pour mémoriser l'élément qui a ouvert l'overlay
  let lastFocusedElement = null;
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
    lastFocusedElement = document.activeElement;
  
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
  }

  // close
  function closeColorGenerator() {
    if (!isColorGeneratorOpen()) return;
    // aria-hidden / expanded true
    colorGeneratorOverlay.setAttribute('aria-hidden', 'true');
    colorGeneratorBtn.setAttribute('aria-expanded', 'false');
    // Restore focus to button
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
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
    analyzeColor();
  });
   
  // ====================================
  // fonction async pour fetch l'API
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
    
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
  }
  
  // fetch function
  async function fetchColorData(hexColor) {
    const apiUrl = `https://www.thecolorapi.com/id?hex=${hexColor}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    return data;
  }

  // analyze color function
  async function analyzeColor(hexColor) {
    const hexInput = hexColor || colorHexInput.value;

    // Show loading state
    showLoading();

    try {
      const colorData = await fetchColorData(hexInput);
      // display results
      displayColorResults(colorData);
      // Ajouter à l'historique des couleurs
      addToColorHistory(colorData);
      displayColorHistory();
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
  analyzeColorBtn.addEventListener('click', analyzeColor);
  colorHexInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      analyzeColor();
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

  // event listener pour le custom event
  document.addEventListener('color-history-select', function(event) {
    // Récupérer le hex depuis event.detail
    const hexColor = event.detail.hex.replace('#', '');
    // Mettre à jour l'input visuel (sans le #)
    colorHexInput.value = hexColor;
    // Analyser la couleur
    analyzeColor();
  });
});


