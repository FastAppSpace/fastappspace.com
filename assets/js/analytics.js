/**
 * Google Analytics Manager for FastApp Space
 * Handles Google Analytics initialization, tracking, and error recovery
 */

class AnalyticsManager {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    init() {
        this.initializeDataLayer();
        this.setupAnalytics();
        this.setupEventTracking();
        this.setupRetryMechanism();
    }

    /**
     * Initialize Google Analytics dataLayer
     */
    initializeDataLayer() {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
            dataLayer.push(arguments);
        };
    }

    /**
     * Setup Google Analytics with error handling
     */
    setupAnalytics() {
        window.addEventListener('load', () => {
            try {
                gtag('js', new Date());
                gtag('config', 'G-8BDXNPSHMS', {
                    'cookie_flags': 'SameSite=None;Secure',
                    'anonymize_ip': true,
                    'send_page_view': false,
                    'debug_mode': this.isLocalhost()
                });
                this.isInitialized = true;
            } catch (error) {
                console.warn('Failed to initialize Google Analytics:', error);
            }
        });
    }

    /**
     * Check if running on localhost
     */
    isLocalhost() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1';
    }

    /**
     * Setup page view tracking based on cookie consent
     */
    setupEventTracking() {
        document.addEventListener('DOMContentLoaded', () => {
            const cookieConsent = localStorage.getItem('cookieConsent');
            if (this.hasAnalyticsConsent(cookieConsent)) {
                if (typeof gtag === 'function') {
                    this.trackPageView();
                } else {
                    window.addEventListener('load', () => this.trackPageView());
                }
            }
        });
    }

    /**
     * Check if user has given analytics consent
     */
    hasAnalyticsConsent(cookieConsent) {
        if (cookieConsent === 'accepted') return true;
        if (cookieConsent === 'custom') {
            try {
                const settings = JSON.parse(localStorage.getItem('cookieSettings'));
                return settings && settings.analytics;
            } catch (error) {
                console.warn('Error parsing cookie settings:', error);
                return false;
            }
        }
        return false;
    }

    /**
     * Track page view with error handling
     */
    trackPageView() {
        if (!this.isAnalyticsReady()) {
            console.warn('Google Analytics not loaded yet');
            return;
        }

        try {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname
            });
        } catch (error) {
            console.warn('Analytics error:', error);
            this.storeFailedEvent('page_view', {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname
            });
        }
    }

    /**
     * Track custom events with consent and error handling
     */
    trackEvent(eventName, eventParams = {}) {
        if (!this.isAnalyticsReady()) {
            console.warn('Google Analytics not loaded yet');
            return;
        }

        try {
            const cookieConsent = localStorage.getItem('cookieConsent');
            if (this.hasAnalyticsConsent(cookieConsent)) {
                gtag('event', eventName, eventParams);
            }
        } catch (error) {
            console.warn('Analytics error:', error);
            this.storeFailedEvent(eventName, eventParams);
        }
    }

    /**
     * Check if Google Analytics is ready
     */
    isAnalyticsReady() {
        return typeof gtag === 'function';
    }

    /**
     * Store failed analytics events for retry
     */
    storeFailedEvent(eventName, eventParams) {
        try {
            const failedEvents = JSON.parse(localStorage.getItem('failedEvents') || '[]');
            failedEvents.push({
                timestamp: new Date().toISOString(),
                event: eventName,
                params: eventParams
            });
            localStorage.setItem('failedEvents', JSON.stringify(failedEvents));
        } catch (error) {
            console.warn('Failed to store analytics event:', error);
        }
    }

    /**
     * Store failed page views for retry
     */
    storeFailedPageView(pagePath) {
        try {
            const failedPageViews = JSON.parse(localStorage.getItem('failedPageViews') || '[]');
            failedPageViews.push({
                timestamp: new Date().toISOString(),
                page: pagePath
            });
            localStorage.setItem('failedPageViews', JSON.stringify(failedPageViews));
        } catch (error) {
            console.warn('Failed to store page view:', error);
        }
    }

    /**
     * Setup retry mechanism for failed analytics
     */
    setupRetryMechanism() {
        window.addEventListener('online', () => this.retryFailedAnalytics());
    }

    /**
     * Retry failed analytics events when connection is restored
     */
    retryFailedAnalytics() {
        if (!this.isAnalyticsReady()) {
            console.warn('Google Analytics not loaded yet');
            return;
        }

        try {
            this.retryFailedPageViews();
            this.retryFailedEvents();
        } catch (error) {
            console.warn('Failed to retry analytics:', error);
        }
    }

    /**
     * Retry failed page views
     */
    retryFailedPageViews() {
        const failedPageViews = JSON.parse(localStorage.getItem('failedPageViews') || '[]');
        
        failedPageViews.forEach(pageView => {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                page_path: pageView.page,
                original_timestamp: pageView.timestamp
            });
        });

        if (failedPageViews.length > 0) {
            localStorage.removeItem('failedPageViews');
        }
    }

    /**
     * Retry failed events
     */
    retryFailedEvents() {
        const failedEvents = JSON.parse(localStorage.getItem('failedEvents') || '[]');
        
        failedEvents.forEach(event => {
            gtag('event', event.event, {
                ...event.params,
                original_timestamp: event.timestamp
            });
        });

        if (failedEvents.length > 0) {
            localStorage.removeItem('failedEvents');
        }
    }

    /**
     * Public method to track events (exposed globally)
     */
    static trackEvent(eventName, eventParams = {}) {
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent(eventName, eventParams);
        }
    }

    /**
     * Public method to track page views (exposed globally)
     */
    static trackPageView() {
        if (window.analyticsManager) {
            window.analyticsManager.trackPageView();
        }
    }
}

// Initialize analytics manager and expose globally
window.analyticsManager = new AnalyticsManager();

// Expose methods globally for backward compatibility
window.trackEvent = AnalyticsManager.trackEvent;
window.trackPageView = AnalyticsManager.trackPageView;