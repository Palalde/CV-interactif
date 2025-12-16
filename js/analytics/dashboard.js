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

    // fetch et afficher les languages GitHub
    const githubLanguages = await fetchGitHubLanguages("Palalde");
    if (Object.keys(githubLanguages).length > 0) {
        createBarChart(githubLanguages, grid, "Langages GitHub Utilisés");
    }

    // activer le bouton d'export CSV
    const exportBtn = document.getElementById("export-csv-btn");
    exportBtn.disabled = false;
    // ajouter l'event listener
    exportBtn.addEventListener("click", () => {
        exportToCSV(report.byCategory, "competences_by_category.csv");
    });

    // canvas pie chart
    const pieSection = document.getElementById("pie-chart-section");
    pieSection.style.display = "block";
    // camembert
    createPieChart(report.byCategory, "pie-chart-canvas", "pie-chart-legend");

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

    // github api languages 
    async function fetchGitHubLanguages(username) {
        const url = `https://api.github.com/users/${username}/repos`;

        try {
            const response = await fetch(url);
            
            // verifier la reponse
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Json data
            const repos = await response.json();
            
            // filtrer les repos qui ont des languages definis
            const reposWithLanguages = repos.filter(repo => repo.language);

            // compter les occurrences des languages
            const languageCount = reposWithLanguages.reduce((acc, repo) => {
                const lang = repo.language;
                acc[lang] = (acc[lang] || 0) + 1;
                return acc;
            }, {});

            return languageCount;
        
        } catch (error) {
            console.error('Error fetching GitHub languages:', error);
            return {};
        }
    }

    // export to CSV function
    function exportToCSV(data, filename = 'stats.csv') {
        // en-têtes CSV
        let csvContent = "label,value\n";

        // ajouter les données
        Object.entries(data).forEach(([label, value]) => {
            csvContent += `${label},${value}\n`;
        });

        // créer un blob et un lien de téléchargement
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        // url temporaire
        const url = URL.createObjectURL(blob);
        // lien invisible
        const link = document.createElement("a");
        link.href = url
        link.download = filename;
        // ajouter au DOM et cliquer
        document.body.appendChild(link);
        link.click();
        // nettoyer
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // canvas camembert

    function createPieChart(data, canvasId, legendId) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext("2d");
        const legend = document.getElementById(legendId);

        // dimensions et centre du cercle
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;

        // palette de couleurs
        const colors = [
            "#6c5ce7", "#00b894", "#fdcb6e", "#e17055", 
            "#0984e3", "#d63031", "#00cec9", "#e84393"
        ];

        // calculer le total
        const total = Object.values(data).reduce((sum, val) => sum + val, 0);

        // dessiner les portions
        let currentAngle = -Math.PI / 2;

        Object.entries(data).forEach(([label, value], index) => {
            // angle de la portion
            const sliceAngle = (value / total) * 2 * Math.PI;

            // colors
            const color = colors[index % colors.length];

            // dessiner la portion
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();

            // mettre à jour l'angle courant
            currentAngle += sliceAngle;
            
            // ajouter à la légende
            const legendItem = document.createElement("div");
            legendItem.className = "legend-item";
            legendItem.innerHTML =`
                <span class="legend-color" style="background: ${color}"></span>
                <span class="legend-label">${label}</span>
                <span class="legend-value">${value}</span>
            `;
          
            legend.appendChild(legendItem);

        });    
    }
});
