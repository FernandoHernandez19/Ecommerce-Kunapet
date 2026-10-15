import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CartItem } from './useCartStore';

// El store se hidrata desde localStorage al importarse: se reimporta en cada prueba.
async function loadCart() {
  vi.resetModules();
  return import('./useCartStore');
}

const STORAGE_KEY = 'kunapet-cart';
const product = { id: 'a1', type: 'product', title: 'Alimento', priceCents: 14550, provider: 'PetShop' } as const;

describe('useCartStore', () => {
  beforeEach(() => localStorage.clear());

  it('agrega, suma cantidades del mismo item y limita a 20', async () => {
    const { default: useCartStore } = await loadCart();
    const { addItem } = useCartStore.getState();
    addItem(product);
    addItem({ ...product, quantity: 3 });
    expect(useCartStore.getState().items).toEqual([expect.objectContaining({ id: 'a1', quantity: 4 })]);
    addItem({ ...product, quantity: 50 });
    expect(useCartStore.getState().items[0]?.quantity).toBe(20);
    addItem({ ...product, type: 'service' }); // mismo id, otro tipo → otra línea
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it('updateQuantity limita 1–20 y quita la línea con cantidad ≤ 0', async () => {
    const { default: useCartStore } = await loadCart();
    useCartStore.getState().addItem(product);
    useCartStore.getState().updateQuantity('a1', 'product', 99);
    expect(useCartStore.getState().items[0]?.quantity).toBe(20);
    useCartStore.getState().updateQuantity('a1', 'product', 0);
    expect(useCartStore.getState().items).toEqual([]);
  });

  it('removeItemsById quita varias líneas a la vez', async () => {
    const { default: useCartStore } = await loadCart();
    useCartStore.getState().addItem(product);
    useCartStore.getState().addItem({ ...product, id: 'b2' });
    useCartStore.getState().removeItemsById(['a1']);
    expect(useCartStore.getState().items.map((i: CartItem) => i.id)).toEqual(['b2']);
  });

  it('persiste SOLO items (no isOpen)', async () => {
    const { default: useCartStore } = await loadCart();
    useCartStore.getState().addItem(product);
    useCartStore.getState().openCart();
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    expect(saved).toMatchObject({ state: { items: [expect.objectContaining({ id: 'a1' })] } });
    expect(JSON.stringify(saved)).not.toContain('isOpen');
  });

  it('rehidrata carritos antiguos: convierte provider objeto y descarta items inválidos', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        state: {
          items: [
            { id: 'old-1', type: 'service', title: 'Paseo', price: 25, quantity: 1, provider: { name: 'Carlos', id: 'x' }, bookingDate: '2025-06-29' },
            { id: 'a1', type: 'product', title: 'Alimento', priceCents: 14550, quantity: 2 },
            { id: 'roto', type: 'otro', title: 'X', quantity: 1 },
            { id: 'sin-cantidad', type: 'product', title: 'Y' },
            'basura',
            null,
          ],
        },
        version: 0,
      }),
    );
    const { default: useCartStore, unitCents } = await loadCart();
    const items = useCartStore.getState().items;
    expect(items.map((i) => i.id)).toEqual(['old-1', 'a1']);
    expect(items[0]).toMatchObject({ provider: 'Carlos', price: 25 });
    expect(items[0]).not.toHaveProperty('bookingDate');
    expect(unitCents(items[0] ?? { price: 0 })).toBe(2500);
  });

  it('datos corruptos en localStorage no rompen el carrito', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { items: 'no es una lista' }, version: 0 }));
    const { default: useCartStore } = await loadCart();
    expect(useCartStore.getState().items).toEqual([]);
  });

  it('useCartTotals calcula la estimación desde el carrito', async () => {
    const { default: useCartStore, toEstimateLines } = await loadCart();
    useCartStore.getState().addItem({ ...product, quantity: 2 });
    expect(toEstimateLines(useCartStore.getState().items)).toEqual([{ type: 'product', priceCents: 14550, quantity: 2 }]);
  });
});
