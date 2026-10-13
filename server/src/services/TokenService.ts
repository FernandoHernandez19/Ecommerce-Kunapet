import jwt from 'jsonwebtoken';
import type { Role } from '../types/user.js';

export const TOKEN_TTL_SECONDS = 60 * 60;
const ALGORITHM = 'HS256' as const;

export class TokenService {
  constructor(private readonly secret: string) {}

  /** Firma un JWT HS256 con payload { sub, role } y expiración de 1 h. */
  sign(userId: string, role: Role): string {
    return jwt.sign({ role }, this.secret, {
      algorithm: ALGORITHM,
      subject: userId,
      expiresIn: TOKEN_TTL_SECONDS,
    });
  }
}
