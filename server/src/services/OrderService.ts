import { NotFoundError, UnprocessableError } from '../errors/AppError.js';
import type { ItemRepository } from '../repositories/ItemRepository.js';
import type { OrderRepository } from '../repositories/OrderRepository.js';
import type { Order, OrderLine, PaymentMethod } from '../types/order.js';
import type { User } from '../types/user.js';
import type { PageRequest, Paginated } from '../utils/pagination.js';

export const SHIPPING_CENTS = 1500;
export const PLATFORM_FEE_CENTS = 250;

export interface OrderTotals {
  subtotalCents: number;
  shippingCents: number;
  platformFeeCents: number;
  totalCents: number;
}

/** Envío solo si hay productos físicos; comisión fija si el subtotal es mayor que 0. */
export function calculateTotals(lines: readonly OrderLine[]): OrderTotals {
  const subtotalCents = lines.reduce((sum, l) => sum + l.lineTotalCents, 0);
  const shippingCents = lines.some((l) => l.type === 'product') ? SHIPPING_CENTS : 0;
  const platformFeeCents = subtotalCents > 0 ? PLATFORM_FEE_CENTS : 0;
  return { subtotalCents, shippingCents, platformFeeCents, totalCents: subtotalCents + shippingCents + platformFeeCents };
}

export interface CreateOrderInput {
  items: { itemId: string; quantity: number }[];
  paymentMethod: PaymentMethod;
}

export class OrderService {
  constructor(
    private readonly orders: OrderRepository,
    private readonly items: ItemRepository,
  ) {}

  async create(client: User, input: CreateOrderInput): Promise<Order> {
    const lines: OrderLine[] = [];
    for (const [index, line] of input.items.entries()) {
      // El precio se lee del repositorio en este instante; el cliente nunca lo envía.
      const item = await this.items.findById(line.itemId);
      if (!item) throw new NotFoundError(`El item ${line.itemId} no existe.`);
      if (!item.isActive) {
        throw new UnprocessableError('Uno de los items ya no está disponible.', [
          { path: `items.${index}.itemId`, message: 'El item está inactivo.' },
        ]);
      }
      lines.push({
        itemId: item.id,
        title: item.title,
        type: item.type,
        unitPriceCents: item.priceCents,
        quantity: line.quantity,
        lineTotalCents: item.priceCents * line.quantity,
      });
    }

    return this.orders.create({
      clientId: client.id,
      status: 'pending_payment',
      paymentMethod: input.paymentMethod,
      items: lines,
      ...calculateTotals(lines),
      currency: 'PEN',
    });
  }

  list(client: User, page: PageRequest): Promise<Paginated<Order>> {
    return this.orders.listByClient(client.id, page);
  }

  async get(client: User, id: string): Promise<Order> {
    const order = await this.orders.findById(id);
    if (!order || order.clientId !== client.id) throw new NotFoundError('Pedido no encontrado.');
    return order;
  }
}
