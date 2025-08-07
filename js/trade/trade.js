// Import lightweight-charts from CDN
document.addEventListener('DOMContentLoaded', function() {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js';
    script.async = true;
    script.onload = function() {
        console.log('Lightweight Charts library loaded successfully');
        // Initialize your charts here
    };
    script.onerror = function() {
        console.error('Failed to load Lightweight Charts library');
    };
    document.head.appendChild(script);
});