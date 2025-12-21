# 🎓 Interlude 5 : Map, Set & Immutabilité

> **Durée estimée :** 25-30 minutes  
> **Objectif :** Maîtriser les structures de données modernes et éviter les mutations

---

## 🎯 Pourquoi cet interlude ?

Jusqu'à maintenant, tu as utilisé des **objets** (`{}`) et des **arrays** (`[]`) pour tout. Mais JavaScript offre des structures de données plus adaptées à certains cas :

- **Map** : Objet amélioré avec clés de n'importe quel type
- **Set** : Liste de valeurs uniques (sans doublons)
- **WeakMap / WeakSet** : Versions "garbage-collectable"

**Pourquoi c'est important :**

- **Performance** : Map.get() est O(1) garanti
- **Clarté** : Le code exprime mieux l'intention
- **Immutabilité** : Éviter les bugs de mutation

**Métaphore :** C'est comme avoir des conteneurs spécialisés :

- Array = étagère (ordre important)
- Set = sac à main (pas de doublons)
- Map = dictionnaire (recherche rapide par clé)

---

## 📖 1. Set - Liste de valeurs uniques

### Créer un Set

```javascript
// Depuis un array
const numbers = new Set([1, 2, 3, 2, 1]); // Set { 1, 2, 3 }

// Vide puis ajouter
const fruits = new Set();
fruits.add("pomme");
fruits.add("banane");
fruits.add("pomme"); // Ignoré (déjà présent)
console.log(fruits); // Set { "pomme", "banane" }
```

### Opérations de base

```javascript
const set = new Set([1, 2, 3]);

// Ajouter
set.add(4); // Set { 1, 2, 3, 4 }

// Vérifier la présence
console.log(set.has(2)); // true
console.log(set.has(5)); // false

// Supprimer
set.delete(2); // Set { 1, 3, 4 }

// Taille
console.log(set.size); // 3

// Vider
set.clear(); // Set {}

// Itérer
const colors = new Set(["red", "green", "blue"]);
colors.forEach((color) => console.log(color));
// Ou avec for...of
for (const color of colors) {
  console.log(color);
}

// Convertir en array
const arr = [...colors]; // ["red", "green", "blue"]
const arr2 = Array.from(colors); // Équivalent
```

### Cas d'usage : Retirer les doublons

```javascript
// AVANT (avec filter + indexOf)
const numbers = [1, 2, 2, 3, 4, 3, 5];
const unique = numbers.filter((n, index, arr) => arr.indexOf(n) === index);

// APRÈS (avec Set)
const unique = [...new Set(numbers)];
console.log(unique); // [1, 2, 3, 4, 5]
```

### Cas d'usage : Vérifier l'existence rapidement

```javascript
// AVANT (avec Array.includes - O(n))
const validIds = [1, 2, 3, 4, 5];
function isValid(id) {
  return validIds.includes(id); // Parcourt le tableau
}

// APRÈS (avec Set - O(1))
const validIds = new Set([1, 2, 3, 4, 5]);
function isValid(id) {
  return validIds.has(id); // Lookup instantané
}
```

### 🧪 Mini-défi 1 : Utiliser Set

```javascript
// 1. Crée une fonction qui retourne les éléments uniques de 2 arrays combinés
function union(arr1, arr2) {
  // TON CODE
  return [...new Set([...arr1, ...arr2])];
  // Exemple : union([1,2,3], [3,4,5]) → [1,2,3,4,5]
}

// 2. Crée une fonction qui retourne les éléments communs à 2 arrays
function intersection(arr1, arr2) {
  // TON CODE
  const set1 = new Set(arr1);
  return arr2.filter((item) => set1.has(item));
  // Exemple : intersection([1,2,3], [2,3,4]) → [2,3]
}

// 3. Créer un système de favoris avec Set
class FavoritesManager {
  constructor() {
    this.favorites = new Set();
  }

  toggle(id) {
    // Si présent → retirer, sinon → ajouter
    return this.favorites.has(id)
      ? this.favorites.delete(id)
      : this.favorites.add(id);
  }

  has(id) {
    return this.favorites.has(id);
    // Vérifier si l'id est dans les favoris
  }

  getAll() {
    return [...this.favorites];
    // Retourner un array de tous les favoris
  }
}
```

<details>
<summary>✅ Solutions</summary>

```javascript
// 1. Union
function union(arr1, arr2) {
  return [...new Set([...arr1, ...arr2])];
}

// 2. Intersection
function intersection(arr1, arr2) {
  const set = new Set(arr2);
  return arr1.filter((item) => set.has(item));
  // Ou : return [...new Set(arr1.filter(item => arr2.includes(item)))];
}

// 3. Favoris
class FavoritesManager {
  constructor() {
    this.favorites = new Set();
  }

  toggle(id) {
    if (this.favorites.has(id)) {
      this.favorites.delete(id);
    } else {
      this.favorites.add(id);
    }
  }

  has(id) {
    return this.favorites.has(id);
  }

  getAll() {
    return [...this.favorites];
  }
}
```

</details>

---

## 📖 2. Map - Dictionnaire clé-valeur

### Différence avec les objets

| Feature              | Object `{}`       | Map             |
| -------------------- | ----------------- | --------------- |
| Clés autorisées      | String, Symbol    | N'importe quoi  |
| Ordre garanti        | ❌ (avant ES2015) | ✅ Oui          |
| Taille               | Manuel            | `map.size`      |
| Itération            | `Object.keys()`   | `map.forEach()` |
| Performance (lookup) | Bon               | Meilleur        |
| JSON sérialisable    | ✅ Oui            | ❌ Non (manuel) |

### Créer une Map

```javascript
// Vide
const map = new Map();

// Depuis un array de paires [clé, valeur]
const map = new Map([
  ["name", "Paul"],
  ["age", 25],
  [1, "one"], // Clé numérique
]);

// Ajouter
map.set("city", "Paris");
```

### Opérations de base

```javascript
const users = new Map();

// Ajouter (set)
users.set(1, { name: "Paul", age: 25 });
users.set(2, { name: "Marie", age: 30 });

// Chaînage
users.set(3, { name: "Luc", age: 22 }).set(4, { name: "Anne", age: 28 });

// Récupérer (get)
console.log(users.get(1)); // { name: "Paul", age: 25 }
console.log(users.get(999)); // undefined

// Vérifier
console.log(users.has(2)); // true

// Supprimer
users.delete(2);

// Taille
console.log(users.size); // 3

// Vider
users.clear();

// Itérer
const scores = new Map([
  ["Paul", 100],
  ["Marie", 95],
  ["Luc", 88],
]);

// Méthode 1 : forEach
scores.forEach((score, name) => {
  console.log(`${name}: ${score}`);
});

// Méthode 2 : for...of avec [key, value]
for (const [name, score] of scores) {
  console.log(`${name}: ${score}`);
}

// Méthode 3 : keys(), values(), entries()
console.log([...scores.keys()]); // ["Paul", "Marie", "Luc"]
console.log([...scores.values()]); // [100, 95, 88]
console.log([...scores.entries()]); // [["Paul", 100], ...]
```

### Clés de n'importe quel type

```javascript
const map = new Map();

// Clés objets
const user1 = { id: 1 };
const user2 = { id: 2 };
map.set(user1, "Paul");
map.set(user2, "Marie");
console.log(map.get(user1)); // "Paul"

// Clés functions
const func1 = () => {};
const func2 = () => {};
map.set(func1, "Function 1");
map.set(func2, "Function 2");

// Clés DOM elements
const button = document.querySelector("button");
map.set(button, { clicks: 0 });
```

### Cas d'usage : Index par ID

```javascript
// AVANT (avec reduce pour créer un objet)
const users = [
  { id: 1, name: "Paul" },
  { id: 2, name: "Marie" },
];
const usersById = users.reduce((acc, user) => {
  acc[user.id] = user;
  return acc;
}, {});

// APRÈS (avec Map)
const usersById = new Map(users.map((u) => [u.id, u]));
console.log(usersById.get(1)); // { id: 1, name: "Paul" }
```

### Cas d'usage : Cache / Memoization

```javascript
const cache = new Map();

function expensiveCalculation(n) {
  if (cache.has(n)) {
    console.log("Cache hit!");
    return cache.get(n);
  }

  console.log("Calculating...");
  const result = n * n; // Calcul complexe
  cache.set(n, result);
  return result;
}

expensiveCalculation(5); // "Calculating..." → 25
expensiveCalculation(5); // "Cache hit!" → 25
```

### 🧪 Mini-défi 2 : Utiliser Map

```javascript
// 1. Créer un compteur de mots
function wordCount(text) {
  // Utilise une Map pour compter chaque mot
  const words = text.toLowerCase().split(" ");
  const countMap = new Map();
  for (const word of words) {
    countMap.set(word, (countMap.get(word) || 0) + 1);
  }
  return countMap;
}

// 2. Grouper des items par catégorie (avec Map)
const items = [
  { name: "JS", category: "Langages" },
  { name: "React", category: "Frameworks" },
  { name: "CSS", category: "Langages" },
];
// Résultat : Map {
//   "Langages" => [{ name: "JS", ... }, { name: "CSS", ... }],
//   "Frameworks" => [{ name: "React", ... }]
// }
function groupByCategory(items) {
  const categoryMap = new Map();
  for (const item of items) {
    const category = item.category;
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category).push(item);
  }
  return categoryMap;
}

// 3. Créer un index bidirectionnel (id → user et email → user)
class UserIndex {
  constructor() {
    this.byId = new Map();
    this.byEmail = new Map();
  }

  add(user) {
    this.byId.set(user.id, user);
    this.byEmail.set(user.email, user);
  }

  getById(id) {
    // Récupérer par ID
    return this.byId.get(id);
  }

  getByEmail(email) {
    // Récupérer par email
    return this.byEmail.get(email);
  }
}
```

<details>
<summary>✅ Solutions</summary>

```javascript
// 1. Word count
function wordCount(text) {
  const words = text.toLowerCase().split(" ");
  const count = new Map();

  for (const word of words) {
    count.set(word, (count.get(word) || 0) + 1);
  }

  return count;
}

// 2. Grouper par catégorie
function groupByCategory(items) {
  const grouped = new Map();

  for (const item of items) {
    const cat = item.category;
    if (!grouped.has(cat)) {
      grouped.set(cat, []);
    }
    grouped.get(cat).push(item);
  }

  return grouped;
}

// 3. Index bidirectionnel
class UserIndex {
  constructor() {
    this.byId = new Map();
    this.byEmail = new Map();
  }

  add(user) {
    this.byId.set(user.id, user);
    this.byEmail.set(user.email, user);
  }

  getById(id) {
    return this.byId.get(id);
  }

  getByEmail(email) {
    return this.byEmail.get(email);
  }
}
```

</details>

---

## 📖 3. WeakMap et WeakSet

### Différence avec Map/Set

**WeakMap/WeakSet** permettent au **garbage collector** de nettoyer les clés/valeurs quand elles ne sont plus utilisées ailleurs.

```javascript
// Map normale : empêche le garbage collection
let obj = { data: "important" };
const map = new Map();
map.set(obj, "value");
obj = null; // L'objet reste en mémoire (référencé par map)

// WeakMap : permet le garbage collection
let obj2 = { data: "important" };
const weakMap = new WeakMap();
weakMap.set(obj2, "value");
obj2 = null; // L'objet peut être nettoyé (pas de référence forte)
```

### Limitations de WeakMap/WeakSet

- **Clés objets uniquement** (pas de primitives)
- **Pas itérable** (pas de `.forEach()`, `.keys()`, etc.)
- **Pas de `.size`**

### Cas d'usage : Données privées

```javascript
// Stocker des données privées pour des objets DOM
const privateData = new WeakMap();

class Widget {
  constructor(element) {
    this.element = element;
    // Données privées attachées à l'élément
    privateData.set(element, {
      clicks: 0,
      lastClick: null,
    });
  }

  onClick() {
    const data = privateData.get(this.element);
    data.clicks++;
    data.lastClick = Date.now();
  }

  getClicks() {
    return privateData.get(this.element).clicks;
  }
}

// Quand l'élément est retiré du DOM, les données sont automatiquement nettoyées
```

---

## 📖 4. Immutabilité - Éviter les mutations

### Le problème des mutations

```javascript
// ❌ Mutation d'objet
const user = { name: "Paul", age: 25 };
user.age = 26; // Mutation directe

// ❌ Mutation d'array
const numbers = [1, 2, 3];
numbers.push(4); // Mutation directe

// Problème : d'autres parties du code peuvent être affectées
const originalUser = user;
user.age = 30;
console.log(originalUser.age); // 30 (surprise !)
```

### Immutabilité avec spread

```javascript
// ✅ Copier et modifier
const user = { name: "Paul", age: 25 };
const updatedUser = { ...user, age: 26 };
console.log(user.age); // 25 (non affecté)
console.log(updatedUser.age); // 26

// ✅ Ajouter à un array sans mutation
const numbers = [1, 2, 3];
const newNumbers = [...numbers, 4];
console.log(numbers); // [1, 2, 3]
console.log(newNumbers); // [1, 2, 3, 4]

// ✅ Retirer d'un array sans mutation
const removed = numbers.filter((n) => n !== 2);
console.log(numbers); // [1, 2, 3]
console.log(removed); // [1, 3]
```

### Immutabilité avec Object.freeze()

```javascript
const config = Object.freeze({
  apiUrl: "https://api.example.com",
  timeout: 5000,
});

config.timeout = 10000; // ❌ Ignoré en mode strict, erreur en mode strict
console.log(config.timeout); // 5000
```

**Attention : freeze() est shallow (superficiel)**

```javascript
const user = Object.freeze({
  name: "Paul",
  address: { city: "Paris" },
});

user.name = "Marie"; // ❌ Bloqué
user.address.city = "Lyon"; // ✅ Autorisé (objet nested non frozen)

// Solution : deep freeze (récursif)
function deepFreeze(obj) {
  Object.freeze(obj);
  Object.values(obj).forEach((value) => {
    if (typeof value === "object" && value !== null) {
      deepFreeze(value);
    }
  });
  return obj;
}
```

### Méthodes immutables vs mutables

```javascript
// ❌ Mutables (modifient l'array original)
const arr = [1, 2, 3];
arr.push(4); // [1, 2, 3, 4]
arr.pop(); // [1, 2, 3]
arr.shift(); // [2, 3]
arr.unshift(0); // [0, 2, 3]
arr.splice(1, 1); // [0, 3]
arr.reverse(); // [3, 0]
arr.sort(); // [0, 3]

// ✅ Immutables (retournent un nouveau array)
const arr = [1, 2, 3];
const added = [...arr, 4]; // [1, 2, 3, 4]
const removed = arr.slice(0, -1); // [1, 2]
const mapped = arr.map((n) => n * 2); // [2, 4, 6]
const filtered = arr.filter((n) => n > 1); // [2, 3]
const reversed = [...arr].reverse(); // [3, 2, 1] (copie puis reverse)
```

### 🧪 Mini-défi 3 : Immutabilité

```javascript
// 1. Ajouter une propriété à un objet SANS le muter
const user = { name: "Paul", age: 25 };
// Crée newUser avec { name: "Paul", age: 25, city: "Paris" }
const newUser = { ...user, city: "Paris" };

// 2. Retirer une propriété d'un objet SANS le muter
const product = { id: 1, name: "Laptop", price: 1000 };
// Crée productWithoutPrice sans la propriété price
const { price, ...productWithoutPrice } = product;

// 3. Mettre à jour un élément dans un array SANS le muter
const users = [
  { id: 1, name: "Paul" },
  { id: 2, name: "Marie" },
  { id: 3, name: "Luc" },
];
// Change le nom de l'utilisateur id=2 en "Maria"
const updatedUsers = users.map((u) =>
  u.id === 2 ? { ...u, name: "Maria" } : u
);

// 4. Toggle un élément dans un array (ajouter si absent, retirer si présent)
function toggleInArray(arr, item) {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}
console.log(toggleInArray([1, 2, 3], 2)); // [1, 3]
console.log(toggleInArray([1, 2, 3], 4)); // [1, 2, 3, 4]
```

<details>
<summary>✅ Solutions</summary>

```javascript
// 1. Ajouter une propriété
const newUser = { ...user, city: "Paris" };

// 2. Retirer une propriété
const { price, ...productWithoutPrice } = product;
// Ou : const productWithoutPrice = { id: product.id, name: product.name };

// 3. Mettre à jour un élément
const updatedUsers = users.map((u) =>
  u.id === 2 ? { ...u, name: "Maria" } : u
);

// 4. Toggle
function toggleInArray(arr, item) {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}
```

</details>

---

## 🎁 Cas d'usage réels dans TON projet

### 1. Favoris avec Set (exercice 5)

```javascript
class FavoritesManager {
  constructor() {
    this.favorites = new Set();
    this.loadFromStorage();
  }

  toggle(id) {
    if (this.favorites.has(id)) {
      this.favorites.delete(id);
    } else {
      this.favorites.add(id);
    }
    this.saveToStorage();
  }

  has(id) {
    return this.favorites.has(id);
  }

  saveToStorage() {
    localStorage.setItem("favorites", JSON.stringify([...this.favorites]));
  }

  loadFromStorage() {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      this.favorites = new Set(JSON.parse(saved));
    }
  }
}
```

### 2. Index de compétences par ID (exercice 8)

```javascript
// Créer un index pour lookup O(1)
const competencesById = new Map(
  window.CV_COMPETENCES.map((comp) => [comp.id, comp])
);

// Utiliser
function getCompetence(id) {
  return competencesById.get(id); // Instantané
}
```

### 3. Cache de résultats de recherche

```javascript
class SearchCache {
  constructor(maxSize = 50) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(query) {
    return this.cache.get(query);
  }

  set(query, results) {
    // Si trop grand, retirer le plus ancien (FIFO)
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(query, results);
  }

  has(query) {
    return this.cache.has(query);
  }
}
```

### 4. Retirer les doublons de compétences

```javascript
// Si CV_COMPETENCES a des doublons
const uniqueCompetences = [...new Set(window.CV_COMPETENCES.map((c) => c.nom))];
```

---

## ✅ Quiz de validation

```javascript
// Question 1 : Quelle est la différence entre Set et Array ?
// un set ne contient que des valeurs uniques, pas d'index

// Question 2 : Quelle est la taille de ce Set ?
const set = new Set([1, 2, 2, 3, 3, 3]);
// 1 2 3 => 3

// Question 3 : Que retourne ce code ?
const map = new Map([
  [1, "a"],
  [2, "b"],
]);
console.log(map.get(2));
// b

// Question 4 : Ce code mute-t-il l'objet original ?
const obj = { a: 1 };
const newObj = { ...obj, b: 2 };
console.log(obj);
// Non, { a: 1 } (obj n'est pas muté)

// Question 5 : Comment convertir un Set en Array ?
const mySet = new Set([1, 2, 3]);
// [...set] ou Array.from(set)

// Question 6 : Quel est l'avantage de WeakMap sur Map ?
// WeakMap permet au garbage collector de nettoyer les clés malgré leur présence dans la map mais ne permet pas l'itération ni la connaissance de la taille. il est donc utile pour stocker des données privées associées à des objets sans empêcher leur collecte par le garbage collector.

// Question 7 : Corrige ce code pour éviter la mutation
const numbers = [1, 2, 3];
const newNumbers = [...numbers, 4];
console.log(newNumbers); // Ne doit pas être muté
```

<details>
<summary>✅ Réponses</summary>

```javascript
// Q1 : Set ne contient que des valeurs uniques, pas d'index

// Q2 : 3 (les doublons sont ignorés)

// Q3 : "b"

// Q4 : Non, { a: 1 } (obj n'est pas muté)

// Q5 : [...set] ou Array.from(set)

// Q6 : WeakMap permet au garbage collector de nettoyer les clés

// Q7 :
const numbers = [1, 2, 3];
const newNumbers = [...numbers, 4];
console.log(newNumbers); // [1, 2, 3, 4]
```

</details>

---

## 🎯 Résumé : Quand utiliser quoi ?

| Besoin                       | Structure       | Raison                         |
| ---------------------------- | --------------- | ------------------------------ |
| Liste de valeurs uniques     | **Set**         | Pas de doublons automatique    |
| Lookup rapide (existe ?)     | **Set**         | `.has()` est O(1)              |
| Dictionnaire clé-valeur      | **Map**         | Clés de n'importe quel type    |
| Index par ID                 | **Map**         | `.get(id)` est O(1)            |
| Cache                        | **Map**         | Facile à itérer, `.size`       |
| Données privées d'objets DOM | **WeakMap**     | Garbage collection automatique |
| Liste ordonnée               | **Array**       | Ordre important                |
| Objet simple                 | **Object `{}`** | JSON sérialisable              |

pourquoi on utilise plus souvent array et objet ? :

- Array est simple et intuitif pour les listes ordonnées
- Objet est facile à utiliser pour des structures simples et sérialisables en JSON
- il faudrait cependant privilégier Set et Map quand les besoins spécifiques se présentent (unicité, performance, clarté)

---

## 🎯 Ce que tu as appris

✅ **Set** : Valeurs uniques, lookup O(1)  
✅ **Map** : Dictionnaire performant  
✅ **WeakMap/WeakSet** : Garbage collection friendly  
✅ **Immutabilité** : Éviter les mutations  
✅ **Spread operator** : Copier et modifier  
✅ **Object.freeze()** : Bloquer les modifications

**Tu es maintenant prêt pour l'exercice 9 (navigation history) !** 🚀

Ces concepts te rendront plus performant et éviteront des bugs de mutation !
