import './styles/main.css'
import { initScene } from './scene/scene.js'
import { initSequence } from './theatre/sequence.js'
import { initLoader } from './ui/loader.js'
import { initUI } from './ui/ui.js'
import { initHUD } from './ui/hud.js'
import { initTerminal } from './ui/terminal.js'
import { initContact } from './ui/contact.js'

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
document.body.classList.toggle('reduced', reduced)

async function boot() {
  // el preloader arranca YA — todo lo demás carga detrás de la cortina
  const curtainUp = initLoader({ reduced })

  // Studio solo en dev — se elimina del bundle de producción
  if (import.meta.env.DEV) {
    const studio = (await import('@theatre/studio')).default
    studio.initialize()
  }

  const sceneApi = initScene({ reduced })
  initSequence(sceneApi, { reduced, waitFor: curtainUp })
  initUI({ reduced })
  initHUD({ reduced, sceneApi })
  const terminal = initTerminal()
  document.getElementById('hud-term')?.addEventListener('click', () => terminal.toggle(true))
  initContact()
}

boot()

// firma para los que abren devtools — sé que están ahí
console.log(
  '%c FA·SYS 2.0 %c portafolio de Felipe Aguirre — hecho a mano con Three.js + Theatre.js %c github.com/FelipeAguirreA',
  'background:#cdf32f;color:#0c0e0b;padding:4px 10px;font-weight:bold;border-radius:2px',
  'color:#ece9df;padding:4px 6px',
  'color:#cdf32f;padding:4px 0'
)
console.log('%c> psst: presiona T para abrir la terminal del sistema', 'color:#43d6c0;padding:2px 0')
