# 🎮 Exercices Pratiques JavaScript - Challenge Progressif

## 📋 Règles du jeu

### 🎯 Objectifs

- **Écrire** du JavaScript (pas juste le lire)
- Progresser de **niveau débutant à avancé**
- Utiliser le HTML/CSS de votre site existant
- Apprendre en **faisant** et en **challengeant**

### 🤝 Règles d'assistance

- ❌ **Je ne donne JAMAIS la solution directe**
- ✅ Je fournis des **indices**, **tips** et **pistes de réflexion**
- ✅ Si vous êtes bloqué, demandez une **aide partielle**
- ✅ Format de demande d'aide : _"J'ai besoin d'un coup de pouce sur [partie précise]"_

### 📊 Système de progression

- ⭐ **Niveau 1-3** : Bases (sélection DOM, événements, conditions)
- ⭐⭐ **Niveau 4-6** : Intermédiaire (manipulation données, localStorage, fonctions avancées)
- ⭐⭐⭐ **Niveau 7-9** : Avancé (API, async, patterns complexes)
- ⭐⭐⭐⭐ **Niveau 10** : Expert (architecture complète)

---

## 🎯 Exercice 1 : Compteur de clics ⭐

### 📝 Mission

Créez un compteur qui affiche le nombre de fois qu'on clique sur le logo du CV dans le header.

### 🎨 Où travailler

- **Fichier à créer** : `js/utility/click-counter.js`
- **Élément HTML** : `.cv-logo` (déjà dans votre header)

### 💡 Ce que vous devez faire

1. Attendre que le DOM soit chargé
2. Sélectionner l'image du logo
3. Créer une variable pour compter les clics
4. Écouter les clics sur le logo
5. Incrémenter le compteur à chaque clic
6. Afficher le résultat dans la console

### 🔍 Indices disponibles

<details>
<summary>💡 Indice 1 : Structure de base</summary>

Votre fichier doit commencer par attendre le chargement de la page. Rappelez-vous du pattern utilisé dans tous les fichiers JS de votre site...

Pensez à l'événement qui se déclenche quand tout le HTML est prêt.

</details>

<details>
<summary>💡 Indice 2 : Sélection d'élément</summary>

Pour cibler le logo, vous avez besoin d'une méthode qui sélectionne un élément via sa classe CSS.

L'image du logo a la classe `cv-logo`. Il existe une méthode qui commence par `query`...

</details>

<details>
<summary>💡 Indice 3 : Écouter les clics</summary>

Pour réagir aux clics, vous devez "écouter" l'événement sur l'élément.

Il existe une méthode qui "ajoute un écouteur d'événement". Elle prend 2 paramètres : le type d'événement et la fonction à exécuter.

</details>

<details>
<summary>💡 Indice 4 : Variable compteur</summary>

Vous avez besoin d'une variable qui peut changer de valeur.

Pensez à `let` (pas `const` car la valeur va évoluer). Initialisez-la à 0.

</details>

### ✅ Test de validation

- [✅] Le compteur s'affiche dans la console à chaque clic
- [✅] Le compteur augmente correctement (1, 2, 3...)
- [✅] Aucune erreur dans la console
- [✅] Le compteur continue de fonctionner après 10 clics

### 🎁 Bonus

-✅ Affichez un message différent tous les 5 clics : "🎉 5 clics !"
-✅ Changez la taille du logo après 10 clics
-✅ Sauvegardez le compteur dans localStorage

---

## 🎯 Exercice 2 : Affichage dynamique de l'heure ⭐

### 📝 Mission

Affichez l'heure actuelle qui se met à jour chaque seconde dans le header.

### 🎨 Où travailler

- **Fichier à créer** : `js/utility/live-clock.js`
- **Emplacement** : Créez un `<span>` à côté du logo

### 💡 Ce que vous devez faire

1. Créer un élément `<span>` en JavaScript
2. Lui donner un ID (ex: `live-clock`)
3. L'insérer dans le header (après le logo)
4. Obtenir l'heure actuelle
5. Formater l'heure (HH:MM:SS)
6. Mettre à jour l'affichage chaque seconde

### 🔍 Indices disponibles

<details>
<summary>💡 Indice 1 : Créer un élément</summary>

JavaScript peut créer des éléments HTML avec `document.createElement()`.

Pour un span : `const monSpan = document.createElement('span');`

</details>

<details>
<summary>💡 Indice 2 : Obtenir l'heure</summary>

JavaScript a un objet `Date` qui donne accès à l'heure actuelle.

```javascript
const maintenant = new Date();
// Ensuite utilisez getHours(), getMinutes(), getSeconds()
```

</details>

<details>
<summary>💡 Indice 3 : Répéter une action</summary>

Pour exécuter du code toutes les secondes, utilisez `setInterval()`.

Cette fonction prend 2 paramètres : une fonction et un délai en millisecondes (1000ms = 1 seconde).

</details>

<details>
<summary>💡 Indice 4 : Formater avec des zéros</summary>

Pour avoir "09" au lieu de "9", vous pouvez utiliser une fonction helper :

```javascript
function ajouterZero(nombre) {
  // Si nombre < 10, ajouter un 0 devant
  // Sinon, retourner tel quel
}
```

Pensez à l'opérateur ternaire : `condition ? siVrai : siFaux`

</details>

### ✅ Test de validation

- [✅] L'heure s'affiche correctement (format HH:MM:SS)
- [✅] L'heure se met à jour chaque seconde
- [✅] L'horloge ne crée pas de duplicata au rechargement
- [✅] Le style s'intègre bien avec le reste du header

### 🎁 Bonus

-✅ Ajoutez la date (jour/mois/année)
-✅ Changez la couleur selon le thème (light/dark)
-✅ Affichez "Bonjour" ou "Bonsoir" selon l'heure

---

## 🎯 Exercice 3 : Bouton "Copier l'email" ⭐

### 📝 Mission

Ajoutez un bouton qui copie votre email dans le presse-papier avec un feedback visuel.

### 🎨 Où travailler

- **Fichier à créer** : `js/utility/copy-email.js`
- **Page** : `contact-info.html` (ou créer un bouton dans le header)

### 💡 Ce que vous devez faire

1. Créer un bouton "Copier mon email"
2. Stocker votre email dans une variable
3. Copier l'email dans le presse-papier au clic
4. Afficher un message de confirmation temporaire
5. Changer le texte du bouton pendant 2 secondes

### 🔍 Indices disponibles

<details>
<summary>💡 Indice 1 : API du presse-papier</summary>

JavaScript moderne a une API pour le clipboard :

```javascript
navigator.clipboard.writeText("texte à copier");
```

Cette méthode retourne une Promise (concept async).

</details>

<details>
<summary>💡 Indice 2 : Changer le texte temporairement</summary>

1. Sauvegarder le texte original du bouton
2. Changer le texte en "✓ Copié !"
3. Utiliser `setTimeout()` pour restaurer après 2 secondes

`setTimeout()` prend une fonction et un délai en millisecondes.

</details>

<details>
<summary>💡 Indice 3 : Gérer les erreurs</summary>

L'API clipboard peut échouer (permissions). Utilisez `.then()` et `.catch()` :

```javascript
navigator.clipboard
  .writeText(email)
  .then(() => {
    // Succès
  })
  .catch(() => {
    // Erreur
  });
```

</details>

### ✅ Test de validation

- [✅] Le bouton copie bien l'email (testez en le collant)
- [✅] Le feedback "✓ Copié !" apparaît puis disparaît
- [✅] Aucune erreur en console
- [✅] Fonctionne sur plusieurs clics successifs

### 🎁 Bonus

- ✅ Ajoutez une animation CSS lors de la copie
- ✅ Affichez un tooltip au survol
- ✅ Gérez le cas où le clipboard est bloqué (message d'erreur)

---

## 🎯 Exercice 4 : Filtre intelligent avec Debouncing & Modules ⭐⭐

### 📝 Mission

Créez un système de filtrage performant en temps réel avec **debouncing** pour éviter trop d'exécutions, et structurez votre code en **modules ES6**.

### 🎨 Où travailler

- **Fichiers à créer** :
  - `js/search/search-utils.js` (module utilitaires)
  - `js/search/smart-filter.js` (module principal)
- **Modification HTML** : Ajouter `type="module"` à vos scripts

### 💡 Ce que vous devez faire

1. **Créer un module `search-utils.js`** avec :
   - Fonction `debounce(func, delay)` pour limiter les appels
   - Fonction `normalizeText(text)` pour nettoyer les accents/casse
   - Fonction `highlightMatch(text, query)` pour surligner
2. **Créer un module `smart-filter.js`** qui :
   - Importe les fonctions de `search-utils.js`
   - Écoute l'input de recherche avec debouncing (300ms)
   - Filtre les compétences de `window.CV_COMPETENCES`
   - Affiche/masque avec animation
   - Compte les résultats

### 🔍 Indices disponibles

<details>
<summary>💡 Indice 1 : Créer la fonction debounce</summary>

Le debouncing retarde l'exécution d'une fonction jusqu'à ce que l'utilisateur arrête de taper :

```javascript
export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
```

Cette fonction utilise une **closure** pour stocker `timeoutId` entre les appels.

</details>

<details>
<summary>💡 Indice 2 : Modules ES6 - export/import</summary>

**Dans `search-utils.js` :**

```javascript
export function debounce(func, delay) {
  /* ... */
}

export function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
```

**Dans `smart-filter.js` :**

```javascript
import { debounce, normalizeText } from "./search-utils.js";
// Utilisez les fonctions importées
```

**Dans HTML :**

```html
<script type="module" src="/js/search/smart-filter.js"></script>
```

</details>

<details>
<summary>💡 Indice 3 : Utiliser debounce avec l'input</summary>

```javascript
import { debounce } from "./search-utils.js";

const searchInput = document.querySelector(".search-input");

const performSearch = debounce((query) => {
  console.log("Recherche:", query);
  // Votre logique de filtrage ici
}, 300);

searchInput.addEventListener("input", (e) => {
  performSearch(e.target.value);
});
```

Maintenant la recherche ne s'exécute que 300ms après la dernière frappe !

</details>

<details>
<summary>💡 Indice 4 : Filtrer window.CV_COMPETENCES</summary>

```javascript
function filterCompetences(query) {
  const normalized = normalizeText(query);

  return window.CV_COMPETENCES.filter((comp) => {
    const name = normalizeText(comp.name);
    const desc = normalizeText(comp.description);
    return name.includes(normalized) || desc.includes(normalized);
  });
}
```

</details>

<details>
<summary>💡 Indice 5 : Afficher les résultats avec compteur</summary>

```javascript
function displayResults(results, query) {
  const container = document.querySelector(".competences-list");
  const counter = document.getElementById("results-counter");

  // Afficher le compteur
  if (counter) {
    counter.textContent = `${results.length} résultat${
      results.length > 1 ? "s" : ""
    }`;
  }

  // Masquer tous les items
  const allItems = container.querySelectorAll(".item-competence");
  allItems.forEach((item) => item.classList.add("hidden"));

  // Afficher seulement les résultats
  results.forEach((comp) => {
    const item = container.querySelector(`[data-id="${comp.id}"]`);
    if (item) {
      item.classList.remove("hidden");
    }
  });
}
```

</details>

### ✅ Test de validation

- [ ] La recherche utilise le debouncing (pas d'exécution à chaque lettre)
- [ ] Le code est structuré en modules (fichiers séparés)
- [ ] Les imports/exports fonctionnent correctement
- [ ] Un compteur affiche "X résultats trouvés"
- [ ] La recherche ignore accents et majuscules
- [ ] Performance : testez en tapant rapidement (pas de lag)

### 🎁 Bonus

- ✅ **Surlignage** : Créez `highlightMatch(text, query)` qui entoure le match de `<mark>`
- ✅ **Historique** : Sauvegardez les 5 dernières recherches dans localStorage
- ✅ **Suggestions** : Proposez des suggestions pendant la frappe
- ✅ **Keyboard navigation** : Naviguer les résultats avec ↑↓ et valider avec Enter

### 🎓 Concepts appris

- ✅ **Debouncing** : Performance et UX
- ✅ **Modules ES6** : `import`/`export`, code modulaire
- ✅ **Closures** : Comprendre comment debounce garde `timeoutId` en mémoire
- ✅ **Array methods** : `filter()`, `forEach()`
- ✅ **String manipulation** : `normalize()`, regex pour accents

---

## 🎯 Exercice 5 : Système de Favoris avec POO & Classes ⭐⭐

### 📝 Mission

Créez un **système de favoris orienté objet** avec une **classe `FavoritesManager`** qui encapsule toute la logique, et utilisez l'**event delegation** pour gérer efficacement les clics.

### 🎨 Où travailler

- **Fichiers à créer** :
  - `js/utility/FavoritesManager.js` (classe en module)
  - `js/utility/favorites-ui.js` (interface utilisateur)

### 💡 Ce que vous devez faire

1. **Créer une classe `FavoritesManager`** avec :
   - `constructor()` : Charge les favoris depuis localStorage
   - `add(id)` : Ajoute un favori
   - `remove(id)` : Retire un favori
   - `toggle(id)` : Bascule un favori
   - `has(id)` : Vérifie si un ID est favori
   - `getAll()` : Retourne tous les favoris
   - `count()` : Nombre de favoris
   - `save()` : Sauvegarde dans localStorage
2. **Utiliser l'event delegation** : Un seul listener sur le parent au lieu d'un par étoile
3. **Ajouter des étoiles** (☆/★) à chaque compétence
4. **Badge compteur** dans le header : "X favoris"

### 🔍 Indices disponibles

<details>
<summary>💡 Indice 1 : Structure de la classe FavoritesManager</summary>

```javascript
// FavoritesManager.js
export class FavoritesManager {
  constructor(storageKey = "cv-favorites") {
    this.storageKey = storageKey;
    this.favorites = this.load();
  }

  load() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
  }

  add(id) {
    if (!this.has(id)) {
      this.favorites.push(id);
      this.save();
      return true;
    }
    return false;
  }

  remove(id) {
    const index = this.favorites.indexOf(id);
    if (index > -1) {
      this.favorites.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  toggle(id) {
    return this.has(id) ? this.remove(id) : this.add(id);
  }

  has(id) {
    return this.favorites.includes(id);
  }

  getAll() {
    return [...this.favorites];
  }

  count() {
    return this.favorites.length;
  }
}
```

</details>

<details>
<summary>💡 Indice 2 : Event delegation pour les étoiles</summary>

Au lieu d'ajouter un listener sur chaque étoile (coûteux) :

```javascript
import { FavoritesManager } from "./FavoritesManager.js";

const manager = new FavoritesManager();
const container = document.querySelector(".competences-list");

// UN SEUL listener sur le conteneur parent
container.addEventListener("click", (e) => {
  // Vérifier si le clic est sur une étoile
  const star = e.target.closest(".favorite-star");
  if (!star) return;

  const competenceId = star.dataset.competenceId;
  manager.toggle(competenceId);

  // Mettre à jour l'affichage de l'étoile
  updateStarDisplay(star, manager.has(competenceId));

  // Mettre à jour le badge compteur
  updateCounterBadge(manager.count());
});
```

**Avantage** : Même avec 1000 compétences, vous n'avez qu'UN listener !

</details>

<details>
<summary>💡 Indice 3 : Créer les étoiles dynamiquement</summary>

```javascript
function addStarsToCompetences() {
  const competences = document.querySelectorAll(".item-competence");

  competences.forEach((item) => {
    const id = item.dataset.competenceId;
    const isFavorite = manager.has(id);

    const star = document.createElement("button");
    star.className = "favorite-star";
    star.dataset.competenceId = id;
    star.textContent = isFavorite ? "★" : "☆";
    star.setAttribute("aria-label", "Marquer comme favori");

    item.prepend(star);
  });
}
```

</details>

<details>
<summary>💡 Indice 4 : Badge compteur dans le header</summary>

```javascript
function createFavoritesBadge() {
  const nav = document.querySelector(".navbar");
  const badge = document.createElement("div");
  badge.className = "favorites-badge";
  badge.id = "favorites-badge";
  badge.textContent = "0";
  badge.style.display = "none"; // Masqué si 0

  nav.appendChild(badge);
  return badge;
}

function updateCounterBadge(count) {
  const badge = document.getElementById("favorites-badge");
  if (!badge) return;

  badge.textContent = count;
  badge.style.display = count > 0 ? "block" : "none";
}
```

CSS pour le badge :

```css
.favorites-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--accent-color);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

</details>

<details>
<summary>💡 Indice 5 : Méthodes avancées de la classe</summary>

Ajoutez des méthodes utiles :

```javascript
class FavoritesManager {
  // ... méthodes de base ...

  // Récupérer les objets compétences complets
  getCompetencesObjects() {
    return this.favorites
      .map((id) => window.CV_COMPETENCES.find((c) => c.id === id))
      .filter(Boolean);
  }

  // Exporter en JSON
  exportToJSON() {
    const data = {
      favorites: this.favorites,
      exportDate: new Date().toISOString(),
      count: this.count(),
    };
    return JSON.stringify(data, null, 2);
  }

  // Import depuis JSON
  importFromJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      this.favorites = Array.isArray(data.favorites) ? data.favorites : [];
      this.save();
      return true;
    } catch (e) {
      console.error("Import error:", e);
      return false;
    }
  }

  // Effacer tous les favoris
  clear() {
    this.favorites = [];
    this.save();
  }
}
```

</details>

### ✅ Test de validation

- [ ] La classe `FavoritesManager` fonctionne correctement
- [ ] Les étoiles apparaissent sur chaque compétence
- [ ] Le clic bascule entre ☆ et ★
- [ ] Les favoris persistent après rechargement
- [ ] Le badge compteur s'affiche et se met à jour
- [ ] L'event delegation fonctionne (un seul listener)
- [ ] Testez avec `manager.getAll()` dans la console

### 🎁 Bonus

- ✅ **Page favoris** : Créez `html/favoris.html` qui liste uniquement les favoris
- ✅ **Export/Import** : Boutons pour télécharger/charger un fichier JSON
- ✅ **Filtrer par favoris** : Ajouter un filtre "Mes favoris" dans la recherche
- ✅ **Sync multi-onglets** : Utilisez `storage` event pour synchroniser
- ✅ **Animations** : Transition smooth lors du toggle d'étoile

### 🎓 Concepts appris

- ✅ **Classes ES6** : `constructor`, méthodes, encapsulation
- ✅ **POO** : Programmation orientée objet en JavaScript
- ✅ **Event delegation** : Pattern performant pour les listeners
- ✅ **Modules** : Exporter/importer des classes
- ✅ **Encapsulation** : Garder la logique métier séparée de l'UI
- ✅ **Array methods** : `map()`, `filter()`, `find()`, `includes()`

---

## 🎯 Exercice 6 : Color Picker avec API Externe (fetch + async/await) ⭐⭐⭐

```javascript
// Sauvegarder
const favoris = ["html-css", "javascript"];
localStorage.setItem("favoris", JSON.stringify(favoris));

// Récupérer
const saved = localStorage.getItem("favoris");
const favoris = saved ? JSON.parse(saved) : [];
```

</details>

<details>
<summary>💡 Indice 3 : Toggle favori (ajouter/retirer)</summary>

Pour basculer un élément dans un array :

```javascript
const index = favoris.indexOf(id);
if (index > -1) {
  // Déjà présent → retirer
  favoris.splice(index, 1);
} else {
  // Pas présent → ajouter
  favoris.push(id);
}
```

</details>

<details>
<summary>💡 Indice 4 : Récupérer l'ID d'une compétence</summary>

Chaque compétence a un `data-competence-id` dans votre HTML.

```javascript
const id = competenceElement.getAttribute("data-competence-id");
// ou : const id = competenceElement.dataset.competenceId;
```

</details>

### ✅ Test de validation

- [ ] L'étoile apparaît sur chaque compétence
- [ ] Le clic change l'étoile (☆ ↔ ★)
- [ ] Les favoris persistent après rechargement de la page
- [ ] On peut défavoriser une compétence
- [ ] Aucune erreur si localStorage est vide

### 🎁 Bonus

- Créez une page "Mes favoris" qui liste uniquement les favoris
- Ajoutez un compteur "X favoris" dans le header
- Permettez d'exporter les favoris en JSON

---
