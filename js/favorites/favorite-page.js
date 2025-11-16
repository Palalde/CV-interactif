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

    // gestion des actions d'export et d'importation des favoris

    // exportation
    const exportBtn = document.getElementById('export-favorites');

    // gestion de l'exportation
    exportBtn.addEventListener('click', () => {
        const JsonData = manager.exportToJSON();
        const blob = new Blob([JsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `favoris-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });

    // importation
    const importInput = document.getElementById('import-favorites-input');

    // gestion de l'importation
    importInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const jsonString = e.target.result;
            const success = manager.importFromJSON(jsonString);

            if (success) {
                alert('Importation réussie ! La page va se recharger.');
                window.location.reload();
            } else {
                alert('Erreur lors de l\'importation. Veuillez vérifier le fichier.');
            }

            event.target.value = '';
        };
        reader.readAsText(file);
    });

    // initialisation de l'interface des favoris
    // affichage des favoris
    const grid = document.getElementById('favorites-grid');
    favoritesObjects.forEach(competence => {
        const card = createFavoriteCard(competence);
        grid.appendChild(card);
    });

    updateUI(favoritesObjects);
});