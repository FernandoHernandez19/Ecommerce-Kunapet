import { NotFoundError } from '../errors/AppError.js';
import type { ItemFilter, ItemRepository } from '../repositories/ItemRepository.js';
import type { Item } from '../types/item.js';
import type { User } from '../types/user.js';
import type { PageRequest, Paginated } from '../utils/pagination.js';

export class CatalogService {
  constructor(private readonly items: ItemRepository) {}

  /** Lista activos para todos; el proveedor además ve sus propios items inactivos. */
  list(filter: Omit<ItemFilter, 'includeInactiveOf'>, page: PageRequest, viewer?: User): Promise<Paginated<Item>> {
    const includeInactiveOf = viewer?.role === 'provider' ? viewer.id : undefined;
    return this.items.search({ ...filter, ...(includeInactiveOf ? { includeInactiveOf } : {}) }, page);
  }

  async get(id: string, viewer?: User): Promise<Item> {
    const item = await this.items.findById(id);
    // Un item inactivo ajeno se comporta como inexistente.
    if (!item || (!item.isActive && item.providerId !== viewer?.id)) {
      throw new NotFoundError('Item no encontrado.');
    }
    return item;
  }
}
