import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/AppError.js';
import { ROLES, type Role } from '../types/user.js';

export const TOKEN_TTL_SECONDS = 60 * 60;
const ALGORITHM = 'HS256' as const;

export interface TokenClaims {
  sub: string;
  role: Role;
}

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

  /** Verifica firma, expiración y algoritmo (solo HS256). Lanza UnauthorizedError si falla. */
  verify(token: string): TokenClaims {
    let payload: string | jwt.JwtPayload;
    try {
      payload = jwt.verify(token, this.secret, { algorithms: [ALGORITHM] });
    } catch {
      throw new UnauthorizedError();
    }
    if (typeof payload === 'string') throw new UnauthorizedError();
    const { sub, role } = payload;
    if (typeof sub !== 'string' || !ROLES.some((r) => r === role)) throw new UnauthorizedError();
    return { sub, role: role as Role };
  }
}
