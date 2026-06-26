// Parallax del hero
import { gsap } from '../lib/gsap.js';

// ============================================
// Parallax Effect en Hero
// ============================================
gsap.to('.visual-container', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
    },
    y: 150,
    ease: 'none'
});

