/**
 * useCartStore — Zustand store del carrito de compras para KunaPet.
 *
 * Gestiona:
 *  - Items del carrito (productos y servicios)
 *  - Totales calculados automáticamente
 *  - Acciones: addItem, removeItem, updateQuantity, clearCart
 *  - Persistencia en localStorage
 *
 * Los items pueden ser de tipo 'product' (e-commerce) o 'service' (reserva).
 * Cada tipo puede tener metadata diferente (fecha de reserva para servicios).
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ─── Constantes ───────────────────────────────────────────────────────────────
export const ITEM_TYPES = {
  PRODUCT: 'product',
  SERVICE: 'service',
};

// Fee de plataforma: 2.5 soles fijos por pedido (ajustar cuando venga del backend)
const PLATFORM_FEE = 2.50;
const SHIPPING_FEE = 15.00; // Solo aplica si hay productos físicos

// ─── Store ────────────────────────────────────────────────────────────────────
const useCartStore = create(
  persist(
    (set, get) => ({
      // ── Estado ──────────────────────────────────────────────────────────────
      items: [],          // Array de CartItem
      isOpen: false,      // Controla si el drawer del carrito está abierto

      // ── ADD ITEM ─────────────────────────────────────────────────────────────
      // Si el item ya existe (mismo id y mismo tipo), incrementa la cantidad
      addItem: (item) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          (i) => i.id === item.id && i.type === item.type
        );

        if (existingIndex >= 0) {
          // Incrementar cantidad del existente
          const updated = [...items];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + (item.quantity ?? 1),
          };
          set({ items: updated });
        } else {
          // Agregar nuevo item
          set({
            items: [...items, { ...item, quantity: item.quantity ?? 1 }],
          });
        }
      },

      // ── REMOVE ITEM ──────────────────────────────────────────────────────────
      removeItem: (itemId, itemType) => {
        set({
          items: get().items.filter(
            (i) => !(i.id === itemId && i.type === itemType)
          ),
        });
      },

      // ── UPDATE QUANTITY ──────────────────────────────────────────────────────
      updateQuantity: (itemId, itemType, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId, itemType);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === itemId && i.type === itemType ? { ...i, quantity } : i
          ),
        });
      },

      // ── CLEAR CART ───────────────────────────────────────────────────────────
      clearCart: () => set({ items: [] }),

      // ── TOGGLE DRAWER ────────────────────────────────────────────────────────
      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      // Los totales se calculan a través del hook useCartTotals fuera del store
    }),
    {
      name:    'kunapet-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export const useCartTotals = () => {
  const items = useCartStore((state) => state.items);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const hasPhysicalProducts = items.some((i) => i.type === ITEM_TYPES.PRODUCT);
  const shipping = hasPhysicalProducts ? SHIPPING_FEE : 0;
  const platformFee = subtotal > 0 ? PLATFORM_FEE : 0;
  
  return {
    subtotal,
    shipping,
    platformFee,
    total: subtotal + shipping + platformFee
  };
};

export default useCartStore;
