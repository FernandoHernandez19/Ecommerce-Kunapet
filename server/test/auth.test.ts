import { createHmac } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { ConfigError, loadConfig } from '../src/config/env.js';
import { InMemoryUserRepository } from '../src/repositories/UserRepository.js';
import { createAuthenticate, requireRole } from '../src/middleware/auth.js';
import { TokenService } from '../src/services/TokenService.js';
import {
  TEST_JWT_SECRET,
  buildApp,
  registerAndLogin,
  testConfig,
  validUser,
  withProtectedRoutes,
} from './helpers.js';

const REGISTER = '/api/v1/auth/register';
const LOGIN = '/api/v1/auth/login';
const ME = '/api/v1/auth/me';

function expectUniformError(body: unknown, code: string): void {
  expect(body).toMatchObject({ error: { code, message: expect.any(String) } });
  expect(Object.keys((body as { error: object }).error).every((k) => ['code', 'message', 'details'].includes(k))).toBe(true);
  expect(JSON.stringify(body)).not.toMatch(/stack|node_modules|\bat\s.+\(/);
}

afterEach(() => {
  vi.useRealTimers();
});

describe('GET /health', () => {
  it('responde ok', async () => {
    const { app } = buildApp();
    const res = await request(app).get('/api/v1/health').expect(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('devuelve 404 JSON uniforme en rutas inexistentes', async () => {
    const { app } = buildApp();
    const res = await request(app).get('/api/v1/nada').expect(404);
    expectUniformError(res.body, 'not_found');
  });
});

describe('POST /auth/register', () => {
  it('registra un usuario y no devuelve el hash', async () => {
    const { app, users } = buildApp();
    const res = await request(app).post(REGISTER).send(validUser).expect(201);

    expect(res.body.user).toMatchObject({ name: validUser.name, email: validUser.email, role: 'client' });
    expect(res.body.user.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(JSON.stringify(res.body)).not.toMatch(/hash|password|\$2[aby]\$/i);

    const stored = await users.findByEmail(validUser.email);
    expect(stored?.passwordHash).toMatch(/^\$2[aby]\$/);
    expect(stored?.passwordHash).not.toContain(validUser.password);
  });

  it('acepta el rol provider', async () => {
    const { app } = buildApp();
    const res = await request(app).post(REGISTER).send({ ...validUser, role: 'provider' }).expect(201);
    expect(res.body.user.role).toBe('provider');
  });

  it('rechaza email duplicado, incluso con otras mayúsculas (409)', async () => {
    const { app } = buildApp();
    await request(app).post(REGISTER).send(validUser).expect(201);
    const res = await request(app)
      .post(REGISTER)
      .send({ ...validUser, email: 'CAMILA@KunaPet.COM' })
      .expect(409);
    expectUniformError(res.body, 'conflict');
  });

  it('rechaza registrar role admin', async () => {
    const { app, users } = buildApp();
    const res = await request(app).post(REGISTER).send({ ...validUser, role: 'admin' }).expect(400);
    expectUniformError(res.body, 'validation_error');
    expect(await users.findByEmail(validUser.email)).toBeNull();
  });

  it('rechaza contraseñas de 7 y de 73 caracteres, acepta 8 y 72', async () => {
    const { app } = buildApp();
    const short = await request(app).post(REGISTER).send({ ...validUser, password: 'a'.repeat(7) }).expect(400);
    expectUniformError(short.body, 'validation_error');
    await request(app).post(REGISTER).send({ ...validUser, password: 'a'.repeat(73) }).expect(400);
    await request(app).post(REGISTER).send({ ...validUser, email: 'a@x.com', password: 'a'.repeat(8) }).expect(201);
    await request(app).post(REGISTER).send({ ...validUser, email: 'b@x.com', password: 'a'.repeat(72) }).expect(201);
  });

  it('rechaza contraseñas de ≤72 caracteres pero >72 bytes', async () => {
    const { app } = buildApp();
    await request(app).post(REGISTER).send({ ...validUser, password: 'ñ'.repeat(40) }).expect(400);
  });

  it('rechaza JSON mal formado y cuerpos mayores a 100 kb', async () => {
    const { app } = buildApp();
    const bad = await request(app).post(REGISTER).set('content-type', 'application/json').send('{no-json').expect(400);
    expectUniformError(bad.body, 'validation_error');
    await request(app).post(REGISTER).send({ ...validUser, name: 'x'.repeat(200_000) }).expect(400);
  });
});

describe('POST /auth/login', () => {
  it('devuelve user, token HS256 y expiresIn', async () => {
    const { app } = buildApp();
    await request(app).post(REGISTER).send(validUser).expect(201);
    const res = await request(app)
      .post(LOGIN)
      .send({ email: 'CAMILA@kunapet.com', password: validUser.password })
      .expect(200);

    expect(res.body.expiresIn).toBe(3600);
    expect(JSON.stringify(res.body.user)).not.toMatch(/hash|password/i);
    const decoded = jwt.decode(res.body.token as string, { complete: true });
    expect(decoded?.header.alg).toBe('HS256');
    expect(decoded?.payload).toMatchObject({ sub: res.body.user.id, role: 'client' });
  });

  it('responde idéntico con contraseña errónea y con email inexistente', async () => {
    const { app } = buildApp();
    await request(app).post(REGISTER).send(validUser).expect(201);
    const wrongPassword = await request(app).post(LOGIN).send({ email: validUser.email, password: 'otraClave123' });
    const unknownEmail = await request(app).post(LOGIN).send({ email: 'nadie@kunapet.com', password: 'otraClave123' });

    expect(wrongPassword.status).toBe(401);
    expect(unknownEmail.status).toBe(401);
    expect(unknownEmail.body).toEqual(wrongPassword.body);
    expectUniformError(wrongPassword.body, 'unauthorized');
  });

  it('limita a 10 intentos por IP+email y responde 429', async () => {
    const { app } = buildApp();
    for (let i = 0; i < 10; i++) {
      await request(app).post(LOGIN).send({ email: validUser.email, password: 'incorrecta123' }).expect(401);
    }
    const blocked = await request(app).post(LOGIN).send({ email: validUser.email, password: 'incorrecta123' }).expect(429);
    expectUniformError(blocked.body, 'rate_limited');
    // Otro email no queda bloqueado.
    await request(app).post(LOGIN).send({ email: 'otro@kunapet.com', password: 'incorrecta123' }).expect(401);
  });

  it('libera el límite pasada la ventana de 15 minutos', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const { app } = buildApp();
    for (let i = 0; i < 11; i++) {
      await request(app).post(LOGIN).send({ email: validUser.email, password: 'incorrecta123' });
    }
    vi.setSystemTime(Date.now() + 15 * 60 * 1000 + 1000);
    await request(app).post(LOGIN).send({ email: validUser.email, password: 'incorrecta123' }).expect(401);
  });
});

describe('GET /auth/me', () => {
  it('devuelve el perfil con un token válido', async () => {
    const { app } = buildApp();
    const { token, id } = await registerAndLogin(app);
    const res = await request(app).get(ME).set('Authorization', `Bearer ${token}`).expect(200);
    expect(res.body.user).toMatchObject({ id, email: validUser.email, role: 'client' });
    expect(JSON.stringify(res.body)).not.toMatch(/hash|password/i);
  });

  it('responde 401 uniforme sin token o con header malformado', async () => {
    const { app } = buildApp();
    const { token } = await registerAndLogin(app);
    const bodies = [
      (await request(app).get(ME).expect(401)).body,
      (await request(app).get(ME).set('Authorization', token).expect(401)).body,
      (await request(app).get(ME).set('Authorization', `Basic ${token}`).expect(401)).body,
      (await request(app).get(ME).set('Authorization', 'Bearer').expect(401)).body,
    ];
    for (const body of bodies) {
      expectUniformError(body, 'unauthorized');
      expect(body).toEqual(bodies[0]);
    }
  });

  it('rechaza un token manipulado', async () => {
    const { app } = buildApp();
    const { token } = await registerAndLogin(app);
    const [h, p, s] = token.split('.') as [string, string, string];
    const forgedPayload = Buffer.from(JSON.stringify({ ...jwt.decode(token) as object, role: 'admin' })).toString('base64url');
    const res = await request(app).get(ME).set('Authorization', `Bearer ${h}.${forgedPayload}.${s}`).expect(401);
    expectUniformError(res.body, 'unauthorized');
    await request(app).get(ME).set('Authorization', `Bearer ${h}.${p}.${s.slice(0, -2)}xx`).expect(401);
    await request(app).get(ME).set('Authorization', 'Bearer abc.def.ghi').expect(401);
  });

  it('rechaza un token expirado (reloj simulado)', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const { app } = buildApp();
    const { token } = await registerAndLogin(app);
    await request(app).get(ME).set('Authorization', `Bearer ${token}`).expect(200);

    vi.setSystemTime(Date.now() + 3600 * 1000 + 1000);
    const res = await request(app).get(ME).set('Authorization', `Bearer ${token}`).expect(401);
    expectUniformError(res.body, 'unauthorized');
  });

  it('rechaza tokens con otro algoritmo (alg none y HS512)', async () => {
    const { app } = buildApp();
    const { id } = await registerAndLogin(app);
    const enc = (o: object): string => Buffer.from(JSON.stringify(o)).toString('base64url');
    const exp = Math.floor(Date.now() / 1000) + 600;
    const payload = enc({ sub: id, role: 'client', exp });

    const none = `${enc({ alg: 'none', typ: 'JWT' })}.${payload}.`;
    await request(app).get(ME).set('Authorization', `Bearer ${none}`).expect(401);

    const hs512Header = enc({ alg: 'HS512', typ: 'JWT' });
    const sig = createHmac('sha512', TEST_JWT_SECRET).update(`${hs512Header}.${payload}`).digest('base64url');
    const res = await request(app).get(ME).set('Authorization', `Bearer ${hs512Header}.${payload}.${sig}`).expect(401);
    expectUniformError(res.body, 'unauthorized');
  });

  it('rechaza un token firmado con otro secreto', async () => {
    const { app } = buildApp();
    const { id } = await registerAndLogin(app);
    const foreign = jwt.sign({ role: 'client' }, 'otro-secreto-distinto-de-32-caracteres!!', { algorithm: 'HS256', subject: id, expiresIn: 600 });
    await request(app).get(ME).set('Authorization', `Bearer ${foreign}`).expect(401);
  });

  it('responde 401 si el usuario ya no existe en el repositorio', async () => {
    const tokens = new TokenService(TEST_JWT_SECRET);
    const { app } = buildApp();
    const ghostToken = tokens.sign('00000000-0000-4000-8000-000000000000', 'client');
    await request(app).get(ME).set('Authorization', `Bearer ${ghostToken}`).expect(401);
  });
});

describe('requireRole', () => {
  it('permite el rol correcto y responde 403 al incorrecto', async () => {
    const { app, users, config } = buildApp();
    const tokens = new TokenService(config.jwtSecret);
    const client = await registerAndLogin(app);
    const admin = await users.create({ name: 'Admin', email: 'admin@kunapet.com', passwordHash: 'x', role: 'admin', phone: null });

    const protectedApp = withProtectedRoutes((a) => {
      a.use(express.json());
      a.get('/solo-admin', createAuthenticate(tokens, users), requireRole('admin'), (_req, res) => {
        res.json({ ok: true });
      });
    });

    const forbidden = await request(protectedApp).get('/solo-admin').set('Authorization', `Bearer ${client.token}`).expect(403);
    expectUniformError(forbidden.body, 'forbidden');

    const adminToken = tokens.sign(admin.id, 'admin');
    await request(protectedApp).get('/solo-admin').set('Authorization', `Bearer ${adminToken}`).expect(200);
    await request(protectedApp).get('/solo-admin').expect(401);
  });

  it('usa el rol del repositorio y no el del token', async () => {
    const { app, users, config } = buildApp();
    const tokens = new TokenService(config.jwtSecret);
    const client = await registerAndLogin(app);
    const inflated = tokens.sign(client.id, 'admin');

    const protectedApp = withProtectedRoutes((a) => {
      a.get('/solo-admin', createAuthenticate(tokens, users), requireRole('admin'), (_req, res) => {
        res.json({ ok: true });
      });
    });
    await request(protectedApp).get('/solo-admin').set('Authorization', `Bearer ${inflated}`).expect(403);
  });
});

describe('CORS y cabeceras', () => {
  it('solo permite los orígenes configurados', async () => {
    const { app } = buildApp();
    const allowed = await request(app).get('/api/v1/health').set('Origin', 'http://localhost:5173');
    expect(allowed.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    const denied = await request(app).get('/api/v1/health').set('Origin', 'http://malo.example');
    expect(denied.headers['access-control-allow-origin']).toBeUndefined();
    expect(allowed.headers['x-powered-by']).toBeUndefined();
    expect(allowed.headers['x-content-type-options']).toBe('nosniff');
  });
});

describe('configuración', () => {
  it('loadConfig falla con JWT_SECRET ausente o corto, sin exponer su valor', () => {
    expect(() => loadConfig({})).toThrow(ConfigError);
    const shortSecret = 'corto-1234';
    try {
      loadConfig({ JWT_SECRET: shortSecret });
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigError);
      expect((err as Error).message).not.toContain(shortSecret);
    }
  });

  it('aplica valores por defecto y trata variables vacías como ausentes', () => {
    const cfg = loadConfig({ JWT_SECRET: TEST_JWT_SECRET, BCRYPT_COST: '', PORT: '', CORS_ORIGINS: ' http://a.com , http://b.com ' });
    expect(cfg).toMatchObject({ bcryptCost: 10, port: 3000, corsOrigins: ['http://a.com', 'http://b.com'] });
  });

  it('el proceso no arranca con un JWT_SECRET corto', () => {
    const result = spawnSync(process.execPath, ['--import', 'tsx', 'src/index.ts'], {
      env: { PATH: process.env.PATH ?? '', JWT_SECRET: 'corto' },
      encoding: 'utf8',
      timeout: 20_000,
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('JWT_SECRET');
    expect(result.stderr).not.toContain('corto\n');
  });
});

describe('TRUST_PROXY', () => {
  async function exhaustWithSpoofedIps(trustProxy: number): Promise<number> {
    const config = testConfig({ trustProxy });
    const app = createApp(config, { userRepository: new InMemoryUserRepository() });
    let last = 0;
    for (let i = 0; i < 12; i++) {
      const res = await request(app)
        .post(LOGIN)
        .set('X-Forwarded-For', `203.0.113.${i + 1}`)
        .send({ email: validUser.email, password: 'incorrecta123' });
      last = res.status;
    }
    return last;
  }

  it('con TRUST_PROXY=0 ignora X-Forwarded-For: el límite se aplica igual', async () => {
    expect(await exhaustWithSpoofedIps(0)).toBe(429);
  });

  it('con TRUST_PROXY=1 usa la IP reenviada: cada IP tiene su propio límite', async () => {
    expect(await exhaustWithSpoofedIps(1)).toBe(401);
  });
});
