import { describe, expect, it } from 'vitest';
import bcrypt from 'bcryptjs';
import { loadConfig } from '../src/config/env.js';
import { InMemoryItemRepository } from '../src/repositories/ItemRepository.js';
import { InMemoryPetRepository } from '../src/repositories/PetRepository.js';
import { InMemoryUserRepository } from '../src/repositories/UserRepository.js';
import { seedDemoData, shouldSeed } from '../src/seed/demoData.js';
import { TEST_JWT_SECRET } from './helpers.js';

const env = (extra: Record<string, string>) => loadConfig({ JWT_SECRET: TEST_JWT_SECRET, ...extra });

describe('seed de datos de ejemplo', () => {
  it('no se ejecuta sin SEED_DEMO_DATA, ni con valores distintos de "true"', () => {
    expect(shouldSeed(env({}))).toBe(false);
    expect(shouldSeed(env({ SEED_DEMO_DATA: 'false' }))).toBe(false);
    expect(shouldSeed(env({ SEED_DEMO_DATA: '1' }))).toBe(false);
    expect(shouldSeed(env({ SEED_DEMO_DATA: '' }))).toBe(false);
  });

  it('se ejecuta solo con SEED_DEMO_DATA=true fuera de producción', () => {
    expect(shouldSeed(env({ SEED_DEMO_DATA: 'true' }))).toBe(true);
    expect(shouldSeed(env({ SEED_DEMO_DATA: 'true', NODE_ENV: 'development' }))).toBe(true);
  });

  it('no se ejecuta en producción aunque SEED_DEMO_DATA sea true', () => {
    expect(shouldSeed(env({ SEED_DEMO_DATA: 'true', NODE_ENV: 'production' }))).toBe(false);
  });

  it('crea un usuario por rol, 12 items y 2 mascotas con contraseñas aleatorias', async () => {
    const run = async () => {
      const targets = { users: new InMemoryUserRepository(), items: new InMemoryItemRepository(), pets: new InMemoryPetRepository() };
      const credentials = await seedDemoData(targets, 4);
      return { targets, credentials };
    };
    const first = await run();
    const second = await run();

    expect(new Set(first.credentials.map((c) => c.role))).toEqual(new Set(['admin', 'provider', 'client']));
    const items = await first.targets.items.search({}, { page: 1, limit: 100 });
    expect(items.meta.total).toBe(12);
    expect(new Set(items.data.map((i) => i.type))).toEqual(new Set(['product', 'service']));
    expect(items.data.every((i) => Number.isInteger(i.priceCents) && i.priceCents > 0 && i.currency === 'PEN')).toBe(true);

    const client = first.credentials.find((c) => c.role === 'client');
    const record = await first.targets.users.findByEmail(client?.email ?? '');
    expect(record).not.toBeNull();
    expect(await bcrypt.compare(client?.password ?? '', record?.passwordHash ?? '')).toBe(true);
    expect((await first.targets.pets.listByOwner(record?.id ?? '', { page: 1, limit: 10 })).meta.total).toBe(2);

    // Contraseñas distintas en cada ejecución y suficientemente largas.
    const pw1 = first.credentials.map((c) => c.password);
    const pw2 = second.credentials.map((c) => c.password);
    expect(pw1.some((p) => pw2.includes(p))).toBe(false);
    expect(pw1.every((p) => p.length >= 16)).toBe(true);
  });
});
