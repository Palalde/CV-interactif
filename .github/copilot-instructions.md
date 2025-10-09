## Guide Copilot — CV Interactif (condensé et à jour)

Site statique, sans build côté site. Entrées: `index.html` (landing) et `html/cv.html` (CV). Chaque feature a son JS dédié; assets light/dark en miroir sous `img/`.

1. Structure, conventions, hosting

- HTML: `html/cv.html` (principal), `html/contact-info.html` (contact); `index.html` présente le produit (animated BG + CTA).
- CSS: monolithique `css/style.css`. Ajouter des tokens uniquement dans `:root`. Hauteur stable via `--app-vh` (MAJ JS) et fallback `@supports (height: 100svh)`.
- JS: tout dans `DOMContentLoaded` + null-checks. Fichiers clés: `js/main.js` (timeline + swipe + compétences dynamiques), `js/utility/theme-toggle.js` (thème + icônes), `js/utility/competences-mobile-toggle.js` (panneau mobile), `js/trade/trade.js` (chart v5), `js/leclerc/leclerc.js` (drag&drop), landing: `js/utility/animated-bg.js`, `js/index-landing.js`.
- Chemins ABSOLUS `/...` pour images/scripts. Si hébergé sous un sous-chemin, utiliser `<base href="/votre/sous/chemin/">` dans les pages ou refactorer en relatifs; penser à `updateNavIcons` et aux images du range slider. Le lien header `#header-home-link` va vers `/`.

2. Workflow dev (console dev Xterm uniquement)

- Le site se lit tel quel (pas de build). La console dev (slide Dev) est bundlée via esbuild.
- Commandes: `npm i` puis `npm run build:console` (ou `npm run watch:console`). Sortie attendue: `js/dev/dist/index.js` (+ `index.css`). Le loader `js/dev/console-loader.js` affiche un hint si le bundle manque et appelle `window.devConsoleInit`.
- Conseillé: servir via un petit serveur statique pour les chemins absolus (`Live Server` VS Code) ou ajouter `<base>`.

3. Thème & icônes (contrat runtime)

- Toggle: ajoute/retire `body.light` et appelle `updateNavIcons(isLight)`.
- Sélecteurs d’icônes gérés: `.cv-logo`, `.search-icon`, `.icon-loupe(.main|.second)`, `.icon-contact(.main|.second)`, `.icon-pdf(.main|.second)`, et sur contact `.contact-icon[alt="Âge|Localisation|LinkedIn|GitHub"]`.
- Toute NOUVELLE icône doit exister en 2 variantes et être branchée dans `updateNavIcons` (chemins `/img/nav-icon/(lightmode|darkmode)/...`).

4. Timeline (range → sections) et swipe

- Layout: `.content-slider` translate 4 `.content-section` (ordre: études → trading → leclerc → dev) intercalées avec 4 `.competences-section` (clonées en mobile).
- Range: `rangeSlider.min=0`, `rangeSlider.max = sectionCount * 37.5` (donc 150 pour 4). Snap logique tous les 50 (0/50/100/150), mais MAPPING visuel thumb/compétences à 37.5/75/112.5 (voir `updateThumb()` et `updateCompetencesDynamiquesBySlider()`).
- Repères: `addSnapMarkers()` place des marqueurs ~[0.5,33.33,66.66,99.5]% et les masque près du pouce; utiliser `hideSnapMarkers()`/`showSnapMarkers()` pendant les interactions.
- Swipe mobile: touchstart/move/end avec snap au relâchement; bloque le swipe si l’événement démarre dans `#trading-live-chart`.
- Couplages CSS: `content-slider` width 400%; `.content-section` 17.5% et `.competences-section` 7.5% → total 100% (4+4 colonnes). Ajuster ces valeurs si le nombre de périodes change.

5. Compétences dynamiques (mobile)

- `updateCompetencesDynamiquesBySlider()` clone uniquement `ul.liste-competences` de `#competences-*` actif vers `#competences-dynamiques`.
- `js/utility/competences-mobile-toggle.js`: panneau mobile avec drag vertical (ou clic sur le H3 externe). Les clics à l’intérieur de la liste ne togglent pas; gestion fine des gestures (scroll interne, velocity, zones actives).

6. Démo Trading (Lightweight Charts v5)

- CDN chargé dans `cv.html`. Container: `#trading-live-chart`. Resize robuste (window + ResizeObserver), watermark texte (`createTextWatermark`), markers via API v5 (`createSeriesMarkers`).
- Tooltip custom thème-dépendant via `MutationObserver`. Mobile: overlay hint (« appuyez ») puis hint swipe; API utilitaires: `window.setTradingPhaseTexts([...])`, `window.resetTradingPressHint()`.

7. Leclerc (drag & drop)

- `js/leclerc/leclerc.js`: HTML5 DnD (desktop) + pointer-drag (mobile). Dépose d’un fruit → maj `balance-experience`, rendu emoji sur la balance, ticket mis à jour (date) + animation `is-printing`.
- En mobile, les gestures de drag désactivent temporairement le swipe horizontal de `.content-slider` pour éviter les conflits.

8. Ajouter une période (passer à 5)

- Ajouter une `.content-section` (+ sa `.competences-section`). Mettre `rangeSlider.max = 200`, étendre les seuils logiques (0/50/100/150/200) et recalculer le MAPPING visuel (37.5→50). Mettre à jour `addSnapMarkers()`.
- CSS: `content-slider` à 500%; recalculer `flex-basis/width` des `.content-section` et `.competences-section` pour que la somme = 100%.

9. Divers/caveats

- Étoiles: des classes existent mais les images `img/competences/star-*.png` ne sont pas dans le repo → éviter tant que non ajoutées.
- Le header renvoie vers `/` (adapter si sous-chemin). La landing duplique le bloc brand en haut/gauche (`.fixed-brand-clone`).

Références: `js/main.js`, `js/utility/theme-toggle.js`, `js/utility/competences-mobile-toggle.js`, `js/trade/trade.js`, `js/leclerc/leclerc.js`, `css/style.css`, `html/cv.html`, `index.html`, `package.json` (scripts esbuild).
