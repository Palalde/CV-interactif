## Guide Copilot — CV Interactif (à jour)

Site statique, sans build. Point d’entrée: `index.html` redirige vers `html/cv.html`. Ouvrir `html/cv.html` directement en local. Chaque feature a son JS dédié et des assets light/dark en miroir.

1. Structure des fichiers

- HTML: `html/cv.html` (page principale), `html/contact-info.html` (contact). Scripts inclus manuellement en bas de page.
- CSS: `css/style.css` monolithique. Ajouter de petits blocs localisés et de nouveaux tokens seulement dans `:root`.
- JS: `js/main.js` (range slider, compétences dynamiques, thumb du range, swipe), `js/utility/theme-toggle.js` (thème + swap d’icônes), `js/utility/competences-mobile-toggle.js` (toggle mobile), `js/trade/trade.js` (loader Lightweight Charts — démo à compléter).
- Assets: `img/<feature>/<lightmode|darkmode>/<file>.png` (ex: `img/rangeslider/darkmode/trading-bleu.png`). Icônes nav dans `img/nav-icon/...` et visuels sections dans `img/main-content/...`.

2. Thème (Dark/Light)

- Le toggle pose `body.light` et appelle `updateNavIcons(isLight)` pour swapper le `src` des icônes.
- Classes d’icônes attendues: `.cv-logo`, `.search-icon`, `.icon-loupe.main|.second`, `.icon-contact.main|.second`, `.icon-pdf.main|.second`, et sur la page contact `.contact-icon` (avec alt="Âge"|"Localisation"|"LinkedIn"|"GitHub").
- Ajouter toute nouvelle icône en 2 variantes light/dark et étendre `updateNavIcons` en conséquence.
- Palette via variables CSS `--background-*`, `--text-*` (déclarer uniquement dans `:root`).

3. Slider de navigation (timeline)

- Élément: `<input id="myRange" class="range-slider">` + conteneur `.content-slider` qui translate horizontalement entre les `.content-section` (4 sections actuelles: études, trading, leclerc, dev).
- Valeurs actuelles: 0..150 avec snap sur 0, 50, 100, 150 pour les 4 sections. La position fine entre les snaps anime la translation (voir `updateContent()` dans `main.js`).
- Mapping compétences/thumb (actuel): basé sur des seuils à 37.5/75/112.5. NOTE: ceci est en décalage avec le snap à 50. À harmoniser si vous modifiez le slider (reco: utiliser des pas de 50 partout et ajuster les if/else correspondants).
- Ajout d’une section: ajouter une nouvelle `.content-section` dans `.content-slider`. Mettre à jour: a) calcul de `rangeSlider.max` pour correspondre au nombre de sections et aux snaps (ex: 4 sections ⇒ 0..150 avec pas 50), b) les seuils utilisés par `updateCompetencesDynamiquesBySlider()` et par le mapping d’icône du thumb dans `updateThumb()`, c) les repères visuels dans `addSnapMarkers()` si besoin.

4. Compétences dynamiques (mobile)

- `updateCompetencesDynamiquesBySlider()` clone le bloc actif `#competences-*` vers `#competences-dynamiques` en fonction de la valeur du slider.
- Structure à conserver: sections soeurs `.competences-section` contenant `ul.liste-competences` et un `h3.competence-titre`.
- Le bouton `#competences-mobile-btn` toggle l’affichage (voir `js/utility/competences-mobile-toggle.js`).

5. Démo Trading

- `js/trade/trade.js` charge Lightweight Charts via CDN. Actuellement, c’est un loader: la fonction d’init (ex: `initTradingDemoChart`) n’est pas encore implémentée. Container cible: `#trading-live-chart`.
- Pour compléter la démo: créer `initTradingDemoChart()` qui instancie un graphique responsive dans `#trading-live-chart` et observer le thème (MutationObserver sur `body.classList`). Réutiliser les couleurs depuis les variables CSS.

6. Conventions & pratiques

- Nommage fichiers: kebab-case en minuscules (existant: `main.js`).
- Toujours encapsuler la logique dans `DOMContentLoaded` et null-checker les éléments (les scripts sont mutualisés entre pages).
- Utiliser des chemins absolus `/img/...` dans le HTML actuel. Si hébergé sous un sous-chemin, prévoir un `<base href>` ou passer en chemins relatifs.
- Logging minimal: un message bref d’init par feature au besoin.

7. Checklist d’édition sûre

- Ajouter les `<script>` en bas de page, après les utilitaires, dans l’ordre: `main.js` → `theme-toggle.js` → `competences-mobile-toggle.js` → `trade.js` (optionnel sur contact).
- Nouvel asset thémé: fournir les deux variantes + étendre `updateNavIcons`.
- Changer la timeline: maintenir la cohérence entre snaps, `rangeSlider.max`, mapping compétences et mapping d’icône du thumb.
- Démo chart: réutiliser `#trading-live-chart` ou un nouvel ID unique et ajouter un observer de thème.

8. Exemple d’extension de timeline

- Pour 5 périodes uniformes: choisir un pas unique (reco: 50) ⇒ valeurs 0, 50, 100, 150, 200. Mettre à jour: `rangeSlider.max = 200`, les if de compétences et du thumb pour 5 segments, et les marqueurs visuels.

9. Contraintes

- Sans framework; uniquement des scripts via CDN si nécessaire. Éviter les grosses dépendances (single-file préférable).

10. Références code

- Thème: `js/utility/theme-toggle.js`
- Slider & compétences: `js/main.js`
- Mobile toggle: `js/utility/competences-mobile-toggle.js`
- Démo chart (loader): `js/trade/trade.js`
