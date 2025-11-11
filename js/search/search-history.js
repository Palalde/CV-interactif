// Value
const STORAGE_KEY = 'searchHistory';
const MAX_HISTORY_SIZE = 8;

// Functions
// get history from localStorage
export function getHistory() {
    const historyJson = localStorage.getItem(STORAGE_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
}

// add query to history
export function addToHistory(query) {
    if (!query || query.trim() === '') return;
    let history = getHistory(); //appel getHistory

    // remove duplicates
    history = history.filter(item => item.toLowerCase() !== query.toLowerCase());

    // add to the beginning
    history.unshift(query);

    // limit size
    if (history.length > MAX_HISTORY_SIZE) {
        history = history.slice(0, MAX_HISTORY_SIZE);
    }

    // save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

// clear history
export function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
}

// create history block element
export function createHistoryBlock() {
    const history = getHistory(); //appel getHistory
    
    if (history.length === 0) return null;

    // block
    const block = document.createElement('div');
    block.className = 'search-history-block';

    //content
    const title = document.createElement('h4');
    title.className = 'search-history-title';
    title.textContent = 'Recherches récentes';
    block.appendChild(title);

    const list = document.createElement('ul');
    list.className = 'search-history-list';

    // terms
    history.forEach(term => {
        const item = document.createElement('li');
        item.className = 'search-history-item';
        item.textContent = term;
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');

        // click event 
        item.addEventListener('click', () => {
            const event = new CustomEvent('history-search', { detail: { query: term } });
            document.dispatchEvent(event);
        });

        list.appendChild(item);
    });

    block.appendChild(list);

    return block;       
}

