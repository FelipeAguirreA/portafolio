// Reveals de secciones (about/skills/projects/certs/contact/footer)
import { gsap, ScrollTrigger } from '../lib/gsap.js';

// ============================================
// About Section Animations
// ============================================
gsap.from('.about .section-header', {
    scrollTrigger: {
        trigger: '.about',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    y: 80,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

gsap.from('.about-text', {
    scrollTrigger: {
        trigger: '.about-content',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    x: -80,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out'
});

gsap.from('.about-image', {
    scrollTrigger: {
        trigger: '.about-content',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    x: 80,
    opacity: 0,
    duration: 1
});

// Contador animado
const statNumbers = document.querySelectorAll('.stat-number');

statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-count'));
    
    ScrollTrigger.create({
        trigger: stat,
        start: 'top 80%',
        onEnter: () => {
            gsap.to(stat, {
                innerText: target,
                duration: 2,
                snap: { innerText: 1 },
                ease: 'power2.out'
            });
        },
        once: true
    });
});

// ============================================
// Skills Section Animations
// ============================================
gsap.from('.skills .section-header', {
    scrollTrigger: {
        trigger: '.skills',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    y: 80,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

// Asegurar que las tarjetas sean visibles por defecto
gsap.set('.skill-group', { opacity: 1, y: 0, scale: 1 });

// Animación moderna de tarjetas con scale y stagger
gsap.fromTo('.skill-group',
    {
        y: 60,
        scale: 0.9,
        opacity: 0
    },
    {
        scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        },
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.2)'
    }
);

// ============================================
// Projects Section Animations
// ============================================
gsap.from('.projects .section-header', {
    scrollTrigger: {
        trigger: '.projects',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    y: 80,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

// Asegurar que las tarjetas de proyectos sean visibles por defecto
gsap.set('.project-card', { opacity: 1, y: 0, scale: 1, rotationX: 0 });

// Animación moderna de tarjetas de proyectos con efecto 3D
gsap.fromTo('.project-card',
    {
        y: 80,
        rotationX: 15,
        scale: 0.9,
        opacity: 0
    },
    {
        scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        },
        y: 0,
        rotationX: 0,
        scale: 1,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        transformPerspective: 1000
    }
);

// (Hover de project cards: lo maneja el CSS W3 + el decode del título)

// ============================================
// Certificates Section Animations
// ============================================
gsap.from('.certificates .section-header', {
    scrollTrigger: {
        trigger: '.certificates',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    y: 80,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

// Asegurar que los certificados sean visibles por defecto
gsap.set('.cert', { opacity: 1, y: 0, scale: 1, rotationY: 0 });

// Animación de certificados con efecto flip
gsap.fromTo('.cert',
    {
        y: 60,
        rotationY: 25,
        scale: 0.85,
        opacity: 0
    },
    {
        scrollTrigger: {
            trigger: '.carousel',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        },
        y: 0,
        rotationY: 0,
        scale: 1,
        opacity: 1,
        duration: 1,
        stagger: 0.12,
        ease: 'back.out(1.5)',
        transformPerspective: 1200
    }
);

// ============================================
// Contact Section Animations
// ============================================
// Ensure default visible state, then animate in
gsap.set('.contact .section-header', { opacity: 1, y: 0 });
gsap.fromTo('.contact .section-header', {
    y: 80,
    opacity: 0
}, {
    scrollTrigger: {
        trigger: '.contact',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    y: 0,
    opacity: 1,
    duration: 1,
    ease: 'power3.out'
});

gsap.set('.contact-info', { opacity: 1, x: 0 });
gsap.fromTo('.contact-info', {
    x: -50,
    opacity: 0
}, {
    scrollTrigger: {
        trigger: '.contact-content',
        start: 'top 70%'
    },
    x: 0,
    opacity: 1,
    duration: 1
});

gsap.set('.contact-form', { opacity: 1, x: 0 });
gsap.fromTo('.contact-form', {
    x: 60,
    opacity: 0
}, {
    scrollTrigger: {
        trigger: '.contact-content',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    x: 0,
    opacity: 1,
    duration: 1.2,
    ease: 'power3.out'
});

// Social links animados individualmente
gsap.set('.social-link', { opacity: 1, scale: 1, rotation: 0 });
gsap.fromTo('.social-link', {
    scale: 0.85,
    rotation: 180,
    opacity: 0
}, {
    scrollTrigger: {
        trigger: '.contact-info',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    scale: 1,
    rotation: 0,
    opacity: 1,
    duration: 0.6,
    stagger: 0.08,
    ease: 'back.out(2)'
});

// Social links hover animation
document.querySelectorAll('.social-link').forEach((link, index) => {
    link.addEventListener('mouseenter', () => {
        gsap.to(link, {
            scale: 1.2,
            rotation: 360,
            duration: 0.5
        });
    });
    
    link.addEventListener('mouseleave', () => {
        gsap.to(link, {
            scale: 1,
            rotation: 0,
            duration: 0.5
        });
    });
});

// ============================================
// Footer Animations
// ============================================
gsap.from('.footer-content', {
    scrollTrigger: {
        trigger: '.footer',
        start: 'top 90%'
    },
    y: 30,
    opacity: 0,
    duration: 0.8
});

