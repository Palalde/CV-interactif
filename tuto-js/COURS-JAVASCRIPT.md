# 📚 Cours JavaScript Express - Les clés pour réussir les exercices

> **Objectif** : Vous donner les **outils** et **concepts** nécessaires pour réussir les exercices, sans vous donner les réponses directes.

---

## 🎯 Comment utiliser ce cours

1. **Lisez une section** correspondant à votre exercice
2. **Expérimentez** dans la console du navigateur (F12)
3. **Testez** les exemples fournis
4. **Appliquez** ce que vous avez appris dans l'exercice
5. **Demandez de l'aide** si vraiment bloqué (sans demander la solution)

---

## 📖 Table des matières

### Niveau ⭐ Débutant

1. [Attendre le chargement de la page](#1-attendre-le-chargement-de-la-page)
2. [Sélectionner des éléments](#2-sélectionner-des-éléments)
3. [Écouter les événements](#3-écouter-les-événements)
4. [Variables et compteurs](#4-variables-et-compteurs)
5. [Afficher dans la console](#5-afficher-dans-la-console)

### Niveau ⭐⭐ Intermédiaire

6. [Créer des éléments HTML](#6-créer-des-éléments-html)
7. [Dates et horloges](#7-dates-et-horloges)
8. [Répéter des actions (setInterval)](#8-répéter-des-actions-setinterval)
9. [Copier dans le presse-papier](#9-copier-dans-le-presse-papier)
10. [Promises et async](#10-promises-et-async)

### Niveau ⭐⭐⭐ Avancé

11. [Filtrer et manipuler des listes](#11-filtrer-et-manipuler-des-listes)
12. [LocalStorage (sauvegarder des données)](#12-localstorage-sauvegarder-des-données)
13. [Variables CSS (custom properties)](#13-variables-css-custom-properties)
14. [Créer des animations](#14-créer-des-animations)
15. [Manipuler des tableaux d'objets](#15-manipuler-des-tableaux-dobjets)

---

## Niveau ⭐ Débutant

### 1. Attendre le chargement de la page

#### 🎯 Pourquoi ?

Si vous essayez de manipuler un élément HTML avant qu'il soit chargé, vous aurez une erreur !

#### 🔑 La clé

```javascript
document.addEventListener("DOMContentLoaded", function () {
  // TOUT votre code ici
  console.log("Page chargée et prête !");
});
```

#### 🧪 Testez dans la console

```javascript
// ❌ Erreur possible (élément pas encore chargé)
const bouton = document.querySelector(".mon-bouton");
console.log(bouton);

// ✅ Sûr (attend le chargement)
document.addEventListener("DOMContentLoaded", function () {
  const bouton = document.querySelector(".mon-bouton");
  console.log(bouton); // Devrait afficher l'élément
});
```

#### 💡 Astuce pour vos exercices

**TOUJOURS** commencer vos fichiers JavaScript par cette structure !

---

### 2. Sélectionner des éléments

#### 🎯 Pourquoi ?

Pour modifier ou interagir avec un élément HTML, vous devez d'abord le "trouver".

#### 🔑 Les clés

**Un seul élément :**

```javascript
// Par classe
const logo = document.querySelector(".cv-logo");

// Par ID
const slider = document.querySelector("#myRange");

// Par balise
const premierBouton = document.querySelector("button");
```

**Plusieurs éléments :**

```javascript
// Tous les éléments avec cette classe
const tousLesBoutons = document.querySelectorAll(".btn");

// Parcourir la liste
tousLesBoutons.forEach(function (bouton) {
  console.log(bouton);
});
```

#### 🧪 Testez dans la console

```javascript
// Sur votre site, ouvrez F12 et tapez :
const logo = document.querySelector(".cv-logo");
console.log(logo); // Devrait afficher l'image

const competences = document.querySelectorAll(".item-competence");
console.log(competences.length); // Nombre de compétences
```

#### 💡 Astuce pour vos exercices

- Regardez le HTML pour trouver la **classe** ou l'**ID** de l'élément
- Utilisez `querySelector` pour **un** élément
- Utilisez `querySelectorAll` pour **plusieurs** éléments

#### ⚠️ Toujours vérifier

```javascript
const element = document.querySelector(".ma-classe");
if (!element) {
  console.log("Élément introuvable !");
  return; // Arrêter ici
}
// Continuer seulement si l'élément existe
```

---

### 3. Écouter les événements

#### 🎯 Pourquoi ?

Pour réagir aux actions de l'utilisateur (clic, toucher, écrire...)

#### 🔑 La clé

```javascript
element.addEventListener("typeEvenement", function (event) {
  // Ce qui se passe quand l'événement arrive
});
```

#### 📚 Types d'événements courants

**Clic :**

```javascript
bouton.addEventListener("click", function () {
  console.log("Bouton cliqué !");
});
```

**Modification d'input :**

```javascript
input.addEventListener("input", function (event) {
  const valeur = event.target.value;
  console.log("Vous avez tapé :", valeur);
});
```

**Toucher (mobile) :**

```javascript
element.addEventListener("touchstart", function () {
  console.log("Élément touché !");
});
```

**Clavier :**

```javascript
document.addEventListener("keydown", function (event) {
  console.log("Touche pressée :", event.key);

  if (event.key === "Enter") {
    console.log("Vous avez appuyé sur Entrée !");
  }
});
```

#### 🧪 Testez dans la console

```javascript
// Sur votre site, testez :
const logo = document.querySelector(".cv-logo");
logo.addEventListener("click", function () {
  alert("Logo cliqué !");
});
// Maintenant cliquez sur le logo
```

#### 💡 Astuce pour vos exercices

- `click` pour les clics de souris
- `input` pour les champs de texte
- `change` pour les changements de valeur
- `touchstart` pour le tactile

---

### 4. Variables et compteurs

#### 🎯 Pourquoi ?

Pour "mémoriser" des valeurs et les faire évoluer.

#### 🔑 Les clés

**Déclarer une variable :**

```javascript
// Variable qui ne change JAMAIS
const NOM_SITE = "CV Interactif";

// Variable qui peut changer
let compteur = 0;
```

**Incrémenter (augmenter) :**

```javascript
let score = 0;

score = score + 1; // Ajouter 1
score++; // Raccourci pour +1
score += 5; // Ajouter 5
```

**Décrémenter (diminuer) :**

```javascript
let vies = 3;

vies = vies - 1; // Retirer 1
vies--; // Raccourci pour -1
vies -= 2; // Retirer 2
```

#### 🧪 Testez dans la console

```javascript
let compteur = 0;
console.log("Début :", compteur); // 0

compteur++;
console.log("Après +1 :", compteur); // 1

compteur += 5;
console.log("Après +5 :", compteur); // 6
```

#### 💡 Astuce pour vos exercices

Pour compter les clics :

```javascript
let nombreDeClics = 0; // Initialiser à 0

bouton.addEventListener("click", function () {
  nombreDeClics++; // Augmenter de 1
  console.log("Clics :", nombreDeClics);
});
```

---

### 5. Afficher dans la console

#### 🎯 Pourquoi ?

Pour vérifier que votre code fonctionne et débugger.

#### 🔑 Les clés

**Simple :**

```javascript
console.log("Hello World");
console.log(42);
console.log(maVariable);
```

**Avec du texte et des variables :**

```javascript
const nom = "Paul";
const age = 25;

// Méthode 1 : Concaténation
console.log("Je m'appelle " + nom + " et j'ai " + age + " ans");

// Méthode 2 : Template literal (moderne)
console.log(`Je m'appelle ${nom} et j'ai ${age} ans`);
```

**Différents types de messages :**

```javascript
console.log("Message normal");
console.info("Information");
console.warn("Attention !");
console.error("Erreur !");
```

#### 🧪 Testez dans la console

```javascript
const prenom = "Paul";
const score = 100;

console.log(`${prenom} a un score de ${score} points`);
```

#### 💡 Astuce pour vos exercices

Utilisez `console.log()` PARTOUT pour suivre l'exécution de votre code !

---

## Niveau ⭐⭐ Intermédiaire

### 6. Créer des éléments HTML

#### 🎯 Pourquoi ?

Pour ajouter dynamiquement du contenu à votre page.

#### 🔑 Les clés

**Créer un élément :**

```javascript
const monDiv = document.createElement("div");
const monBouton = document.createElement("button");
const monSpan = document.createElement("span");
```

**Lui donner du contenu :**

```javascript
monBouton.textContent = "Cliquez-moi";
monBouton.innerHTML = "<strong>Cliquez-moi</strong>";
```

**Lui donner des classes/ID :**

```javascript
monDiv.className = "ma-classe";
monDiv.id = "mon-id";
monDiv.classList.add("autre-classe");
```

**Le styler :**

```javascript
monBouton.style.color = "red";
monBouton.style.fontSize = "20px";
monBouton.style.backgroundColor = "#333";
```

**L'ajouter à la page :**

```javascript
// À la fin d'un élément parent
document.body.appendChild(monDiv);

// Au début d'un élément parent
document.body.prepend(monDiv);

// Avant un élément spécifique
autreElement.before(monDiv);

// Après un élément spécifique
autreElement.after(monDiv);
```

#### 🧪 Testez dans la console

```javascript
// Créer un bouton rouge
const btn = document.createElement("button");
btn.textContent = "Test";
btn.style.cssText = `
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 10px 20px;
  background: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 9999;
`;
document.body.appendChild(btn);

// Maintenant le bouton apparaît en haut à droite !
```

#### 💡 Astuce pour vos exercices

Pour créer un élément complexe :

```javascript
const horloge = document.createElement("span");
horloge.id = "live-clock";
horloge.textContent = "12:34:56";
horloge.style.cssText = "font-size: 14px; margin-left: 10px;";

const header = document.querySelector(".header-row");
header.appendChild(horloge);
```

---

### 7. Dates et horloges

#### 🎯 Pourquoi ?

Pour afficher l'heure, la date, ou faire des calculs temporels.

#### 🔑 Les clés

**Obtenir la date actuelle :**

```javascript
const maintenant = new Date();
console.log(maintenant); // Date complète
```

**Extraire des parties :**

```javascript
const maintenant = new Date();

const heures = maintenant.getHours(); // 0-23
const minutes = maintenant.getMinutes(); // 0-59
const secondes = maintenant.getSeconds(); // 0-59

const jour = maintenant.getDate(); // 1-31
const mois = maintenant.getMonth(); // 0-11 (0 = janvier)
const annee = maintenant.getFullYear(); // ex: 2025
```

**Formater avec des zéros :**

```javascript
function ajouterZero(nombre) {
  return nombre < 10 ? "0" + nombre : nombre;
}

const heures = 9;
const minutes = 5;
const secondes = 3;

const heureFormatee = `${ajouterZero(heures)}:${ajouterZero(
  minutes
)}:${ajouterZero(secondes)}`;
console.log(heureFormatee); // "09:05:03"
```

#### 🧪 Testez dans la console

```javascript
// Afficher l'heure actuelle
const now = new Date();
const h = now.getHours();
const m = now.getMinutes();
const s = now.getSeconds();

console.log(`Il est ${h}h${m}m${s}s`);
```

#### 💡 Astuce pour vos exercices

Pour une horloge qui se met à jour :

```javascript
function afficherHeure() {
  const now = new Date();
  const h = ajouterZero(now.getHours());
  const m = ajouterZero(now.getMinutes());
  const s = ajouterZero(now.getSeconds());

  return `${h}:${m}:${s}`;
}

console.log(afficherHeure()); // "14:23:08"
```

---

### 8. Répéter des actions (setInterval)

#### 🎯 Pourquoi ?

Pour exécuter du code régulièrement (ex: mettre à jour une horloge toutes les secondes).

#### 🔑 Les clés

**Répéter à intervalle régulier :**

```javascript
// Exécuter toutes les 1000ms (1 seconde)
const intervalId = setInterval(function () {
  console.log("Tic...");
}, 1000);
```

**Arrêter la répétition :**

```javascript
clearInterval(intervalId);
```

**Délai unique (setTimeout) :**

```javascript
// Exécuter UNE SEULE FOIS après 2 secondes
setTimeout(function () {
  console.log("2 secondes écoulées");
}, 2000);
```

#### 🧪 Testez dans la console

```javascript
// Compte à rebours de 5 secondes
let compteur = 5;

const intervalId = setInterval(function () {
  console.log(compteur);
  compteur--;

  if (compteur < 0) {
    clearInterval(intervalId);
    console.log("Terminé !");
  }
}, 1000);
```

#### 💡 Astuce pour vos exercices

Pour une horloge qui se met à jour :

```javascript
function mettreAJourHorloge() {
  const horlogeElement = document.getElementById("horloge");
  const heureActuelle = afficherHeure(); // Fonction vue avant
  horlogeElement.textContent = heureActuelle;
}

// Mettre à jour toutes les secondes
setInterval(mettreAJourHorloge, 1000);

// Mettre à jour immédiatement aussi
mettreAJourHorloge();
```

---

### 9. Copier dans le presse-papier

#### 🎯 Pourquoi ?

Pour permettre à l'utilisateur de copier facilement du texte.

#### 🔑 La clé

**API moderne :**

```javascript
navigator.clipboard
  .writeText("Texte à copier")
  .then(function () {
    console.log("✓ Copié !");
  })
  .catch(function (erreur) {
    console.log("✕ Erreur :", erreur);
  });
```

#### 🧪 Testez dans la console

```javascript
// Copier votre email
const email = "paul@example.com";

navigator.clipboard
  .writeText(email)
  .then(() => alert("Email copié !"))
  .catch(() => alert("Erreur de copie"));

// Maintenant faites Ctrl+V pour vérifier
```

#### 💡 Astuce pour vos exercices

Bouton qui copie et change de texte temporairement :

```javascript
bouton.addEventListener("click", function () {
  const texteOriginal = bouton.textContent;

  navigator.clipboard.writeText("paul@example.com").then(() => {
    bouton.textContent = "✓ Copié !";

    // Revenir au texte original après 2 secondes
    setTimeout(() => {
      bouton.textContent = texteOriginal;
    }, 2000);
  });
});
```

---

### 10. Promises et async

#### 🎯 Pourquoi ?

Certaines actions prennent du temps (copie, chargement...). Les Promises permettent de gérer ça proprement.

#### 🔑 Les clés

**Structure avec .then() :**

```javascript
faireQuelqueChose()
  .then(function (resultat) {
    // Succès
    console.log("Réussi :", resultat);
  })
  .catch(function (erreur) {
    // Échec
    console.log("Échoué :", erreur);
  });
```

**Structure moderne (async/await) :**

```javascript
async function maFonction() {
  try {
    const resultat = await faireQuelqueChose();
    console.log("Réussi :", resultat);
  } catch (erreur) {
    console.log("Échoué :", erreur);
  }
}
```

#### 💡 Astuce pour vos exercices

Pour la plupart des exercices, `.then()/.catch()` suffit largement !

---

## Niveau ⭐⭐⭐ Avancé

### 11. Filtrer et manipuler des listes

#### 🎯 Pourquoi ?

Pour afficher/masquer des éléments selon une condition (ex: recherche).

#### 🔑 Les clés

**Masquer/afficher un élément :**

```javascript
// Méthode 1 : display
element.style.display = "none"; // Masquer
element.style.display = "block"; // Afficher

// Méthode 2 : classe CSS (meilleure pratique)
element.classList.add("hidden");
element.classList.remove("hidden");
```

**Parcourir et filtrer :**

```javascript
const competences = document.querySelectorAll(".item-competence");

competences.forEach(function (competence) {
  const texte = competence.textContent.toLowerCase();
  const recherche = "javascript";

  if (texte.includes(recherche)) {
    competence.style.display = "block"; // Afficher
  } else {
    competence.style.display = "none"; // Masquer
  }
});
```

#### 🧪 Testez dans la console

```javascript
// Sur votre site, masquer toutes les compétences sauf celles avec "dev"
const items = document.querySelectorAll(".item-competence");

items.forEach((item) => {
  const texte = item.textContent.toLowerCase();

  if (texte.includes("dev")) {
    item.style.backgroundColor = "yellow";
  } else {
    item.style.opacity = "0.3";
  }
});
```

#### 💡 Astuce pour vos exercices

Recherche en temps réel :

```javascript
input.addEventListener("input", function (event) {
  const recherche = event.target.value.toLowerCase();

  const items = document.querySelectorAll(".item-competence");

  items.forEach((item) => {
    const texte = item.textContent.toLowerCase();

    if (texte.includes(recherche)) {
      item.classList.remove("hidden");
    } else {
      item.classList.add("hidden");
    }
  });
});
```

---

### 12. LocalStorage (sauvegarder des données)

#### 🎯 Pourquoi ?

Pour que les données persistent même après fermeture du navigateur.

#### 🔑 Les clés

**Sauvegarder :**

```javascript
// Valeur simple
localStorage.setItem("nom", "Paul");
localStorage.setItem("score", "100");

// Tableau/Objet (convertir en JSON)
const favoris = ["html", "css", "javascript"];
localStorage.setItem("favoris", JSON.stringify(favoris));
```

**Récupérer :**

```javascript
// Valeur simple
const nom = localStorage.getItem("nom");
console.log(nom); // "Paul"

// Tableau/Objet (convertir depuis JSON)
const favorisJSON = localStorage.getItem("favoris");
const favoris = favorisJSON ? JSON.parse(favorisJSON) : [];
console.log(favoris); // ['html', 'css', 'javascript']
```

**Supprimer :**

```javascript
// Supprimer une clé
localStorage.removeItem("nom");

// Tout supprimer
localStorage.clear();
```

#### 🧪 Testez dans la console

```javascript
// Sauvegarder un compteur
let visites = localStorage.getItem("visites");
visites = visites ? parseInt(visites) : 0;
visites++;

localStorage.setItem("visites", visites);
console.log(`Visite n°${visites}`);

// Rechargez la page (F5) et retapez ce code : le compteur continue !
```

#### 💡 Astuce pour vos exercices

Pattern sécurisé pour localStorage :

```javascript
// Récupérer avec valeur par défaut
function getFromStorage(key, defaultValue) {
  const saved = localStorage.getItem(key);
  return saved !== null ? JSON.parse(saved) : defaultValue;
}

// Sauvegarder
function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Utilisation
const favoris = getFromStorage("favoris", []);
favoris.push("nouveau");
saveToStorage("favoris", favoris);
```

---

### 13. Variables CSS (custom properties)

#### 🎯 Pourquoi ?

Pour changer des couleurs/tailles définies en CSS depuis JavaScript.

#### 🔑 Les clés

**Lire une variable CSS :**

```javascript
// Variable définie en CSS : --accent-color: #ff5733;
const color = getComputedStyle(document.documentElement).getPropertyValue(
  "--accent-color"
);

console.log(color); // "#ff5733"
```

**Modifier une variable CSS :**

```javascript
document.documentElement.style.setProperty("--accent-color", "#00ff00");
```

#### 🧪 Testez dans la console

```javascript
// Sur votre site, changer la couleur d'accent
document.documentElement.style.setProperty("--accent-color", "#ff00ff");

// Essayez avec différentes couleurs !
```

#### 💡 Astuce pour vos exercices

Color picker connecté au CSS :

```javascript
const picker = document.getElementById("color-picker");

picker.addEventListener("input", function (event) {
  const couleur = event.target.value; // Ex: "#ff5733"

  // Appliquer au CSS
  document.documentElement.style.setProperty("--accent-color", couleur);

  // Sauvegarder
  localStorage.setItem("couleur-preferee", couleur);
});

// Au chargement, restaurer
const couleurSauvee = localStorage.getItem("couleur-preferee");
if (couleurSauvee) {
  document.documentElement.style.setProperty("--accent-color", couleurSauvee);
  picker.value = couleurSauvee;
}
```

---

### 14. Créer des animations

#### 🎯 Pourquoi ?

Pour créer des transitions fluides (notifications, toasts...).

#### 🔑 Les clés

**Avec CSS transitions :**

```javascript
// Créer l'élément
const toast = document.createElement("div");
toast.textContent = "Notification !";
toast.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 25px;
  background: #333;
  color: white;
  border-radius: 8px;
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.3s ease;
`;
document.body.appendChild(toast);

// Animer (après un micro-délai)
requestAnimationFrame(() => {
  toast.style.opacity = "1";
  toast.style.transform = "translateX(0)";
});

// Faire disparaître après 3 secondes
setTimeout(() => {
  toast.style.opacity = "0";
  toast.style.transform = "translateX(100%)";

  // Supprimer après l'animation
  setTimeout(() => toast.remove(), 300);
}, 3000);
```

#### 🧪 Testez dans la console

```javascript
// Créer une notification qui glisse depuis la droite
function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 15px 25px;
    background: #4CAF50;
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    z-index: 10000;
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Tester
showToast("Hello World !");
```

#### 💡 Astuce pour vos exercices

**requestAnimationFrame()** force le navigateur à "voir" le changement avant de démarrer la transition.

---

### 15. Manipuler des tableaux d'objets

#### 🎯 Pourquoi ?

Vos compétences sont stockées dans `window.CV_COMPETENCES` (tableau d'objets). Il faut savoir les manipuler !

#### 🔑 Les clés

**Structure typique :**

```javascript
const competences = [
  { id: "html-css", name: "HTML5/CSS3", periode: "dev" },
  { id: "javascript", name: "JavaScript", periode: "dev" },
  { id: "trading", name: "Trading", periode: "trading" },
];
```

**Filtrer :**

```javascript
// Garder seulement les compétences de période "dev"
const competencesDev = competences.filter(function (comp) {
  return comp.periode === "dev";
});
console.log(competencesDev); // Seulement HTML et JS
```

**Trouver :**

```javascript
// Trouver UNE compétence par son ID
const comp = competences.find(function (c) {
  return c.id === "javascript";
});
console.log(comp); // { id: 'javascript', name: 'JavaScript', ... }
```

**Compter par catégorie (reduce) :**

```javascript
const compteur = competences.reduce(function (acc, comp) {
  const periode = comp.periode;
  acc[periode] = (acc[periode] || 0) + 1;
  return acc;
}, {});

console.log(compteur); // { dev: 2, trading: 1 }
```

**Mapper (transformer) :**

```javascript
// Récupérer juste les noms
const noms = competences.map(function (comp) {
  return comp.name;
});
console.log(noms); // ['HTML5/CSS3', 'JavaScript', 'Trading']
```

#### 🧪 Testez dans la console

```javascript
// Sur votre site, analyser vos compétences
const competences = window.CV_COMPETENCES || [];

console.log("Total :", competences.length);

// Combien par période ?
const parPeriode = competences.reduce((acc, c) => {
  acc[c.periode] = (acc[c.periode] || 0) + 1;
  return acc;
}, {});
console.log("Par période :", parPeriode);

// Lesquelles ont un lien ?
const avecLien = competences.filter((c) => c.link !== null);
console.log("Avec lien :", avecLien.length);
```

#### 💡 Astuce pour vos exercices

Pour afficher les compétences filtrées :

```javascript
const competences = window.CV_COMPETENCES || [];
const recherche = "java";

const resultats = competences.filter((comp) => {
  return (
    comp.name.toLowerCase().includes(recherche) ||
    comp.description.toLowerCase().includes(recherche)
  );
});

console.log(`${resultats.length} résultats pour "${recherche}"`);
resultats.forEach((comp) => console.log("-", comp.name));
```

---

## 🎮 Prêt pour les exercices !

Vous avez maintenant **toutes les clés** pour réussir les exercices de `EXERCICES-PRATIQUES.md` !

### 📋 Méthodologie

1. **Lisez l'exercice** complètement
2. **Identifiez les concepts** nécessaires (relisez les sections correspondantes ici)
3. **Testez les exemples** de ce cours dans la console
4. **Écrivez votre code** petit à petit
5. **Testez souvent** avec `console.log()`
6. **Demandez de l'aide** si vraiment bloqué (sans demander la solution)

### 🎯 Correspondance exercices ↔ concepts

| Exercice                     | Concepts nécessaires |
| ---------------------------- | -------------------- |
| **1. Compteur de clics**     | §1, §2, §3, §4, §5   |
| **2. Horloge en temps réel** | §6, §7, §8           |
| **3. Copier email**          | §3, §9, §10          |
| **4. Filtre compétences**    | §11, §15             |
| **5. Système favoris**       | §12, §15             |
| **6. Color picker**          | §12, §13             |
| **7. Notifications toast**   | §6, §14              |
| **8. Statistiques**          | §6, §15              |
| **9. Historique navigation** | §12                  |
| **10. Mini-jeu**             | Tous les concepts !  |

---

## 💡 Conseils finaux

### ✅ À FAIRE

- Tester chaque ligne de code dans la console
- Utiliser `console.log()` partout
- Commencer simple, ajouter des features progressivement
- Relire les sections de cours si vous bloquez
- Faire des pauses régulières

### ❌ À ÉVITER

- Copier-coller sans comprendre
- Vouloir tout faire parfait du premier coup
- Abandonner au premier bug
- Demander la solution directe

---

## 🚀 Bon courage !

Vous avez **tout ce qu'il faut** pour réussir. N'oubliez pas : la meilleure façon d'apprendre à coder, c'est de **coder** !

**Commencez par l'Exercice 1** et avancez à votre rythme. 💪

_Rappel : Je suis là pour vous guider avec des indices, pas pour donner les réponses directes._
