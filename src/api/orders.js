/** Servicio de datos de pedidos del cliente (POST/GET /orders). */
import { api } from './client';
import { toUiOrder } from './adapters';

/**
 * POST /orders — envía SOLO { items: [{ itemId, quantity }], paymentMethod }.
 * Nunca se mandan precios ni totales: los calcula el servidor.
 * @param {{ itemId: string, quantity: number }[]} lines
 * @param {'card'|'yape'|'transfer'} paymentMethod
 */
export async function createOrder(lines, paymentMethod) {
  const items = lines.map(({ itemId, quantity }) => ({ itemId, quantity }));
  const res = await api.post('/orders', { items, paymentMethod });
  return toUiOrder(res.data);
}

export async function listOrders({ page = 1, limit = 50 } = {}, { signal } = {}) {
  const res = await api.get(`/orders?page=${page}&limit=${limit}`, { signal });
  return { data: res.data.map(toUiOrder), meta: res.meta };
}

export async function getOrder(id, { signal } = {}) {
  const res = await api.get(`/orders/${encodeURIComponent(id)}`, { signal });
  return toUiOrder(res.data);
}

/**
 * Identifica qué línea del pedido rechazó el servidor, para quitarla del carrito.
 * - 400/422 traen `details: [{ path: 'items.N.itemId' }]` con la posición.
 * - 404 trae el id en el mensaje («El item <id> no existe.»).
 * @param {{ code?: string, message?: string, details?: unknown }} err  ApiError
 * @param {{ itemId: string }[]} lines  Las líneas enviadas, en el mismo orden.
 * @returns {string|null} itemId o null si no se puede determinar
 */
export function findOffendingItemId(err, lines) {
  if (!err) return null;
  if (Array.isArray(err.details)) {
    for (const d of err.details) {
      const m = /^items\.(\d+)\.itemId$/.exec(d?.path ?? '');
      if (m && lines[Number(m[1])]) return lines[Number(m[1])].itemId;
    }
  }
  if (err.code === 'not_found' && typeof err.message === 'string') {
    return lines.find((l) => err.message.includes(l.itemId))?.itemId ?? null;
  }
  return null;
}
