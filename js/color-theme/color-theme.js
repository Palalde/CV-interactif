import { fetchColorPalette } from '../color-theme/color-palette.js';

// ==============================
// Original value 
// ==============================
const originalTheme = {
    /* darkmode */
    '--background-general-dark': '#1a1a2e',
    '--background-surface-dark': '#29295a',
    '--background-leger-dark': '#1e1e36',
    '--background-moyen-dark': '#20203b',
    '--text-light': '#f5f6fa',
    // lightmode
    '--text-dark': '#1a1a2e',
    '--background-general-light': '#f5f6fa',
    '--background-surface-light': '#e3dacb',
    '--background-leger-light': '#f0ede3',
    '--background-moyen-light': '#edead7',
};

// ==============================
// main function
// ============================
export function applyColorTheme(colorData, monochromeColors) {
    // object theme to modify
    const themeConfig = {
        // dark mode
        '--background-general-dark': monochromeColors[0].hex.value,
        '--background-moyen-dark': monochromeColors[1].hex.value,
        '--background-leger-dark': monochromeColors[2].hex.value,
        '--background-surface-dark': colorData.hex.value,
        '--text-light': colorData.contrast.value,
        // light mode
        '--background-general-light': monochromeColors[0].hex.value,
        '--background-moyen-light': monochromeColors[1].hex.value,
        '--background-leger-light': monochromeColors[2].hex.value,
        '--background-surface-light': colorData.hex.value,
        '--text-dark': colorData.contrast.value
    };

    // apply theme
    Object.entries(themeConfig).forEach(([variable, color]) => {
        document.documentElement.style.setProperty(variable, color);
    });
}

// reset theme function
export function resetColorTheme() {
    Object.entries(originalTheme).forEach(([variable, color]) => {
        document.documentElement.style.setProperty(variable, color);
    });
}
