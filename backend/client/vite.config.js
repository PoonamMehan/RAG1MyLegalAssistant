import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
<<<<<<< HEAD:frontend/vite.config.js
      '/api': 'http://localhost:8000',
=======
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: false, 
      },
>>>>>>> 6d61526 (Final version 1 to deploy the mern web app):backend/client/vite.config.js
    },
  },
})
