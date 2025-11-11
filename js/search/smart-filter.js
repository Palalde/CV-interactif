import { debounce, normalizeText, displayResults } from "./search-util.js"; 
import { addToHistory } from "./search-history.js";

// main search function

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

        // history
        addToHistory(query); //appel addToHistory

        // Afficher les résultats 
        displayResults(results, query); //appelle displayResults (query pour surlignage)
    }
    
    // Debounce de performSearch
    const debouncedSearch = debounce(performSearch, 300); 

    // Déclenche la recherche lors de la saisie 
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        debouncedSearch(query); // appelle performSearch via debouncedSearch
    });

    // listener history search
    document.addEventListener('history-search', (e) => {
      const query = e.detail.query;

      // Remplir l'input
      searchInput.value = query;
      
      //Remplir l'input et lancer la recherche
      debouncedSearch(query); // appelle performSearch via debouncedSearch
    });
});
