// Functions
// get history from localStorage
export function getHistory(STORAGE_KEY) {
    const historyJson = localStorage.getItem(STORAGE_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
}

// add query to history
export function addToHistory(item, STORAGE_KEY, MAX_HISTORY_SIZE) {
    if (!item) return;

    let history = getHistory(STORAGE_KEY); //appel getHistory

    // remove duplicates
    history = history.filter(historyItem => {
        // object for color themes
        if (typeof item === 'object' && typeof historyItem === 'object') {
            return JSON.stringify(historyItem) !== JSON.stringify(item);
        }

        // string for search
        return historyItem.toLowerCase() !== item.toLowerCase();
    });

    // add to the beginning
    history.unshift(item);

    // limit size
    if (history.length > MAX_HISTORY_SIZE) {
        history = history.slice(0, MAX_HISTORY_SIZE);
    }

    // save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

// clear history
export function clearHistory(STORAGE_KEY) {
    localStorage.removeItem(STORAGE_KEY);
}