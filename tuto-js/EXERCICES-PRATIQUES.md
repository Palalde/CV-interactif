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

- [ ] Le compteur s'affiche dans la console à chaque clic
- [ ] Le compteur augmente correctement (1, 2, 3...)
- [ ] Aucune erreur dans la console
- [ ] Le compteur continue de fonctionner après 10 clics

### 🎁 Bonus

- Affichez un message différent tous les 5 clics : "🎉 5 clics !"
- Changez la taille du logo après 10 clics
- Sauvegardez le compteur dans localStorage

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

- [ ] L'heure s'affiche correctement (format HH:MM:SS)
- [ ] L'heure se met à jour chaque seconde
- [ ] L'horloge ne crée pas de duplicata au rechargement
- [ ] Le style s'intègre bien avec le reste du header

### 🎁 Bonus

- Ajoutez la date (jour/mois/année)
- Changez la couleur selon le thème (light/dark)
- Affichez "Bonjour" ou "Bonsoir" selon l'heure

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

- [ ] Le bouton copie bien l'email (testez en le collant)
- [ ] Le feedback "✓ Copié !" apparaît puis disparaît
- [ ] Aucune erreur en console
- [ ] Fonctionne sur plusieurs clics successifs

### 🎁 Bonus

- Ajoutez une animation CSS lors de la copie
- Affichez un tooltip au survol
- Gérez le cas où le clipboard est bloqué (message d'erreur)

---

## 🎯 Exercice 4 : Filtre des compétences par mot-clé ⭐⭐

### 📝 Mission

Créez un système de filtrage en temps réel des compétences basé sur ce que l'utilisateur tape.

### 🎨 Où travailler

- **Fichier à créer** : `js/search/simple-filter.js`
- **Éléments** : Input de recherche existant + listes de compétences

### 💡 Ce que vous devez faire

1. Récupérer l'input de recherche du header
2. Écouter chaque frappe de clavier (`input` event)
3. Récupérer toutes les compétences affichées (`.item-competence`)
4. Pour chaque compétence, vérifier si le texte contient la recherche
5. Masquer/afficher les compétences selon le résultat
6. Afficher "Aucun résultat" si tout est masqué

### 🔍 Indices disponibles

<details>
<summary>💡 Indice 1 : Récupérer la valeur de l'input</summary>

Dans l'événement `input`, vous avez accès à la valeur tapée via :

```javascript
input.addEventListener("input", function (event) {
  const recherche = event.target.value;
  // ou : const recherche = input.value;
});
```

Pensez à convertir en minuscules pour la comparaison.

</details>

<details>
<summary>💡 Indice 2 : Sélectionner toutes les compétences</summary>

Utilisez `querySelectorAll()` pour obtenir tous les éléments :

```javascript
const competences = document.querySelectorAll(".item-competence");
```

Cela retourne une NodeList qu'on peut parcourir avec `forEach()`.

</details>

<details>
<summary>💡 Indice 3 : Vérifier si texte contient recherche</summary>

La méthode `includes()` vérifie si une chaîne contient une autre :

```javascript
const texte = "JavaScript";
const contientJS = texte.toLowerCase().includes("java"); // true
```

</details>

<details>
<summary>💡 Indice 4 : Masquer/afficher un élément</summary>

Deux approches :

1. Modifier `element.style.display = 'none'` ou `'block'`
2. Ajouter/retirer une classe CSS `.hidden` (plus propre)

```javascript
element.classList.add("hidden"); // masquer
element.classList.remove("hidden"); // afficher
```

</details>

### ✅ Test de validation

- [ ] La recherche filtre en temps réel (pas besoin d'appuyer sur Entrée)
- [ ] La recherche est insensible à la casse (MAJ/min)
- [ ] Toutes les compétences réapparaissent si on vide l'input
- [ ] Un message s'affiche s'il n'y a aucun résultat

### 🎁 Bonus

- Surlignez le texte correspondant dans les résultats
- Comptez et affichez le nombre de résultats trouvés
- Ajoutez un bouton pour effacer la recherche

---

## 🎯 Exercice 5 : Mode "Favoris" avec localStorage ⭐⭐

### 📝 Mission

Permettez aux utilisateurs de marquer des compétences comme "favorites" et sauvegardez leur choix.

### 🎨 Où travailler

- **Fichier à créer** : `js/utility/favorites-system.js`
- **Modification** : Ajoutez une icône ⭐ à chaque compétence

### 💡 Ce que vous devez faire

1. Ajouter une icône étoile (☆) à côté de chaque compétence
2. Au clic, basculer entre ☆ (vide) et ★ (pleine)
3. Sauvegarder les favoris dans localStorage (array d'IDs)
4. Au chargement, restaurer les étoiles pleines
5. Créer une fonction pour récupérer toutes les compétences favorites

### 🔍 Indices disponibles

<details>
<summary>💡 Indice 1 : Ajouter l'icône à chaque compétence</summary>

Vous devez :

1. Sélectionner toutes les compétences
2. Pour chacune, créer un élément `<button>` ou `<span>`
3. Lui donner le contenu "☆" et une classe CSS
4. L'insérer dans l'élément compétence

```javascript
competences.forEach((comp) => {
  const star = document.createElement("button");
  star.className = "favorite-star";
  star.textContent = "☆";
  comp.prepend(star); // ou appendChild()
});
```

</details>

<details>
<summary>💡 Indice 2 : localStorage - sauvegarder un array</summary>

localStorage ne stocke que des strings. Pour un array :

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

## 🎯 Exercice 6 : Thème personnalisé avec sélecteur de couleur ⭐⭐

### 📝 Mission

Ajoutez un color picker qui permet de changer la couleur d'accent du site.

### 🎨 Où travailler

- **Fichier à créer** : `js/utility/accent-color-picker.js`
- **HTML à ajouter** : Input type="color" dans le header ou un menu settings

### 💡 Ce que vous devez faire

1. Créer un input `<input type="color">`
2. Récupérer la couleur choisie
3. Appliquer cette couleur à la variable CSS `--accent-color`
4. Sauvegarder le choix dans localStorage
5. Restaurer la couleur au chargement
6. Ajouter un bouton "Réinitialiser" qui remet la couleur par défaut

### 🔍 Indices disponibles

<details>
<summary>💡 Indice 1 : Input color picker</summary>

HTML :

```html
<input type="color" id="accent-picker" value="#ef5350" />
```

JavaScript :

```javascript
const picker = document.getElementById("accent-picker");
picker.addEventListener("input", (e) => {
  const couleur = e.target.value; // format: #rrggbb
});
```

</details>

<details>
<summary>💡 Indice 2 : Modifier une variable CSS</summary>

Pour changer une variable CSS (custom property) :

```javascript
document.documentElement.style.setProperty("--accent-color", "#ff5733");
```

`documentElement` représente la balise `<html>` où sont définies les variables `:root`.

</details>

<details>
<summary>💡 Indice 3 : Valeur par défaut</summary>

Stockez la couleur par défaut en constante :

```javascript
const DEFAULT_COLOR = "#ef5350";

function resetColor() {
  applyColor(DEFAULT_COLOR);
  picker.value = DEFAULT_COLOR;
  localStorage.removeItem("accent-color");
}
```

</details>

### ✅ Test de validation

- [ ] Le color picker change la couleur d'accent en direct
- [ ] La couleur est sauvegardée et restaurée au rechargement
- [ ] Le bouton reset remet la couleur d'origine
- [ ] La couleur s'applique bien à tous les éléments concernés
- [ ] Compatible avec le système light/dark mode

### 🎁 Bonus

- Proposez des palettes prédéfinies (boutons preset)
- Vérifiez le contraste et alertez si trop faible
- Sauvegardez un historique des 5 dernières couleurs

---

## 🎯 Exercice 7 : Système de notifications toast ⭐⭐⭐

### 📝 Mission

Créez un système de notifications temporaires (comme les toasts Android/iOS).

### 🎨 Où travailler

- **Fichier à créer** : `js/utility/toast-notifications.js`
- **CSS à ajouter** : Styles pour les toasts

### 💡 Ce que vous devez faire

1. Créer une fonction `showToast(message, type, duration)`
2. Types : 'info', 'success', 'warning', 'error'
3. Le toast apparaît en bas à droite
4. Il s'efface automatiquement après `duration` ms
5. Plusieurs toasts peuvent s'empiler
6. Clic sur le toast le ferme immédiatement

### 🔍 Indices disponibles

<details>
<summary>💡 Indice 1 : Structure de la fonction</summary>

```javascript
function showToast(message, type = "info", duration = 3000) {
  // 1. Créer l'élément toast
  // 2. Définir le contenu et les classes
  // 3. Ajouter au body
  // 4. Déclencher l'animation d'entrée
  // 5. Programmer la suppression
}
```

</details>

<details>
<summary>💡 Indice 2 : Créer le conteneur de toasts</summary>

Au premier appel, créer un conteneur fixe :

```javascript
let toastContainer = document.getElementById("toast-container");
if (!toastContainer) {
  toastContainer = document.createElement("div");
  toastContainer.id = "toast-container";
  document.body.appendChild(toastContainer);
}
```

CSS :

```css
#toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
```

</details>

<details>
<summary>💡 Indice 3 : Animation d'apparition</summary>

Utilisez `requestAnimationFrame` pour forcer un reflow :

```javascript
toast.style.opacity = "0";
toast.style.transform = "translateX(100%)";
toastContainer.appendChild(toast);

requestAnimationFrame(() => {
  toast.style.transition = "all 0.3s ease";
  toast.style.opacity = "1";
  toast.style.transform = "translateX(0)";
});
```

</details>

<details>
<summary>💡 Indice 4 : Suppression automatique</summary>

```javascript
const timeoutId = setTimeout(() => {
  removeToast(toast);
}, duration);

// Pour annuler si clic manuel :
toast.addEventListener("click", () => {
  clearTimeout(timeoutId);
  removeToast(toast);
});

function removeToast(toast) {
  toast.style.opacity = "0";
  toast.style.transform = "translateX(100%)";
  setTimeout(() => toast.remove(), 300);
}
```

</details>

### ✅ Test de validation

- [ ] `showToast("Test")` affiche une notification
- [ ] Les 4 types ont des styles différents
- [ ] Les toasts s'empilent verticalement
- [ ] Ils disparaissent automatiquement
- [ ] Le clic ferme immédiatement
- [ ] Pas de fuite mémoire (pas de toasts "fantômes")

### 🎁 Bonus

- Ajoutez des icônes selon le type (✓ ✕ ⓘ ⚠)
- Barre de progression pour le timer
- Queue de toasts (max 3 visibles à la fois)
- Exposez `window.toast()` pour utilisation globale

---

## 🎯 Exercice 8 : Statistiques et graphique des compétences ⭐⭐⭐

### 📝 Mission

Analysez les données de `window.CV_COMPETENCES` et affichez des statistiques avec un graphique simple.

### 🎨 Où travailler

- **Fichier à créer** : `js/analytics/competences-stats.js`
- **Nouvelle page** : Créez une section "Statistiques" ou un modal

### 💡 Ce que vous devez faire

1. Compter les compétences par catégorie (hard-skills, soft-skills, etc.)
2. Compter par période (etudes, trading, leclerc, dev)
3. Calculer le % de compétences avec un lien externe
4. Afficher les résultats en texte
5. Créer un graphique en barres avec des `<div>` et CSS

### 🔍 Indices disponibles

<details>
<summary>💡 Indice 1 : Analyser les données avec reduce()</summary>

```javascript
const competences = window.CV_COMPETENCES || [];

const parCategorie = competences.reduce((acc, comp) => {
  comp.categories.forEach((cat) => {
    acc[cat] = (acc[cat] || 0) + 1;
  });
  return acc;
}, {});

// Résultat : { 'hard-skills': 10, 'soft-skills': 8, ... }
```

</details>

<details>
<summary>💡 Indice 2 : Calculer des pourcentages</summary>

```javascript
const total = competences.length;
const avecLien = competences.filter((c) => c.link !== null).length;
const pourcentage = Math.round((avecLien / total) * 100);
```

</details>

<details>
<summary>💡 Indice 3 : Créer un graphique simple</summary>

HTML structure :

```html
<div class="chart">
  <div class="bar" data-category="hard-skills">
    <span class="bar-label">Hard Skills</span>
    <div class="bar-fill" style="width: 45%"></div>
    <span class="bar-value">12</span>
  </div>
</div>
```

CSS :

```css
.bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.bar-fill {
  height: 24px;
  background: var(--accent-color);
  transition: width 0.5s ease;
}
```

Créez ces barres dynamiquement en JS.

</details>

<details>
<summary>💡 Indice 4 : Trouver le max pour calculer le %</summary>

Pour que la plus grande catégorie fasse 100% de largeur :

```javascript
const valeurs = Object.values(parCategorie); // [12, 8, 5, ...]
const max = Math.max(...valeurs);

// Pour chaque catégorie :
const largeurPourcent = (count / max) * 100;
```

</details>

### ✅ Test de validation

- [ ] Les statistiques sont exactes
- [ ] Le graphique se génère dynamiquement
- [ ] Les barres ont des tailles proportionnelles
- [ ] Animation fluide à l'affichage
- [ ] Responsive (fonctionne sur mobile)

### 🎁 Bonus

- Ajoutez un tri (par nom ou par valeur)
- Animation progressive des barres (0% → valeur finale)
- Graphique camembert (pie chart) en Canvas
- Export des stats en CSV

---

## 🎯 Exercice 9 : Historique de navigation avec back/forward ⭐⭐⭐

### 📝 Mission

Trackez la navigation dans la timeline et permettez de revenir en arrière / avancer.

### 🎨 Où travailler

- **Fichier à créer** : `js/utility/navigation-history.js`
- **HTML à ajouter** : Boutons ← et → dans le header

### 💡 Ce que vous devez faire

1. Créer un array pour stocker l'historique de navigation
2. À chaque changement de slide, enregistrer la période
3. Ajouter deux boutons "Précédent" et "Suivant"
4. Implémenter la navigation dans l'historique
5. Désactiver les boutons aux extrémités
6. Sauvegarder l'historique dans sessionStorage

### 🔍 Indices disponibles

<details>
<summary>💡 Indice 1 : Structure de l'historique</summary>

```javascript
const navigationHistory = [];
let currentIndex = -1;

function addToHistory(periode) {
  // Si on est au milieu et qu'on navigue, effacer le "futur"
  if (currentIndex < navigationHistory.length - 1) {
    navigationHistory.splice(currentIndex + 1);
  }

  navigationHistory.push({
    periode: periode,
    timestamp: Date.now(),
  });

  currentIndex = navigationHistory.length - 1;
  updateButtons();
}
```

</details>

<details>
<summary>💡 Indice 2 : Hook sur updateContent()</summary>

Dans `main.js`, la fonction `updateContent()` est appelée à chaque changement.

Vous pouvez soit :

1. Modifier `updateContent()` pour appeler votre fonction
2. Créer un MutationObserver sur le slider
3. Écouter l'événement `input` du range slider

Option 3 (la plus simple) :

```javascript
const rangeSlider = document.getElementById("myRange");
rangeSlider.addEventListener("change", () => {
  const periode = getPeriodeFromSliderValue(rangeSlider.value);
  addToHistory(periode);
});
```

</details>

<details>
<summary>💡 Indice 3 : Navigation back/forward</summary>

```javascript
function goBack() {
  if (currentIndex > 0) {
    currentIndex--;
    const periode = navigationHistory[currentIndex].periode;
    navigateToWithoutHistory(periode);
    updateButtons();
  }
}

function navigateToWithoutHistory(periode) {
  // Utiliser window.navigateTimelineToPeriode()
  // MAIS sans appeler addToHistory() pour éviter la boucle
  // Solution : flag temporaire
}
```

</details>

<details>
<summary>💡 Indice 4 : Activer/désactiver les boutons</summary>

```javascript
function updateButtons() {
  const backBtn = document.getElementById("nav-back");
  const forwardBtn = document.getElementById("nav-forward");

  if (backBtn) {
    backBtn.disabled = currentIndex <= 0;
    backBtn.style.opacity = backBtn.disabled ? "0.3" : "1";
  }

  if (forwardBtn) {
    forwardBtn.disabled = currentIndex >= navigationHistory.length - 1;
    forwardBtn.style.opacity = forwardBtn.disabled ? "0.3" : "1";
  }
}
```

</details>

### ✅ Test de validation

- [ ] Chaque changement de slide est enregistré
- [ ] Le bouton "Précédent" navigue en arrière
- [ ] Le bouton "Suivant" navigue en avant
- [ ] Les boutons se désactivent correctement
- [ ] L'historique persiste pendant la session
- [ ] Pas de doublon d'entrées consécutives identiques

### 🎁 Bonus

- Affichez un dropdown avec tout l'historique
- Ajoutez des raccourcis clavier (Alt + ← / →)
- Limitez l'historique à 50 entrées max
- Affichez combien de fois chaque période a été visitée

---

## 🎯 Exercice 10 : Mini-jeu "Devinez la compétence" ⭐⭐⭐⭐

### 📝 Mission

Créez un mini-jeu où l'utilisateur doit deviner une compétence à partir d'indices.

### 🎨 Où travailler

- **Fichier à créer** : `js/games/guess-competence.js`
- **Nouvelle page** : Modal ou section dédiée au jeu

### 💡 Ce que vous devez faire

1. Choisir une compétence aléatoire dans `CV_COMPETENCES`
2. Afficher sa description (indice 1)
3. Proposer 4 choix de réponse (dont la bonne)
4. Vérifier la réponse
5. Compter les points (score)
6. Proposer une nouvelle question
7. Afficher le score final après 5 questions

### 🔍 Indices disponibles

<details>
<summary>💡 Indice 1 : Choisir aléatoirement</summary>

```javascript
function getRandomCompetence() {
  const competences = window.CV_COMPETENCES || [];
  const randomIndex = Math.floor(Math.random() * competences.length);
  return competences[randomIndex];
}
```

</details>

<details>
<summary>💡 Indice 2 : Générer des mauvaises réponses</summary>

```javascript
function generateChoices(correctCompetence) {
  const all = window.CV_COMPETENCES;
  const wrong = all
    .filter((c) => c.id !== correctCompetence.id)
    .sort(() => Math.random() - 0.5) // shuffle
    .slice(0, 3); // prendre 3

  const choices = [...wrong, correctCompetence];
  return choices.sort(() => Math.random() - 0.5); // re-shuffle
}
```

</details>

<details>
<summary>💡 Indice 3 : Structure du jeu</summary>

```javascript
const game = {
  score: 0,
  currentQuestion: 0,
  totalQuestions: 5,
  currentCompetence: null,

  start() {
    this.score = 0;
    this.currentQuestion = 0;
    this.nextQuestion();
  },

  nextQuestion() {
    if (this.currentQuestion >= this.totalQuestions) {
      this.end();
      return;
    }

    this.currentQuestion++;
    this.currentCompetence = getRandomCompetence();
    this.displayQuestion();
  },

  checkAnswer(selectedId) {
    if (selectedId === this.currentCompetence.id) {
      this.score++;
      // Feedback positif
    } else {
      // Feedback négatif
    }

    setTimeout(() => this.nextQuestion(), 1500);
  },

  end() {
    // Afficher le score final
  },
};
```

</details>

<details>
<summary>💡 Indice 4 : Interface HTML dynamique</summary>

```javascript
function displayQuestion() {
  const container = document.getElementById("game-container");

  container.innerHTML = `
    <div class="game-header">
      <span>Question ${game.currentQuestion}/${game.totalQuestions}</span>
      <span>Score: ${game.score}</span>
    </div>
    
    <div class="game-question">
      <p class="description">${game.currentCompetence.description}</p>
      <p class="hint">Période: ${game.currentCompetence.periode}</p>
    </div>
    
    <div class="game-choices"></div>
  `;

  const choicesContainer = container.querySelector(".game-choices");
  const choices = generateChoices(game.currentCompetence);

  choices.forEach((comp) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = comp.name;
    btn.addEventListener("click", () => {
      game.checkAnswer(comp.id);
      btn.classList.add(
        comp.id === game.currentCompetence.id ? "correct" : "wrong"
      );
      // Désactiver tous les boutons
      choicesContainer
        .querySelectorAll("button")
        .forEach((b) => (b.disabled = true));
    });
    choicesContainer.appendChild(btn);
  });
}
```

</details>

### ✅ Test de validation

- [ ] Le jeu démarre avec une première question
- [ ] 4 choix sont proposés
- [ ] La bonne réponse donne un point
- [ ] Le score s'affiche correctement
- [ ] Après 5 questions, le score final s'affiche
- [ ] On peut rejouer

### 🎁 Bonus

- Ajoutez un timer (10 secondes par question)
- Mode difficile : pas d'indice de période
- Highscore sauvegardé dans localStorage
- Partage du score sur les réseaux sociaux
- Système de vie (3 erreurs = game over)

---

## 🎮 Format de demande d'aide

### ✅ Bon format

> "Je bloque sur l'exercice 5. J'arrive à sauvegarder les favoris mais ils ne se restaurent pas au chargement. Peux-tu me donner une piste sur la partie 'restauration' ?"

> "Exercice 7 : ma fonction showToast fonctionne mais les toasts ne s'empilent pas, ils se remplacent. Indice sur le positionnement ?"

### ❌ Mauvais format

> "Donne-moi la solution de l'exercice 3"
> "Écris-moi tout le code"

---

## 🏆 Système de progression

Complétez les exercices dans l'ordre. Pour chaque exercice terminé :

### Auto-évaluation

1. ✅ **Le code fonctionne** (pas d'erreur console)
2. ✅ **Je comprends chaque ligne** (pas de copier/coller aveugle)
3. ✅ **Le code est propre** (indentation, noms explicites)
4. ✅ **Les guards sont présents** (`if (!element) return;`)
5. ✅ **Ça fonctionne sur mobile ET desktop**

### Niveaux de maîtrise

- **⭐ Débutant** : J'ai fait l'exercice avec tous les indices
- **⭐⭐ Confirmé** : J'ai fait l'exercice avec 2-3 indices max
- **⭐⭐⭐ Avancé** : J'ai fait l'exercice avec 1 indice ou sans
- **⭐⭐⭐⭐ Expert** : J'ai ajouté tous les bonus + innovations perso

---

## 📈 Objectif final

À la fin de ces 10 exercices, vous serez capable de :

✅ Manipuler le DOM avec aisance  
✅ Gérer des événements complexes  
✅ Utiliser localStorage/sessionStorage  
✅ Créer des animations et transitions  
✅ Structurer du code propre et maintenable  
✅ Débugger efficacement  
✅ Penser en termes d'architecture

**Vous passerez de 2,5/5 à 4/5 en JS** 🚀

---

## 🎯 Challenge ultime (après les 10 exercices)

Créez une **toute nouvelle section interactive** pour votre CV :

### Idées de projets

1. **Timeline des projets** : Affichez vos projets perso avec screenshots, techs utilisées, liens GitHub
2. **Section Blog** : Mini CMS pour écrire des articles techniques
3. **Portfolio interactif** : Galerie de vos créations avec filtres
4. **CV generator** : Outil pour que d'autres créent leur CV avec votre template
5. **Dashboard analytics** : Stats en temps réel de votre site (visites, clics, etc.)

### Contraintes

- ✅ Utiliser au moins 5 concepts appris
- ✅ Code structuré en module propre
- ✅ Responsive et accessible
- ✅ Intégré harmonieusement au reste du site

---

**Prêt à commencer ? Lancez-vous sur l'Exercice 1 !** 🎮

_Rappel : Demandez de l'aide en précisant où vous bloquez, je vous guiderai avec des indices plutôt que des solutions directes._
