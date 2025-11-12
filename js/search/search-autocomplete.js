import { filterCompetences } from './search-util.js';

// variables
let dropdownElement = null;

// filter competences based on query
function autocompleteFilterCompetences(query) {
    // 2 characters minimum
    if (!query || query.trim() === '' || query.length < 2) {
         return [];
    }
   
    // Filter competences
    const results = filterCompetences(query); // appelle filterCompetences

    // Keep only unique names
    const uniqueNames = new Set();
    const uniqueResults = results.filter(item => {
        if (uniqueNames.has(item.name)) {
            return false;
        }
        uniqueNames.add(item.name);
        return true;
    });

    return uniqueResults.slice(0, 5); // Prendre seulement les 5 premiers résultats uniques
}

// create dropdown
function getOrCreateDropdown() {
  
    // Vérifier si elle existe déjà
    if (dropdownElement) {
        return dropdownElement; 
    }

    // Création
    dropdownElement = document.createElement('div');
    dropdownElement.className = 'autocomplete-dropdown';
    dropdownElement.style.display = 'none'; 
    
    // DOM - Insérer dans la barre de recherche du header
    const searchBar = document.querySelector('.header-search-bar');
    if (searchBar) {
        searchBar.appendChild(dropdownElement);
    }

    // click event listener
    dropdownElement.addEventListener('click', (e) => {
        // Trouver l'élément .autocomplete-item le plus proche
        const clickedItem = e.target.closest('.autocomplete-item');
        
        if (clickedItem) {
            const competenceName = clickedItem.dataset.name;
            
            const event = new CustomEvent('autocomplete-select', {  
                detail: { query: competenceName } 
            });
        
            document.dispatchEvent(event);

            // Cacher le dropdown après la sélection
            hideDropdown();
        }
    });

    return dropdownElement;
}

// populate dropdown with suggestions
function populateDropdown(suggestions) {
    const dropdown = getOrCreateDropdown(); // Récupère ou crée

    // Vider le contenu précédent
    dropdown.replaceChildren(); 

    if (suggestions.length === 0) {
        dropdown.style.display = 'none'; 
        return;
    }

    // Créer un item pour chaque suggestion
    suggestions.forEach(competence => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        
        // Émoji pour indiquer l'autocomplete
        const icon = document.createElement('span');
        icon.className = 'autocomplete-icon';
        icon.textContent = '⚡';
        
        const text = document.createElement('span');
        text.textContent = competence.name;
        
        item.appendChild(icon);
        item.appendChild(text);
        item.dataset.name = competence.name;
        
        dropdown.appendChild(item);
    });

    //Afficher le dropdown
    dropdown.style.display = 'block'; 
}

// hide dropdown function
function hideDropdown() {
    const dropdown = getOrCreateDropdown();
    dropdown.style.display = 'none';
}

// fonction principale d'initialisation de l'autocomplete
export function initAutocomplete() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
  
    // Écouter les entrées utilisateur
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        
        // Filtrer les compétences
        const suggestions = autocompleteFilterCompetences(query);
        
        // Peupler la dropdown
        populateDropdown(suggestions);
    });

    // click dehors
    document.addEventListener('click', (e) => {
        const dropdown = getOrCreateDropdown();
        const searchBar = document.querySelector('.header-search-bar');
        
        if (searchBar && !searchBar.contains(e.target)) { 
            hideDropdown();
        }
    });

    // escape key
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideDropdown();
            searchInput.blur(); 
        }
    });

    // enter key
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            hideDropdown();
            searchInput.blur(); 
        }
    });
}