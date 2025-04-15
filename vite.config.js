import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'



export default defineConfig({
  base: '/', // Use correct base path
  plugins: [react()],
});

