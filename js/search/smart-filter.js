import { debounce, normalizeText, displayResults } from "./search-util.js";   

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    function performSearch(query) {
        if (!query || query.trim() === '') {
            return;
        }

        const normalizedQuery = normalizeText(query);

        const results = window.CV_COMPETENCES.filter((item) => {
            const normalizedItem = normalizeText(
                item.name + ' ' + 
                item.description + ' ' + 
                item.categories.join(' ') + ' ' + 
                item['#'].join(' ')
            );
            
            return normalizedItem.includes(normalizedQuery);
        });

        console.log('Résultats de la recherche pour "', query, '":', results);

        displayResults(results);
    }

    const debouncedSearch = debounce(performSearch, 300);

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        debouncedSearch(query);
    });

});
