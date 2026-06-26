// Formulario de contacto + modal de exito
import { gsap } from '../lib/gsap.js';


// ============================================
// Contact Form Handler
// ============================================
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const payload = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.querySelector('span').textContent;
        
        // Deshabilitar botón y mostrar estado
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'Enviando...';
        
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const contentType = response.headers.get('content-type');
            let errorData;
            
            if (!response.ok) {
                // Intentar parsear como JSON, si no es posible obtener texto plano
                if (contentType && contentType.includes('application/json')) {
                    errorData = await response.json();
                } else {
                    const text = await response.text();
                    console.error('Error response (not JSON):', text);
                    throw new Error('Error del servidor. Revisa los logs de Vercel.');
                }
                throw new Error(errorData.error || 'Error al enviar');
            }
            
            // Éxito
            openSuccessModal();
            contactForm.reset();
            
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Hubo un error al enviar el mensaje. Por favor, intenta más tarde o contáctame directamente por email.');
        } finally {
            // Restaurar botón
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = originalText;
        }
    });
}

// ============================================
// Success Modal Functions
// ============================================
function openSuccessModal() {
    const modal = document.getElementById('success-modal');
    const content = modal.querySelector('.modal-content');
    const overlay = modal.querySelector('.modal-overlay');

    // Kill tweens to avoid conflicts on repeated opens
    gsap.killTweensOf([content, overlay]);

    // Ensure initial state before animation
    gsap.set(content, { scale: 0.8, opacity: 0 });
    gsap.set(overlay, { opacity: 0 });

    modal.classList.add('active');

    // Foco al boton de cierre (accesibilidad por teclado)
    modal.querySelector('#success-close')?.focus();

    // Animate scoped elements
    gsap.to(content, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'back.out(1.2)'
    });

    gsap.to(overlay, {
        opacity: 1,
        duration: 0.3
    });
}

function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    const content = modal.querySelector('.modal-content');
    const overlay = modal.querySelector('.modal-overlay');

    gsap.to(content, {
        scale: 0.95,
        opacity: 0,
        duration: 0.25,
        ease: 'back.in(1.2)',
        onComplete: () => {
            modal.classList.remove('active');
            // Reset overlay for next open
            gsap.set(overlay, { opacity: 0 });
        }
    });
}

// Cierre del modal: boton, clic en el overlay y tecla Escape.
// (Antes era un onclick inline que dependia de una funcion global; al
//  modularizar dejo de existir en window, asi que se cablea aca.)
const successModal = document.getElementById('success-modal');
if (successModal) {
    successModal.querySelector('#success-close')?.addEventListener('click', closeSuccessModal);
    successModal.querySelector('[data-close]')?.addEventListener('click', closeSuccessModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && successModal.classList.contains('active')) {
            closeSuccessModal();
        }
    });
}

