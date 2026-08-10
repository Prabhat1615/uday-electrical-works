import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom', 'lucide-react', 'qrcode', 'axios']
  },
  server: {
    port: 5173,
    fs: {
      // Allow importing the shared/ package from outside the app root
      allow: ['..']
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
