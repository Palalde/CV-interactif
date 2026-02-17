import { addToHistory, getHistory, clearHistory } from "../utility/history.js";

// Constants Storage
const STORAGE_KEY = 'colorThemeHistory';
const MAX_HISTORY_SIZE = 5;

// DOM Elements
const historyContainer = document.getElementById('color-history');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const historyEmpty = document.getElementById('color-history-empty');
const historyList = document.getElementById('color-history-list');

// Functions to manage color theme history
export function addToColorHistory(colorData) {
    const colorItem = {
        hex: colorData.hex.value,
        name: colorData.name.value,
    }
    // add to history
    return addToHistory(colorItem, STORAGE_KEY, MAX_HISTORY_SIZE);
}

// get history
function getColorHistory() {
    return getHistory(STORAGE_KEY);
}

// clear history
export function clearColorHistory() {
   return clearHistory(STORAGE_KEY);
}

// create history item
function createHistoryItem(colorObj) {
    // contenair
    const item = document.createElement('div');
    item.className = 'color-history-item';
    // couleur de fond
    item.style.backgroundColor = colorObj.hex;
    // label hex
    const hexLabel = document.createElement('span');
    hexLabel.className = 'color-history-item-hex';
    hexLabel.textContent = colorObj.hex;
    // label name
    const nameLabel = document.createElement('span');
    nameLabel.className = 'color-history-item-name';
    nameLabel.textContent = colorObj.name;
    // ajouter au contenair
    item.appendChild(hexLabel);
    item.appendChild(nameLabel);
   
    // Event listener pour appliquer la couleur au clic
    item.addEventListener('click', function() {
        // custom event pour informer analyzeColor
        const event = new CustomEvent('color-history-select', {
            detail: { 
                hex: colorObj.hex,
                name: colorObj.name
             }
        });
        document.dispatchEvent(event);
    });
    // create history item
    return item;
}

// display history
export function displayColorHistory() {
    // obtenir l'historique
    const history = getColorHistory();
    // vider
    historyList.innerHTML = '';
    
    // checker si vide
    if (history.length === 0) {
        // afficher message vide
        historyEmpty.style.display = 'block';
        historyList.style.display = 'none';
    } else {
        // remplir la liste
        historyEmpty.style.display = 'none';
        historyList.style.display = 'grid';
        // ajouter chaque item
        history.forEach( color => {
            const item = createHistoryItem(color); // Passer l'objet complet
            historyList.appendChild(item);
        });
    }
    
    // afficher le container
    historyContainer.style.display = 'block';
}
