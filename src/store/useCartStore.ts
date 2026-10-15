/**
 * useCartStore — Zustand store del carrito de compras para KunaPet.
 *
 * Gestiona:
 *  - Items del carrito (productos y servicios) con el id real (UUID) del item de la API
 *  - Totales ESTIMADOS (el total válido lo devuelve el servidor al crear el pedido)
 *  - Acciones: addItem, removeItem, updateQuantity, clearCart
 *  - Persistencia en localStorage (solo `items`), validada con zod al rehidratar
 *
 * Los items pueden ser de tipo 'product' (e-commerce) o 'service' (reserva).
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { z } from 'zod';
import { estimateTotals, type EstimateLine, type Totals } from '../api/adapters';
import type { ItemType } from '@/types/api';

// ─── Constantes ───────────────────────────────────────────────────────────────
export const ITEM_TYPES = {
  PRODUCT: 'product',
  SERVICE: 'service',
} as const satisfies Record<string, ItemType>;

// Cantidad máxima por línea (la API rechaza fuera de 1–20).
export const MAX_QUANTITY = 20;

const clampQuantity = (q: number): number => Math.min(MAX_QUANTITY, Math.max(1, Math.trunc(Number(q) || 1)));

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface CartItem {
  /** Id real (UUID) del item en la API. */
  id: string;
  type: ItemType;
  title: string;
  /** Precio unitario en céntimos. Los items guardados antes de conectar la API solo traían `price`. */
  priceCents?: number;
  /** Precio en soles de items antiguos (solo lectura; ver unitCents). */
  price?: number;
  image?: string | null;
  provider?: string;
  quantity: number;
}

export type NewCartItem = Omit<CartItem, 'quantity'> & { quantity?: number };

/**
 * Lo que se acepta al rehidratar el carrito desde localStorage. Es deliberadamente
 * tolerante con carritos antiguos (provider como objeto, campos extra de reservas) y
 * descarta lo que no tenga la forma mínima.
 */
const persistedItemSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['product', 'service']),
  title: z.string(),
  priceCents: z.number().int().optional(),
  price: z.number().optional(),
  image: z.string().nullable().optional(),
  provider: z.union([z.string(), z.object({ name: z.string() })]).optional(),
  quantity: z.number().int().min(1),
});
const persistedCartSchema = z.object({ items: z.array(z.unknown()) });

/** Precio unitario en céntimos (convierte los items antiguos que solo tenían soles). */
export const unitCents = (item: Pick<CartItem, 'priceCents' | 'price'>): number =>
  item.priceCents !== undefined && Number.isInteger(item.priceCents) ? item.priceCents : Math.round((Number(item.price) || 0) * 100);

interface CartState {
  items: CartItem[];
  /** Controla si el drawer del carrito está abierto. */
  isOpen: boolean;
}

interface CartActions {
  /** Si el item ya existe (mismo id y tipo) incrementa la cantidad (máx. 20). */
  addItem: (item: NewCartItem) => void;
  removeItem: (itemId: string, itemType: ItemType) => void;
  /** Quita varios items por id (p. ej. los que el servidor ya no reconoce). */
  removeItemsById: (ids: readonly string[]) => void;
  updateQuantity: (itemId: string, itemType: ItemType, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export type CartStore = CartState & CartActions;

/** Lo único que se guarda en localStorage. */
interface PersistedCart {
  items: CartItem[];
}

// ─── Store ────────────────────────────────────────────────────────────────────
const useCartStore = create<CartStore>()(
  persist<CartStore, [], [], PersistedCart>(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const { items } = get();
        const quantity = clampQuantity(item.quantity ?? 1);
        const existingIndex = items.findIndex((i) => i.id === item.id && i.type === item.type);

        const existing = items[existingIndex];
        if (existing) {
          const updated = [...items];
          updated[existingIndex] = { ...existing, quantity: clampQuantity(existing.quantity + quantity) };
          set({ items: updated });
        } else {
          set({ items: [...items, { ...item, quantity }] });
        }
      },

      removeItem: (itemId, itemType) => {
        set({ items: get().items.filter((i) => !(i.id === itemId && i.type === itemType)) });
      },

      removeItemsById: (ids) => {
        const drop = new Set(ids);
        set({ items: get().items.filter((i) => !drop.has(i.id)) });
      },

      updateQuantity: (itemId, itemType, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId, itemType);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === itemId && i.type === itemType ? { ...i, quantity: clampQuantity(quantity) } : i,
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    {
      name: 'kunapet-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state): PersistedCart => ({ items: state.items }),
      // El contenido de localStorage no es de fiar: se valida y se descartan los items inválidos.
      merge: (persisted, current) => {
        const parsed = persistedCartSchema.safeParse(persisted);
        if (!parsed.success) return current;
        const items: CartItem[] = [];
        for (const raw of parsed.data.items) {
          const item = persistedItemSchema.safeParse(raw);
          if (!item.success) continue;
          const { provider, ...rest } = item.data;
          items.push({ ...rest, ...(provider !== undefined ? { provider: typeof provider === 'string' ? provider : provider.name } : {}) });
        }
        return { ...current, items };
      },
    },
  ),
);

/** Convierte items del carrito en líneas para estimar totales. */
export const toEstimateLines = (items: readonly CartItem[]): EstimateLine[] =>
  items.map((i) => ({ type: i.type, priceCents: unitCents(i), quantity: i.quantity }));

/**
 * Totales ESTIMADOS en céntimos. No sustituyen al total del servidor:
 * el pedido real se calcula en POST /orders.
 */
export const useCartTotals = (): Totals => {
  const items = useCartStore((state) => state.items);
  return estimateTotals(toEstimateLines(items));
};

export default useCartStore;
