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

  // fetch GitHub languages (avec répartition détaillée par bytes)
  static async fetchGitHubLanguages(username) {
    const reposUrl = `https://api.github.com/users/${username}/repos`;

    try {
      const response = await fetch(reposUrl);

      // verifier la reponse
      if (!response.ok) {
        // Déterminer le type d'erreur
        let errorMessage = `Erreur ${response.status}`;
        if (response.status === 403) {
          errorMessage = `Limite API GitHub atteinte. Réessayez dans quelques minutes.`;
        } else if (response.status === 404) {
          errorMessage = `Utilisateur "${username}" introuvable.`;
        }
        return {
          data: {},
          error: { status: response.status, message: errorMessage },
        };
      }

      // Json data
      const repos = await response.json();

      // Pour chaque repo, fetch les langages détaillés
      const languagePromises = repos.map((repo) =>
        fetch(repo.languages_url)
          .then((res) => (res.ok ? res.json() : {}))
          .catch(() => ({})),
      );

      // Attendre toutes les réponses
      const languagesArrays = await Promise.all(languagePromises);

      // Agréger tous les bytes de tous les langages
      const languageBytes = languagesArrays.reduce((acc, repoLangs) => {
        Object.entries(repoLangs).forEach(([lang, bytes]) => {
          acc[lang] = (acc[lang] || 0) + bytes;
        });
        return acc;
      }, {});

      return { data: languageBytes, error: null };
    } catch (error) {
      console.error("Error fetching GitHub languages:", error);
      return {
        data: {},
        error: {
          status: 0,
          message: "Erreur réseau. Vérifiez votre connexion.",
        },
      };
    }
  }

  // comperer des profils GitHub
  static async compareGitHubProfiles(user1, user2) {
    const [result1, result2] = await Promise.all([
      StatsProcessor.fetchGitHubLanguages(user1),
      StatsProcessor.fetchGitHubLanguages(user2),
    ]);

    // Collecter les erreurs
    const errors = [];
    if (result1.error) errors.push(result1.error);
    if (result2.error) errors.push(result2.error);

    return {
      user1: { username: user1, languages: result1.data },
      user2: { username: user2, languages: result2.data },
      errors: errors,
    };
  }
}
