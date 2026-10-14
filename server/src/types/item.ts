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
