import { getHistory, addToHistory } from "../utility/history.js";

// Storage constants
const STORAGE_KEY = "search-history";
const MAX_HISTORY_SIZE = 8;

export function addToSearchHistory(query) {
  return addToHistory(query, STORAGE_KEY, MAX_HISTORY_SIZE); //appel addToHistory
}

function getSearchHistory() {
  return getHistory(STORAGE_KEY); //appel getHistory
}

// create history block element
export function createHistoryBlock() {
  const history = getSearchHistory(); //appel getSearchHistory

  if (history.length === 0) return null;

  // block
  const block = document.createElement("div");
  block.className = "search-history-block";

  //content
  const title = document.createElement("h4");
  title.className = "search-history-title";
  title.textContent = "Recherches récentes";
  block.appendChild(title);

  const list = document.createElement("ul");
  list.className = "search-history-list";

  // terms
  history.forEach((term) => {
    const item = document.createElement("li");
    item.className = "search-history-item";
    item.textContent = term;
    item.setAttribute("role", "button");
    item.setAttribute("tabindex", "0");

    // click event
    item.addEventListener("click", () => {
      const event = new CustomEvent("history-search", {
        detail: { query: term },
      });
      document.dispatchEvent(event);
    });

    list.appendChild(item);
  });

  block.appendChild(list);

  return block;
}
