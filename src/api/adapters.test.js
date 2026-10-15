import { describe, expect, it, vi } from 'vitest';
import { apiItem, apiService } from '../test/helpers';
import {
  ageLabel,
  bulkPriceCents,
  calcAge,
  categoryToSlug,
  centsToSoles,
  editFormToApiPet,
  estimateTotals,
  formatDate,
  formatDateOnly,
  formatDateTime,
  formatMoney,
  orderStatusLabel,
  orderTrackingStep,
  solesToCents,
  speciesToUi,
  toApiItemInput,
  toUiItem,
  toUiOrder,
  toUiPet,
  validateServiceForm,
  wizardToApiPet,
} from './adapters';
import { findOffendingItemId } from './orders';
import { runSequentially } from './bulk';

describe('dinero', () => {
  it('formatMoney: céntimos → "S/ 62.00"', () => {
    expect(formatMoney(6200)).toBe('S/ 62.00');
    expect(formatMoney(0)).toBe('S/ 0.00');
    expect(formatMoney(5)).toBe('S/ 0.05');
    expect(formatMoney(14550)).toBe('S/ 145.50');
    expect(formatMoney(123456)).toBe('S/ 1,234.56');
    expect(formatMoney(undefined)).toBe('S/ 0.00');
  });

  it('solesToCents: sin errores de punto flotante y rechaza valores inválidos', () => {
    expect(solesToCents('62')).toBe(6200);
    expect(solesToCents('19.99')).toBe(1999);
    expect(solesToCents(0.1 + 0.2)).toBe(30);
    expect(solesToCents('1,5')).toBe(150);
    expect(solesToCents(145.5)).toBe(14550);
    expect(solesToCents('')).toBeNull();
    expect(solesToCents('abc')).toBeNull();
    expect(solesToCents(-1)).toBeNull();
    expect(centsToSoles(14550)).toBe(145.5);
  });
});

describe('fechas', () => {
  it('formatDate / formatDateTime usan la hora de Lima (UTC-5)', () => {
    expect(formatDate('2025-06-29T19:00:00.000Z')).toBe('29 jun 2025');
    expect(formatDateTime('2025-06-29T19:00:00.000Z')).toBe('29 jun 2025, 14:00');
    // 02:00 UTC del día 30 es todavía el 29 en Lima
    expect(formatDate('2025-06-30T02:00:00.000Z')).toBe('29 jun 2025');
    expect(formatDate('no es fecha')).toBe('');
  });

  it('formatDateOnly no corre el día por zona horaria', () => {
    expect(formatDateOnly('2022-03-15')).toBe('15 mar 2022');
    expect(formatDateOnly('')).toBe('');
    expect(formatDateOnly(null)).toBe('');
  });
});

describe('edad calculada desde birthDate', () => {
  const now = new Date(2026, 5, 15); // 15 jun 2026
  it('cuenta años cumplidos', () => {
    expect(calcAge('2022-03-15', now)).toBe(4);
    expect(calcAge('2022-06-15', now)).toBe(4); // cumple hoy
    expect(calcAge('2022-06-16', now)).toBe(3); // cumple mañana
    expect(calcAge('2026-01-01', now)).toBe(0);
    expect(calcAge('', now)).toBeNull();
    expect(calcAge('2030-01-01', now)).toBeNull();
  });
  it('ageLabel', () => {
    expect(ageLabel('2022-03-15', now)).toBe('4 años');
    expect(ageLabel('2025-06-01', now)).toBe('1 año');
    expect(ageLabel('2026-02-01', now)).toBe('Menos de 1 año');
    expect(ageLabel(null, now)).toBe('Edad no registrada');
  });
});

describe('items', () => {
  it('categoryToSlug quita tildes y espacios', () => {
    expect(categoryToSlug('Veterinaria')).toBe('veterinaria');
    expect(categoryToSlug('Exótico')).toBe('exotico');
    expect(categoryToSlug(' Baño y Corte ')).toBe('bano-y-corte');
    expect(categoryToSlug('')).toBe('');
  });

  it('toUiItem: producto', () => {
    const ui = toUiItem(apiItem());
    expect(ui).toMatchObject({
      type: 'product', category: 'Alimentos', categorySlug: 'alimentos', priceCents: 14550, price: 145.5,
      priceText: 'S/ 145.50', targetLabel: 'Perro', image: null,
      provider: { id: 'prov-1', name: 'PetShop Central', avatar: null },
    });
    expect(ui.features).toEqual([{ id: 1, label: '10 en stock', type: 'activity' }]);
  });

  it('toUiItem: servicio, y lo que la API no tiene queda en null (sin inventar)', () => {
    const ui = toUiItem(apiService());
    expect(ui.category).toBe('Servicio • Grooming');
    expect(ui.duration).toBe('90 min');
    expect(ui.features[0]).toEqual({ id: 1, label: '90 min', type: 'duration' });
    expect(ui.icon).toBe('🚿');
    expect(ui.iconBg).toBe('bg-amber-100');
    expect([ui.rating, ui.reviewCount, ui.badge, ui.distance, ui.originalPrice]).toEqual([null, null, null, null, null]);
  });

  it('toUiItem: categoría desconocida usa icono por defecto', () => {
    const ui = toUiItem(apiItem({ category: 'peceras' }));
    expect(ui.categoryLabel).toBe('Peceras');
    expect(ui.icon).toBe('🐾');
  });

  it('toApiItemInput: soles → céntimos y slug de categoría', () => {
    expect(toApiItemInput({ type: 'service', title: ' Paseo ', description: 'x', category: 'Paseos', price: '25.50', durationMinutes: '60' })).toEqual({
      type: 'service', title: 'Paseo', description: 'x', category: 'paseos', priceCents: 2550, durationMinutes: 60,
    });
  });

  it('validateServiceForm refleja las reglas del servidor', () => {
    const ok = { title: 'Paseo', description: 'd', category: 'Paseos', price: '25.00', durationMinutes: '60' };
    expect(validateServiceForm(ok)).toEqual({});
    expect(Object.keys(validateServiceForm({ ...ok, title: 'a' }))).toEqual(['title']);
    expect(validateServiceForm({ ...ok, price: '0' }).price).toBeDefined();
    expect(validateServiceForm({ ...ok, price: '10.999' }).price).toMatch(/2 decimales/);
    expect(validateServiceForm({ ...ok, price: '' }).price).toBeDefined();
    expect(validateServiceForm({ ...ok, durationMinutes: '0' }).durationMinutes).toBeDefined();
    expect(validateServiceForm({ ...ok, durationMinutes: '1.5' }).durationMinutes).toBeDefined();
    expect(validateServiceForm({ ...ok, description: ' ' }).description).toBeDefined();
  });

  it('bulkPriceCents: fijo y porcentaje, nunca por debajo de 1 céntimo', () => {
    expect(bulkPriceCents(2500, { type: 'percentage', action: 'increase', amount: 10 })).toBe(2750);
    expect(bulkPriceCents(2500, { type: 'fixed', action: 'decrease', amount: 5 })).toBe(2000);
    expect(bulkPriceCents(2500, { type: 'fixed', action: 'decrease', amount: 25 })).toBeNull();
    expect(bulkPriceCents(2500, { type: 'percentage', action: 'decrease', amount: 100 })).toBeNull();
  });
});

describe('mascotas', () => {
  const apiPet = {
    id: 'p1', ownerId: 'u1', name: 'Luna', species: 'dog', breed: 'Golden Retriever', gender: 'female',
    birthDate: '2022-03-15', weightGrams: 28000, notes: 'Alergias: trigo', photoUrl: null,
    createdAt: '2025-01-10T10:00:00.000Z', updatedAt: '2025-01-10T10:00:00.000Z',
  };

  it('toUiPet: especie, género y edad calculada', () => {
    const ui = toUiPet(apiPet, new Date(2026, 5, 15));
    expect(ui).toMatchObject({
      species: 'dog', speciesLabel: 'Perro', gender: 'Hembra', genderApi: 'female', age: 4, ageLabel: '4 años',
      birthdate: '2022-03-15', birthdateLabel: '15 mar 2022', vaccines: [], vaccineStatus: null, notes: 'Alergias: trigo',
    });
  });

  it('toUiPet: valores ausentes', () => {
    const ui = toUiPet({ ...apiPet, species: 'exotic', breed: null, gender: null, birthDate: null, notes: null });
    expect(ui).toMatchObject({ species: 'other', speciesApi: 'exotic', speciesLabel: 'Exótico', breed: 'Raza no especificada', gender: 'Sin especificar', ageLabel: 'Edad no registrada', notes: '' });
    expect(speciesToUi('cat')).toBe('cat');
    expect(speciesToUi('bird')).toBe('other');
  });

  it('wizardToApiPet: especie, peso en gramos y alergias dentro de notes', () => {
    const body = wizardToApiPet({
      name: ' Rex ', species: 'perro', breed: 'Mestizo', dob: '2021-05-01', weight: '12,5', isSterilized: true,
      vaccines: ['Antirrábica'], allergies: 'Pollo', specialNeeds: 'Medicación a las 8pm',
    });
    expect(body).toEqual({
      name: 'Rex', species: 'dog', breed: 'Mestizo', birthDate: '2021-05-01', weightGrams: 12500,
      notes: 'Alergias: Pollo\nNecesidades especiales: Medicación a las 8pm\nEsterilizado: Sí',
    });
    expect(body).not.toHaveProperty('vaccines');
  });

  it('wizardToApiPet: omite lo vacío, "Ninguna" y respeta el máximo de notes', () => {
    const minimal = wizardToApiPet({ name: 'Mia', species: 'gato', breed: '', dob: '', weight: '', allergies: 'Ninguna', specialNeeds: '' });
    expect(minimal).toEqual({ name: 'Mia', species: 'cat' });
    const long = wizardToApiPet({ name: 'X', species: 'otro', allergies: 'a'.repeat(400), specialNeeds: 'b'.repeat(400) });
    expect(long.notes.length).toBeLessThanOrEqual(500);
  });

  it('editFormToApiPet: vacíos → null', () => {
    expect(editFormToApiPet({ name: ' Luna ', species: 'dog', breed: '', gender: 'female', birthdate: '', notes: '  ' })).toEqual({
      name: 'Luna', species: 'dog', breed: null, gender: 'female', birthDate: null, notes: null,
    });
  });
});

describe('pedidos', () => {
  const apiOrder = {
    id: '9a8b7c6d-5e4f-4a3b-9c2d-1e0f9a8b7c6d', clientId: 'c1', status: 'pending_payment', paymentMethod: 'yape',
    items: [
      { itemId: 'i1', title: 'Alimento', type: 'product', unitPriceCents: 14550, quantity: 2, lineTotalCents: 29100 },
      { itemId: 'i2', title: 'Baño', type: 'service', unitPriceCents: 4500, quantity: 1, lineTotalCents: 4500 },
    ],
    subtotalCents: 33600, shippingCents: 1500, platformFeeCents: 250, totalCents: 35350, currency: 'PEN',
    createdAt: '2025-06-29T19:00:00.000Z', updatedAt: '2025-06-29T19:00:00.000Z',
  };

  it('estimateTotals replica las reglas del contrato', () => {
    expect(estimateTotals([{ type: 'service', priceCents: 4500, quantity: 2 }])).toEqual({ subtotalCents: 9000, shippingCents: 0, platformFeeCents: 250, totalCents: 9250 });
    expect(estimateTotals([{ type: 'product', priceCents: 14550, quantity: 2 }])).toEqual({ subtotalCents: 29100, shippingCents: 1500, platformFeeCents: 250, totalCents: 30850 });
    expect(estimateTotals([])).toEqual({ subtotalCents: 0, shippingCents: 0, platformFeeCents: 0, totalCents: 0 });
  });

  it('estado → etiqueta y paso de seguimiento', () => {
    expect([orderStatusLabel('pending_payment'), orderTrackingStep('pending_payment')]).toEqual(['Pago pendiente', 0]);
    expect([orderStatusLabel('preparing'), orderTrackingStep('preparing')]).toEqual(['Preparando', 1]);
    expect([orderStatusLabel('shipping'), orderTrackingStep('shipping')]).toEqual(['En camino', 2]);
    expect([orderStatusLabel('delivered'), orderTrackingStep('delivered')]).toEqual(['Entregado', 3]);
    expect(orderStatusLabel('cancelled')).toBe('Cancelado');
  });

  it('toUiOrder: totales, fecha y resumen del primer item', () => {
    const ui = toUiOrder(apiOrder);
    expect(ui).toMatchObject({
      shortId: '#9A8B7C6D', product: 'Alimento y 1 más', date: '29 jun 2025', dateTime: '29 jun 2025, 14:00',
      cost: 'S/ 353.50', statusLabel: 'Pago pendiente', paymentLabel: 'Yape', trackingStep: 0,
    });
    expect(ui.totals).toEqual({ subtotal: 'S/ 336.00', shipping: 'S/ 15.00', platformFee: 'S/ 2.50', total: 'S/ 353.50' });
    expect(ui.lines[0]).toMatchObject({ unitPrice: 'S/ 145.50', lineTotal: 'S/ 291.00', quantity: 2 });
  });

  it('findOffendingItemId: por posición (400/422) o por id en el mensaje (404)', () => {
    const lines = [{ itemId: 'aaa' }, { itemId: 'srv-1-2025-06-29-10:00' }];
    expect(findOffendingItemId({ code: 'unprocessable_entity', details: [{ path: 'items.0.itemId' }] }, lines)).toBe('aaa');
    expect(findOffendingItemId({ code: 'validation_error', details: [{ path: 'items.1.itemId', message: 'x' }] }, lines)).toBe('srv-1-2025-06-29-10:00');
    expect(findOffendingItemId({ code: 'not_found', message: 'El item srv-1-2025-06-29-10:00 no existe.' }, lines)).toBe('srv-1-2025-06-29-10:00');
    expect(findOffendingItemId({ code: 'not_found', message: 'otra cosa' }, lines)).toBeNull();
    expect(findOffendingItemId({ code: 'internal_error', message: 'aaa' }, lines)).toBeNull();
    expect(findOffendingItemId(null, lines)).toBeNull();
  });
});

describe('runSequentially', () => {
  it('procesa en orden, reporta errores parciales y sigue con el resto', async () => {
    const order = [];
    const { ok, failed } = await runSequentially(['a', 'b', 'c'], async (id) => {
      order.push(id);
      if (id === 'b') throw Object.assign(new Error('x'), { code: 'internal_error' });
      return id.toUpperCase();
    });
    expect(order).toEqual(['a', 'b', 'c']);
    expect(ok).toEqual([{ id: 'a', value: 'A' }, { id: 'c', value: 'C' }]);
    expect(failed.map((f) => f.id)).toEqual(['b']);
  });

  it('no hay dos llamadas simultáneas', async () => {
    let running = 0;
    let maxRunning = 0;
    await runSequentially(['1', '2', '3'], async () => {
      running += 1;
      maxRunning = Math.max(maxRunning, running);
      await new Promise((r) => setTimeout(r, 1));
      running -= 1;
    });
    expect(maxRunning).toBe(1);
  });

  it('una sesión vencida (unauthorized) detiene el resto', async () => {
    const worker = vi.fn(async () => { throw Object.assign(new Error('x'), { code: 'unauthorized' }); });
    const { ok, failed } = await runSequentially(['a', 'b', 'c'], worker);
    expect(worker).toHaveBeenCalledTimes(1);
    expect(ok).toEqual([]);
    expect(failed.map((f) => f.id)).toEqual(['a', 'b', 'c']);
  });
});
