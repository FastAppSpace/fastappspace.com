/**
 * Contact Form Handler for FastApp Space
 * Handles form submission, validation, and user feedback
 */

class ContactFormHandler {
    constructor() {
        this.form = null;
        this.inputs = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupAPIKeys();
            this.setupForm();
            this.setupValidation();
        });
    }

    /**
     * Setup API keys from config
     */
    setupAPIKeys() {
        try {
            if (typeof config !== 'undefined' && config.web3forms && config.web3forms.accessKey) {
                const keyElements = document.querySelectorAll('#web3forms-key, #web3forms-key-footer');
                keyElements.forEach(element => {
                    if (element) {
                        element.value = config.web3forms.accessKey;
                    }
                });
                console.log('Web3Forms API keys configured successfully');
            } else {
                console.warn('Web3Forms API key not found in config. Contact forms will not work.');
            }
        } catch (error) {
            console.error('Error setting up API keys:', error);
        }
    }

    /**
     * Setup form event listeners
     */
    setupForm() {
        this.form = document.getElementById('contactForm');
        if (!this.form) return;

        this.inputs = this.form.querySelectorAll('input, textarea');
        this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
    }

    /**
     * Setup input validation
     */
    setupValidation() {
        if (!this.inputs) return;

        this.inputs.forEach(input => {
            const wrapper = input.closest('.input-wrapper');
            
            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    input.classList.add('dirty');
                }
                this.validateInput(input, wrapper);
            });

            input.addEventListener('blur', () => {
                this.validateInput(input, wrapper);
            });
        });
    }

    /**
     * Validate individual input field
     */
    validateInput(input, wrapper) {
        if (!wrapper) return;

        const errorElement = wrapper.querySelector('.input-error');

        if (input.validity.valid) {
            input.classList.remove('error');
            input.classList.add('success');
            if (errorElement) errorElement.classList.remove('show');
        } else {
            input.classList.remove('success');
            if (input.value.length > 0) {
                input.classList.add('error');
                if (errorElement) errorElement.classList.add('show');
            }
        }
    }

    /**
     * Handle form submission
     */
    async handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate all inputs before submission
        if (!this.validateAllInputs()) {
            return;
        }

        const submitButton = this.form.querySelector('button[type="submit"]');
        const submitText = submitButton.querySelector('.submit-text');
        const loadingSpinner = submitButton.querySelector('.loading-spinner');
        
        this.showLoadingState(submitButton, submitText, loadingSpinner);
        
        try {
            const formData = new FormData(this.form);
            const result = await this.submitForm(formData);

            if (result.success) {
                this.showSuccessMessage();
                this.resetForm();
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage(error.message || 'Failed to send message. Please try again later.');
        } finally {
            this.hideLoadingState(submitButton, submitText, loadingSpinner);
        }
    }

    /**
     * Validate all form inputs
     */
    validateAllInputs() {
        let isValid = true;
        
        this.inputs.forEach(input => {
            if (!input.validity.valid) {
                isValid = false;
                input.classList.add('error');
                const wrapper = input.closest('.input-wrapper');
                const errorElement = wrapper?.querySelector('.input-error');
                if (errorElement) errorElement.classList.add('show');
            }
        });

        return isValid;
    }

    /**
     * Submit form data to API
     */
    async submitForm(formData) {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: formData
        });

        return await response.json();
    }

    /**
     * Show loading state on submit button
     */
    showLoadingState(submitButton, submitText, loadingSpinner) {
        submitButton.disabled = true;
        if (submitText) submitText.classList.add('hidden');
        if (loadingSpinner) loadingSpinner.classList.remove('hidden');
    }

    /**
     * Hide loading state on submit button
     */
    hideLoadingState(submitButton, submitText, loadingSpinner) {
        submitButton.disabled = false;
        if (submitText) submitText.classList.remove('hidden');
        if (loadingSpinner) loadingSpinner.classList.add('hidden');
    }

    /**
     * Show success message
     */
    showSuccessMessage() {
        const successMessage = this.createMessage(
            'success',
            'fas fa-check-circle',
            'Message sent successfully! We\'ll get back to you soon.',
            'bg-green-50 text-green-700'
        );
        
        this.form.appendChild(successMessage);
        this.removeMessageAfterDelay(successMessage);
    }

    /**
     * Show error message
     */
    showErrorMessage(message) {
        const errorMessage = this.createMessage(
            'error',
            'fas fa-exclamation-circle',
            message,
            'bg-red-50 text-red-700'
        );
        
        this.form.appendChild(errorMessage);
        this.removeMessageAfterDelay(errorMessage);
    }

    /**
     * Create message element
     */
    createMessage(type, iconClass, text, colorClasses) {
        const messageElement = document.createElement('div');
        messageElement.className = `mt-4 p-4 ${colorClasses} rounded-md ${type}-message`;
        
        // Create elements safely without innerHTML to prevent XSS
        const container = document.createElement('div');
        container.className = 'flex items-center';
        
        const icon = document.createElement('i');
        icon.className = `${iconClass} mr-2`;
        
        const textSpan = document.createElement('span');
        textSpan.textContent = text; // Use textContent instead of innerHTML
        
        container.appendChild(icon);
        container.appendChild(textSpan);
        messageElement.appendChild(container);
        
        return messageElement;
    }

    /**
     * Remove message after delay with animation
     */
    removeMessageAfterDelay(messageElement, delay = 5000) {
        setTimeout(() => {
            messageElement.style.opacity = '0';
            messageElement.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 300);
        }, delay);
    }

    /**
     * Reset form to initial state
     */
    resetForm() {
        this.form.reset();
        this.inputs.forEach(input => {
            input.classList.remove('success', 'error', 'dirty');
            const wrapper = input.closest('.input-wrapper');
            const errorElement = wrapper?.querySelector('.input-error');
            if (errorElement) errorElement.classList.remove('show');
        });
    }
}

// Initialize contact form handler
new ContactFormHandler();