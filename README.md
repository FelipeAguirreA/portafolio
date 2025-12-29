# 🚀 Portafolio Felipe Aguirre

Portafolio profesional moderno con animaciones GSAP, cursor fluido WebGL y envío de correo real mediante Vercel Functions + Resend.

## 📁 Estructura del Proyecto

```
portafolio/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos
├── js/
│   └── script.js       # Animaciones
├── assets/images/      # Imágenes
├── README.md           # Documentación
└── .git/               # Control de versiones
```

## ✨ Características

- ✅ Animaciones modernas con **GSAP v3.12.2** (ScrollTrigger, ScrollTo)
- ✅ Cursor fluido WebGL con shaders personalizados
- ✅ Barra de progreso de scroll con degradado y glow
- ✅ Modal de confirmación al enviar formulario (GSAP)
- ✅ Partículas y efectos parallax sutiles
- ✅ Formulario de contacto real vía **Vercel Functions + Resend**
- ✅ Responsive design y navegación suave

## 🖼️ Capturas y GIFs

Coloca tus GIFs en `assets/images/demo/` y actualiza los nombres si lo necesitas.

<img src="assets/images/demo/hero-animation.gif" alt="Animación Hero" width="800" height="400" onerror="this.src='https://media.giphy.com/media/xT0GqeSlGSRWn9U06E/giphy.gif'" />

<img src="assets/images/demo/projects-parallax.gif" alt="Parallax y proyectos" width="800" height="400" onerror="this.src='https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif'" />

<img src="assets/images/demo/contact-success-modal.gif" alt="Modal de éxito del formulario" width="800" height="400" onerror="this.src='https://media.giphy.com/media/3o6fJ1BM7l7cJk9aae/giphy.gif'" />

## 🛠️ Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Estilos y responsividad
- **JavaScript ES6+** - Interactividad
- **GSAP v3.12.2** - Animaciones
- **ScrollTrigger** - Scroll-based animations
- **Font Awesome 6.4.0** - Iconos
 - **Vercel Functions** - API serverless para envío de email
 - **Resend** - Servicio de email transaccional

## 🚀 Desarrollo Local

```bash
# Servidor local simple (opción rápida)
python -m http.server 8000
# Accede a http://localhost:8000

# Desarrollo con Vercel (Functions)
npm install
vercel dev
# Accede a http://localhost:3000
```

### Variables de Entorno

Para probar el formulario en local, crea un archivo `.env.local` en la raíz:

```
RESEND_API_KEY=tu_api_key_de_resend
```

Luego reinicia `vercel dev`.

## 📮 Envío de Emails (Producción)

- Endpoint serverless: [api/send-email.js](api/send-email.js)
- Usa **Resend** con sandbox (remitente `onboarding@resend.dev`)
- En Vercel → Settings → Environment Variables agrega `RESEND_API_KEY` con scope Production. Tras cambiarla, realiza un redeploy completo.

## 🔧 Despliegue

```bash
# Deploy con Vercel
vercel
vercel --prod
```

O desde la UI: Deployments → ⋮ → Redeploy (sin caché).

## 🧩 Notas de Animación

- Se evita ScrollSmoother para compatibilidad; se mantiene smooth scroll nativo.
- Animaciones con `gsap.set + gsap.fromTo` para garantizar visibilidad inicial (evita elementos invisibles si el trigger no dispara).
- El modal de éxito se reinicia en cada apertura (`gsap.killTweensOf` + estados iniciales).

## 🔒 Seguridad

- Nunca expongas `RESEND_API_KEY` en el frontend ni lo subas al repo.
- Usa variables de entorno en Vercel (Settings → Environment Variables) y `.env.local` en desarrollo. Estos archivos ya están ignorados por `.gitignore`.
- Si tu plan lo permite, marca la variable como "Sensitive" para ocultar su valor en la UI.
- Tras modificar env vars, haz redeploy completo (sin caché) para que los cambios apliquen.
- La API responde con errores genéricos al cliente y registra detalles en logs del servidor.

## 🛠️ Troubleshooting

- 404 de imágenes en producción: respeta mayúsculas/minúsculas (ej. `git.PNG` vs `git.png`).
- CDN 404 de ScrollSmoother: fue removido (no se usa).
- Si ves `Missing API key` en `/api/send-email`: revisa `RESEND_API_KEY` y redeploy completo.
- Si iconos/elementos no aparecen al primer scroll: usa `ScrollTrigger.refresh()` o verifica que se usa `fromTo` y `gsap.set`.

## 📧 Contacto

- Email: felipeaguirreee@gmail.com
- GitHub: [FelipeAguirreA](https://github.com/FelipeAguirreA)
- LinkedIn: [Felipe Aguirre](https://linkedin.com/in/felipe-aguirre-aravena-489188a1)

---

**© 2025 Felipe Aguirre. All rights reserved.**

---

Desarrollado con ❤️ por Felipe Aguirre
