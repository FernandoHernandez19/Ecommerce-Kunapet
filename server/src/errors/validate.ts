import type { z } from 'zod';
import { ValidationError } from './AppError.js';

/** Valida con zod y convierte el fallo en un ValidationError con detalles por campo. */
export function parseOrThrow<S extends z.ZodType>(schema: S, data: unknown): z.output<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(
      'Datos inválidos.',
      result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    );
  }
  return result.data;
}
