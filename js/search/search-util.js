export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

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

export function buildResultItem(competence) {
      const item = document.createElement('li');
      item.className = 'search-result-item';
      item.tabIndex = 0;

      const header = document.createElement('div');
      header.className = 'search-result-header';

      const title = document.createElement('h3');
      title.className = 'search-result-title';
      title.textContent = competence?.name || 'Compétence';
      header.appendChild(title);

      const periodeBadge = document.createElement('span');
      periodeBadge.className = 'search-result-periode';
      periodeBadge.textContent = PERIODE_LABELS[competence?.periode] || competence?.periode || '';
      header.appendChild(periodeBadge);

      item.appendChild(header);

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