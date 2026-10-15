import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Configuración de pruebas del frontend (separada de vite.config.js para no tocar el build).
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{js,jsx}'],
    setupFiles: ['./src/test/setup.js'],
    restoreMocks: true,
  },
});
