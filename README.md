# 🚀 Portafolio Felipe Aguirre

Portafolio profesional moderno con animaciones GSAP, cursor fluido WebGL y envío de correo real mediante Vercel Functions + Resend.

## 📁 Estructura del Proyecto

```
portafolio/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos (bundleados por Vite)
├── public/
│   ├── js/script.js    # Animaciones (servido estático, scope global)
│   └── assets/images/  # Imágenes (rutas absolutas /assets/...)
├── api/send-email.js   # Vercel Function (formulario + Resend)
├── vite.config.js      # Config de Vite
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

## ️🛠️ Tecnologías

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
pnpm install        # instala dependencias (Vite + Resend)

pnpm dev            # servidor de desarrollo Vite con live-reload → http://localhost:5173
                    # OJO: el formulario NO funciona acá (no levanta la Function)

pnpm build          # build de producción a dist/
pnpm preview        # sirve el build de dist/

vercel dev          # Vite + Vercel Functions → necesario para probar el formulario
```

> El script `dev` debe ser `vite`, NUNCA `vercel dev`: `vercel dev` ejecuta el
> script `dev` del `package.json`, así que apuntarlo a sí mismo causa recursión
> infinita.

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

- Smooth scroll con Lenis (vía CDN UMD) integrado al ticker de GSAP; se evita ScrollSmoother por compatibilidad y peso.
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
- ScrollSmoother fue removido (no se usa); el smooth scroll lo maneja Lenis.
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
