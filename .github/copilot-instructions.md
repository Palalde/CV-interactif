## Guide Copilot (version concise)

CV interactif statique. Pas de build/bundler : ouvrir `html/cv.html` directement. Core = un seul CSS + JS par feature + assets miroirs light/dark.

1. Structure

   - HTML : `html/cv.html`, `html/contact-info.html` (ajouter les scripts manuellement en bas de page).
   - CSS : `css/style.css` monolithique ; n’ajouter que de petits blocs localisés.
   - JS : `js/main.JS` (slider + compétences + range thumb), `js/utility/*` (theme + mobile toggle), `js/trade/trade.js` (demo Lightweight Charts).
   - Assets : `img/<feature>/<lightmode|darkmode>/file.png` (nommage = feature + couleur, ex. `trading-bleu.png`).

2. Thème (Theming)

   - Le toggle pose `body.light`. Le JS (`updateNavIcons`) swap le `src` de chaque icône — ajouter les 2 variantes puis étendre cette fonction.
   - Utiliser des variables CSS (`--background-*`, `--text-*`). Ajouter de nouveaux tokens uniquement dans `:root`.

3. Navigation via range slider

   - `<input id="myRange">` → translate `.content-slider` via la logique dans `main.JS`.
   - Seuils actuels : <37.5 (etudes), 37.5–75 (trading), 75–112.5 (leclerc), >=112.5 (dev).
   - Ajouter une section : nouvelle `.content-section`, recalcul des seuils équidistants + `rangeSlider.max`, puis update : a) if/else des seuils, b) mapping de l’image du thumb, c) mapping dans `updateCompetencesDynamiquesBySlider()`.

4. Compétences dynamiques (mobile)

   - `updateCompetencesDynamiquesBySlider()` clone le HTML actif `#competences-*` dans `#competences-dynamiques`.
   - Conserver la structure : `.competences-section > ul.liste-competences`.

5. Graphique Trading

   - `js/trade/trade.js` charge Lightweight Charts via CDN ; crée un candlestick dans `#trading-live-chart` (remplit toute la section `#trading` grâce au CSS flex).
   - Adaptation au thème : MutationObserver sur `body.class` ; réutiliser `getColors()` pour toute addition.

6. Conventions

   - Conserver le nom legacy `main.JS`. Nouveaux fichiers en lowercase-hyphen.
   - Envelopper la logique dans `DOMContentLoaded` ; null-check des éléments (scripts mutualisés entre pages).
   - Limiter le console logging à un court message d’init par feature.

7. Checklist d’édition safe

   - Script tag ajouté en bas du HTML après les utilitaires.
   - Nouvel asset “themed” : ajouter les deux variantes + entrée de swap JS.
   - Changement du slider : seuils + `rangeSlider.max` + mapping compétences + thumb icons mis à jour ensemble.
   - Changement du chart : réutiliser le container existant ou ajouter un nouvel ID unique et un theme observer.

8. Exemple : extension de la timeline

   - Pour 5 périodes sur 0..150 : step = 150 / 5 = 30 ; seuils = <30, <60, <90, <120, else. Mettre à jour tous les if dépendants + ranges d’icônes + mapping des compétences.

9. Contraintes

   - Rester framework‑free ; uniquement des scripts CDN. Éviter les libs lourdes au‑delà de petites inclusions single‑file.

10. Références
    - Theme : `js/utility/theme-toggle.js`
    - Slider & compétences : `js/main.JS`
    - Mobile toggle : `js/utility/competences-mobile-toggle.js`
    - Chart demo : `js/trade/trade.js`

Mettre à jour ce guide si les seuils deviennent config‑driven ou si un helper générique d’assets “thème” est introduit.

11. Travailler avec plusieurs fils (chats)

- En fin d’étape, écrire un bref résumé dans `docs/decisions-log.md` (what/why/changes/next steps).
- Reprendre les items actionnables dans `todo/todo.md` pour les conserver hors historique de chat.
- À l’ouverture d’un nouveau fil, partager la dernière entrée du journal pour restaurer le contexte rapidement.

- Auto‑débrief : si l’utilisateur dit « fermer la discussion », générer une entrée prête à coller dans `docs/decisions-log.md` (modèle FR) et proposer de recopier les prochaines étapes dans `todo/todo.md`. L’utilisateur collera ensuite l’ID du commit à la place de `[COMMIT_ID]`.
