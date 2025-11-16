import { filterCompetences, debounce, displayResults } from "./search-util.js"; 
import { addToHistory } from "./search-history.js";
import { initAutocomplete } from "./search-autocomplete.js";
import { initFavoritesFilter } from "../favorites/filter-favorites.js";
import { FavoritesManager } from "../favorites/favorites-manager.js";

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

    // Instance du manager pour vérifier les favoris
    const favoritesManager = new FavoritesManager();

    // Gestion du filtre des favoris
    const favoritesFilter = initFavoritesFilter(() => {
        // callback de relance de la recherche
        const query = searchInput.value;
        performSearch(query); //appel performSearch
    });

    // 🆕 Écouter les changements de favoris pour mettre à jour l'affichage
    // Si le filtre est actif, relancer la recherche quand on ajoute/retire un favori
    document.addEventListener('favorites-updated', (event) => {
        console.log('🔔 Événement favorites-updated reçu:', event.detail);
        console.log('📊 Filtre actif ?', favoritesFilter?.isActive());
        console.log('📋 Favoris actuels:', favoritesManager.getAll());
        
        if (favoritesFilter && favoritesFilter.isActive()) {
            const query = searchInput.value;
            console.log('🔄 Relance de la recherche avec query:', query);
            performSearch(query);
        }
    });
    
    // Fonction de recherche principale
    function performSearch(query) {
        let results;

        // Si le filtre favoris est actif
        if (favoritesFilter && favoritesFilter.isActive()) {
            const favoritesIds = favoritesManager.getAll();
            console.log('🔍 PerformSearch - Favoris IDs (frais du localStorage):', favoritesIds);
            
            // Si pas de query : afficher TOUS les favoris
            if (!query || query.trim() === '') {
                results = window.CV_COMPETENCES.filter(comp => favoritesIds.includes(comp.id));
                console.log('✨ Résultats (tous favoris):', results.length, 'trouvés');
            } 
            // Si query présente : filtrer d'abord par texte, puis par favoris
            else {
                results = filterCompetences(query);
                results = results.filter(comp => favoritesIds.includes(comp.id));
                console.log('✨ Résultats (query + favoris):', results.length, 'trouvés');
            }
        } 
        // Sinon, recherche normale
        else {
            results = filterCompetences(query);
        }

        // history (seulement si query non vide)
        if (query && query.trim() !== '') {
            addToHistory(query);
        }

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
