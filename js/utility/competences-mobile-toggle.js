document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('competences-mobile-btn');
  const titre = document.getElementById('competences-mobile-titre');
  const dyn = document.getElementById('competences-dynamiques');
  let isOpen = false;

  btn.addEventListener('click', function(e) {
    // Empêche le clic sur les enfants de fermer immédiatement
    if (e.target !== btn && e.target !== titre) return;

    isOpen = !isOpen;
    if (isOpen) {
      dyn.style.display = 'block';
      titre.style.display = 'none';
      // Optionnel : mettre à jour dynamiques ici si besoin
      if (typeof updateCompetencesDynamiquesBySlider === 'function') {
        updateCompetencesDynamiquesBySlider();
      }
    } else {
      dyn.style.display = 'none';
      titre.style.display = '';
    }
  });

  // Par défaut, cacher dynamiques
  dyn.style.display = 'none';
});
