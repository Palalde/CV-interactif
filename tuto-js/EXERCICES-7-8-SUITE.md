# 🎮 Exercices 7-8 (Suite) - Version Moderne avec Concepts Avancés

> **📚 Rappel :** Vous devriez avoir terminé l'**INTERLUDE 4** (Event Loop) avant de commencer ces exercices.
>
> Si ce n'est pas fait, retournez à la fin du fichier `EXERCICES-1-6-DEBUT.md` !

---

## 🎯 Exercice 7 : Toast Notifications avec Event Delegation & Queue Management ⭐⭐⭐

### 📝 Mission

Créez un **système de notifications toast professionnel** avec **event delegation** avancé, **queue management** (max 3 toasts visibles), et **animations fluides**.

### 🎨 Où travailler

- **Fichiers à créer** :
  - `js/utility/ToastManager.js` (classe en module)
  - `js/utility/toast-ui.js` (interface)

### 💡 Ce que vous devez faire

1. **Créer une classe `ToastManager`** avec :
   - `show(message, type, duration)` : Afficher un toast
   - `dismiss(toastId)` : Fermer un toast spécifique
   - `dismissAll()` : Fermer tous les toasts
   - Queue automatique (max 3 visibles)
   - Event delegation pour les clics (un seul listener)
2. **Types** : `info`, `success`, `warning`, `error`
3. **Animations** : Entrée/sortie fluides avec requestAnimationFrame
4. **Exposer globalement** : `window.toast()` pour utilisation facile

### 🔍 Indices disponibles

<details>
<summary>💡 Indice 1 : Classe ToastManager avec queue</summary>

```javascript
// ToastManager.js
export class ToastManager {
  constructor(maxVisible = 3) {
    this.maxVisible = maxVisible;
    this.toasts = []; // Liste de tous les toasts
    this.queue = []; // Queue pour les toasts en attente
    this.container = null;
    this.toastIdCounter = 0;

    this.init();
  }

  init() {
    // Créer le conteneur s'il n'existe pas
    this.container = document.getElementById("toast-container");
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "toast-container";
      this.container.className = "toast-container";
      document.body.appendChild(this.container);

      // Event delegation : UN SEUL listener pour tous les toasts
      this.container.addEventListener("click", (e) => {
        const toast = e.target.closest(".toast");
        if (toast) {
          this.dismiss(toast.dataset.toastId);
        }
      });
    }
  }

  show(message, type = "info", duration = 3000) {
    const id = `toast-${this.toastIdCounter++}`;
    const toastData = { id, message, type, duration };

    // Si on a atteint la limite, mettre en queue
    if (this.toasts.length >= this.maxVisible) {
      this.queue.push(toastData);
      return id;
    }

    this.displayToast(toastData);
    return id;
  }

  displayToast({ id, message, type, duration }) {
    const toast = this.createToastElement(id, message, type);
    this.toasts.push({ id, element: toast });

    // Animation d'entrée avec requestAnimationFrame
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    this.container.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.style.transition = "all 0.3s ease";
        toast.style.opacity = "1";
        toast.style.transform = "translateX(0)";
      });
    });

    // Auto-dismiss après duration
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  createToastElement(id, message, type) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.dataset.toastId = id;
    toast.setAttribute("role", "alert");

    const icon = this.getIcon(type);
    const content = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" aria-label="Fermer">✕</button>
    `;
    toast.innerHTML = content;

    return toast;
  }

  getIcon(type) {
    const icons = {
      info: "ℹ️",
      success: "✓",
      warning: "⚠️",
      error: "✕",
    };
    return icons[type] || icons.info;
  }

  dismiss(id) {
    const index = this.toasts.findIndex((t) => t.id === id);
    if (index === -1) return;

    const { element } = this.toasts[index];

    // Animation de sortie
    element.style.opacity = "0";
    element.style.transform = "translateX(100%)";

    setTimeout(() => {
      element.remove();
      this.toasts.splice(index, 1);

      // Afficher le prochain toast de la queue
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        this.displayToast(next);
      }
    }, 300);
  }

  dismissAll() {
    this.toasts.forEach((t) => this.dismiss(t.id));
    this.queue = [];
  }
}
```

</details>

<details>
<summary>💡 Indice 2 : Exposer window.toast() pour utilisation facile</summary>

```javascript
// toast-ui.js
import { ToastManager } from "./ToastManager.js";

const manager = new ToastManager();

// Exposer globalement pour utilisation facile
window.toast = (message, type = "info", duration = 3000) => {
  return manager.show(message, type, duration);
};

// Raccourcis
window.toast.success = (message, duration) =>
  manager.show(message, "success", duration);
window.toast.error = (message, duration) =>
  manager.show(message, "error", duration);
window.toast.warning = (message, duration) =>
  manager.show(message, "warning", duration);
window.toast.info = (message, duration) =>
  manager.show(message, "info", duration);

// Utilitaires
window.toast.dismissAll = () => manager.dismissAll();
```

Utilisation :

```javascript
// Depuis n'importe où dans votre code
window.toast.success("Email copié !");
window.toast.error("Erreur de connexion");
window.toast("Opération en cours...", "info", 5000);
```

</details>

<details>
<summary>💡 Indice 3 : CSS pour les toasts</summary>

```css
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast {
  min-width: 280px;
  max-width: 400px;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  pointer-events: all;
  transition: all 0.3s ease;
}

.toast:hover {
  transform: translateX(-5px);
}

.toast-info {
  background: #2196f3;
  color: white;
}

.toast-success {
  background: #4caf50;
  color: white;
}

.toast-warning {
  background: #ff9800;
  color: white;
}

.toast-error {
  background: #f44336;
  color: white;
}

.toast-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  font-size: 0.9rem;
}

.toast-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.toast-close:hover {
  opacity: 1;
}
```

</details>

<details>
<summary>💡 Indice 4 : Intégrer les toasts avec vos exercices précédents</summary>

**Exemple avec l'exercice 3 (copie email) :**

```javascript
// Dans copy-email.js
navigator.clipboard
  .writeText(emailAddress)
  .then(() => {
    // Remplacer le tooltip par un toast
    window.toast.success("✓ Email copié !");
  })
  .catch(() => {
    window.toast.error("❌ Impossible de copier");
  });
```

**Exemple avec l'exercice 5 (favoris) :**

```javascript
manager.toggle(competenceId);
const isFavorite = manager.has(competenceId);

if (isFavorite) {
  window.toast.success("Ajouté aux favoris");
} else {
  window.toast.info("Retiré des favoris");
}
```

</details>

### ✅ Test de validation

- [✅] La classe `ToastManager` gère la queue correctement
- [✅] Maximum 3 toasts visibles simultanément
- [✅] Event delegation fonctionne (un seul listener)
- [✅] Les 4 types ont des styles différents
- [✅] Animations d'entrée/sortie fluides
- [✅] `window.toast()` accessible globalement
- [✅] Le clic ferme le toast immédiatement

### 🎁 Bonus

- ✅ **Barre de progression** : Visualiser le temps restant avant auto-dismiss
- ✅ **Actions** : Ajoutez des boutons d'action dans les toasts
- ✅ **Positions** : Permettez top-right, top-left, bottom-left, etc.
- ✅ **Pause on hover** : Suspendre l'auto-dismiss au survol
- ✅ **Sound effects** : Jouer un son selon le type (subtil)

### 🎓 Concepts appris

- ✅ **Queue management** : Gérer une file d'attente d'éléments
- ✅ **Event delegation avancé** : Un listener pour tous les toasts
- ✅ **requestAnimationFrame** : Animations performantes
- ✅ **Global API design** : Exposer une API simple (`window.toast()`)
- ✅ **Factory pattern** : Créer des objets de manière uniforme
- ✅ **Classes avancées** : Gestion d'état complexe dans une classe

---

## 🎯 Exercice 8 : Statistiques avec Async Data Processing ⭐⭐⭐

### 📝 Mission

Créez un **dashboard de statistiques** qui analyse `window.CV_COMPETENCES` avec **traitement asynchrone des données** (pour simuler de gros volumes), affiche des graphiques dynamiques, et peut **charger des données depuis GitHub API**.

### 🎨 Où travailler

- **Fichiers à créer** :
  - `js/analytics/StatsProcessor.js` (classe de traitement)
  - `js/analytics/dashboard.js` (interface)
- **Nouvelle page** : `html/stats.html` (ou modal)

### 💡 Ce que vous devez faire

1. **Analyser les compétences** avec `reduce()`, `filter()`, `map()`
   - Par catégorie (hard-skills, soft-skills, etc.)
   - Par période (études, trading, leclerc, dev)
   - Avec/sans liens externes
2. **Traitement asynchrone** : Simuler du traitement lourd avec `setTimeout` + Promises
3. **Fetch GitHub API** : Récupérer vos repos et afficher les langages utilisés
4. **Graphiques dynamiques** : Barres horizontales en CSS
5. **Loading progressif** : Afficher les stats au fur et à mesure

### 🔍 Indices disponibles

<details>
<summary>💡 Indice 1 : Classe StatsProcessor avec méthodes async</summary>

```javascript
// StatsProcessor.js
export class StatsProcessor {
  constructor(competences) {
    this.competences = competences;
  }

  // Simuler un traitement lourd avec async
  async processAsync(data, processFn, delay = 100) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(processFn(data));
      }, delay);
    });
  }

  async analyzeByCategory() {
    return this.processAsync(this.competences, (data) => {
      return data.reduce((acc, comp) => {
        comp.categories.forEach((cat) => {
          acc[cat] = (acc[cat] || 0) + 1;
        });
        return acc;
      }, {});
    });
  }

  async analyzeByPeriod() {
    return this.processAsync(this.competences, (data) => {
      return data.reduce((acc, comp) => {
        const periode = comp.periode;
        acc[periode] = (acc[periode] || 0) + 1;
        return acc;
      }, {});
    });
  }

  async calculatePercentages() {
    const total = this.competences.length;

    return this.processAsync(this.competences, (data) => {
      const withLinks = data.filter((c) => c.link !== null).length;
      const withoutLinks = total - withLinks;

      return {
        withLinks: Math.round((withLinks / total) * 100),
        withoutLinks: Math.round((withoutLinks / total) * 100),
        total,
      };
    });
  }

  async generateFullReport() {
    // Exécuter toutes les analyses en parallèle
    const [byCategory, byPeriod, percentages] = await Promise.all([
      this.analyzeByCategory(),
      this.analyzeByPeriod(),
      this.calculatePercentages(),
    ]);

    return {
      byCategory,
      byPeriod,
      percentages,
      timestamp: new Date().toISOString(),
    };
  }
}
```

</details>

<details>
<summary>💡 Indice 2 : Fetch GitHub API pour les langages</summary>

```javascript
async function fetchGitHubLanguages(username) {
  try {
    // Récupérer les repos
    const reposUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
    const response = await fetch(reposUrl);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();

    // Compter les langages
    const languages = repos.reduce((acc, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
      }
      return acc;
    }, {});

    return languages;
  } catch (error) {
    console.error("GitHub fetch error:", error);
    return null;
  }
}
```

</details>

<details>
<summary>💡 Indice 3 : Créer des graphiques en barres dynamiques</summary>

```javascript
function createBarChart(data, container, title) {
  const chartDiv = document.createElement("div");
  chartDiv.className = "chart-section";

  const titleEl = document.createElement("h3");
  titleEl.textContent = title;
  chartDiv.appendChild(titleEl);

  const max = Math.max(...Object.values(data));

  Object.entries(data).forEach(([label, value]) => {
    const barContainer = document.createElement("div");
    barContainer.className = "bar-container";

    const barLabel = document.createElement("span");
    barLabel.className = "bar-label";
    barLabel.textContent = label;

    const barWrapper = document.createElement("div");
    barWrapper.className = "bar-wrapper";

    const barFill = document.createElement("div");
    barFill.className = "bar-fill";
    const percentage = (value / max) * 100;

    // Animation progressive
    setTimeout(() => {
      barFill.style.width = `${percentage}%`;
    }, 100);

    const barValue = document.createElement("span");
    barValue.className = "bar-value";
    barValue.textContent = value;

    barWrapper.appendChild(barFill);
    barContainer.appendChild(barLabel);
    barContainer.appendChild(barWrapper);
    barContainer.appendChild(barValue);

    chartDiv.appendChild(barContainer);
  });

  container.appendChild(chartDiv);
}
```

CSS :

```css
.bar-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.bar-label {
  min-width: 120px;
  font-size: 0.9rem;
}

.bar-wrapper {
  flex: 1;
  height: 30px;
  background: rgba(128, 128, 128, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: var(--accent-color);
  width: 0;
  transition: width 1s ease;
}

.bar-value {
  min-width: 30px;
  text-align: right;
  font-weight: 600;
}
```

</details>

<details>
<summary>💡 Indice 4 : Dashboard complet avec loading progressif</summary>

```javascript
// dashboard.js
import { StatsProcessor } from "./StatsProcessor.js";

async function initDashboard() {
  const container = document.getElementById("stats-dashboard");
  const loader = document.getElementById("stats-loader");

  try {
    // Afficher loader
    loader.style.display = "block";

    // Analyser les compétences
    const processor = new StatsProcessor(window.CV_COMPETENCES);

    // Afficher les stats au fur et à mesure
    const byCategory = await processor.analyzeByCategory();
    createBarChart(byCategory, container, "Compétences par catégorie");

    const byPeriod = await processor.analyzeByPeriod();
    createBarChart(byPeriod, container, "Compétences par période");

    const percentages = await processor.calculatePercentages();
    displayPercentages(percentages, container);

    // Fetch GitHub (optionnel)
    const languages = await fetchGitHubLanguages("votre-username");
    if (languages) {
      createBarChart(languages, container, "Langages sur GitHub");
    }
  } catch (error) {
    console.error("Dashboard error:", error);
    container.innerHTML =
      '<p class="error">Erreur lors du chargement des statistiques</p>';
  } finally {
    loader.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", initDashboard);
```

</details>

### ✅ Test de validation

- [ ] Les statistiques sont calculées correctement
- [ ] Traitement asynchrone fonctionne (delay simulé)
- [ ] Graphiques générés dynamiquement
- [ ] Animations progressives des barres
- [ ] GitHub API fetch fonctionne
- [ ] Loading state visible pendant le traitement
- [ ] `Promise.all()` utilisé pour paralléliser

### 🎁 Bonus

- ✅ **Export CSV** : Bouton pour télécharger les stats en CSV
- ✅ **Graphique camembert** : Utilisez Canvas API
- ✅ **Filtres interactifs** : Filtrer par période/catégorie
- ✅ **Web Worker** : Déporter le traitement dans un worker
- ✅ **Comparaison** : Comparer avec d'autres profils GitHub

### 🎓 Concepts appris

- ✅ **Async data processing** : Traiter des données de façon asynchrone
- ✅ **`Promise.all()`** : Paralléliser des opérations async
- ✅ **`reduce()` avancé** : Agrégation de données complexes
- ✅ **GitHub API** : Consommer une vraie API REST
- ✅ **Dynamic charting** : Créer des visualisations en JavaScript
- ✅ **Progressive rendering** : Afficher les données au fur et à mesure

---

## 📚 PAUSE PÉDAGOGIQUE : Interlude 5

> **⚠️ IMPORTANT** : Avant de passer à l'exercice 9, prenez le temps de faire l'interlude suivant :
>
> ### 🎓 **INTERLUDE 5 : Map, Set & Immutabilité** (~25 min)
>
> **Fichier :** `tuto-js/interlude/INTERLUDE-5-MAP-SET.md`
>
> **Ce que vous allez apprendre :**
>
> - ✅ **Set** : Liste de valeurs uniques, lookup O(1)
> - ✅ **Map** : Dictionnaire performant avec clés de n'importe quel type
> - ✅ WeakMap/WeakSet (garbage collection)
> - ✅ **Immutabilité** : Éviter les mutations dangereuses
> - ✅ Spread operator pour copier sans muter
> - ✅ `Object.freeze()`
>
> **Pourquoi maintenant ?** L'exercice 9 utilise une NavigationHistory qui stocke des périodes uniques. Set est parfait pour ça. De plus, l'immutabilité est essentielle pour éviter les bugs de state dans des applications complexes.
>
> **Performance + Clarté + Pas de bugs de mutation = Code professionnel**
>
> ---
>
> **📝 Checklist avant de continuer :**
>
> - [ ] J'ai lu et compris l'interlude 5
> - [ ] Je comprends la différence entre Set et Array
> - [ ] Je comprends la différence entre Map et Object
> - [ ] Je sais éviter les mutations avec spread
> - [ ] J'ai fait les mini-défis sur Map/Set
> - [ ] Je suis prêt pour l'exercice 9 (navigation history) !

---

_**[SUITE DANS LE PROCHAIN MESSAGE - Exercices 9-10]**_
