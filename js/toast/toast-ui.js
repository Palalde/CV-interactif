import { ToastManager } from "./toast-manager.js"; 

// Initialize a global toast manager (default: bottom-right)
const manager = new ToastManager(3, 'bottom-right');

// Global function to show toast
window.toast = (message, type = 'info', duration = 3000, options = {}) => {
    return manager.show(message, type, duration, options);
};

// raccourcis toasts
// success
window.toast.success = (message, duration = 3000, options = {}) => {
    return manager.show(message, 'success', duration, options);
}

// error
window.toast.error = (message, duration = 3000, options = {}) => {
    return manager.show(message, 'error', duration, options);
}

// warning
window.toast.warning = (message, duration = 3000, options = {}) => {
    return manager.show(message, 'warning', duration, options);
}

// info
window.toast.info = (message, duration = 3000, options = {}) => {
    return manager.show(message, 'info', duration, options);
}

// clear all toasts
window.toast.dismissAll = () => {
    manager.dismissAll();
}

// BONUS 3: Change position of toast container
window.toast.setPosition = (position) => {
    manager.setPosition(position);
}