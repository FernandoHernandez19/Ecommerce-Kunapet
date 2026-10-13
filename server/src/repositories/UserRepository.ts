import { randomUUID } from 'node:crypto';
import { ConflictError } from '../errors/AppError.js';
import type { Role, UserRecord } from '../types/user.js';

export interface NewUser {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  phone: string | null;
}

/** Contrato de persistencia de usuarios. Se podrá reemplazar por una base de datos. */
export interface UserRepository {
  findById(id: string): Promise<UserRecord | null>;
  /** Busca por email ya normalizado (minúsculas). */
  findByEmail(email: string): Promise<UserRecord | null>;
  /** Lanza ConflictError si el email ya existe. */
  create(data: NewUser): Promise<UserRecord>;
}

export class InMemoryUserRepository implements UserRepository {
  private readonly byId = new Map<string, UserRecord>();
  private readonly idByEmail = new Map<string, string>();

  findById(id: string): Promise<UserRecord | null> {
    return Promise.resolve(this.byId.get(id) ?? null);
  }

  findByEmail(email: string): Promise<UserRecord | null> {
    const id = this.idByEmail.get(email);
    return Promise.resolve(id === undefined ? null : (this.byId.get(id) ?? null));
  }

  create(data: NewUser): Promise<UserRecord> {
    if (this.idByEmail.has(data.email)) {
      return Promise.reject(new ConflictError('Ya existe una cuenta con ese correo.'));
    }
    const record: UserRecord = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role,
      phone: data.phone,
      avatarUrl: null,
      createdAt: new Date().toISOString(),
    };
    this.byId.set(record.id, record);
    this.idByEmail.set(record.email, record.id);
    return Promise.resolve(record);
  }
}
