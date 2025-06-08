/**
 * Scroll Reveal Animations for FastApp Space
 * Handles scroll-triggered animations with Safari compatibility
 */

class ScrollAnimationManager {
    constructor() {
        this.revealElements = [];
        this.isInitialized = false;
        this.ticking = false;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupRevealElements();
            this.setupScrollListener();
            this.setupResizeListener();
            this.initialRevealCheck();
        });
    }

    /**
     * Setup reveal elements with initial state
     */
    setupRevealElements() {
        this.revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        
        // Add initial state class to prevent animation on load
        this.revealElements.forEach(element => {
            element.classList.add('reveal-initial');
            // Force hardware acceleration for Safari
            this.enableHardwareAcceleration(element);
        });

        // Remove initial state class after a short delay
        setTimeout(() => {
            this.revealElements.forEach(element => {
                element.classList.remove('reveal-initial');
            });
            this.isInitialized = true;
        }, 100);
    }

    /**
     * Enable hardware acceleration for better performance
     */
    enableHardwareAcceleration(element) {
        element.style.webkitTransform = 'translateZ(0)';
        element.style.transform = 'translateZ(0)';
        element.style.webkitBackfaceVisibility = 'hidden';
        element.style.backfaceVisibility = 'hidden';
        element.style.webkitPerspective = '1000';
        element.style.perspective = '1000';
    }

    /**
     * Setup scroll event listener with throttling
     */
    setupScrollListener() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.revealOnScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Setup resize event listener with throttling
     */
    setupResizeListener() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (!this.ticking) {
                    requestAnimationFrame(() => {
                        this.revealOnScroll();
                        this.ticking = false;
                    });
                    this.ticking = true;
                }
            }, 250);
        }, { passive: true });
    }

    /**
     * Initial check for elements already in view
     */
    initialRevealCheck() {
        // Wait for initial setup to complete
        setTimeout(() => {
            requestAnimationFrame(() => this.revealOnScroll());
        }, 150);
    }

    /**
     * Reveal elements on scroll
     */
    revealOnScroll() {
        if (!this.isInitialized) return;

        const windowHeight = window.innerHeight;
        const revealPoint = 150;

        this.revealElements.forEach(element => {
            // Skip if already revealed
            if (element.classList.contains('active')) return;

            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                this.revealElement(element);
            }
        });
    }

    /**
     * Reveal individual element with animation
     */
    revealElement(element) {
        // Use requestAnimationFrame for smooth animation
        requestAnimationFrame(() => {
            element.classList.add('active');
            
            // Dispatch custom event for other components
            const revealEvent = new CustomEvent('elementRevealed', {
                detail: { element: element }
            });
            document.dispatchEvent(revealEvent);
        });
    }

    /**
     * Get animation delay for staggered effects
     */
    getAnimationDelay(element, index) {
        const delay = element.dataset.delay || (index * 100);
        return Math.min(delay, 800); // Cap delay at 800ms
    }

    /**
     * Add staggered animation to a group of elements
     */
    addStaggeredAnimation(selector, baseDelay = 100) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            const delay = baseDelay * index;
            element.style.animationDelay = `${delay}ms`;
            element.dataset.delay = delay;
        });
    }

    /**
     * Reset animations (useful for dynamic content)
     */
    resetAnimations() {
        this.revealElements.forEach(element => {
            element.classList.remove('active');
            element.classList.add('reveal-initial');
        });
        
        setTimeout(() => {
            this.revealElements.forEach(element => {
                element.classList.remove('reveal-initial');
            });
            this.revealOnScroll();
        }, 100);
    }

    /**
     * Add reveal animation to new elements
     */
    addRevealElement(element) {
        if (!element.classList.contains('reveal') && 
            !element.classList.contains('reveal-left') && 
            !element.classList.contains('reveal-right') && 
            !element.classList.contains('reveal-scale')) {
            element.classList.add('reveal');
        }
        
        this.enableHardwareAcceleration(element);
        this.revealElements.push(element);
        
        // Check if it should be revealed immediately
        requestAnimationFrame(() => this.revealOnScroll());
    }

    /**
     * Create a smooth reveal animation for any element
     */
    static createRevealAnimation(element, animationType = 'fade') {
        const animations = {
            fade: 'reveal',
            slideLeft: 'reveal-left',
            slideRight: 'reveal-right',
            scale: 'reveal-scale'
        };

        const className = animations[animationType] || animations.fade;
        element.classList.add(className);
        
        if (window.scrollAnimationManager) {
            window.scrollAnimationManager.addRevealElement(element);
        }
    }

    /**
     * Intersection Observer alternative for better performance
     */
    useIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            return false; // Fallback to scroll listener
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -150px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('active')) {
                    this.revealElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.revealElements.forEach(element => {
            observer.observe(element);
        });

        return true;
    }

    /**
     * Initialize with Intersection Observer if supported
     */
    initWithIntersectionObserver() {
        this.setupRevealElements();
        
        // Try to use Intersection Observer for better performance
        if (!this.useIntersectionObserver()) {
            // Fallback to scroll listener
            this.setupScrollListener();
            this.setupResizeListener();
        }
        
        this.initialRevealCheck();
    }
}

// Initialize scroll animation manager
document.addEventListener('DOMContentLoaded', () => {
    window.scrollAnimationManager = new ScrollAnimationManager();
    
    // Expose utility method globally
    window.addRevealAnimation = ScrollAnimationManager.createRevealAnimation;
});