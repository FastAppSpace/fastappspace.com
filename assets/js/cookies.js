/**
 * Cookie Consent Manager for FastApp Space
 * Handles cookie consent banner and settings management
 */

class CookieConsentManager {
    constructor() {
        this.banner = null;
        this.modal = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupElements();
            this.checkExistingConsent();
            this.setupEventListeners();
        });
    }

    /**
     * Setup DOM elements
     */
    setupElements() {
        this.banner = document.getElementById('cookieConsentBanner');
        this.modal = document.getElementById('cookieSettingsModal');
        
        if (!this.banner) {
            console.warn('Cookie consent banner not found');
            return;
        }
    }

    /**
     * Check if user has already made a consent choice
     */
    checkExistingConsent() {
        const hasUserConsent = localStorage.getItem('cookieConsent');
        
        if (!hasUserConsent && this.banner) {
            // Show banner after a short delay for better UX
            setTimeout(() => {
                this.showBanner();
            }, 1000);
        }
    }

    /**
     * Setup event listeners for cookie consent
     */
    setupEventListeners() {
        // Accept all cookies button
        const acceptButton = document.getElementById('acceptCookies');
        if (acceptButton) {
            acceptButton.addEventListener('click', () => this.acceptAllCookies());
        }

        // Open cookie settings button
        const settingsButton = document.getElementById('openCookieSettings');
        if (settingsButton) {
            settingsButton.addEventListener('click', () => this.openCookieSettings());
        }

        // Save cookie settings button
        const saveButton = document.getElementById('saveCookieSettings');
        if (saveButton) {
            saveButton.addEventListener('click', () => this.saveCookieSettings());
        }

        // Close cookie settings button
        const closeButton = document.getElementById('closeCookieSettings');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.closeCookieSettings());
        }

        // Handle keyboard navigation
        this.setupKeyboardNavigation();
    }

    /**
     * Setup keyboard navigation for accessibility
     */
    setupKeyboardNavigation() {
        const focusableElements = [
            'acceptCookies',
            'openCookieSettings',
            'saveCookieSettings',
            'closeCookieSettings'
        ];

        focusableElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        element.click();
                    }
                });
            }
        });
    }

    /**
     * Show cookie consent banner
     */
    showBanner() {
        if (this.banner) {
            this.banner.classList.remove('translate-y-full');
        }
    }

    /**
     * Hide cookie consent banner
     */
    hideBanner() {
        if (this.banner) {
            this.banner.classList.add('translate-y-full');
        }
    }

    /**
     * Accept all cookies
     */
    acceptAllCookies() {
        try {
            localStorage.setItem('cookieConsent', 'accepted');
            this.hideBanner();
            
            // Track analytics if available
            if (window.analyticsManager && typeof window.analyticsManager.trackPageView === 'function') {
                window.analyticsManager.trackPageView();
            }
        } catch (error) {
            console.error('Error accepting cookies:', error);
        }
    }

    /**
     * Open cookie settings modal
     */
    openCookieSettings() {
        if (this.modal) {
            this.modal.classList.remove('hidden');
            this.modal.classList.add('flex');
            
            // Load existing settings if available
            this.loadExistingSettings();
            
            // Focus first interactive element for accessibility
            const firstInput = this.modal.querySelector('input[type="checkbox"]');
            if (firstInput) {
                firstInput.focus();
            }
        }
    }

    /**
     * Close cookie settings modal
     */
    closeCookieSettings() {
        if (this.modal) {
            this.modal.classList.remove('flex');
            this.modal.classList.add('hidden');
        }
    }

    /**
     * Load existing cookie settings into the modal
     */
    loadExistingSettings() {
        try {
            const cookieSettings = localStorage.getItem('cookieSettings');
            if (cookieSettings) {
                const settings = JSON.parse(cookieSettings);
                
                // Update checkbox states
                this.updateCheckbox('performanceCookies', settings.performance);
                this.updateCheckbox('functionalityCookies', settings.functionality);
                this.updateCheckbox('targetingCookies', settings.targeting);
                this.updateCheckbox('analyticsCookies', settings.analytics);
            }
        } catch (error) {
            console.error('Error loading cookie settings:', error);
        }
    }

    /**
     * Update checkbox state
     */
    updateCheckbox(id, checked) {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = checked;
        }
    }

    /**
     * Save custom cookie settings
     */
    saveCookieSettings() {
        try {
            const settings = this.getCheckboxValues();
            
            localStorage.setItem('cookieConsent', 'custom');
            localStorage.setItem('cookieSettings', JSON.stringify(settings));

            // If analytics is enabled, track the page view
            if (settings.analytics && window.analyticsManager && 
                typeof window.analyticsManager.trackPageView === 'function') {
                window.analyticsManager.trackPageView();
            }

            this.closeCookieSettings();
            this.hideBanner();
        } catch (error) {
            console.error('Error saving cookie settings:', error);
        }
    }

    /**
     * Get checkbox values from the settings modal
     */
    getCheckboxValues() {
        return {
            performance: this.getCheckboxValue('performanceCookies'),
            functionality: this.getCheckboxValue('functionalityCookies'),
            targeting: this.getCheckboxValue('targetingCookies'),
            analytics: this.getCheckboxValue('analyticsCookies')
        };
    }

    /**
     * Get individual checkbox value
     */
    getCheckboxValue(id) {
        const checkbox = document.getElementById(id);
        return checkbox ? checkbox.checked : false;
    }

    /**
     * Check if specific cookie type is enabled
     */
    static isCookieTypeEnabled(cookieType) {
        try {
            const cookieConsent = localStorage.getItem('cookieConsent');
            
            if (cookieConsent === 'accepted') {
                return true;
            }
            
            if (cookieConsent === 'custom') {
                const settings = JSON.parse(localStorage.getItem('cookieSettings') || '{}');
                return settings[cookieType] || false;
            }
            
            return false;
        } catch (error) {
            console.error('Error checking cookie type:', error);
            return false;
        }
    }

    /**
     * Get current consent status
     */
    static getConsentStatus() {
        try {
            const cookieConsent = localStorage.getItem('cookieConsent');
            const cookieSettings = localStorage.getItem('cookieSettings');
            
            return {
                consent: cookieConsent,
                settings: cookieSettings ? JSON.parse(cookieSettings) : null
            };
        } catch (error) {
            console.error('Error getting consent status:', error);
            return { consent: null, settings: null };
        }
    }
}

// Initialize cookie consent manager
const cookieManager = new CookieConsentManager();

// Expose utility methods globally
window.CookieConsent = {
    isCookieTypeEnabled: CookieConsentManager.isCookieTypeEnabled,
    getConsentStatus: CookieConsentManager.getConsentStatus
};