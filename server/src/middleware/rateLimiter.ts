import { RateLimitedError } from '../errors/AppError.js';

interface Bucket {
  count: number;
  resetAt: number;
}

const MAX_TRACKED_KEYS = 10_000;

/** Limitador en memoria por clave (p. ej. IP+email). Cada intento cuenta, acertado o no. */
export class RateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(
    private readonly maxAttempts: number,
    private readonly windowMs: number,
    private readonly message: string,
  ) {}

  /** Registra un intento; lanza RateLimitedError si se superó el máximo en la ventana. */
  hit(key: string): void {
    const now = Date.now();
    if (this.buckets.size >= MAX_TRACKED_KEYS) this.sweep(now);

    const current = this.buckets.get(key);
    if (!current || current.resetAt <= now) {
      this.buckets.set(key, { count: 1, resetAt: now + this.windowMs });
      return;
    }
    current.count += 1;
    if (current.count > this.maxAttempts) {
      throw new RateLimitedError(this.message);
    }
  }

  private sweep(now: number): void {
    for (const [key, bucket] of this.buckets) {
      if (bucket.resetAt <= now) this.buckets.delete(key);
    }
  }
}

/** Login: 10 intentos por IP+email cada 15 minutos. */
export const createLoginLimiter = (): RateLimiter =>
  new RateLimiter(10, 15 * 60 * 1000, 'Demasiados intentos de inicio de sesión. Inténtalo más tarde.');

/** Registro público: 10 registros por IP cada hora. */
export const createRegisterLimiter = (): RateLimiter =>
  new RateLimiter(10, 60 * 60 * 1000, 'Demasiados registros desde esta dirección. Inténtalo más tarde.');
