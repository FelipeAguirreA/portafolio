import { defineConfig } from 'vite'

// Sitio estático vanilla. Vite sirve la raíz, copia public/ tal cual
// (assets con rutas absolutas /assets/...) y buildea a dist/.
// El formulario (api/send-email.js) corre solo bajo `vercel dev`.
export default defineConfig({
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
