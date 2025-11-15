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
            existingStar.textContent = isFavorite ? '★' : '☆';
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

            // CORRECTIF : Synchroniser toutes les instances d'une même compétence
            const allStarsForThisId = document.querySelectorAll(`.favorite-star[data-competence-id="${competenceId}"]`);
            allStarsForThisId.forEach(s => {
                s.textContent = isFavorite ? '★' : '☆';
            });

            // update badge
            updateCounterBadge(manager.count());
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
        const badge = document.createElement("div");
        badge.className = "favorites-badge";
        badge.id = "favorites-badge";
        badge.textContent = "0";
        badge.style.display = "none";

        navbar.appendChild(badge);
        return badge;
    }

    function updateCounterBadge(count) {
        const badge = document.getElementById("favorites-badge");
        if (!badge) return; 

        badge.textContent = `⭐ ${count}`;
        badge.style.display = count > 0 ? "flex" : "none";
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