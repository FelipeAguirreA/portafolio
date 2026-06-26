// Punto de entrada de la app (Vite).
// Importa estilos + librerias base + cada modulo de comportamiento,
// en el MISMO orden en que corria el script.js original.
import './styles/index.css';

// Librerias base (registran plugins / preparan estado al importarse)
import { gsap, ScrollTrigger } from './js/lib/gsap.js';
import { initLenis } from './js/lib/lenis.js';

// Comportamiento por modulo (orden = orden del script original)
import { createParticles, createProjectParticles } from './js/ui/particles.js';
import './js/ui/navbar.js';
import './js/hero/timeline.js';
import './js/ui/reveals.js';
import './js/ui/smooth-scroll.js';
import './js/ui/parallax.js';
import './js/ui/magnetic.js';
import './js/ui/carousel.js';
import './js/ui/lightbox.js';
import './js/effects/fluid.js';
import './js/form/contact.js';
import './js/hero/neural.js';

// Arranque (antes vivia en el bloque "Initialize" del script).
// Respeta a quien pidio menos movimiento: no inicializa particulas.
window.addEventListener('DOMContentLoaded', () => {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    createParticles();
    createProjectParticles();
  }
});

// Smooth-scroll (Lenis) + barra de progreso, una vez que todo cargo.
window.addEventListener('load', () => {
  initLenis();

  gsap.to('.scroll-progress', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0.3 },
  });

  // Recalcular posiciones de ScrollTrigger tras el layout final.
  setTimeout(() => ScrollTrigger.refresh(), 100);
});
