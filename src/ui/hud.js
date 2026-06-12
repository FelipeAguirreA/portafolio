// Sistema HUD futurista — cada sección es una "ventana" del sistema:
// chrome de terminal, línea de escaneo, texto decode, riel de navegación
// y pulsos en la escena 3D al cruzar de capítulo.

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const GLYPHS = '█▓▒░<>/|=+*#@$%&0123456789ABCDEF'

const LABELS = {
  'sobre-mi': 'Sobre mí',
  habilidades: 'Habilidades',
  proyectos: 'Proyectos',
  certificados: 'Certificados',
  contacto: 'Contacto',
}

// texto que se "decodifica": glifos aleatorios asentándose en el texto real
function scramble(el, finalText, dur = 750) {
  const start = performance.now()
  const len = finalText.length
  const tick = (now) => {
    const p = Math.min(1, (now - start) / dur)
    const settled = Math.floor(p * len)
    let out = finalText.slice(0, settled)
    for (let i = settled; i < len; i++) {
      out += finalText[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0]
    }
    el.textContent = out
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

export function initHUD({ reduced = false, sceneApi = null } = {}) {
  if (reduced) return

  const sections = [...document.querySelectorAll('main .section[id]')]
  const total = String(sections.length).padStart(2, '0')

  // ---- salto al hiperespacio: FOV + ráfaga al navegar entre secciones ----
  const warpJump = () => {
    if (!sceneApi?.params) return
    const cam = sceneApi.params.camera
    gsap
      .timeline()
      .to(cam, { warp: 1, duration: 0.45, ease: 'power2.in' })
      .to(cam, { warp: 0, duration: 1.15, ease: 'power3.out' })
    gsap.fromTo(
      sceneApi.params.particles,
      { pulse: 2.1 },
      { pulse: 1, duration: 1.4, ease: 'power3.out', overwrite: 'auto' }
    )
  }
  document.addEventListener('click', (e) => {
    if (e.target.closest('a[href^="#"]')) warpJump()
  })

  // ---- flash de capítulo: destello del color de la sección ----
  const flash = document.createElement('div')
  flash.className = 'chapter-flash'
  flash.setAttribute('aria-hidden', 'true')
  document.body.appendChild(flash)

  // ---- barrido CRT ambiental ----
  const crt = document.createElement('div')
  crt.className = 'crt'
  crt.setAttribute('aria-hidden', 'true')
  document.body.appendChild(crt)

  // ---- el hero se desarma al scrollear: primer impacto ----
  const heroExit = gsap.timeline({
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 30%', scrub: 0.3 },
  })
  heroExit
    .to('.hero__line:not(.hero__line--accent)', { xPercent: -16, opacity: 0, ease: 'power1.in' }, 0)
    .to('.hero__line--accent', { xPercent: 12, opacity: 0, ease: 'power1.in' }, 0)
    .to('.hero__eyebrow, .hero__sub, .hero__actions', { y: -70, opacity: 0, ease: 'power1.in' }, 0)
    .to('.hero__photo', { y: -110, rotate: 10, opacity: 0, ease: 'power1.in' }, 0)

  // ---- cada sección: chrome de ventana + scan + entrada compuerta ----
  sections.forEach((section, i) => {
    const scan = document.createElement('span')
    scan.className = 'section__scan'
    scan.setAttribute('aria-hidden', 'true')
    section.prepend(scan)

    const chrome = document.createElement('div')
    chrome.className = 'win'
    chrome.setAttribute('aria-hidden', 'true')
    chrome.innerHTML = `
      <span class="win__dot"></span>
      <span class="win__path"></span>
      <span class="win__cap"></span>
    `
    section.prepend(chrome)

    // número fantasma gigante con parallax propio — profundidad entre capas
    const ghost = document.createElement('span')
    ghost.className = 'section__ghost'
    ghost.setAttribute('aria-hidden', 'true')
    ghost.textContent = String(i + 1).padStart(2, '0')
    section.prepend(ghost)
    gsap.fromTo(
      ghost,
      { yPercent: 35 },
      {
        yPercent: -35,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    )

    // la ventana se materializa: llega inclinada y translúcida, se asienta plana
    gsap.fromTo(
      section,
      { rotateX: 10, yPercent: 6, scale: 0.94, opacity: 0.3, transformOrigin: 'center top' },
      {
        rotateX: 0,
        yPercent: 0,
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top 99%', end: 'top 48%', scrub: 0.4 },
      }
    )

    // al entrar por primera vez: escaneo + decode + glitch del título + flash
    ScrollTrigger.create({
      trigger: section,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          scan,
          { top: 0, opacity: 1 },
          { top: '100%', opacity: 0, duration: 1.2, ease: 'power2.inOut' }
        )
        scramble(chrome.querySelector('.win__path'), `fa://${section.id}`)
        scramble(chrome.querySelector('.win__cap'), `CAP.${String(i + 1).padStart(2, '0')}/${total}`, 900)

        // glitch RGB en el título
        const title = section.querySelector('.section__title')
        if (title) {
          title.classList.add('is-glitching')
          setTimeout(() => title.classList.remove('is-glitching'), 650)
        }

        // destello del color del capítulo
        const chapter = getComputedStyle(section).getPropertyValue('--chapter').trim()
        flash.style.background = chapter
        gsap.fromTo(flash, { opacity: 0.16 }, { opacity: 0, duration: 0.6, ease: 'power2.out' })
      },
    })
  })

  // ---- HUD fijo: riel de capítulos + readout del sistema ----
  const hud = document.createElement('aside')
  hud.className = 'hud'
  hud.setAttribute('aria-hidden', 'true')
  hud.innerHTML = `
    <div class="hud__rail">
      <span class="hud__track"><span class="hud__bar"></span></span>
      <ol class="hud__list">
        ${sections
          .map(
            (s, i) =>
              `<li class="hud__item" data-id="${s.id}"><b>${String(i + 1).padStart(2, '0')}</b><span>${LABELS[s.id] ?? s.id}</span></li>`
          )
          .join('')}
      </ol>
    </div>
    <div class="hud__sys">
      <button class="hud__term" id="hud-term" type="button">TERM [T]</button>
      <span>FA·SYS 2.0 // SCROLL <b id="hud-pct">000</b>% // <b id="hud-fps">60</b>FPS</span>
    </div>
  `
  document.body.appendChild(hud)

  // ---- FPS real del sistema ----
  const fpsEl = hud.querySelector('#hud-fps')
  let frames = 0
  let lastFps = performance.now()
  const countFrame = () => {
    frames++
    const now = performance.now()
    if (now - lastFps >= 500) {
      fpsEl.textContent = String(Math.min(99, Math.round((frames * 1000) / (now - lastFps)))).padStart(2, '0')
      frames = 0
      lastFps = now
    }
    requestAnimationFrame(countFrame)
  }
  requestAnimationFrame(countFrame)

  // ---- tocar el sistema: drag orbita la cámara, click = onda de choque ----
  const hero = document.querySelector('.hero')
  if (hero && sceneApi?.params) {
    const cam = sceneApi.params.camera
    let dragging = false
    let startX = 0
    let startOrbit = 0
    let movedHero = 0

    hero.addEventListener('pointerdown', (e) => {
      if (e.target.closest('a, button, .hero__photo')) return
      dragging = true
      movedHero = 0
      startX = e.clientX
      startOrbit = cam.userOrbit
      gsap.killTweensOf(cam)
      hero.classList.add('is-grabbing')
    })
    window.addEventListener('pointermove', (e) => {
      if (!dragging) return
      const dx = e.clientX - startX
      movedHero = Math.max(movedHero, Math.abs(dx))
      cam.userOrbit = startOrbit + (dx / window.innerWidth) * 0.55
    })
    window.addEventListener('pointerup', () => {
      if (!dragging) return
      dragging = false
      hero.classList.remove('is-grabbing')
      // la cámara vuelve a su lugar con rebote elástico
      gsap.to(cam, { userOrbit: 0, duration: 1.7, ease: 'elastic.out(1, 0.35)' })
    })

    // click corto (sin drag) sobre espacio vacío = shockwave
    hero.addEventListener('click', (e) => {
      if (movedHero > 6 || e.target.closest('a, button')) return
      gsap.fromTo(
        sceneApi.params.core,
        { kick: 1.9, flash: 2.2 },
        { kick: 1, flash: 1, duration: 1.1, ease: 'power3.out', overwrite: 'auto' }
      )
      gsap.fromTo(
        sceneApi.params.particles,
        { pulse: 1.85 },
        { pulse: 1, duration: 1.3, ease: 'power3.out', overwrite: 'auto' }
      )
      // anillos 2D expandiéndose desde el punto exacto del click
      ;['ripple', 'ripple ripple--cool'].forEach((cls, k) => {
        const ring = document.createElement('span')
        ring.className = cls
        ring.style.left = `${e.clientX}px`
        ring.style.top = `${e.clientY}px`
        ring.style.animationDelay = `${k * 0.09}s`
        document.body.appendChild(ring)
        ring.addEventListener('animationend', () => ring.remove())
      })
    })
  }

  // ---- skill tags: decode al hover ----
  document.querySelectorAll('.skills__tags span').forEach((tag) => {
    tag.dataset.label = tag.textContent
    tag.addEventListener('pointerenter', () => scramble(tag, tag.dataset.label, 380))
  })

  // ---- nav: decode al hover ----
  document.querySelectorAll('.nav__link').forEach((link) => {
    link.dataset.label = link.textContent
    link.addEventListener('pointerenter', () => scramble(link, link.dataset.label, 420))
  })

  // ---- el sistema nota cuando te vas ----
  const baseTitle = document.title
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? '⚠ FA·SYS — conexión en espera' : baseTitle
  })

  // ---- marquee del footer reactiva a velocidad ----
  // frase única viajera: entra por la derecha, cruza, desaparece por la izquierda
  const marqueeTrack = document.querySelector('.footer__track')
  let marqueeTween = null
  if (marqueeTrack) {
    const SPEED = 55 // px por segundo — paso tranquilo
    const setupMarquee = () => {
      const w = marqueeTrack.scrollWidth
      const vw = window.innerWidth
      marqueeTween?.kill()
      gsap.set(marqueeTrack, { x: vw })
      marqueeTween = gsap.to(marqueeTrack, {
        x: -w,
        duration: (vw + w) / SPEED,
        ease: 'none',
        repeat: -1,
      })
    }
    setupMarquee()
    window.addEventListener('resize', setupMarquee)
  }

  hud.querySelectorAll('.hud__item').forEach((item) => {
    item.addEventListener('click', () => {
      warpJump()
      document.getElementById(item.dataset.id)?.scrollIntoView({ behavior: 'smooth' })
    })
  })

  const bar = hud.querySelector('.hud__bar')
  const pct = hud.querySelector('#hud-pct')

  // telemetría de la visita (el footer la reporta al final)
  const sessionStart = performance.now()
  let scrollDistance = 0
  let lastScrollY = window.scrollY
  const visited = new Set()

  // la escena reacciona a la velocidad del scroll: ráfaga de partículas
  const pulseTo = sceneApi?.params
    ? gsap.quickTo(sceneApi.params.particles, 'pulse', { duration: 0.5, ease: 'power2.out' })
    : null

  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (st) => {
      bar.style.transform = `scaleY(${st.progress})`
      pct.textContent = String(Math.round(st.progress * 100)).padStart(3, '0')
      const v = Math.min(Math.abs(st.getVelocity()) / 2500, 1)
      if (pulseTo) pulseTo(1 + v * 0.65)
      if (marqueeTween) {
        marqueeTween.timeScale(gsap.utils.interpolate(marqueeTween.timeScale(), 1 + v * 1.5, 0.12))
      }
      // telemetría: distancia recorrida
      scrollDistance += Math.abs(window.scrollY - lastScrollY)
      lastScrollY = window.scrollY
    },
  })

  // ---- fin de la transmisión: telemetría real de la visita ----
  const endTime = document.getElementById('end-time')
  const endScroll = document.getElementById('end-scroll')
  const endChapters = document.getElementById('end-chapters')
  const endTitle = document.querySelector('.footer__end-title')

  function updateTelemetry() {
    if (!endTime) return
    const secs = Math.floor((performance.now() - sessionStart) / 1000)
    const mm = String(Math.floor(secs / 60)).padStart(2, '0')
    const ss = String(secs % 60).padStart(2, '0')
    endTime.textContent = `${mm}:${ss}`
    endScroll.textContent = Math.round(scrollDistance).toLocaleString('es-CL')
    endChapters.textContent = `${String(visited.size).padStart(2, '0')}/${total}`
  }

  if (endTitle) {
    let telemetryTimer = null
    ScrollTrigger.create({
      trigger: '.footer',
      start: 'top 90%',
      onEnter: () => scramble(endTitle, '— fin de la transmisión —', 900),
      onToggle: (st) => {
        clearInterval(telemetryTimer)
        if (st.isActive) {
          updateTelemetry()
          telemetryTimer = setInterval(updateTelemetry, 1000)
        }
      },
    })
  }

  // ---- sección activa: riel + pulso en la escena 3D ----
  sections.forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (st) => {
        if (!st.isActive) return
        visited.add(section.id)
        hud.querySelectorAll('.hud__item').forEach((item) => {
          item.classList.toggle('is-active', item.dataset.id === section.id)
        })
        // el núcleo destella al cruzar de capítulo (las partículas responden a la velocidad)
        if (sceneApi?.params) {
          gsap.fromTo(
            sceneApi.params.core,
            { flash: 1.9 },
            { flash: 1, duration: 1, ease: 'power3.out', overwrite: 'auto' }
          )
        }
      },
    })
  })
}
