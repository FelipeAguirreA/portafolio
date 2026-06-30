// Smooth-scroll (Lenis) como estado compartido del modulo.
// initLenis() lo crea (respetando reduced-motion); getLenis() lo expone
// a quien lo necesite (ej. el smooth-scroll de los links internos).
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap.js';

let lenis = null;

export function initLenis() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  // lerp mas alto = el scroll persigue el input mas de cerca (menos inercia/arrastre).
  // 0.1 (default) se sentia "pesado"; 0.14 lo hace mas directo sin perder suavidad.
  lenis = new Lenis({ lerp: 0.14, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function getLenis() {
  return lenis;
}
