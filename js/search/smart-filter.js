import { filterCompetences, debounce, normalizeText, displayResults } from "./search-util.js"; 
import { addToHistory } from "./search-history.js";
import { initAutocomplete } from "./search-autocomplete.js";

// main search function

document.addEventListener("DOMContentLoaded", () => {
    // Variables 
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    // listener autocomplete search
    initAutocomplete();
    
    // Fonction de recherche principale
    function performSearch(query) {
        // Filtrer les compétences
        const results = filterCompetences(query); //appel filterCompetences

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
