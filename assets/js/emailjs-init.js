/**
 * EmailJS Initialization for FastApp Space
 * Handles EmailJS setup and configuration
 */

class EmailJSManager {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    init() {
        // Wait for EmailJS library to load
        if (typeof emailjs !== 'undefined') {
            this.initializeEmailJS();
        } else {
            // Retry initialization after library loads
            document.addEventListener('DOMContentLoaded', () => {
                this.waitForEmailJS();
            });
        }
    }

    /**
     * Wait for EmailJS library to be available
     */
    waitForEmailJS() {
        const checkEmailJS = () => {
            if (typeof emailjs !== 'undefined') {
                this.initializeEmailJS();
            } else {
                setTimeout(checkEmailJS, 100);
            }
        };
        checkEmailJS();
    }

    /**
     * Initialize EmailJS with user ID
     */
    initializeEmailJS() {
        try {
            // Replace with your actual EmailJS user ID
            emailjs.init("YOUR_USER_ID");
            this.isInitialized = true;
            console.log('EmailJS initialized successfully');
        } catch (error) {
            console.error('Failed to initialize EmailJS:', error);
        }
    }

    /**
     * Send email using EmailJS
     */
    async sendEmail(serviceId, templateId, templateParams) {
        if (!this.isInitialized) {
            throw new Error('EmailJS not initialized');
        }

        try {
            const response = await emailjs.send(serviceId, templateId, templateParams);
            return response;
        } catch (error) {
            console.error('EmailJS send error:', error);
            throw error;
        }
    }

    /**
     * Check if EmailJS is ready
     */
    isReady() {
        return this.isInitialized && typeof emailjs !== 'undefined';
    }
}

// Initialize EmailJS manager
window.emailJSManager = new EmailJSManager();

// Expose method globally for backward compatibility
window.sendEmailJS = (serviceId, templateId, templateParams) => {
    return window.emailJSManager.sendEmail(serviceId, templateId, templateParams);
};