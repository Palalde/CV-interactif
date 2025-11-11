import { createHistoryBlock } from './search-history.js';

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

// filterCompetences
export function filterCompetences(query) { 
    if (!query || query.trim() === '') {
        return [];
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
    
    return results;
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
export function displayResults(results, query) {
  // Variables
  const container = document.querySelector('.search-overlay-results');
  
  // check / reset
  if (!container) {
    console.error('❌ Conteneur de résultats non trouvé');
    return;
  }

  container.replaceChildren();

  // history
  const historyBlock = createHistoryBlock(); //appel createHistoryBlock
  if (historyBlock) {
    container.appendChild(historyBlock); // Ajout dans container
  }

  // placeholder
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
    const item = buildResultItem(competence, query); //appelle la fonction de template
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
function buildResultItem(competence, query) {
  const item = document.createElement('li');
  item.className = 'search-result-item';
  item.tabIndex = 0;

  const header = document.createElement('div');
  header.className = 'search-result-header';
  item.appendChild(header);

  // header
  const title = document.createElement('h3');
  title.className = 'search-result-title';
  const rawName = competence?.name || 'Compétence';
  title.innerHTML = highlightMatch(rawName, query); //surlignage

  const periodeBadge = document.createElement('span');
  periodeBadge.className = 'search-result-periode';
  const rawPeriode = PERIODE_LABELS[competence?.periode] || competence?.periode || '';
  periodeBadge.innerHTML = highlightMatch(rawPeriode, query); //surlignage
  
  header.append(title, periodeBadge);

  // content
  if (competence?.description) {
    const description = document.createElement('p');
    description.className = 'search-result-description';
    description.innerHTML = highlightMatch(competence.description, query); //surlignage
    item.appendChild(description);
  }

  const categories = Array.isArray(competence?.categories) ? competence.categories : [];
  if (categories.length) {
    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'search-result-tags';
    categories.forEach((category) => {
      const tag = document.createElement('span');
      tag.className = 'search-result-tag';
      const rawTag = CATEGORY_LABELS[category] || category; 
      tag.innerHTML = highlightMatch(rawTag, query); //surlignage
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

// surlignage

// regex escape 
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Mapping des lettres avec leurs variantes accentuées
const accentMap = {
  'a': '[aàâäáãå]',
  'e': '[eèéêë]',
  'i': '[iìíîï]',
  'o': '[oòóôöõ]',
  'u': '[uùúûü]',
  'c': '[cç]',
  'n': '[nñ]',
  'y': '[yÿ]',
  // Majuscules
  'A': '[AÀÂÄÁÃÅ]',
  'E': '[EÈÉÊË]',
  'I': '[IÌÍÎÏ]',
  'O': '[OÒÓÔÖÕ]',
  'U': '[UÙÚÛÜ]',
  'C': '[CÇ]',
  'N': '[NÑ]',
  'Y': '[YŸ]'
};

// Création du pattern regex tolérant les accents
function createAccentInsensitivePattern(query) {
  let pattern = '';
  for (let char of query) {
    if (accentMap[char]) {
      pattern += accentMap[char]; // appelle le pattern tolérant
    } else {
      pattern += escapeRegex(char); // appelle escapeRegex
    }
  }
  return pattern;
}

// highlightMatch
export function highlightMatch(text, query) {
  if (!text || !query) return text || '';

  // regex safe
  const pattern = createAccentInsensitivePattern(query); //appelle la fonction de pattern 
  const regex = new RegExp(pattern, 'gi');

  // surlignage
  const textMark = text.replace(regex, (match) => `<mark>${match}</mark>`);
  
  return textMark;
} 