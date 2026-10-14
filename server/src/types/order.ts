import type { ItemType } from './item.js';

export const PAYMENT_METHODS = ['card', 'yape', 'transfer'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const ORDER_STATUSES = ['pending_payment', 'confirmed', 'preparing', 'shipping', 'delivered', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Copia del item en el momento de la compra: no cambia si el item cambia después. */
export interface OrderLine {
  itemId: string;
  title: string;
  type: ItemType;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
}

export interface Order {
  id: string;
  clientId: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  items: OrderLine[];
  subtotalCents: number;
  shippingCents: number;
  platformFeeCents: number;
  totalCents: number;
  currency: 'PEN';
  createdAt: string;
  updatedAt: string;
}
