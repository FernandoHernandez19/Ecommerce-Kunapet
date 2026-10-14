import { z } from 'zod';

export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

/** Query de paginación: page ≥ 1 (1 por defecto), limit 1–100 (20 por defecto). */
export const paginationShape = {
  page: z.coerce.number().int('page debe ser un entero.').min(1, 'page debe ser ≥ 1.').default(1),
  limit: z.coerce
    .number()
    .int('limit debe ser un entero.')
    .min(1, 'limit debe ser ≥ 1.')
    .max(MAX_LIMIT, `limit no puede superar ${MAX_LIMIT}.`)
    .default(DEFAULT_LIMIT),
};

export interface PageRequest {
  page: number;
  limit: number;
}

export interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number };
}

export function paginate<T>(all: readonly T[], { page, limit }: PageRequest): Paginated<T> {
  const start = (page - 1) * limit;
  return { data: all.slice(start, start + limit), meta: { page, limit, total: all.length } };
}
