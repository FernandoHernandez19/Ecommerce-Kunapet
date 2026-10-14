import type { RequestHandler } from 'express';
import { z } from 'zod';
import { ValidationError } from '../errors/AppError.js';
import { parseOrThrow } from '../errors/validate.js';
import type { CatalogService } from '../services/CatalogService.js';
import { ITEM_TYPES } from '../types/item.js';
import { paginationShape } from '../utils/pagination.js';

const cents = (name: string) => z.coerce.number().int(`${name} debe ser un entero.`).min(0, `${name} debe ser ≥ 0.`);

export const listItemsQuery = z
  .object({
    type: z.enum(ITEM_TYPES, { error: 'type debe ser product o service.' }).optional(),
    category: z.string().trim().min(1).max(60).optional(),
    q: z.string().trim().min(1).max(100).optional(),
    minPriceCents: cents('minPriceCents').optional(),
    maxPriceCents: cents('maxPriceCents').optional(),
    ...paginationShape,
  })
  .refine(
    (v) => v.minPriceCents === undefined || v.maxPriceCents === undefined || v.minPriceCents <= v.maxPriceCents,
    { message: 'minPriceCents no puede superar maxPriceCents.', path: ['minPriceCents'] },
  );

export function createItemController(catalog: CatalogService): { list: RequestHandler; get: RequestHandler } {
  return {
    list: async (req, res) => {
      const { page, limit, ...filter } = parseOrThrow(listItemsQuery, req.query);
      const cleaned = Object.fromEntries(Object.entries(filter).filter(([, v]) => v !== undefined));
      res.json(await catalog.list(cleaned, { page, limit }, req.user));
    },
    get: async (req, res) => {
      const id = req.params['id'];
      if (typeof id !== 'string') throw new ValidationError();
      res.json({ data: await catalog.get(id, req.user) });
    },
  };
}
