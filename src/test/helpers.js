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

/**
 * fetch simulado por ruta: `handler({ path, method, body, url })` devuelve una Response
 * (o un objeto JSON, que se envuelve en 200). Registra cada llamada en `calls`.
 */
export function routeFetch(handler) {
  const calls = [];
  const fn = vi.fn(async (url, init = {}) => {
    const u = new URL(url);
    const call = {
      url: u,
      path: u.pathname.replace('/api/v1', ''),
      method: init.method ?? 'GET',
      body: init.body ? JSON.parse(init.body) : undefined,
      headers: new Headers(init.headers),
    };
    calls.push(call);
    const res = await handler(call);
    if (res === undefined) throw new Error(`Ruta sin simular: ${call.method} ${call.path}`);
    return res instanceof Response ? res : jsonResponse(res);
  });
  vi.stubGlobal('fetch', fn);
  return { fn, calls };
}

/** Item tal como lo devuelve la API (contrato §5), con provider público. */
export function apiItem(overrides = {}) {
  return {
    id: '11111111-1111-4111-8111-111111111111',
    providerId: 'prov-1',
    type: 'product',
    title: 'Alimento NutriCan 15kg',
    description: 'Alimento seco para perros adultos',
    category: 'alimentos',
    priceCents: 14550,
    currency: 'PEN',
    stock: 10,
    durationMinutes: null,
    location: 'Envío a todo Lima',
    imageUrl: null,
    targetPets: ['dog'],
    isActive: true,
    createdAt: '2025-06-29T14:00:00.000Z',
    updatedAt: '2025-06-29T14:00:00.000Z',
    provider: { id: 'prov-1', name: 'PetShop Central', avatarUrl: null },
    ...overrides,
  };
}

export function apiService(overrides = {}) {
  return apiItem({
    id: '22222222-2222-4222-8222-222222222222',
    type: 'service',
    title: 'Baño y Corte',
    category: 'grooming',
    priceCents: 4500,
    stock: null,
    durationMinutes: 90,
    ...overrides,
  });
}

export const page = (data, total = data.length, extra = {}) => ({ data, meta: { page: 1, limit: 12, total, ...extra } });
