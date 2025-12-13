// stats processor class
export class StatsProcessor {
    constructor(competences) {
        this.competences = competences;
    }

    // simuler un traitement lourd
    async processAsync(data, processFn, delay = 100) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(processFn(data));
            }, delay);
        });
    }

    // period analysis
    async analyzeByPeriod() {
        // process competences by period
        return this.processAsync(this.competences, (data) => {
            // reduce to count competences per period
            return data.reduce((acc, comp) => {
                const periode = comp.periode;
                acc[periode] = (acc[periode] || 0) + 1;
                return acc;
            }, {});
        });
    }

    // category analysis
    async analyzeByCategory() {
        // process competences by category
        return this.processAsync(this.competences, (data) => {
            // reduce to count competences per category
            return data.reduce((acc, comp) => {
                comp.categories.forEach((cat) => {
                    acc[cat] = (acc[cat] || 0) + 1;
                });
                return acc;
            }, {});
        });
    }

    // calculate percentage link vs nolink
    async calculatePercentages() {
        // total competences
        const total = this.competences.length;

        // process competences to calculate percentages
        return this.processAsync(this.competences, (data) => {
            // count with and without links
            const withLinks = data.filter((c) => c.link !== null).length;
            const withoutLinks = total - withLinks;

            // calculate percentages
            return {
                withLinks: Math.round((withLinks / total) * 100),
                withoutLinks: Math.round((withoutLinks / total) * 100),
                total,
            };
        });
    }

    // report generation
    async generateFullReport() {
        // run all analyses in parallel
        const [byCategory, byPeriod, percentages] = await Promise.all([
            this.analyzeByCategory(),
            this.analyzeByPeriod(),
            this.calculatePercentages(),
        ]);

        // return consolidated report
        return {
            byCategory,
            byPeriod,
            percentages,
            timestamp: new Date().toISOString(),
        };
    }
}