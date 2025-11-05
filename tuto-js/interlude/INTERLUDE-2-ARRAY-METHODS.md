# 🎓 Interlude 2 : Array Methods Avancés

> **Durée estimée :** 25-30 minutes  
> **Objectif :** Maîtriser les méthodes d'array modernes (map, filter, reduce, etc.)

---

## 🎯 Pourquoi cet interlude ?

Les **array methods** sont le **couteau suisse** du développeur JS moderne. Tu les utiliseras PARTOUT :

- Filtrer des données (recherche, favoris)
- Transformer des données (affichage, formatage)
- Calculer des stats (sommes, moyennes)
- Vérifier des conditions (validation)

**Métaphore :** C'est comme avoir des super-pouvoirs pour manipuler des listes. Au lieu de boucles `for` répétitives, tu utilises des outils spécialisés.

---

## 📖 1. `map()` - Transformer chaque élément

**Concept :** Créer un nouveau array en appliquant une fonction à chaque élément.

### Syntaxe de base

```javascript
const nouveauArray = array.map((element, index, arrayComplet) => {
  return nouvelleValeur;
});
```

### Exemples pratiques

```javascript
// Exemple 1 : Doubler des nombres
const numbers = [1, 2, 3, 4];
const doubled = numbers.map((n) => n * 2);
console.log(doubled); // [2, 4, 6, 8]

// Exemple 2 : Extraire une propriété
const users = [
  { name: "Paul", age: 25 },
  { name: "Marie", age: 30 },
  { name: "Luc", age: 22 },
];
const names = users.map((user) => user.name);
console.log(names); // ["Paul", "Marie", "Luc"]

// Exemple 3 : Créer des éléments HTML
const competences = ["JavaScript", "React", "Node.js"];
const listItems = competences.map((comp) => `<li>${comp}</li>`);
console.log(listItems.join("")); // "<li>JavaScript</li><li>React</li>..."

// Exemple 4 : Avec index
const numbered = ["a", "b", "c"].map(
  (letter, index) => `${index + 1}. ${letter}`
);
console.log(numbered); // ["1. a", "2. b", "3. c"]
```

### ⚠️ Erreurs courantes

```javascript
// ❌ Oublier le return
const doubled = numbers.map((n) => {
  n * 2; // Pas de return → undefined
});
console.log(doubled); // [undefined, undefined, ...]

// ✅ Solution : return explicite ou arrow function courte
const doubled = numbers.map((n) => n * 2); // return implicite
const doubled2 = numbers.map((n) => {
  return n * 2;
}); // return explicite
```

### 🧪 Mini-défi 1 : Utiliser map()

```javascript
// 1. À partir de ce array, crée un array avec les âges + 1 an
const people = [
  { name: "Paul", age: 25 },
  { name: "Marie", age: 30 },
];
// Résultat attendu : [26, 31]

const AgePlusOne = people.map((person) => person.age + 1);

// 2. Transforme les compétences en objets
const skills = ["JavaScript", "React", "CSS"];
// Résultat attendu : [
//   { nom: "JavaScript", niveau: "débutant" },
//   { nom: "React", niveau: "débutant" },
//   ...
// ]

const skillObject = skills.map((comp) => {
  const niveau = "débutant";
  return { nom: comp, level: niveau };
});

const skillsLevel = skills.map((level) => ({ nom: level, level: "débutant" }));

// 3. Ajoute un ID à chaque compétence
const competences = [{ nom: "JavaScript" }, { nom: "React" }];
// Résultat attendu : [
//   { id: 0, nom: "JavaScript" },
//   { id: 1, nom: "React" }
// ]

const compId = competences.map((comp, index) => ({ id: index, nom: comp.nom }));
```

<details>
<summary>✅ Solutions</summary>

```javascript
// 1. Âges + 1
const ages = people.map((person) => person.age + 1);

// 2. Transformer en objets
const skillsObjects = skills.map((skill) => ({
  nom: skill,
  niveau: "débutant",
}));
// Note : () autour de {} pour return implicite d'objet

// 3. Ajouter ID
const withIds = competences.map((comp, index) => ({ id: index, ...comp }));
```

</details>

---

## 📖 2. `filter()` - Garder certains éléments

**Concept :** Créer un nouveau array avec uniquement les éléments qui passent un test.

### Syntaxe de base

```javascript
const filtered = array.filter((element, index, arrayComplet) => {
  return condition; // true pour garder, false pour retirer
});
```

### Exemples pratiques

```javascript
// Exemple 1 : Nombres pairs
const numbers = [1, 2, 3, 4, 5, 6];
const evens = numbers.filter((n) => n % 2 === 0);
console.log(evens); // [2, 4, 6]

// Exemple 2 : Utilisateurs adultes
const users = [
  { name: "Paul", age: 25 },
  { name: "Marie", age: 17 },
  { name: "Luc", age: 30 },
];
const adults = users.filter((user) => user.age >= 18);
console.log(adults); // [{ name: "Paul", age: 25 }, { name: "Luc", age: 30 }]

// Exemple 3 : Recherche par texte
const competences = ["JavaScript", "React", "CSS", "Node.js"];
const searchTerm = "script";
const results = competences.filter((comp) =>
  comp.toLowerCase().includes(searchTerm.toLowerCase())
);
console.log(results); // ["JavaScript"]

// Exemple 4 : Retirer les valeurs falsy
const mixed = [0, 1, false, 2, "", 3, null, 4, undefined];
const truthy = mixed.filter(Boolean); // Astuce : Boolean comme fonction
console.log(truthy); // [1, 2, 3, 4]

// Exemple 5 : Retirer les doublons (avec indexOf)
const withDuplicates = [1, 2, 2, 3, 4, 3, 5];
const unique = withDuplicates.filter(
  (item, index, arr) => arr.indexOf(item) === index
);
console.log(unique); // [1, 2, 3, 4, 5]
```

### 🧪 Mini-défi 2 : Utiliser filter()

```javascript
// 1. Garde uniquement les compétences de la période "dev"
const competences = [
  { nom: "JavaScript", periode: "dev" },
  { nom: "Trading", periode: "trading" },
  { nom: "React", periode: "dev" },
  { nom: "Python", periode: "etudes" },
];

const periodeDev = competences.filter((comp) => comp.periode === "dev");

// 2. Garde les compétences qui ont un lien externe
const skills = [
  { nom: "JavaScript", lien: "https://..." },
  { nom: "CSS", lien: null },
  { nom: "React", lien: "https://..." },
];

const skilllink = skills.filter((skill) => skill.lien !== null);

// 3. Système de recherche : filtre par nom ET catégorie
const data = [
  { nom: "JavaScript", categorie: "Langages" },
  { nom: "React", categorie: "Frameworks" },
  { nom: "Java", categorie: "Langages" },
];
const search = "java";
const category = "Langages";
// Résultat attendu : [{ nom: "JavaScript", categorie: "Langages" }]

const results = data.filter((comp) => {
  const matchSearch = comp.nom.toLowerCase().includes(search.toLowerCase());
  const matchCategory = comp.categorie === category;
  return matchSearch && matchCategory;
});
```

<details>
<summary>✅ Solutions</summary>

```javascript
// 1. Filtrer par période
const devSkills = competences.filter((comp) => comp.periode === "dev");

// 2. Filtrer par lien existant
const withLinks = skills.filter((skill) => skill.lien !== null);
// Ou : skills.filter(skill => skill.lien)

// 3. Recherche multi-critères
const results = data.filter((item) => {
  const matchesSearch = item.nom.toLowerCase().includes(search.toLowerCase());
  const matchesCategory = item.categorie === category;
  return matchesSearch && matchesCategory;
});
```

</details>

---

## 📖 3. `reduce()` - Réduire à une seule valeur

**Concept :** L'outil le plus puissant. Transforme un array en N'IMPORTE QUOI (nombre, objet, array, etc.).

### Syntaxe de base

```javascript
const resultat = array.reduce((accumulateur, element, index, arrayComplet) => {
  // Logique de transformation
  return nouvelAccumulateur;
}, valeurInitiale);
```

### Exemples pratiques

```javascript
// Exemple 1 : Somme de nombres
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((total, n) => total + n, 0);
console.log(sum); // 15

// Explication étape par étape :
// Itération 1 : total=0,  n=1 → return 0+1=1
// Itération 2 : total=1,  n=2 → return 1+2=3
// Itération 3 : total=3,  n=3 → return 3+3=6
// Itération 4 : total=6,  n=4 → return 6+4=10
// Itération 5 : total=10, n=5 → return 10+5=15

// Exemple 2 : Compter les occurrences
const votes = ["oui", "non", "oui", "oui", "non"];
const count = votes.reduce((acc, vote) => {
  acc[vote] = (acc[vote] || 0) + 1;
  return acc;
}, {});
console.log(count); // { oui: 3, non: 2 }

// Exemple 3 : Grouper par catégorie
const competences = [
  { nom: "JavaScript", categorie: "Langages" },
  { nom: "React", categorie: "Frameworks" },
  { nom: "CSS", categorie: "Langages" },
];
const grouped = competences.reduce((acc, comp) => {
  const cat = comp.categorie;
  if (!acc[cat]) acc[cat] = [];
  acc[cat].push(comp);
  return acc;
}, {});
console.log(grouped);
// {
//   Langages: [{ nom: "JavaScript", ... }, { nom: "CSS", ... }],
//   Frameworks: [{ nom: "React", ... }]
// }

// Exemple 4 : Aplatir un array de arrays (flatten)
const nested = [[1, 2], [3, 4], [5]];
const flat = nested.reduce((acc, arr) => acc.concat(arr), []);
console.log(flat); // [1, 2, 3, 4, 5]
// Note : en moderne, utilise array.flat() directement

// Exemple 5 : Construire un objet à partir d'un array
const users = [
  { id: 1, name: "Paul" },
  { id: 2, name: "Marie" },
];
const usersById = users.reduce((acc, user) => {
  acc[user.id] = user;
  return acc;
}, {});
console.log(usersById);
// { 1: { id: 1, name: "Paul" }, 2: { id: 2, name: "Marie" } }
```

### 🧪 Mini-défi 3 : Utiliser reduce()

```javascript
// 1. Calcule le total des âges
const people = [
  { name: "Paul", age: 25 },
  { name: "Marie", age: 30 },
  { name: "Luc", age: 22 },
];

const ageTotal = people.reduce((total, person) => total + person.age, 0);

// 2. Compte les compétences par période
const competences = [
  { nom: "JS", periode: "dev" },
  { nom: "React", periode: "dev" },
  { nom: "Trading", periode: "trading" },
  { nom: "Python", periode: "etudes" },
];
// Résultat attendu : { dev: 2, trading: 1, etudes: 1 }

const periodComp = competences.reduce((acc, comp) => {
  const period = comp.period;
  acc[period] = (acc[period] || 0) + 1;
  return acc;
}, {});

// 3. Crée un index par ID (pour lookup rapide)
const items = [
  { id: "abc", name: "Item 1" },
  { id: "def", name: "Item 2" },
];
// Résultat attendu : { abc: { id: "abc", ... }, def: { id: "def", ... } }

const ItemId = items.reduce((acc, item) => [
  acc[item.id] = item;
  return acc;
], {});

// 4. Trouve le maximum (sans Math.max)
const scores = [45, 78, 12, 95, 34];

const max = scores.reduce(
  (max, score) => (score > max ? score : max),
  scores[0]
);
```

<details>
<summary>✅ Solutions</summary>

```javascript
// 1. Total des âges
const totalAge = people.reduce((sum, person) => sum + person.age, 0);
// Résultat : 77

// 2. Compter par période
const countByPeriod = competences.reduce((acc, comp) => {
  acc[comp.periode] = (acc[comp.periode] || 0) + 1;
  return acc;
}, {});

// 3. Index par ID
const itemsById = items.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

// 4. Maximum
const max = scores.reduce(
  (max, score) => (score > max ? score : max),
  scores[0]
);
// Ou : scores.reduce((max, score) => Math.max(max, score))
```

</details>

---

## 📖 4. Autres méthodes essentielles

### `find()` - Trouver UN élément

```javascript
const users = [
  { id: 1, name: "Paul" },
  { id: 2, name: "Marie" },
  { id: 3, name: "Luc" },
];

// Trouve le premier utilisateur avec id=2
const user = users.find((u) => u.id === 2);
console.log(user); // { id: 2, name: "Marie" }

// Si non trouvé → undefined
const notFound = users.find((u) => u.id === 999);
console.log(notFound); // undefined
```

### `findIndex()` - Trouver l'INDEX d'un élément

```javascript
const index = users.findIndex((u) => u.id === 2);
console.log(index); // 1

// Si non trouvé → -1
const notFoundIndex = users.findIndex((u) => u.id === 999);
console.log(notFoundIndex); // -1
```

### `some()` - Tester si AU MOINS UN élément passe le test

```javascript
const numbers = [1, 2, 3, 4, 5];

// Y a-t-il au moins un nombre > 3 ?
const hasLarge = numbers.some((n) => n > 3);
console.log(hasLarge); // true

// Y a-t-il au moins un nombre > 10 ?
const hasVeryLarge = numbers.some((n) => n > 10);
console.log(hasVeryLarge); // false
```

### `every()` - Tester si TOUS les éléments passent le test

```javascript
const numbers = [2, 4, 6, 8];

// Tous les nombres sont-ils pairs ?
const allEven = numbers.every((n) => n % 2 === 0);
console.log(allEven); // true

// Tous les nombres sont-ils > 5 ?
const allLarge = numbers.every((n) => n > 5);
console.log(allLarge); // false (2 et 4 ne passent pas)
```

### `includes()` - Tester la présence d'une valeur

```javascript
const fruits = ["pomme", "banane", "orange"];

console.log(fruits.includes("banane")); // true
console.log(fruits.includes("kiwi")); // false

// Avec objets : utilise find() ou some()
const users = [{ id: 1 }, { id: 2 }];
const hasUser2 = users.some((u) => u.id === 2); // true
```

### `sort()` - Trier (⚠️ MUTE l'array original)

```javascript
// Nombres (PIÈGE : sort() trie en string par défaut)
const numbers = [10, 5, 40, 25, 1000];
numbers.sort(); // ❌ [10, 1000, 25, 40, 5] (ordre alphabétique !)

// ✅ Correct : comparateur numérique
numbers.sort((a, b) => a - b); // [5, 10, 25, 40, 1000]
numbers.sort((a, b) => b - a); // [1000, 40, 25, 10, 5] (décroissant)

// Strings
const names = ["Paul", "Marie", "Luc", "Anne"];
names.sort(); // ["Anne", "Luc", "Marie", "Paul"]

// Objets
const users = [
  { name: "Paul", age: 25 },
  { name: "Marie", age: 30 },
  { name: "Luc", age: 22 },
];
users.sort((a, b) => a.age - b.age); // Tri par âge croissant

// ⚠️ sort() mute l'array original. Pour éviter :
const sorted = [...users].sort((a, b) => a.age - b.age);
```

---

## 📖 5. Chaînage de méthodes (Method Chaining)

**Le vrai pouvoir** : combiner plusieurs méthodes en une seule ligne.

```javascript
const competences = [
  { nom: "JavaScript", periode: "dev", niveau: 4 },
  { nom: "Trading", periode: "trading", niveau: 3 },
  { nom: "React", periode: "dev", niveau: 5 },
  { nom: "CSS", periode: "dev", niveau: 4 },
  { nom: "Python", periode: "etudes", niveau: 2 },
];

// Exemple 1 : Filtrer puis mapper
const devSkillNames = competences
  .filter((c) => c.periode === "dev")
  .map((c) => c.nom);
console.log(devSkillNames); // ["JavaScript", "React", "CSS"]

// Exemple 2 : Filtrer, trier, mapper
const topDevSkills = competences
  .filter((c) => c.periode === "dev")
  .sort((a, b) => b.niveau - a.niveau)
  .map((c) => c.nom);
console.log(topDevSkills); // ["React", "JavaScript", "CSS"]

// Exemple 3 : Pipeline complet
const avgDevLevel =
  competences
    .filter((c) => c.periode === "dev") // Garder dev
    .map((c) => c.niveau) // Extraire niveaux → [4, 5, 4]
    .reduce((sum, n) => sum + n, 0) / // Somme → 13
  competences.filter((c) => c.periode === "dev").length; // Diviser par count
console.log(avgDevLevel); // 4.33

// Exemple 4 : Transformer et nettoyer
const cleaned = ["  hello  ", "WORLD", "  JavaScript  "]
  .map((s) => s.trim()) // Retirer espaces
  .map((s) => s.toLowerCase()) // Minuscules
  .filter((s) => s.length > 4); // Garder > 4 caractères
console.log(cleaned); // ["hello", "world", "javascript"]
```

### 🧪 Mini-défi 4 : Chaînage de méthodes

```javascript
const products = [
  { name: "Laptop", price: 1000, category: "Electronics", inStock: true },
  { name: "Phone", price: 500, category: "Electronics", inStock: false },
  { name: "Shirt", price: 30, category: "Clothing", inStock: true },
  { name: "Shoes", price: 80, category: "Clothing", inStock: true },
  { name: "Watch", price: 200, category: "Electronics", inStock: true },
];

// 1. Trouve les produits Electronics en stock, triés par prix décroissant
// Résultat : ["Watch", "Laptop"]

const stock = products
  .filter((p) => p.category === "Electronics" && p.inStock)
  .sort((a, b) => b.price - a.price)
  .map((p) => p.name);

// 2. Calcule le prix total des produits Clothing en stock

const PriceTotalClothing = products
  .filter((p) => p.category === "Clothing" && p.inStock)
  .reduce((sum, p) => sum + p.price, 0);

// 3. Crée un objet avec le nombre de produits par catégorie
// Résultat : { Electronics: 3, Clothing: 2 }

const catergoryTotal = products.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {});

// 4. Trouve les 2 produits les moins chers en stock
// Résultat : ["Shirt", "Shoes"]

const lowDuoPriceProduct = products
  .filter((p) => p.inStock)
  .sort((a, b) => a.price - b.price)
  .slice(0, 2)
  .map((p) => p.name);
```

<details>
<summary>✅ Solutions</summary>

```javascript
// 1. Electronics en stock, triés par prix
const electronicsInStock = products
  .filter((p) => p.category === "Electronics" && p.inStock)
  .sort((a, b) => b.price - a.price)
  .map((p) => p.name);
// ["Watch", "Laptop"]

// 2. Prix total Clothing
const totalClothing = products
  .filter((p) => p.category === "Clothing" && p.inStock)
  .reduce((sum, p) => sum + p.price, 0);
// 110

// 3. Nombre par catégorie
const countByCategory = products.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {});
// { Electronics: 3, Clothing: 2 }

// 4. 2 moins chers en stock
const cheapest = products
  .filter((p) => p.inStock)
  .sort((a, b) => a.price - b.price)
  .slice(0, 2)
  .map((p) => p.name);
// ["Shirt", "Shoes"]
```

</details>

---

## ✅ Quiz de validation

```javascript
// Question 1 : Que retourne ce code ?
[1, 2, 3].map((n) => n * 2).filter((n) => n > 3);

// [4, 6]

// Question 2 : Que retourne ce code ?
[1, 2, 3, 4, 5].reduce((acc, n) => acc + n, 10);

// 25

// Question 3 : Que retourne ce code ?
[{ id: 1 }, { id: 2 }].find((item) => item.id === 3);

// undefined ?

// Question 4 : Que retourne ce code ?
[1, 2, 3].some((n) => n > 2);

// true

// Question 5 : Corrige ce code (il trie mal les nombres)
const numbers = [10, 5, 40, 25];
numbers.sort();

numbers.sort((a, b) => a - b);

// Question 6 : Simplifie avec chaînage
const users = [
  { name: "Paul", age: 25 },
  { name: "Marie", age: 17 },
  { name: "Luc", age: 30 },
];
const adults = [];
for (let user of users) {
  if (user.age >= 18) {
    adults.push(user.name);
  }
}

const adults = users.filer((user) => user.age >= 18).map((u) => u.name);
```

<details>
<summary>✅ Réponses</summary>

```javascript
// Q1 : [4, 6] (map → [2,4,6], filter → [4,6])

// Q2 : 25 (10 + 1 + 2 + 3 + 4 + 5)

// Q3 : undefined (aucun item avec id=3)

// Q4 : true (3 > 2)

// Q5 :
numbers.sort((a, b) => a - b); // [5, 10, 25, 40]

// Q6 :
const adults = users.filter((u) => u.age >= 18).map((u) => u.name);
// ["Paul", "Luc"]
```

</details>

---

## 🎁 Cas d'usage réels dans TON projet

### 1. Filtrer les compétences (exercice 4)

```javascript
// Au lieu de :
const results = [];
for (let comp of window.CV_COMPETENCES) {
  if (comp.nom.toLowerCase().includes(query.toLowerCase())) {
    results.push(comp);
  }
}

// Utilise :
const results = window.CV_COMPETENCES.filter((comp) =>
  comp.nom.toLowerCase().includes(query.toLowerCase())
);
```

### 2. Grouper par période (exercice 8)

```javascript
const competencesByPeriod = window.CV_COMPETENCES.reduce((acc, comp) => {
  const periode = comp.periode;
  if (!acc[periode]) acc[periode] = [];
  acc[periode].push(comp);
  return acc;
}, {});
```

### 3. Statistiques (exercice 8)

```javascript
// Nombre de compétences par catégorie
const countByCategory = window.CV_COMPETENCES.reduce((acc, comp) => {
  acc[comp.categorie] = (acc[comp.categorie] || 0) + 1;
  return acc;
}, {});

// Pourcentage de compétences avec liens
const total = window.CV_COMPETENCES.length;
const withLinks = window.CV_COMPETENCES.filter((c) => c.lien).length;
const percentage = (withLinks / total) * 100;
```

---

## 🎯 Ce que tu as appris

✅ `map()` : Transformer chaque élément  
✅ `filter()` : Garder certains éléments  
✅ `reduce()` : Réduire à une valeur (le plus puissant)  
✅ `find()` / `findIndex()` : Chercher un élément  
✅ `some()` / `every()` : Tester des conditions  
✅ `sort()` : Trier (attention aux nombres)  
✅ **Chaînage** : Combiner plusieurs méthodes

**Tu es maintenant prêt pour l'exercice 4 (filtres + debounce) !** 🚀

Ces méthodes seront utilisées dans TOUS les exercices suivants. Garde cette page sous la main !
