// Smooth-scroll de links internos
import { gsap } from '../lib/gsap.js';
import { getLenis } from '../lib/lenis.js';

// ============================================
// Smooth Scroll para links internos con Lenis
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        
        if (target && getLenis()) {
            // Scroll suave vía Lenis
            getLenis().scrollTo(target, { offset: -80 });
        } else if (target) {
            // Fallback (reduced-motion o Lenis no disponible)
            gsap.to(window, {
                duration: 0.8,
                scrollTo: { y: target, offsetY: 80 },
                ease: 'power3.inOut'
            });
        }
    });
});

// ============================================


// ============================================
// Form Animation
// ============================================
// El envío real del formulario vive en UN solo handler más abajo
// (#contact-form → fetch('/api/send-email') + modal de éxito).

