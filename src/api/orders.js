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
