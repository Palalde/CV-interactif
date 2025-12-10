export class ToastManager {
    constructor(maxToasts = 3, position = 'bottom-right') {
        // Array to hold active toasts
        this.toasts = [];
        // Maximum number of toasts to display at once
        this.maxToasts = maxToasts;
        // toast queue to hold excess toasts
        this.queue = [];
        // toast ID counter
        this.toastId = 0;
        // container element for toasts
        this.container = null;
        // BONUS 3: position du conteneur (top-right, top-left, bottom-right, bottom-left)
        this.position = position;
        this.init();
    }


    // Initialize the toast container
    init() {
        // BONUS 3: Utiliser des conteneurs multiples pour supporter différentes positions
        this.containers = {};
        
        // Event delegation globale sur le body pour tous les conteneurs
        document.body.addEventListener('click', (event) => {
            const toastElement = event.target.closest('.toast');
            if (!toastElement) return;
            
            const id = toastElement.dataset.toastId;
            
            // BONUS 4: Gérer les clics sur les boutons d'action
            const actionBtn = event.target.closest('.toast-action-btn');
            if (actionBtn) {
                const actionIndex = parseInt(actionBtn.dataset.actionIndex);
                this.handleActionClick(id, actionIndex);
                return;
            }
            
            // Clic sur le bouton de fermeture
            if (event.target.closest('.toast-close')) {
                this.dismissToast(id);
            }
        });
    }
    
    // BONUS 3: Obtenir ou créer un conteneur pour une position donnée
    getOrCreateContainer(position) {
        // Si le conteneur pour cette position existe déjà, le retourner
        if (this.containers[position]) {
            return this.containers[position];
        }
        
        // Créer un nouveau conteneur pour cette position
        const container = document.createElement('div');
        container.id = `toast-container-${position}`;
        container.className = `toast-container toast-position-${position}`;
        document.body.appendChild(container);
        
        // Stocker dans le cache
        this.containers[position] = container;
        
        return container;
    }

    // Show a new toast
    show(message, type = 'info', duration = 3000, options = {}) {
        // unique toast ID
        const id =`toast-${this.toastId}`; 
        this.toastId++;

        // BONUS 3: Supporter position personnalisée par toast
        const position = options.position || this.position;
        
        // BONUS 4: Supporter actions (boutons) dans le toast
        const actions = options.actions || [];

        // object
        const toastData = { id, message, type, duration, position, actions };

        // check if queue is needed
        if (this.toasts.length >= this.maxToasts) {
            this.queue.push(toastData);
            return id;
        }

        // create and display toasts
        this.displayToast(toastData);
        return id;
    }

    // Create toast Element
    createToastElement(id, message, type, actions = []) {
        // div
        const toast = document.createElement('div');
        // class
        toast.className = `toast toast-${type}`;
        // data attribute
        toast.dataset.toastId = id;
        // accessible text
        toast.setAttribute('role', 'alert');
        
        // BONUS 4: Générer le HTML des actions
        let actionsHTML = '';
        if (actions.length > 0) {
            actionsHTML = '<div class="toast-actions">';
            actions.forEach((action, index) => {
                const btnClass = action.primary ? 'toast-action-btn toast-action-primary' : 'toast-action-btn';
                actionsHTML += `<button class="${btnClass}" data-action-index="${index}">${action.label}</button>`;
            });
            actionsHTML += '</div>';
        }
        
        //html content
        const icon = this.getIcon(type);
        toast.innerHTML = `
            <div class="toast-content-wrapper">
                <span class="toast-icon">${icon}</span>
                <span class="toast-message">${message}</span>
                <button class="toast-close" aria-label="Fermer">✕</button>
            </div>
            ${actionsHTML}
            <div class="toast-progress"></div>  
        `; 

        return toast;
    }

    // icon
    getIcon(type) {
        // icon mapping
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        // return icon based on type
        return icons[type] || icons.info;   
    }

    // Display toast
    displayToast(toastData) {
        const { id, message, type, duration, position, actions } = toastData;
        
        // BONUS 3: Utiliser le conteneur approprié pour cette position
        const targetPosition = position || this.position;
        const container = this.getOrCreateContainer(targetPosition);
        
        // create toast element
        const toastElement = this.createToastElement(id, message, type, actions);
        // toast progress bar
        const toastProgress = toastElement.querySelector('.toast-progress');
        
        // créer l'objet toast avec TOUTES les infos pour pause/resume
        const toastObj = {
            id: id,
            element: toastElement,
            progressBar: toastProgress,
            duration: duration,
            startTime: Date.now(),
            remainingTime: duration,
            timeoutId: null,  // sera rempli plus bas
            position: position || this.position,  // BONUS 3: stocker la position
            actions: actions || []  // BONUS 4: stocker les actions
        };
        
        // ajouter à this.toasts
        this.toasts.push(toastObj);
        
        // BONUS 3: déterminer la direction d'animation selon la position
        const animationTransform = this.getAnimationTransform(position || this.position);
        
        // etat initial
        toastProgress.style.width = '100%';
        toastElement.style.opacity = '0';
        toastElement.style.transform = animationTransform.initial;
        
        // démarrer l'animation de la barre de progression
        requestAnimationFrame(() => {
            toastProgress.style.transition = `width ${duration}ms linear`;
            toastProgress.style.width = '0%';
        });
        
        // append to container
        container.appendChild(toastElement);
        
        // animation d'entrée
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toastElement.style.transition = 'all 0.3s ease';
                toastElement.style.opacity = '1';
                toastElement.style.transform = animationTransform.final;
            });
        });
        
        // auto dismiss et CAPTURER le timeoutId
        if (duration > 0) {
            toastObj.timeoutId = setTimeout(() => {
                this.dismissToast(id);
            }, duration);
        }
        
        // BONUS 2: ajouter les listeners pause/resume
        toastElement.addEventListener('mouseenter', () => {
            this.pauseToast(id);
        });
        
        toastElement.addEventListener('mouseleave', () => {
            this.resumeToast(id);
        });
    }

    // Dismiss toast
    dismissToast(id) {
        // find toast index
        const toastIndex = this.toasts.findIndex(toast => toast.id === id);
        if (toastIndex === -1) return;
        // get toast element
        const toastObj = this.toasts[toastIndex];
        const toastElement = toastObj.element;
        
        // Annuler le timeout s'il existe (important pour pause/resume)
        if (toastObj.timeoutId) {
            clearTimeout(toastObj.timeoutId);
            toastObj.timeoutId = null;
        }
        
        // IMPORTANT : Retirer du tableau IMMÉDIATEMENT pour éviter les doubles suppressions
        this.toasts.splice(toastIndex, 1);
        
        // BONUS 3: animation de sortie selon la position
        const animationTransform = this.getAnimationTransform(toastObj.position);
        toastElement.style.opacity = '0';
        toastElement.style.transform = animationTransform.initial;
        
        // remove after animation
        setTimeout(() => {
            // remove from DOM
            toastElement.remove();
            // check queue
            if (this.queue.length > 0) {
                const nextToastData = this.queue.shift();
                this.displayToast(nextToastData);
            }
        }, 300);
    }

    // BONUS 2: Pause toast on hover
    pauseToast(id) {
        const toast = this.toasts.find(t => t.id === id);
        if (!toast) return;

        // 1. Annuler le timeout actuel
        if (toast.timeoutId) {
            clearTimeout(toast.timeoutId);
            toast.timeoutId = null;
        }

        // 2. Calculer le temps restant
        const elapsed = Date.now() - toast.startTime;
        toast.remainingTime = toast.duration - elapsed;

        // 3. Stopper l'animation CSS de la barre
        const progressBar = toast.progressBar;
        const currentWidth = progressBar.offsetWidth; // Largeur actuelle en pixels
        const parentWidth = progressBar.parentElement.offsetWidth;
        const widthPercent = (currentWidth / parentWidth) * 100;
        
        progressBar.style.transition = 'none'; // Supprimer la transition
        progressBar.style.width = `${widthPercent}%`; // Figer à la position actuelle
    }

    // BONUS 2: Resume toast when mouse leaves
    resumeToast(id) {
        const toast = this.toasts.find(t => t.id === id);
        if (!toast || toast.remainingTime <= 0) return;

        // 1. Reprendre l'animation de la barre
        const progressBar = toast.progressBar;
        
        requestAnimationFrame(() => {
            progressBar.style.transition = `width ${toast.remainingTime}ms linear`;
            progressBar.style.width = '0%';
        });

        // 2. Relancer le timeout avec le temps restant
        toast.startTime = Date.now(); // Nouveau point de départ
        toast.timeoutId = setTimeout(() => {
            this.dismissToast(id);
        }, toast.remainingTime);
    }

    // BONUS 4: Handle action button click
    handleActionClick(toastId, actionIndex) {
        const toast = this.toasts.find(t => t.id === toastId);
        if (!toast || !toast.actions || !toast.actions[actionIndex]) return;
        
        const action = toast.actions[actionIndex];
        
        // Exécuter le callback de l'action
        if (typeof action.onClick === 'function') {
            action.onClick(toastId);
        }
        
        // Fermer le toast après l'action si autoClose n'est pas false
        if (action.autoClose !== false) {
            this.dismissToast(toastId);
        }
    }

    // Clear all toasts
    dismissAll() {
        // Copier le tableau pour éviter les problèmes d'itération
        const toastsToClose = [...this.toasts];
        
        // fermer tous les toasts actifs
        toastsToClose.forEach(toastObj => {
            this.dismissToast(toastObj.id);
        });
        // vider la file d'attente
        this.queue = [];
    }

    // BONUS 3: Set position of toast container
    setPosition(position) {
        this.position = position;
        
        // Retirer toutes les classes de position existantes
        this.container.classList.remove(
            'toast-position-top-right',
            'toast-position-top-left',
            'toast-position-bottom-right',
            'toast-position-bottom-left'
        );
        
        // Ajouter la nouvelle classe de position
        this.container.classList.add(`toast-position-${position}`);
    }

    // BONUS 3: Get animation transform based on position
    getAnimationTransform(position) {
        const transforms = {
            'top-right': {
                initial: 'translateX(100%)',  // Entre par la droite
                final: 'translateX(0)'
            },
            'top-left': {
                initial: 'translateX(-100%)',  // Entre par la gauche
                final: 'translateX(0)'
            },
            'bottom-right': {
                initial: 'translateX(100%)',  // Entre par la droite
                final: 'translateX(0)'
            },
            'bottom-left': {
                initial: 'translateX(-100%)',  // Entre par la gauche
                final: 'translateX(0)'
            }
        };
        
        return transforms[position] || transforms['bottom-right'];
    }
}