import { debounce, normalizeText, displayResults } from "./search-util.js";   

document.addEventListener("DOMContentLoaded", () => {
    // Variables 
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    // Fonction de recherche principale
    function performSearch(query) {
        if (!query || query.trim() === '') {
            return;
        }

        // normalize / filtrage
        const normalizedQuery = normalizeText(query); 

        const results = window.CV_COMPETENCES.filter((item) => { 
            const normalizedItem = normalizeText(  
                item.name + ' ' +
                item.periode + ' ' +
                item.description + ' ' + 
                item.categories.join(' ') + ' ' + 
                item['#'].join(' ')
            );
            
            return normalizedItem.includes(normalizedQuery);
        });

        // Afficher les résultats 
        displayResults(results); //appelle la fonction displayResults
    }
    
    // Debounce de performSearch
    const debouncedSearch = debounce(performSearch, 300); 

    // Déclenche la recherche lors de la saisie 
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        debouncedSearch(query); // appelle performSearch via debouncedSearch
    });
});
