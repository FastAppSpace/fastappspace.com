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
        const loadGtagScript = () => {
            return new Promise((resolve, reject) => {
                try {
                    if (document.querySelector('script[src*="gtag/js"]')) {
                        resolve();
                        return;
                    }
                    
                    const script = document.createElement('script');
                    script.async = true;
                    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-8BDXNPSHMS';
                    
                    script.onload = resolve;
                    script.onerror = (e) => {
                        console.warn('Failed to load Google Analytics script:', e);
                        reject(e);
                    };
                    
                    document.head.appendChild(script);
                } catch (error) {
                    console.warn('Error setting up Google Analytics script:', error);
                    reject(error);
                }
            });
        };
        
        // Initialize GA safely after document is fully loaded
        window.addEventListener('load', async () => {
            try {
                // Wait for the script to load (with a timeout)
                const scriptLoadPromise = loadGtagScript();
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('GA script load timeout')), 3000)
                );
                
                try {
                    await Promise.race([scriptLoadPromise, timeoutPromise]);
                } catch (scriptError) {
                    console.warn('Analytics script loading issue, continuing anyway:', scriptError);
                    // Continue anyway to initialize dataLayer
                }
                
                // Wait a moment for script to initialize
                setTimeout(() => {
                    try {
                        gtag('js', new Date());
                        gtag('config', 'G-8BDXNPSHMS', {
                            'cookie_flags': 'SameSite=None;Secure',
                            'anonymize_ip': true,
                            'send_page_view': false,
                            'transport_type': 'beacon',
                            'debug_mode': this.isLocalhost()
                        });
                        this.isInitialized = true;
                    } catch (configError) {
                        console.warn('Failed to configure Google Analytics:', configError);
                    }
                }, 200);
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
            // Wrap in setTimeout to avoid blocking main thread and reduce chances of errors
            setTimeout(() => {
                try {
                    gtag('event', 'page_view', {
                        page_title: document.title,
                        page_location: window.location.href,
                        page_path: window.location.pathname,
                        non_interaction: true 
                    });
                } catch (innerError) {
                    console.warn('Analytics tracking error (deferred):', innerError);
                    // Don't store failed event in setTimeout to avoid potential loops
                }
            }, 100);
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