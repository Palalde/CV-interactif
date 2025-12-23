export class NavigationHistory {
    constructor() {
        this.history = [];
        this.currentIndex = -1;
        this.maxHistorySize = 50;
        this.state = "idle"; // possible states: idle, navigating, syncing

        this.loadFromSession();
    }

    // set state frome external
    setState(newState) {
        this.state = newState;
    }

    // get current periode
    currentPeriode() {
        return this.history[this.currentIndex] ?? null;
    }

    // push une periode a l'historique
    push(periode) {
        // check avent de push
        if (!periode) return;

        // eviter les duplicates consecutifs
        if (this.currentIndex >= 0 && this.currentPeriode() === periode) {
            return; 
        }
        
        // state a jour
        this.setState("navigating");

        // millieu de l'historique
        // check
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }

        // mettre a jour l'historique
        this.history.push(periode);
        this.currentIndex++;

        // limiter la taille de l'historique
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
            this.currentIndex--;
        }

        // save la session
        this.saveToSession();
        // state idle
        this.setState("idle");
    }

    // reculer dans l'historique
    back() {
        // check
        if (!this.canGoBack()) return null;
            
        // state a jours
        this.setState("navigating");
        // reculer
        this.currentIndex--;
        // recuperer la periode
        const periode = this.currentPeriode();
        // save la session
        this.saveToSession();
        // state idle
        this.setState("idle");
        
        // retourner la periode
        return periode;
    }

    // avancer dans l'historique
    forward() {
        // check
        if (!this.canGoForward()) return null;
        
        // state a jours
        this.setState("navigating");
        // avancer
        this.currentIndex++;
        // recuperer la periode
        const periode = this.currentPeriode();
        // save la session
        this.saveToSession();
        // state idle
        this.setState("idle");
        
        // retourner la periode
        return periode;
    }

    // go back ?
    canGoBack() {
        return this.currentIndex > 0;
    }

    // go forward ?
    canGoForward() {
        return this.currentIndex < this.history.length - 1;
    }

    // save history to sessionStorage
    saveToSession() {
        // data to save
        const Data = {
            history: this.history,
            currentIndex: this.currentIndex
        };
        sessionStorage.setItem('nav-history', JSON.stringify(Data));
    }

    // load history from sessionStorage
    loadFromSession() {
        const data = sessionStorage.getItem('nav-history');
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                this.history = parsedData.history || [];
                this.currentIndex = parsedData.currentIndex || -1;
            } catch (e) {
                console.error("Failed to parse navigation history from sessionStorage:", e);
    
            }  
        }
    }

    // clear history
    clearHistory() {
        this.history = [];
        this.currentIndex = -1;
        sessionStorage.removeItem('nav-history');
    }

    // debug (connaitre le state)
    getState() {
        return {
            history: [...this.history],
            currentIndex: this.currentIndex,
            current: this.currentPeriode(),
            canBack: this.canGoBack(),
            canForward: this.canGoForward(),
            state: this.state,
        };
    }
}  