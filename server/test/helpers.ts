import bcrypt from 'bcryptjs';
import express, { type Express } from 'express';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadConfig, type Config } from '../src/config/env.js';
import { createErrorHandler, notFoundHandler } from '../src/middleware/errorHandler.js';
import { InMemoryUserRepository } from '../src/repositories/UserRepository.js';

// Valores solo para pruebas: no son secretos reales.
export const TEST_JWT_SECRET = 'secreto-de-prueba-solo-para-tests-0123456789';

export function testConfig(overrides: Partial<Config> = {}): Config {
  return {
    ...loadConfig({
      JWT_SECRET: TEST_JWT_SECRET,
      BCRYPT_COST: '4',
      CORS_ORIGINS: 'http://localhost:5173',
    }),
    ...overrides,
  };
}

export const validUser = {
  name: 'Camila Rodríguez',
  email: 'camila@kunapet.com',
  password: 'UnaClaveLarga123',
};

export interface TestContext {
  app: Express;
  users: InMemoryUserRepository;
  config: Config;
}

export function buildApp(): TestContext {
  const config = testConfig();
  const users = new InMemoryUserRepository();
  return { app: createApp(config, { userRepository: users }), users, config };
}

export const API = '/api/v1';

export interface Session {
  token: string;
  id: string;
  auth: { Authorization: string };
}

export async function session(app: Express, role: 'client' | 'provider', email: string): Promise<Session> {
  const { token, id } = await registerAndLogin(app, { email, role });
  return { token, id, auth: { Authorization: `Bearer ${token}` } };
}

/** Crea un admin directo en el repositorio (el registro público no lo permite) y abre sesión. */
export async function adminSession(app: Express, users: InMemoryUserRepository): Promise<Session> {
  const password = 'ClaveAdminDePrueba1';
  await users.create({
    name: 'Admin de prueba',
    email: 'admin@prueba.test',
    passwordHash: await bcrypt.hash(password, 4),
    role: 'admin',
    phone: null,
  });
  const res = await request(app).post(`${API}/auth/login`).send({ email: 'admin@prueba.test', password }).expect(200);
  const { token, user } = res.body as { token: string; user: { id: string } };
  return { token, id: user.id, auth: { Authorization: `Bearer ${token}` } };
}

export const serviceBody = {
  type: 'service',
  title: 'Baño y Corte de Pelo',
  description: 'Grooming completo con shampoo hipoalergénico',
  category: 'grooming',
  priceCents: 4500,
  durationMinutes: 90,
};

export const productBody = {
  type: 'product',
  title: 'Alimento NutriCan 15kg',
  description: 'Alimento seco para perros adultos',
  category: 'alimentos',
  priceCents: 14550,
  stock: 10,
};

export async function createItem(
  app: Express,
  provider: Session,
  body: Record<string, unknown> = serviceBody,
): Promise<{ id: string; priceCents: number; title: string }> {
  const res = await request(app).post(`${API}/items`).set(provider.auth).send(body).expect(201);
  return (res.body as { data: { id: string; priceCents: number; title: string } }).data;
}

export async function registerAndLogin(
  app: Express,
  overrides: Record<string, unknown> = {},
): Promise<{ token: string; id: string }> {
  const body = { ...validUser, ...overrides };
  await request(app).post('/api/v1/auth/register').send(body).expect(201);
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: body.email, password: body.password })
    .expect(200);
  const { token, user } = res.body as { token: string; user: { id: string } };
  return { token, id: user.id };
}

/** App mínima para probar los middlewares con rutas protegidas por rol. */
export function withProtectedRoutes(
  build: (app: Express) => void,
): Express {
  const app = express();
  build(app);
  app.use(notFoundHandler);
  app.use(createErrorHandler());
  return app;
}
