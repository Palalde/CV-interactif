import { filterCompetences, debounce, displayResults } from "./search-util.js";
import { addToSearchHistory } from "./search-history.js";
import { initAutocomplete } from "./search-autocomplete.js";
import { initFavoritesFilter } from "../favorites/filter-favorites.js";
import { initCompetenceFilters } from "./filter-competences.js";
import { FavoritesManager } from "../favorites/favorites-manager.js";

// main search function

document.addEventListener("DOMContentLoaded", () => {
  // Variables
  const searchInput = document.querySelector(".search-input");
  if (!searchInput) return;

  // Empêcher la soumission du formulaire
  const searchForm = document.querySelector(".header-search-bar");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
    });
  }

  // listener autocomplete search
  initAutocomplete();

  // FAVORIS
  // Instance du manager pour vérifier les favoris
  const favoritesManager = new FavoritesManager();

  const favoritesFilter = initFavoritesFilter(() => {
    // callback de relance de la recherche
    const query = searchInput.value;
    performSearch(query); //appel performSearch
  });

  // FILTRES PAR PÉRIODE / CATÉGORIE
  const competenceFilters = initCompetenceFilters(() => {
    const query = searchInput.value;
    performSearch(query);
  });

  // Si le filtre est actif, relancer la recherche quand on ajoute/retire un favori
  document.addEventListener("favorites-updated", (event) => {
    if (favoritesFilter && favoritesFilter.isActive()) {
      const query = searchInput.value;
      performSearch(query);
    }
  });

  // Fonction de recherche principale
  function performSearch(query) {
    let results;

    const hasCompetenceFilters =
      competenceFilters && competenceFilters.isActive();
    const hasFavoritesFilter = favoritesFilter && favoritesFilter.isActive();

    // Déterminer la base de résultats
    if (!query || query.trim() === "") {
      // Pas de query : afficher tout si un filtre est actif, sinon rien
      if (hasFavoritesFilter || hasCompetenceFilters) {
        results = [...window.CV_COMPETENCES];
      } else {
        results = [];
      }
    } else {
      // Query présente : filtrer par texte
      results = filterCompetences(query);
    }

    // Appliquer filtre favoris
    if (hasFavoritesFilter) {
      const favoritesIds = favoritesManager.getAll();
      results = results.filter((comp) => favoritesIds.includes(comp.id));
    }

    // Appliquer filtres période / catégorie
    if (hasCompetenceFilters) {
      results = competenceFilters.applyFilters(results);
    }

    // history (seulement si query non vide)
    if (query.length >= 3) {
      addToSearchHistory(query);
    }

    // Afficher les résultats
    displayResults(results, query); //appelle displayResults (query pour surlignage)
  }

  // Debounce de performSearch
  const debouncedSearch = debounce(performSearch, 300);

  // Déclenche la recherche lors de la saisie
  searchInput.addEventListener("input", (e) => {
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
  document.addEventListener("history-search", handleSearchSelection);
  document.addEventListener("autocomplete-select", handleSearchSelection);
});
