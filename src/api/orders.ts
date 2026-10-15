/** Servicio de datos de pedidos del cliente (POST/GET /orders). */
import { api } from './client';
import { toUiOrder, type UiOrder } from './adapters';
import { orderListSchema, orderResponseSchema } from './schemas';
import type { PaymentMethod, Pagination } from '@/types/api';

interface Signaled {
  signal?: AbortSignal;
}

export interface OrderLineInput {
  itemId: string;
  quantity: number;
}

/**
 * POST /orders — envía SOLO { items: [{ itemId, quantity }], paymentMethod }.
 * Nunca se mandan precios ni totales: los calcula el servidor.
 */
export async function createOrder(lines: readonly OrderLineInput[], paymentMethod: PaymentMethod): Promise<UiOrder> {
  const items = lines.map(({ itemId, quantity }) => ({ itemId, quantity }));
  const res = await api.post('/orders', { items, paymentMethod }, { schema: orderResponseSchema });
  return toUiOrder(res.data);
}

export async function listOrders({ page = 1, limit = 50 }: { page?: number; limit?: number } = {}, { signal }: Signaled = {}): Promise<Pagination<UiOrder>> {
  const res = await api.get(`/orders?page=${page}&limit=${limit}`, { signal, schema: orderListSchema });
  return { data: res.data.map(toUiOrder), meta: res.meta };
}

export async function getOrder(id: string, { signal }: Signaled = {}): Promise<UiOrder> {
  const res = await api.get(`/orders/${encodeURIComponent(id)}`, { signal, schema: orderResponseSchema });
  return toUiOrder(res.data);
}

/** Forma mínima de un error de la API con la que trabaja findOffendingItemId (ApiError la cumple). */
export interface OrderErrorLike {
  code?: string;
  message?: string;
  details?: unknown;
}

function detailPath(detail: unknown): string {
  return typeof detail === 'object' && detail !== null && 'path' in detail && typeof detail.path === 'string' ? detail.path : '';
}

/**
 * Identifica qué línea del pedido rechazó el servidor, para quitarla del carrito.
 * - 400/422 traen `details: [{ path: 'items.N.itemId' }]` con la posición.
 * - 404 trae el id en el mensaje («El item <id> no existe.»).
 * @returns itemId o null si no se puede determinar
 */
export function findOffendingItemId(err: OrderErrorLike | null | undefined, lines: readonly { itemId: string }[]): string | null {
  if (!err) return null;
  if (Array.isArray(err.details)) {
    for (const detail of err.details as unknown[]) {
      const m = /^items\.(\d+)\.itemId$/.exec(detailPath(detail));
      const line = m ? lines[Number(m[1])] : undefined;
      if (line) return line.itemId;
    }
  }
  const message = err.message;
  if (err.code === 'not_found' && typeof message === 'string') {
    return lines.find((l) => message.includes(l.itemId))?.itemId ?? null;
  }
  return null;
}
