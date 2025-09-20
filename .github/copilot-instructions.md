## Guide Copilot — CV Interactif (condensé)

Site statique, sans build. Entrée réelle: `index.html` redirige vers `html/cv.html`. Ouvrir `html/cv.html` en local. Chaque feature a son JS dédié et des assets light/dark en miroir.

1. Structure et conventions

- HTML: `html/cv.html` (principal), `html/contact-info.html` (contact). `index.html` gère la redirection JS/meta.
- CSS: `css/style.css` monolithique; n’ajouter des tokens que dans `:root`. Hauteur stable via `--app-vh` (mise à jour JS) et `@supports (height: 100svh)`.
- JS: `js/main.js` (slider/timeline, thumb dynamique, swipe, compétences dynamiques), `js/utility/theme-toggle.js` (thème + swap d’icônes), `js/utility/competences-mobile-toggle.js` (panneau mobile), `js/trade/trade.js` (démo chart v5). Garder tout dans `DOMContentLoaded` + null-checks.
- Assets: chemins ABSOLUS `/img/...`. Si hébergement sous sous-chemin, prévoir `<base href="/sous/chemin/">` ou refactor en relatifs; penser à `updateNavIcons` et aux images du rangeslider.

2. Thème & icônes (contrat)

- Le toggle applique `body.light` et appelle `updateNavIcons(isLight)`; classes attendues: `.cv-logo`, `.search-icon`, `.icon-loupe(.main|.second)`, `.icon-contact(.main|.second)`, `.icon-pdf(.main|.second)`, et sur contact `.contact-icon[alt="Âge|Localisation|LinkedIn|GitHub"]`.
- TOUTE nouvelle icône doit exister en 2 variantes (light/dark) et être ajoutée dans `updateNavIcons`.

3. Timeline (range → sections)

- UI: `<input id="myRange" class="range-slider">` + `.content-slider` qui translate horizontalement 4 `.content-section` (ordre: études, trading, leclerc, dev). Les `.competences-section` sont intercalées et clonées en mobile.
- Snaps logiques: 0/50/100/150. Attention: mapping visuel à 37.5/75/112.5 pour le thumb et les compétences (voir `updateThumb()` et `updateCompetencesDynamiquesBySlider()` dans `js/main.js`).
- `addSnapMarkers()` ajoute des repères et les masque près du thumb; penser à les recalc/montrer/cacher avec les handlers fournis.
- Swipe mobile: touchstart/move/end avec snap au relâchement; la position anime `transform` sur `.content-slider`. La chart trading bloque le swipe quand ciblée.

4. Compétences dynamiques (mobile)

- `updateCompetencesDynamiquesBySlider()` clone le contenu de la section `#competences-*` active vers `#competences-dynamiques` (structure requise: `.competences-section > h3 + ul.liste-competences`).
- Le bouton `#competences-mobile-btn` (voir `js/utility/competences-mobile-toggle.js`) toggle l’affichage; clics internes sur le H3 ferment le panneau.

5. Démo Trading (Lightweight Charts v5)

- CDN inclus dans `cv.html`. Container: `#trading-live-chart`. Gestion complète: resize responsive (ResizeObserver), watermark texte, markers via API v5 (`createSeriesMarkers`), tooltip custom synchronisé au thème via `MutationObserver`.
- API utilitaire: `window.setTradingPhaseTexts([...])` pour remplacer dynamiquement les phases (titres + descriptions) selon un intervalle `YYYY-MM`.
- Mobile: hint overlay « appuyez longuement » recréé à l’activation de la slide (via `window.resetTradingPressHint`). Un bandeau swipe (`.trading-swipe-strip`) s’ajoute sous la chart sur devices tactiles.

6. Points d’attention

- Couplage fort du nombre de sections avec: `rangeSlider.max`, les seuils 37.5/75/112.5, `addSnapMarkers()` et les largeurs CSS (`.content-slider` width 400%, `.content-section` 17.5% etc.). Harmoniser à pas 50 et recalculer les pourcentages.
- `.content-section` = panneaux translatés; `.competences-section` = colonnes dédiées (cachées en desktop <715px, clonées en mobile).
- Header: `#header-home-link` redirige vers `/`. Adapter pour un hébergement non-root.
- Étoiles: des classes CSS existent mais les assets `img/competences/...` ne sont pas fournis → éviter tant que les images ne sont pas ajoutées.

7. Ajouter une nouvelle période (exemple passer à 5)

- Ajouter une `.content-section` (et sa `.competences-section` sœur si besoin).
- Mettre `rangeSlider.max = 200`, étendre les mappings à 4 seuils (0/50/100/150/200) y compris 37.5→50 logic, mettre à jour `addSnapMarkers()`.
- Ajuster CSS: `.content-slider` width à 500%; recalculer `flex-basis/width` des `.content-section` et `.competences-section` pour conserver le layout.

Références clés: `js/main.js`, `js/utility/theme-toggle.js`, `js/utility/competences-mobile-toggle.js`, `js/trade/trade.js`, `css/style.css`, `html/cv.html`, `index.html`.
