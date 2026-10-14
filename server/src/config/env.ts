import { z } from 'zod';

// Las variables vacías (p. ej. copiadas de .env.example) se tratan como ausentes.
const emptyToUndefined = (value: unknown): unknown =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

const envSchema = z.object({
  JWT_SECRET: z
    .string({ error: 'JWT_SECRET es obligatorio.' })
    .min(32, 'JWT_SECRET debe tener al menos 32 caracteres.'),
  BCRYPT_COST: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number()
      .int('BCRYPT_COST debe ser un entero.')
      .min(4, 'BCRYPT_COST mínimo 4.')
      .max(15, 'BCRYPT_COST máximo 15.')
      .default(10),
  ),
  CORS_ORIGINS: z.preprocess(emptyToUndefined, z.string().default('')),
  TRUST_PROXY: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number()
      .int('TRUST_PROXY debe ser un entero.')
      .min(0, 'TRUST_PROXY mínimo 0.')
      .max(10, 'TRUST_PROXY máximo 10.')
      .default(0),
  ),
  PORT: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(1).max(65535).default(3000),
  ),
});

export interface Config {
  jwtSecret: string;
  bcryptCost: number;
  corsOrigins: string[];
  /** Saltos de proxy de confianza para obtener req.ip (0 = no confiar en X-Forwarded-For). */
  trustProxy: number;
  port: number;
}

export class ConfigError extends Error {
  constructor(public readonly issues: string[]) {
    super(`Configuración inválida:\n- ${issues.join('\n- ')}`);
    this.name = 'ConfigError';
  }
}

/** Valida las variables de entorno. Lanza ConfigError (sin incluir valores) si algo falla. */
export function loadConfig(env: Record<string, string | undefined> = process.env): Config {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    throw new ConfigError(result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`));
  }
  const data = result.data;
  return {
    jwtSecret: data.JWT_SECRET,
    bcryptCost: data.BCRYPT_COST,
    corsOrigins: data.CORS_ORIGINS.split(',')
      .map((o) => o.trim())
      .filter((o) => o.length > 0),
    trustProxy: data.TRUST_PROXY,
    port: data.PORT,
  };
}
