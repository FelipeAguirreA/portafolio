// Escena 3D persistente — núcleo procedural + halo de partículas.
// Los parámetros (params) los escribe Theatre.js; acá solo se consumen.

import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Fog,
  Color,
  IcosahedronGeometry,
  TorusGeometry,
  ShaderMaterial,
  Mesh,
  MeshBasicMaterial,
  PointsMaterial,
  LineBasicMaterial,
  LineSegments,
  Group,
  BufferGeometry,
  BufferAttribute,
  Points,
  Line,
  AdditiveBlending,
  Clock,
  Vector3,
} from 'three'
import {
  coreVertex,
  coreFragment,
  particlesVertex,
  particlesFragment,
} from './shaders.js'

const INK = '#0c0e0b'
const ACCENT = '#cdf32f'
const BONE = '#ece9df'
const COOL = '#2fbfa9' // teal de cine — sombra fría del grading

export function initScene({ reduced = false } = {}) {
  const canvas = document.getElementById('scene')

  // Estado que Theatre.js muta cada frame
  const params = {
    // userOrbit: órbita manual por drag — se suma a la de Theatre
    // warp: salto al hiperespacio (FOV) al navegar por el menú
    camera: { distance: 8.4, height: 0.5, orbit: 0, userOrbit: 0, warp: 0 },
    // flash/kick y pulse son multiplicadores de impulso (HUD) — Theatre no los toca
    core: { distortion: 0.85, speed: 0.3, glow: 0.75, grade: 0, flash: 1, kick: 1 },
    particles: { opacity: 0.8, spread: 1, morph: 0, pulse: 1 },
  }

  let renderer
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
  } catch {
    document.body.classList.add('no-webgl')
    return { params, render: () => {}, requestRender: () => {} }
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
  renderer.setPixelRatio(dpr)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(new Color(INK), 1)

  const scene = new Scene()
  scene.fog = new Fog(new Color(INK), 9, 26)

  const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 60)

  // ---- Núcleo procedural ----
  const isMobile = window.innerWidth < 768
  const coreGeo = new IcosahedronGeometry(2.1, isMobile ? 24 : 40)
  const coreMat = new ShaderMaterial({
    vertexShader: coreVertex,
    fragmentShader: coreFragment,
    uniforms: {
      uTime: { value: 0 },
      uDistortion: { value: params.core.distortion },
      uSpeed: { value: params.core.speed },
      uGlow: { value: params.core.glow },
      uGrade: { value: params.core.grade },
      uBase: { value: new Color('#161a14') },
      uAccent: { value: new Color(ACCENT) },
      uCool: { value: new Color(COOL) },
    },
  })
  const core = new Mesh(coreGeo, coreMat)
  core.position.y = 0.2
  scene.add(core)

  // ---- Giroscopio orbital: anillos con precesión alrededor del núcleo ----
  const accentC = new Color(ACCENT)
  const coolC = new Color(COOL)
  const tmpColor = new Color()

  const rings = new Group()
  const ringDefs = [
    { r: 3.5, tilt: [Math.PI / 2.3, 0.4], speed: 0.16 },
    { r: 4.3, tilt: [0.6, Math.PI / 2.6], speed: -0.11 },
    { r: 5.2, tilt: [1.9, 1.1], speed: 0.07 },
  ]
  const ringMats = []
  ringDefs.forEach((d) => {
    const mat = new MeshBasicMaterial({
      color: accentC.clone(),
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    })
    const ring = new Mesh(new TorusGeometry(d.r, 0.012, 6, 160), mat)
    ring.rotation.set(d.tilt[0], d.tilt[1], 0)
    rings.add(ring)
    ringMats.push(mat)
  })
  rings.position.y = 0.2
  scene.add(rings)

  // ---- Red neuronal: nodos conectados, con paquetes de datos viajando ----
  const NODE_COUNT = isMobile ? 42 : 72
  const nodePos = []
  for (let i = 0; i < NODE_COUNT; i++) {
    const r = 5.4 + Math.random() * 2.2
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    nodePos.push([
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi) * 0.62 + 0.2,
      r * Math.sin(phi) * Math.sin(theta),
    ])
  }
  // cada nodo se conecta a sus 2 vecinos más cercanos
  const edges = []
  const seenEdge = new Set()
  nodePos.forEach((a, i) => {
    const dists = nodePos
      .map((b, j) => ({ j, d: (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2 }))
      .filter((e) => e.j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, 2)
    dists.forEach(({ j }) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (!seenEdge.has(key)) {
        seenEdge.add(key)
        edges.push([nodePos[i], nodePos[j]])
      }
    })
  })
  const linePositions = new Float32Array(edges.length * 6)
  edges.forEach(([a, b], i) => {
    linePositions.set([...a, ...b], i * 6)
  })
  const lineGeo = new BufferGeometry()
  lineGeo.setAttribute('position', new BufferAttribute(linePositions, 3))
  const lineMat = new LineBasicMaterial({
    color: new Color(BONE),
    transparent: true,
    opacity: 0.07,
    depthWrite: false,
  })
  scene.add(new LineSegments(lineGeo, lineMat))

  const nodeGeo = new BufferGeometry()
  nodeGeo.setAttribute('position', new BufferAttribute(new Float32Array(nodePos.flat()), 3))
  const nodeMat = new PointsMaterial({
    color: new Color(BONE),
    size: 0.06,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  })
  scene.add(new Points(nodeGeo, nodeMat))

  // paquetes de datos: luces que viajan por las conexiones
  const PACKETS = isMobile ? 5 : 10
  const packetState = Array.from({ length: PACKETS }, () => ({
    edge: (Math.random() * edges.length) | 0,
    t: Math.random(),
    speed: 0.25 + Math.random() * 0.45,
  }))
  const packetArr = new Float32Array(PACKETS * 3)
  const packetGeo = new BufferGeometry()
  packetGeo.setAttribute('position', new BufferAttribute(packetArr, 3))
  const packetMat = new PointsMaterial({
    color: accentC.clone(),
    size: 0.17,
    transparent: true,
    opacity: 0.95,
    blending: AdditiveBlending,
    depthWrite: false,
  })
  scene.add(new Points(packetGeo, packetMat))

  // ---- Halo de partículas ----
  const COUNT = isMobile ? 420 : 1100
  const positions = new Float32Array(COUNT * 3)
  const scales = new Float32Array(COUNT)
  const phases = new Float32Array(COUNT)
  for (let i = 0; i < COUNT; i++) {
    // cascarón esférico r ∈ [4.5, 13]
    const r = 4.5 + Math.pow(Math.random(), 0.7) * 8.5
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = (r * Math.cos(phi)) * 0.6
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    scales[i] = 0.4 + Math.random() * 1.4
    phases[i] = Math.random() * Math.PI * 2
  }
  const pGeo = new BufferGeometry()
  pGeo.setAttribute('position', new BufferAttribute(positions, 3))
  pGeo.setAttribute('aScale', new BufferAttribute(scales, 1))
  pGeo.setAttribute('aPhase', new BufferAttribute(phases, 1))

  // Destinos del morph "FA" — se llenan cuando la fuente está lista
  const targets = new Float32Array(COUNT * 3)
  pGeo.setAttribute('aTarget', new BufferAttribute(targets, 3))

  function buildTextTargets() {
    const cw = 520
    const chh = 300
    const c = document.createElement('canvas')
    c.width = cw
    c.height = chh
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.font = 'italic 700 235px Fraunces, Georgia, serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('FA', cw / 2, chh / 2 + 10)
    const data = ctx.getImageData(0, 0, cw, chh).data
    const pts = []
    for (let y = 0; y < chh; y += 3) {
      for (let x = 0; x < cw; x += 3) {
        if (data[(y * cw + x) * 4 + 3] > 128) pts.push([x, y])
      }
    }
    if (!pts.length) return
    const S = 7.2 / cw // ancho del monograma en unidades de mundo
    for (let i = 0; i < COUNT; i++) {
      const [px, py] = pts[Math.floor(Math.random() * pts.length)]
      targets[i * 3] = (px - cw / 2) * S
      targets[i * 3 + 1] = (chh / 2 - py) * S + 0.4
      targets[i * 3 + 2] = 2.9 + (Math.random() - 0.5) * 0.5
    }
    pGeo.attributes.aTarget.needsUpdate = true
  }
  if (document.fonts?.ready) document.fonts.ready.then(buildTextTargets)
  else buildTextTargets()
  const pMat = new ShaderMaterial({
    vertexShader: particlesVertex,
    fragmentShader: particlesFragment,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uSpread: { value: params.particles.spread },
      uOpacity: { value: params.particles.opacity },
      uMorph: { value: params.particles.morph },
      uGrade: { value: params.core.grade },
      uPixelRatio: { value: dpr },
      uBone: { value: new Color(BONE) },
      uAccent: { value: new Color(ACCENT) },
      uCool: { value: new Color(COOL) },
    },
  })
  const points = new Points(pGeo, pMat)
  scene.add(points)

  // ---- Parallax de mouse ----
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
  window.addEventListener('pointermove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1
  })

  function updateCamera() {
    const { distance, height, orbit, userOrbit, warp } = params.camera
    const fov = 50 + warp * 24
    if (camera.fov !== fov) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
    const aspectBoost = camera.aspect < 0.8 ? 1.4 : 1
    const angle = (orbit + userOrbit) * Math.PI * 2
    camera.position.set(
      Math.sin(angle) * distance * aspectBoost + mouse.x * 0.7,
      height + mouse.y * -0.45,
      Math.cos(angle) * distance * aspectBoost
    )
    camera.lookAt(0, 0.2, 0)
  }

  let prevT = 0
  function applyParams(t) {
    const dt = Math.max(0, t - prevT)
    prevT = t

    coreMat.uniforms.uTime.value = t
    coreMat.uniforms.uDistortion.value = params.core.distortion * params.core.kick
    coreMat.uniforms.uSpeed.value = params.core.speed
    coreMat.uniforms.uGlow.value = params.core.glow * params.core.flash
    coreMat.uniforms.uGrade.value = params.core.grade
    pMat.uniforms.uGrade.value = params.core.grade
    pMat.uniforms.uTime.value = t
    pMat.uniforms.uSpread.value = params.particles.spread * params.particles.pulse
    pMat.uniforms.uOpacity.value = params.particles.opacity
    pMat.uniforms.uMorph.value = params.particles.morph
    core.rotation.y = t * 0.05

    // grading compartido: anillos y paquetes viran con el capítulo
    tmpColor.copy(accentC).lerp(coolC, params.core.grade)

    // precesión de los anillos — el flash del núcleo los enciende
    rings.children.forEach((ring, i) => {
      const d = ringDefs[i]
      ring.rotation.x = d.tilt[0] + Math.sin(t * d.speed) * 0.45
      ring.rotation.y = d.tilt[1] + Math.cos(t * d.speed * 0.8) * 0.55
      ringMats[i].color.copy(tmpColor)
      ringMats[i].opacity = 0.16 * params.core.flash
    })

    // paquetes de datos recorriendo la red
    packetMat.color.copy(tmpColor)
    packetState.forEach((p, i) => {
      p.t += p.speed * dt * params.particles.pulse
      if (p.t >= 1) {
        p.t = 0
        p.edge = (Math.random() * edges.length) | 0
      }
      const [a, b] = edges[p.edge]
      packetArr[i * 3] = a[0] + (b[0] - a[0]) * p.t
      packetArr[i * 3 + 1] = a[1] + (b[1] - a[1]) * p.t
      packetArr[i * 3 + 2] = a[2] + (b[2] - a[2]) * p.t
    })
    packetGeo.attributes.position.needsUpdate = true

    // la red se desvanece cuando las partículas forman el FA (final)
    const fade = 1 - params.particles.morph * 0.8
    lineMat.opacity = 0.07 * fade
    nodeMat.opacity = 0.45 * fade
    packetMat.opacity = 0.95 * fade

    // cometas cruzando el fondo
    comets.forEach((c) => {
      if (c.life >= 1) {
        if (t >= c.nextAt) spawnComet(c, t)
        else {
          c.mat.opacity = 0
          return
        }
      }
      c.life += dt * 0.55
      const head = c.start.clone().addScaledVector(c.dir, c.speed * c.life)
      const tail = head.clone().addScaledVector(c.dir, -2.6)
      const arr = c.geo.attributes.position.array
      arr[0] = head.x
      arr[1] = head.y
      arr[2] = head.z
      arr[3] = tail.x
      arr[4] = tail.y
      arr[5] = tail.z
      c.geo.attributes.position.needsUpdate = true
      c.mat.opacity = Math.sin(Math.min(c.life, 1) * Math.PI) * 0.55
    })
  }

  // ---- Cometas: eventos del universo ----
  const COMET_COUNT = isMobile ? 2 : 3
  const comets = []
  for (let i = 0; i < COMET_COUNT; i++) {
    const geo = new BufferGeometry()
    geo.setAttribute('position', new BufferAttribute(new Float32Array(6), 3))
    const mat = new LineBasicMaterial({
      color: new Color(BONE),
      transparent: true,
      opacity: 0,
      blending: AdditiveBlending,
      depthWrite: false,
    })
    scene.add(new Line(geo, mat))
    comets.push({
      geo,
      mat,
      start: new Vector3(),
      dir: new Vector3(),
      life: 2, // empieza "muerto"
      nextAt: 2 + Math.random() * 6,
      speed: 1,
    })
  }
  function spawnComet(c, t) {
    const side = Math.random() < 0.5 ? -1 : 1
    c.start.set(side * (14 + Math.random() * 4), 2 + Math.random() * 6, -6 - Math.random() * 8)
    c.dir
      .set(-side * (0.7 + Math.random() * 0.3), -(0.15 + Math.random() * 0.3), 0.25 * (Math.random() - 0.5))
      .normalize()
    c.speed = 14 + Math.random() * 10
    c.life = 0
    c.nextAt = t + 5 + Math.random() * 9
  }

  const clock = new Clock()
  let frozen = 0

  function render() {
    const t = reduced ? frozen : clock.getElapsedTime()
    mouse.x += (mouse.tx - mouse.x) * 0.05
    mouse.y += (mouse.ty - mouse.y) * 0.05
    applyParams(t)
    updateCamera()
    renderer.render(scene, camera)
  }

  // Con reduced-motion: render bajo demanda, sin loop continuo
  let rafId = null
  function loop() {
    render()
    rafId = requestAnimationFrame(loop)
  }
  function start() {
    if (rafId === null) loop()
  }
  function stop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  if (!reduced) start()
  else requestAnimationFrame(render)

  document.addEventListener('visibilitychange', () => {
    if (reduced) return
    document.hidden ? stop() : start()
  })

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    if (reduced) requestAnimationFrame(render)
  })

  return {
    params,
    render,
    requestRender: () => {
      if (reduced) requestAnimationFrame(render)
    },
  }
}
