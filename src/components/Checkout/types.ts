import type { ItemType } from '@/types/api';

/** Item tal como lo dibujan los pasos del checkout (los precios son texto ya formateado, solo para mostrar). */
export interface CheckoutItem {
  id: string;
  type: ItemType;
  title: string;
  image: string | null;
  quantity: number;
  subtitle: string;
  price: string;
}

/** Totales estimados, ya formateados. El total válido es el que devuelve el servidor. */
export interface CheckoutTotals {
  subtotal: string;
  shipping: string;
  serviceFee: string;
  total: string;
}

export type CheckoutStep = 1 | 2 | 3 | 4;

/** Dirección del paso de logística (datos de ejemplo: la API aún no tiene direcciones). */
export interface CheckoutAddress {
  id: string;
  label: string;
  street: string;
  district: string;
  city?: string;
  country?: string;
  reference?: string;
  isDefault: boolean;
}

/** Lo que captura el formulario de nueva dirección. */
export interface NewAddressData {
  label: string;
  street: string;
  district: string;
  reference: string;
  city: string;
  country: string;
}
