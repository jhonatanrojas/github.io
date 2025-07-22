/**
 * Contact Form Handler
 * Maneja el envío del formulario de contacto con validación y feedback
 */

class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = this.form.querySelector('button[type="submit"]');
        this.originalBtnText = this.submitBtn.innerHTML;
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.addRealTimeValidation();
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        this.showLoading();
        
        // Simular envío (en producción, aquí iría la llamada al servidor)
        setTimeout(() => {
            this.showSuccess();
            this.resetForm();
        }, 2000);
    }
    
    validateForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        let isValid = true;
        
        // Limpiar errores previos
        this.clearErrors();
        
        // Validar nombre
        if (!data.name || data.name.trim().length < 2) {
            this.showError('name', 'El nombre debe tener al menos 2 caracteres');
            isValid = false;
        }
        
        // Validar email
        if (!data.email || !this.isValidEmail(data.email)) {
            this.showError('email', 'Por favor, ingresa un email válido');
            isValid = false;
        }
        
        // Validar mensaje
        if (!data.message || data.message.trim().length < 10) {
            this.showError('message', 'El mensaje debe tener al menos 10 caracteres');
            isValid = false;
        }
        
        return isValid;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showError(fieldName, message) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-500 text-sm mt-1';
        errorDiv.textContent = message;
        
        field.classList.add('border-red-500');
        field.parentNode.appendChild(errorDiv);
    }
    
    clearErrors() {
        // Remover clases de error
        this.form.querySelectorAll('.border-red-500').forEach(field => {
            field.classList.remove('border-red-500');
        });
        
        // Remover mensajes de error
        this.form.querySelectorAll('.error-message').forEach(error => {
            error.remove();
        });
        
        // Remover mensaje de éxito previo
        const successMessage = this.form.querySelector('.success-message');
        if (successMessage) {
            successMessage.remove();
        }
    }
    
    showLoading() {
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = `
            <div class="loading"></div>
            Enviando...
        `;
    }
    
    showSuccess() {
        this.submitBtn.disabled = false;
        this.submitBtn.innerHTML = this.originalBtnText;
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message show';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle mr-2"></i>
            ¡Mensaje enviado exitosamente! Te responderé pronto.
        `;
        
        this.form.appendChild(successDiv);
        
        // Remover mensaje después de 5 segundos
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
    
    resetForm() {
        this.form.reset();
    }
    
    addRealTimeValidation() {
        const fields = this.form.querySelectorAll('input, textarea, select');
        
        fields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
            
            field.addEventListener('input', () => {
                // Limpiar error si el usuario está escribiendo
                if (field.classList.contains('border-red-500')) {
                    field.classList.remove('border-red-500');
                    const errorMsg = field.parentNode.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
            });
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const name = field.name;
        
        // Limpiar errores previos del campo
        field.classList.remove('border-red-500');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Validaciones específicas
        switch (name) {
            case 'name':
                if (value.length > 0 && value.length < 2) {
                    this.showError(name, 'El nombre debe tener al menos 2 caracteres');
                }
                break;
                
            case 'email':
                if (value.length > 0 && !this.isValidEmail(value)) {
                    this.showError(name, 'Por favor, ingresa un email válido');
                }
                break;
                
            case 'message':
                if (value.length > 0 && value.length < 10) {
                    this.showError(name, 'El mensaje debe tener al menos 10 caracteres');
                }
                break;
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});

/**
 * Email Service Integration
 * Para integrar con servicios como EmailJS, Formspree, etc.
 */
class EmailService {
    static async sendEmail(formData) {
        // Ejemplo de integración con EmailJS
        // return emailjs.send('service_id', 'template_id', formData);
        
        // Ejemplo de integración con Formspree
        // return fetch('https://formspree.io/f/your-form-id', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });
        
        // Por ahora, simular envío exitoso
        return new Promise((resolve) => {
            setTimeout(() => resolve({ success: true }), 1000);
        });
    }
}

/**
 * Analytics Integration
 * Para trackear eventos del formulario
 */
class FormAnalytics {
    static trackFormSubmission(data) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                event_category: 'Contact',
                event_label: 'Contact Form',
                value: 1
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Contact');
        }
        
        // Custom analytics
        console.log('Form submitted:', {
            timestamp: new Date().toISOString(),
            projectType: data['project-type'],
            budget: data.budget,
            hasCompany: !!data.company
        });
    }
    
    static trackFormError(errorType) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_error', {
                event_category: 'Contact',
                event_label: errorType,
                value: 1
            });
        }
    }
}

/**
 * Form Enhancement Features
 */
class FormEnhancements {
    static addCharacterCounter() {
        const messageField = document.getElementById('message');
        const maxLength = 1000;
        
        const counter = document.createElement('div');
        counter.className = 'character-counter text-sm text-gray-500 mt-1 text-right';
        counter.textContent = `0/${maxLength}`;
        
        messageField.parentNode.appendChild(counter);
        
        messageField.addEventListener('input', () => {
            const length = messageField.value.length;
            counter.textContent = `${length}/${maxLength}`;
            
            if (length > maxLength * 0.9) {
                counter.classList.add('text-orange-500');
            } else {
                counter.classList.remove('text-orange-500');
            }
            
            if (length >= maxLength) {
                counter.classList.add('text-red-500');
                counter.classList.remove('text-orange-500');
            } else {
                counter.classList.remove('text-red-500');
            }
        });
    }
    
    static addAutoSave() {
        const form = document.getElementById('contact-form');
        const fields = form.querySelectorAll('input, textarea, select');
        
        // Cargar datos guardados
        fields.forEach(field => {
            const savedValue = localStorage.getItem(`contact_form_${field.name}`);
            if (savedValue && field.type !== 'submit') {
                field.value = savedValue;
            }
        });
        
        // Guardar cambios automáticamente
        fields.forEach(field => {
            field.addEventListener('input', () => {
                localStorage.setItem(`contact_form_${field.name}`, field.value);
            });
        });
        
        // Limpiar datos guardados al enviar exitosamente
        form.addEventListener('submit', () => {
            setTimeout(() => {
                fields.forEach(field => {
                    localStorage.removeItem(`contact_form_${field.name}`);
                });
            }, 3000);
        });
    }
}

// Inicializar mejoras adicionales
document.addEventListener('DOMContentLoaded', () => {
    FormEnhancements.addCharacterCounter();
    FormEnhancements.addAutoSave();
});