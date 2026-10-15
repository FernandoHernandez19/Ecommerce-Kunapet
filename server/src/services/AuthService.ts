import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { ConflictError, ServiceUnavailableError, UnauthorizedError } from '../errors/AppError.js';
import type { UserRepository } from '../repositories/UserRepository.js';
import { TOKEN_TTL_SECONDS, type TokenService } from './TokenService.js';
import { toPublicUser, type RegistrableRole, type User } from '../types/user.js';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: RegistrableRole;
  phone: string | null;
}

export interface LoginResult {
  user: User;
  token: string;
  expiresIn: number;
}

export const INVALID_CREDENTIALS_MESSAGE = 'Correo o contraseña incorrectos.';

export class AuthService {
  // Hash ficticio con el mismo costo: se compara cuando el email no existe
  // para que el tiempo de respuesta no revele qué correos están registrados.
  private readonly dummyHash: string;

  constructor(
    private readonly users: UserRepository,
    private readonly tokens: TokenService,
    private readonly bcryptCost: number,
    private readonly maxUsers: number,
  ) {
    this.dummyHash = bcrypt.hashSync(randomUUID(), bcryptCost);
  }

  private async assertCapacity(): Promise<void> {
    if ((await this.users.count()) >= this.maxUsers) {
      throw new ServiceUnavailableError('El registro no está disponible por ahora.');
    }
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const record = await this.users.findByEmail(email);
    const valid = await bcrypt.compare(password, record?.passwordHash ?? this.dummyHash);
    if (!record || !valid) {
      throw new UnauthorizedError(INVALID_CREDENTIALS_MESSAGE);
    }
    return {
      user: toPublicUser(record),
      token: this.tokens.sign(record.id, record.role),
      expiresIn: TOKEN_TTL_SECONDS,
    };
  }

  async register(input: RegisterInput): Promise<User> {
    // El email llega normalizado desde la validación (minúsculas).
    if (await this.users.findByEmail(input.email)) {
      throw new ConflictError('Ya existe una cuenta con ese correo.');
    }
    await this.assertCapacity();
    const passwordHash = await bcrypt.hash(input.password, this.bcryptCost);
    // Segunda comprobación: el hash tarda y otras altas pudieron llegar mientras tanto.
    await this.assertCapacity();
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
