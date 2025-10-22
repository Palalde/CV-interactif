(() => {
	const competences = [
		{
			id: 'methodes-travail-scientifique',
			name: 'Méthodes de travail scientifique',
			periode: 'etudes',
			categories: ['soft-skills'],
			'#': ['methodologie', 'scientifique', 'epf'],
			description:
				"Organisation du travail et démarches de résolution propres aux disciplines scientifiques.",
			link: null
		},
		{
			id: 'analyse-synthese',
			name: 'Analyse et synthèse',
			periode: 'etudes',
			categories: ['soft-skills'],
			'#': ['analyse', 'synthese', 'raisonnement'],
			description:
				"Capacité à extraire l'essentiel d'un volume d'informations complexe et à le restituer clairement.",
			link: null
		},
		{
			id: 'psychologie-cognitive',
			name: 'Psychologie cognitive',
			periode: 'etudes',
			categories: ['soft-skills'],
			'#': ['psychologie', 'cognitive', 'fac'],
			description:
				"Compréhension des mécanismes mentaux utiles à la pédagogie, à l'apprentissage et à la communication.",
			link: null
		},
		{
			id: 'rigueur-organisation',
			name: 'Rigueur et sens de l’organisation',
			periode: 'etudes',
			categories: ['soft-skills'],
			'#': ['organisation', 'rigueur', 'fac'],
			description:
				"methode d'organisation du travail et gestion du temps.",
			link: null
		},
        {
			id: 'anglais',
			name: 'Anglais',
			periode: 'etudes',
			categories: ['hard-skills'],
			'#': ['langue', 'communication', 'fac'],
			description:
				"Compétences en communication écrite et orale en anglais. niveau \"fluent\".",
			link: null
		},
		{
			id: 'analyse-technique',
			name: 'Analyse technique',
			periode: 'trading',
			categories: ['hard-skills'],
			'#': ['trading', 'graphique', 'indicateurs'],
			description:
				"Lecture des graphiques, compréhension des tendances et interprétation des indicateurs de marché.",
			link: null
		},
		{
			id: 'analyse-fondamentale',
			name: 'Analyse fondamentale',
			periode: 'trading',
			categories: ['hard-skills'],
			'#': ['macro', 'finance', 'resultats'],
			description:
				"Évaluation de la valeur intrinsèque d'un actif sur la base d'indicateurs macro et micro-économiques.",
			link: null
		},
		{
			id: 'gestion-risque',
			name: 'Gestion du risque',
			periode: 'trading',
			categories: ['hard-skills', 'soft-skills'],
			'#': ['money-management', 'stop-loss', 'discipline'],
			description:
				"Mise en place de stratégies de money management et de règles de discipline pour préserver le capital.",
			link: null
		},
		{
			id: 'psychologie-marches',
			name: 'Psychologie des marchés',
			periode: 'trading',
			categories: ['soft-skills'],
			'#': ['psychologie', 'emotion', 'discipline'],
			description:
				"Gestion de l'impact émotionnel et compréhension du comportement collectif sur les marchés financiers.",
			link: null
		},
		{
			id: 'relation-client-fruits-legumes',
			name: 'Relation client en rayon fruits & légumes',
			periode: 'leclerc',
			categories: ['soft-skills'],
			'#': ['relation-client', 'communication', 'service'],
			description:
				"Accueil, écoute active et conseils personnalisés aux clients pour les guider vers les bons produits.",
			link: null
		},
		{
			id: 'travail-equipe-rayon',
			name: "Travail d'équipe en grande distribution",
			periode: 'leclerc',
			categories: ['soft-skills'],
			'#': ['collaboration', 'entraide', 'communication'],
			description:
				"Coordination quotidienne avec les collègues de rayon pour assurer un service fluide et continu.",
			link: null
		},
		{
			id: 'rigueur-procedes-hygiene',
			name: 'Rigueur et respect des procédures',
			periode: 'leclerc',
			categories: ['soft-skills'],
			'#': ['rigueur', 'hygiene', 'fiabilite'],
			description:
				"Application stricte des normes d'hygiène, de traçabilité et des consignes de manipulation des produits frais.",
			link: null
		},
		{
			id: 'gestion-stress-affluence',
			name: "Gestion du stress en période d'affluence",
			periode: 'leclerc',
			categories: ['soft-skills'],
			'#': ['stress', 'priorisation', 'peak-time'],
			description:
				"Maintien d'un service efficace et calme lors des pics de fréquentation et des demandes simultanées.",
			link: null
		},
		{
			id: 'sens-service-polyvalence',
			name: 'Sens du service & polyvalence',
			periode: 'leclerc',
			categories: ['soft-skills'],
			'#': ['polyvalence', 'adaptabilite', 'service'],
			description:
				"Capacité à passer rapidement du conseil client au réassort ou à la pesée pour répondre aux besoins du rayon.",
			link: null
		},
		{
			id: 'fiabilite-horaires',
			name: 'Fiabilité et ponctualité',
			periode: 'leclerc',
			categories: ['soft-skills'],
			'#': ['fiabilite', 'ponctualite', 'responsabilite'],
			description:
				"Respect des horaires décalés, prise de poste autonome et sens des responsabilités au quotidien.",
			link: null
		},
		{
			id: 'html-css',
			name: 'HTML5/CSS3',
			periode: 'dev',
			categories: ['hard-skills', 'frontend'],
			'#': ['html', 'css', 'integration'],
			description:
				"Intégration d'interfaces statiques et respect des contraintes responsive et accessibilité.",
			link: null
		},
        {
			id: 'tailwind-css',
			name: 'Tailwind CSS',
			periode: 'dev',
			categories: ['hard-skills', 'frontend'],
			'#': ['tailwind', 'css', 'utility-first'],
			description:
				"Utilisation de Tailwind CSS pour créer des designs modernes et responsives sans quitter le HTML.",
			link: null
		},
		{
			id: 'javascript',
			name: 'JavaScript',
			periode: 'dev',
			categories: ['hard-skills', 'frontend'],
			'#': ['javascript', 'es6', 'frontend'],
			description:
				"Développement de fonctionnalités interactives côté client en ES6+ sans frameworks lourds.",
			link: null
		},
		{
			id: 'npm',
			name: 'npm',
			periode: 'dev',
			categories: ['hard-skills', 'backend'],
			'#': ['npm', 'packages', 'nodejs'],
			description:
				"Gestion des dépendances, scripts de build et publication de packages avec NPM.",
			link: null
		},
		{
			id: 'git-github',
			name: 'Git & GitHub',
			periode: 'dev',
			categories: ['hard-skills', 'projets'],
			'#': ['git', 'versioning', 'collaboration'],
			description:
				"Gestion de versions, revues de code et workflows collaboratifs sur GitHub.",
			link: "https://github.com/Palalde"
		},
		{
			id: 'responsive-design',
			name: 'Responsive design',
			periode: 'dev',
			categories: ['hard-skills', 'frontend'],
			'#': ['responsive', 'css', 'mobile-first'],
			description:
				"Conception d'interfaces adaptatives optimisées pour mobile, tablette et desktop.",
			link: null
		}
	];

	window.CV_COMPETENCES = competences;
})();
