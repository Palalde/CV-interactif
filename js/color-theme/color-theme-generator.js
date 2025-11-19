// =============================================
// Color Theme Generator (Exercice 6)
// =============================================
// 🎯 Mission : Créer un générateur de couleurs qui utilise The Color API
// 📚 Concepts : fetch, async/await, try/catch, promises, API REST

document.addEventListener('DOMContentLoaded', function() {
  // ====================================
  // 📝 TODO : Sélectionner les éléments du DOM
  // ====================================
  // Indices :
  // - Le bouton principal : '#color-generator-btn'
  // - Le bouton mobile : '#color-generator-btn-mobile'
  // - L'overlay : '#color-generator-overlay'
  // - Le bouton fermer : '.color-generator-close'
  // - L'input couleur : '#color-hex-input'
  // - Le bouton analyser : '#analyze-color-btn'
  // - Les sections loading/results/error : '#color-loading', '#color-results', '#color-error'


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

});
