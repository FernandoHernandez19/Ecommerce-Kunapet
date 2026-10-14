import { NotFoundError } from '../errors/AppError.js';
import type { NewPet, PetRepository } from '../repositories/PetRepository.js';
import type { Pet } from '../types/pet.js';
import type { User } from '../types/user.js';
import type { PageRequest, Paginated } from '../utils/pagination.js';

export class PetService {
  constructor(private readonly pets: PetRepository) {}

  list(owner: User, page: PageRequest): Promise<Paginated<Pet>> {
    return this.pets.listByOwner(owner.id, page);
  }

  create(owner: User, input: Omit<NewPet, 'ownerId'>): Promise<Pet> {
    return this.pets.create({ ...input, ownerId: owner.id });
  }

  get(owner: User, id: string): Promise<Pet> {
    return this.getOwned(owner, id);
  }

  async update(owner: User, id: string, changes: Partial<Omit<NewPet, 'ownerId'>>): Promise<Pet> {
    await this.getOwned(owner, id);
    const updated = await this.pets.update(id, changes);
    if (!updated) throw new NotFoundError('Mascota no encontrada.');
    return updated;
  }

  async remove(owner: User, id: string): Promise<void> {
    await this.getOwned(owner, id);
    await this.pets.delete(id);
  }

  /** Mascota del dueño o 404: una ajena no se distingue de una inexistente. */
  private async getOwned(owner: User, id: string): Promise<Pet> {
    const pet = await this.pets.findById(id);
    if (!pet || pet.ownerId !== owner.id) throw new NotFoundError('Mascota no encontrada.');
    return pet;
  }
}
