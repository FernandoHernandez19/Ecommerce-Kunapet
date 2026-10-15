import { vi, type Mock } from 'vitest';
import type { Item, Order, Pet, User } from '@/types/api';

/** Respuesta JSON simulada de fetch. */
export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Error con el formato uniforme del contrato (docs/api-contract.md §1.2). */
export function errorResponse(status: number, code: string, message: string, details?: unknown): Response {
  return jsonResponse({ error: { code, message, ...(details !== undefined ? { details } : {}) } }, status);
}

export type FetchMock = Mock<typeof fetch>;
type Queued = Response | (() => Response | Promise<Response>);

/** Reemplaza fetch por un mock que responde en orden. Devuelve el mock. */
export function mockFetch(...responses: Queued[]): FetchMock {
  const queue = [...responses];
  const fn: FetchMock = vi.fn<typeof fetch>(async () => {
    const next = queue.shift();
    if (next === undefined) throw new Error('Sin respuesta simulada para esta petición');
    return typeof next === 'function' ? next() : next;
  });
  vi.stubGlobal('fetch', fn);
  return fn;
}

export const sampleUser: User = {
  id: '5f0c3b1e-9a1d-4a53-8f1e-2c3d4e5f6a7b',
  name: 'Camila Rodríguez',
  email: 'camila@kunapet.com',
  role: 'client',
  phone: null,
  avatarUrl: null,
  createdAt: '2025-06-29T14:00:00.000Z',
};

/** Cabeceras de una llamada registrada en el mock de fetch. */
export function fetchHeaders(call: Parameters<typeof fetch>): Headers {
  return new Headers(call[1]?.headers);
}

/** Cuerpo JSON (ya parseado) de una llamada registrada en el mock de fetch. */
export function fetchBody(call: Parameters<typeof fetch>): unknown {
  const body = call[1]?.body;
  return typeof body === 'string' ? (JSON.parse(body) as unknown) : undefined;
}

export interface RouteCall {
  url: URL;
  path: string;
  method: string;
  body: unknown;
  headers: Headers;
}

/** Lo que puede devolver un manejador de ruta: una Response, un JSON (se envuelve en 200) o undefined (ruta sin simular). */
export type RouteResult = Response | object | undefined;

/**
 * fetch simulado por ruta: `handler(call)` devuelve una Response (o un objeto JSON, que se
 * envuelve en 200). Registra cada llamada en `calls`.
 */
export function routeFetch(handler: (call: RouteCall) => RouteResult | Promise<RouteResult>): { fn: FetchMock; calls: RouteCall[] } {
  const calls: RouteCall[] = [];
  const fn: FetchMock = vi.fn<typeof fetch>(async (input, init = {}) => {
    const u = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url);
    const call: RouteCall = {
      url: u,
      path: u.pathname.replace('/api/v1', ''),
      method: init.method ?? 'GET',
      body: typeof init.body === 'string' ? (JSON.parse(init.body) as unknown) : undefined,
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
export function apiItem(overrides: Partial<Item> = {}): Item {
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

export function apiService(overrides: Partial<Item> = {}): Item {
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

export function apiPet(overrides: Partial<Pet> = {}): Pet {
  return {
    id: 'p1',
    ownerId: 'u1',
    name: 'Luna',
    species: 'dog',
    breed: 'Golden',
    gender: 'female',
    birthDate: '2022-03-15',
    weightGrams: 28000,
    notes: null,
    photoUrl: null,
    createdAt: '2025-01-10T10:00:00.000Z',
    updatedAt: '2025-01-10T10:00:00.000Z',
    ...overrides,
  };
}

export function apiOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: '9a8b7c6d-5e4f-4a3b-9c2d-1e0f9a8b7c6d',
    clientId: 'c1',
    status: 'pending_payment',
    paymentMethod: 'yape',
    items: [{ itemId: 'i1', title: 'Alimento', type: 'product', unitPriceCents: 14550, quantity: 2, lineTotalCents: 29100 }],
    subtotalCents: 29100,
    shippingCents: 1500,
    platformFeeCents: 250,
    totalCents: 30850,
    currency: 'PEN',
    createdAt: '2025-06-29T19:00:00.000Z',
    updatedAt: '2025-06-29T19:00:00.000Z',
    ...overrides,
  };
}

export const page = <T>(data: T[], total: number = data.length, extra: Partial<{ page: number; limit: number }> = {}) => ({
  data,
  meta: { page: 1, limit: 12, total, ...extra },
});
