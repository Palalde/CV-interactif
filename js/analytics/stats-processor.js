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

    // fetch GitHub languages
    static async fetchGitHubLanguages(username) {
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

    // comperer des profils GitHub
    static async compareGitHubProfiles(user1, user2) {
        const [langs1, langs2] = await Promise.all([
            StatsProcessor.fetchGitHubLanguages(user1),
            StatsProcessor.fetchGitHubLanguages(user2),
        ]);

        return { 
            user1 : { username: user1, languages: langs1 },
            user2 : { username: user2, languages: langs2 }
        };
    }
}