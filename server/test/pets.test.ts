import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { API, adminSession, buildApp, session } from './helpers.js';

const luna = { name: 'Luna', species: 'dog', breed: 'Golden Retriever', gender: 'female', birthDate: '2022-03-15', weightGrams: 28000, notes: 'Alergia al trigo' };

describe('/pets', () => {
  it('el cliente hace el CRUD completo de su mascota', async () => {
    const { app } = buildApp();
    const c = await session(app, 'client', 'c@cli.test');
    const created = await request(app).post(`${API}/pets`).set(c.auth).send(luna).expect(201);
    expect(created.body.data).toMatchObject({ ...luna, ownerId: c.id, photoUrl: null });
    const id = created.body.data.id as string;

    expect((await request(app).get(`${API}/pets/${id}`).set(c.auth).expect(200)).body.data.name).toBe('Luna');
    const patched = await request(app).patch(`${API}/pets/${id}`).set(c.auth).send({ weightGrams: 29000, notes: null }).expect(200);
    expect(patched.body.data).toMatchObject({ weightGrams: 29000, notes: null, name: 'Luna' });
    const list = await request(app).get(`${API}/pets`).set(c.auth).expect(200);
    expect(list.body.meta).toEqual({ page: 1, limit: 20, total: 1 });
    await request(app).delete(`${API}/pets/${id}`).set(c.auth).expect(204);
    await request(app).get(`${API}/pets/${id}`).set(c.auth).expect(404);
  });

  it('aísla a los dueños: una mascota ajena responde 404 en GET, PATCH y DELETE', async () => {
    const { app } = buildApp();
    const a = await session(app, 'client', 'a@cli.test');
    const b = await session(app, 'client', 'b@cli.test');
    const id = (await request(app).post(`${API}/pets`).set(a.auth).send(luna).expect(201)).body.data.id as string;

    await request(app).get(`${API}/pets/${id}`).set(b.auth).expect(404);
    await request(app).patch(`${API}/pets/${id}`).set(b.auth).send({ name: 'Hack' }).expect(404);
    await request(app).delete(`${API}/pets/${id}`).set(b.auth).expect(404);
    expect((await request(app).get(`${API}/pets`).set(b.auth).expect(200)).body.meta.total).toBe(0);
    // La de A sigue intacta.
    expect((await request(app).get(`${API}/pets/${id}`).set(a.auth).expect(200)).body.data.name).toBe('Luna');
  });

  it('provider y admin reciben 403; sin token 401', async () => {
    const { app, users } = buildApp();
    const p = await session(app, 'provider', 'p@prov.test');
    const admin = await adminSession(app, users);
    await request(app).get(`${API}/pets`).set(p.auth).expect(403);
    await request(app).post(`${API}/pets`).set(p.auth).send(luna).expect(403);
    await request(app).get(`${API}/pets`).set(admin.auth).expect(403);
    await request(app).get(`${API}/pets`).expect(401);
  });

  it('valida fechas, longitudes y campos desconocidos', async () => {
    const { app } = buildApp();
    const c = await session(app, 'client', 'c@cli.test');
    const post = (body: Record<string, unknown>) => request(app).post(`${API}/pets`).set(c.auth).send({ ...luna, ...body });
    const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);

    for (const birthDate of ['2022-02-30', '15/03/2022', '2022-3-5', tomorrow, '1800-01-01', 'hace 2 años']) {
      expect((await post({ birthDate })).status, `birthDate ${birthDate}`).toBe(400);
    }
    expect((await post({ name: '' })).status).toBe(400);
    expect((await post({ name: 'x'.repeat(61) })).status).toBe(400);
    expect((await post({ notes: 'x'.repeat(501) })).status).toBe(400);
    expect((await post({ breed: 'x'.repeat(61) })).status).toBe(400);
    expect((await post({ species: 'dragon' })).status).toBe(400);
    expect((await post({ weightGrams: 0 })).status).toBe(400);
    expect((await post({ weightGrams: 2.5 })).status).toBe(400);
    expect((await post({ age: 2 })).status).toBe(400);
    expect((await post({ ownerId: 'otro' })).status).toBe(400);
    expect((await post({ birthDate: '2024-02-29' })).status).toBe(201); // bisiesto válido
    expect((await post({ name: 'x'.repeat(60), notes: 'x'.repeat(500) })).status).toBe(201);
  });

  it('pagina el listado', async () => {
    const { app } = buildApp();
    const c = await session(app, 'client', 'c@cli.test');
    for (let i = 0; i < 3; i++) await request(app).post(`${API}/pets`).set(c.auth).send({ ...luna, name: `P${i}` }).expect(201);
    const res = await request(app).get(`${API}/pets?limit=2&page=2`).set(c.auth).expect(200);
    expect(res.body.meta).toEqual({ page: 2, limit: 2, total: 3 });
    expect(res.body.data).toHaveLength(1);
    await request(app).get(`${API}/pets?limit=500`).set(c.auth).expect(400);
  });
});
