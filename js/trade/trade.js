// Chargement de la librairie Lightweight Charts + initialisation d'un simple graphique démo.
document.addEventListener('DOMContentLoaded', () => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js';
    script.async = true;
    script.onload = initTradingDemoChart;
    script.onerror = () => console.error('Echec de chargement de Lightweight Charts');
    document.head.appendChild(script);
});



