// =============================================
// Color Theme Generator (Exercice 6)
// =============================================
// 🎯 Mission : Créer un générateur de couleurs qui utilise The Color API
// 📚 Concepts : fetch, async/await, try/catch, promises, API REST

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


  // ====================================
  // 📝 TODO : Créer les fonctions d'ouverture/fermeture de la modal
  // ====================================
  // Indices :
  // - Utiliser setAttribute('aria-hidden', 'true/false')
  // - Penser au focus trap (comme dans search-overlay)


  // ====================================
  // 📝 TODO : Créer la fonction async pour fetch l'API
  // ====================================
  // Indices :
  // - URL de l'API : https://www.thecolorapi.com/id?hex=VOTRE_COULEUR
  // - Utiliser async/await
  // - Gérer les erreurs avec try/catch
  // - Afficher le loading state pendant le fetch


  // ====================================
  // 📝 TODO : Créer la fonction pour afficher les résultats
  // ====================================
  // Indices :
  // - Modifier le background de #color-preview
  // - Remplir les éléments #color-name, #color-hex, #color-rgb, #color-hsl
  // - Masquer loading, afficher results


  // ====================================
  // 📝 TODO : Ajouter les event listeners
  // ====================================
  // Indices :
  // - Clic sur les boutons d'ouverture
  // - Clic sur le bouton fermer
  // - Clic sur le bouton "Analyser"
  // - Enter dans l'input
  // - Escape pour fermer


  // ====================================
  // 🎁 BONUS (si vous vous sentez à l'aise)
  // ====================================
  // - Validation du format hex (6 caractères, A-F, 0-9)
  // - Suggestion de couleurs aléatoires
  // - Copier les valeurs au clic
  // - Historique des couleurs recherchées

    // ====================================
  // Exemple de réponse API pour tests hors ligne
const sampleApiResponse = {
  "hex": {
    "value": "#3498DB",
    "clean": "3498DB"
  },
  "rgb": {
    "fraction": {
      "r": 0.203921568627451,
      "g": 0.596078431372549,
      "b": 0.858823529411765
    },
    "r": 52,
    "g": 152,
    "b": 219,
    "value": "rgb(52, 152, 219)"
  },
  "hsl": {
    "fraction": {
      "h": 0.56686626746507,
      "s": 0.698744769874477,
      "l": 0.531372549019608
    },
    "h": 204,
    "s": 70,
    "l": 53,
    "value": "hsl(204, 70%, 53%)"
  },
  "hsv": {
    "fraction": {
      "h": 0.56686626746507,
      "s": 0.762557077625571,
      "v": 0.858823529411765
    },
    "value": "hsv(204, 76%, 86%)",
    "h": 204,
    "s": 76,
    "v": 86
  },
  "name": {
    "value": "Curious Blue",
    "closest_named_hex": "#2596D1",
    "exact_match_name": false,
    "distance": 625
  },
  "cmyk": {
    "fraction": {
      "c": 0.762557077625571,
      "m": 0.305936073059361,
      "y": 0,
      "k": 0.141176470588235
    },
    "value": "cmyk(76, 31, 0, 14)",
    "c": 76,
    "m": 31,
    "y": 0,
    "k": 14
  },
  "XYZ": {
    "fraction": {
      "X": 0.452272549019608,
      "Y": 0.531676078431372,
      "Z": 0.8913
    },
    "value": "XYZ(45, 53, 89)",
    "X": 45,
    "Y": 53,
    "Z": 89
  },
  "image": {
    "bare": "https://www.thecolorapi.com/id?format=svg&named=false&hex=3498DB",
    "named": "https://www.thecolorapi.com/id?format=svg&hex=3498DB"
  },
  "contrast": {
    "value": "#000000"
  },"_links": {
    "self": {
      "href": "/id?hex=3498DB"
    }
  },
  "_embedded": {

  }
}

// console log pour vérifier l'objet de test
console.log('Sample API Response:', sampleApiResponse);
console.log('Sample Color Name:', sampleApiResponse.name.value);
console.log('Sample Color Hex:', sampleApiResponse.hex.value);

});


