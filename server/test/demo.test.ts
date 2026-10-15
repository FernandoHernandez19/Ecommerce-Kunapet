import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { loadConfig, type Config } from '../src/config/env.js';
import { InMemoryItemRepository } from '../src/repositories/ItemRepository.js';
import { InMemoryPetRepository } from '../src/repositories/PetRepository.js';
import { InMemoryUserRepository } from '../src/repositories/UserRepository.js';
import { DEMO_PROVIDER_EMAIL } from '../src/seed/demoData.js';
import { applySeed } from '../src/seed/index.js';
import { API, TEST_JWT_SECRET, testConfig, validUser } from './helpers.js';

function targets() {
  return { users: new InMemoryUserRepository(), items: new InMemoryItemRepository(), pets: new InMemoryPetRepository() };
}

const envConfig = (extra: Record<string, string>): Config =>
  loadConfig({ JWT_SECRET: TEST_JWT_SECRET, BCRYPT_COST: '4', ...extra });

function spyConsole() {
  const spies = (['log', 'info', 'warn', 'error', 'debug'] as const).map((m) => vi.spyOn(console, m).mockImplementation(() => undefined));
  return () => spies.flatMap((s) => s.mock.calls).map((args) => args.map(String).join(' ')).join('\n');
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('DEMO_MODE', () => {
  it('siembra solo el catálogo bajo un proveedor demo, sin admin, cliente ni mascotas', async () => {
    const t = targets();
    spyConsole();
    await applySeed(envConfig({ DEMO_MODE: 'true' }), t);

    expect(await t.users.count()).toBe(1);
    const provider = await t.users.findByEmail(DEMO_PROVIDER_EMAIL);
    expect(provider?.role).toBe('provider');
    expect(await t.users.findByEmail('admin@demo.kunapet.test')).toBeNull();
    expect(await t.users.findByEmail('cliente@demo.kunapet.test')).toBeNull();
    const items = await t.items.search({}, { page: 1, limit: 100 });
    expect(items.meta.total).toBe(12);
    expect(items.data.every((i) => i.providerId === provider?.id && i.isActive)).toBe(true);
    expect((await t.pets.listByOwner(provider?.id ?? '', { page: 1, limit: 10 })).meta.total).toBe(0);
  });

  it('no imprime ni registra contraseñas ni hashes', async () => {
    const t = targets();
    const output = spyConsole();
    await applySeed(envConfig({ DEMO_MODE: 'true' }), t);
    const record = await t.users.findByEmail(DEMO_PROVIDER_EMAIL);

    const printed = output();
    expect(printed).toContain('Modo demo');
    expect(printed).not.toMatch(/contraseña|password|\$2[aby]\$/i);
    expect(record?.passwordHash ? printed.includes(record.passwordHash) : false).toBe(false);
  });

  it('nadie puede iniciar sesión con el proveedor demo', async () => {
    const t = targets();
    spyConsole();
    await applySeed(envConfig({ DEMO_MODE: 'true' }), t);
    const app = createApp(testConfig(), { userRepository: t.users, itemRepository: t.items });
    for (const password of ['demo123456', 'password', DEMO_PROVIDER_EMAIL, '12345678']) {
      await request(app).post(`${API}/auth/login`).send({ email: DEMO_PROVIDER_EMAIL, password }).expect(401);
    }
    // El catálogo sí es público.
    expect((await request(app).get(`${API}/items`).expect(200)).body.meta.total).toBe(12);
  });

  it('funciona con NODE_ENV=production', async () => {
    const t = targets();
    spyConsole();
    await applySeed(envConfig({ DEMO_MODE: 'true', NODE_ENV: 'production' }), t);
    expect((await t.items.search({}, { page: 1, limit: 100 })).meta.total).toBe(12);
    expect(await t.users.count()).toBe(1);
  });

  it('SEED_DEMO_DATA sigue sin correr en producción (solo avisa)', async () => {
    const t = targets();
    const output = spyConsole();
    await applySeed(envConfig({ SEED_DEMO_DATA: 'true', NODE_ENV: 'production' }), t);
    expect(await t.users.count()).toBe(0);
    expect((await t.items.search({}, { page: 1, limit: 100 })).meta.total).toBe(0);
    expect(output()).toContain('se ignora');
  });

  it('SEED_DEMO_DATA sigue sembrando todo fuera de producción', async () => {
    const t = targets();
    spyConsole();
    await applySeed(envConfig({ SEED_DEMO_DATA: 'true' }), t);
    expect(await t.users.count()).toBe(4);
    expect((await t.items.search({}, { page: 1, limit: 100 })).meta.total).toBe(12);
  });

  it('con ambas variables activas no siembra dos veces', async () => {
    const dev = targets();
    spyConsole();
    await applySeed(envConfig({ SEED_DEMO_DATA: 'true', DEMO_MODE: 'true' }), dev);
    expect(await dev.users.count()).toBe(4);
    expect((await dev.items.search({}, { page: 1, limit: 100 })).meta.total).toBe(12);
    expect(await dev.users.findByEmail(DEMO_PROVIDER_EMAIL)).toBeNull();

    const prod = targets();
    await applySeed(envConfig({ SEED_DEMO_DATA: 'true', DEMO_MODE: 'true', NODE_ENV: 'production' }), prod);
    expect(await prod.users.count()).toBe(1);
    expect((await prod.items.search({}, { page: 1, limit: 100 })).meta.total).toBe(12);
  });

  it('sin variables no siembra nada', async () => {
    const t = targets();
    spyConsole();
    await applySeed(envConfig({}), t);
    expect(await t.users.count()).toBe(0);
  });
});

describe('límites de registro', () => {
  const register = (app: ReturnType<typeof createApp>, n: number, ip?: string) => {
    const req = request(app).post(`${API}/auth/register`);
    if (ip) req.set('X-Forwarded-For', ip);
    return req.send({ ...validUser, email: `usuario${n}@prueba.test` });
  };

  it('permite 10 registros por IP por hora y el 11.º responde 429', async () => {
    const app = createApp(testConfig());
    for (let i = 1; i <= 10; i++) await register(app, i).expect(201);
    const res = await register(app, 11).expect(429);
    expect(res.body.error.code).toBe('rate_limited');
  });

  it('el límite es por IP (con TRUST_PROXY) y se libera tras la hora', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const app = createApp(testConfig({ trustProxy: 1 }));
    for (let i = 1; i <= 10; i++) await register(app, i, '203.0.113.1').expect(201);
    await register(app, 11, '203.0.113.1').expect(429);
    await register(app, 12, '203.0.113.2').expect(201); // otra IP

    vi.setSystemTime(Date.now() + 60 * 60 * 1000 + 1000);
    await register(app, 13, '203.0.113.1').expect(201);
  });

  it('no cuenta las peticiones inválidas', async () => {
    const app = createApp(testConfig());
    for (let i = 0; i < 12; i++) {
      await request(app).post(`${API}/auth/register`).send({ ...validUser, password: 'corta' }).expect(400);
    }
    await register(app, 1).expect(201);
  });

  it('con MAX_USERS alcanzado responde 503 service_unavailable', async () => {
    const app = createApp(testConfig({ maxUsers: 2 }));
    await register(app, 1).expect(201);
    await register(app, 2).expect(201);
    const res = await register(app, 3).expect(503);
    expect(res.body).toEqual({ error: { code: 'service_unavailable', message: 'El registro no está disponible por ahora.' } });
    // Quienes ya existen siguen pudiendo iniciar sesión.
    await request(app).post(`${API}/auth/login`).send({ email: 'usuario1@prueba.test', password: validUser.password }).expect(200);
  });

  it('el seed cuenta para MAX_USERS', async () => {
    const t = targets();
    spyConsole();
    await applySeed(envConfig({ DEMO_MODE: 'true' }), t);
    const app = createApp(testConfig({ maxUsers: 1 }), { userRepository: t.users, itemRepository: t.items });
    await register(app, 1).expect(503);
  });

  it('MAX_USERS usa 1000 por defecto y valida el valor', () => {
    expect(envConfig({}).maxUsers).toBe(1000);
    expect(envConfig({ MAX_USERS: '50' }).maxUsers).toBe(50);
    expect(() => envConfig({ MAX_USERS: '0' })).toThrow();
    expect(() => envConfig({ MAX_USERS: 'mucho' })).toThrow();
  });
});
