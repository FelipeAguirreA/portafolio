// UI del DOM — nav, menú móvil, scroll-spy, reveals, contadores, lightbox de certificados.

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// envuelve cada carácter en un span.char, preservando elementos hijos (<em>)
function splitChars(el) {
  const wrap = (node) => {
    ;[...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment()
        for (const ch of n.textContent) {
          if (ch.trim() === '') frag.append(ch)
          else {
            const s = document.createElement('span')
            s.className = 'char'
            s.textContent = ch
            frag.append(s)
          }
        }
        n.replaceWith(frag)
      } else wrap(n)
    })
  }
  wrap(el)
}

export function initUI({ reduced = false } = {}) {
  // ---- Nav: fondo al scrollear ----
  const nav = document.getElementById('nav')
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 40)
  }, { passive: true })

  // ---- Menú móvil ----
  const burger = document.getElementById('burger')
  const menu = document.getElementById('menu')
  function toggleMenu(force) {
    const open = force ?? !document.body.classList.contains('menu-open')
    document.body.classList.toggle('menu-open', open)
    burger.setAttribute('aria-expanded', String(open))
    menu.setAttribute('aria-hidden', String(!open))
  }
  burger.addEventListener('click', () => toggleMenu())
  menu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => toggleMenu(false))
  )

  // ---- Scroll-spy ----
  document.querySelectorAll('main section[id]').forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (st) => {
        if (!st.isActive) return
        document.querySelectorAll('.nav__link').forEach((l) => {
          l.classList.toggle('is-active', l.dataset.spy === section.id)
        })
      },
    })
  })

  // ---- Reveals (set + fromTo: estado inicial garantizado) ----
  const reveals = document.querySelectorAll('[data-reveal]')
  if (reduced) {
    reveals.forEach((el) => el.classList.add('revealed'))
  } else {
    reveals.forEach((el) => {
      gsap.set(el, { y: 34, opacity: 0 })
      gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
    })
  }

  // ---- Contadores ----
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count)
    if (reduced) {
      el.textContent = target
      return
    }
    const proxy = { v: 0 }
    gsap.to(proxy, {
      v: target,
      duration: 1.6,
      ease: 'power2.out',
      snap: { v: 1 },
      onUpdate: () => (el.textContent = proxy.v),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    })
  })

  // ---- Títulos: revelado letra por letra + subrayado que se dibuja ----
  if (!reduced) {
    document.querySelectorAll('.section__title').forEach((title) => {
      splitChars(title)

      // flourish: trazo que se dibuja bajo el título
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('class', 'section__flourish')
      svg.setAttribute('viewBox', '0 0 100 10')
      svg.setAttribute('preserveAspectRatio', 'none')
      svg.setAttribute('aria-hidden', 'true')
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', 'M2 7 Q 28 1.5 52 6 T 98 4.5')
      svg.appendChild(path)
      title.appendChild(svg)
      const len = path.getTotalLength()
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })

      const chars = title.querySelectorAll('.char')
      gsap.set(chars, { yPercent: 115, opacity: 0 })
      ScrollTrigger.create({
        trigger: title,
        start: 'top 86%',
        once: true,
        onEnter: () => {
          gsap.to(chars, {
            yPercent: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.035,
            ease: 'power3.out',
          })
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 1.1,
            delay: 0.35,
            ease: 'power2.inOut',
          })
        },
      })
    })
  }

  // ---- Hero: letras vivas — saltan al pasar el cursor ----
  if (!reduced && matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.hero__line').forEach((line) => {
      splitChars(line)
      line.querySelectorAll('.char').forEach((ch) => {
        ch.addEventListener('pointerenter', () => {
          gsap.fromTo(
            ch,
            { y: 0, rotation: 0 },
            {
              y: -16,
              rotation: gsap.utils.random(-9, 9),
              duration: 0.18,
              ease: 'power2.out',
              yoyo: true,
              repeat: 1,
              overwrite: 'auto',
              onComplete: () => gsap.set(ch, { y: 0, rotation: 0 }),
            }
          )
        })
      })
    })
  }

  // ---- Cursor magnético ----
  if (!reduced && matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.btn, .nav__link--cta, .footer__social a, .carousel__btn').forEach((el) => {
      const strength = el.classList.contains('btn') ? 0.3 : 0.45
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect()
        gsap.to(el, {
          x: (e.clientX - r.left - r.width / 2) * strength,
          y: (e.clientY - r.top - r.height / 2) * strength,
          duration: 0.4,
          ease: 'power2.out',
        })
      })
      el.addEventListener('pointerleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' })
      })
    })
  }

  // ---- Carrusel de certificados ----
  const track = document.getElementById('cert-track')
  if (track) {
    const cards = [...track.children].filter((c) => c.classList.contains('cert'))
    const counter = document.getElementById('cert-count')
    const total = String(cards.length).padStart(2, '0')
    const stepSize = () =>
      cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0)

    document.getElementById('cert-prev')?.addEventListener('click', () =>
      track.scrollBy({ left: -stepSize(), behavior: 'smooth' })
    )
    document.getElementById('cert-next')?.addEventListener('click', () =>
      track.scrollBy({ left: stepSize(), behavior: 'smooth' })
    )

    if (counter) {
      const updateCount = () => {
        const i = Math.min(cards.length - 1, Math.round(track.scrollLeft / stepSize()))
        counter.textContent = `${String(i + 1).padStart(2, '0')} / ${total}`
      }
      track.addEventListener('scroll', updateCount, { passive: true })
      updateCount()
    }

    // drag con mouse + lanzamiento con inercia (touch usa scroll nativo)
    let down = false
    let startX = 0
    let startL = 0
    let moved = 0
    let lastX = 0
    let lastT = 0
    let vel = 0

    // sin esto, arrastrar desde una imagen dispara el drag nativo y rompe el gesto
    track.addEventListener('dragstart', (e) => e.preventDefault())

    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return
      down = true
      moved = 0
      vel = 0
      startX = lastX = e.clientX
      startL = track.scrollLeft
      lastT = performance.now()
      gsap.killTweensOf(track)
      track.classList.add('is-dragging')
    })
    window.addEventListener('pointermove', (e) => {
      if (!down) return
      const dx = e.clientX - startX
      moved = Math.max(moved, Math.abs(dx))
      track.scrollLeft = startL - dx
      const now = performance.now()
      const dt = now - lastT
      if (dt > 0) {
        vel = (e.clientX - lastX) / dt // px/ms con signo
        lastX = e.clientX
        lastT = now
      }
    })
    const endDrag = () => {
      if (!down) return
      down = false
      const step = stepSize()
      const max = track.scrollWidth - track.clientWidth
      // proyectar el lanzamiento y aterrizar en un punto de snap
      let target = track.scrollLeft - vel * 300
      target = Math.max(0, Math.min(max, Math.round(target / step) * step))
      gsap.to(track, {
        scrollLeft: target,
        duration: 0.65,
        ease: 'power3.out',
        onComplete: () => track.classList.remove('is-dragging'),
      })
    }
    window.addEventListener('pointerup', endDrag)
    window.addEventListener('pointercancel', endDrag)
    // si hubo drag, no abrir el lightbox
    track.addEventListener(
      'click',
      (e) => {
        if (moved > 6) {
          e.preventDefault()
          e.stopPropagation()
        }
      },
      true
    )
  }

  // ---- Tilt 3D de certificados (sigue al mouse) ----
  if (!reduced && matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.cert').forEach((card) => {
      const base = parseFloat(card.dataset.tilt || 0)
      card.addEventListener('pointermove', (e) => {
        if (track?.classList.contains('is-dragging')) return
        const r = card.getBoundingClientRect()
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -7
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 7
        card.style.transform = `perspective(1100px) rotate(${base * 0.25}deg) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.015)`
      })
      card.addEventListener('pointerleave', () => {
        card.style.transform = ''
      })
    })
  }

  // ---- Lightbox de certificados — galería con navegación ----
  const dialog = document.getElementById('cert-dialog')
  const dFrame = dialog.querySelector('.lightbox__frame')
  const dImg = document.getElementById('cert-img')
  const dTitle = document.getElementById('cert-title')
  const dDesc = document.getElementById('cert-desc')
  const dCounter = document.getElementById('cert-counter')
  const certButtons = [...document.querySelectorAll('.cert')]
  const certData = certButtons.map((b) => ({
    img: b.dataset.img,
    title: b.dataset.title,
    desc: b.dataset.desc,
  }))
  let certIndex = 0

  function renderCert(i, dir = 0) {
    certIndex = (i + certData.length) % certData.length
    const c = certData[certIndex]
    const swap = () => {
      dImg.src = c.img
      dImg.alt = c.title
      dTitle.textContent = c.title
      dDesc.textContent = c.desc
      dCounter.textContent = `${String(certIndex + 1).padStart(2, '0')} / ${String(certData.length).padStart(2, '0')}`
    }
    if (reduced || dir === 0) {
      swap()
      return
    }
    // deslizamiento direccional al navegar
    gsap.to([dImg, dTitle, dDesc], {
      x: dir * -26,
      opacity: 0,
      duration: 0.18,
      ease: 'power2.in',
      onComplete: () => {
        swap()
        gsap.fromTo(
          [dImg, dTitle, dDesc],
          { x: dir * 26, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out', stagger: 0.04 }
        )
      },
    })
  }

  function openCert(i) {
    renderCert(i)
    dialog.showModal()
    if (!reduced) {
      gsap.fromTo(
        dFrame,
        { y: 36, scale: 0.95, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' }
      )
      gsap.fromTo(
        dImg,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 0.7, delay: 0.15, ease: 'power3.inOut' }
      )
      gsap.fromTo(
        dialog.querySelectorAll('.lightbox__panel > *'),
        { x: 22, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, delay: 0.25, stagger: 0.07, ease: 'power2.out' }
      )
    }
  }

  function closeCert() {
    if (reduced) {
      dialog.close()
      return
    }
    gsap.to(dFrame, {
      y: 22,
      scale: 0.97,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => dialog.close(),
    })
  }

  certButtons.forEach((btn, i) => btn.addEventListener('click', () => openCert(i)))
  document.getElementById('cert-close').addEventListener('click', closeCert)
  document.getElementById('cert-d-prev').addEventListener('click', () => renderCert(certIndex - 1, -1))
  document.getElementById('cert-d-next').addEventListener('click', () => renderCert(certIndex + 1, 1))
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeCert()
  })
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault()
    closeCert()
  })
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') renderCert(certIndex - 1, -1)
    if (e.key === 'ArrowRight') renderCert(certIndex + 1, 1)
  })

  // ---- Fotos principales: tilt 3D + brillo + destello eléctrico ----
  if (!reduced && matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.hero__photo, .about__media').forEach((box) => {
      const img = box.querySelector('img')
      if (!img) return
      const glare = document.createElement('span')
      glare.className = 'photo-glare'
      glare.setAttribute('aria-hidden', 'true')
      box.appendChild(glare)
      const place = () => {
        glare.style.top = `${img.offsetTop}px`
        glare.style.left = `${img.offsetLeft}px`
        glare.style.width = `${img.offsetWidth}px`
        glare.style.height = `${img.offsetHeight}px`
        glare.style.borderRadius = getComputedStyle(img).borderRadius
      }
      place()
      new ResizeObserver(place).observe(img)

      box.addEventListener('pointermove', (e) => {
        const r = box.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        box.style.transform = `perspective(900px) rotateX(${(py - 0.5) * -9}deg) rotateY(${(px - 0.5) * 9}deg)`
        box.classList.add('is-tilting')
        glare.style.setProperty('--gx', `${px * 100}%`)
        glare.style.setProperty('--gy', `${py * 100}%`)
      })
      box.addEventListener('pointerleave', () => {
        box.style.transform = ''
        box.classList.remove('is-tilting')
      })
    })
  }

  // ---- Reloj local (Chile) ----
  const clock = document.getElementById('local-time')
  if (clock) {
    const fmt = new Intl.DateTimeFormat('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'America/Santiago',
    })
    const tick = () => (clock.textContent = fmt.format(new Date()))
    tick()
    setInterval(tick, 1000)
  }

  // ---- Smooth scroll para anclas ----
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'))
      if (!target) return
      e.preventDefault()
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
    })
  })
}
