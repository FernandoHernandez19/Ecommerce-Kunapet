import { randomUUID } from 'node:crypto';
import type { Order } from '../types/order.js';
import { paginate, type PageRequest, type Paginated } from '../utils/pagination.js';

export type NewOrder = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;

export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  listByClient(clientId: string, page: PageRequest): Promise<Paginated<Order>>;
  create(data: NewOrder): Promise<Order>;
}

export class InMemoryOrderRepository implements OrderRepository {
  private readonly orders = new Map<string, Order>();

  findById(id: string): Promise<Order | null> {
    return Promise.resolve(this.orders.get(id) ?? null);
  }

  listByClient(clientId: string, page: PageRequest): Promise<Paginated<Order>> {
    const own = [...this.orders.values()]
      .filter((o) => o.clientId === clientId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id));
    return Promise.resolve(paginate(own, page));
  }

  create(data: NewOrder): Promise<Order> {
    const now = new Date().toISOString();
    const order: Order = { ...data, id: randomUUID(), createdAt: now, updatedAt: now };
    this.orders.set(order.id, order);
    return Promise.resolve(order);
  }
}
