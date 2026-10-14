import { randomUUID } from 'node:crypto';
import type { Item } from '../types/item.js';
import { normalizeText } from '../utils/text.js';
import { paginate, type PageRequest, type Paginated } from '../utils/pagination.js';

export interface ItemFilter {
  type?: Item['type'];
  category?: string;
  /** Texto de búsqueda (se compara sin mayúsculas ni tildes en title y description). */
  q?: string;
  minPriceCents?: number;
  maxPriceCents?: number;
  /** Los items inactivos solo se incluyen si pertenecen a este proveedor. */
  includeInactiveOf?: string;
}

export type NewItem = Omit<Item, 'id' | 'currency' | 'createdAt' | 'updatedAt'>;

/** Contrato de persistencia del catálogo. */
export interface ItemRepository {
  findById(id: string): Promise<Item | null>;
  search(filter: ItemFilter, page: PageRequest): Promise<Paginated<Item>>;
  create(data: NewItem): Promise<Item>;
  /** Reemplaza el item (misma id). Devuelve null si no existe. */
  update(id: string, changes: Partial<NewItem>): Promise<Item | null>;
}

export class InMemoryItemRepository implements ItemRepository {
  private readonly items = new Map<string, Item>();

  findById(id: string): Promise<Item | null> {
    return Promise.resolve(this.items.get(id) ?? null);
  }

  search(filter: ItemFilter, page: PageRequest): Promise<Paginated<Item>> {
    const q = filter.q ? normalizeText(filter.q.trim()) : '';
    const category = filter.category ? normalizeText(filter.category) : undefined;

    const matches = [...this.items.values()]
      .filter((item) => item.isActive || item.providerId === filter.includeInactiveOf)
      .filter((item) => filter.type === undefined || item.type === filter.type)
      .filter((item) => category === undefined || normalizeText(item.category) === category)
      .filter((item) => filter.minPriceCents === undefined || item.priceCents >= filter.minPriceCents)
      .filter((item) => filter.maxPriceCents === undefined || item.priceCents <= filter.maxPriceCents)
      .filter(
        (item) =>
          q === '' || normalizeText(`${item.title}\n${item.description}`).includes(q),
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id));

    return Promise.resolve(paginate(matches, page));
  }

  create(data: NewItem): Promise<Item> {
    const now = new Date().toISOString();
    const item: Item = { ...data, id: randomUUID(), currency: 'PEN', createdAt: now, updatedAt: now };
    this.items.set(item.id, item);
    return Promise.resolve(item);
  }

  update(id: string, changes: Partial<NewItem>): Promise<Item | null> {
    const current = this.items.get(id);
    if (!current) return Promise.resolve(null);
    const updated: Item = { ...current, ...changes, updatedAt: new Date().toISOString() };
    this.items.set(id, updated);
    return Promise.resolve(updated);
  }
}
