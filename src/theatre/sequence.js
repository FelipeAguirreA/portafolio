// Theatre.js — timeline cinematográfica de la escena.
// Intro: 0 → 3.6s (autoplay al cargar). Scroll: 4 → 10s (scrub con la página).
// En dev, el Studio permite editar keyframes en vivo (exportar JSON → state.json).

import { getProject, types } from '@theatre/core'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import state from './state.json'

gsap.registerPlugin(ScrollTrigger)

const INTRO_END = 3.6
const SCROLL_START = 4
const SCROLL_END = 10

export function initSequence(sceneApi, { reduced = false, waitFor = Promise.resolve() } = {}) {
  const { params, requestRender } = sceneApi

  // letterbox: barras de cine durante la intro, se retiran al terminar
  const retractBars = () => {
    const top = document.querySelector('.letterbox--top')
    const bottom = document.querySelector('.letterbox--bottom')
    if (!top) return
    gsap.to(top, { yPercent: -101, duration: 1.1, ease: 'power3.inOut' })
    gsap.to(bottom, { yPercent: 101, duration: 1.1, ease: 'power3.inOut' })
  }

  let project
  try {
    project = getProject('Portafolio FA', { state })
  } catch (err) {
    // Estado inválido → escena queda con defaults estáticos, el sitio sigue vivo
    console.warn('[theatre] estado no cargó, escena en modo estático:', err)
    retractBars()
    return
  }

  const sheet = project.sheet('Scene')

  const cameraObj = sheet.object('camera', {
    distance: types.number(8.4, { range: [2, 30] }),
    height: types.number(0.5, { range: [-5, 5] }),
    orbit: types.number(0, { range: [-1, 1] }),
  })
  const coreObj = sheet.object('core', {
    distortion: types.number(0.85, { range: [0, 3] }),
    speed: types.number(0.3, { range: [0, 2] }),
    glow: types.number(0.75, { range: [0, 3] }),
    grade: types.number(0, { range: [0, 1] }),
  })
  const particlesObj = sheet.object('particles', {
    opacity: types.number(0.8, { range: [0, 1] }),
    spread: types.number(1, { range: [0.5, 3] }),
    morph: types.number(0, { range: [0, 1] }),
  })

  cameraObj.onValuesChange((v) => {
    Object.assign(params.camera, v)
    requestRender()
  })
  coreObj.onValuesChange((v) => {
    Object.assign(params.core, v)
    requestRender()
  })
  particlesObj.onValuesChange((v) => {
    Object.assign(params.particles, v)
    requestRender()
  })

  let scrubEnabled = false
  let pendingProgress = 0

  Promise.all([project.ready, waitFor]).then(() => {
    if (reduced) {
      // Sin movimiento: directo al estado post-intro
      sheet.sequence.position = INTRO_END
      return
    }
    sheet.sequence.play({ range: [0, INTRO_END], rate: 1 }).then(() => {
      scrubEnabled = true
      sheet.sequence.position = SCROLL_START + pendingProgress * (SCROLL_END - SCROLL_START)
      retractBars()
    })
  })

  if (!reduced) {
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (st) => {
        pendingProgress = st.progress
        if (scrubEnabled) {
          sheet.sequence.position = SCROLL_START + st.progress * (SCROLL_END - SCROLL_START)
        }
      },
    })
  }
}
