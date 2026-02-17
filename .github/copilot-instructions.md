## Guide Copilot — CV Interactif

### 🎓 Règles d'assistance pour les exercices JavaScript

**IMPORTANT** : L'utilisateur suit un parcours d'apprentissage progressif via `tuto-js/EXERCICES-PRATIQUES.md`.

**Règles strictes d'assistance :**

- ❌ **NE JAMAIS donner de solution directe** aux exercices (1 à 10)
- ✅ Fournir uniquement des **indices**, **pistes de réflexion** et **concepts théoriques**
- ✅ Guider vers la bonne approche sans écrire le code complet
- ✅ Valider le code écrit par l'utilisateur et proposer des améliorations
- ✅ Pointer vers les indices déjà présents dans `EXERCICES-PRATIQUES.md`
- ✅ **Adopter une approche socratique** : poser des questions pour guider la réflexion plutôt que donner des réponses
- ✅ **Rendre l'apprentissage ludique** : utiliser des métaphores, des exemples concrets et un ton encourageant

**Format accepté pour demande d'aide :**

> "J'ai besoin d'un coup de pouce sur [partie précise de l'exercice X]"

**Objectif pédagogique :** Permettre à l'utilisateur d'écrire du JavaScript (pas juste le lire), progresser de 2,5/5 à 4/5 en compétence JS grâce à une découverte active et engageante.

---

### 🏗️ Architecture technique

- Site statique livré tel quel : `index.html` (landing) et `html/cv.html` (timeline principale) tirent tout depuis `/css/style.css` et la hiérarchie `js/`. Garder les scripts encapsulés dans `DOMContentLoaded` avec null-checks.
- Les liens d’assets/scripts sont ABSOLUS (`/img/...`, `/js/...`). Pour un sous-répertoire, ajouter `<base href="/mon/sous/chemin/">` et ajuster `updateNavIcons`, les images du range slider et le lien `id="header-home-link"` qui cible `/`.
- `css/style.css` est monolithique ; n’introduire des tokens qu’au sein de `:root`. La hauteur viewport stable repose sur `--app-vh` alimenté par JS (fallback via `@supports (height: 100svh)`).
- La timeline combine `.content-slider` (width 400 %) avec 4 `.content-section` (17.5 %) et 4 `.competences-section` (7.5 %). Le slider `id="myRange"` snappe tous les 50 points mais la logique métier se base sur les seuils 37.5/75/112.5. Mettre à jour `getPeriodeFromSliderValue`, `addSnapMarkers` et les ratios CSS si vous changez le nombre de périodes.
- `rangeSlider.max` est recalculé via `sectionCount` dans `js/main.js`; si vous ajoutez une période, étendez la valeur max, les positions de snap (37.5/75/112.5 → nouveaux seuils) et élargissez `.content-slider` dans le CSS.
- `js/search/competences.js` peuple `window.CV_COMPETENCES`. `js/main.js` en dérive `competencesByPeriode`, hydrate les listes statiques, clone les contenus dans le conteneur `competences-dynamiques` et relie chaque item à `window.openSearchOverlayWithQuery`.
- `js/main.js` pilote le slider (snap, swipe mobile, reset trading hint) et applique des thumbs thème-dépendants (`/img/rangeslider/(lightmode|darkmode)/...`). Préserver les hooks `hideSnapMarkers` / `showSnapMarkers` lors de nouvelles interactions.
- Lorsque le slide Trading devient actif, `js/main.js` déclenche `window.resetTradingPressHint()` ; conserver cet évènement si vous changez l’ordre ou la structure des sections.
- Le panneau mobile (`js/utility/competences-mobile-toggle.js`) gère drag vertical avec seuils de vitesse, désactive temporairement le scroll/snap et attend les IDs `competences-mobile-btn`, `competences-dynamiques`. Toute mutation doit respecter ces points d’ancrage.
- `js/utility/theme-toggle.js` alterne `body.light` et appelle `updateNavIcons(isLight)`. Ajouter de nouvelles icônes implique deux variantes placées dans `/img/nav-icon/(lightmode|darkmode)/...` et, côté contact, `/img/contact/...`.
- Le moteur de recherche (`js/search/search-overlay.js`) déplace la barre de recherche d’en-tête dans l’overlay sur desktop, expose `window.openSearchOverlayWithQuery`, gère les filtres via `activeFilters` et conserve l’accessibilité (`aria-hidden`, focus trap, messages placeholder). Utiliser cette API pour lancer l’overlay depuis d’autres modules.
- L’overlay de téléchargement du CV classique (id `cv-download-overlay`) est piloté par `js/main.js`: focus trap, retour du focus sur le déclencheur et bouton primaire via `data-download-primary`. Si vous modifiez `.classic-cv-block`, gardez ces hooks et la classe de body `download-overlay-open`.
- Les compétences dynamiques côté desktop restent interactives quand le media query `min-width: 715px` est actif ; `populateStaticCompetenceSections` se ré-exécute sur changement de breakpoint.
- Trading (`js/trade/trade.js`) dépend du CDN Lightweight Charts v5. Il configure ResizeObserver + MutationObserver pour rester responsive et thème-aware, expose `window.resetTradingPressHint` & `window.setTradingPhaseTexts`, et utilise `LightweightCharts.createSeriesMarkers` (API v5 pure).
- Le module Leclerc (`js/leclerc/leclerc.js`) combine HTML5 drag & drop et pointer events. En mobile, `beginGlobalDragGuards` bloque le swipe horizontal de `.content-slider` pendant le drag. Réutiliser ces helpers si vous ajoutez d’autres gestes tactiles.
- Landing (`js/index-landing.js`) réutilise le setup `--app-vh`, installe un dots-nav par IntersectionObserver et clone le branding fixe. L’animation de fond (`js/utility/animated-bg.js`) s’active uniquement via `body.landing`, force son exécution même si `prefers-reduced-motion`, et recalcule sur resize (réintroduisez une détection si vous devez calmer les animations).
- Dev console : source `js/dev/console-src/index.js` bundlée par esbuild. Exécuter `npm install`, puis `npm run build:console` (ou `npm run watch:console`) pour générer `js/dev/dist/index.js` + `index.css`. Le loader `js/dev/console-loader.js` vérifie la présence du bundle et appelle `window.devConsoleInit`.
- Pour déclencher la recherche depuis un nouveau CTA, appelez `window.openSearchOverlayWithQuery(term, { trigger })` plutôt que de reimplémenter l’overlay.
- Servir localement via un serveur statique (ex : Live Server) pour éviter les 404 dus aux chemins absolus.
