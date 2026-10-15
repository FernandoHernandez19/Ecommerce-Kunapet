/**
 * useCartStore — Zustand store del carrito de compras para KunaPet.
 *
 * Gestiona:
 *  - Items del carrito (productos y servicios) con el id real (UUID) del item de la API
 *  - Totales ESTIMADOS (el total válido lo devuelve el servidor al crear el pedido)
 *  - Acciones: addItem, removeItem, updateQuantity, clearCart
 *  - Persistencia en localStorage
 *
 * Los items pueden ser de tipo 'product' (e-commerce) o 'service' (reserva).
 * Cada tipo puede tener metadata diferente (fecha de reserva para servicios).
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { estimateTotals } from '../api/adapters';

// ─── Constantes ───────────────────────────────────────────────────────────────
export const ITEM_TYPES = {
  PRODUCT: 'product',
  SERVICE: 'service',
};

// Cantidad máxima por línea (la API rechaza fuera de 1–20).
export const MAX_QUANTITY = 20;

const clampQuantity = (q) => Math.min(MAX_QUANTITY, Math.max(1, Math.trunc(Number(q) || 1)));

/**
 * Precio unitario en céntimos. Los items guardados antes de conectar la API solo traían
 * `price` en soles; se convierten para poder mostrarlos (el servidor los rechazará
 * si su id ya no existe y se quitarán del carrito).
 */
export const unitCents = (item) =>
  Number.isInteger(item.priceCents) ? item.priceCents : Math.round((Number(item.price) || 0) * 100);

// ─── Store ────────────────────────────────────────────────────────────────────
const useCartStore = create(
  persist(
    (set, get) => ({
      // ── Estado ──────────────────────────────────────────────────────────────
      items: [],          // CartItem: { id, type, title, priceCents, image, provider, quantity }
      isOpen: false,      // Controla si el drawer del carrito está abierto

      // ── ADD ITEM ─────────────────────────────────────────────────────────────
      // Si el item ya existe (mismo id y mismo tipo), incrementa la cantidad (máx. 20)
      addItem: (item) => {
        const { items } = get();
        const quantity = clampQuantity(item.quantity ?? 1);
        const existingIndex = items.findIndex((i) => i.id === item.id && i.type === item.type);

        if (existingIndex >= 0) {
          const updated = [...items];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: clampQuantity(updated[existingIndex].quantity + quantity),
          };
          set({ items: updated });
        } else {
          set({ items: [...items, { ...item, quantity }] });
        }
      },

      // ── REMOVE ITEM ──────────────────────────────────────────────────────────
      removeItem: (itemId, itemType) => {
        set({
          items: get().items.filter((i) => !(i.id === itemId && i.type === itemType)),
        });
      },

      // Quita varios items por id (p. ej. los que el servidor ya no reconoce)
      removeItemsById: (ids) => {
        const drop = new Set(ids);
        set({ items: get().items.filter((i) => !drop.has(i.id)) });
      },

      // ── UPDATE QUANTITY ──────────────────────────────────────────────────────
      updateQuantity: (itemId, itemType, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId, itemType);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === itemId && i.type === itemType ? { ...i, quantity: clampQuantity(quantity) } : i
          ),
        });
      },

      // ── CLEAR CART ───────────────────────────────────────────────────────────
      clearCart: () => set({ items: [] }),

      // ── TOGGLE DRAWER ────────────────────────────────────────────────────────
      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    {
      name:    'kunapet-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

/** Convierte items del carrito en líneas para estimar totales. */
export const toEstimateLines = (items) =>
  items.map((i) => ({ type: i.type, priceCents: unitCents(i), quantity: i.quantity }));

/**
 * Totales ESTIMADOS en céntimos. No sustituyen al total del servidor:
 * el pedido real se calcula en POST /orders.
 */
export const useCartTotals = () => {
  const items = useCartStore((state) => state.items);
  return estimateTotals(toEstimateLines(items));
};

export default useCartStore;
