import { vi } from 'vitest';

/** Respuesta JSON simulada de fetch. */
export function jsonResponse(body, status = 200) {
  return new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Error con el formato uniforme del contrato (docs/api-contract.md §1.2). */
export function errorResponse(status, code, message, details) {
  return jsonResponse({ error: { code, message, ...(details !== undefined ? { details } : {}) } }, status);
}

/** Reemplaza fetch por un mock que responde en orden. Devuelve el mock. */
export function mockFetch(...responses) {
  const queue = [...responses];
  const fn = vi.fn(async () => {
    const next = queue.shift();
    if (next === undefined) throw new Error('Sin respuesta simulada para esta petición');
    return typeof next === 'function' ? next() : next;
  });
  vi.stubGlobal('fetch', fn);
  return fn;
}

export const sampleUser = {
  id: '5f0c3b1e-9a1d-4a53-8f1e-2c3d4e5f6a7b',
  name: 'Camila Rodríguez',
  email: 'camila@kunapet.com',
  role: 'client',
  phone: null,
  avatarUrl: null,
  createdAt: '2025-06-29T14:00:00.000Z',
};

export const fetchHeaders = (call) => new Headers(call[1].headers);
