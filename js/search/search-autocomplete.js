import { filterCompetences } from './search-util.js';

// variables
let dropdownElement = null;
let selectedIndex = -1; 

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
        
        // Si un item a été cliqué
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
    const dropdown = getOrCreateDropdown(); 
    dropdown.replaceChildren(); 

    // reset selected index
    selectedIndex = -1; 

    // no suggestions
    if (suggestions.length === 0) {
        dropdown.style.display = 'none'; 
        return;
    }

    // Créer un item pour chaque suggestion
    suggestions.forEach(competence => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        
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

// update for keyboard navigation
function updateSelectedItem() {
    const dropdown = getOrCreateDropdown();
    const items = dropdown.querySelectorAll('.autocomplete-item');
  
    // Retirer la classe active de tous les items
    items.forEach(item => item.classList.remove('active'));
  
    // Ajouter la classe active à l'index sélectionné
    if (selectedIndex >= 0 && selectedIndex < items.length) {
        items[selectedIndex].classList.add('active');
        items[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
}

// fonction principale d'initialisation de l'autocomplete
export function initAutocomplete() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
  
    // Écouter les entrées utilisateur
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        
        // Filtrer les compétences
        const suggestions = autocompleteFilterCompetences(query); // appelle autocompleteFilterCompetences
        
        // Peupler la dropdown
        populateDropdown(suggestions); // appelle populateDropdown
    });

    // click dehors
    document.addEventListener('click', (e) => {
        const dropdown = getOrCreateDropdown();
        const searchBar = document.querySelector('.header-search-bar');
        
        if (searchBar && !searchBar.contains(e.target)) { 
            hideDropdown(); // appelle hideDropdown
        }
    });

    // keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
        const dropdown = getOrCreateDropdown();
        const isVisible = dropdown.style.display === 'block';
        
        if (!isVisible) return; 
        
        // Get all autocomplete items
        const items = dropdown.querySelectorAll('.autocomplete-item');
        const maxIndex = items.length - 1;
        
        // Handle key events
        switch(e.key) {
            case 'ArrowDown':
            e.preventDefault(); 
            selectedIndex = selectedIndex < maxIndex ? selectedIndex + 1 : 0; 
            updateSelectedItem();
            break;
            
            case 'ArrowUp':
            e.preventDefault();
            selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : maxIndex; 
            updateSelectedItem();
            break;
            
            case 'Enter':
            e.preventDefault();
            hideDropdown();
            if (selectedIndex >= 0 && selectedIndex < items.length) {
                items[selectedIndex].click();
            }

            break;
            
            case 'Escape':
            hideDropdown();
            selectedIndex = -1; 
            searchInput.blur();
            break;
        }
    });
}