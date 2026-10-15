/**
 * Esquemas zod de las respuestas de la API (docs/api-contract.md §3-§5).
 *
 * Son la ÚNICA fuente de los tipos de datos de red: cada tipo se deriva con `z.infer`
 * (ver src/types/api.ts). Lo que llega por la red no se asume correcto: los servicios de
 * datos parsean con estos esquemas y un fallo se convierte en ApiError "invalid_response".
 * Los esquemas son "ligeros": validan forma y tipos, ignoran campos extra.
 */
import { z } from 'zod';

// ─── §5 User ─────────────────────────────────────────────────────────────────
export const roleSchema = z.enum(['client', 'provider', 'admin']);

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: roleSchema,
  phone: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  createdAt: z.string(),
});

// ─── §5 Item (productos y servicios) ─────────────────────────────────────────
export const itemTypeSchema = z.enum(['product', 'service']);
export const targetPetSchema = z.enum(['dog', 'cat', 'bird', 'exotic']);

/** Datos públicos del proveedor (solo en GET /items y GET /items/:id). */
export const itemProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().nullable(),
});

export const itemSchema = z.object({
  id: z.string(),
  providerId: z.string(),
  type: itemTypeSchema,
  title: z.string(),
  description: z.string(),
  category: z.string(),
  priceCents: z.number().int(),
  currency: z.literal('PEN'),
  stock: z.number().int().nullable(),
  durationMinutes: z.number().int().nullable(),
  location: z.string().nullable(),
  imageUrl: z.string().nullable(),
  targetPets: z.array(targetPetSchema),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  // POST/PATCH /items no lo incluyen; GET sí.
  provider: itemProviderSchema.optional(),
});

// ─── §5 Pet ──────────────────────────────────────────────────────────────────
export const speciesSchema = z.enum(['dog', 'cat', 'bird', 'exotic', 'other']);
export const genderSchema = z.enum(['female', 'male', 'unknown']);

export const petSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  name: z.string(),
  species: speciesSchema,
  breed: z.string().nullable(),
  gender: genderSchema.nullable(),
  birthDate: z.string().nullable(), // YYYY-MM-DD
  weightGrams: z.number().int().nullable(),
  notes: z.string().nullable(),
  photoUrl: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ─── §5 Order ────────────────────────────────────────────────────────────────
export const orderStatusSchema = z.enum(['pending_payment', 'confirmed', 'preparing', 'shipping', 'delivered', 'cancelled']);
export const paymentMethodSchema = z.enum(['card', 'yape', 'transfer']);

/** Copia del item en el momento de la compra. */
export const orderItemSchema = z.object({
  itemId: z.string(),
  title: z.string(),
  type: itemTypeSchema,
  unitPriceCents: z.number().int(),
  quantity: z.number().int(),
  lineTotalCents: z.number().int(),
});

export const orderSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  status: orderStatusSchema,
  paymentMethod: paymentMethodSchema,
  items: z.array(orderItemSchema),
  subtotalCents: z.number().int(),
  shippingCents: z.number().int(),
  platformFeeCents: z.number().int(),
  totalCents: z.number().int(),
  currency: z.literal('PEN'),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ─── Envolturas de respuesta (§1.1 y §3) ─────────────────────────────────────
/** Lista paginada: { data: T[], meta: { page, limit, total } } (§1.1). */
export const paginatedSchema = <S extends z.ZodType>(item: S) =>
  z.object({
    data: z.array(item),
    meta: z.object({ page: z.number().int(), limit: z.number().int(), total: z.number().int() }),
  });

/** Un solo recurso: { data: T } (§4). */
export const dataSchema = <S extends z.ZodType>(item: S) => z.object({ data: item });

/** POST /auth/register y GET /auth/me → { user } (§3). */
export const userEnvelopeSchema = z.object({ user: userSchema });

/** POST /auth/login → { user, token, expiresIn } (§3). */
export const loginResponseSchema = z.object({
  user: userSchema,
  token: z.string().min(1),
  expiresIn: z.number(),
});

export const itemListSchema = paginatedSchema(itemSchema);
export const petListSchema = paginatedSchema(petSchema);
export const orderListSchema = paginatedSchema(orderSchema);
export const itemResponseSchema = dataSchema(itemSchema);
export const petResponseSchema = dataSchema(petSchema);
export const orderResponseSchema = dataSchema(orderSchema);

// ─── §1.2 Formato de errores ─────────────────────────────────────────────────
export const apiErrorBodySchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});

// ─── Tipos derivados (única fuente) ──────────────────────────────────────────
export type Role = z.infer<typeof roleSchema>;
export type User = z.infer<typeof userSchema>;
export type ItemType = z.infer<typeof itemTypeSchema>;
export type TargetPet = z.infer<typeof targetPetSchema>;
export type ItemProvider = z.infer<typeof itemProviderSchema>;
export type Item = z.infer<typeof itemSchema>;
export type Species = z.infer<typeof speciesSchema>;
export type Gender = z.infer<typeof genderSchema>;
export type Pet = z.infer<typeof petSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type Order = z.infer<typeof orderSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type ApiErrorBody = z.infer<typeof apiErrorBodySchema>;
