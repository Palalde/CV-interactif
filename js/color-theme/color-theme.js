import { fetchColorPalette } from '../color-theme/color-palette.js';

// ==============================
// localStorage key
// ==============================
const THEME_STORAGE_KEY = 'custom-color-theme';

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

    // save to localStorage
    const themeData = {
        isCustomThemeActive: true,
        baseColorHex: colorData.hex.value,
        monochromeHex: monochromeColors.map(color => color.hex.value),
        contrastHex: colorData.contrast.value
    };
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themeData));
}

// reset theme function
export function resetColorTheme() {
    Object.entries(originalTheme).forEach(([variable, color]) => {
        document.documentElement.style.setProperty(variable, color);
    });
    
    // clear localStorage
    localStorage.removeItem(THEME_STORAGE_KEY);
}

// ==============================
// Load saved theme
// ==============================
export function loadSavedTheme() {
    try {
        // get saved data
        const saved = localStorage.getItem(THEME_STORAGE_KEY);
        
        // check if data exists
        if (!saved) return null;
        
        // parse JSON
        const themeData = JSON.parse(saved);
        
        // validate structure
        if (!themeData.isCustomThemeActive || 
            !themeData.monochromeHex || 
            !Array.isArray(themeData.monochromeHex) ||
            themeData.monochromeHex.length !== 5 ||
            !themeData.baseColorHex ||
            !themeData.contrastHex) {
            console.warn('Invalid theme data structure');
            return null;
        }
        
        // apply theme from saved data
        const themeConfig = {
            // dark mode
            '--background-general-dark': themeData.monochromeHex[0],
            '--background-moyen-dark': themeData.monochromeHex[1],
            '--background-leger-dark': themeData.monochromeHex[2],
            '--background-surface-dark': themeData.baseColorHex,
            '--text-light': themeData.contrastHex,
            // light mode
            '--background-general-light': themeData.monochromeHex[0],
            '--background-moyen-light': themeData.monochromeHex[1],
            '--background-leger-light': themeData.monochromeHex[2],
            '--background-surface-light': themeData.baseColorHex,
            '--text-dark': themeData.contrastHex
        };
        
        Object.entries(themeConfig).forEach(([variable, color]) => {
            document.documentElement.style.setProperty(variable, color);
        });
        
        return themeData;
        
    } catch (error) {
        console.warn('Failed to load custom theme:', error);
        return null;
    }
}
