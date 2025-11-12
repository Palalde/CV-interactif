import { filterCompetences, debounce, displayResults } from "./search-util.js"; 
import { addToHistory } from "./search-history.js";
import { initAutocomplete } from "./search-autocomplete.js";

// main search function

document.addEventListener("DOMContentLoaded", () => {
    // Variables 
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    // Empêcher la soumission du formulaire 
    const searchForm = document.querySelector('.header-search-bar');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
        });
    }

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

    // History & autocomplete selection handler
    function handleSearchSelection(e) {
        const query = e.detail.query;
        searchInput.value = query;
        performSearch(query); // Recherche immédiate 
    }

    // Écouter les événements de sélection
    document.addEventListener('history-search', handleSearchSelection);
    document.addEventListener('autocomplete-select', handleSearchSelection);
});
