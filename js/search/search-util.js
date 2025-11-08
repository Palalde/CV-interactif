// debounce
export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// normalizeText
export function normalizeText(text) {
   if (typeof text !== 'string') {
        if (text == null) return '';
        text = String(text);
    }
  
    return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, '');
}

// displayResults
// Labels
const CATEGORY_LABELS = {
  'soft-skills': 'Soft skills',
  'hard-skills': 'Hard skills',
  frontend: 'Frontend',
  backend: 'Backend',
  projets: 'Projets'
};

const PERIODE_LABELS = {
  etudes: 'Études',
  trading: 'Trading',
  leclerc: 'E.Leclerc',
  dev: 'Développement'
};

// Affichage des résultats de la recherche
export function displayResults(results) {
        // Variables
        const container = document.querySelector('.search-overlay-results');
        
        // check / placeholder
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

        // container de la liste des résultats
        const resultsList = document.createElement('ul');
        resultsList.className = 'search-results-list';
        resultsList.setAttribute('role', 'list');

        // Ajout des éléments de résultat
        results.forEach((competence) => {
            const item = buildResultItem(competence); //appelle la fonction de template
            resultsList.appendChild(item);
        });

        // Compteur de résultats
        const compteur = document.createElement('div');
        compteur.className = 'search-result-counter';
        compteur.textContent = `${results.length} résultat${results.length > 1 ? 's' : ''}`;

        // Ajout des éléments au conteneur
        container.append(compteur, resultsList);
    }

    // template de la liste des résultats
    function buildResultItem(competence) {
      const item = document.createElement('li');
      item.className = 'search-result-item';
      item.tabIndex = 0;

      const header = document.createElement('div');
      header.className = 'search-result-header';
      item.appendChild(header);

      // header
      const title = document.createElement('h3');
      title.className = 'search-result-title';
      title.textContent = competence?.name || 'Compétence';

      const periodeBadge = document.createElement('span');
      periodeBadge.className = 'search-result-periode';
      periodeBadge.textContent = PERIODE_LABELS[competence?.periode] || competence?.periode || '';
      
      header.append(title, periodeBadge);

      // content
      if (competence?.description) {
        const description = document.createElement('p');
        description.className = 'search-result-description';
        description.textContent = competence.description;
        item.appendChild(description);
      }

      const categories = Array.isArray(competence?.categories) ? competence.categories : [];
      if (categories.length) {
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'search-result-tags';
        categories.forEach((category) => {
          const tag = document.createElement('span');
          tag.className = 'search-result-tag';
          tag.textContent = CATEGORY_LABELS[category] || category;
          tagsContainer.appendChild(tag);
        });
        item.appendChild(tagsContainer);
      }

      if (competence?.link) {
        const link = document.createElement('a');
        link.className = 'search-result-link';
        link.href = competence.link;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Voir la ressource';
        item.appendChild(link);
      }

      return item;
    }