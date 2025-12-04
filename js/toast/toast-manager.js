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
                this.dissmissToast(id);
            }
        });
    }
}