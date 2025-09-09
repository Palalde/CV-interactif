## Guide Copilot — CV Interactif (condensé)

Site statique sans build. Entrée: `html/cv.html` (ouvrir directement en local). Chaque feature a son JS dédié et des assets light/dark en miroir.

1. Structure rapide

- HTML: `html/cv.html` (principal), `html/contact-info.html` (contact).
- CSS: `css/style.css` monolithique; n’ajouter des tokens que dans `:root`.
- JS: `js/main.js` (timeline, thumb, swipe, compétences dynamiques), `js/utility/theme-toggle.js` (thème + icônes), `js/utility/competences-mobile-toggle.js` (panneau mobile), `js/trade/trade.js` (démo chart complète).
- Assets: `img/<feature>/<lightmode|darkmode>/*.png` (nav: `img/nav-icon/...`, études: `img/main-content/...`, slider: `img/rangeslider/...`).

2. Thème (Dark/Light)

- Toggle: applique `body.light` et appelle `updateNavIcons(isLight)`.
- Icônes attendues: `.cv-logo`, `.search-icon`, `.icon-loupe.main|.second`, `.icon-contact.main|.second`, `.icon-pdf.main|.second`, et sur contact `.contact-icon` (alt="Âge"|"Localisation"|"LinkedIn"|"GitHub").
- Toute nouvelle icône doit exister en 2 variantes et être ajoutée dans `updateNavIcons`.

3. Timeline (slider → sections)

- UI: `<input id="myRange" class="range-slider">` + `.content-slider` qui translate entre 4 `.content-section` (ordre: études, trading, leclerc, dev). Les blocs `.competences-section` sont intercalés et clonés en mobile.
- Snaps: 0/50/100/150. Mismatch connu: mapping des seuils à 37.5/75/112.5 pour le thumb et les compétences (voir `updateThumb()` et `updateCompetencesDynamiquesBySlider()` dans `main.js`). Si vous changez le nombre de sections, harmonisez tout à pas 50 et mettez à jour: `rangeSlider.max`, les if/else des mappings, et `addSnapMarkers()`.
- Swipe mobile: gestion touch avec snap au relâchement; la position précise anime `transform` sur `.content-slider`.

4. Compétences dynamiques (mobile)

- `updateCompetencesDynamiquesBySlider()` clone le contenu du `#competences-*` actif dans `#competences-dynamiques` (structure requise: `.competences-section > h3 + ul.liste-competences`).
- Le bouton `#competences-mobile-btn` (voir `js/utility/competences-mobile-toggle.js`) toggle l’affichage.

5. Démo Trading (Lightweight Charts v5)

- CDN inclus dans `cv.html`. Container: `#trading-live-chart`. La démo est implémentée: resize responsive, tooltips custom, markers, et synchronisation de thème via MutationObserver.
- API utilitaire: `window.setTradingPhaseTexts([...])` permet de remplacer dynamiquement les phases (titres + descriptions) du tooltip.

6. Conventions projet

- Tout JS dans `DOMContentLoaded`, avec null-checks (scripts mutualisés entre pages).
- Chemins d’images absolus `/img/...`. Si hébergement sous sous-chemin, prévoir `<base href>` ou passer en chemins relatifs.
- Ordre des scripts en bas de page: `main.js` → `theme-toggle.js` → `competences-mobile-toggle.js` → `trade.js`.

7. Pièges et points d’attention

- Slider: désalignement 37.5 vs 50. Si vous ajoutez/retirez une section, mettez à jour les 3 endroits: max du slider, mapping thumb/compétences, repères visuels.
- `.content-section` seulement pour la translation; ne confondez pas avec `.competences-section` (cachées en desktop, clonées en mobile).
- Icônes: toujours fournir light/dark et référencer les classes attendues pour que `updateNavIcons` fasse le swap.
- Header: `#header-home-link` redirige vers `/`. Sur hébergement non-root, adaptez.
- Des classes d’étoiles (`.star`) existent en CSS mais les assets `img/competences/...` ne sont pas présents → ne pas utiliser sans fournir les images.

8. Ajouter une nouvelle période

- Ajouter une `.content-section` + (optionnel) sa `.competences-section` sœur.
- Passer à 5 segments: snaps 0..200 (pas 50); mettre à jour `rangeSlider.max = 200`, les seuils des mappings dans `main.js`, et `addSnapMarkers()`.

Références clés: `js/main.js`, `js/utility/theme-toggle.js`, `js/utility/competences-mobile-toggle.js`, `js/trade/trade.js`, `css/style.css`, `html/cv.html`.
