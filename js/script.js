/* ============================================
   GSAP Animations - Portfolio Felipe Aguirre
   ============================================ */

// Registrar plugins de GSAP
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ============================================
// Smooth Scroll con ScrollSmoother (DESACTIVADO temporalmente)
// ============================================
let smoother = null;

// (Cursor personalizado anterior eliminado) Solo se usa canvas fluido.

// ============================================
// Partículas de Fondo
// ============================================
function createParticles() {
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
function createProjectParticles() {
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

// ============================================
// Navegación
// ============================================
const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Scroll effect navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Active link on scroll
const sections = document.querySelectorAll('section');
const navLinksAll = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

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
    .from('.title-line', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2
    }, '-=0.4')
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
    .from('.visual-ring', {
        scale: 0,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'elastic.out(1, 0.5)'
    }, '-=1')
    .from('.profile-image', {
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.5)'
    }, '-=0.8')
    .from('.scroll-indicator', {
        y: 20,
        opacity: 0,
        duration: 0.8
    }, '-=0.5');

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
gsap.set('.skill-card', { opacity: 1, y: 0, scale: 1 });

// Animación moderna de tarjetas con scale y stagger
gsap.fromTo('.skill-card', 
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

// Skill cards sin animación de opacidad adicional
// gsap.from('.skill-card', {
//     scrollTrigger: {
//         trigger: '.skills-grid',
//         start: 'top 70%'
//     },
//     y: 50,
//     opacity: 0,
//     duration: 0.8,
//     stagger: 0.1
// });

// Animación de barras de progreso
document.querySelectorAll('.skill-progress').forEach(bar => {
    const progress = bar.getAttribute('data-progress');
    
    ScrollTrigger.create({
        trigger: bar,
        start: 'top 80%',
        onEnter: () => {
            gsap.to(bar, {
                width: progress + '%',
                duration: 1.5,
                ease: 'power2.out'
            });
        },
        once: true
    });
});

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

// Project cards sin animación de opacidad - todas visibles
// gsap.from('.project-card', {
//     scrollTrigger: {
//         trigger: '.projects-grid',
//         start: 'top 70%'
//     },
//     y: 80,
//     opacity: 0,
//     duration: 1,
//     stagger: 0.2
// });

// Hover animations para project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card.querySelector('.project-placeholder'), {
            scale: 1.1,
            duration: 0.3
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card.querySelector('.project-placeholder'), {
            scale: 1,
            duration: 0.3
        });
    });
});

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
gsap.set('.certificate-card', { opacity: 1, y: 0, scale: 1, rotationY: 0 });

// Animación de certificados con efecto flip
gsap.fromTo('.certificate-card',
    {
        y: 60,
        rotationY: 25,
        scale: 0.85,
        opacity: 0
    },
    {
        scrollTrigger: {
            trigger: '.certificates-slider',
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
gsap.from('.contact .section-header', {
    scrollTrigger: {
        trigger: '.contact',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    y: 80,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

gsap.from('.contact-info', {
    scrollTrigger: {
        trigger: '.contact-content',
        start: 'top 70%'
    },
    x: -50,
    opacity: 0,
    duration: 1
});

gsap.from('.contact-form', {
    scrollTrigger: {
        trigger: '.contact-content',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    x: 60,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out'
});

// Social links animados individualmente
gsap.from('.social-link', {
    scrollTrigger: {
        trigger: '.contact-info',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    scale: 0,
    rotation: 180,
    opacity: 0,
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

// ============================================
// Smooth Scroll para links internos con ScrollSmoother
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        
        if (target && smoother) {
            // Usar ScrollSmoother para scroll suave
            smoother.scrollTo(target, true, 'top 80px');
        } else if (target) {
            // Fallback si smoother no está disponible
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
const form = document.querySelector('.contact-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const button = form.querySelector('button');
    const originalText = button.innerHTML;
    
    // Animación de envío
    gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        onComplete: () => {
            button.innerHTML = '<i class="fas fa-check"></i> ¡Enviado!';
            button.style.background = 'linear-gradient(135deg, #22d3ee 0%, #10b981 100%)';
            
            gsap.to(button, {
                scale: 1,
                duration: 0.3
            });
            
            // Reset después de 3 segundos
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
                form.reset();
            }, 3000);
        }
    });
});

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

// ============================================
// Magnetic Effect para botones
// ============================================
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5
        });
    });
});

// ============================================
// Skill Card Tilt Effect (Desactivado)
// ============================================
// Efecto tilt desactivado para mantener cards uniformes
// document.querySelectorAll('.skill-card').forEach(card => {
//     card.addEventListener('mousemove', (e) => {
//         const rect = card.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;
//         
//         const centerX = rect.width / 2;
//         const centerY = rect.height / 2;
//         
//         const rotateX = (y - centerY) / 10;
//         const rotateY = (centerX - x) / 10;
//         
//         gsap.to(card, {
//             rotateX: rotateX,
//             rotateY: rotateY,
//             duration: 0.3,
//             transformPerspective: 1000
//         });
//     });
//     
//     card.addEventListener('mouseleave', () => {
//         gsap.to(card, {
//             rotateX: 0,
//             rotateY: 0,
//             duration: 0.5
//         });
//     });
// });

// ============================================
// Text Reveal Animation
// ============================================
function splitText(element) {
    const text = element.innerText;
    element.innerHTML = '';
    
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.innerText = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        element.appendChild(span);
    });
    
    return element.querySelectorAll('span');
}

// ============================================
// Certificate Modal
// ============================================
const certificateCards = document.querySelectorAll('.certificate-card');
const certificateModal = document.getElementById('certificateModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');
let isModalOpen = false;

certificateCards.forEach(card => {
    card.addEventListener('click', () => {
        if (isModalOpen) return;
        
        const image = card.getAttribute('data-cert-image');
        const title = card.getAttribute('data-cert-title');
        const desc = card.getAttribute('data-cert-desc');
        
        modalImage.src = image;
        modalTitle.textContent = title;
        modalDescription.textContent = desc;
        
        certificateModal.classList.add('active');
        isModalOpen = true;
        
        // Matar animaciones previas
        gsap.killTweensOf('.modal-content');
        gsap.killTweensOf('.modal-overlay');
        
        // Reset y animación de entrada
        gsap.set('.modal-content', { scale: 0.8, opacity: 0 });
        gsap.set('.modal-overlay', { opacity: 0 });
        
        gsap.to('.modal-content', {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: 'back.out'
        });
        
        gsap.to('.modal-overlay', {
            opacity: 1,
            duration: 0.3
        });
    });
});

// Cerrar modal
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

function closeModal() {
    if (!isModalOpen) return;
    
    isModalOpen = false;
    
    // Matar animaciones previas
    gsap.killTweensOf('.modal-content');
    gsap.killTweensOf('.modal-overlay');
    
    gsap.to('.modal-content', {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in'
    });
    
    gsap.to('.modal-overlay', {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
            certificateModal.classList.remove('active');
        }
    });
}

// Manejo de clic en tarjetas de proyecto
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
});

// ============================================
// Cursor fluido WebGL (adaptado, sin jQuery)
// ============================================
window.addEventListener('load', () => {
    initFluid();
});

function initFluid() {
    // Setup
    const canvas = document.getElementById('fluid');
    if (!canvas) return;

    resizeCanvas();

    const config = {
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1440,
        CAPTURE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 3.5,
        VELOCITY_DISSIPATION: 2,
        PRESSURE: 0.1,
        PRESSURE_ITERATIONS: 20,
        CURL: 3,
        SPLAT_RADIUS: 0.2,
        SPLAT_FORCE: 6000,
        SHADING: true,
        COLOR_UPDATE_SPEED: 10,
        PAUSED: false,
        BACK_COLOR: { r: 0, g: 0, b: 0 },
        TRANSPARENT: true,
    };

    function pointerPrototype() {
        this.id = -1;
        this.texcoordX = 0;
        this.texcoordY = 0;
        this.prevTexcoordX = 0;
        this.prevTexcoordY = 0;
        this.deltaX = 0;
        this.deltaY = 0;
        this.down = false;
        this.moved = false;
        this.color = [30, 0, 300];
    }

    const pointers = [new pointerPrototype()];

    const ctx = getWebGLContext(canvas);
    const gl = ctx.gl;
    const ext = ctx.ext;

    if (!ext.supportLinearFiltering) {
        config.DYE_RESOLUTION = 512;
        config.SHADING = false;
    }

    function getWebGLContext(canvas) {
        const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
        let gl = canvas.getContext('webgl2', params);
        const isWebGL2 = !!gl;
        if (!isWebGL2) gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);

        let halfFloat;
        let supportLinearFiltering;
        if (isWebGL2) {
            gl.getExtension('EXT_color_buffer_float');
            supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
        } else {
            halfFloat = gl.getExtension('OES_texture_half_float');
            supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
        }

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat.HALF_FLOAT_OES;

        let formatRGBA, formatRG, formatR;
        if (isWebGL2) {
            formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
            formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
            formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
        } else {
            formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
            formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
            formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        }

        return {
            gl,
            ext: { formatRGBA, formatRG, formatR, halfFloatTexType, supportLinearFiltering },
        };
    }

    function getSupportedFormat(gl, internalFormat, format, type) {
        if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
            switch (internalFormat) {
                case gl.R16F:
                    return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
                case gl.RG16F:
                    return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
                default:
                    return null;
            }
        }
        return { internalFormat, format };
    }

    function supportRenderTextureFormat(gl, internalFormat, format, type) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        return status === gl.FRAMEBUFFER_COMPLETE;
    }

    function hashCode(s) {
        if (!s || s.length === 0) return 0;
        let hash = 0;
        for (let i = 0; i < s.length; i++) {
            hash = (hash << 5) - hash + s.charCodeAt(i);
            hash |= 0;
        }
        return hash;
    }

    function addKeywords(source, keywords) {
        if (!keywords) return source;
        let keywordsString = '';
        keywords.forEach(k => { keywordsString += '#define ' + k + '\n'; });
        return keywordsString + source;
    }

    function compileShader(type, source, keywords) {
        source = addKeywords(source, keywords);
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) console.trace(gl.getShaderInfoLog(shader));
        return shader;
    }

    function createProgram(vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) console.trace(gl.getProgramInfoLog(program));
        return program;
    }

    function getUniforms(program) {
        const uniforms = [];
        const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            const uniformName = gl.getActiveUniform(program, i).name;
            uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
        }
        return uniforms;
    }

    class Material {
        constructor(vertexShader, fragmentShaderSource) {
            this.vertexShader = vertexShader;
            this.fragmentShaderSource = fragmentShaderSource;
            this.programs = [];
            this.activeProgram = null;
            this.uniforms = [];
        }
        setKeywords(keywords) {
            let hash = 0;
            for (let i = 0; i < keywords.length; i++) hash += hashCode(keywords[i]);
            let program = this.programs[hash];
            if (program == null) {
                const fragmentShader = compileShader(gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
                program = createProgram(this.vertexShader, fragmentShader);
                this.programs[hash] = program;
            }
            if (program === this.activeProgram) return;
            this.uniforms = getUniforms(program);
            this.activeProgram = program;
        }
        bind() { gl.useProgram(this.activeProgram); }
    }

    class Program {
        constructor(vertexShader, fragmentShader) {
            this.uniforms = {};
            this.program = createProgram(vertexShader, fragmentShader);
            this.uniforms = getUniforms(this.program);
        }
        bind() { gl.useProgram(this.program); }
    }

    const baseVertexShader = compileShader(gl.VERTEX_SHADER, `
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;
        void main() {
            vUv = aPosition * 0.5 + 0.5;
            vL = vUv - vec2(texelSize.x, 0.0);
            vR = vUv + vec2(texelSize.x, 0.0);
            vT = vUv + vec2(0.0, texelSize.y);
            vB = vUv - vec2(0.0, texelSize.y);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
    `);

    const blurVertexShader = compileShader(gl.VERTEX_SHADER, `
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        uniform vec2 texelSize;
        void main() {
            vUv = aPosition * 0.5 + 0.5;
            float offset = 1.33333333;
            vL = vUv - texelSize * offset;
            vR = vUv + texelSize * offset;
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
    `);

    const blurShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        uniform sampler2D uTexture;
        void main() {
            vec4 sum = texture2D(uTexture, vUv) * 0.29411764;
            sum += texture2D(uTexture, vL) * 0.35294117;
            sum += texture2D(uTexture, vR) * 0.35294117;
            gl_FragColor = sum;
        }
    `);

    const copyShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        void main() { gl_FragColor = texture2D(uTexture, vUv); }
    `);

    const clearShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        uniform float value;
        void main() { gl_FragColor = value * texture2D(uTexture, vUv); }
    `);

    const colorShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        uniform vec4 color;
        void main() { gl_FragColor = color; }
    `);

    const displayShaderSource = `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uTexture;
        uniform sampler2D uDithering;
        uniform vec2 ditherScale;
        uniform vec2 texelSize;
        vec3 linearToGamma(vec3 color) { color = max(color, vec3(0)); return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0)); }
        void main() {
            vec3 c = texture2D(uTexture, vUv).rgb;
            #ifdef SHADING
            vec3 lc = texture2D(uTexture, vL).rgb;
            vec3 rc = texture2D(uTexture, vR).rgb;
            vec3 tc = texture2D(uTexture, vT).rgb;
            vec3 bc = texture2D(uTexture, vB).rgb;
            float dx = length(rc) - length(lc);
            float dy = length(tc) - length(bc);
            vec3 n = normalize(vec3(dx, dy, length(texelSize)));
            vec3 l = vec3(0.0, 0.0, 1.0);
            float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
            c *= diffuse;
            #endif
            float a = max(c.r, max(c.g, c.b));
            gl_FragColor = vec4(c, a);
        }
    `;

    const splatShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;
        void main() {
            vec2 p = vUv - point.xy;
            p.x *= aspectRatio;
            vec3 splat = exp(-dot(p, p) / radius) * color;
            vec3 base = texture2D(uTarget, vUv).xyz;
            gl_FragColor = vec4(base + splat, 1.0);
        }
    `);

    const advectionShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform vec2 dyeTexelSize;
        uniform float dt;
        uniform float dissipation;
        vec4 bilerp(sampler2D sam, vec2 uv, vec2 tsize) {
            vec2 st = uv / tsize - 0.5;
            vec2 iuv = floor(st);
            vec2 fuv = fract(st);
            vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
            vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
            vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
            vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
            return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
        }
        void main() {
            #ifdef MANUAL_FILTERING
            vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
            vec4 result = bilerp(uSource, coord, dyeTexelSize);
            #else
            vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
            vec4 result = texture2D(uSource, coord);
            #endif
            float decay = 1.0 + dissipation * dt;
            gl_FragColor = result / decay;
        }
    `, ext.supportLinearFiltering ? null : ['MANUAL_FILTERING']);

    const divergenceShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;
        void main() {
            float L = texture2D(uVelocity, vL).x;
            float R = texture2D(uVelocity, vR).x;
            float T = texture2D(uVelocity, vT).y;
            float B = texture2D(uVelocity, vB).y;
            vec2 C = texture2D(uVelocity, vUv).xy;
            if (vL.x < 0.0) { L = -C.x; }
            if (vR.x > 1.0) { R = -C.x; }
            if (vT.y > 1.0) { T = -C.y; }
            if (vB.y < 0.0) { B = -C.y; }
            float div = 0.5 * (R - L + T - B);
            gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
    `);

    const curlShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;
        void main() {
            float L = texture2D(uVelocity, vL).y;
            float R = texture2D(uVelocity, vR).y;
            float T = texture2D(uVelocity, vT).x;
            float B = texture2D(uVelocity, vB).x;
            float vorticity = R - L - T + B;
            gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }
    `);

    const vorticityShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;
        void main() {
            float L = texture2D(uCurl, vL).x;
            float R = texture2D(uCurl, vR).x;
            float T = texture2D(uCurl, vT).x;
            float B = texture2D(uCurl, vB).x;
            float C = texture2D(uCurl, vUv).x;
            vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
            force /= length(force) + 0.0001;
            force *= curl * C;
            force.y *= -1.0;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity += force * dt;
            velocity = min(max(velocity, -1000.0), 1000.0);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
    `);

    const pressureShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;
        void main() {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            float divergence = texture2D(uDivergence, vUv).x;
            float pressure = (L + R + B + T - divergence) * 0.25;
            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
    `);

    const gradientSubtractShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;
        void main() {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity.xy -= vec2(R - L, T - B);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
    `);

    const blit = (() => {
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);
        return (target, clear = false) => {
            if (target == null) {
                gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            } else {
                gl.viewport(0, 0, target.width, target.height);
                gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
            }
            if (clear) { gl.clearColor(0.0, 0.0, 0.0, 1.0); gl.clear(gl.COLOR_BUFFER_BIT); }
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        };
    })();

    function CHECK_FRAMEBUFFER_STATUS() {
        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (status !== gl.FRAMEBUFFER_COMPLETE) console.trace('Framebuffer error: ' + status);
    }

    let dye, velocity, divergence, curl, pressure;
    // Textura de dithering opcional (se mantiene la blanca por defecto)
    const ditheringTexture = createTextureAsync('assets/images/fotoperfil.png');

    const blurProgram = new Program(blurVertexShader, blurShader);
    const copyProgram = new Program(baseVertexShader, copyShader);
    const clearProgram = new Program(baseVertexShader, clearShader);
    const colorProgram = new Program(baseVertexShader, colorShader);
    const splatProgram = new Program(baseVertexShader, splatShader);
    const advectionProgram = new Program(baseVertexShader, advectionShader);
    const divergenceProgram = new Program(baseVertexShader, divergenceShader);
    const curlProgram = new Program(baseVertexShader, curlShader);
    const vorticityProgram = new Program(baseVertexShader, vorticityShader);
    const pressureProgram = new Program(baseVertexShader, pressureShader);
    const gradienSubtractProgram = new Program(baseVertexShader, gradientSubtractShader);
    const displayMaterial = new Material(baseVertexShader, displayShaderSource);

    function initFramebuffers() {
        const simRes = getResolution(config.SIM_RESOLUTION);
        const dyeRes = getResolution(config.DYE_RESOLUTION);
        const texType = ext.halfFloatTexType;
        const rgba = ext.formatRGBA;
        const rg = ext.formatRG;
        const r = ext.formatR;
        const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
        gl.disable(gl.BLEND);
        if (dye == null) dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
        else dye = resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
        if (velocity == null) velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
        else velocity = resizeDoubleFBO(velocity, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
        divergence = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
        curl = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
        pressure = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    }

    function createFBO(w, h, internalFormat, format, type, param) {
        gl.activeTexture(gl.TEXTURE0);
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.viewport(0, 0, w, h);
        gl.clear(gl.COLOR_BUFFER_BIT);
        const texelSizeX = 1.0 / w;
        const texelSizeY = 1.0 / h;
        return {
            texture, fbo, width: w, height: h, texelSizeX, texelSizeY,
            attach(id) { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, texture); return id; }
        };
    }

    function createDoubleFBO(w, h, internalFormat, format, type, param) {
        let fbo1 = createFBO(w, h, internalFormat, format, type, param);
        let fbo2 = createFBO(w, h, internalFormat, format, type, param);
        return {
            width: w, height: h, texelSizeX: fbo1.texelSizeX, texelSizeY: fbo1.texelSizeY,
            get read() { return fbo1; }, set read(value) { fbo1 = value; },
            get write() { return fbo2; }, set write(value) { fbo2 = value; },
            swap() { const temp = fbo1; fbo1 = fbo2; fbo2 = temp; }
        };
    }

    function resizeFBO(target, w, h, internalFormat, format, type, param) {
        const newFBO = createFBO(w, h, internalFormat, format, type, param);
        copyProgram.bind();
        gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
        blit(newFBO);
        return newFBO;
    }

    function resizeDoubleFBO(target, w, h, internalFormat, format, type, param) {
        if (target.width === w && target.height === h) return target;
        target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param);
        target.write = createFBO(w, h, internalFormat, format, type, param);
        target.width = w; target.height = h;
        target.texelSizeX = 1.0 / w; target.texelSizeY = 1.0 / h;
        return target;
    }

    function createTextureAsync(url) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255]));
        const obj = { texture, width: 1, height: 1, attach(id) { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, texture); return id; } };
        if (url) {
            const image = new Image();
            image.onload = () => {
                obj.width = image.width; obj.height = image.height;
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
            };
            image.src = url;
        }
        return obj;
    }

    function updateKeywords() {
        const displayKeywords = [];
        if (config.SHADING) displayKeywords.push('SHADING');
        displayMaterial.setKeywords(displayKeywords);
    }

    updateKeywords();
    initFramebuffers();

    let lastUpdateTime = Date.now();
    let colorUpdateTimer = 0.0;

    function update() {
        const dt = calcDeltaTime();
        if (resizeCanvas()) initFramebuffers();
        updateColors(dt);
        applyInputs();
        step(dt);
        render(null);
        requestAnimationFrame(update);
    }

    function calcDeltaTime() {
        const now = Date.now();
        let dt = (now - lastUpdateTime) / 1000;
        dt = Math.min(dt, 0.016666);
        lastUpdateTime = now;
        return dt;
    }

    function resizeCanvas() {
        const width = scaleByPixelRatio(canvas.clientWidth);
        const height = scaleByPixelRatio(canvas.clientHeight);
        if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; return true; }
        return false;
    }

    function updateColors(dt) {
        colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
        if (colorUpdateTimer >= 1) {
            colorUpdateTimer = wrap(colorUpdateTimer, 0, 1);
            pointers.forEach(p => { p.color = generateColor(); });
        }
    }

    function applyInputs() {
        pointers.forEach(p => { if (p.moved) { p.moved = false; splatPointer(p); } });
    }

    function step(dt) {
        gl.disable(gl.BLEND);
        curlProgram.bind();
        gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
        blit(curl);
        vorticityProgram.bind();
        gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
        gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
        gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
        gl.uniform1f(vorticityProgram.uniforms.dt, dt);
        blit(velocity.write); velocity.swap();
        divergenceProgram.bind();
        gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
        blit(divergence);
        clearProgram.bind();
        gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
        gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
        blit(pressure.write); pressure.swap();
        pressureProgram.bind();
        gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
        for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
            gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
            blit(pressure.write); pressure.swap();
        }
        gradienSubtractProgram.bind();
        gl.uniform2f(gradienSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
        gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
        blit(velocity.write); velocity.swap();
        advectionProgram.bind();
        gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        if (!ext.supportLinearFiltering) gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
        let velocityId = velocity.read.attach(0);
        gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
        gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
        gl.uniform1f(advectionProgram.uniforms.dt, dt);
        gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
        blit(velocity.write); velocity.swap();
        if (!ext.supportLinearFiltering) gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
        gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
        gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
        gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
        blit(dye.write); dye.swap();
    }

    function render(target) { gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.enable(gl.BLEND); drawDisplay(target); }

    function drawDisplay(target) {
        const width = target == null ? gl.drawingBufferWidth : target.width;
        const height = target == null ? gl.drawingBufferHeight : target.height;
        displayMaterial.bind();
        if (config.SHADING) gl.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / width, 1.0 / height);
        gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
        blit(target);
    }

    function splatPointer(pointer) {
        const dx = pointer.deltaX * config.SPLAT_FORCE;
        const dy = pointer.deltaY * config.SPLAT_FORCE;
        splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
    }

    function clickSplat(pointer) {
        const color = generateColor();
        color.r *= 10.0; color.g *= 10.0; color.b *= 10.0;
        const dx = 10 * (Math.random() - 0.5);
        const dy = 30 * (Math.random() - 0.5);
        splat(pointer.texcoordX, pointer.texcoordY, dx, dy, color);
    }

    function splat(x, y, dx, dy, color) {
        splatProgram.bind();
        gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
        gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
        gl.uniform2f(splatProgram.uniforms.point, x, y);
        gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
        gl.uniform1f(splatProgram.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100.0));
        blit(velocity.write); velocity.swap();
        gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
        gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
        blit(dye.write); dye.swap();
    }

    function correctRadius(radius) { let aspectRatio = canvas.width / canvas.height; if (aspectRatio > 1) radius *= aspectRatio; return radius; }

    // Eventos mouse/touch (sin jQuery, usando { once: true })
    document.addEventListener('mousedown', e => {
        const pointer = pointers[0];
        const posX = scaleByPixelRatio(e.clientX);
        const posY = scaleByPixelRatio(e.clientY);
        updatePointerDownData(pointer, -1, posX, posY);
        clickSplat(pointer);
    });

    document.body.addEventListener('mousemove', e => {
        const pointer = pointers[0];
        const posX = scaleByPixelRatio(e.clientX);
        const posY = scaleByPixelRatio(e.clientY);
        const color = generateColor();
        update();
        updatePointerMoveData(pointer, posX, posY, color);
    }, { once: true });

    document.addEventListener('mousemove', e => {
        const pointer = pointers[0];
        const posX = scaleByPixelRatio(e.clientX);
        const posY = scaleByPixelRatio(e.clientY);
        const color = pointer.color;
        updatePointerMoveData(pointer, posX, posY, color);
    });

    document.body.addEventListener('touchstart', e => {
        const touches = e.targetTouches;
        const pointer = pointers[0];
        for (let i = 0; i < touches.length; i++) {
            const posX = scaleByPixelRatio(touches[i].clientX);
            const posY = scaleByPixelRatio(touches[i].clientY);
            update();
            updatePointerDownData(pointer, touches[i].identifier, posX, posY);
        }
    }, { once: true });

    document.addEventListener('touchstart', e => {
        const touches = e.targetTouches;
        const pointer = pointers[0];
        for (let i = 0; i < touches.length; i++) {
            const posX = scaleByPixelRatio(touches[i].clientX);
            const posY = scaleByPixelRatio(touches[i].clientY);
            updatePointerDownData(pointer, touches[i].identifier, posX, posY);
        }
    });

    document.addEventListener('touchmove', e => {
        const touches = e.targetTouches;
        const pointer = pointers[0];
        for (let i = 0; i < touches.length; i++) {
            const posX = scaleByPixelRatio(touches[i].clientX);
            const posY = scaleByPixelRatio(touches[i].clientY);
            updatePointerMoveData(pointer, posX, posY, pointer.color);
        }
    }, false);

    document.addEventListener('touchend', e => {
        const touches = e.changedTouches;
        const pointer = pointers[0];
        for (let i = 0; i < touches.length; i++) updatePointerUpData(pointer);
    });

    function updatePointerDownData(pointer, id, posX, posY) {
        pointer.id = id; pointer.down = true; pointer.moved = false;
        pointer.texcoordX = posX / canvas.width; pointer.texcoordY = 1.0 - posY / canvas.height;
        pointer.prevTexcoordX = pointer.texcoordX; pointer.prevTexcoordY = pointer.texcoordY;
        pointer.deltaX = 0; pointer.deltaY = 0; pointer.color = generateColor();
    }

    function updatePointerMoveData(pointer, posX, posY, color) {
        pointer.prevTexcoordX = pointer.texcoordX; pointer.prevTexcoordY = pointer.texcoordY;
        pointer.texcoordX = posX / canvas.width; pointer.texcoordY = 1.0 - posY / canvas.height;
        pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
        pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
        pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
        pointer.color = color;
    }

    function updatePointerUpData(pointer) { pointer.down = false; }

    function correctDeltaX(delta) { let aspectRatio = canvas.width / canvas.height; if (aspectRatio < 1) delta *= aspectRatio; return delta; }
    function correctDeltaY(delta) { let aspectRatio = canvas.width / canvas.height; if (aspectRatio > 1) delta /= aspectRatio; return delta; }

    function generateColor() {
        const c = HSVtoRGB(Math.random(), 1.0, 1.0);
        c.r *= 0.15; c.g *= 0.15; c.b *= 0.15; return c;
    }

    function HSVtoRGB(h, s, v) {
        let r, g, b, i, f, p, q, t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return { r, g, b };
    }

    function wrap(value, min, max) { const range = max - min; if (range == 0) return min; return (value - min) % range + min; }
    function getResolution(resolution) {
        let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
        if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;
        const min = Math.round(resolution);
        const max = Math.round(resolution * aspectRatio);
        if (gl.drawingBufferWidth > gl.drawingBufferHeight) return { width: max, height: min };
        else return { width: min, height: max };
    }
    function scaleByPixelRatio(input) { const pixelRatio = window.devicePixelRatio || 1; return Math.floor(input * pixelRatio); }

    // Inicia animación
    update();
}

// Cerrar modal con tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen) {
        closeModal();
    }
});

// ============================================
// ============================================
// Initialize - Iniciar todo cuando cargue la página
// ============================================
// Initialize - Iniciar todo cuando cargue la página
// ============================================
window.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfolio loading...');
    
    // Inicializar partículas inmediatamente
    createParticles();
    createProjectParticles();
    
    console.log('💜 Particles initialized');
});

// Inicializar ScrollSmoother y animaciones después de que todo cargue
window.addEventListener('load', () => {
    console.log('✅ Page fully loaded - ScrollSmoother DISABLED for debugging');
    
    // DESACTIVADO ScrollSmoother temporalmente para debugging
    /*
    smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.5,
        effects: true,
        smoothTouch: 0.1,
    });
    */

    // Barra de progreso del scroll
    gsap.to('.scroll-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3
        }
    });
    
    // Refrescar ScrollTrigger
    setTimeout(() => {
        ScrollTrigger.refresh();
        console.log('✨ ScrollTrigger refreshed - animations should work now!');
    }, 100);
});

// ============================================
// Contact Form Handler
// ============================================
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const payload = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.querySelector('span').textContent;
        
        // Deshabilitar botón y mostrar estado
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'Enviando...';
        
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const contentType = response.headers.get('content-type');
            let errorData;
            
            if (!response.ok) {
                // Intentar parsear como JSON, si no es posible obtener texto plano
                if (contentType && contentType.includes('application/json')) {
                    errorData = await response.json();
                } else {
                    const text = await response.text();
                    console.error('Error response (not JSON):', text);
                    throw new Error('Error del servidor. Revisa los logs de Vercel.');
                }
                throw new Error(errorData.error || 'Error al enviar');
            }
            
            // Éxito
            openSuccessModal();
            contactForm.reset();
            
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Hubo un error al enviar el mensaje. Por favor, intenta más tarde o contáctame directamente por email.');
        } finally {
            // Restaurar botón
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = originalText;
        }
    });
}

// ============================================
// Success Modal Functions
// ============================================
function openSuccessModal() {
    const modal = document.getElementById('success-modal');
    const content = modal.querySelector('.modal-content');
    const overlay = modal.querySelector('.modal-overlay');

    // Kill tweens to avoid conflicts on repeated opens
    gsap.killTweensOf([content, overlay]);

    // Ensure initial state before animation
    gsap.set(content, { scale: 0.8, opacity: 0 });
    gsap.set(overlay, { opacity: 0 });

    modal.classList.add('active');

    // Animate scoped elements
    gsap.to(content, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'back.out(1.2)'
    });

    gsap.to(overlay, {
        opacity: 1,
        duration: 0.3
    });
}

function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    const content = modal.querySelector('.modal-content');
    const overlay = modal.querySelector('.modal-overlay');

    gsap.to(content, {
        scale: 0.95,
        opacity: 0,
        duration: 0.25,
        ease: 'back.in(1.2)',
        onComplete: () => {
            modal.classList.remove('active');
            // Reset overlay for next open
            gsap.set(overlay, { opacity: 0 });
        }
    });
}
