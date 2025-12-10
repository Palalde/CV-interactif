export class ToastManager {
    constructor(maxToasts = 3) {
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
        this.init();
    }


    // Initialize the toast container
    init() {
        // container exist
        this.container = document.getElementById('toast-container');

        // Create container if it doesn't exist
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }

        // event delegation
        this.container.addEventListener('click', (event) => {
            const toastElement = event.target.closest('.toast');
            if (toastElement) {
                const id = toastElement.dataset.toastId;
                this.dismissToast(id);
            }
        });
    }

    // Show a new toast
    show(message, type = 'info', duration = 3000) {
        // unique toast ID
        const id =`toast-${this.toastId}`; 
        this.toastId++;

        // object
        const toastData = { id, message, type, duration };

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
    createToastElement(id, message, type) {
        // div
        const toast = document.createElement('div');
        // class
        toast.className = `toast toast-${type}`;
        // data attribute
        toast.dataset.toastId = id;
        // accessible text
        toast.setAttribute('role', 'alert');
        //html content
        const icon = this.getIcon(type);
        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" aria-label="Fermer">✕</button>  
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
        const { id, message, type, duration } = toastData;
        // create toast element
        const toastElement = this.createToastElement(id, message, type);
        // ajouter a this.toasts
        this.toasts.push({ 
            id: id, 
            element: toastElement 
        });
        // etat initial
        toastElement.style.opacity = '0';
        toastElement.style.transform = 'translateX(100%)';
        // append to container
        this.container.appendChild(toastElement);
        // animation
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toastElement.style.transition = 'all 0.3s ease';
                toastElement.style.opacity = '1';
                toastElement.style.transform = 'translateX(0)';
            });
        });
        // auto dismiss
        if (duration > 0) {
            setTimeout(() => {
                this.dismissToast(id);
            }, duration);
        }
    }

    // Dismiss toast
    dismissToast(id) {
        // find toast index
        const toastIndex = this.toasts.findIndex(toast => toast.id === id);
        if (toastIndex === -1) return;
        // get toast element
        const toastObj = this.toasts[toastIndex];
        const toastElement = toastObj.element;
        
        // IMPORTANT : Retirer du tableau IMMÉDIATEMENT pour éviter les doubles suppressions
        this.toasts.splice(toastIndex, 1);
        
        // animation
        toastElement.style.opacity = '0';
        toastElement.style.transform = 'translateX(100%)';
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
}