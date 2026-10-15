import { describe, expect, it } from 'vitest';
import {
  apiErrorBodySchema,
  itemListSchema,
  itemResponseSchema,
  itemSchema,
  loginResponseSchema,
  orderResponseSchema,
  petListSchema,
  userEnvelopeSchema,
  type Item,
  type Order,
  type Pet,
  type User,
} from './schemas';

const user: User = {
  id: 'u1', name: 'Camila', email: 'camila@kunapet.com', role: 'client', phone: null, avatarUrl: null,
  createdAt: '2025-06-29T14:00:00.000Z',
};

const item: Item = {
  id: 'i1', providerId: 'p1', type: 'service', title: 'Baño', description: 'd', category: 'grooming', priceCents: 4500,
  currency: 'PEN', stock: null, durationMinutes: 90, location: null, imageUrl: null, targetPets: ['dog', 'cat'],
  isActive: true, createdAt: '2025-06-29T14:00:00.000Z', updatedAt: '2025-06-29T14:00:00.000Z',
};

const pet: Pet = {
  id: 'pet1', ownerId: 'u1', name: 'Luna', species: 'dog', breed: null, gender: 'female', birthDate: '2022-03-15',
  weightGrams: 28000, notes: null, photoUrl: null, createdAt: '2025-01-10T10:00:00.000Z', updatedAt: '2025-01-10T10:00:00.000Z',
};

const order: Order = {
  id: 'o1', clientId: 'u1', status: 'pending_payment', paymentMethod: 'yape',
  items: [{ itemId: 'i1', title: 'Baño', type: 'service', unitPriceCents: 4500, quantity: 2, lineTotalCents: 9000 }],
  subtotalCents: 9000, shippingCents: 0, platformFeeCents: 250, totalCents: 9250, currency: 'PEN',
  createdAt: '2025-06-29T14:00:00.000Z', updatedAt: '2025-06-29T14:00:00.000Z',
};

describe('esquemas de auth', () => {
  it('acepta la respuesta de login válida', () => {
    const res = loginResponseSchema.safeParse({ user, token: 'jwt', expiresIn: 3600 });
    expect(res.success).toBe(true);
  });

  it('rechaza login sin token, con token vacío o con rol desconocido', () => {
    expect(loginResponseSchema.safeParse({ user, expiresIn: 3600 }).success).toBe(false);
    expect(loginResponseSchema.safeParse({ user, token: '', expiresIn: 3600 }).success).toBe(false);
    expect(loginResponseSchema.safeParse({ user: { ...user, role: 'superadmin' }, token: 't', expiresIn: 1 }).success).toBe(false);
  });

  it('{ user } de register y /auth/me; rechaza usuario incompleto o nulo', () => {
    expect(userEnvelopeSchema.safeParse({ user }).success).toBe(true);
    expect(userEnvelopeSchema.safeParse({ user: { id: 'u1' } }).success).toBe(false);
    expect(userEnvelopeSchema.safeParse({ user: null }).success).toBe(false);
    expect(userEnvelopeSchema.safeParse(null).success).toBe(false);
  });

  it('ignora campos extra (p. ej. si el servidor agrega uno nuevo)', () => {
    const res = userEnvelopeSchema.safeParse({ user: { ...user, passwordHash: 'x', nuevo: 1 } });
    expect(res.success).toBe(true);
    if (res.success) expect(res.data.user).not.toHaveProperty('passwordHash');
  });
});

describe('esquemas de items', () => {
  it('item con y sin provider (POST/PATCH no lo incluyen)', () => {
    expect(itemSchema.safeParse(item).success).toBe(true);
    const withProvider = itemSchema.safeParse({ ...item, provider: { id: 'p1', name: 'Spa', avatarUrl: null } });
    expect(withProvider.success && withProvider.data.provider?.name).toBe('Spa');
  });

  it('rechaza precios no enteros, moneda distinta, tipos o categorías inválidos', () => {
    expect(itemSchema.safeParse({ ...item, priceCents: 45.5 }).success).toBe(false);
    expect(itemSchema.safeParse({ ...item, priceCents: '4500' }).success).toBe(false);
    expect(itemSchema.safeParse({ ...item, currency: 'USD' }).success).toBe(false);
    expect(itemSchema.safeParse({ ...item, type: 'otro' }).success).toBe(false);
    expect(itemSchema.safeParse({ ...item, targetPets: ['dragon'] }).success).toBe(false);
    expect(itemSchema.safeParse({ ...item, isActive: 'true' }).success).toBe(false);
  });

  it('lista paginada y recurso único', () => {
    expect(itemListSchema.safeParse({ data: [item], meta: { page: 1, limit: 12, total: 1 } }).success).toBe(true);
    expect(itemListSchema.safeParse({ data: [item] }).success).toBe(false); // falta meta
    expect(itemListSchema.safeParse({ data: [{ ...item, id: 5 }], meta: { page: 1, limit: 12, total: 1 } }).success).toBe(false);
    expect(itemResponseSchema.safeParse({ data: item }).success).toBe(true);
    expect(itemResponseSchema.safeParse(item).success).toBe(false); // sin envoltura { data }
  });
});

describe('esquemas de mascotas y pedidos', () => {
  it('mascota válida y con valores nulos', () => {
    expect(petListSchema.safeParse({ data: [pet], meta: { page: 1, limit: 100, total: 1 } }).success).toBe(true);
    expect(petListSchema.safeParse({ data: [{ ...pet, gender: null, birthDate: null }], meta: { page: 1, limit: 100, total: 1 } }).success).toBe(true);
  });

  it('rechaza especie o género desconocidos y pesos decimales', () => {
    const meta = { page: 1, limit: 100, total: 1 };
    expect(petListSchema.safeParse({ data: [{ ...pet, species: 'dragon' }], meta }).success).toBe(false);
    expect(petListSchema.safeParse({ data: [{ ...pet, gender: 'x' }], meta }).success).toBe(false);
    expect(petListSchema.safeParse({ data: [{ ...pet, weightGrams: 2.5 }], meta }).success).toBe(false);
  });

  it('pedido válido', () => {
    expect(orderResponseSchema.safeParse({ data: order }).success).toBe(true);
  });

  it('rechaza estado o método de pago inválidos y totales faltantes', () => {
    expect(orderResponseSchema.safeParse({ data: { ...order, status: 'pending' } }).success).toBe(false);
    expect(orderResponseSchema.safeParse({ data: { ...order, paymentMethod: 'bitcoin' } }).success).toBe(false);
    const { totalCents, ...incomplete } = order;
    void totalCents;
    expect(orderResponseSchema.safeParse({ data: incomplete }).success).toBe(false);
    expect(orderResponseSchema.safeParse({ data: { ...order, items: [{ itemId: 'i1' }] } }).success).toBe(false);
  });
});

describe('formato de errores', () => {
  it('acepta { error: { code, message, details? } }', () => {
    expect(apiErrorBodySchema.safeParse({ error: { code: 'not_found', message: 'x' } }).success).toBe(true);
    expect(apiErrorBodySchema.safeParse({ error: { code: 'validation_error', message: 'x', details: [1] } }).success).toBe(true);
  });
  it('rechaza cuerpos que no siguen el contrato', () => {
    expect(apiErrorBodySchema.safeParse({ error: 'boom' }).success).toBe(false);
    expect(apiErrorBodySchema.safeParse({ message: 'x' }).success).toBe(false);
    expect(apiErrorBodySchema.safeParse(null).success).toBe(false);
  });
});
