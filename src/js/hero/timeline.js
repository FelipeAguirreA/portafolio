// Timeline de animacion del hero
import { gsap } from '../lib/gsap.js';

// ============================================
// Hero Animations
// ============================================
const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

heroTimeline
    .from('.hero-greeting', {
        y: 50,
        opacity: 0,
        duration: 0.8
    })
    // La foto entra temprano (segunda), junto con la red neuronal
    .from('.profile-image', {
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.5)'
    }, '-=0.3')
    .from('.hero-neural', {
        opacity: 0,
        duration: 1.4,
        ease: 'power2.out'
    }, '<')
    .from('.title-line', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2
    }, '-=0.8')
    .from('.hero-lead', {
        y: 30,
        opacity: 0,
        duration: 0.8
    }, '-=0.6')
    .from('.hero-role', {
        y: 30,
        opacity: 0,
        duration: 0.8
    }, '-=0.5')
    .from('.hero-description', {
        y: 30,
        opacity: 0,
        duration: 0.8
    }, '-=0.5');

    // Asegurar que los botones sean visibles por defecto
    gsap.set('.hero-buttons .btn', { opacity: 1, y: 0 });

    heroTimeline.from('.hero-buttons .btn', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
    }, '-=0.5')
    .from('.scroll-indicator', {
        y: 20,
        opacity: 0,
        duration: 0.8
    }, '-=0.5');

