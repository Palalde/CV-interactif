## Copilot Instructions (Concise Guide)

Static interactive CV. No build/bundler: open `html/cv.html` directly. Core = single CSS + feature JS + mirrored dark/light assets.

1. Structure

   - HTML: `html/cv.html`, `html/contact-info.html` (add scripts manually at bottom).
   - CSS: `css/style.css` monolith; add small, localized blocks only.
   - JS: `js/main.JS` (slider + competences + range thumb), `js/utility/*` (theme + mobile toggle), `js/trade/trade.js` (Lightweight Charts demo).
   - Assets: `img/<feature>/<lightmode|darkmode>/file.png` (names encode feature + color, e.g. `trading-bleu.png`).

2. Theming

   - Toggle sets `body.light`. JS (`updateNavIcons`) swaps `src` for each icon—add both variants then extend that function.
   - Use CSS vars (`--background-*`, `--text-*`). Add new tokens only in `:root`.

3. Range Slider Navigation

   - `<input id="myRange">` → translates `.content-slider` via logic in `main.JS`.
   - Current thresholds: <37.5 (etudes), 37.5–75 (trading), 75–112.5 (leclerc), >=112.5 (dev).
   - Add section: new `.content-section`, recompute even thresholds + `rangeSlider.max`, update: a) threshold if/else, b) thumb image mapping, c) `updateCompetencesDynamiquesBySlider()` mapping.

4. Dynamic Competences (Mobile)

   - `updateCompetencesDynamiquesBySlider()` clones active `#competences-*` HTML into `#competences-dynamiques`.
   - Keep structure: `.competences-section > ul.liste-competences`.

5. Trading Chart

   - `js/trade/trade.js` loads Lightweight Charts via CDN; creates candlestick in `#trading-live-chart` (fills entire `#trading` section via flex CSS).
   - Theme adaptation: MutationObserver on `body.class`; reuse `getColors()` for additions.

6. Conventions

   - Keep legacy filename `main.JS`. New files lowercase-hyphen.
   - Wrap logic in `DOMContentLoaded`; null-check elements (shared scripts across pages).
   - Limit console logging to a single concise init message per feature.

7. Safe Edit Checklist

   - Script tag appended at bottom of HTML after utilities.
   - New themed asset: add both variants + JS swap entry.
   - Slider change: thresholds + `rangeSlider.max` + competences mapping + thumb icons updated together.
   - Chart change: reuse existing container or add new unique ID and theme observer.

8. Extending Timeline Example

   - For 5 periods over 0..150: step = 150 / 5 = 30; thresholds become <30, <60, <90, <120, else. Update all dependent ifs + icon ranges + competences mapping.

9. Constraints

   - Stay framework-free; only CDN scripts. Avoid heavy libs beyond small single-file inclusions.

10. References
    - Theme: `js/utility/theme-toggle.js`
    - Slider & competences: `js/main.JS`
    - Mobile toggle: `js/utility/competences-mobile-toggle.js`
    - Chart demo: `js/trade/trade.js`

Update this guide if thresholds become config‑driven or a generic theme asset helper is introduced.
