import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

// Las pruebas NUNCA llaman a la red real: todo fetch debe simularse explícitamente.
// Si alguna petición se cuela, falla con un mensaje claro.
beforeEach(() => {
  window.scrollTo = vi.fn(); // jsdom no lo implementa
  vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('fetch no simulado en la prueba'))));
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
