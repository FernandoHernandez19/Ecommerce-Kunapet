import bcrypt from 'bcryptjs';
import { ConflictError } from '../errors/AppError.js';
import type { UserRepository } from '../repositories/UserRepository.js';
import { toPublicUser, type RegistrableRole, type User } from '../types/user.js';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: RegistrableRole;
  phone: string | null;
}

export class AuthService {
  constructor(
    private readonly users: UserRepository,
    private readonly bcryptCost: number,
  ) {}

  async register(input: RegisterInput): Promise<User> {
    // El email llega normalizado desde la validación (minúsculas).
    if (await this.users.findByEmail(input.email)) {
      throw new ConflictError('Ya existe una cuenta con ese correo.');
    }
    const passwordHash = await bcrypt.hash(input.password, this.bcryptCost);
    const record = await this.users.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
      phone: input.phone,
    });
    return toPublicUser(record);
  }
}
