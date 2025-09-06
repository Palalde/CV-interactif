// =============================================================
// trade.js — Démo de graphique de trading (bougies)
// Objectif: créer un graphique responsive dans #trading-live-chart
// Important: aucune logique modifiée; uniquement des commentaires ajoutés.
// Prérequis: la librairie LightweightCharts est chargée via le CDN dans la page HTML.
// =============================================================

// Ensure DOM is ready and LightweightCharts CDN is available
document.addEventListener("DOMContentLoaded", function () {
	// Vérifie que la librairie LightweightCharts est bien chargée
	if (!window.LightweightCharts) {
		console.warn("LightweightCharts CDN not loaded yet.");
		return;
	}

	// Fonction utilitaire: génère un set d'exemple de bougies (OHLC)
	// Chaque objet contient { time, open, high, low, close }
	function generateCandlestickData() {
		return [
			{ time: "2018-12", open: 10, high: 15, low: 10, close: 12 },
			{ time: "2019-01", open: 12, high: 18, low: 11, close: 17 },
            { time: "2019-02", open: 17, high: 20, low: 12, close: 15 },
            { time: "2019-03", open: 15, high: 16, low: 13, close: 14 },
            { time: "2019-04", open: 14, high: 18, low: 14, close: 17 },
            { time: "2019-05", open: 17, high: 19, low: 15, close: 16 },
            { time: "2019-06", open: 16, high: 22, low: 15, close: 20 },
            { time: "2019-07", open: 20, high: 25, low: 18, close: 23 },
            { time: "2019-08", open: 23, high: 29, low: 22, close: 27 },
            { time: "2019-09", open: 27, high: 30, low: 25, close: 28 },
            { time: "2019-10", open: 28, high: 30, low: 26, close: 27 },
            { time: "2019-11", open: 27, high: 27, low: 20, close: 22 },
            { time: "2019-12", open: 22, high: 24, low: 22, close: 23 },
            { time: "2020-01", open: 23, high: 26, low: 22, close: 25 },
            { time: "2020-02", open: 25, high: 28, low: 24, close: 27 },
            { time: "2020-03", open: 27, high: 36, low: 26, close: 33 },
            { time: "2020-04", open: 33, high: 45, low: 30, close: 42 },
            { time: "2020-05", open: 42, high: 48, low: 40, close: 45 },
            { time: "2020-06", open: 45, high: 49, low: 39, close: 41 },
            { time: "2020-07", open: 41, high: 44, low: 36, close: 38 },
            { time: "2020-08", open: 38, high: 40, low: 32, close: 36 },
            { time: "2020-09", open: 36, high: 43, low: 35, close: 40 },
            { time: "2020-10", open: 40, high: 42, low: 37, close: 39 },
            { time: "2020-11", open: 39, high: 53, low: 36, close: 50 },
            { time: "2020-12", open: 50, high: 60, low: 45, close: 55 },
            { time: "2021-01", open: 55, high: 58, low: 53, close: 54 },
            { time: "2021-02", open: 54, high: 57, low: 50, close: 52 },
            { time: "2021-03", open: 52, high: 56, low: 51, close: 55 },
            { time: "2021-04", open: 55, high: 60, low: 54, close: 58 },
            { time: "2021-05", open: 58, high: 62, low: 57, close: 60 },
            { time: "2021-06", open: 60, high: 65, low: 55, close: 58 },
            { time: "2021-07", open: 58, high: 60, low: 52, close: 54 },
            { time: "2021-08", open: 54, high: 64, low: 47, close: 59 },
            { time: "2021-09", open: 59, high: 69, low: 65, close: 66 },
            { time: "2021-10", open: 66, high: 70, low: 68, close: 64 },
            { time: "2021-11", open: 64, high: 68, low: 72, close: 67 },
            { time: "2021-12", open: 67, high: 69, low: 62, close: 63 },
            { time: "2022-01", open: 63, high: 65, low: 58, close: 62 },
            { time: "2022-02", open: 62, high: 71, low: 60, close: 65 },
            { time: "2022-03", open: 65, high: 76, low: 68, close: 74 },
            { time: "2022-04", open: 74, high: 84, low: 67, close: 72 },
            { time: "2022-05", open: 72, high: 78, low: 75, close: 77 },
            { time: "2022-06", open: 77, high: 85, low: 80, close: 82 },
            { time: "2022-07", open: 82, high: 90, low: 85, close: 89 },
            { time: "2022-08", open: 89, high: 100, low: 91, close: 91 },
            { time: "2022-09", open: 91, high: 91, low: 68, close: 75 },
            { time: "2022-10", open: 75, high: 80, low: 70, close: 78 },
            { time: "2022-11", open: 78, high: 85, low: 75, close: 80 },
            { time: "2022-12", open: 80, high: 83, low: 62, close: 64 },
            { time: "2023-01", open: 64, high: 68, low: 45, close: 59 },
            { time: "2023-02", open: 59, high: 70, low: 60, close: 65 },
            { time: "2023-03", open: 65, high: 75, low: 62, close: 72 },
            { time: "2023-04", open: 72, high: 78, low: 70, close: 74 },
            { time: "2023-05", open: 74, high: 76, low: 65, close: 67 },
            { time: "2023-06", open: 67, high: 70, low: 60, close: 62 },
            { time: "2023-07", open: 62, high: 68, low: 58, close: 66 },
            { time: "2023-08", open: 66, high: 67, low: 52, close: 54 },
            { time: "2023-09", open: 54, high: 60, low: 50, close: 58 },
            { time: "2023-10", open: 58, high: 59, low: 53, close: 53 },
            { time: "2023-11", open: 53, high: 54, low: 50, close: 52 },
            { time: "2023-12", open: 52, high: 55, low: 45, close: 54 },
            { time: "2024-01", open: 54, high: 59, low: 50, close: 52 },
            { time: "2024-02", open: 52, high: 57, low: 48, close: 55 },
			{ time: "2024-03", open: 55, high: 63, low: 56, close: 62 },
			{ time: "2024-04", open: 62, high: 75, low: 65, close: 72 },
			{ time: "2024-05", open: 72, high: 78, low: 70, close: 74 },
			{ time: "2024-06", open: 74, high: 77, low: 60, close: 70 },
			{ time: "2024-07", open: 70, high: 76, low: 65, close: 72 },
			{ time: "2024-08", open: 72, high: 78, low: 70, close: 74 },
			{ time: "2024-09", open: 74, high: 79, low: 53, close: 55 },
			{ time: "2024-10", open: 55, high: 57, low: 42, close: 44 },
			{ time: "2024-11", open: 44, high: 62, low: 48, close: 53 },
			{ time: "2024-12", open: 53, high: 67, low: 49, close: 63 },
			{ time: "2025-01", open: 63, high: 65, low: 40, close: 43 },
			{ time: "2025-02", open: 43, high: 44, low: 27, close: 29 },
			{ time: "2025-03", open: 29, high: 39, low: 25, close: 25 },
			{ time: "2025-04", open: 25, high: 32, low: 24, close: 29 },

		];
    }

	// Trouve le conteneur du graphique; si absent, on arrête
	const container = document.getElementById("trading-live-chart");
	if (!container) return;

	// Crée le graphique dans le conteneur
			const chart = LightweightCharts.createChart(container);
	const candleStickData = generateCandlestickData();
	const mainSeries = chart.addSeries(LightweightCharts.CandlestickSeries);
	mainSeries.setData(candleStickData);

	// Theme synchronization via MutationObserver on body.classList
	const body = document.body;
	const applyTheme = () => {
		const isLight = body.classList.contains('light');
		const computed = getComputedStyle(document.body);
		const bg = isLight
			? (computed.getPropertyValue('--background-moyen-light')?.trim() || '#edead7')
			: (computed.getPropertyValue('--background-moyen-dark')?.trim() || '#20203b');
		const text = isLight
			? (computed.getPropertyValue('--text-dark')?.trim() || '#1a1a2e')
			: (computed.getPropertyValue('--text-light')?.trim() || '#f5f6fa');

		// Softer grid and borders depending on the theme
		const gridColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.06)';
		const borderColor = isLight ? 'rgba(0, 0, 0, 0.18)' : 'rgba(255, 255, 255, 0.12)';
		const crosshairColor = isLight ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.25)';

		chart.applyOptions({
			layout: { background: { type: 'solid', color: bg }, textColor: text },
			grid: {
				vertLines: { color: gridColor },
				horzLines: { color: gridColor },
			},
			rightPriceScale: { borderColor },
			timeScale: { borderColor },
			crosshair: {
				vertLine: { color: crosshairColor },
				horzLine: { color: crosshairColor },
			},
		});
	};

	applyTheme();
	const mo = new MutationObserver(applyTheme);
	mo.observe(body, { attributes: true, attributeFilter: ['class'] });

	chart.timeScale().fitContent();

	// TOOLTIP
const toolTipWidth = 96;

// Create and style the tooltip html element
const toolTip = document.createElement('div');
toolTip.style = `width: ${toolTipWidth}px; height: 300px; position: absolute; display: none; padding: 8px; box-sizing: border-box; font-size: 12px; text-align: left; z-index: 1000; top: 12px; left: 1px; pointer-events: none; border-radius: 4px 4px 0px 0px; border-bottom: none; box-shadow: 0 2px 5px 0 rgba(117, 134, 150, 0.45);font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`;
toolTip.style.background = `rgba(${'255, 255, 255'}, 0.25)`;
toolTip.style.color = 'black';
toolTip.style.borderColor = 'rgba( 239, 83, 80, 1)';
container.appendChild(toolTip);

// update tooltip
chart.subscribeCrosshairMove(param => {
    if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > container.clientWidth ||
        param.point.y < 0 ||
        param.point.y > container.clientHeight
    ) {
        toolTip.style.display = 'none';
    } else {
        // time will be in the same format that we supplied to setData.
        // thus it will be YYYY-MM-DD
        const dateStr = param.time;
        toolTip.style.display = 'block';
        const data = param.seriesData.get(mainSeries);
        const price = data.value !== undefined ? data.value : data.close;
        toolTip.innerHTML = `<div style="color: ${'rgba( 239, 83, 80, 1)'}">Début</div><div style="color: ${'black'}">
            ${dateStr}
            </div><div style="font-size: 14px; margin: 4px 0px; color: ${'white'}">
            Je commence le trading a plein temp et apprend a avoir une meilleur gestion de risque afin de generer un revenu stable
            </div>`;

        let left = param.point.x; // relative to timeScale
        const timeScaleWidth = chart.timeScale().width();
        const priceScaleWidth = chart.priceScale('left').width();
        const halfTooltipWidth = toolTipWidth / 2;
        left += priceScaleWidth - halfTooltipWidth;
        left = Math.min(left, priceScaleWidth + timeScaleWidth - toolTipWidth);
        left = Math.max(left, priceScaleWidth);

        toolTip.style.left = left + 'px';
        toolTip.style.top = 0 + 'px';
    }
});

    // ===================== PHASE TEXT DYNAMIQUE (ajout) =====================
    // Configuration initiale des plages et textes (modifiable via l'API ci-dessous)
    const tradingPhaseTextConfig = [
        {
            start: '2018-12', end: '2022-07',
            title: 'Début',
            description: 'Je commence le trading à plein temps et j’apprends une meilleure gestion du risque afin de générer un revenu stable.'
        },
        {
            start: '2022-08', end: '2023-11',
            title: 'Interdiction',
            description: 'A ce moment ma stratégie est en grande partie basé sur les contrats futures qui devennent interdit en France'
        },
        {
            start: '2023-12', end: '2024-12',
            title: 'Adaptation',
            description: 'Je me réinvente pour essayer de réobtenir un revenu stable grace aux avantages de l\'usdt sur binance'
        },
        {
            start: '2025-01', end: '2025-04',
            title: 'Fin',
            description: 'L\'usdt devient interdit en France, j\'ai du mal a me réinventer je suis contraint d\'arrêter le trading pour trouver un emploi alimentaire'
        },
    ];

    // Helper: compare dates au format YYYY-MM (ou YYYY-MM-DD → on garde YYYY-MM)
    function normaliseMonth(str) { return str.slice(0, 7); }
    function inRange(target, start, end) {
        return target >= start && target <= end;
    }

    // API publique pour modifier dynamiquement les textes depuis ailleurs si besoin
    window.setTradingPhaseTexts = function(newConfigArray) {
        if (!Array.isArray(newConfigArray)) return;
        tradingPhaseTextConfig.length = 0;
        newConfigArray.forEach(obj => {
            if (obj && obj.start && obj.end) {
                tradingPhaseTextConfig.push({
                    start: normaliseMonth(obj.start),
                    end: normaliseMonth(obj.end),
                    title: obj.title || 'Phase',
                    description: obj.description || ''
                });
            }
        });
    };

    // Deuxième listener: ajuste le contenu du tooltip APRÈS le code existant sans le modifier
    chart.subscribeCrosshairMove(param => {
        if (!param || !param.time || toolTip.style.display === 'none') return;
        const month = normaliseMonth(String(param.time));
        const phase = tradingPhaseTextConfig.find(p => inRange(month, p.start, p.end));
        if (!phase) return; // hors plage définie → laisser le contenu initial

        // On reconstruit le bloc avec les textes dynamiques tout en gardant le style de base
        toolTip.innerHTML = `<div style="color: rgba(239, 83, 80, 1)">${phase.title}</div>
            <div style="color: black">${month}</div>
            <div style="font-size: 14px; margin: 4px 0; color: white; line-height:1.25">${phase.description}</div>`;
    });
    // ================== FIN PHASE TEXT DYNAMIQUE (ajout) =====================
	

});

