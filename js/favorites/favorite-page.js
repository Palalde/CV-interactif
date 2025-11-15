import { FavoritesManager } from "./favorites-manager.js";

document.addEventListener("DOMContentLoaded", () => {
    // variables
    const manager = new FavoritesManager(); 
    const favoriteIds = manager.getAll(); 
    const favoritesObjects = favoriteIds.map(id => window.CV_COMPETENCES.find(comp => comp.id === id));

    // éléments du DOM
    // met à jour l'interface utilisateur en fonction des favoris
    function updateUI(favoritesObjects) {
        const isEmpty = favoritesObjects.length === 0;
    
        document.getElementById('favorites-empty').style.display = isEmpty ? 'block' : 'none';
        document.getElementById('favorites-grid').style.display = isEmpty ? 'none' : 'grid';
        document.getElementById('favorites-count').textContent = isEmpty 
        ? 'Aucun favori pour le moment'
        : `${favoritesObjects.length} compétence${favoritesObjects.length > 1 ? 's' : ''} favorite${favoritesObjects.length > 1 ? 's' : ''}`;

    }
    
    // cards
    function createFavoriteCard(competence) {
        // div
        const card = document.createElement('div');
        card.className = 'favorite-card';
        
        // header
        const header = document.createElement('header');
        header.className = 'favorite-card-header';
        
        // title  
        const title = document.createElement('h3');
        title.className = 'favorite-card-name';
        title.textContent = competence.name;
        // remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'favorite-remove-btn';
        removeBtn.setAttribute('aria-label', `Retirer ${competence.name} des favoris`);
        removeBtn.textContent = '★';
        removeBtn.addEventListener('click', () => {
            manager.remove(competence.id);
            window.location.reload(); // Recharge la page
        });

        header.append(title, removeBtn);
        
        // description
        const description = document.createElement('p');
        description.className = 'favorite-card-description';
        description.textContent = competence.description;
        
        // footer
        const footer = document.createElement('footer');
        footer.className = 'favorite-card-footer';
        
        // tags
        competence.categories.forEach(category => {
            const tag = document.createElement('span');
            tag.className = 'favorite-card-tag';
            tag.textContent = category;
            footer.appendChild(tag);
        });

        // link
        if (competence.link) {
            const link = document.createElement('a');
            link.className = 'favorite-card-link';
            link.href = competence.link;
            link.textContent = 'GitHub →'; // Texte plus explicite
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            footer.appendChild(link);
        }

        card.append(header, description, footer);
        return card;
    }

    // initialisation de l'interface des favoris
    // affichage des favoris
    const grid = document.getElementById('favorites-grid');
    favoritesObjects.forEach(competence => {
        const card = createFavoriteCard(competence);
        grid.appendChild(card);
    });

    updateUI(favoritesObjects);
});