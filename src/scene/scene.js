// Escena 3D persistente — núcleo procedural + halo de partículas.
// Los parámetros (params) los escribe Theatre.js; acá solo se consumen.

import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Fog,
  Color,
  IcosahedronGeometry,
  ShaderMaterial,
  Mesh,
  MeshBasicMaterial,
  BufferGeometry,
  BufferAttribute,
  Points,
  AdditiveBlending,
  Clock,
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
    camera: { distance: 8.4, height: 0.5, orbit: 0 },
    core: { distortion: 0.85, speed: 0.3, glow: 0.75, grade: 0 },
    particles: { opacity: 0.8, spread: 1, morph: 0 },
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

  // Cáscara wireframe — profundidad y estructura
  const shellGeo = new IcosahedronGeometry(3.1, 1)
  const shellMat = new MeshBasicMaterial({
    color: new Color(ACCENT),
    wireframe: true,
    transparent: true,
    opacity: 0.05,
  })
  const shell = new Mesh(shellGeo, shellMat)
  shell.position.y = 0.2
  scene.add(shell)

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
    const { distance, height, orbit } = params.camera
    const aspectBoost = camera.aspect < 0.8 ? 1.4 : 1
    const angle = orbit * Math.PI * 2
    camera.position.set(
      Math.sin(angle) * distance * aspectBoost + mouse.x * 0.7,
      height + mouse.y * -0.45,
      Math.cos(angle) * distance * aspectBoost
    )
    camera.lookAt(0, 0.2, 0)
  }

  function applyParams(t) {
    coreMat.uniforms.uTime.value = t
    coreMat.uniforms.uDistortion.value = params.core.distortion
    coreMat.uniforms.uSpeed.value = params.core.speed
    coreMat.uniforms.uGlow.value = params.core.glow
    coreMat.uniforms.uGrade.value = params.core.grade
    pMat.uniforms.uGrade.value = params.core.grade
    pMat.uniforms.uTime.value = t
    pMat.uniforms.uSpread.value = params.particles.spread
    pMat.uniforms.uOpacity.value = params.particles.opacity
    pMat.uniforms.uMorph.value = params.particles.morph
    shell.rotation.y = t * 0.03
    shell.rotation.x = t * 0.012
    core.rotation.y = t * 0.05
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
