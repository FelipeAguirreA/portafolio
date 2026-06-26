// Lightbox de certificados + decode de tarjetas
import { gsap } from '../lib/gsap.js';

// ============================================
// Certificate Lightbox (galería con navegación — diseño v3)
// ============================================
const certDialog = document.getElementById('cert-dialog');
if (certDialog) {
    const dFrame = certDialog.querySelector('.lightbox__frame');
    const dImg = document.getElementById('cert-img');
    const dTitle = document.getElementById('cert-title');
    const dDesc = document.getElementById('cert-desc');
    const dCounter = document.getElementById('cert-counter');
    const certButtons = [...document.querySelectorAll('.cert')];
    const certData = certButtons.map(b => ({
        img: b.dataset.certImage,
        title: b.dataset.certTitle,
        desc: b.dataset.certDesc,
    }));
    let certIndex = 0;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    function renderCert(i, dir = 0) {
        certIndex = (i + certData.length) % certData.length;
        const c = certData[certIndex];
        const swap = () => {
            dImg.src = c.img;
            dImg.alt = c.title;
            dTitle.textContent = c.title;
            dDesc.textContent = c.desc;
            dCounter.textContent = `${String(certIndex + 1).padStart(2, '0')} / ${String(certData.length).padStart(2, '0')}`;
        };
        if (reducedMotion || dir === 0) { swap(); return; }
        // deslizamiento direccional al navegar
        gsap.to([dImg, dTitle, dDesc], {
            x: dir * -26, opacity: 0, duration: 0.18, ease: 'power2.in',
            onComplete: () => {
                swap();
                gsap.fromTo([dImg, dTitle, dDesc],
                    { x: dir * 26, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out', stagger: 0.04 }
                );
            },
        });
    }

    function openCert(i) {
        renderCert(i);
        certDialog.showModal();
        if (!reducedMotion) {
            gsap.fromTo(dFrame,
                { y: 36, scale: 0.95, opacity: 0 },
                { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' }
            );
            gsap.fromTo(dImg,
                { clipPath: 'inset(0 100% 0 0)' },
                { clipPath: 'inset(0 0% 0 0)', duration: 0.7, delay: 0.15, ease: 'power3.inOut' }
            );
            gsap.fromTo(certDialog.querySelectorAll('.lightbox__panel > *'),
                { x: 22, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, delay: 0.25, stagger: 0.07, ease: 'power2.out' }
            );
        }
    }

    function closeCert() {
        if (reducedMotion) { certDialog.close(); return; }
        gsap.to(dFrame, {
            y: 22, scale: 0.97, opacity: 0, duration: 0.25, ease: 'power2.in',
            onComplete: () => certDialog.close(),
        });
    }

    certButtons.forEach((btn, i) => btn.addEventListener('click', () => openCert(i)));
    document.getElementById('cert-close').addEventListener('click', closeCert);
    document.getElementById('cert-d-prev').addEventListener('click', () => renderCert(certIndex - 1, -1));
    document.getElementById('cert-d-next').addEventListener('click', () => renderCert(certIndex + 1, 1));
    certDialog.addEventListener('click', (e) => { if (e.target === certDialog) closeCert(); });
    certDialog.addEventListener('cancel', (e) => { e.preventDefault(); closeCert(); });
    certDialog.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') renderCert(certIndex - 1, -1);
        if (e.key === 'ArrowRight') renderCert(certIndex + 1, 1);
    });
}

// Manejo de clic en tarjetas de proyecto + decode del título al hover (estilo W3)
const decodeChars = '01<>/{}[]#$%&*+=';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
        // No ejecutar si se hace clic en el enlace directo del overlay
        if (e.target.closest('.project-link')) return;

        const projectUrl = card.getAttribute('data-project-url');
        if (projectUrl) {
            window.open(projectUrl, '_blank');
        }
    });

    // Agregar efecto visual de cursor
    card.style.cursor = 'pointer';

    // Decode del título al pasar el mouse (se salta si se pidió menos movimiento)
    const titleEl = card.querySelector('.project-info h3');
    if (titleEl && !reduceMotion) {
        const original = titleEl.textContent;
        card.addEventListener('mouseenter', () => {
            let frame = 0;
            clearInterval(titleEl._decodeTimer);
            titleEl._decodeTimer = setInterval(() => {
                titleEl.textContent = original.split('').map((ch, i) => {
                    if (ch === ' ') return ' ';
                    if (i < frame / 2) return ch;
                    return decodeChars[Math.floor(Math.random() * decodeChars.length)];
                }).join('');
                frame++;
                if (frame / 2 > original.length) { clearInterval(titleEl._decodeTimer); titleEl.textContent = original; }
            }, 45);
        });
        card.addEventListener('mouseleave', () => { clearInterval(titleEl._decodeTimer); titleEl.textContent = original; });
    }
});

