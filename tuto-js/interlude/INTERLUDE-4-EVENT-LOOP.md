# 🎓 Interlude 4 : Event Loop & Ordre d'Exécution Asynchrone

> **Durée estimée :** 30-35 minutes  
> **Objectif :** Comprendre comment JavaScript gère l'asynchrone

---

## 🎯 Pourquoi cet interlude ?

Tu utilises déjà `setTimeout`, `Promise`, `async/await` dans les exercices. Mais sais-tu **dans quel ordre** ils s'exécutent ?

**Pourquoi c'est crucial :**

- Debugger des bugs async complexes
- Comprendre les "race conditions"
- Réussir les questions d'entretien JS (très fréquentes)
- Écrire du code async performant

**Métaphore :** L'Event Loop, c'est comme un restaurant avec :

- Un **chef** (call stack) qui cuisine les plats un par un
- Une **file d'attente normale** (task queue) pour les commandes
- Une **file VIP** (microtask queue) qui passe devant tout le monde

---

## 📖 1. JavaScript est single-threaded

### Le principe de base

JavaScript ne peut faire **qu'une seule chose à la fois**. Il n'y a qu'**un seul thread** d'exécution.

```javascript
console.log("A");
console.log("B");
console.log("C");
// Toujours dans l'ordre : A, B, C
```

**Mais alors, comment JavaScript peut faire plusieurs choses "en même temps" ?**

Réponse : Il ne le fait pas vraiment. Il utilise l'**Event Loop** pour simuler le parallélisme.

---

## 📖 2. La Call Stack (Pile d'appels)

La **call stack** est la pile des fonctions en cours d'exécution.

```javascript
function third() {
  console.log("Third");
}

function second() {
  third();
}

function first() {
  second();
}

first();
```

**État de la call stack :**

```
1. first() est appelée
   Stack: [first]

2. first appelle second()
   Stack: [first, second]

3. second appelle third()
   Stack: [first, second, third]

4. third() log "Third" puis se termine
   Stack: [first, second]

5. second() se termine
   Stack: [first]

6. first() se termine
   Stack: []
```

**Règle :** La fonction au sommet de la stack s'exécute, puis sort de la stack.

---

## 📖 3. Web APIs et la Task Queue

### Le problème

```javascript
console.log("A");

// setTimeout est asynchrone
setTimeout(() => {
  console.log("B");
}, 0); // 0 millisecondes !

console.log("C");

// Résultat : A, C, B (pas A, B, C !)
```

**Pourquoi ?** Même avec 0ms, `setTimeout` est **toujours asynchrone**.

### Comment ça marche ?

```
1. console.log("A") s'exécute → affiche "A"
   Stack: []

2. setTimeout() s'exécute
   - Le callback est donné au navigateur (Web API)
   - setTimeout sort de la stack immédiatement
   Stack: []

3. console.log("C") s'exécute → affiche "C"
   Stack: []

4. La call stack est vide !
   - Le navigateur met le callback de setTimeout dans la TASK QUEUE

5. L'Event Loop vérifie :
   - Stack vide ? ✅
   - Des tâches dans la queue ? ✅
   - Il déplace le callback dans la stack

6. Le callback s'exécute → affiche "B"
   Stack: []
```

**Règle d'or :** Les callbacks asynchrones **attendent que la call stack soit vide** avant d'être exécutés.

---

## 📖 4. Microtasks vs Macrotasks

JavaScript a **2 files d'attente** avec des priorités différentes :

### Macrotasks (Task Queue)

**Priorité normale**, ajoutés à la fin de la queue :

- `setTimeout`
- `setInterval`
- `setImmediate` (Node.js)
- I/O opérations
- UI rendering

### Microtasks (Microtask Queue)

**Priorité haute**, exécutées **avant** les macrotasks :

- `Promise.then()` / `Promise.catch()` / `Promise.finally()`
- `queueMicrotask()`
- `MutationObserver` (browser)
- `process.nextTick()` (Node.js, encore + prioritaire)

### L'ordre d'exécution

```javascript
console.log("1");

setTimeout(() => {
  console.log("2"); // Macrotask
}, 0);

Promise.resolve().then(() => {
  console.log("3"); // Microtask
});

console.log("4");

// Résultat : 1, 4, 3, 2
```

**Pourquoi ?**

```
1. console.log("1") → affiche "1"
2. setTimeout callback → envoyé dans la MACROTASK QUEUE
3. Promise.then callback → envoyé dans la MICROTASK QUEUE
4. console.log("4") → affiche "4"

5. Call stack vide !
   - L'Event Loop exécute TOUTES les MICROTASKS d'abord
   - Promise.then s'exécute → affiche "3"

6. Ensuite seulement, les MACROTASKS
   - setTimeout s'exécute → affiche "2"
```

**Règle :** Microtasks passent **toujours avant** les macrotasks.

---

## 🧪 Mini-défi 1 : Prédire l'ordre

```javascript
// Question 1
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
});

console.log("D");

// Ordre : A D C B

// Question 2
console.log("1");

setTimeout(() => {
  console.log("2");
  Promise.resolve().then(() => {
    console.log("3");
  });
}, 0);

Promise.resolve().then(() => {
  console.log("4");
  setTimeout(() => {
    console.log("5");
  }, 0);
});

console.log("6");

// Ordre : 1 6 4 2 3 5

// Question 3
Promise.resolve()
  .then(() => {
    console.log("A");
  })
  .then(() => {
    console.log("B");
  });

Promise.resolve().then(() => {
  console.log("C");
});

console.log("D");

// Ordre : D A C B
```

<details>
<summary>✅ Réponses</summary>

```javascript
// Q1 : A, D, C, B
// - A et D (code synchrone)
// - C (microtask Promise)
// - B (macrotask setTimeout)

// Q2 : 1, 6, 4, 2, 3, 5
// - 1, 6 (code synchrone)
// - 4 (microtask Promise)
// - 2 (macrotask setTimeout)
// - 3 (microtask créée dans le setTimeout)
// - 5 (macrotask créée dans le Promise)

// Q3 : D, A, C, B
// - D (code synchrone)
// - A (première microtask)
// - C (deuxième microtask, ajoutée en même temps que A)
// - B (microtask créée par .then() après A)
```

</details>

---

## 📖 5. Async/Await et l'Event Loop

`async/await` est du **sucre syntaxique** autour des Promises.

```javascript
// Avec Promises
function fetchData() {
  return fetch("/api/data")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
}

// Avec async/await (équivalent)
async function fetchData() {
  const response = await fetch("/api/data");
  const data = await response.json();
  console.log(data);
}
```

**Règle :** `await` met la fonction en pause, mais **ne bloque pas** la call stack.

### Exemple détaillé

```javascript
console.log("1");

async function asyncFunc() {
  console.log("2");

  await Promise.resolve();

  console.log("3"); // Microtask
}

asyncFunc();

console.log("4");

// Résultat : 1, 2, 4, 3
```

**Pourquoi ?**

```
1. console.log("1") → affiche "1"
2. asyncFunc() est appelée
3. console.log("2") → affiche "2"
4. await Promise.resolve()
   - Le reste de la fonction (console.log("3")) devient une microtask
   - La fonction sort de la stack
5. console.log("4") → affiche "4"
6. Call stack vide → microtask s'exécute → affiche "3"
```

---

## 🧪 Mini-défi 2 : Async/Await

```javascript
// Question 1
async function test() {
  console.log("A");
  await Promise.resolve();
  console.log("B");
}

console.log("1");
test();
console.log("2");

// Ordre : 1 A 2 B

// Question 2
async function func1() {
  console.log("A");
  await new Promise((resolve) => {
    console.log("B");
    resolve();
  });
  console.log("C");
}

async function func2() {
  console.log("D");
  await Promise.resolve();
  console.log("E");
}

func1();
func2();
console.log("F");

// Ordre : A B D F C E

// Question 3 (PIÈGE)
async function test() {
  console.log("A");

  setTimeout(() => {
    console.log("B");
  }, 0);

  await Promise.resolve();

  console.log("C");
}

test();
console.log("D");

// Ordre : A D C B
```

<details>
<summary>✅ Réponses</summary>

```javascript
// Q1 : 1, A, 2, B
// - 1 (synchrone)
// - A (début de test())
// - await met "B" en microtask
// - 2 (synchrone)
// - B (microtask)

// Q2 : A, B, D, F, C, E
// - A (func1 démarre)
// - B (dans la Promise, exécuté immédiatement)
// - await func1 : "C" devient microtask
// - D (func2 démarre)
// - await func2 : "E" devient microtask
// - F (synchrone)
// - C (microtask func1)
// - E (microtask func2)

// Q3 : A, D, C, B
// - A (synchrone)
// - setTimeout → macrotask queue
// - await → "C" devient microtask
// - D (synchrone)
// - C (microtask)
// - B (macrotask)
```

</details>

---

## 📖 6. Le diagramme complet de l'Event Loop

```
┌───────────────────────────┐
│   Call Stack (vide ?)     │
└─────────────┬─────────────┘
              │
              ↓ oui
┌───────────────────────────┐
│   Microtask Queue         │
│   - Promise.then()        │
│   - queueMicrotask()      │
│   (exécute TOUS)          │
└─────────────┬─────────────┘
              │
              ↓ vide
┌───────────────────────────┐
│   Macrotask Queue         │
│   - setTimeout()          │
│   - setInterval()         │
│   (exécute UN SEUL)       │
└─────────────┬─────────────┘
              │
              ↓
┌───────────────────────────┐
│   Rendering (si besoin)   │
│   - requestAnimationFrame │
│   - UI update             │
└─────────────┬─────────────┘
              │
              └───→ Retour au début
```

**Ordre complet :**

1. **Call stack** : Exécute le code synchrone
2. **Microtasks** : Exécute TOUTES les microtasks
3. **Rendering** (si nécessaire)
4. **Macrotask** : Exécute UNE macrotask
5. Retour à l'étape 1

---

## 🧪 Mini-défi 3 : Cas complexes

```javascript
// CHALLENGE FINAL : Prédis l'ordre complet
console.log("start");

setTimeout(() => {
  console.log("setTimeout 1");
  Promise.resolve().then(() => {
    console.log("promise 1");
  });
}, 0);

Promise.resolve()
  .then(() => {
    console.log("promise 2");
    setTimeout(() => {
      console.log("setTimeout 2");
    }, 0);
  })
  .then(() => {
    console.log("promise 3");
  });

setTimeout(() => {
  console.log("setTimeout 3");
}, 0);

console.log("end");

// Ordre : start, end, promise 2, promise 3, setTimeout 1, promise 1, setTimeout 3, setTimeout 2
```

<details>
<summary>💡 Indice</summary>

Analyse étape par étape :

1. Code synchrone d'abord
2. Toutes les microtasks disponibles
3. Une macrotask
4. Nouvelles microtasks créées
5. Répéter

</details>

<details>
<summary>✅ Réponse détaillée</summary>

**Résultat : start, end, promise 2, promise 3, setTimeout 1, promise 1, setTimeout 3, setTimeout 2**

**Explication :**

```
=== Phase 1 : Code synchrone ===
1. console.log("start")
2. setTimeout 1 → macrotask queue
3. Promise.resolve().then(...) → microtask queue
4. setTimeout 3 → macrotask queue
5. console.log("end")

État :
Microtasks: [promise 2]
Macrotasks: [setTimeout 1, setTimeout 3]

=== Phase 2 : Microtasks ===
6. Exécute promise 2 → affiche "promise 2"
   - Crée setTimeout 2 → macrotask queue
   - Crée .then() → microtask queue
7. Exécute promise 3 → affiche "promise 3"

État :
Microtasks: []
Macrotasks: [setTimeout 1, setTimeout 3, setTimeout 2]

=== Phase 3 : Première macrotask ===
8. Exécute setTimeout 1 → affiche "setTimeout 1"
   - Crée Promise.then() → microtask queue

État :
Microtasks: [promise 1]
Macrotasks: [setTimeout 3, setTimeout 2]

=== Phase 4 : Microtasks (encore) ===
9. Exécute promise 1 → affiche "promise 1"

=== Phase 5 : Deuxième macrotask ===
10. Exécute setTimeout 3 → affiche "setTimeout 3"

=== Phase 6 : Troisième macrotask ===
11. Exécute setTimeout 2 → affiche "setTimeout 2"
```

</details>

---

## 🎁 Cas d'usage réels dans TON projet

### 1. Debouncing (exercice 4)

```javascript
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    // setTimeout crée une macrotask
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
```

### 2. Toast auto-dismiss (exercice 7)

```javascript
show(message, duration = 3000) {
  const toast = this.createToast(message);

  // setTimeout pour auto-dismiss (macrotask)
  setTimeout(() => {
    this.dismiss(toast.id);
  }, duration);
}
```

### 3. Fetch avec loading (exercice 8)

```javascript
async function fetchData() {
  showLoading(); // Synchrone

  // await met la suite en microtask
  const data = await fetch("/api").then((r) => r.json());

  // Ceci s'exécute après le fetch (microtask)
  hideLoading();
  displayData(data);
}
```

### 4. Animation frame (smooth scroll)

```javascript
function smoothScroll(target) {
  // requestAnimationFrame est entre microtasks et macrotasks
  function step() {
    // Animation logic
    if (!done) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}
```

---

## ✅ Quiz de validation

```javascript
// Question 1
console.log("A");
queueMicrotask(() => console.log("B"));
setTimeout(() => console.log("C"), 0);
console.log("D");
// Ordre : A D B C

// Question 2
async function test() {
  console.log("1");
  await null;
  console.log("2");
}
test();
test();
console.log("3");
// Ordre : 1, 1, 3, 2, 2

// Question 3
Promise.resolve()
  .then(() => console.log("A"))
  .then(() => console.log("B"));

queueMicrotask(() => {
  console.log("C");
  queueMicrotask(() => console.log("D"));
});

console.log("E");
// Ordre : E A C B D

// Question 4 : Vrai ou Faux ?
// - setTimeout(fn, 0) s'exécute immédiatement après le code synchrone
// - Promise.then() s'exécute avant setTimeout même si setTimeout est appelé avant
// - async/await bloque l'Event Loop
// - Toutes les microtasks sont exécutées avant la prochaine macrotask
```

<details>
<summary>✅ Réponses</summary>

```javascript
// Q1 : A, D, B, C
// - A, D (synchrone)
// - B (microtask via queueMicrotask)
// - C (macrotask via setTimeout)

// Q2 : 1, 1, 3, 2, 2
// - 1 (premier test(), synchrone)
// - 1 (deuxième test(), synchrone)
// - await met les "2" en microtasks
// - 3 (synchrone)
// - 2 (microtask premier test)
// - 2 (microtask deuxième test)

// Q3 : E, A, C, B, D
// - E (synchrone)
// - A (première microtask)
// - C (deuxième microtask, ajoutée en même temps)
// - B (microtask créée après A)
// - D (microtask créée après C)

// Q4 :
// - Faux (setTimeout attend que TOUTES les microtasks soient terminées)
// - Vrai (microtasks > macrotasks)
// - Faux (await libère la call stack, ne bloque pas)
// - Vrai (c'est la règle fondamentale)
```

</details>

---

## 🎯 Résumé : Les règles essentielles

1. **JavaScript est single-threaded** : une chose à la fois
2. **Call stack** : les fonctions s'empilent et se dépilent
3. **Event Loop** : gère les tâches asynchrones
4. **Microtasks > Macrotasks** : Promise avant setTimeout
5. **await** = pause + microtask
6. **Ordre complet** : Sync → Microtasks → Rendering → 1 Macrotask → répéter

---

## 🎯 Ce que tu as appris

✅ Call stack et ordre d'exécution  
✅ Event Loop et ses queues  
✅ Microtasks vs Macrotasks  
✅ Promise.then() vs setTimeout()  
✅ async/await et l'Event Loop  
✅ Prédire l'ordre d'exécution complexe

**Tu es maintenant prêt pour l'exercice 7 (toasts avec queue) !** 🚀

Tu peux maintenant débugger n'importe quel code async et impressionner en entretien !
