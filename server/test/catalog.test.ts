import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { API, adminSession, buildApp, createItem, productBody, serviceBody, session } from './helpers.js';

interface ItemBody {
  id: string;
  title: string;
  isActive: boolean;
  priceCents: number;
  providerId: string;
}

describe('GET /items', () => {
  it('es público y devuelve la forma { data, meta }', async () => {
    const { app } = buildApp();
    const provider = await session(app, 'provider', 'a@prov.test');
    await createItem(app, provider);
    const res = await request(app).get(`${API}/items`).expect(200);
    expect(res.body.meta).toEqual({ page: 1, limit: 20, total: 1 });
    expect(res.body.data[0]).toMatchObject({ currency: 'PEN', priceCents: 4500, isActive: true });
  });

  it('filtra por type, category, rango de precio y combina filtros', async () => {
    const { app } = buildApp();
    const provider = await session(app, 'provider', 'a@prov.test');
    await createItem(app, provider, serviceBody);
    await createItem(app, provider, productBody);
    await createItem(app, provider, { ...serviceBody, title: 'Paseo grupal', category: 'paseos', priceCents: 2500 });

    const titles = async (qs: string): Promise<string[]> =>
      ((await request(app).get(`${API}/items?${qs}`).expect(200)).body.data as ItemBody[]).map((i) => i.title).sort();

    expect(await titles('type=product')).toEqual(['Alimento NutriCan 15kg']);
    expect(await titles('type=service')).toHaveLength(2);
    expect(await titles('category=PASEOS')).toEqual(['Paseo grupal']);
    expect(await titles('minPriceCents=3000&maxPriceCents=5000')).toEqual(['Baño y Corte de Pelo']);
    expect(await titles('type=service&maxPriceCents=3000')).toEqual(['Paseo grupal']);
  });

  it('busca en título y descripción sin distinguir mayúsculas ni tildes, y solo ahí', async () => {
    const { app } = buildApp();
    const provider = await session(app, 'provider', 'a@prov.test');
    await createItem(app, provider, serviceBody);
    await createItem(app, provider, { ...productBody, title: 'Collar', description: 'Resistente al AGUA' });

    const count = async (q: string): Promise<number> =>
      (await request(app).get(`${API}/items`).query({ q }).expect(200)).body.meta.total as number;

    expect(await count('BANO')).toBe(1);
    expect(await count('baño')).toBe(1);
    expect(await count('hipoalergenico')).toBe(1); // en la descripción
    expect(await count('agua')).toBe(1);
    expect(await count('alimentos')).toBe(0); // category no se busca con q
    expect(await count('zzz')).toBe(0);
  });

  it('pagina con page y limit y valida los rangos', async () => {
    const { app } = buildApp();
    const provider = await session(app, 'provider', 'a@prov.test');
    for (let i = 0; i < 5; i++) await createItem(app, provider, { ...serviceBody, title: `Servicio ${i}` });

    const p1 = await request(app).get(`${API}/items?limit=2&page=1`).expect(200);
    const p3 = await request(app).get(`${API}/items?limit=2&page=3`).expect(200);
    const p9 = await request(app).get(`${API}/items?limit=2&page=9`).expect(200);
    expect(p1.body.meta).toEqual({ page: 1, limit: 2, total: 5 });
    expect(p1.body.data).toHaveLength(2);
    expect(p3.body.data).toHaveLength(1);
    expect(p9.body.data).toHaveLength(0);

    for (const bad of ['page=0', 'limit=0', 'limit=101', 'limit=abc', 'type=otro', 'minPriceCents=-1', 'minPriceCents=9&maxPriceCents=1']) {
      const res = await request(app).get(`${API}/items?${bad}`).expect(400);
      expect(res.body.error.code).toBe('validation_error');
    }
  });

  it('oculta los items inactivos salvo a su propio proveedor', async () => {
    const { app } = buildApp();
    const a = await session(app, 'provider', 'a@prov.test');
    const b = await session(app, 'provider', 'b@prov.test');
    const client = await session(app, 'client', 'c@cli.test');
    const hidden = await createItem(app, a);
    await request(app).delete(`${API}/items/${hidden.id}`).set(a.auth).expect(204);

    const total = async (auth?: { Authorization: string }): Promise<number> => {
      const req = request(app).get(`${API}/items`);
      return ((await (auth ? req.set(auth) : req).expect(200)).body.meta.total) as number;
    };
    expect(await total()).toBe(0);
    expect(await total(client.auth)).toBe(0);
    expect(await total(b.auth)).toBe(0);
    expect(await total(a.auth)).toBe(1);
    expect(await total({ Authorization: 'Bearer token-invalido' })).toBe(0);

    await request(app).get(`${API}/items/${hidden.id}`).expect(404);
    await request(app).get(`${API}/items/${hidden.id}`).set(b.auth).expect(404);
    const own = await request(app).get(`${API}/items/${hidden.id}`).set(a.auth).expect(200);
    expect(own.body.data.isActive).toBe(false);
  });

  it('GET /items/:id devuelve 404 si no existe', async () => {
    const { app } = buildApp();
    const res = await request(app).get(`${API}/items/no-existe`).expect(404);
    expect(res.body.error.code).toBe('not_found');
  });
});

describe('proveedor público en los items', () => {
  it('GET /items y GET /items/:id incluyen provider { id, name, avatarUrl } y nunca email ni teléfono', async () => {
    const { app } = buildApp();
    const provider = await session(app, 'provider', 'privado@prov.test');
    const item = await createItem(app, provider);

    const list = await request(app).get(`${API}/items`).expect(200);
    const one = await request(app).get(`${API}/items/${item.id}`).expect(200);
    for (const body of [list.body.data[0], one.body.data]) {
      expect(body.provider).toEqual({ id: provider.id, name: 'Camila Rodríguez', avatarUrl: null });
      expect(Object.keys(body.provider).sort()).toEqual(['avatarUrl', 'id', 'name']);
    }
    expect(JSON.stringify([list.body, one.body])).not.toMatch(/privado@prov\.test|phone|passwordHash/);
  });

  it('el proveedor ve su nombre también en sus items inactivos', async () => {
    const { app } = buildApp();
    const a = await session(app, 'provider', 'a@prov.test');
    const item = await createItem(app, a);
    await request(app).delete(`${API}/items/${item.id}`).set(a.auth).expect(204);
    const res = await request(app).get(`${API}/items/${item.id}`).set(a.auth).expect(200);
    expect(res.body.data.provider.id).toBe(a.id);
  });
});

describe('gestión de items', () => {
  it('el proveedor crea un item propio (201)', async () => {
    const { app } = buildApp();
    const provider = await session(app, 'provider', 'a@prov.test');
    const res = await request(app).post(`${API}/items`).set(provider.auth).send(serviceBody).expect(201);
    expect(res.body.data).toMatchObject({ providerId: provider.id, isActive: true, stock: null, durationMinutes: 90, currency: 'PEN' });
  });

  it('el cliente y el admin no pueden crear (403) y sin token es 401', async () => {
    const { app, users } = buildApp();
    const client = await session(app, 'client', 'c@cli.test');
    const admin = await adminSession(app, users);
    expect((await request(app).post(`${API}/items`).set(client.auth).send(serviceBody).expect(403)).body.error.code).toBe('forbidden');
    await request(app).post(`${API}/items`).set(admin.auth).send(serviceBody).expect(403);
    await request(app).post(`${API}/items`).send(serviceBody).expect(401);
  });

  it('valida priceCents (entero positivo) y la coherencia de campos', async () => {
    const { app } = buildApp();
    const provider = await session(app, 'provider', 'a@prov.test');
    const post = (body: Record<string, unknown>) => request(app).post(`${API}/items`).set(provider.auth).send(body);

    for (const priceCents of [0, -5, 10.5, '4500', null]) {
      expect((await post({ ...serviceBody, priceCents })).status).toBe(400);
    }
    expect((await post({ ...serviceBody, durationMinutes: undefined })).status).toBe(400);
    expect((await post({ ...serviceBody, stock: 5 })).status).toBe(400);
    expect((await post({ ...productBody, stock: undefined })).status).toBe(400);
    expect((await post({ ...productBody, durationMinutes: 30 })).status).toBe(400);
    expect((await post({ ...serviceBody, providerId: 'otro' })).status).toBe(400);
    expect((await post({ ...serviceBody, imageUrl: 'javascript:alert(1)' })).status).toBe(400);
  });

  it('el proveedor edita su item, pero no cambia type ni acepta campos extra', async () => {
    const { app } = buildApp();
    const provider = await session(app, 'provider', 'a@prov.test');
    const item = await createItem(app, provider);
    const patch = (body: Record<string, unknown>) => request(app).patch(`${API}/items/${item.id}`).set(provider.auth).send(body);

    const ok = await patch({ priceCents: 5000, isActive: false }).expect(200);
    expect(ok.body.data).toMatchObject({ priceCents: 5000, isActive: false });
    expect((await patch({ type: 'product' })).status).toBe(400);
    expect((await patch({})).status).toBe(400);
    expect((await patch({ priceCents: 0 })).status).toBe(400);
    expect((await patch({ stock: 3 })).status).toBe(400); // un servicio no tiene stock
  });

  it('el proveedor B no puede editar ni borrar el item del proveedor A (404) y el cliente recibe 403', async () => {
    const { app } = buildApp();
    const a = await session(app, 'provider', 'a@prov.test');
    const b = await session(app, 'provider', 'b@prov.test');
    const client = await session(app, 'client', 'c@cli.test');
    const item = await createItem(app, a);

    const patched = await request(app).patch(`${API}/items/${item.id}`).set(b.auth).send({ priceCents: 1 }).expect(404);
    expect(patched.body.error.code).toBe('not_found');
    await request(app).delete(`${API}/items/${item.id}`).set(b.auth).expect(404);
    await request(app).patch(`${API}/items/${item.id}`).set(client.auth).send({ priceCents: 1 }).expect(403);
    await request(app).delete(`${API}/items/${item.id}`).set(client.auth).expect(403);

    // El item de A sigue intacto.
    const still = await request(app).get(`${API}/items/${item.id}`).expect(200);
    expect(still.body.data).toMatchObject({ priceCents: 4500, isActive: true });
    // La respuesta de B es idéntica a la de un id que no existe.
    const ghost = await request(app).patch(`${API}/items/no-existe`).set(b.auth).send({ priceCents: 1 }).expect(404);
    expect(ghost.body.error.message).not.toBe('');
  });

  it('DELETE desactiva el item en vez de borrarlo y es idempotente', async () => {
    const { app } = buildApp();
    const a = await session(app, 'provider', 'a@prov.test');
    const item = await createItem(app, a);
    await request(app).delete(`${API}/items/${item.id}`).set(a.auth).expect(204);
    await request(app).delete(`${API}/items/${item.id}`).set(a.auth).expect(204);
    const res = await request(app).get(`${API}/items/${item.id}`).set(a.auth).expect(200);
    expect(res.body.data.isActive).toBe(false);
    // Puede reactivarlo.
    const back = await request(app).patch(`${API}/items/${item.id}`).set(a.auth).send({ isActive: true }).expect(200);
    expect(back.body.data.isActive).toBe(true);
  });
});
