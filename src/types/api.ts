/**
 * Tipos de la API (docs/api-contract.md §1.2 y §5).
 *
 * Los tipos de datos NO se escriben a mano: salen de los esquemas zod (src/api/schemas.ts)
 * con `z.infer`, para que validación y tipos tengan una sola fuente. Este archivo solo los
 * reexporta en un punto de importación estable y define lo que zod no puede expresar.
 */
export type {
  Role,              // §5 User.role
  User,              // §5 User
  ItemType,          // §5 Item.type
  TargetPet,         // §5 Item.targetPets
  ItemProvider,      // §5 Item.provider (solo GET /items)
  Item,              // §5 Item (productos y servicios)
  Species,           // §5 Pet.species
  Gender,            // §5 Pet.gender
  Pet,               // §5 Pet
  OrderStatus,       // §5 Order.status
  PaymentMethod,     // §5 Order.paymentMethod
  OrderItem,         // §5 Order.items[] (copia del item al comprar)
  Order,             // §5 Order
  LoginResponse,     // §3 POST /auth/login
  ApiErrorBody,      // §1.2 formato uniforme de errores
} from '@/api/schemas';

/** §1.1 Respuesta de listas: { data: T[], meta: { page, limit, total } }. (Genérico: zod no lo expresa.) */
export interface Pagination<T> {
  data: T[];
  meta: { page: number; limit: number; total: number };
}

/** §1.2 Códigos de error del contrato más los del cliente (red, timeout, cancelación, respuesta inválida). */
export const API_ERROR_CODES = [
  'validation_error',
  'unauthorized',
  'forbidden',
  'not_found',
  'conflict',
  'unprocessable_entity',
  'rate_limited',
  'service_unavailable',
  'internal_error',
  'network_error',
  'timeout',
  'aborted',
  'invalid_response',
] as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

export function isApiErrorCode(value: string): value is ApiErrorCode {
  return (API_ERROR_CODES as readonly string[]).includes(value);
}
