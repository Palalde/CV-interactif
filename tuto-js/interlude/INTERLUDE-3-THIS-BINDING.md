# 🎓 Interlude 3 : `this`, Arrow Functions & Binding

> **Durée estimée :** 25-30 minutes  
> **Objectif :** Maîtriser `this` et éviter les bugs classiques

---

## 🎯 Pourquoi cet interlude ?

Le mot-clé `this` est **LA source n°1 de bugs** en JavaScript, surtout quand on utilise :

- Des **classes** (exercices 5+)
- Des **event listeners**
- Des **callbacks**

**Métaphore :** `this` c'est comme un pronom dans une phrase. "Il aime le chocolat" → qui est "il" ? Ça dépend du contexte !

En JS, `this` change de valeur selon **comment** la fonction est appelée, pas **où** elle est définie.

---

## 📖 1. Les 4 règles de `this`

### Règle 1 : Appel normal (contexte global)

```javascript
function sayName() {
  console.log(this);
}

sayName(); // En mode strict : undefined
// En mode non-strict : window (navigateur) ou global (Node)
```

**En pratique :** Dans du code moderne (avec `"use strict"` ou modules ES6), `this` est `undefined` hors d'un objet.

---

### Règle 2 : Méthode d'objet

```javascript
const user = {
  name: "Paul",
  greet: function () {
    console.log(`Bonjour, je suis ${this.name}`);
  },
};

user.greet(); // "Bonjour, je suis Paul"
// this = user (l'objet qui appelle la méthode)
```

**Piège classique : perte du contexte**

```javascript
const user = {
  name: "Paul",
  greet: function () {
    console.log(this.name);
  },
};

const greetFunc = user.greet; // Extraire la fonction
greetFunc(); // undefined ou erreur !
// this n'est plus user, c'est undefined ou window
```

**Pourquoi ?** La fonction est appelée seule (`greetFunc()`), pas via `user.greet()`.

---

### Règle 3 : Constructor / `new`

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const paul = new Person("Paul", 25);
console.log(paul.name); // "Paul"
// this = le nouvel objet créé par new
```

**Avec les classes (syntaxe moderne) :**

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    console.log(`Bonjour, je suis ${this.name}`);
  }
}

const paul = new Person("Paul", 25);
paul.greet(); // "Bonjour, je suis Paul"
```

---

### Règle 4 : `call()`, `apply()`, `bind()` (binding explicite)

```javascript
function greet() {
  console.log(`Bonjour ${this.name}`);
}

const user1 = { name: "Paul" };
const user2 = { name: "Marie" };

greet.call(user1); // "Bonjour Paul" (this = user1)
greet.call(user2); // "Bonjour Marie" (this = user2)
```

On verra `bind()` en détail plus tard.

---

## 📖 2. Le piège des event listeners

**Problème classique :**

```javascript
class ClickCounter {
  constructor() {
    this.count = 0;
    const button = document.querySelector("button");
    button.addEventListener("click", this.increment);
  }

  increment() {
    this.count++; // ❌ ERREUR : this est le button, pas l'instance !
    console.log(this.count);
  }
}

const counter = new ClickCounter();
// Au clic → "Cannot read property 'count' of undefined"
```

**Pourquoi ?** Dans un event listener, `this` pointe vers l'élément DOM (le button), pas vers l'instance de classe.

**3 solutions :**

### Solution 1 : Arrow function (RECOMMANDÉE)

```javascript
class ClickCounter {
  constructor() {
    this.count = 0;
    const button = document.querySelector("button");
    // ✅ Arrow function : this = l'instance
    button.addEventListener("click", () => this.increment());
  }

  increment() {
    this.count++;
    console.log(this.count);
  }
}
```

**Pourquoi ça marche ?** Les arrow functions **n'ont pas leur propre `this`**, elles utilisent le `this` du contexte parent.

---

### Solution 2 : `bind()` (classique)

```javascript
class ClickCounter {
  constructor() {
    this.count = 0;
    const button = document.querySelector("button");
    // ✅ bind() crée une nouvelle fonction avec this fixé
    button.addEventListener("click", this.increment.bind(this));
  }

  increment() {
    this.count++;
    console.log(this.count);
  }
}
```

---

### Solution 3 : Class field avec arrow function (moderne)

```javascript
class ClickCounter {
  count = 0; // Class field

  constructor() {
    const button = document.querySelector("button");
    button.addEventListener("click", this.increment);
  }

  // ✅ Arrow function en class field
  increment = () => {
    this.count++;
    console.log(this.count);
  };
}
```

**C'est la syntaxe la plus moderne**, supportée depuis ES2022.

---

## 📖 3. Arrow functions vs fonctions normales

### Différences clés

| Feature                | Fonction normale      | Arrow function        |
| ---------------------- | --------------------- | --------------------- |
| `this`                 | Dépend de l'appel     | Hérite du contexte    |
| `arguments`            | ✅ Disponible         | ❌ Non disponible     |
| Peut être constructeur | ✅ Oui (`new Func()`) | ❌ Non                |
| Syntaxe                | `function() {}`       | `() => {}`            |
| `return` implicite     | ❌ Non                | ✅ Si une seule ligne |

### Exemples

```javascript
// Fonction normale : this change
const obj = {
  name: "Paul",
  greet: function () {
    setTimeout(function () {
      console.log(this.name); // undefined (this = window ou undefined)
    }, 1000);
  },
};
obj.greet();

// Arrow function : this conservé
const obj2 = {
  name: "Paul",
  greet: function () {
    setTimeout(() => {
      console.log(this.name); // "Paul" (this = obj2)
    }, 1000);
  },
};
obj2.greet();
```

### Quand utiliser quoi ?

**Arrow functions :**

- ✅ Callbacks (`map`, `filter`, `setTimeout`, etc.)
- ✅ Event listeners (pour garder `this`)
- ✅ Fonctions courtes

**Fonctions normales :**

- ✅ Méthodes d'objet (pour accéder à `this` de l'objet)
- ✅ Constructeurs
- ✅ Quand tu as besoin de `arguments`

---

## 📖 4. `bind()`, `call()`, `apply()` en détail

### `call()` : Appeler immédiatement avec `this` défini

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, je suis ${this.name}${punctuation}`);
}

const user = { name: "Paul" };

greet.call(user, "Bonjour", "!"); // "Bonjour, je suis Paul!"
// this = user, arguments = "Bonjour", "!"
```

### `apply()` : Comme `call()`, mais arguments en array

```javascript
greet.apply(user, ["Salut", "?"]); // "Salut, je suis Paul?"
// this = user, arguments = ["Salut", "?"]
```

**Astuce moderne :** Avec le spread operator, `call()` suffit :

```javascript
const args = ["Salut", "?"];
greet.call(user, ...args); // Équivalent à apply()
```

### `bind()` : Créer une nouvelle fonction avec `this` fixé

```javascript
const boundGreet = greet.bind(user, "Hey");
boundGreet("!"); // "Hey, je suis Paul!"

// bind() ne l'appelle pas, il retourne une nouvelle fonction
```

**Cas d'usage réel :**

```javascript
class Timer {
  constructor() {
    this.seconds = 0;
    // ✅ bind() fixe this pour setInterval
    setInterval(this.tick.bind(this), 1000);
  }

  tick() {
    this.seconds++;
    console.log(this.seconds);
  }
}

const timer = new Timer();
```

---

## 🧪 Mini-défi 1 : Debugger les bugs de `this`

```javascript
// ❌ Ce code a un bug. Trouve-le et corrige-le.
class Counter {
  constructor() {
    this.count = 0;
    document
      .getElementById("btn")
      .addEventListener("click", () => this.increment);
  }

  increment() {
    this.count++;
    console.log(this.count);
  }
}

// ❌ Ce code a un bug. Trouve-le et corrige-le.
const user = {
  name: "Paul",
  friends: ["Marie", "Luc"],

  printFriends: function () {
    this.friends.forEach((friends) => {
      console.log(`${this.name} est ami avec ${friend}`);
    });
  },
};
user.printFriends();

// ❌ Ce code a un bug. Trouve-le et corrige-le.
class Greeter {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(`Bonjour ${this.name}`);
  }
}

const greeter = new Greeter("Paul");
const greetFunc = greeter.greet.bind(greeter);
greetFunc(); // undefined
```

<details>
<summary>✅ Solutions</summary>

```javascript
// 1. Counter : utiliser arrow function
class Counter {
  constructor() {
    this.count = 0;
    document
      .getElementById("btn")
      .addEventListener("click", () => this.increment());
    // Ou : .addEventListener("click", this.increment.bind(this))
  }

  increment() {
    this.count++;
    console.log(this.count);
  }
}

// 2. printFriends : utiliser arrow function dans forEach
const user = {
  name: "Paul",
  friends: ["Marie", "Luc"],

  printFriends: function () {
    this.friends.forEach((friend) => {
      console.log(`${this.name} est ami avec ${friend}`);
    });
  },
};
// Ou : forEach(function(friend) { ... }.bind(this))

// 3. Greeter : bind la fonction
const greeter = new Greeter("Paul");
const greetFunc = greeter.greet.bind(greeter);
greetFunc(); // "Bonjour Paul"
```

</details>

---

## 🧪 Mini-défi 2 : Cas pratiques

```javascript
// 1. Créer une classe Button qui log "Cliqué X fois"
class Button {
  constructor(selector) {
    this.clicks = 0;
    const button = document.querySelector("button");
    button.addEventListener("click", () => this.handleClick());
  }

  handleClick() {
    this.clicks++;
    console.log(`Cliqué ${this.clicks} fois`);
  }
}

// 2. Créer une méthode qui attends 1 seconde puis log this.name
class User {
  constructor(name) {
    this.name = name;
  }

  greetLater() {
    setTimeout(() => {
      console.log(this.name);
    }, 1000);
  }
}

const user = new User("Paul");
user.greetLater(); // Après 1s : "Paul"

// 3. Fixer ce code avec bind()
const calculator = {
  value: 0,
  add: function (n) {
    this.value += n;
    return this.value;
  },
};

const addFunc = calculator.add.bind(calculator);
// Faire en sorte que addFunc(5) retourne 5 (this = calculator)
```

<details>
<summary>💡 Indices</summary>

1. Utilise une arrow function dans `addEventListener`
2. Utilise une arrow function dans `setTimeout`
3. Utilise `bind()` pour fixer `this`

</details>

<details>
<summary>✅ Solutions</summary>

```javascript
// 1. Button
class Button {
  constructor(selector) {
    this.clicks = 0;
    const btn = document.querySelector(selector);
    btn.addEventListener("click", () => this.handleClick());
  }

  handleClick() {
    this.clicks++;
    console.log(`Cliqué ${this.clicks} fois`);
  }
}

// 2. User.greetLater
class User {
  constructor(name) {
    this.name = name;
  }

  greetLater() {
    setTimeout(() => {
      console.log(this.name);
    }, 1000);
  }
}

// 3. bind()
const calculator = {
  value: 0,
  add: function (n) {
    this.value += n;
    return this.value;
  },
};

const addFunc = calculator.add.bind(calculator);
console.log(addFunc(5)); // 5
console.log(addFunc(3)); // 8
```

</details>

---

## ✅ Quiz de validation

```javascript
// Question 1 : Que affiche ce code ?
const obj = {
  name: "Test",
  getName: function () {
    return this.name;
  },
};
const func = obj.getName;
console.log(func()); // undefined

// Question 2 : Que affiche ce code ?
const obj2 = {
  name: "Test",
  getName: () => this.name,
};
console.log(obj2.getName()); // undefined

// Question 3 : Que affiche ce code ?
function Person(name) {
  this.name = name;
  this.greet = function () {
    setTimeout(function () {
      console.log(this.name); // undefined
    }, 100);
  };
}
const p = new Person("Paul");
p.greet();

// Question 4 : Corrige ce code
class Counter {
  constructor() {
    this.count = 0;
  }

  start() {
    setInterval(() => {
      this.count++;
      console.log(this.count);
    }, 1000);
  }
}

// Question 5 : Quelle est la différence entre call() et bind() ?
// call() : appelle la fonction IMMÉDIATEMENT avec this défini
// bind() : retourne une NOUVELLE fonction avec this fixé (appel plus tard)
```

<details>
<summary>✅ Réponses</summary>

```javascript
// Q1 : undefined (this n'est pas lié à obj)

// Q2 : undefined (arrow function hérite de this du contexte parent, ici global)

// Q3 : undefined (fonction normale dans setTimeout perd this)

// Q4 : Utiliser arrow function
class Counter {
  constructor() {
    this.count = 0;
  }

  start() {
    setInterval(() => {
      this.count++;
      console.log(this.count);
    }, 1000);
  }
}

// Q5 :
// call() : appelle la fonction IMMÉDIATEMENT avec this défini
// bind() : retourne une NOUVELLE fonction avec this fixé (appel plus tard)
```

</details>

---

## 🎁 Cas d'usage réels dans TON projet

### 1. Click counter (exercice 1)

```javascript
// Avec classe
class ClickCounter {
  constructor(selector) {
    this.count = 0;
    const element = document.querySelector(selector);
    // ✅ Arrow function pour garder this
    element.addEventListener("click", () => this.handleClick());
  }

  handleClick() {
    this.count++;
    console.log(`Clicks: ${this.count}`);
  }
}
```

### 2. Favoris manager (exercice 5)

```javascript
class FavoritesManager {
  constructor() {
    this.favorites = new Set();
    // ✅ Event delegation avec arrow function
    document.addEventListener("click", (e) => this.handleClick(e));
  }

  handleClick(e) {
    if (e.target.matches(".fav-btn")) {
      const id = e.target.dataset.id;
      this.toggle(id);
    }
  }

  toggle(id) {
    if (this.favorites.has(id)) {
      this.favorites.delete(id);
    } else {
      this.favorites.add(id);
    }
  }
}
```

### 3. Toast manager (exercice 7)

```javascript
class ToastManager {
  constructor() {
    this.toasts = [];
    // ✅ Bind pour passer la méthode en callback
    document.addEventListener("click", this.handleDismiss.bind(this));
  }

  handleDismiss(e) {
    if (e.target.matches(".toast-close")) {
      const id = e.target.dataset.toastId;
      this.dismiss(id);
    }
  }
}
```

---

## 🎯 Résumé : La règle d'or

**Arrow functions (`=>`) pour les callbacks :**

- Event listeners
- `setTimeout` / `setInterval`
- `map`, `filter`, `forEach`, etc.

**Fonctions normales pour les méthodes de classe :**

- Mais utilise des arrow functions pour les appeler dans les callbacks

**`bind()` quand tu passes une méthode en référence :**

```javascript
setInterval(this.tick.bind(this), 1000);
```

---

## 🎯 Ce que tu as appris

✅ Les 4 règles de `this`  
✅ Le piège des event listeners  
✅ Arrow functions vs fonctions normales  
✅ `call()`, `apply()`, `bind()`  
✅ Quand utiliser quoi

**Tu es maintenant prêt pour l'exercice 5 (favoris avec POO) !** 🚀

`this` n'aura plus de secrets pour toi !
