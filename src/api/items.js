/** Servicio de datos del catálogo y de la gestión de items (GET/POST/PATCH/DELETE /items). */
import { api } from './client';
import { toApiItemInput, toUiItem } from './adapters';

function query(params) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') qs.set(key, String(value));
  }
  const text = qs.toString();
  return text ? `?${text}` : '';
}

/**
 * GET /items — filtros enviados al servidor.
 * @param {{ type?, category?, q?, minPriceCents?, maxPriceCents?, page?, limit? }} filters
 * @returns {Promise<{ data: object[], meta: { page: number, limit: number, total: number } }>}
 */
export async function listItems(filters = {}, { signal } = {}) {
  const res = await api.get(`/items${query(filters)}`, { signal });
  return { data: res.data.map(toUiItem), meta: res.meta };
}

export async function getItem(id, { signal } = {}) {
  const res = await api.get(`/items/${encodeURIComponent(id)}`, { signal });
  return toUiItem(res.data);
}

/**
 * Items del proveedor autenticado. La API no tiene filtro por proveedor, así que se pagina
 * el catálogo (con los inactivos propios) y se filtra por provider.id. Máximo 5 páginas de 100.
 */
export async function listMyItems(userId, { signal } = {}) {
  const mine = [];
  for (let page = 1; page <= 5; page += 1) {
    const { data, meta } = await listItems({ page, limit: 100 }, { signal });
    for (const item of data) {
      if (item.provider.id === userId && !mine.some((m) => m.id === item.id)) mine.push(item);
    }
    if (page * meta.limit >= meta.total) break;
  }
  return mine;
}

export async function createItem(form) {
  const res = await api.post('/items', toApiItemInput(form));
  return toUiItem(res.data);
}

/** PATCH /items/:id con un subconjunto de campos ya en formato de API. */
export async function patchItem(id, changes) {
  const res = await api.patch(`/items/${encodeURIComponent(id)}`, changes);
  return toUiItem(res.data);
}

export async function updateItem(id, form) {
  const { type, ...changes } = toApiItemInput(form); // `type` no se puede cambiar
  void type;
  return patchItem(id, changes);
}

/** DELETE /items/:id — el servidor desactiva el item (isActive: false). */
export function deactivateItem(id) {
  return api.delete(`/items/${encodeURIComponent(id)}`);
}
