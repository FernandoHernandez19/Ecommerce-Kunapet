/**
 * Adaptadores API ↔ UI (funciones puras, sin red ni estado).
 *
 * La API habla el idioma del contrato (docs/api-contract.md §5: céntimos, ISO,
 * enums en inglés); las pantallas ya existentes esperan otra forma (soles, texto
 * legible, etiquetas en español). Este módulo es la única frontera entre ambas,
 * así las pantallas no se reescriben y el contrato puede evolucionar en un solo sitio.
 */

import type { Gender, Item, Order, OrderStatus, PaymentMethod, Pet, Species, TargetPet } from '@/types/api';

// ─── Dinero ──────────────────────────────────────────────────────────────────
const moneyFormat = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** 6200 → "S/ 62.00" (el contrato guarda céntimos enteros). */
export function formatMoney(cents: number | null | undefined): string {
  if (typeof cents !== 'number' || !Number.isFinite(cents)) return 'S/ 0.00';
  return `S/ ${moneyFormat.format(cents / 100)}`;
}

/** Soles (número o texto del formulario) → céntimos enteros. NaN/negativos → null. */
export function solesToCents(soles: string | number | null | undefined): number | null {
  if (typeof soles === 'string' && soles.trim() === '') return null; // Number('') === 0
  const n = typeof soles === 'string' ? Number(soles.replace(',', '.').trim()) : soles;
  if (typeof n !== 'number' || !Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100 + Number.EPSILON);
}

export const centsToSoles = (cents: number | null | undefined): number =>
  typeof cents === 'number' && Number.isFinite(cents) ? cents / 100 : 0;

// ─── Fechas ──────────────────────────────────────────────────────────────────
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const LIMA_TZ = 'America/Lima';
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;
const monthName = (month: string): string => MONTHS[Number(month) - 1] ?? '';

const limaParts = new Intl.DateTimeFormat('es-PE', {
  timeZone: LIMA_TZ,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

interface LimaParts {
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
}

function partsOf(iso: string): LimaParts | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const map = new Map<string, string>();
  for (const p of limaParts.formatToParts(date)) map.set(p.type, p.value);
  const get = (type: string): string => map.get(type) ?? '';
  return { day: get('day'), month: get('month'), year: get('year'), hour: get('hour'), minute: get('minute') };
}

/** "2025-06-29T19:00:00.000Z" → "29 jun 2025" (hora de Lima). */
export function formatDate(iso: string): string {
  const p = partsOf(iso);
  return p ? `${Number(p.day)} ${monthName(p.month)} ${p.year}` : '';
}

/** "2025-06-29T19:00:00.000Z" → "29 jun 2025, 14:00" (hora de Lima). */
export function formatDateTime(iso: string): string {
  const p = partsOf(iso);
  return p ? `${Number(p.day)} ${monthName(p.month)} ${p.year}, ${p.hour}:${p.minute}` : '';
}

/** "2022-03-15" (sin hora, sin zona) → "15 mar 2022". No usa Date para no correr el día. */
export function formatDateOnly(value: string | null | undefined): string {
  const m = DATE_ONLY.exec(value ?? '');
  return m ? `${Number(m[3])} ${monthName(m[2] ?? '')} ${m[1]}` : '';
}

/** Años cumplidos desde "YYYY-MM-DD"; null si no hay fecha válida. */
export function calcAge(birthDate: string | null | undefined, now: Date = new Date()): number | null {
  const m = DATE_ONLY.exec(birthDate ?? '');
  if (!m) return null;
  const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
  let age = now.getFullYear() - year;
  const beforeBirthday = now.getMonth() + 1 < month || (now.getMonth() + 1 === month && now.getDate() < day);
  if (beforeBirthday) age -= 1;
  return age < 0 ? null : age;
}

/** Texto de edad: "2 años", "1 año", "Menos de 1 año" o "Edad no registrada". */
export function ageLabel(birthDate: string | null | undefined, now: Date = new Date()): string {
  const age = calcAge(birthDate, now);
  if (age === null) return 'Edad no registrada';
  if (age === 0) return 'Menos de 1 año';
  return age === 1 ? '1 año' : `${age} años`;
}

// ─── Categorías de items ─────────────────────────────────────────────────────
export interface CategoryMeta {
  label?: string;
  icon: string;
  iconBg: string;
}

export const CATEGORY_META: Readonly<Record<string, CategoryMeta & { label: string }>> = {
  alimentos:   { label: 'Alimentos',   icon: '🍖', iconBg: 'bg-orange-100' },
  medicina:    { label: 'Medicina',    icon: '💊', iconBg: 'bg-purple-100' },
  accesorios:  { label: 'Accesorios',  icon: '🦴', iconBg: 'bg-pink-100' },
  grooming:    { label: 'Grooming',    icon: '🚿', iconBg: 'bg-amber-100' },
  veterinaria: { label: 'Veterinaria', icon: '🏥', iconBg: 'bg-blue-100' },
  paseos:      { label: 'Paseos',      icon: '🚶‍♂️', iconBg: 'bg-emerald-100' },
};
const DEFAULT_CATEGORY_META: CategoryMeta = { icon: '🐾', iconBg: 'bg-gray-100' };

/** Metadatos de una categoría conocida; `undefined` si el slug no está en la tabla (sin heredar de Object). */
const knownCategory = (slug: string | null | undefined): (CategoryMeta & { label: string }) | undefined =>
  slug && Object.hasOwn(CATEGORY_META, slug) ? CATEGORY_META[slug] : undefined;

/** "Veterinaria", "Exótico" → slug del contrato ("veterinaria"). */
export function categoryToSlug(label: string | null | undefined): string {
  return String(label ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function categoryLabel(slug: string | null | undefined): string {
  const known = knownCategory(slug);
  if (known) return known.label;
  const text = String(slug ?? '').replace(/-/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const TARGET_PET_LABEL: Readonly<Record<TargetPet, string>> = { dog: 'Perro', cat: 'Gato', bird: 'Ave', exotic: 'Exótico' };

// ─── Items (catálogo y gestión del proveedor) ────────────────────────────────
export interface UiFeature {
  id: number;
  label: string;
  type: 'duration' | 'activity' | 'insurance' | 'report';
}

export interface UiProvider {
  id: string;
  name: string;
  avatar: string | null;
}

/** Item tal como lo consumen tarjetas, detalle y gestión del proveedor (modelo de vista). */
export interface UiItem {
  id: string;
  type: Item['type'];
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  categoryLabel: string;
  priceCents: number;
  price: number;
  basePrice: number;
  priceLabel: string;
  priceText: string;
  image: string | null;
  location: string;
  targetPets: string[];
  targetLabel: string;
  stock: number | null;
  durationMinutes: number | null;
  duration: string;
  features: UiFeature[];
  extraInfo: null;
  provider: UiProvider;
  providerId: string;
  isActive: boolean;
  createdAt: string;
  // La API no ofrece estos datos: siempre null para que la interfaz no los muestre.
  rating: null;
  reviewCount: null;
  originalPrice: null;
  badge: null;
  distance: null;
  icon: string;
  iconBg: string;
}

/**
 * Item de la API → forma que usan las tarjetas, el detalle y la gestión del proveedor.
 * Lo que la API no tiene queda en null (calificaciones, reseñas, badge, distancia…): la UI
 * no debe inventarlo.
 */
export function toUiItem(item: Item): UiItem {
  const meta = knownCategory(item.category) ?? DEFAULT_CATEGORY_META;
  const label = categoryLabel(item.category);
  const isService = item.type === 'service';
  const features: UiFeature[] = [];
  if (isService && item.durationMinutes) features.push({ id: 1, label: `${item.durationMinutes} min`, type: 'duration' });
  if (!isService && item.stock !== null) {
    features.push({ id: 1, label: item.stock > 0 ? `${item.stock} en stock` : 'Sin stock', type: 'activity' });
  }
  const targetPets = item.targetPets.map((p) => TARGET_PET_LABEL[p]);
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    description: item.description,
    category: isService ? `Servicio • ${label}` : label,
    categorySlug: item.category,
    categoryLabel: label,
    priceCents: item.priceCents,
    price: centsToSoles(item.priceCents),
    basePrice: centsToSoles(item.priceCents),
    priceLabel: 'S/',
    priceText: formatMoney(item.priceCents),
    image: item.imageUrl,
    location: item.location ?? '',
    targetPets,
    targetLabel: targetPets.join(', '),
    stock: item.stock,
    durationMinutes: item.durationMinutes,
    duration: item.durationMinutes ? `${item.durationMinutes} min` : '',
    features,
    extraInfo: null,
    provider: item.provider
      ? { id: item.provider.id, name: item.provider.name, avatar: item.provider.avatarUrl }
      : { id: item.providerId, name: 'Proveedor KunaPet', avatar: null },
    providerId: item.providerId,
    isActive: item.isActive,
    createdAt: item.createdAt,
    rating: null,
    reviewCount: null,
    originalPrice: null,
    badge: null,
    distance: null,
    // icon/iconBg no existen en la API: se derivan de la categoría.
    icon: meta.icon,
    iconBg: meta.iconBg,
  };
}

/** Formulario de gestión del proveedor (valores tal como los escribe el usuario). */
export interface ItemFormInput {
  type?: Item['type'];
  title?: string;
  description?: string;
  category?: string;
  /** Soles, como texto del input (p. ej. "25.50"). */
  price?: string | number;
  durationMinutes?: string | number;
  duration?: string | number;
  stock?: string | number | null;
}

/** Body de POST /items (y base de PATCH). `priceCents` es null si el precio escrito no es válido. */
export interface ItemBody {
  type?: Item['type'];
  title: string;
  description: string;
  category: string;
  priceCents: number | null;
  durationMinutes?: number;
  stock?: number;
}

/** Formulario de gestión del proveedor → body de POST/PATCH /items. */
export function toApiItemInput(form: ItemFormInput): ItemBody {
  const body: ItemBody = {
    title: String(form.title ?? '').trim(),
    description: String(form.description ?? '').trim(),
    category: categoryToSlug(form.category),
    priceCents: solesToCents(form.price),
  };
  if (form.type) body.type = form.type;
  if (form.type === 'service' || form.durationMinutes !== undefined) {
    const minutes = Number.parseInt(String(form.durationMinutes ?? form.duration), 10);
    if (Number.isInteger(minutes)) body.durationMinutes = minutes;
  }
  if (form.stock !== undefined && form.stock !== '' && form.stock !== null) body.stock = Number(form.stock);
  return body;
}

// ─── Mascotas ────────────────────────────────────────────────────────────────
/** species de la API → valor que entienden PetsManager/tarjetas ('dog' | 'cat' | 'other'). */
export type UiSpecies = 'dog' | 'cat' | 'other';

export function speciesToUi(species: Species): UiSpecies {
  return species === 'dog' || species === 'cat' ? species : 'other';
}

export const SPECIES_LABEL: Readonly<Record<Species, string>> = { dog: 'Perro', cat: 'Gato', bird: 'Ave', exotic: 'Exótico', other: 'Otro' };
export const GENDER_LABEL: Readonly<Record<Gender | 'none', string>> = {
  female: 'Hembra',
  male: 'Macho',
  unknown: 'Sin especificar',
  none: 'Sin especificar',
};

const WIZARD_SPECIES: Readonly<Record<string, Species>> = { perro: 'dog', gato: 'cat', otro: 'other' };

/** Valor del wizard ('perro' | 'gato' | 'otro') → species de la API. */
export function wizardSpeciesToApi(value: string | undefined): Species {
  return (value ? WIZARD_SPECIES[value] : undefined) ?? 'other';
}

/** Mascota como la consumen las pantallas (modelo de vista). */
export interface UiPet {
  id: string;
  name: string;
  species: UiSpecies;
  speciesApi: Species;
  speciesLabel: string;
  breed: string;
  gender: string;
  genderApi: Gender;
  birthdate: string;
  birthdateLabel: string;
  age: number | null;
  ageLabel: string;
  photo: string | null;
  weightGrams: number | null;
  notes: string;
  // La API no tiene vacunas ni historial: la interfaz muestra un estado vacío.
  vaccineStatus: null;
  vaccines: never[];
  createdAt: string;
}

/** Mascota de la API → forma que usan las pantallas. */
export function toUiPet(pet: Pet, now: Date = new Date()): UiPet {
  return {
    id: pet.id,
    name: pet.name,
    species: speciesToUi(pet.species),
    speciesApi: pet.species,
    speciesLabel: SPECIES_LABEL[pet.species],
    breed: pet.breed || 'Raza no especificada',
    gender: GENDER_LABEL[pet.gender ?? 'none'],
    genderApi: pet.gender ?? 'unknown',
    birthdate: pet.birthDate ?? '',
    birthdateLabel: formatDateOnly(pet.birthDate) || 'No registrada',
    age: calcAge(pet.birthDate, now),
    ageLabel: ageLabel(pet.birthDate, now),
    photo: pet.photoUrl,
    weightGrams: pet.weightGrams,
    notes: pet.notes ?? '',
    vaccineStatus: null,
    vaccines: [],
    createdAt: pet.createdAt,
  };
}

export const PET_NOTES_MAX = 500;

/** Datos del wizard de alta de mascota (AddPetWizard); todos opcionales para tolerar formularios parciales. */
export interface WizardPetForm {
  name?: string;
  species?: string;
  breed?: string;
  dob?: string;
  weight?: string;
  isSterilized?: boolean;
  vaccines?: string[];
  allergies?: string;
  specialNeeds?: string;
}

/** Body de POST /pets. */
export interface PetCreateBody {
  name: string;
  species: Species;
  breed?: string;
  birthDate?: string;
  weightGrams?: number;
  notes?: string;
}

/** Datos del wizard → body de POST /pets. Alergias y necesidades van dentro de notes. */
export function wizardToApiPet(form: WizardPetForm): PetCreateBody {
  const lines: string[] = [];
  const allergies = String(form.allergies ?? '').trim();
  const needs = String(form.specialNeeds ?? '').trim();
  if (allergies && allergies.toLowerCase() !== 'ninguna') lines.push(`Alergias: ${allergies}`);
  if (needs) lines.push(`Necesidades especiales: ${needs}`);
  if (typeof form.isSterilized === 'boolean') lines.push(`Esterilizado: ${form.isSterilized ? 'Sí' : 'No'}`);

  const kg = Number(String(form.weight ?? '').replace(',', '.'));
  const body: PetCreateBody = {
    name: String(form.name ?? '').trim(),
    species: wizardSpeciesToApi(form.species),
  };
  const breed = String(form.breed ?? '').trim();
  if (breed) body.breed = breed;
  if (form.dob) body.birthDate = form.dob;
  if (Number.isFinite(kg) && kg > 0) body.weightGrams = Math.round(kg * 1000);
  const notes = lines.join('\n').slice(0, PET_NOTES_MAX);
  if (notes) body.notes = notes;
  return body;
}

/** Formulario de edición de PetsManager (valores de la API en species y gender). */
export interface PetEditForm {
  name: string;
  species: Species;
  breed: string;
  gender: Gender | '';
  birthdate: string;
  notes: string;
}

/** Body de PATCH /pets/:id. */
export interface PetPatchBody {
  name: string;
  species: Species;
  breed: string | null;
  gender: Gender;
  birthDate: string | null;
  notes: string | null;
}

/** Formulario de edición (PetsManager) → body de PATCH /pets/:id. */
export function editFormToApiPet(form: PetEditForm): PetPatchBody {
  return {
    name: form.name.trim(),
    species: form.species,
    breed: form.breed.trim() || null,
    gender: form.gender || 'unknown',
    birthDate: form.birthdate || null,
    notes: form.notes.trim().slice(0, PET_NOTES_MAX) || null,
  };
}

// ─── Pedidos ─────────────────────────────────────────────────────────────────
export const SHIPPING_CENTS = 1500;
export const PLATFORM_FEE_CENTS = 250;

export interface EstimateLine {
  type: Item['type'];
  priceCents: number;
  quantity: number;
}

export interface Totals {
  subtotalCents: number;
  shippingCents: number;
  platformFeeCents: number;
  totalCents: number;
}

/**
 * ESTIMACIÓN para mostrar antes de confirmar. Replica las reglas del contrato, pero el
 * total válido es siempre el que devuelve el servidor al crear el pedido.
 */
export function estimateTotals(lines: readonly EstimateLine[]): Totals {
  const subtotalCents = lines.reduce((sum, l) => sum + l.priceCents * l.quantity, 0);
  const shippingCents = lines.some((l) => l.type === 'product') ? SHIPPING_CENTS : 0;
  const platformFeeCents = subtotalCents > 0 ? PLATFORM_FEE_CENTS : 0;
  return { subtotalCents, shippingCents, platformFeeCents, totalCents: subtotalCents + shippingCents + platformFeeCents };
}

export interface OrderStatusMeta {
  label: string;
  trackingStep: number;
}

export const ORDER_STATUS: Readonly<Record<OrderStatus, OrderStatusMeta>> = {
  pending_payment: { label: 'Pago pendiente', trackingStep: 0 },
  confirmed:       { label: 'Confirmado',     trackingStep: 0 },
  preparing:       { label: 'Preparando',     trackingStep: 1 },
  shipping:        { label: 'En camino',      trackingStep: 2 },
  delivered:       { label: 'Entregado',      trackingStep: 3 },
  cancelled:       { label: 'Cancelado',      trackingStep: -1 },
};

const isOrderStatus = (value: string): value is OrderStatus => value in ORDER_STATUS;

export const orderStatusLabel = (status: string): string => (isOrderStatus(status) ? ORDER_STATUS[status].label : status);
export const orderTrackingStep = (status: string): number => (isOrderStatus(status) ? ORDER_STATUS[status].trackingStep : 0);

export const PAYMENT_LABEL: Readonly<Record<PaymentMethod, string>> = { card: 'Tarjeta', yape: 'Yape', transfer: 'Transferencia' };

export interface UiOrderLine {
  itemId: string;
  title: string;
  type: Item['type'];
  quantity: number;
  unitPrice: string;
  lineTotal: string;
}

/** Pedido como lo consumen OrdersView y las pantallas de éxito/detalle (modelo de vista). */
export interface UiOrder {
  id: string;
  shortId: string;
  product: string;
  image: null;
  date: string;
  dateTime: string;
  cost: string;
  status: OrderStatus;
  statusLabel: string;
  trackingStep: number;
  paymentLabel: string;
  lines: UiOrderLine[];
  totals: { subtotal: string; shipping: string; platformFee: string; total: string };
  raw: Order;
}

/** Pedido de la API → forma que usa OrdersView (y la pantalla de éxito). */
export function toUiOrder(order: Order): UiOrder {
  const first = order.items[0];
  const extra = order.items.length - 1;
  return {
    id: order.id,
    shortId: `#${order.id.slice(0, 8).toUpperCase()}`,
    product: first ? (extra > 0 ? `${first.title} y ${extra} más` : first.title) : 'Pedido vacío',
    image: null,
    date: formatDate(order.createdAt),
    dateTime: formatDateTime(order.createdAt),
    cost: formatMoney(order.totalCents),
    status: order.status,
    statusLabel: orderStatusLabel(order.status),
    trackingStep: orderTrackingStep(order.status),
    paymentLabel: PAYMENT_LABEL[order.paymentMethod],
    lines: order.items.map((l) => ({
      itemId: l.itemId,
      title: l.title,
      type: l.type,
      quantity: l.quantity,
      unitPrice: formatMoney(l.unitPriceCents),
      lineTotal: formatMoney(l.lineTotalCents),
    })),
    totals: {
      subtotal: formatMoney(order.subtotalCents),
      shipping: formatMoney(order.shippingCents),
      platformFee: formatMoney(order.platformFeeCents),
      total: formatMoney(order.totalCents),
    },
    raw: order,
  };
}

// ─── Gestión de servicios del proveedor ──────────────────────────────────────
export const SERVICE_CATEGORIES = ['Paseos', 'Grooming', 'Veterinaria'] as const;
export const BULK_LIMIT = 20;

/**
 * Valida el formulario de servicio con las mismas reglas del servidor (contrato §4).
 * @returns errores por campo (vacío si todo es válido)
 */
export function validateServiceForm(form: ItemFormInput): Partial<Record<'title' | 'description' | 'category' | 'price' | 'durationMinutes', string>> {
  const errors: ReturnType<typeof validateServiceForm> = {};
  const title = String(form.title ?? '').trim();
  if (title.length < 2) errors.title = 'El título debe tener al menos 2 caracteres.';
  else if (title.length > 120) errors.title = 'El título no puede superar 120 caracteres.';
  const description = String(form.description ?? '').trim();
  if (!description) errors.description = 'La descripción es obligatoria.';
  else if (description.length > 2000) errors.description = 'La descripción no puede superar 2000 caracteres.';
  if (!categoryToSlug(form.category)) errors.category = 'Selecciona una categoría.';
  const raw = String(form.price ?? '').replace(',', '.').trim();
  const cents = solesToCents(raw);
  if (raw === '' || cents === null || cents < 1) errors.price = 'Ingresa un precio mayor que 0.';
  else if (!/^\d+(\.\d{1,2})?$/.test(raw)) errors.price = 'Usa como máximo 2 decimales.';
  else if (cents > 100_000_000) errors.price = 'El precio es demasiado alto.';
  const minutes = Number(form.durationMinutes);
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 1440) {
    errors.durationMinutes = 'La duración debe ser un entero entre 1 y 1440 minutos.';
  }
  return errors;
}

export interface BulkPriceConfig {
  type: 'fixed' | 'percentage';
  action: 'increase' | 'decrease';
  amount: number;
}

/**
 * Nuevo precio (céntimos) para una actualización masiva.
 * @returns null si el resultado no es un precio válido (< 1 céntimo)
 */
export function bulkPriceCents(priceCents: number, config: BulkPriceConfig): number | null {
  const sign = config.action === 'increase' ? 1 : -1;
  const delta = config.type === 'fixed' ? Math.round(config.amount * 100) : Math.round(priceCents * (config.amount / 100));
  const next = priceCents + sign * delta;
  return Number.isInteger(next) && next >= 1 ? next : null;
}
