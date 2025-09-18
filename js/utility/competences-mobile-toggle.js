document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('competences-mobile-btn');
  const titre = document.getElementById('competences-mobile-titre');
  const dyn = document.getElementById('competences-dynamiques');
  let isOpen = false;

  // Si la structure n'est pas présente sur cette page, ne rien faire
  if (!btn || !titre || !dyn) return;

  function toggleCompetencesPanel(forceOpen = null) {
    isOpen = (typeof forceOpen === 'boolean') ? forceOpen : !isOpen;
    if (isOpen) {
      dyn.style.display = 'block';
      titre.style.display = 'none'; // On garde le comportement actuel: le H3 externe est masqué quand ouvert
      if (typeof updateCompetencesDynamiquesBySlider === 'function') {
        updateCompetencesDynamiquesBySlider();
      }
    } else {
      dyn.style.display = 'none';
      titre.style.display = '';
    }
  }

  // Toggle en cliquant sur le conteneur ou le H3 externe
  btn.addEventListener('click', function(e) {
    // Ne toggle que si le clic vient du conteneur ou du H3 externe
    if (e.target !== btn && e.target !== titre) return;
    toggleCompetencesPanel();
  });

  // Ouvrir en cliquant sur les titres des sections (hors panneau dynamique)
  document.querySelectorAll('.competences-section .competence-titre').forEach((h3) => {
    h3.addEventListener('click', function() {
      // Ignorer si ce H3 est celui cloné à l'intérieur du panneau dynamique
      if (h3.closest('#competences-dynamiques')) return;
      toggleCompetencesPanel(true);
    });
  });

  // À l'intérieur du panneau dynamique: seul le H3 (entête) doit fermer; les items ne ferment pas
  dyn.addEventListener('click', function(e) {
    const header = e.target.closest('h3');
    if (!header) return; // clic sur un item/texte: ne rien faire
    // On ne ferme que si c'est bien un H3 d'entête
    if (header.classList.contains('competence-titre')) {
      e.stopPropagation();
      toggleCompetencesPanel(false);
    }
  });

  // Par défaut, cacher dynamiques
  dyn.style.display = 'none';
});
