import { ToastManager } from "./toast-manager.js"; 

// Initialize a global toast manager
const manager = new ToastManager();

// Global function to show toast
window.toast = (message, type = 'info', duration = 3000) => {
    return manager.show(message, type, duration);
};

// raccourcis toasts
// success
window.toast.success = (message, duration = 3000) => {
    return manager.show(message, 'success', duration);
}

// error
window.toast.error = (message, duration = 3000) => {
    return manager.show(message, 'error', duration);
}

// warning
window.toast.warning = (message, duration = 3000) => {
    return manager.show(message, 'warning', duration);
}

// info
window.toast.info = (message, duration = 3000) => {
    return manager.show(message, 'info', duration);
}

// clear all toasts
window.toast.dismissAll = () => {
    manager.dismissAll();
}