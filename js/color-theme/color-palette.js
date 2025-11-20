// Sélection des éléments DOM nécessaires
const paletteContainer = document.getElementById('color-palette');
const paletteSelect = document.getElementById('palette-mode');
const paletteColors = document.getElementById('palette-colors');
// loading element
const colorsLoading = document.getElementById('color-loading');
const colorError = document.getElementById('color-error');

// ============================================
// Function async and results display for color palette
// ============================================

// loading state
function showPaletteLoading () {
    colorsLoading.style.display = 'block';
    paletteColors.style.display = 'none';
    colorError.style.display = 'none';
}

// results state
function showPaletteResults () {
    colorsLoading.style.display = 'none';
    paletteColors.style.display = 'grid';
    colorError.style.display = 'none';
}

// error state
function showPaletteError (message) {
    colorsLoading.style.display = 'none';
    paletteColors.style.display = 'none';
    colorError.style.display = 'flex';
    // set message
    const errorMessage = document.getElementById('palette-error-message');
    errorMessage.textContent = message;
}

// fetch function
async function fetchColorPalette(hexColor, mode = 'monochrome', count = 5) {
    // Construire l'URL avec les paramètres
    const apiUrl = `https://www.thecolorapi.com/scheme?hex=${hexColor}&mode=${mode}&count=${count}`;
    
    // Faire le fetch
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    // Retourner data.colors
    return data.colors;
}

// generate palette function
export async function generatePalette(hexColor) {
    // Récupérer le mode sélectionné
    const mode = paletteSelect.value;
    // Afficher l'état de chargement
    showPaletteLoading();
    // Fetch la palette
    try {
        const colors = await fetchColorPalette(hexColor, mode, 5);
        // Afficher les couleurs
        displayPalette(colors);
        // refresh ui
        showPaletteResults();
        // error handling
        } catch (error) {
        console.error('Erreur lors de la récupération de la palette:', error);
        showPaletteError('Erreur lors de la récupération de la palette.');
    }
}

// Color card
function createPaletteColorCard(colorData) {
    // container
    const card = document.createElement('div');
    card.className = 'palette-color-item';
    card.style.backgroundColor = colorData.hex.value;
    // info container
    const info = document.createElement('div');
    info.className = 'palette-color-info';
    // hex label
    const hexLabel = document.createElement('span');
    hexLabel.className = 'palette-color-hex';
    hexLabel.textContent = colorData.hex.value;
    // name label 
    const nameLabel = document.createElement('span');
    nameLabel.className = 'palette-color-name';
    nameLabel.textContent = colorData.name.value;

    // append
    info.appendChild(hexLabel);
    info.appendChild(nameLabel);
    card.appendChild(info);

    // event listener custom event
    card.addEventListener('click', function() {
        const event = new CustomEvent('palette-color-select', {
            detail: {
                hex: colorData.hex.value,
                name: colorData.name.value
            }
        });
        document.dispatchEvent(event);
    });

    return card;
}

// 3. Fonction pour afficher la palette
function displayPalette(colors) {
    // Vider le conteneur
    paletteColors.innerHTML = '';
    // Boucler sur colors 
    colors.forEach(color => {
        // Créer une carte pour chaque couleur
        const colorCard = createPaletteColorCard(color);
        // Ajouter au DOM
        paletteColors.appendChild(colorCard);
    });
    // Afficher la section
    paletteContainer.style.display = 'block';
}