# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es

Portafolio personal como showcase 3D/WebGL. Vite + Three.js (escena procedural persistente) + Theatre.js (timeline cinematográfica) + GSAP (motion DOM) + una Vercel Function para el formulario de contacto. Tono del sitio: presentación/showcase, NO búsqueda de práctica.

## Comandos

```bash
npm run dev      # Vite dev server — el formulario NO funciona acá
vercel dev       # Vite + Functions — necesario para probar /api/send-email
npm run build    # build a dist/
npm run preview  # servir el build
vercel --prod    # deploy
```

No hay tests ni linter. Para el formulario en local hace falta `.env.local` con `RESEND_API_KEY`. OJO: el script `dev` debe ser `vite`, nunca `vercel dev` (recursión infinita: vercel dev ejecuta el script dev).

## Arquitectura

Flujo de boot (`src/main.js`): preloader (promesa `curtainUp`) → escena Three → Theatre (espera `curtainUp` para disparar la intro) → UI → contacto.

- **`src/scene/scene.js`** — expone `params` (camera/core/particles), un objeto mutable que Theatre escribe vía `onValuesChange` y el render loop consume cada frame. NO animar la escena desde otro lado: todo pasa por `params`. Partículas tienen atributo `aTarget` (morph al monograma "FA") que se llena tras `document.fonts.ready` para muestrear Fraunces real.
- **`src/scene/shaders.js`** — GLSL: simplex 3D (Ashima) + FBM, fresnel con color grading (`uGrade` mezcla chartreuse→teal), morph de partículas (`uMorph`). El monograma FA siempre queda chartreuse aunque haya grading.
- **`src/theatre/state.json`** — keyframes **autorados a mano** (formato `sheetsById → sequence → tracksByObject → BasicKeyframedTrack`, `definitionVersion: "0.4.0"`). Timeline: intro 0→3.6s (autoplay), scrub por scroll 4→10s. Al agregar un prop nuevo a un objeto de Theatre hay que: (1) agregarlo en `sequence.js` con `types.number`, (2) agregar track + entrada en `trackIdByPropPath` en state.json, (3) consumirlo en `applyParams` de scene.js.
- **`src/theatre/sequence.js`** — gating de la intro con `Promise.all([project.ready, waitFor])`; el letterbox se retira al terminar la intro Y en el fallback de error (si Theatre no carga, las barras no pueden quedar pegadas). El scrub usa ScrollTrigger sobre `document.body`.
- **`@theatre/studio`** solo en dev vía `import.meta.env.DEV` + import dinámico — verificar tras cambios de build que NO aparece chunk de studio en `dist/`.
- **`src/ui/ui.js`** — reveals con `gsap.set + fromTo` (NUNCA `gsap.from`: garantiza estado visible si el trigger no dispara), títulos char-split + flourish SVG, carrusel con drag inercial, lightbox-galería con navegación por teclado, tilt 3D de fotos, cursor magnético en botones.
- **`api/send-email.js`** — CommonJS, Resend instanciado DENTRO del handler, destino fijo felipeaguirreee@gmail.com. El form tiene UN solo submit handler (`src/ui/contact.js`).

## Sistema de color (capítulos)

Variable CSS `--chapter` redefinida por sección: hero/proyectos/contacto = chartreuse `--accent`, Sobre Mí = `--ember`, Habilidades = `--teal`, Certificados = `--gold`. El grading 3D (track `coreGrade` en Theatre) acompaña: chartreuse→teal a mitad de página→chartreuse al final.

## Preferencias del dueño (NO violar)

- **JAMÁS violeta/púrpura/índigo** — lo considera el cliché de toda IA. Frío = teal, cálido = ember.
- **Fotos personales siempre visibles y limpias** — efectos que las tapen u oculten (halftone, distorsión) fueron rechazados. Tilt/glow que las realce sí.
- **Sin cursor custom** — fue implementado y rechazado (lento, sin sentido). Cursor nativo.
- Color de capítulo solo en títulos/acentos puntuales, no en subtítulos de contenido.
- La foto del perro (`perfilgit.png`) es redonda: siempre `border-radius: 50%`.
- Commits convencionales en español, sin atribución de IA.

## Gotchas

- Imágenes viven en `public/assets/images/` (URLs absolutas `/assets/...`). Case-sensitive en Vercel.
- `prefers-reduced-motion`: la escena renderiza bajo demanda (sin RAF loop), la secuencia salta a posición 3.6, loader/letterbox se saltan (body.reduced), reveals visibles de entrada. Cualquier feature nueva debe respetar este camino.
- El carrusel necesita `dragstart preventDefault` (las imgs disparan drag nativo HTML5 y rompen el gesto).
- Proyecto destacado: PractiX (practix.cl, repo web-master-proyecto, branch `master`). Colaboración: Lokyui/cuartoambulanteapp (Felipe es principal contribuidor).
