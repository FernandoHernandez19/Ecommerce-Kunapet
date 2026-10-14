import { NotFoundError, ValidationError } from '../errors/AppError.js';
import type { ItemFilter, ItemRepository, NewItem } from '../repositories/ItemRepository.js';
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

  create(provider: User, input: Omit<NewItem, 'providerId' | 'isActive'>): Promise<Item> {
    return this.items.create({ ...input, providerId: provider.id, isActive: true });
  }

  async update(provider: User, id: string, changes: Partial<Omit<NewItem, 'providerId' | 'type'>>): Promise<Item> {
    const current = await this.getOwned(provider, id);
    if (current.type === 'service' && changes.stock != null) {
      throw new ValidationError('Datos inválidos.', [{ path: 'stock', message: 'Un servicio no tiene stock.' }]);
    }
    if (current.type === 'product' && changes.durationMinutes != null) {
      throw new ValidationError('Datos inválidos.', [
        { path: 'durationMinutes', message: 'Un producto no tiene duración.' },
      ]);
    }
    const updated = await this.items.update(id, changes);
    if (!updated) throw new NotFoundError('Item no encontrado.');
    return updated;
  }

  /** "Eliminar" desactiva el item (isActive: false); es idempotente. */
  async deactivate(provider: User, id: string): Promise<void> {
    await this.getOwned(provider, id);
    await this.items.update(id, { isActive: false });
  }

  /** Item del proveedor o 404: uno ajeno no se distingue de uno inexistente. */
  private async getOwned(provider: User, id: string): Promise<Item> {
    const item = await this.items.findById(id);
    if (!item || item.providerId !== provider.id) throw new NotFoundError('Item no encontrado.');
    return item;
  }
}
