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
            const keyElements = document.querySelectorAll('#web3forms-key, #web3forms-key-footer');
            let apiKeyFound = false;
            
            keyElements.forEach(element => {
                if (element && element.value) {
                    apiKeyFound = true;
                }
            });
            
            if (!apiKeyFound && typeof config !== 'undefined' && config.web3forms && config.web3forms.accessKey) {
                keyElements.forEach(element => {
                    if (element) {
                        element.value = config.web3forms.accessKey;
                        apiKeyFound = true;
                    }
                });
            }
            
            if (!apiKeyFound) {
                keyElements.forEach(element => {
                    if (element && element.dataset.apikey) {
                        element.value = element.dataset.apikey;
                        apiKeyFound = true;
                    }
                });
            }
            
            if (!apiKeyFound) {
                console.warn('Web3Forms API key not found. Contact forms will not work.');
                
                if (this.form) {
                    const submitButton = this.form.querySelector('button[type="submit"]');
                    if (submitButton) {
                        submitButton.disabled = true;
                        submitButton.title = 'Form submission is disabled - API key not configured';
                    }
                    
                    const formNotice = document.createElement('div');
                    formNotice.className = 'bg-yellow-50 text-yellow-700 p-3 rounded mt-4';
                    formNotice.textContent = 'Contact form is currently disabled. Please contact the administrator.';
                    this.form.appendChild(formNotice);
                }
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
        
        const honeyPotField = document.getElementById('website');
        if (honeyPotField && honeyPotField.value) {
            console.log('Bot submission detected');

            this.showSuccessMessage();
            this.resetForm();
            return;
        }

        const submitButton = this.form.querySelector('button[type="submit"]');
        const submitText = submitButton.querySelector('.submit-text');
        const loadingSpinner = submitButton.querySelector('.loading-spinner');
        
        this.showLoadingState(submitButton, submitText, loadingSpinner);
        
        try {
            if (this.isThrottled()) {
                throw new Error('Please wait before submitting again');
            }
            
            this.lastSubmissionTime = Date.now();
            
            const formData = new FormData(this.form);
            
            this.cleanFormData(formData);
            
            const result = await this.submitForm(formData);

            if (result.success) {
                this.showSuccessMessage();
                this.resetForm();
            } else {
                throw new Error(this.sanitizeString(result.message) || 'Failed to send message');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            const safeErrorMessage = this.sanitizeString(error.message) || 'Failed to send message. Please try again later.';
            this.showErrorMessage(safeErrorMessage);
        } finally {
            this.hideLoadingState(submitButton, submitText, loadingSpinner);
        }
    }
    
    isThrottled() {
        const now = Date.now();
        const throttleTime = 10000;
        
        if (!this.lastSubmissionTime) {
            return false;
        }
        
        return (now - this.lastSubmissionTime) < throttleTime;
    }
    
    cleanFormData(formData) {
        const allowedFields = ['name', 'email', 'phone', 'message', 'subject', 'company', 'web3forms-key'];
        const keys = Array.from(formData.keys());
        
        keys.forEach(key => {
            if (!allowedFields.includes(key)) {
                formData.delete(key);
            }
        });
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
                return;
            }
            
            const sanitizedValue = this.sanitizeString(input.value);
            
            if (input.hasAttribute('required') && !sanitizedValue.trim()) {
                isValid = false;
                this.showInputError(input, 'This field is required');
                return;
            }
            
            if (input.type === 'email' && sanitizedValue) {
                const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                if (!emailRegex.test(sanitizedValue) || sanitizedValue.length > 254) {
                    isValid = false;
                    this.showInputError(input, 'Please enter a valid email address');
                }
            }
            
            if (input.name === 'phone' && sanitizedValue) {
                const phoneRegex = /^\+?[1-9]\d{1,14}$/;
                if (!phoneRegex.test(sanitizedValue.replace(/[\s-]/g, ''))) {
                    isValid = false;
                    this.showInputError(input, 'Please enter a valid phone number');
                }
            }
            
            if ((input.name === 'name' || input.name === 'fullname') && sanitizedValue) {
                const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;
                if (!nameRegex.test(sanitizedValue)) {
                    isValid = false;
                    this.showInputError(input, 'Please enter a valid name (letters, spaces, hyphens, and apostrophes only)');
                }
            }
            
            if (input.name === 'message' && sanitizedValue) {
                if (sanitizedValue.length < 10) {
                    isValid = false;
                    this.showInputError(input, 'Message must be at least 10 characters long');
                } else if (sanitizedValue.length > 1000) {
                    isValid = false;
                    this.showInputError(input, 'Message cannot exceed 1000 characters');
                }
            }
        });

        return isValid;
    }
    
    showInputError(input, message) {
        input.classList.add('error');
        input.classList.remove('success');
        
        const wrapper = input.closest('.input-wrapper');
        if (!wrapper) return;
        
        let errorElement = wrapper.querySelector('.input-error');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'input-error text-red-500 text-sm mt-1';
            wrapper.appendChild(errorElement);
        }
        
        errorElement.textContent = this.sanitizeString(message);
        errorElement.classList.add('show');
    }

    /**
     * Submit form data to API
     */
    async submitForm(formData) {
        const sanitizedFormData = new FormData();
        
        for (let [key, value] of formData.entries()) {
            const sanitizedValue = this.sanitizeString(value);

            sanitizedFormData.append(key, sanitizedValue);
        }
        
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: sanitizedFormData,
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

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
        
        const container = document.createElement('div');
        container.className = 'flex items-center';
        
        const icon = document.createElement('i');
        icon.className = `${iconClass} mr-2`;
        
        const textSpan = document.createElement('span');
        textSpan.textContent = this.sanitizeString(text);
        
        container.appendChild(icon);
        container.appendChild(textSpan);
        messageElement.appendChild(container);
        
        return messageElement;
    }
    
    sanitizeString(str) {
        if (!str) return '';
        
        const sanitized = String(str)
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
            
        return sanitized;
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