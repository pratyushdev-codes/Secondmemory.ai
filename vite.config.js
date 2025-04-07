// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'



// export default defineConfig({
//   base: '/', // Use correct base path
//   plugins: [react()],
// });

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: false,
    outDir: 'dist'
  }
})