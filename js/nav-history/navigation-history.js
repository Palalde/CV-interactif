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
}