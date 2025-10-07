import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // force dev server port
    strictPort: true // if 5173 is busy, fail instead of switching
  }
});
