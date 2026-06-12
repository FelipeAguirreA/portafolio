// Preloader cinematográfico — contador + cortina. Devuelve una promesa
// que se resuelve cuando la cortina sube: ahí arranca la intro de Theatre.

import gsap from 'gsap'

export function initLoader({ reduced = false } = {}) {
  if (reduced) return Promise.resolve()

  const el = document.createElement('div')
  el.className = 'loader'
  el.innerHTML = `
    <div class="loader__inner">
      <span class="loader__logo"><em>F</em>A<span class="loader__dot"></span></span>
      <span class="loader__count">00</span>
    </div>
    <div class="loader__log" aria-hidden="true">
      <span>&gt; INICIANDO FA·SYS 2.0</span>
      <span>&gt; CARGANDO ESCENA 3D ........ OK</span>
      <span>&gt; COMPILANDO SHADERS ........ OK</span>
      <span>&gt; TIPOGRAFÍA ................ OK</span>
      <span>&gt; ABRIENDO VENTANAS_</span>
    </div>
    <span class="loader__bar"></span>
  `
  document.body.appendChild(el)
  document.body.classList.add('is-loading')

  // las líneas del boot se encienden en secuencia
  gsap.fromTo(
    el.querySelectorAll('.loader__log span'),
    { opacity: 0 },
    { opacity: 1, duration: 0.05, stagger: 0.28, ease: 'none' }
  )

  const count = el.querySelector('.loader__count')
  const bar = el.querySelector('.loader__bar')
  const state = { v: 0 }
  const paint = () => {
    count.textContent = String(Math.round(state.v)).padStart(2, '0')
    bar.style.transform = `scaleX(${state.v / 100})`
  }

  return new Promise((resolve) => {
    // avanza hasta 92 mientras cargan las fuentes
    gsap.to(state, { v: 92, duration: 1.3, ease: 'power2.out', onUpdate: paint })

    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    const minTime = new Promise((r) => setTimeout(r, 1400))

    Promise.all([fontsReady, minTime]).then(() => {
      gsap.to(state, {
        v: 100,
        duration: 0.3,
        ease: 'power2.in',
        onUpdate: paint,
        onComplete: () => {
          gsap
            .timeline({
              onComplete: () => {
                el.remove()
                document.body.classList.remove('is-loading')
              },
            })
            .to(el.querySelector('.loader__inner'), {
              y: -36,
              opacity: 0,
              duration: 0.4,
              ease: 'power2.in',
            })
            .to(el, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '-=0.1')
            .add(resolve, '-=0.6') // la intro 3D arranca con la cortina aún subiendo
        },
      })
    })
  })
}
