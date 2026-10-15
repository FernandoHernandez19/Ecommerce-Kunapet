/** Tipos de los datos de ejemplo del panel del proveedor (la API aún no tiene agenda, stock ni pedidos recibidos). */

export interface ProviderMetrics {
  sales: string;
  activeServices: number | string;
  rating: number;
  reviews: number;
  messages: number;
}

export type AppointmentStatus = 'READY' | 'WAITING' | 'PENDING';

export interface Appointment {
  time: string;
  meridian: string;
  service: string;
  pet: string;
  client: string;
  status: AppointmentStatus;
  statusText: string;
}

export interface StockAlert {
  name: string;
  quantity: number;
  severity: 'high' | 'medium';
}

export interface ReceivedOrder {
  id: string;
  client: string;
  products: string;
  total: string;
  status: string;
  action: string;
}
