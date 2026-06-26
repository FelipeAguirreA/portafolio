// Particulas de fondo
import { gsap } from '../lib/gsap.js';

// ============================================
// Partículas de Fondo
// ============================================
export function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particlesContainer.appendChild(particle);
        
        gsap.to(particle, {
            y: -window.innerHeight,
            x: (Math.random() - 0.5) * 200,
            opacity: 0,
            duration: Math.random() * 10 + 10,
            repeat: -1,
            delay: Math.random() * 5,
            ease: 'none'
        });
    }
}

// Función para crear partículas en la sección de proyectos
export function createProjectParticles() {
    const projectsSection = document.querySelector('.projects-particles');
    if (!projectsSection) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        projectsSection.appendChild(particle);
        
        gsap.to(particle, {
            y: Math.random() * 100 - 50,
            x: Math.random() * 100 - 50,
            opacity: 0.3,
            duration: Math.random() * 10 + 10,
            repeat: -1,
            delay: Math.random() * 5,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }
}

// NO ejecutar aquí - esperar al DOMContentLoaded

