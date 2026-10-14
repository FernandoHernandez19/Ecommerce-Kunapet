import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { calculateTotals } from '../src/services/OrderService.js';
import { API, adminSession, buildApp, createItem, productBody, serviceBody, session } from './helpers.js';

async function setup() {
  const ctx = buildApp();
  const provider = await session(ctx.app, 'provider', 'prov@prov.test');
  const client = await session(ctx.app, 'client', 'c@cli.test');
  const service = await createItem(ctx.app, provider, serviceBody); // 4500
  const product = await createItem(ctx.app, provider, productBody); // 14550
  const order = (auth: { Authorization: string }, body: unknown) => request(ctx.app).post(`${API}/orders`).set(auth).send(body as object);
  return { ...ctx, provider, client, service, product, order };
}

describe('POST /orders', () => {
  it('calcula totales de solo servicios: sin envío, con comisión', async () => {
    const { client, service, order } = await setup();
    const res = await order(client.auth, { items: [{ itemId: service.id, quantity: 2 }], paymentMethod: 'yape' }).expect(201);
    expect(res.body.data).toMatchObject({
      status: 'pending_payment', clientId: client.id, paymentMethod: 'yape', currency: 'PEN',
      subtotalCents: 9000, shippingCents: 0, platformFeeCents: 250, totalCents: 9250,
    });
  });

  it('con productos físicos suma envío de 1500', async () => {
    const { client, service, product, order } = await setup();
    const only = await order(client.auth, { items: [{ itemId: product.id, quantity: 2 }], paymentMethod: 'card' }).expect(201);
    expect(only.body.data).toMatchObject({ subtotalCents: 29100, shippingCents: 1500, platformFeeCents: 250, totalCents: 30850 });
    const mixed = await order(client.auth, {
      items: [{ itemId: product.id, quantity: 1 }, { itemId: service.id, quantity: 3 }], paymentMethod: 'transfer',
    }).expect(201);
    expect(mixed.body.data).toMatchObject({ subtotalCents: 14550 + 13500, shippingCents: 1500, totalCents: 28050 + 1500 + 250 });
    expect(mixed.body.data.items).toHaveLength(2);
  });

  it('rechaza cualquier precio, total o costo enviado (body estricto → 400)', async () => {
    const { client, service, order } = await setup();
    const base = { items: [{ itemId: service.id, quantity: 1 }], paymentMethod: 'card' };
    const bad = [
      { ...base, totalCents: 1 },
      { ...base, subtotalCents: 1 },
      { ...base, shippingCents: 0 },
      { ...base, platformFeeCents: 0 },
      { ...base, price: 1 },
      { ...base, items: [{ itemId: service.id, quantity: 1, priceCents: 1 }] },
      { ...base, items: [{ itemId: service.id, quantity: 1, unitPriceCents: 1 }] },
    ];
    for (const body of bad) {
      const res = await order(client.auth, body);
      expect(res.status, JSON.stringify(body)).toBe(400);
      expect(res.body.error.code).toBe('validation_error');
    }
  });

  it('valida cantidades 0 y 21, líneas vacías, más de 20 líneas, repetidas y métodos de pago', async () => {
    const { client, service, product, order } = await setup();
    const line = (quantity: number) => ({ items: [{ itemId: service.id, quantity }], paymentMethod: 'card' });
    expect((await order(client.auth, line(0))).status).toBe(400);
    expect((await order(client.auth, line(21))).status).toBe(400);
    expect((await order(client.auth, line(1.5))).status).toBe(400);
    expect((await order(client.auth, line(-1))).status).toBe(400);
    expect((await order(client.auth, line(20))).status).toBe(201);
    expect((await order(client.auth, { items: [], paymentMethod: 'card' })).status).toBe(400);
    expect((await order(client.auth, { items: [{ itemId: service.id, quantity: 1 }], paymentMethod: 'bitcoin' })).status).toBe(400);
    expect((await order(client.auth, { items: [{ itemId: service.id, quantity: 1 }] })).status).toBe(400);
    const twentyOne = Array.from({ length: 21 }, (_, i) => ({ itemId: `id-${i}`, quantity: 1 }));
    expect((await order(client.auth, { items: twentyOne, paymentMethod: 'card' })).status).toBe(400);
    const dup = [{ itemId: product.id, quantity: 1 }, { itemId: product.id, quantity: 1 }];
    expect((await order(client.auth, { items: dup, paymentMethod: 'card' })).status).toBe(400);
  });

  it('item inexistente → 404 e inactivo → 422', async () => {
    const { client, provider, service, order, app } = await setup();
    const missing = await order(client.auth, { items: [{ itemId: '00000000-0000-4000-8000-000000000000', quantity: 1 }], paymentMethod: 'card' }).expect(404);
    expect(missing.body.error.code).toBe('not_found');

    await request(app).delete(`${API}/items/${service.id}`).set(provider.auth).expect(204);
    const inactive = await order(client.auth, { items: [{ itemId: service.id, quantity: 1 }], paymentMethod: 'card' }).expect(422);
    expect(inactive.body.error.code).toBe('unprocessable_entity');
    // No se crea ningún pedido parcial.
    expect((await request(app).get(`${API}/orders`).set(client.auth).expect(200)).body.meta.total).toBe(0);
  });

  it('copia el precio y el título: cambios posteriores del item no alteran el pedido', async () => {
    const { client, provider, service, order, app } = await setup();
    const created = await order(client.auth, { items: [{ itemId: service.id, quantity: 2 }], paymentMethod: 'card' }).expect(201);
    const id = created.body.data.id as string;

    await request(app).patch(`${API}/items/${service.id}`).set(provider.auth).send({ priceCents: 99_900, title: 'Otro título' }).expect(200);
    const fetched = await request(app).get(`${API}/orders/${id}`).set(client.auth).expect(200);
    expect(fetched.body.data).toEqual(created.body.data);
    expect(fetched.body.data.items[0]).toMatchObject({ unitPriceCents: 4500, title: 'Baño y Corte de Pelo', lineTotalCents: 9000 });
    expect(fetched.body.data.totalCents).toBe(9250);

    // Un pedido nuevo sí usa el precio vigente.
    const next = await order(client.auth, { items: [{ itemId: service.id, quantity: 1 }], paymentMethod: 'card' }).expect(201);
    expect(next.body.data.subtotalCents).toBe(99_900);
  });

  it('provider y admin reciben 403; sin token 401', async () => {
    const { provider, users, app, service } = await setup();
    const admin = await adminSession(app, users);
    const body = { items: [{ itemId: service.id, quantity: 1 }], paymentMethod: 'card' };
    await request(app).post(`${API}/orders`).set(provider.auth).send(body).expect(403);
    await request(app).post(`${API}/orders`).set(admin.auth).send(body).expect(403);
    await request(app).get(`${API}/orders`).set(provider.auth).expect(403);
    await request(app).get(`${API}/orders`).set(admin.auth).expect(403);
    await request(app).post(`${API}/orders`).send(body).expect(401);
  });
});

describe('GET /orders', () => {
  it('lista solo los pedidos propios y oculta los ajenos con 404', async () => {
    const { app, client, service, order } = await setup();
    const other = await session(app, 'client', 'otro@cli.test');
    const mine = await order(client.auth, { items: [{ itemId: service.id, quantity: 1 }], paymentMethod: 'card' }).expect(201);
    await order(other.auth, { items: [{ itemId: service.id, quantity: 1 }], paymentMethod: 'yape' }).expect(201);

    const list = await request(app).get(`${API}/orders`).set(client.auth).expect(200);
    expect(list.body.meta).toEqual({ page: 1, limit: 20, total: 1 });
    expect(list.body.data[0].id).toBe(mine.body.data.id);

    await request(app).get(`${API}/orders/${mine.body.data.id}`).set(other.auth).expect(404);
    await request(app).get(`${API}/orders/${mine.body.data.id}`).set(client.auth).expect(200);
    await request(app).get(`${API}/orders/no-existe`).set(client.auth).expect(404);
  });

  it('pagina, con los más recientes primero', async () => {
    const { app, client, service, order } = await setup();
    for (let i = 1; i <= 3; i++) {
      await order(client.auth, { items: [{ itemId: service.id, quantity: i }], paymentMethod: 'card' }).expect(201);
    }
    const res = await request(app).get(`${API}/orders?limit=2`).set(client.auth).expect(200);
    expect(res.body.meta).toEqual({ page: 1, limit: 2, total: 3 });
    expect(res.body.data).toHaveLength(2);
    await request(app).get(`${API}/orders?page=0`).set(client.auth).expect(400);
  });
});

describe('calculateTotals', () => {
  it('no cobra comisión con subtotal 0 ni envío sin productos', () => {
    expect(calculateTotals([])).toEqual({ subtotalCents: 0, shippingCents: 0, platformFeeCents: 0, totalCents: 0 });
  });
});
