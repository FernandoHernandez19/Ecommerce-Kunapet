export const ITEM_TYPES = ['product', 'service'] as const;
export type ItemType = (typeof ITEM_TYPES)[number];

export const TARGET_PETS = ['dog', 'cat', 'bird', 'exotic'] as const;
export type TargetPet = (typeof TARGET_PETS)[number];

export interface Item {
  id: string;
  providerId: string;
  type: ItemType;
  title: string;
  description: string;
  category: string;
  priceCents: number;
  currency: 'PEN';
  stock: number | null;
  durationMinutes: number | null;
  location: string | null;
  imageUrl: string | null;
  targetPets: TargetPet[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Datos públicos del proveedor que acompañan a un item. Nunca incluye email ni teléfono. */
export interface ItemProvider {
  id: string;
  name: string;
  avatarUrl: string | null;
}

/** Item tal como lo devuelven GET /items y GET /items/:id. */
export interface PublicItem extends Item {
  provider: ItemProvider;
}
