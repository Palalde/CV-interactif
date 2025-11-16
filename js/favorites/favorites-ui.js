import { FavoritesManager } from "./favorites-manager.js"; 

document.addEventListener("DOMContentLoaded", () => {
    const manager = new FavoritesManager();

    // dom de l'etoiles
    function addStarToCompetence(competenceElement, manager) {
        if (!competenceElement) return;
        
        // id 
        const competenceId = competenceElement.dataset.competenceId;
        if (!competenceId) return;
        
        // CORRECTIF : Éviter les doublons en mettant à jour l'étoile existante
        const existingStar = competenceElement.querySelector('.favorite-star');
        if (existingStar) {
            const isFavorite = manager.has(competenceId);
            updateStarDisplay(existingStar, isFavorite);
            return;
        }
        
        // storage check
        const isFavorite = manager.has(competenceId);
        
        // DOM
        const star = document.createElement('button');
        star.className = 'favorite-star';
        star.dataset.competenceId = competenceId;
        star.textContent = isFavorite ? '★' : '☆';
        star.setAttribute('aria-label', 'Marquer comme favori');
        star.setAttribute('type', 'button');
        
        // Appliquer la classe is-favorite si nécessaire
        if (isFavorite) {
            star.classList.add('is-favorite');
        }
        
        competenceElement.insertBefore(star, competenceElement.firstChild);
    }

    // scan toutes les competences et utilise addStarToCompetence
    function addStarsToAllCompetences(manager) {
        const containers = document.querySelectorAll('.competences-list');

        containers.forEach(container => {
            const competences = container.querySelectorAll('.item-competence');
            competences.forEach(competence => addStarToCompetence(competence, manager));
        });
    }

    // gestion des événements délégués pour les étoiles
    function setupEventDelegation(manager) {
        const containers = document.querySelectorAll(".competences-list");
        const dynContainer = document.getElementById('competences-dynamiques');

        // click sur une étoile
        function handleStarClick(e) {
            const star = e.target.closest('.favorite-star');
            if (!star) return;

            // correctif 
            e.preventDefault();
            e.stopPropagation();

            // id
            const competenceId = star.dataset.competenceId;
            if (!competenceId) return;

            // storage check
            manager.toggle(competenceId);
            const isFavorite = manager.has(competenceId);

            // BONUS 5 : Animation lors du toggle
            animateStar(star, isFavorite);

            // CORRECTIF : Synchroniser toutes les instances d'une même compétence
            const allStarsForThisId = document.querySelectorAll(`.favorite-star[data-competence-id="${competenceId}"]`);
            allStarsForThisId.forEach(s => {
                updateStarDisplay(s, isFavorite);
            });

            // update badge avec animation
            updateCounterBadge(manager.count(), true);

            // Émettre un événement pour notifier les autres modules (search overlay)
            document.dispatchEvent(new CustomEvent('favorites-updated', {
                detail: { competenceId, isFavorite, count: manager.count() }
            }));
        }

        // attache les écouteurs
        containers.forEach(container => {
            container.addEventListener("click", handleStarClick);
        });

        if (dynContainer) {
            dynContainer.addEventListener("click", handleStarClick);
        }
    }

    // DOM badge
    function createFavoritesBadge() {
        const navbar = document.querySelector(".navbar");
        if (!navbar) return null;

        // DOM
        const badge = document.createElement("a");
        badge.className = "favorites-badge";
        badge.id = "favorites-badge";
        badge.textContent = "0";
        badge.style.display = "none";
        badge.href = '/html/favoris.html';
        badge.setAttribute('title', 'Mes favoris');
        badge.setAttribute('aria-label', 'Voir mes compétences favorites');

        navbar.appendChild(badge);
        return badge;
    }

    // BONUS 5 : Animer l'étoile lors du toggle
    function animateStar(star, isFavorite) {
        // Retirer les classes d'animation précédentes
        star.classList.remove('animating', 'favoriting', 'is-favorite');
        
        // Force reflow pour redémarrer l'animation
        void star.offsetWidth;
        
        if (isFavorite) {
            // Animation spéciale en or pour l'ajout
            star.classList.add('favoriting', 'is-favorite');
        } else {
            // Animation bounce simple pour le retrait
            star.classList.add('animating');
        }
        
        // Nettoyer les classes après l'animation
        setTimeout(() => {
            star.classList.remove('animating', 'favoriting');
        }, 600);
    }
    
    // Mettre à jour l'affichage d'une étoile (sans animation)
    function updateStarDisplay(star, isFavorite) {
        star.textContent = isFavorite ? '★' : '☆';
        
        // Appliquer la classe is-favorite pour la couleur dorée persistante
        if (isFavorite) {
            star.classList.add('is-favorite');
        } else {
            star.classList.remove('is-favorite');
        }
    }

    function updateCounterBadge(count, animate = false) {
        const badge = document.getElementById("favorites-badge");
        if (!badge) return; 

        badge.textContent = `⭐ ${count}`;
        badge.style.display = count > 0 ? "flex" : "none";
        
        // BONUS 5 : Animation pulse du badge
        if (animate) {
            badge.classList.remove('updating');
            void badge.offsetWidth; // Force reflow
            badge.classList.add('updating');
            
            setTimeout(() => {
                badge.classList.remove('updating');
            }, 400);
        }
    }

    // CORRECTIF : Resynchronisation après mise à jour DOM par main.js
    function refreshStarsInContainer(container, manager) {
        if (!container) return;
        
        const oldStars = container.querySelectorAll('.favorite-star');
        oldStars.forEach(star => star.remove());
        
        const competences = container.querySelectorAll('.item-competence');
        competences.forEach(competence => addStarToCompetence(competence, manager));
    }

    function observeDynamicCompetences(manager) {
        const dynContainer = document.getElementById('competences-dynamiques');
        if (!dynContainer) return;
    }

    // CORRECTIF : Écoute de l'événement custom émis par main.js après chaque update
    function listenToCompetencesUpdates(manager) {
        document.addEventListener('competences-updated', (event) => {
            const { container } = event.detail;
            if (!container) return;

            setTimeout(() => {
                refreshStarsInContainer(container, manager);
            }, 10);
        });
    }

    // refresh stars
    function refreshAllStars() {
        const allstars = document.querySelectorAll('.favorite-star');

        allstars.forEach(star => {
            const competenceId = star.dataset.competenceId;
            const isFavorite = manager.has(competenceId);
            updateStarDisplay(star, isFavorite);
        });
    }

    // CORRECTIF : Synchronisation des favoris entre onglets
    window.addEventListener('storage', (event) => {
        if (event.key !== manager.storageKey) return;

        // Recharger les favoris depuis localStorage
        manager.favorites = manager.load();

        // Mettre à jour l'affichage des étoiles
        refreshAllStars();

        // Mettre à jour le badge
        updateCounterBadge(manager.count());

        document.dispatchEvent(new CustomEvent('favorites-updated', {
            detail: { 
                favorites: manager.getAll(),
                count: manager.count(),
                source: 'storage-sync'
            }
        }));
    });

    // initialisation
    // création du badge
    createFavoritesBadge();
    // ajout des étoiles à toutes les compétences
    addStarsToAllCompetences(manager);
    // click sur les étoiles
    setupEventDelegation(manager);
    // correctifs
    observeDynamicCompetences(manager);
    listenToCompetencesUpdates(manager);
    // mise à jour du badge
    updateCounterBadge(manager.count());
});