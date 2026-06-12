// Terminal FA·SYS — una consola funcional dentro del portafolio.
// Se abre con la tecla T o el botón TERM del HUD. ESC cierra.

const PROMPT = 'visita@fa-sys:~$'

const SECTIONS = ['inicio', 'sobre-mi', 'habilidades', 'proyectos', 'certificados', 'contacto']

const ASCII = `  ███████╗ █████╗
  ██╔════╝██╔══██╗
  █████╗  ███████║   FA·SYS 2.0
  ██╔══╝  ██╔══██║   sistema personal de Felipe Aguirre
  ╚═╝     ╚═╝  ╚═╝`

// consejos de ingeniería — lo que reviso antes de empezar cualquier proyecto
const CONSEJOS = [
  'seguridad primero: revisa el OWASP Top 10 antes de escribir la primera línea — inyección, auth rota y secretos expuestos siguen liderando la lista.',
  'clean architecture: las reglas de negocio no deben saber qué framework las sirve. El dominio en el centro, los detalles afuera.',
  'separación de responsabilidades: cada módulo debe tener UNA razón para cambiar. Si tu controller valida, consulta y formatea… son tres clases disfrazadas de una.',
  'las API keys y secretos viven en variables de entorno, JAMÁS en el código ni en el repo. Un commit con un secreto es un secreto quemado.',
  'tests desde el día uno: no son un lujo de después, son el contrato de que tu código hace lo que prometiste. PractiX tiene 1.336 y duermo tranquilo.',
  'valida TODO input del usuario en el servidor. El frontend valida por cortesía; el backend valida por seguridad.',
  'commits convencionales y pequeños: un commit = una intención. Tu yo del futuro hace git log y entiende la historia.',
  'principio de menor privilegio: cada servicio, usuario y token con el mínimo permiso necesario. Si algo se compromete, el daño queda contenido.',
  'audita tus dependencias (npm audit, dependabot): tu app es tan segura como el paquete más descuidado que importaste.',
  'accesibilidad no es opcional: HTML semántico, contraste suficiente, navegación por teclado. La web es para todos.',
  'mide antes de optimizar: un performance budget y métricas reales (Core Web Vitals) valen más que mil intuiciones.',
  'SOLID no es teoría de universidad: es la diferencia entre tocar una clase y romper tres, o tocar una y romper ninguna.',
]

const COMMANDS = {
  help: () => [
    'comandos disponibles:',
    '  whoami ........ quién es Felipe',
    '  stack ......... tecnologías que maneja',
    '  proyectos ..... lista de proyectos con links',
    '  contacto ...... canales de contacto',
    '  consejos ...... un consejo de ingeniería del sistema',
    '  ir <seccion> .. navegar (ej: ir proyectos)',
    '  date .......... hora del sistema (Chile)',
    '  fa ............ identidad del sistema',
    '  clear ......... limpiar pantalla',
    '  exit .......... cerrar terminal (o ESC)',
  ],
  whoami: () => [
    'Felipe Aguirre — desarrollador de software (Chile)',
    'full stack · mobile · IA aplicada',
    'de la contabilidad al código: productos web con Next.js & React,',
    'apps móviles con React Native y APIs con Java & Spring Boot.',
  ],
  stack: () => [
    'frontend ... React, Next.js, TypeScript, Tailwind CSS',
    'mobile ..... React Native, Expo',
    'backend .... Node.js, Express, Java, Spring Boot, Python, Prisma',
    'datos ...... PostgreSQL, Supabase, MongoDB',
    'ia ......... HuggingFace, embeddings NLP, matching semántico',
    'testing .... Vitest, Playwright, Testing Library',
    'devops ..... Git, GitHub Actions, Docker, Vercel, Sentry',
  ],
  proyectos: () => [
    '[destacado] PractiX — matching de prácticas con IA, en producción',
    '            <a href="https://practix.cl" target="_blank" rel="noopener">practix.cl</a> · 1.336 tests · Next.js 16 + HuggingFace',
    'TODO App — React Native + Expo + TypeScript',
    'Gestión de Prácticas API — Spring Boot',
    'Sabor Gourmet — sistema de reservas, Spring Boot',
    'Login CRUD — TypeScript + React Native',
    '[colab]     Cuarto Ambulante App — Python, retail real',
    'repos: <a href="https://github.com/FelipeAguirreA" target="_blank" rel="noopener">github.com/FelipeAguirreA</a>',
  ],
  contacto: () => [
    'email ...... <a href="mailto:felipeaguirreee@gmail.com">felipeaguirreee@gmail.com</a>',
    'linkedin ... <a href="https://www.linkedin.com/in/felipe-aguirre-aravena" target="_blank" rel="noopener">felipe-aguirre-aravena</a>',
    'github ..... <a href="https://github.com/FelipeAguirreA" target="_blank" rel="noopener">FelipeAguirreA</a>',
    "tip: 'ir contacto' te lleva al formulario",
  ],
  date: () => [
    new Intl.DateTimeFormat('es-CL', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'America/Santiago',
    }).format(new Date()) + ' (Chile)',
  ],
  fa: () => [ASCII],
  consejos: () => [
    `<span class="term__tip">// consejo del sistema</span>`,
    CONSEJOS[(Math.random() * CONSEJOS.length) | 0],
    `<span class="term__dim-inline">ejecuta 'consejos' de nuevo para otro.</span>`,
  ],
  tips: () => COMMANDS.consejos(),
  sudo: () => ['acceso denegado — este sistema solo responde a Felipe.'],
  practix: () => {
    window.open('https://practix.cl', '_blank', 'noopener')
    return ['abriendo practix.cl…']
  },
}

export function initTerminal() {
  const term = document.createElement('div')
  term.className = 'term'
  term.setAttribute('role', 'dialog')
  term.setAttribute('aria-label', 'Terminal FA·SYS')
  term.innerHTML = `
    <div class="term__window">
      <div class="term__chrome">
        <span class="win__dot"></span>
        <span>fa://terminal</span>
        <button class="term__close" type="button" aria-label="Cerrar terminal">ESC ✕</button>
      </div>
      <div class="term__out" id="term-out"></div>
      <div class="term__row">
        <span class="term__prompt">${PROMPT}</span>
        <input class="term__input" id="term-input" type="text" autocomplete="off" spellcheck="false" aria-label="Comando">
      </div>
    </div>
  `
  document.body.appendChild(term)

  const out = term.querySelector('#term-out')
  const input = term.querySelector('#term-input')
  const history = []
  let hIndex = -1
  let open = false

  function print(lines, cls = '') {
    for (const line of lines) {
      const div = document.createElement('div')
      div.className = `term__line ${cls}`
      div.innerHTML = line
      out.appendChild(div)
    }
    out.scrollTop = out.scrollHeight
  }

  function run(raw) {
    const cmd = raw.trim()
    if (!cmd) return
    history.unshift(cmd)
    hIndex = -1
    print([`<span class="term__echo">${PROMPT}</span> ${cmd.replace(/</g, '&lt;')}`])

    const [name, ...args] = cmd.toLowerCase().split(/\s+/)

    if (name === 'clear') {
      out.innerHTML = ''
      return
    }
    if (name === 'exit') {
      toggle(false)
      return
    }
    if (name === 'ir') {
      const target = args[0]
      if (SECTIONS.includes(target)) {
        toggle(false)
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
        return
      }
      print([`sección desconocida: ${target ?? ''} — opciones: ${SECTIONS.join(', ')}`], 'term__line--dim')
      return
    }
    if (name === 'sudo') {
      print(COMMANDS.sudo(), 'term__line--err')
      return
    }
    const fn = COMMANDS[name]
    if (fn) print(fn())
    else print([`comando no encontrado: ${name} — escribe 'help'`], 'term__line--err')
  }

  function toggle(force) {
    open = force ?? !open
    term.classList.toggle('is-open', open)
    document.body.classList.toggle('term-open', open)
    if (open) {
      if (!out.childElementCount) {
        print([ASCII])
        print(
          ["bienvenido. escribe 'help' para ver los comandos, o 'consejos' para un tip de ingeniería._"],
          'term__line--dim'
        )
      }
      setTimeout(() => input.focus(), 60)
    }
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      run(input.value)
      input.value = ''
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length) {
        hIndex = Math.min(hIndex + 1, history.length - 1)
        input.value = history[hIndex]
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      hIndex = Math.max(hIndex - 1, -1)
      input.value = hIndex === -1 ? '' : history[hIndex]
    }
  })

  term.querySelector('.term__close').addEventListener('click', () => toggle(false))
  term.addEventListener('click', (e) => {
    if (e.target === term) toggle(false)
  })

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) toggle(false)
    if (
      (e.key === 't' || e.key === 'T') &&
      !open &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      !/^(input|textarea)$/i.test(document.activeElement?.tagName ?? '')
    ) {
      e.preventDefault()
      toggle(true)
    }
  })

  return { toggle }
}
