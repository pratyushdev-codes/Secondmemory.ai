import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   // build: {
//   //   chunkSizeWarningLimit: 10000, // Set the limit to 1000 kB
//   // },
//   // base: process.env.VITE_BASE_PATH || '/',
//   server:{
//     port: 8080
//   }
// })

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 10000,
    outDir: 'dist',
  },
  server: {
    port: 3000
  }
})
