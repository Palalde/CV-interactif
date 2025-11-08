import { debounce, normalizeText, buildResultItem } from "./search-util.js";   

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

    function displayResults(results) {
        const container = document.querySelector('.search-overlay-results');
        
        if (!container) {
            console.error('❌ Conteneur de résultats non trouvé');
            return;
        }

        container.replaceChildren();

        if (results.length === 0) {
            const message = document.createElement('p');
            message.className = 'search-overlay-placeholder';
            message.textContent = 'Aucun résultat trouvé. Essayez un autre terme.';
            container.appendChild(message);
            return;
        }

        const resultsList = document.createElement('ul');
        resultsList.className = 'search-results-list';
        resultsList.setAttribute('role', 'list');

        results.forEach((competence) => {
            const item = buildResultItem(competence);
            resultsList.appendChild(item);
        });

        
        container.appendChild(resultsList);
    }

});
