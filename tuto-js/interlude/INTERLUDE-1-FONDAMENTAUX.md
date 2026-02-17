# 🎓 Interlude 1 : Fondamentaux JavaScript Modernes

> **Durée estimée :** 20-25 minutes  
> **Objectif :** Formaliser les bases du langage que tu utilises déjà

---

## 🎯 Pourquoi cet interlude ?

Tu as déjà écrit du JS dans les exercices 1-3, mais sans formaliser les concepts. Résultat ? Tu "devines" parfois au lieu de "savoir".

**Ce qu'on va clarifier :**

- Pourquoi `let` vs `const` (et oublier `var`)
- Les types de données et leurs pièges
- `==` vs `===` (l'erreur classique)
- Destructuring et spread (syntaxes modernes)

**Métaphore :** C'est comme conduire sans connaître le code de la route. Ça marche... jusqu'au jour où ça casse.

---

## 📖 1. Types de données en JavaScript

### Les 7 types primitifs

```javascript
// 1. String (texte)
const nom = "Paul";
const email = "paul@email.com";
const message = `Bonjour ${nom}`; // Template literals (ES6)

// 2. Number (nombre)
const age = 25;
const prix = 19.99;
const infini = Infinity;
const pasUnNombre = NaN; // "Not a Number" (mais c'est un Number !)

// 3. Boolean (vrai/faux)
const isLoggedIn = true;
const hasErrors = false;

// 4. Undefined (non défini)
let variable; // undefined
console.log(variable); // undefined

// 5. Null (intentionnellement vide)
let user = null; // "il n'y a pas d'utilisateur"

// 6. Symbol (identifiant unique - rare)
const id = Symbol("id");

// 7. BigInt (nombres très grands - rare)
const bigNumber = 9007199254740991n;
```

### Le type complexe : Object

```javascript
// Tout ce qui n'est pas primitif est un objet
const person = { name: "Paul" }; // Object
const numbers = [1, 2, 3]; // Array (objet spécial)
const func = () => {}; // Function (objet spécial)
const date = new Date(); // Object
```

### 🧪 Mini-défi 1 : Deviner les types

```javascript
// Quel est le type de chacune de ces valeurs ?
typeof "Hello"; // string
typeof 42; // number
typeof true; // boolean
typeof undefined; // undefined
typeof null; // object
typeof {}; // array object
typeof []; // object
typeof (() => {}); // function
```

<details>
<summary>✅ Réponses</summary>

```javascript
typeof "Hello"; // "string"
typeof 42; // "number"
typeof true; // "boolean"
typeof undefined; // "undefined"
typeof null; // "object" ⚠️ BUG HISTORIQUE DE JS !
typeof {}; // "object"
typeof []; // "object" ⚠️ Pour tester un array : Array.isArray([])
typeof (() => {}); // "function"
```

</details>

---

## 📖 2. Truthy et Falsy (les pièges de `if`)

En JavaScript, TOUT a une valeur "booléenne implicite".

### Les 8 valeurs FALSY (considérées comme `false`)

```javascript
if (false) // ❌ faux
if (0) // ❌ faux
if (-0) // ❌ faux
if (0n) // ❌ faux (BigInt zero)
if ("") // ❌ faux (string vide)
if (null) // ❌ faux
if (undefined) // ❌ faux
if (NaN) // ❌ faux

// Exemple pratique
const count = 0;
if (count) {
  console.log("Ceci ne s'affiche PAS"); // 0 est falsy
}
```

### Tout le reste est TRUTHY

```javascript
if (true) // ✅ vrai
if (1) // ✅ vrai
if (-1) // ✅ vrai
if ("Hello") // ✅ vrai
if ("0") // ✅ vrai (string non vide !)
if ([]) // ✅ vrai (array vide !)
if ({}) // ✅ vrai (objet vide !)
if (function() {}) // ✅ vrai

// PIÈGE CLASSIQUE
const items = [];
if (items) {
  console.log("Un array vide est truthy !"); // ✅ Ceci s'affiche
}

// CORRECT : tester la longueur
if (items.length > 0) {
  console.log("Il y a des items");
}
```

### 🧪 Mini-défi 2 : Prédire le résultat

```javascript
// Que affichent ces conditions ?
if (0) console.log("A"); // falsy
if ("") console.log("B"); // falsy
if ([]) console.log("C"); // truthy
if ({}) console.log("D"); // truthy
if (null) console.log("E"); // falsy
if (undefined) console.log("F"); // falsy

// Cas pratiques
const user = null;
if (user) {
  console.log("User connecté"); // S'affiche pas
}

const count = 0;
if (count) {
  console.log(`${count} clics`); // S'affiche pas
}
```

<details>
<summary>✅ Réponses</summary>

```javascript
// Seuls C et D s'affichent ([] et {} sont truthy)
if (0) console.log("A"); // ❌ ne s'affiche pas
if ("") console.log("B"); // ❌ ne s'affiche pas
if ([]) console.log("C"); // ✅ s'affiche
if ({}) console.log("D"); // ✅ s'affiche
if (null) console.log("E"); // ❌ ne s'affiche pas
if (undefined) console.log("F"); // ❌ ne s'affiche pas

// user est null → falsy → ne s'affiche pas
// count est 0 → falsy → ne s'affiche pas
```

</details>

---

## 📖 3. `==` vs `===` (L'ERREUR À NE JAMAIS FAIRE)

### `==` (égalité faible - ÉVITER)

JavaScript essaie de convertir les types avant de comparer.

```javascript
// Comparaisons WTF avec ==
5 == "5"; // true ⚠️ (convertit "5" en nombre)
0 == false; // true ⚠️ (convertit false en 0)
"" == false; // true ⚠️ (convertit "" en false)
null == undefined; // true ⚠️ (cas spécial)
[] == false; // true ⚠️ ([] converti en "")

// BUGS RÉELS
const input = "0"; // input HTML
if (input == false) {
  console.log("IMPOSSIBLE : '0' == false est TRUE !"); // ✅ S'affiche !
}
```

### `===` (égalité stricte - TOUJOURS UTILISER)

Compare la valeur ET le type.

```javascript
// Comparaisons saines avec ===
5 === "5"; // false ✅ (types différents)
0 === false; // false ✅
"" === false; // false ✅
null === undefined; // false ✅
[] === false; // false ✅

// CORRECT
const input = "0";
if (input === "0") {
  console.log("Validation claire"); // ✅
}
```

### Même règle pour `!=` vs `!==`

```javascript
// Éviter !=
5 != "5"; // false ⚠️

// Utiliser !==
5 !== "5"; // true ✅
```

### 🧪 Mini-défi 3 : Corriger le code

```javascript
// Ce code a des bugs. Trouve-les et corrige avec ===
function validateForm(input) {
  if (input === "") {
    return "Champ vide";
  }
  if (input === 0) {
    return "Valeur nulle";
  }
  return "OK";
}

// Test
console.log(validateForm("")); // "Champ vide" ✅
console.log(validateForm(0)); // "Valeur nulle" ✅
console.log(validateForm("0")); // ? (PIÈGE !)
```

<details>
<summary>✅ Solution</summary>

```javascript
// Problème : "0" == 0 est true avec ==
// Solution : utiliser ===
function validateForm(input) {
  if (input === "") {
    return "Champ vide";
  }
  if (input === 0) {
    return "Valeur nulle";
  }
  return "OK";
}

// Maintenant
console.log(validateForm("0")); // "OK" ✅ (pas confondu avec 0)
```

</details>

---

## 📖 4. Destructuring (décomposer les structures)

### Destructuring d'objets

```javascript
// AVANT (répétitif)
const user = { name: "Paul", age: 25, email: "paul@email.com" };
const name = user.name;
const age = user.age;
const email = user.email;

// APRÈS (destructuring)
const { name, age, email } = user;
console.log(name); // "Paul"

// Renommer les variables
const { name: userName, age: userAge } = user;
console.log(userName); // "Paul"

// Valeurs par défaut
const { name, role = "user" } = user;
console.log(role); // "user" (car role n'existe pas dans user)

// Destructuring dans les paramètres de fonction
function greet({ name, age }) {
  console.log(`Bonjour ${name}, tu as ${age} ans`);
}
greet(user); // "Bonjour Paul, tu as 25 ans"
```

### Destructuring d'arrays

```javascript
// AVANT
const colors = ["red", "green", "blue"];
const first = colors[0];
const second = colors[1];

// APRÈS
const [first, second, third] = colors;
console.log(first); // "red"

// Ignorer des éléments
const [, , third] = colors;
console.log(third); // "blue"

// Avec rest operator
const [first, ...others] = colors;
console.log(first); // "red"
console.log(others); // ["green", "blue"]

// Swap de variables (astuce)
let a = 1;
let b = 2;
[a, b] = [b, a]; // swap !
console.log(a, b); // 2, 1
```

### 🧪 Mini-défi 4 : Refactorer avec destructuring

```javascript
// Refactore ce code avec destructuring
function displayCompetence(comp) {
  const { nom, categorie, periode } = comp;
  console.log(`${nom} (${categorie}) - ${periode}`);
}

const competence = {
  nom: "JavaScript",
  categorie: "Langages",
  periode: "dev",
  lien: "https://...",
};

displayCompetence(competence);
```

<details>
<summary>✅ Solution</summary>

```javascript
// Version destructurée
function displayCompetence({ nom, categorie, periode }) {
  console.log(`${nom} (${categorie}) - ${periode}`);
}

// Ou avec destructuring dans le corps
function displayCompetence(comp) {
  const { nom, categorie, periode } = comp;
  console.log(`${nom} (${categorie}) - ${periode}`);
}

// Bonus : avec valeur par défaut
function displayCompetence({ nom, categorie = "Général", periode }) {
  console.log(`${nom} (${categorie}) - ${periode}`);
}
```

</details>

---

## 📖 5. Spread et Rest Operators (`...`)

### Spread (`...`) : "Étaler" les éléments

```javascript
// Copier un array (shallow copy)
const original = [1, 2, 3];
const copie = [...original];
copie.push(4);
console.log(original); // [1, 2, 3] (non affecté)
console.log(copie); // [1, 2, 3, 4]

// Concaténer des arrays
const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4]

// Copier un objet
const user = { name: "Paul", age: 25 };
const updatedUser = { ...user, age: 26 };
console.log(user); // { name: "Paul", age: 25 } (non affecté)
console.log(updatedUser); // { name: "Paul", age: 26 }

// Passer des arguments
const numbers = [1, 2, 3];
console.log(Math.max(...numbers)); // 3 (au lieu de Math.max(1, 2, 3))
```

### Rest (`...`) : "Rassembler" les éléments

```javascript
// Dans les paramètres de fonction
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3)); // 6
console.log(sum(1, 2, 3, 4, 5)); // 15

// Avec destructuring
const [first, second, ...others] = [1, 2, 3, 4, 5];
console.log(first); // 1
console.log(second); // 2
console.log(others); // [3, 4, 5]

const { name, ...otherProps } = {
  name: "Paul",
  age: 25,
  email: "paul@email.com",
};
console.log(name); // "Paul"
console.log(otherProps); // { age: 25, email: "paul@email.com" }
```

### 🧪 Mini-défi 5 : Utiliser spread/rest

```javascript
// 1. Créer une fonction qui fusionne plusieurs objets
// Exemple : merge({a: 1}, {b: 2}, {c: 3}) → {a: 1, b: 2, c: 3}
function merge(...objects) {
  return objects.reduce((acc, obj) => ({ ...acc, ...obj }), {});
}

// 2. Créer une fonction qui retire un élément d'un array SANS le muter
// Exemple : removeItem([1,2,3,4], 2) → [1,2,4]
function removeItem(array, index) {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}

// 3. Ajouter une propriété à un objet SANS le muter
const user = { name: "Paul" };
// Créer newUser avec { name: "Paul", isAdmin: true }
const updatedUser = { ...user, isAdmin: true };
```

<details>
<summary>💡 Indices</summary>

1. `merge` : utilise `...` dans un objet `{}`
2. `removeItem` : combine `slice(0, index)` et `slice(index + 1)` avec spread
3. Utilise `{ ...user, nouvelleProprieté: valeur }`

</details>

<details>
<summary>✅ Solutions</summary>

```javascript
// 1. Merge
function merge(...objects) {
  return { ...objects[0], ...objects[1], ...objects[2] };
  // Ou mieux : objects.reduce((acc, obj) => ({ ...acc, ...obj }), {})
}

// 2. Remove item
function removeItem(array, index) {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}

// 3. Ajouter propriété
const user = { name: "Paul" };
const newUser = { ...user, isAdmin: true };
console.log(user); // { name: "Paul" } (non muté)
console.log(newUser); // { name: "Paul", isAdmin: true }
```

</details>

---

## ✅ Quiz de validation

```javascript
// Question 1 : Que affiche ce code ?
const x = 0;
const y = "0";
console.log(x == y); // truth
console.log(x === y); // false

// Question 2 : Que affiche ce code ?
const arr = [];
if (arr) {
  console.log("A"); //true
}
if (arr.length) {
  console.log("B"); //false
}

// Question 3 : Que contient `others` ?
const [first, ...others] = [10, 20, 30, 40];
[20, 30, 40];

// Question 4 : Corrige ce code
function update(user) {
  return { ...user, age: user.age + 1 };
}

// Question 5 : Que affiche ce code ?
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };
const merged = { ...obj1, ...obj2 };
console.log(merged);
```

<details>
<summary>✅ Réponses</summary>

```javascript
// Q1
console.log(x == y); // true (coercition)
console.log(x === y); // false (types différents)

// Q2
// "A" s'affiche ([] est truthy)
// "B" ne s'affiche pas (arr.length = 0 = falsy)

// Q3
others = [20, 30, 40]

// Q4
function update(user) {
  return { ...user, age: user.age + 1 }; // Copie au lieu de muter
}

// Q5
merged.b = 3 (obj2 écrase obj1 car il vient après)
```

</details>

---

## 🎁 Aller plus loin (optionnel)

### Nullish Coalescing (`??`)

```javascript
// Différence entre || et ??
const count = 0;
const result1 = count || 10; // 10 (0 est falsy)
const result2 = count ?? 10; // 0 (0 n'est pas null/undefined)

// Utile pour les valeurs par défaut
const config = {
  timeout: 0, // 0 est une valeur valide !
};
const timeout = config.timeout ?? 5000; // 0 (pas 5000)
```

### Optional Chaining (`?.`)

```javascript
// AVANT
const user = { profile: { name: "Paul" } };
const name = user.profile && user.profile.name; // "Paul"
const city = user.profile && user.profile.address && user.profile.address.city; // undefined

// APRÈS
const name = user.profile?.name; // "Paul"
const city = user.profile?.address?.city; // undefined (pas d'erreur)

// Avec fonctions
const result = user.getName?.(); // Appelle seulement si getName existe
```

---

## 🎯 Ce que tu as appris

✅ Les 7 types primitifs + Object  
✅ Truthy/Falsy et leurs pièges  
✅ `===` vs `==` (toujours utiliser `===`)  
✅ Destructuring (objets et arrays)  
✅ Spread (`...`) pour copier/fusionner  
✅ Rest (`...`) pour rassembler  
✅ Bonus : `??` et `?.`

**Tu es maintenant prêt pour l'exercice 4 !** 🚀

Le prochain interlude couvrira les **Array methods avancés** (map, filter, reduce). On se voit là-bas !
