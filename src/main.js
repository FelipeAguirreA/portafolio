import './styles/main.css'
import { initScene } from './scene/scene.js'
import { initSequence } from './theatre/sequence.js'
import { initLoader } from './ui/loader.js'
import { initUI } from './ui/ui.js'
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
  initContact()
}

boot()
