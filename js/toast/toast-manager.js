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


}