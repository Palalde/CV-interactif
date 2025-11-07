
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

export function displayResults(results) {
    console.table(results.map(r => ({ 
        name: r.name, 
        categories: r.categories?.join(', ') || 'N/A', 
        hashtags: r['#']?.join(', ') || 'N/A'
    })));
}