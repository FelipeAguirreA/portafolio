// GSAP centralizado: registra los plugins UNA vez al importarse.
// Cualquier modulo que necesite animar importa desde aca, no del global.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export { gsap, ScrollTrigger, ScrollToPlugin };
