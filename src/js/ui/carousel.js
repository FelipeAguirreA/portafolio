// Carrusel de certificados
import { gsap } from '../lib/gsap.js';

// ============================================
// Carrusel de certificados (diseño v3)
// ============================================
const certTrack = document.getElementById('cert-track');
if (certTrack) {
    const certCards = [...certTrack.children].filter(c => c.classList.contains('cert'));
    const certCounter = document.getElementById('cert-count');
    const certTotal = String(certCards.length).padStart(2, '0');
    const stepSize = () =>
        certCards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(certTrack).gap || 0);

    document.getElementById('cert-prev')?.addEventListener('click', () =>
        certTrack.scrollBy({ left: -stepSize(), behavior: 'smooth' })
    );
    document.getElementById('cert-next')?.addEventListener('click', () =>
        certTrack.scrollBy({ left: stepSize(), behavior: 'smooth' })
    );

    if (certCounter) {
        const updateCount = () => {
            const i = Math.min(certCards.length - 1, Math.round(certTrack.scrollLeft / stepSize()));
            certCounter.textContent = `${String(i + 1).padStart(2, '0')} / ${certTotal}`;
        };
        certTrack.addEventListener('scroll', updateCount, { passive: true });
        updateCount();
    }

    // drag con mouse + lanzamiento con inercia (touch usa scroll nativo)
    let down = false, startX = 0, startL = 0, moved = 0, lastX = 0, lastT = 0, vel = 0;
    certTrack.addEventListener('dragstart', (e) => e.preventDefault());
    certTrack.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'mouse') return;
        down = true; moved = 0; vel = 0;
        startX = lastX = e.clientX;
        startL = certTrack.scrollLeft;
        lastT = performance.now();
        gsap.killTweensOf(certTrack);
        certTrack.classList.add('is-dragging');
    });
    window.addEventListener('pointermove', (e) => {
        if (!down) return;
        const dx = e.clientX - startX;
        moved = Math.max(moved, Math.abs(dx));
        certTrack.scrollLeft = startL - dx;
        const now = performance.now();
        const dt = now - lastT;
        if (dt > 0) { vel = (e.clientX - lastX) / dt; lastX = e.clientX; lastT = now; }
    });
    const endDrag = () => {
        if (!down) return;
        down = false;
        const step = stepSize();
        const max = certTrack.scrollWidth - certTrack.clientWidth;
        let target = certTrack.scrollLeft - vel * 300;
        target = Math.max(0, Math.min(max, Math.round(target / step) * step));
        gsap.to(certTrack, {
            scrollLeft: target, duration: 0.65, ease: 'power3.out',
            onComplete: () => certTrack.classList.remove('is-dragging'),
        });
    };
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    // si hubo drag, no abrir el modal
    certTrack.addEventListener('click', (e) => {
        if (moved > 6) { e.preventDefault(); e.stopPropagation(); }
    }, true);

    // tilt 3D que sigue al mouse
    if (matchMedia('(pointer: fine)').matches) {
        certCards.forEach((card) => {
            const base = parseFloat(getComputedStyle(card).getPropertyValue('--tilt')) || 0;
            card.addEventListener('pointermove', (e) => {
                if (certTrack.classList.contains('is-dragging')) return;
                const r = card.getBoundingClientRect();
                const rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
                const ry = ((e.clientX - r.left) / r.width - 0.5) * 7;
                card.style.transform = `perspective(1100px) rotate(${base * 0.25}deg) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.015)`;
            });
            card.addEventListener('pointerleave', () => { card.style.transform = ''; });
        });
    }
}

