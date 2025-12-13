import { StatsProcessor } from "./stats-processor.js";

addEventListener("DOMContentLoaded", async () => {
    // DOM elements
    const loading = document.getElementById("stats-loading");
    const grid = document.getElementById("stats-grid");

    // processor instance de window global competences
    const processor = new StatsProcessor(window.CV_COMPETENCES || []);

    // generer le rapport
    const report = await processor.generateFullReport();
    console.log("Generated Report:", report);

    // masquer le chargement et afficher la grille
    loading.style.display = "none";
    grid.style.display = "grid";

    // creer les graphiques
    createBarChart(report.byCategory, grid, "Compétences par Catégorie");
    createBarChart(report.byPeriod, grid, "Compétences par Période");
    createBarChart(report.percentages, grid, "Pourcentage de Compétences avec/sans Lien");

    // conftion des graphiques (placeholders)
    function createBarChart(data, container, title) {
        // chart container
        const chartDiv = document.createElement("div");
        chartDiv.className = "chart-section";

        // title
        const titleEl = document.createElement("h3");
        titleEl.textContent = title;
        chartDiv.appendChild(titleEl);

        // bars max value
        const max = Math.max(...Object.values(data));

        // create bars
        Object.entries(data).forEach(([label, value]) => {
            // container elements
            const barContainer = document.createElement("div");
            barContainer.className = "bar-container";

            // bar elements
            const barLabel = document.createElement("span");
            barLabel.className = "bar-label";
            barLabel.textContent = label;

            const barWrapper = document.createElement("div");
            barWrapper.className = "bar-wrapper";

            const barFill = document.createElement("div");
            barFill.className = "bar-fill";
            const percentage = (value / max) * 100;

            // Animation progressive
            setTimeout(() => {
                barFill.style.width = `${percentage}%`;
            }, 100);

            // bar value
            const barValue = document.createElement("span");
            barValue.className = "bar-value";
            barValue.textContent = value;

            barWrapper.appendChild(barFill);
            barContainer.appendChild(barLabel);
            barContainer.appendChild(barWrapper);
            barContainer.appendChild(barValue);

            chartDiv.appendChild(barContainer);
        });

        container.appendChild(chartDiv);
    }
});
