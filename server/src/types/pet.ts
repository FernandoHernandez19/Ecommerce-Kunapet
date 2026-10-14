export const SPECIES = ['dog', 'cat', 'bird', 'exotic', 'other'] as const;
export type Species = (typeof SPECIES)[number];

export const GENDERS = ['female', 'male', 'unknown'] as const;
export type Gender = (typeof GENDERS)[number];

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: Species;
  breed: string | null;
  gender: Gender | null;
  /** YYYY-MM-DD. La edad se calcula en el cliente, no se guarda. */
  birthDate: string | null;
  weightGrams: number | null;
  notes: string | null;
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
