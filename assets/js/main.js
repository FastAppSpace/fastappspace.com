/**
 * Main JavaScript functionality for FastApp Space
 * Handles navigation, scroll effects, and general UI interactions
 */

class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupLegalDropdown();
        this.setupScrollEffects();
        this.setupSmoothScrolling();
        this.preventFOUC();
        this.setupErrorHandling();
    }

    /**
     * Prevent Flash of Unstyled Content
     */
    preventFOUC() {
        document.documentElement.style.visibility = 'hidden';
        window.addEventListener('load', () => {
            document.documentElement.style.visibility = 'visible';
        });
    }

    /**
     * Setup mobile menu functionality
     */
    setupMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (!mobileMenuButton || !mobileMenu) return;

        const toggleMobileMenu = () => {
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            const mobileMenuIcon = mobileMenuButton.querySelector('.fa-bars');
            const mobileMenuCloseIcon = mobileMenuButton.querySelector('.fa-times');
            
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('active');
            mobileMenu.classList.toggle('hidden');
            
            if (mobileMenuIcon && mobileMenuCloseIcon) {
                mobileMenuIcon.classList.toggle('hidden');
                mobileMenuCloseIcon.classList.toggle('hidden');
            }
        };

        // Event listeners
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
        mobileMenuButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
            }
        });

        // Handle mobile nav link clicks
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.updateMobileNavActiveState(link, mobileNavLinks);
                toggleMobileMenu();
            });

            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    link.click();
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && 
                !mobileMenuButton.contains(e.target) && 
                mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });

        // Handle window resize with cleanup
        let resizeTimer;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth >= 1024) {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('active');
                    const mobileMenuIcon = mobileMenuButton.querySelector('.fa-bars');
                    const mobileMenuCloseIcon = mobileMenuButton.querySelector('.fa-times');
                    if (mobileMenuIcon) mobileMenuIcon.classList.remove('hidden');
                    if (mobileMenuCloseIcon) mobileMenuCloseIcon.classList.add('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                }
            }, 250);
        };
        
        window.addEventListener('resize', handleResize);
        
        // Cleanup on page unload to prevent memory leaks
        window.addEventListener('beforeunload', () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimer);
        });
    }

    /**
     * Update mobile navigation active state
     */
    updateMobileNavActiveState(activeLink, allLinks) {
        allLinks.forEach(link => {
            link.classList.remove('active', 'text-purple-600');
            link.classList.add('text-gray-500');
        });
        activeLink.classList.add('active', 'text-purple-600');
        activeLink.classList.remove('text-gray-500');
    }

    /**
     * Setup legal dropdown functionality
     */
    setupLegalDropdown() {
        const legalButton = document.querySelector('.group button[aria-controls="legal-dropdown"]');
        const legalDropdown = document.getElementById('legal-dropdown');
        
        if (!legalButton || !legalDropdown) return;

        const toggleLegalDropdown = () => {
            const isExpanded = legalButton.getAttribute('aria-expanded') === 'true';
            legalButton.setAttribute('aria-expanded', !isExpanded);
            legalDropdown.classList.toggle('active');
            legalDropdown.classList.toggle('hidden');
        };

        // Click handler
        legalButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleLegalDropdown();
        });

        // Keyboard handler
        legalButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleLegalDropdown();
            }
        });

        // Hover handlers for desktop
        legalDropdown.addEventListener('mouseenter', () => {
            legalDropdown.classList.add('active');
            legalDropdown.classList.remove('hidden');
            legalButton.setAttribute('aria-expanded', 'true');
        });

        legalDropdown.addEventListener('mouseleave', () => {
            legalDropdown.classList.remove('active');
            legalDropdown.classList.add('hidden');
            legalButton.setAttribute('aria-expanded', 'false');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!legalButton.contains(e.target) && !legalDropdown.contains(e.target)) {
                legalDropdown.classList.remove('active');
                legalDropdown.classList.add('hidden');
                legalButton.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /**
     * Setup scroll effects and active menu item tracking
     */
    setupScrollEffects() {
        const navbar = document.getElementById('navbar');
        
        const updateActiveMenuItem = () => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPosition = window.scrollY + 100; // Offset for better detection

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    this.updateDesktopNavActiveState(sectionId);
                    this.updateMobileNavActiveStateBySection(sectionId);
                }
            });
        };

        const handleScroll = () => {
            // Navbar scroll effect
            if (navbar) {
                const shouldAddClass = window.scrollY > 50;
                if (shouldAddClass) {
                    navbar.classList.add('nav-scrolled');
                } else {
                    navbar.classList.remove('nav-scrolled');
                }
            }

            // Update active menu item
            updateActiveMenuItem();
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Initial check for active menu item
        updateActiveMenuItem();
    }

    /**
     * Update desktop navigation active state
     */
    updateDesktopNavActiveState(sectionId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.remove('border-transparent', 'text-gray-500');
                link.classList.add('border-purple-500', 'text-gray-900');
            } else {
                link.classList.remove('border-purple-500', 'text-gray-900');
                link.classList.add('border-transparent', 'text-gray-500');
            }
        });
    }

    /**
     * Update mobile navigation active state by section
     */
    updateMobileNavActiveStateBySection(sectionId) {
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active', 'text-purple-600');
                link.classList.remove('text-gray-500');
            } else {
                link.classList.remove('active', 'text-purple-600');
                link.classList.add('text-gray-500');
            }
        });
    }

    /**
     * Setup smooth scrolling for anchor links
     */
    setupSmoothScrolling() {
        const handleSmoothScroll = (e) => {
            e.preventDefault();
            const targetId = e.currentTarget.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (!targetElement) return;
            
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                const mobileMenuButton = document.getElementById('mobile-menu-button');
                if (mobileMenuButton) {
                    mobileMenuButton.click();
                }
            }
            
            // Update focus for accessibility
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus();
        };

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', handleSmoothScroll);
            anchor.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSmoothScroll(e);
                }
            });
        });
    }

    /**
     * Setup global error handling
     */
    setupErrorHandling() {
        const handleError = (error) => {
            console.error('Global error:', error);
            if (window.errorHandler && typeof window.errorHandler.showError === 'function') {
                window.errorHandler.showError('An unexpected error occurred. Please try again later.', 'error');
            }
        };

        window.addEventListener('error', (event) => handleError(event.error));
        window.addEventListener('unhandledrejection', (event) => handleError(event.reason));

        // Simple error display fallback
        window.addEventListener('error', (event) => {
            console.error('Error:', event.error);
            const errorHandler = document.getElementById('error-handler');
            if (errorHandler) {
                errorHandler.textContent = 'An error occurred. Please refresh the page.';
                errorHandler.classList.remove('hidden');
            }
        });
    }

    /**
     * Setup intersection observer for fade-in animations
     */
    setupIntersectionObserver() {
        const handleIntersection = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        };

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(handleIntersection, observerOptions);

        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const navManager = new NavigationManager();
    navManager.setupIntersectionObserver();
});