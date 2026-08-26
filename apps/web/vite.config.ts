import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

const STATIK = process.env.VITE_STATIK === '1'

export default defineConfig({
  // Statik yayin alt dizinde (kullanici.github.io/matgebra/) durabilir;
  // goreli taban hem orada hem kokte calisir.
  base: STATIK ? './' : '/',
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    // Statik kipte /api altindaki dosyalar dogrudan sunulur; vekil olmamali.
    // Vite'in onizleme sunucusu server.proxy'yi devraldigi icin kosul burada.
    proxy: STATIK
      ? undefined
      : {
          '/api': {
            target: 'http://127.0.0.1:5174',
            changeOrigin: true,
            rewrite: (yol) => yol.replace(/^\/api/, ''),
          },
        },
  },
  preview: { port: 4173 },
})
