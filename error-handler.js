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
        errorElement.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-2"></i>
                <p>${message}</p>
            </div>
        `;
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

            // Validate required fields
            if (input.hasAttribute('required') && !input.value.trim()) {
                this.showFieldError(input, 'This field is required');
                isValid = false;
            }

            // Validate email
            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    this.showFieldError(input, 'Please enter a valid email address');
                    isValid = false;
                }
            }

            // Validate phone
            if (input.name === 'phone' && input.value) {
                const phoneRegex = /^\+?[\d\s-]{10,}$/;
                if (!phoneRegex.test(input.value)) {
                    this.showFieldError(input, 'Please enter a valid phone number');
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
        input.parentElement.appendChild(errorDiv);
    }

    initNetworkErrorHandling() {
        // Handle fetch errors
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response;
            } catch (error) {
                this.handleNetworkError(error);
                throw error;
            }
        };

        // Handle XHR errors
        const originalXHR = window.XMLHttpRequest;
        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            xhr.open = function() {
                xhr.addEventListener('error', () => {
                    this.handleNetworkError(new Error('Network request failed'));
                });
                return originalOpen.apply(this, arguments);
            };
            return xhr;
        };
    }

    handleNetworkError(error) {
        console.error('Network Error:', error);
        this.showError('Network error occurred. Please check your connection and try again.');
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
                    message = `Error: ${error.response.status}`;
            }
        }
        
        this.showError(message);
    }
}

// Initialize error handler
const errorHandler = new ErrorHandler();

// Export for use in other files
window.errorHandler = errorHandler; 