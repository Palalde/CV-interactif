# 🎮 Exercices 9-10 (Finale) - Concepts Experts

> **📚 Rappel :** Vous devriez avoir terminé l'**INTERLUDE 5** (Map, navi & Immutabilité) avant de commencer ces exercices.
>
> Si ce n'est pas fait, retournez à la fin du fichier `EXERCICES-7-8-SUITE.md` !

---

## 🎯 Exercice 9 : Navigation History avec BroadcastChannel & State Machine ⭐⭐⭐

### 📝 Mission

Créez un **système de navigation avancé** qui track l'historique de la timeline, **synchronise entre plusieurs onglets** avec `BroadcastChannel API`, et utilise un **state machine pattern** pour gérer l'état.

### 🎨 Où travailler

- **Fichiers à créer** :
  - `js/utility/NavigationHistory.js` (classe avec state machine)
  - `js/utility/navigation-sync.js` (BroadcastChannel)

### 💡 Ce que vous devez faire

1. **Créer une classe `NavigationHistory`** avec :
   - State machine : `idle`, `navigating`, `syncing`
   - `push(periode)` : Ajouter une entrée
   - `back()` : Reculer
   - `forward()` : Avancer
   - `canGoBack()` / `canGoForward()` : Vérifier disponibilité
2. **Synchronisation multi-onglets** avec `BroadcastChannel`
3. **Boutons ← →** dans le header
4. **Sauvegarder** dans sessionStorage (persiste pendant la session)
5. **Éviter les doublons** consécutifs

### 🔍 Indices disponibles

<details>
<summary>💡 Indice 1 : Classe NavigationHistory avec state machine</summary>

```javascript
// NavigationHistory.js
export class NavigationHistory {
  constructor() {
    this.history = [];
    this.currentIndex = -1;
    this.state = "idle"; // idle | navigating | syncing
    this.maxSize = 50;

    this.loadFromSession();
  }

  // State machine: changer d'état
  setState(newState) {
    console.log(`Navigation state: ${this.state} -> ${newState}`);
    this.state = newState;
  }

  push(periode) {
    // Ne pas ajouter si c'est la même période
    if (
      this.history.length > 0 &&
      this.history[this.currentIndex] === periode
    ) {
      return;
    }

    this.setState("navigating");

    // Si on est au milieu de l'historique, supprimer le "futur"
    if (this.currentIndex < this.history.length - 1) {
      this.history.splice(this.currentIndex + 1);
    }

    this.history.push(periode);
    this.currentIndex++;

    // Limiter la taille
    if (this.history.length > this.maxSize) {
      this.history.shift();
      this.currentIndex--;
    }

    this.saveToSession();
    this.setState("idle");
  }

  back() {
    if (!this.canGoBack()) return null;

    this.setState("navigating");
    this.currentIndex--;
    const periode = this.history[this.currentIndex];
    this.saveToSession();
    this.setState("idle");

    return periode;
  }

  forward() {
    if (!this.canGoForward()) return null;

    this.setState("navigating");
    this.currentIndex++;
    const periode = this.history[this.currentIndex];
    this.saveToSession();
    this.setState("idle");

    return periode;
  }

  canGoBack() {
    return this.currentIndex > 0;
  }

  canGoForward() {
    return this.currentIndex < this.history.length - 1;
  }

  saveToSession() {
    const data = {
      history: this.history,
      currentIndex: this.currentIndex,
    };
    sessionStorage.setItem("nav-history", JSON.stringify(data));
  }

  loadFromSession() {
    const saved = sessionStorage.getItem("nav-history");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.history = data.history || [];
        this.currentIndex = data.currentIndex ?? -1;
      } catch (e) {
        console.error("Failed to load history:", e);
      }
    }
  }

  clear() {
    this.history = [];
    this.currentIndex = -1;
    sessionStorage.removeItem("nav-history");
  }

  // Debug
  getState() {
    return {
      history: [...this.history],
      currentIndex: this.currentIndex,
      current: this.history[this.currentIndex],
      canBack: this.canGoBack(),
      canForward: this.canGoForward(),
      state: this.state,
    };
  }
}
```

</details>

<details>
<summary>💡 Indice 2 : BroadcastChannel pour sync multi-onglets</summary>

```javascript
// navigation-sync.js
import { NavigationHistory } from "./NavigationHistory.js";

export class NavigationSync {
  constructor(history) {
    this.history = history;
    this.channel = null;

    // Vérifier si BroadcastChannel est supporté
    if ("BroadcastChannel" in window) {
      this.initChannel();
    } else {
      console.warn("BroadcastChannel not supported");
    }
  }

  initChannel() {
    this.channel = new BroadcastChannel("cv-navigation");

    // Écouter les messages des autres onglets
    this.channel.onmessage = (event) => {
      const { action, data } = event.data;

      // Éviter la boucle infinie
      if (this.history.state === "syncing") return;

      this.history.setState("syncing");

      switch (action) {
        case "navigate":
          // Un autre onglet a navigué
          this.history.push(data.periode);
          // Mettre à jour l'UI
          if (window.navigateTimelineToPeriode) {
            window.navigateTimelineToPeriode(data.periode);
          }
          break;

        case "back":
        case "forward":
          // Un autre onglet a utilisé les boutons
          const periode = this.history[action]();
          if (periode && window.navigateTimelineToPeriode) {
            window.navigateTimelineToPeriode(periode);
          }
          break;
      }

      this.history.setState("idle");
    };
  }

  // Envoyer un message aux autres onglets
  broadcast(action, data = {}) {
    if (!this.channel) return;

    // Ne pas broadcaster si on est en mode sync
    if (this.history.state === "syncing") return;

    this.channel.postMessage({ action, data });
  }

  close() {
    if (this.channel) {
      this.channel.close();
    }
  }
}
```

**Utilisation :**

```javascript
const history = new NavigationHistory();
const sync = new NavigationSync(history);

// Quand l'utilisateur navigue
function onNavigate(periode) {
  history.push(periode);
  sync.broadcast("navigate", { periode });
}

// Quand l'utilisateur clique sur ←
function onBackClick() {
  const periode = history.back();
  if (periode) {
    window.navigateTimelineToPeriode(periode);
    sync.broadcast("back");
  }
}
```

</details>

<details>
<summary>💡 Indice 3 : Boutons de navigation dans le header</summary>

HTML à ajouter :

```html
<div class="nav-history-controls">
  <button
    id="nav-back"
    class="nav-history-btn"
    title="Précédent"
    disabled
    aria-label="Page précédente"
  >
    ←
  </button>
  <button
    id="nav-forward"
    class="nav-history-btn"
    title="Suivant"
    disabled
    aria-label="Page suivante"
  >
    →
  </button>
</div>
```

JavaScript :

```javascript
function setupNavigationButtons(history, sync) {
  const backBtn = document.getElementById("nav-back");
  const forwardBtn = document.getElementById("nav-forward");

  function updateButtons() {
    backBtn.disabled = !history.canGoBack();
    forwardBtn.disabled = !history.canGoForward();
  }

  backBtn.addEventListener("click", () => {
    const periode = history.back();
    if (periode && window.navigateTimelineToPeriode) {
      window.navigateTimelineToPeriode(periode);
      sync.broadcast("back");
    }
    updateButtons();
  });

  forwardBtn.addEventListener("click", () => {
    const periode = history.forward();
    if (periode && window.navigateTimelineToPeriode) {
      window.navigateTimelineToPeriode(periode);
      sync.broadcast("forward");
    }
    updateButtons();
  });

  // Mettre à jour les boutons à chaque changement
  return updateButtons;
}
```

CSS :

```css
.nav-history-controls {
  display: flex;
  gap: 5px;
}

.nav-history-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s;
}

.nav-history-btn:hover:not(:disabled) {
  background: var(--accent-color);
  color: white;
}

.nav-history-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
```

</details>

<details>
<summary>💡 Indice 4 : Intégration avec le slider existant</summary>

```javascript
// Dans main.js, hook sur le slider
const rangeSlider = document.getElementById("myRange");
const history = new NavigationHistory();
const sync = new NavigationSync(history);
const updateButtons = setupNavigationButtons(history, sync);

let isNavigatingFromHistory = false;

rangeSlider.addEventListener("change", () => {
  // Ne pas ajouter à l'historique si on navigue via back/forward
  if (isNavigatingFromHistory) {
    isNavigatingFromHistory = false;
    return;
  }

  const value = parseInt(rangeSlider.value);
  const periode = getPeriodeFromSliderValue(value);

  history.push(periode);
  sync.broadcast("navigate", { periode });
  updateButtons();
});

// Fonction pour naviguer via l'historique
window.navigateTimelineToPeriode = function (periode) {
  isNavigatingFromHistory = true;
  const value = getSliderValueFromPeriode(periode);
  rangeSlider.value = value;
  rangeSlider.dispatchEvent(new Event("input"));
  updateContent(value);
};
```

</details>

### ✅ Test de validation

- [ ] Chaque navigation est enregistrée
- [ ] Boutons ← → fonctionnent correctement
- [ ] Les boutons se désactivent aux extrémités
- [ ] Pas de doublons consécutifs
- [ ] sessionStorage persiste pendant la session
- [ ] BroadcastChannel synchronise entre onglets
- [ ] State machine gère les états correctement

### 🎁 Bonus

- ✅ **Keyboard shortcuts** : Alt+← et Alt+→ pour naviguer
- ✅ **Dropdown history** : Afficher tout l'historique en liste déroulante
- ✅ **Stats** : Compteur de visites par période
- ✅ **Export** : Sauvegarder l'historique en JSON
- ✅ **Time tracking** : Mesurer le temps passé sur chaque période

### 🎓 Concepts appris

- ✅ **BroadcastChannel API** : Communication inter-onglets
- ✅ **State machine pattern** : Gérer les états d'une application
- ✅ **sessionStorage** : Stockage temporaire de session
- ✅ **Event coordination** : Éviter les boucles infinies
- ✅ **Browser APIs avancées** : Utiliser des APIs modernes
- ✅ **Architectural patterns** : Séparer logique/sync/UI

---

## 🎯 Exercice 10 : Mini-jeu "Devinez la compétence" avec IntersectionObserver ⭐⭐⭐⭐

### 📝 Mission

Créez un **mini-jeu interactif complet** où l'utilisateur devine une compétence à partir d'indices, avec **IntersectionObserver** pour les animations au scroll, **architecture modulaire**, et **tous les concepts appris**.

### 🎨 Où travailler

- **Fichiers à créer** :
  - `js/games/GameEngine.js` (classe principale)
  - `js/games/GameUI.js` (interface & animations)
  - `js/games/ScoreManager.js` (gestion des scores)
  - `html/game.html` (page dédiée)

### 💡 Ce que vous devez faire

1. **Créer un jeu de quiz** :
   - Choisir une compétence aléatoire
   - Afficher sa description (indice)
   - Proposer 4 choix
   - Valider la réponse
   - Compter les points
2. **Architecture complète** :
   - Classes modulaires (GameEngine, GameUI, ScoreManager)
   - Modules ES6
   - State machine pour les états du jeu
3. **IntersectionObserver** :
   - Animations des choix quand ils entrent dans le viewport
   - Fade-in progressif
4. **Features avancées** :
   - Timer par question
   - Highscores localStorage
   - Animations fluides
   - Son (optionnel)

### 🔍 Indices disponibles

<details>
<summary>💡 Indice 1 : Classe GameEngine (state machine)</summary>

```javascript
// GameEngine.js
import { ScoreManager } from "./ScoreManager.js";

export class GameEngine {
  constructor(competences) {
    this.competences = competences;
    this.state = "idle"; // idle | playing | answering | finished
    this.currentQuestion = 0;
    this.totalQuestions = 5;
    this.currentCompetence = null;
    this.choices = [];
    this.scoreManager = new ScoreManager();
  }

  start() {
    this.setState("playing");
    this.currentQuestion = 0;
    this.scoreManager.reset();
    this.nextQuestion();
  }

  setState(newState) {
    console.log(`Game state: ${this.state} -> ${newState}`);
    this.state = newState;
  }

  nextQuestion() {
    if (this.currentQuestion >= this.totalQuestions) {
      this.finish();
      return;
    }

    this.currentQuestion++;
    this.currentCompetence = this.getRandomCompetence();
    this.choices = this.generateChoices(this.currentCompetence);
  }

  getRandomCompetence() {
    const index = Math.floor(Math.random() * this.competences.length);
    return this.competences[index];
  }

  generateChoices(correct) {
    // Obtenir 3 mauvaises réponses
    const wrong = this.competences
      .filter((c) => c.id !== correct.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Mélanger avec la bonne réponse
    const allChoices = [...wrong, correct];
    return allChoices.sort(() => Math.random() - 0.5);
  }

  async checkAnswer(selectedId, timeRemaining) {
    this.setState("answering");

    const isCorrect = selectedId === this.currentCompetence.id;

    if (isCorrect) {
      // Bonus de points selon le temps restant
      const basePoints = 100;
      const timeBonus = Math.floor(timeRemaining * 10);
      this.scoreManager.addPoints(basePoints + timeBonus);
    }

    // Attendre avant de passer à la prochaine question
    await new Promise((resolve) => setTimeout(resolve, 1500));

    this.setState("playing");
    this.nextQuestion();

    return isCorrect;
  }

  finish() {
    this.setState("finished");
    this.scoreManager.saveHighscore();
  }

  getProgress() {
    return {
      current: this.currentQuestion,
      total: this.totalQuestions,
      percentage: (this.currentQuestion / this.totalQuestions) * 100,
    };
  }
}
```

</details>

<details>
<summary>💡 Indice 2 : ScoreManager avec highscores</summary>

```javascript
// ScoreManager.js
export class ScoreManager {
  constructor() {
    this.currentScore = 0;
    this.highscores = this.loadHighscores();
  }

  reset() {
    this.currentScore = 0;
  }

  addPoints(points) {
    this.currentScore += points;
  }

  getScore() {
    return this.currentScore;
  }

  loadHighscores() {
    const saved = localStorage.getItem("game-highscores");
    return saved ? JSON.parse(saved) : [];
  }

  saveHighscore() {
    const entry = {
      score: this.currentScore,
      date: new Date().toISOString(),
    };

    this.highscores.push(entry);

    // Trier par score décroissant et garder top 10
    this.highscores.sort((a, b) => b.score - a.score);
    this.highscores = this.highscores.slice(0, 10);

    localStorage.setItem("game-highscores", JSON.stringify(this.highscores));
  }

  getHighscores() {
    return [...this.highscores];
  }

  isNewHighscore() {
    if (this.highscores.length === 0) return true;
    return (
      this.currentScore > this.highscores[this.highscores.length - 1].score
    );
  }
}
```

</details>

<details>
<summary>💡 Indice 3 : GameUI avec IntersectionObserver</summary>

```javascript
// GameUI.js
export class GameUI {
  constructor(gameEngine, containerId) {
    this.game = gameEngine;
    this.container = document.getElementById(containerId);
    this.timerInterval = null;
    this.timeRemaining = 10;

    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    // Animer les éléments quand ils entrent dans le viewport
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "50px",
      }
    );
  }

  displayQuestion() {
    const { currentCompetence, choices, currentQuestion, totalQuestions } =
      this.game;

    this.container.innerHTML = `
      <div class="game-header fade-in">
        <div class="game-progress">
          <span>Question ${currentQuestion}/${totalQuestions}</span>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${
              this.game.getProgress().percentage
            }%"></div>
          </div>
        </div>
        <div class="game-score">
          Score: ${this.game.scoreManager.getScore()}
        </div>
        <div class="game-timer" id="game-timer">10s</div>
      </div>

      <div class="game-question fade-in">
        <p class="question-text">${currentCompetence.description}</p>
        <span class="question-hint">Période: ${currentCompetence.periode}</span>
      </div>

      <div class="game-choices" id="game-choices"></div>
    `;

    // Créer les boutons de choix
    const choicesContainer = document.getElementById("game-choices");
    choices.forEach((comp, index) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn animate-choice";
      btn.textContent = comp.name;
      btn.dataset.competenceId = comp.id;
      btn.style.animationDelay = `${index * 0.1}s`;

      // Observer pour animations
      this.observer.observe(btn);

      btn.addEventListener("click", () => this.handleChoice(comp.id, btn));

      choicesContainer.appendChild(btn);
    });

    this.startTimer();
  }

  startTimer() {
    this.timeRemaining = 10;
    const timerEl = document.getElementById("game-timer");

    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      timerEl.textContent = `${this.timeRemaining}s`;

      if (this.timeRemaining <= 0) {
        clearInterval(this.timerInterval);
        this.handleTimeout();
      }
    }, 1000);
  }

  async handleChoice(selectedId, button) {
    clearInterval(this.timerInterval);

    // Désactiver tous les boutons
    const allButtons = document.querySelectorAll(".choice-btn");
    allButtons.forEach((b) => (b.disabled = true));

    // Vérifier la réponse
    const isCorrect = await this.game.checkAnswer(
      selectedId,
      this.timeRemaining
    );

    // Feedback visuel
    button.classList.add(isCorrect ? "correct" : "wrong");

    // Afficher la bonne réponse si erreur
    if (!isCorrect) {
      const correctBtn = Array.from(allButtons).find(
        (b) => b.dataset.competenceId === this.game.currentCompetence.id
      );
      if (correctBtn) correctBtn.classList.add("correct");
    }

    // Toast notification
    if (window.toast) {
      if (isCorrect) {
        window.toast.success(`+${100 + this.timeRemaining * 10} points !`);
      } else {
        window.toast.error("Mauvaise réponse");
      }
    }
  }

  handleTimeout() {
    window.toast?.warning("Temps écoulé !");
    this.game.checkAnswer(null, 0);
  }

  displayResults() {
    const score = this.game.scoreManager.getScore();
    const isHighscore = this.game.scoreManager.isNewHighscore();

    this.container.innerHTML = `
      <div class="game-results fade-in">
        <h2>${isHighscore ? "🎉 Nouveau record !" : "Partie terminée"}</h2>
        <div class="final-score">
          <span class="score-label">Score final</span>
          <span class="score-value">${score}</span>
        </div>
        <button id="play-again" class="btn-primary">Rejouer</button>
        <button id="view-highscores" class="btn-secondary">Voir les scores</button>
      </div>
    `;

    document
      .getElementById("play-again")
      .addEventListener("click", () => this.game.start());
  }
}
```

</details>

<details>
<summary>💡 Indice 4 : CSS avec animations</summary>

```css
.animate-choice {
  opacity: 0;
  transform: translateY(20px);
  animation: slideUp 0.5s forwards;
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.choice-btn {
  padding: 16px 24px;
  font-size: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  cursor: pointer;
  transition: all 0.3s;
}

.choice-btn:hover:not(:disabled) {
  border-color: var(--accent-color);
  transform: translateX(5px);
}

.choice-btn.correct {
  background: #4caf50;
  border-color: #4caf50;
  color: white;
  animation: pulse 0.5s;
}

.choice-btn.wrong {
  background: #f44336;
  border-color: #f44336;
  color: white;
  animation: shake 0.5s;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

.fade-in {
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

</details>

<details>
<summary>💡 Indice 5 : Initialisation complète</summary>

```javascript
// game.html
import { GameEngine } from "./games/GameEngine.js";
import { GameUI } from "./games/GameUI.js";

document.addEventListener("DOMContentLoaded", () => {
  const competences = window.CV_COMPETENCES || [];

  const game = new GameEngine(competences);
  const ui = new GameUI(game, "game-container");

  // Exposer globalement pour debug
  window.game = game;

  // Démarrer le jeu
  game.start();
  ui.displayQuestion();

  // Observer les changements d'état
  const originalSetState = game.setState.bind(game);
  game.setState = function (newState) {
    originalSetState(newState);

    if (newState === "playing") {
      ui.displayQuestion();
    } else if (newState === "finished") {
      ui.displayResults();
    }
  };
});
```

</details>

### ✅ Test de validation

- [ ] Le jeu démarre et affiche une première question
- [ ] 4 choix sont proposés aléatoirement
- [ ] Le timer fonctionne (10s par question)
- [ ] La bonne réponse donne des points (+ bonus temps)
- [ ] 5 questions puis écran de résultats
- [ ] Highscores sauvegardés dans localStorage
- [ ] IntersectionObserver anime les choix
- [ ] Architecture modulaire (3+ classes)
- [ ] On peut rejouer

### 🎁 Bonus

- ✅ **Niveaux de difficulté** : Facile (15s), Normal (10s), Difficile (5s)
- ✅ **Vies** : 3 erreurs = game over
- ✅ **Indices payants** : Dépenser des points pour un indice
- ✅ **Multiplayer** : Comparer les scores via BroadcastChannel
- ✅ **Achievements** : "5 bonnes réponses d'affilée", "Score > 500", etc.
- ✅ **Sounds** : Sons subtils pour correct/wrong/finish

### 🎓 Concepts appris

- ✅ **IntersectionObserver** : Animations au scroll/viewport
- ✅ **Architecture complète** : Multiples classes modulaires
- ✅ **Game loop** : État du jeu, transitions, score
- ✅ **All concepts précédents** : async, classes, modules, localStorage, fetch potentiel
- ✅ **UX polish** : Animations, feedback, transitions
- ✅ **Full application** : Projet complet de A à Z

---

## 🎉 Félicitations ! Vous avez terminé tous les exercices !

### 📊 Progression finale

**Niveau JavaScript atteint : 4.5-4.8/5** 🚀

Vous maîtrisez maintenant :

✅ **Fondamentaux** : DOM, Events, Timing, Storage  
✅ **Moderne** : Modules ES6, async/await, fetch, Classes  
✅ **Patterns** : Debouncing, Event Delegation, State Machine, Factory  
✅ **APIs** : Clipboard, BroadcastChannel, IntersectionObserver, GitHub API  
✅ **Architecture** : POO, Separation of Concerns, Modularity  
✅ **Performance** : Lazy loading, Queue management, Async processing  
✅ **UX** : Loading states, Animations, Error handling, Progressive enhancement

### 🚀 Prochaines étapes

Vous êtes maintenant prêt pour :

1. **Créer un projet complet** de votre propre initiative
2. **Contribuer à l'open-source** sur GitHub
3. **Apprendre un framework** (React, Vue, Svelte) - vous avez les bases solides
4. **Backend JavaScript** : Node.js, Express, bases de données
5. **Advanced topics** : WebSockets, Service Workers, PWA

**Bravo pour ce parcours ! 🎓**
