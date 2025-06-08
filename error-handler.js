// Error Handler Class
class ErrorHandler {
    constructor() {
        this.errorContainer = null;
        this.init();
    }

    init() {
        // Create error container
        this.createErrorContainer();
        // Initialize form validation
        this.initFormValidation();
        // Initialize network error handling
        this.initNetworkErrorHandling();
    }

    createErrorContainer() {
        this.errorContainer = document.createElement('div');
        this.errorContainer.className = 'fixed top-4 right-4 z-50 max-w-md';
        document.body.appendChild(this.errorContainer);
    }

    showError(message, type = 'error') {
        const errorElement = document.createElement('div');
        errorElement.className = `p-4 mb-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full ${
            type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`;
        
        const flexContainer = document.createElement('div');
        flexContainer.className = 'flex items-center';
        
        const icon = document.createElement('i');
        icon.className = `fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-2`;
        
        const messageText = document.createElement('p');
        messageText.textContent = message;
        
        flexContainer.appendChild(icon);
        flexContainer.appendChild(messageText);
        errorElement.appendChild(flexContainer);
        
        this.errorContainer.appendChild(errorElement);

        // Animate in
        setTimeout(() => {
            errorElement.classList.remove('translate-x-full');
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            errorElement.classList.add('translate-x-full');
            setTimeout(() => {
                errorElement.remove();
            }, 300);
        }, 5000);
    }

    initFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Remove previous error states
            input.classList.remove('border-red-500');
            const errorMessage = input.parentElement.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }

            const sanitizedValue = this.sanitizeString(input.value);
            
            if (input.hasAttribute('required') && !sanitizedValue.trim()) {
                this.showFieldError(input, 'This field is required');
                isValid = false;
                return;
            }
            
            const maxLength = input.getAttribute('maxlength');
            if (maxLength && sanitizedValue.length > parseInt(maxLength, 10)) {
                this.showFieldError(input, `Input exceeds maximum length of ${maxLength} characters`);
                isValid = false;
            }

            if (input.type === 'email' && sanitizedValue) {
                const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                if (!emailRegex.test(sanitizedValue) || sanitizedValue.length > 254) {
                    this.showFieldError(input, 'Please enter a valid email address');
                    isValid = false;
                }
            }

            if (input.name === 'phone' && sanitizedValue) {
                const phoneRegex = /^\+?[1-9]\d{1,14}$/;
                if (!phoneRegex.test(sanitizedValue.replace(/[\s-]/g, ''))) {
                    this.showFieldError(input, 'Please enter a valid phone number');
                    isValid = false;
                }
            }
            
            if ((input.type === 'text' || input.type === 'textarea') && 
                input.getAttribute('data-validate') === 'alphanumeric' && 
                sanitizedValue) {
                const alphanumericRegex = /^[a-zA-Z0-9\s.,'-]*$/;
                if (!alphanumericRegex.test(sanitizedValue)) {
                    this.showFieldError(input, 'Please use only letters, numbers, and basic punctuation');
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    showFieldError(input, message) {
        input.classList.add('border-red-500');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-500 text-sm mt-1';
        
        errorDiv.textContent = this.sanitizeString(message);
        
        input.parentElement.appendChild(errorDiv);
    }
    
    sanitizeString(str) {
        if (!str) return '';
        
        const sanitized = String(str)
            .replace(/<[^>]*>/g, '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
            
        return sanitized;
    }

    initNetworkErrorHandling() {
        // Handle fetch errors
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const url = args[0]?.toString() || '';
                const isAnalyticsRequest = url.includes('google-analytics.com') || 
                                         url.includes('analytics') || 
                                         url.includes('gtag') || 
                                         url.includes('collect');
                
                const response = await originalFetch(...args);
                
                if (!response.ok && !isAnalyticsRequest) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return response;
            } catch (error) {
                const url = args[0]?.toString() || '';
                const isOurDomain = url.includes(window.location.hostname) || 
                                   url.includes('web3forms.com') || 
                                   url.includes('api.') ||
                                   !url.includes('://'); // Relative URLs
                
                if (isOurDomain) {
                    this.handleNetworkError(error);
                }
                
                throw error;
            }
        };

        // Handle XHR errors
        const originalXHR = window.XMLHttpRequest;
        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            xhr.open = function(method, url, ...rest) {
                const isAnalyticsRequest = url.includes('google-analytics.com') || 
                                          url.includes('analytics') || 
                                          url.includes('gtag') || 
                                          url.includes('collect');
                
                if (!isAnalyticsRequest) {
                    xhr.addEventListener('error', () => {
                        const isOurDomain = url.includes(window.location.hostname) || 
                                           url.includes('web3forms.com') || 
                                           url.includes('api.') ||
                                           !url.includes('://'); // Relative URLs
                        
                        if (isOurDomain) {
                            this.handleNetworkError(new Error('Network request failed'));
                        }
                    });
                }
                
                return originalOpen.apply(this, [method, url, ...rest]);
            };
            return xhr;
        };
    }

    handleNetworkError(error) {
        console.error('Network Error:', error);
        const safeMessage = this.sanitizeString('Network error occurred. Please check your connection and try again.');
        this.showError(safeMessage);
    }

    handleAPIError(error) {
        console.error('API Error:', error);
        let message = 'An error occurred while processing your request.';
        
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    message = 'Invalid request. Please check your input.';
                    break;
                case 401:
                    message = 'Unauthorized. Please log in again.';
                    break;
                case 403:
                    message = 'Access denied. You don\'t have permission to perform this action.';
                    break;
                case 404:
                    message = 'The requested resource was not found.';
                    break;
                case 500:
                    message = 'Server error. Please try again later.';
                    break;
                default:
                    message = 'Error: ' + this.sanitizeString(error.response.status);
            }
        }
        
        this.showError(this.sanitizeString(message));
    }
}

// Initialize error handler
const errorHandler = new ErrorHandler();

// Export for use in other files
window.errorHandler = errorHandler; 