/** Servicio de datos del catálogo y de la gestión de items (GET/POST/PATCH/DELETE /items). */
import { api } from './client';
import { toApiItemInput, toUiItem, type ItemFormInput, type UiItem } from './adapters';
import { itemListSchema, itemResponseSchema } from './schemas';
import type { Item, ItemType, Pagination } from '@/types/api';

export interface ItemFilters {
  type?: ItemType | '';
  category?: string;
  q?: string;
  minPriceCents?: number;
  maxPriceCents?: number;
  page?: number;
  limit?: number;
}

interface Signaled {
  signal?: AbortSignal;
}

function query(params: object): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') qs.set(key, String(value));
  }
  const text = qs.toString();
  return text ? `?${text}` : '';
}

/**
 * GET /items — filtros enviados al servidor.
 */
export async function listItems(filters: ItemFilters = {}, { signal }: Signaled = {}): Promise<Pagination<UiItem>> {
  const res = await api.get(`/items${query(filters)}`, { signal, schema: itemListSchema });
  return { data: res.data.map(toUiItem), meta: res.meta };
}

export async function getItem(id: string, { signal }: Signaled = {}): Promise<UiItem> {
  const res = await api.get(`/items/${encodeURIComponent(id)}`, { signal, schema: itemResponseSchema });
  return toUiItem(res.data);
}

/**
 * Items del proveedor autenticado. La API no tiene filtro por proveedor, así que se pagina
 * el catálogo (con los inactivos propios) y se filtra por provider.id. Máximo 5 páginas de 100.
 */
export async function listMyItems(userId: string, { signal }: Signaled = {}): Promise<UiItem[]> {
  const mine: UiItem[] = [];
  for (let page = 1; page <= 5; page += 1) {
    const { data, meta } = await listItems({ page, limit: 100 }, { signal });
    for (const item of data) {
      if (item.provider.id === userId && !mine.some((m) => m.id === item.id)) mine.push(item);
    }
    if (page * meta.limit >= meta.total) break;
  }
  return mine;
}

export async function createItem(form: ItemFormInput): Promise<UiItem> {
  const res = await api.post('/items', toApiItemInput(form), { schema: itemResponseSchema });
  return toUiItem(res.data);
}

/** Cambios aceptados por PATCH /items/:id (contrato §4); `type` no se puede cambiar. */
export type ItemPatch = Partial<Pick<Item, 'title' | 'description' | 'category' | 'priceCents' | 'stock' | 'durationMinutes' | 'location' | 'imageUrl' | 'targetPets' | 'isActive'>>;

/** PATCH /items/:id con un subconjunto de campos ya en formato de API. */
export async function patchItem(id: string, changes: ItemPatch): Promise<UiItem> {
  const res = await api.patch(`/items/${encodeURIComponent(id)}`, changes, { schema: itemResponseSchema });
  return toUiItem(res.data);
}

export async function updateItem(id: string, form: ItemFormInput): Promise<UiItem> {
  const { type, ...changes } = toApiItemInput(form); // `type` no se puede cambiar
  void type;
  return patchItem(id, withoutNullPrice(changes));
}

/** Si el precio escrito no era válido, no se envía (el servidor lo rechazaría); el formulario ya lo valida. */
function withoutNullPrice({ priceCents, ...rest }: Omit<ReturnType<typeof toApiItemInput>, 'type'>): ItemPatch {
  return priceCents === null ? rest : { ...rest, priceCents };
}

/** DELETE /items/:id — el servidor desactiva el item (isActive: false). */
export async function deactivateItem(id: string): Promise<void> {
  await api.delete(`/items/${encodeURIComponent(id)}`);
}
