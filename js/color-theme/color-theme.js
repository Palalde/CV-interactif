import { fetchColorPalette } from '../color-theme/color-palette.js';

// ==============================
// localStorage key
// ==============================
const THEME_STORAGE_KEY = 'custom-color-theme';

// ==============================
// Helper functions
// ==============================
// Determine if contrast color is closer to white or black
function isContrastLight(hexColor) {
    // Remove # if present
    const hex = hexColor.replace('#', '');
    
    // Convert hex to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate relative luminance (ITU-R BT.709)
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    
    // If luminance > 0.5, it's closer to white (light contrast)
    return luminance > 0.5;
}

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

    // Force theme toggle based on contrast color
    const contrastIsLight = isContrastLight(colorData.contrast.value);
    // If contrast is light (white), force dark mode
    // If contrast is dark (black), force light mode
    const shouldBeLightMode = !contrastIsLight;
    
    // Update body class
    document.body.classList.toggle('light', shouldBeLightMode);
    
    // Update theme toggle checkboxes
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMock = document.getElementById('theme-toggle-mock');
    if (themeToggle) themeToggle.checked = shouldBeLightMode;
    if (themeToggleMock) themeToggleMock.checked = shouldBeLightMode;
    
    // Update nav icons
    if (typeof window.updateNavIcons === 'function') {
        window.updateNavIcons(shouldBeLightMode);
    }

    // Update trading chart theme if available
    if (typeof window.updateTradingChartTheme === 'function') {
        window.updateTradingChartTheme();
    }
}

// reset theme function
export function resetColorTheme() {
    Object.entries(originalTheme).forEach(([variable, color]) => {
        document.documentElement.style.setProperty(variable, color);
    });
    
    // clear localStorage
    localStorage.removeItem(THEME_STORAGE_KEY);
    
    // Restore original theme preference from localStorage or system
    const savedThemePreference = localStorage.getItem('theme-preference');
    const shouldBeLightMode = savedThemePreference === 'light' || 
        (savedThemePreference === null && window.matchMedia('(prefers-color-scheme: light)').matches);
    
    // Update body class
    document.body.classList.toggle('light', shouldBeLightMode);
    
    // Update theme toggle checkboxes
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMock = document.getElementById('theme-toggle-mock');
    if (themeToggle) themeToggle.checked = shouldBeLightMode;
    if (themeToggleMock) themeToggleMock.checked = shouldBeLightMode;
    
    // Update nav icons
    if (typeof window.updateNavIcons === 'function') {
        window.updateNavIcons(shouldBeLightMode);
    }

    // Update trading chart theme if available
    if (typeof window.updateTradingChartTheme === 'function') {
        window.updateTradingChartTheme();
    }
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
        
        // Force theme toggle based on contrast color
        const contrastIsLight = isContrastLight(themeData.contrastHex);
        // If contrast is light (white), force dark mode
        // If contrast is dark (black), force light mode
        const shouldBeLightMode = !contrastIsLight;
        
        // Update body class
        document.body.classList.toggle('light', shouldBeLightMode);
        
        // Update theme toggle checkboxes
        const themeToggle = document.getElementById('theme-toggle');
        const themeToggleMock = document.getElementById('theme-toggle-mock');
        if (themeToggle) themeToggle.checked = shouldBeLightMode;
        if (themeToggleMock) themeToggleMock.checked = shouldBeLightMode;
        
        // Update nav icons
        if (typeof window.updateNavIcons === 'function') {
            window.updateNavIcons(shouldBeLightMode);
        }
        
        // Update trading chart theme if available
        if (typeof window.updateTradingChartTheme === 'function') {
            window.updateTradingChartTheme();
        }
        
        return themeData;
        
    } catch (error) {
        console.warn('Failed to load custom theme:', error);
        return null;
    }
}
