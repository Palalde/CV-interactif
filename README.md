# CV Interactif

[![Live](https://img.shields.io/badge/🌐_Voir_le_site-Live-blue?style=flat)](https://cv-interactif-paul.vercel.app/)

Site vitrine interactif présentant mon parcours, mes compétences et mes projets — conçu entièrement **sans framework**, en JavaScript vanilla.

> **[▶ cv-interactif-paul.vercel.app](https://cv-interactif-paul.vercel.app/)**

---

## Fonctionnalités

| Feature                 | Description                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------- |
| **Timeline slider**     | Navigation chronologique par périodes avec snap, swipe mobile et compétences dynamiques |
| **Graphique trading**   | Chart interactif temps réel (Lightweight Charts v5) avec crosshair et marqueurs         |
| **Moteur de recherche** | Recherche full-text avec autocomplétion, filtres, historique et overlay accessible      |
| **Drag & drop**         | Module Leclerc avec HTML5 drag & drop + pointer events (desktop & mobile)               |
| **Terminal embarqué**   | Console dev intégrée via xterm.js, bundlée avec esbuild                                 |
| **Dashboard stats**     | Analyse des compétences + langages GitHub via Web Worker                                |
| **Système de favoris**  | Sauvegarde, export/import JSON, page dédiée                                             |
| **Thème clair/sombre**  | Bascule complète avec icônes adaptatives et persistance                                 |
| **Générateur de thème** | Palette de couleurs personnalisable avec historique                                     |
| **Accessibilité**       | Focus trap, ARIA, navigation clavier, responsive mobile                                 |

---

## Stack

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![esbuild](https://img.shields.io/badge/esbuild-FFCF00?style=flat&logo=esbuild&logoColor=black)
![xterm.js](https://img.shields.io/badge/xterm.js-000000?style=flat)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

---

## Structure

```
js/
├── main.js                  # Slider, navigation, compétences dynamiques
├── index-landing.js         # Page d'accueil
├── analytics/               # Dashboard stats + Web Worker
├── color-theme/             # Générateur de thème + historique
├── dev/                     # Terminal embarqué (xterm.js)
├── favorites/               # Système de favoris
├── leclerc/                 # Drag & drop interactif
├── search/                  # Moteur de recherche + autocomplétion
├── toast/                   # Notifications toast
├── trade/                   # Graphique trading (Lightweight Charts)
└── utility/                 # Thème, horloge, animations, helpers
```

---

## Lancer en local

```bash
npm install
npm run build        # Bundle le terminal dev
```

Servir avec un serveur statique (ex : Live Server) — les chemins d'assets sont absolus (`/js/...`, `/css/...`).

---

## Auteur

**Paul Alessandrini** — Développeur web en reconversion

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/paul-a-268a55339/)
