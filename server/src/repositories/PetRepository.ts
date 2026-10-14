import { randomUUID } from 'node:crypto';
import type { Pet } from '../types/pet.js';
import { paginate, type PageRequest, type Paginated } from '../utils/pagination.js';

export type NewPet = Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>;

export interface PetRepository {
  findById(id: string): Promise<Pet | null>;
  listByOwner(ownerId: string, page: PageRequest): Promise<Paginated<Pet>>;
  create(data: NewPet): Promise<Pet>;
  update(id: string, changes: Partial<Omit<NewPet, 'ownerId'>>): Promise<Pet | null>;
  delete(id: string): Promise<boolean>;
}

export class InMemoryPetRepository implements PetRepository {
  private readonly pets = new Map<string, Pet>();

  findById(id: string): Promise<Pet | null> {
    return Promise.resolve(this.pets.get(id) ?? null);
  }

  listByOwner(ownerId: string, page: PageRequest): Promise<Paginated<Pet>> {
    const own = [...this.pets.values()]
      .filter((p) => p.ownerId === ownerId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id));
    return Promise.resolve(paginate(own, page));
  }

  create(data: NewPet): Promise<Pet> {
    const now = new Date().toISOString();
    const pet: Pet = { ...data, id: randomUUID(), createdAt: now, updatedAt: now };
    this.pets.set(pet.id, pet);
    return Promise.resolve(pet);
  }

  update(id: string, changes: Partial<Omit<NewPet, 'ownerId'>>): Promise<Pet | null> {
    const current = this.pets.get(id);
    if (!current) return Promise.resolve(null);
    const updated: Pet = { ...current, ...changes, updatedAt: new Date().toISOString() };
    this.pets.set(id, updated);
    return Promise.resolve(updated);
  }

  delete(id: string): Promise<boolean> {
    return Promise.resolve(this.pets.delete(id));
  }
}
