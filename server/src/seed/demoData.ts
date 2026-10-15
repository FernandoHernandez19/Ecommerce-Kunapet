import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import type { Config } from '../config/env.js';
import type { ItemRepository, NewItem } from '../repositories/ItemRepository.js';
import type { PetRepository } from '../repositories/PetRepository.js';
import type { UserRepository } from '../repositories/UserRepository.js';
import type { Role } from '../types/user.js';

export interface DemoCredential {
  role: Role;
  email: string;
  password: string;
}

export interface SeedTargets {
  users: UserRepository;
  items: ItemRepository;
  pets: PetRepository;
}

/** El seed solo corre si se pide explícitamente y nunca en producción. */
export function shouldSeed(config: Pick<Config, 'seedDemoData' | 'nodeEnv'>): boolean {
  return config.seedDemoData && config.nodeEnv !== 'production';
}

type ItemSeed = Omit<NewItem, 'providerId' | 'isActive'>;

const product = (
  title: string,
  category: string,
  priceCents: number,
  description: string,
  targetPets: ItemSeed['targetPets'],
  stock: number,
  imageUrl: string | null = null,
): ItemSeed => ({
  type: 'product',
  title,
  description,
  category,
  priceCents,
  stock,
  durationMinutes: null,
  location: 'Envío a todo Lima',
  imageUrl,
  targetPets,
});

const service = (
  title: string,
  category: string,
  priceCents: number,
  description: string,
  targetPets: ItemSeed['targetPets'],
  durationMinutes: number,
  location: string,
  imageUrl: string | null = null,
): ItemSeed => ({
  type: 'service',
  title,
  description,
  category,
  priceCents,
  stock: null,
  durationMinutes,
  location,
  imageUrl,
  targetPets,
});

// Derivados de src/data/mockData.js, con los formatos del contrato (céntimos, slugs, enums en inglés).
const PRODUCTS: ItemSeed[] = [
  product('NutriCan Pro Adultos Raza Grande - Pollo y Arroz 15kg', 'alimentos', 14550, 'Nutrición completa para perros adultos de raza grande, con pollo real como ingrediente principal.', ['dog'], 40, 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400&q=80'),
  product('Bravecto Antipulgas Perros 10-20kg', 'medicina', 11500, 'Tableta masticable contra garrapatas y pulgas. Eficacia de 12 semanas.', ['dog'], 25, 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80'),
  product('Juguete Kong Classic Masticable Rojo', 'accesorios', 6500, 'Juguete de goma resistente para perros masticadores. Se puede rellenar con premios.', ['dog'], 60, 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=400&q=80'),
  product('Collar Antipulgas y Garrapatas 8 meses', 'medicina', 8990, 'Protección de larga duración, resistente al agua e inodoro.', ['dog'], 30, 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&q=80'),
  product('Alimento Premium para Gatos - Mix Nutritivo 2kg', 'alimentos', 3500, 'Mix con taurina y semillas seleccionadas para gatos y aves domésticas.', ['cat', 'bird'], 80),
  product('Rascador Castillo de Lujo 4 Pisos', 'accesorios', 45000, 'Rascador de 4 niveles con hamacas y postes de sisal. Se entrega desarmado.', ['cat'], 8, 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&q=80'),
  product('Correa Retráctil 5m', 'accesorios', 6200, 'Correa retráctil con freno de seguridad para perros medianos.', ['dog'], 50),
];

const SERVICES: ItemSeed[] = [
  service('Baño y Corte de Pelo Completo', 'grooming', 4500, 'Baño relajante con shampoo premium, corte según raza, uñas y limpieza de oídos.', ['dog', 'cat'], 90, 'San Borja, Lima', 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&q=80'),
  service('Consulta Veterinaria General', 'veterinaria', 6000, 'Evaluación de salud, vacunación, desparasitación o chequeo de rutina.', ['dog', 'cat'], 30, 'San Borja, Lima', 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&q=80'),
  service('Paseo VIP por Lagunas de La Molina', 'paseos', 15000, 'Paseo de lujo de 3 horas por zonas seguras, con snacks incluidos. Reserva con 48 h.', ['dog'], 180, 'La Molina', 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=400&q=80'),
  service('Cita con Especialista en Animales Exóticos', 'veterinaria', 18000, 'Atención para reptiles, roedores y otros animales exóticos. Incluye indicaciones nutricionales.', ['exotic'], 45, 'Barranco', 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&q=80'),
  service('Paseo de Perros Grupal', 'paseos', 2500, 'Paseo grupal en parques cercanos, máximo 4 perros por grupo.', ['dog'], 60, 'Miraflores'),
];

function randomPassword(): string {
  return randomBytes(12).toString('base64url');
}

/**
 * Carga usuarios de cada rol, 12 items y 2 mascotas. Las contraseñas se generan al azar
 * en cada llamada y se devuelven para mostrarlas una vez; no hay contraseñas fijas en el código.
 */
export async function seedDemoData(targets: SeedTargets, bcryptCost: number): Promise<DemoCredential[]> {
  const specs: { role: Role; name: string; email: string }[] = [
    { role: 'admin', name: 'Admin Demo', email: 'admin@demo.kunapet.test' },
    { role: 'provider', name: 'PetShop Central', email: 'proveedor@demo.kunapet.test' },
    { role: 'provider', name: 'Spa Canino Pelusa', email: 'proveedor2@demo.kunapet.test' },
    { role: 'client', name: 'Camila Rodríguez', email: 'cliente@demo.kunapet.test' },
  ];

  const credentials: DemoCredential[] = [];
  const ids = new Map<string, string>();
  for (const spec of specs) {
    const password = randomPassword();
    const user = await targets.users.create({
      name: spec.name,
      email: spec.email,
      passwordHash: await bcrypt.hash(password, bcryptCost),
      role: spec.role,
      phone: null,
    });
    ids.set(spec.email, user.id);
    credentials.push({ role: spec.role, email: spec.email, password });
  }

  const shop = ids.get('proveedor@demo.kunapet.test');
  const spa = ids.get('proveedor2@demo.kunapet.test');
  const client = ids.get('cliente@demo.kunapet.test');
  if (!shop || !spa || !client) throw new Error('Seed incompleto.');

  for (const item of PRODUCTS) await targets.items.create({ ...item, providerId: shop, isActive: true });
  for (const item of SERVICES) await targets.items.create({ ...item, providerId: spa, isActive: true });

  await targets.pets.create({
    ownerId: client, name: 'Luna', species: 'dog', breed: 'Golden Retriever', gender: 'female',
    birthDate: '2022-03-15', weightGrams: 28000, notes: 'Alergia al trigo. Le encanta el agua.', photoUrl: null,
  });
  await targets.pets.create({
    ownerId: client, name: 'Milo', species: 'cat', breed: 'Siamés', gender: 'male',
    birthDate: '2020-07-22', weightGrams: 4500, notes: 'Independiente pero cariñoso.', photoUrl: null,
  });

  return credentials;
}

export function formatCredentials(credentials: readonly DemoCredential[]): string {
  const rows = credentials.map((c) => `  ${c.role.padEnd(9)} ${c.email.padEnd(32)} ${c.password}`);
  return [
    '',
    '================ DATOS DE EJEMPLO (SOLO DESARROLLO) ================',
    ' SEED_DEMO_DATA=true: se crearon usuarios, items y mascotas de prueba.',
    ' Estas contraseñas son aleatorias, se muestran UNA sola vez y cambian',
    ' en cada arranque. No uses este modo en producción.',
    ...rows,
    '=====================================================================',
    '',
  ].join('\n');
}

export const DEMO_PROVIDER_EMAIL = 'catalogo@demo.kunapet.test';

/**
 * Modo demo público: solo el catálogo, bajo un proveedor demo cuya contraseña es aleatoria,
 * se descarta al crearlo y no se devuelve, imprime ni registra (nadie puede iniciar sesión con él).
 */
export async function seedDemoCatalog(targets: Pick<SeedTargets, 'users' | 'items'>, bcryptCost: number): Promise<void> {
  const provider = await targets.users.create({
    name: 'KunaPet Demo',
    email: DEMO_PROVIDER_EMAIL,
    passwordHash: await bcrypt.hash(randomPassword(), bcryptCost),
    role: 'provider',
    phone: null,
  });
  for (const item of [...PRODUCTS, ...SERVICES]) {
    await targets.items.create({ ...item, providerId: provider.id, isActive: true });
  }
}
