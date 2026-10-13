import { RateLimitedError } from '../errors/AppError.js';

interface Bucket {
  count: number;
  resetAt: number;
}

const MAX_TRACKED_KEYS = 10_000;

/** Limitador en memoria por clave (IP+email). Cada intento cuenta, acertado o no. */
export class LoginRateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(
    private readonly maxAttempts = 10,
    private readonly windowMs = 15 * 60 * 1000,
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
      throw new RateLimitedError('Demasiados intentos de inicio de sesión. Inténtalo más tarde.');
    }
  }

  private sweep(now: number): void {
    for (const [key, bucket] of this.buckets) {
      if (bucket.resetAt <= now) this.buckets.delete(key);
    }
  }
}
