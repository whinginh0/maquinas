import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'pagina-de-vendas',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'pagina-de-vendas/index.html'),
        back: resolve(__dirname, 'pagina-de-vendas/back/index.html'),
        upsell1: resolve(__dirname, 'pagina-de-vendas/upsell1/index.html'),
        painelManual: resolve(__dirname, 'pagina-de-vendas/painel-manual.html'),
      },
    },
  },
})
