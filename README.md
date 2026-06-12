# Felipe Aguirre — Portafolio

Portafolio personal como showcase 3D/WebGL: una escena procedural persistente con timeline cinematográfica que evoluciona con el scroll.

**→ Estética "Obsidiana editorial"**: grafito casi negro, tipografía Fraunces + Archivo + Spline Sans Mono, y color grading de cine por capítulos (chartreuse · ámbar · teal · dorado).

## Stack

- **Vite 5** — build y dev server
- **Three.js** — núcleo procedural (icosaedro + FBM displacement + fresnel), halo de partículas con morph a monograma "FA"
- **Theatre.js** (`@theatre/core`) — timeline cinematográfica: intro de cámara + scrub por scroll + color grading. En dev, `@theatre/studio` permite editar keyframes en vivo
- **GSAP + ScrollTrigger** — motion del DOM (reveals, contadores, carrusel, magnetismo)
- **Vercel Functions + Resend** — formulario de contacto (`api/send-email.js`)

## Desarrollo

```bash
npm install
npm run dev        # Vite en http://localhost:5173 (formulario NO funciona acá)
vercel dev         # Vite + Functions — necesario para probar el formulario
npm run build      # build de producción en dist/
npm run preview    # servir el build
```

Para el formulario en local: crear `.env.local` con `RESEND_API_KEY=...` y usar `vercel dev`.

## Estructura

```
index.html                  # entry de Vite
api/send-email.js           # Vercel Function (Resend)
public/assets/images/       # fotos y certificados
src/
  main.js                   # boot: loader → escena → theatre → UI
  scene/scene.js            # Three.js: núcleo, partículas, cámara
  scene/shaders.js          # GLSL: simplex/FBM, fresnel, morph
  theatre/sequence.js       # objetos Theatre + intro + scrub + letterbox
  theatre/state.json        # keyframes de la timeline (editable con Studio)
  ui/loader.js              # preloader con contador y cortina
  ui/ui.js                  # nav, reveals, títulos, carrusel, lightbox, tilt
  ui/contact.js             # formulario → /api/send-email
  styles/main.css           # sistema de diseño completo
```

## Editar la animación (Theatre.js Studio)

En `npm run dev` aparece el Studio: ajustá keyframes de cámara/núcleo/partículas en vivo, exportá el JSON del proyecto y reemplazá `src/theatre/state.json`.

## Deploy

```bash
vercel --prod
```

Vercel detecta Vite automáticamente. La env var `RESEND_API_KEY` debe estar en Settings → Environment Variables (scope Production); tras cambiarla, redeploy completo sin caché.

---

© 2026 Felipe Aguirre
