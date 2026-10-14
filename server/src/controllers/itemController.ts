import type { RequestHandler } from 'express';
import { z } from 'zod';
import { UnauthorizedError, ValidationError } from '../errors/AppError.js';
import { parseOrThrow } from '../errors/validate.js';
import type { CatalogService } from '../services/CatalogService.js';
import { ITEM_TYPES, TARGET_PETS } from '../types/item.js';
import type { User } from '../types/user.js';
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

const itemFields = {
  title: z.string().trim().min(2, 'El título debe tener al menos 2 caracteres.').max(120, 'Título demasiado largo.'),
  description: z.string().trim().min(1, 'La descripción es obligatoria.').max(2000, 'Descripción demasiado larga.'),
  category: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]{2,40}$/, 'La categoría debe ser un slug (letras, números y guiones).'),
  // Entero positivo en céntimos: nada de decimales ni gratis.
  priceCents: z
    .number({ error: 'priceCents debe ser un número.' })
    .int('priceCents debe ser un entero (céntimos).')
    .min(1, 'priceCents debe ser mayor que 0.')
    .max(100_000_000, 'priceCents demasiado alto.'),
  stock: z.number().int('stock debe ser un entero.').min(0).max(1_000_000).nullable(),
  durationMinutes: z.number().int('durationMinutes debe ser un entero.').min(1).max(1440).nullable(),
  location: z.string().trim().max(200, 'Ubicación demasiado larga.').nullable(),
  imageUrl: z
    .url({ protocol: /^https?$/, error: 'imageUrl debe ser una URL http(s).' })
    .max(500, 'imageUrl demasiado larga.')
    .nullable(),
  targetPets: z.array(z.enum(TARGET_PETS, { error: 'Mascota objetivo inválida.' })).max(TARGET_PETS.length),
};

export const createItemSchema = z
  .strictObject({
    type: z.enum(ITEM_TYPES, { error: 'type debe ser product o service.' }),
    title: itemFields.title,
    description: itemFields.description,
    category: itemFields.category,
    priceCents: itemFields.priceCents,
    stock: itemFields.stock.optional(),
    durationMinutes: itemFields.durationMinutes.optional(),
    location: itemFields.location.optional(),
    imageUrl: itemFields.imageUrl.optional(),
    targetPets: itemFields.targetPets.optional(),
  })
  .superRefine((v, ctx) => {
    if (v.type === 'service') {
      if (v.durationMinutes == null) {
        ctx.addIssue({ code: 'custom', path: ['durationMinutes'], message: 'durationMinutes es obligatorio en servicios.' });
      }
      if (v.stock != null) ctx.addIssue({ code: 'custom', path: ['stock'], message: 'Un servicio no tiene stock.' });
    } else {
      if (v.stock == null) ctx.addIssue({ code: 'custom', path: ['stock'], message: 'stock es obligatorio en productos.' });
      if (v.durationMinutes != null) {
        ctx.addIssue({ code: 'custom', path: ['durationMinutes'], message: 'Un producto no tiene duración.' });
      }
    }
  })
  .transform((v) => ({
    type: v.type,
    title: v.title,
    description: v.description,
    category: v.category,
    priceCents: v.priceCents,
    stock: v.stock ?? null,
    durationMinutes: v.durationMinutes ?? null,
    location: v.location ?? null,
    imageUrl: v.imageUrl ?? null,
    targetPets: v.targetPets ?? [],
  }));

// `type` no se puede cambiar después de crear el item.
export const updateItemSchema = z
  .strictObject({
    title: itemFields.title,
    description: itemFields.description,
    category: itemFields.category,
    priceCents: itemFields.priceCents,
    stock: itemFields.stock,
    durationMinutes: itemFields.durationMinutes,
    location: itemFields.location,
    imageUrl: itemFields.imageUrl,
    targetPets: itemFields.targetPets,
    isActive: z.boolean({ error: 'isActive debe ser booleano.' }),
  })
  .partial()
  .refine((v) => Object.keys(v).length > 0, { message: 'Envía al menos un campo para actualizar.' });

function requireUser(req: Parameters<RequestHandler>[0]): User {
  if (!req.user) throw new UnauthorizedError();
  return req.user;
}

function idParam(req: Parameters<RequestHandler>[0]): string {
  const id = req.params['id'];
  if (typeof id !== 'string') throw new ValidationError();
  return id;
}

export function createItemController(catalog: CatalogService): {
  list: RequestHandler;
  get: RequestHandler;
  create: RequestHandler;
  update: RequestHandler;
  remove: RequestHandler;
} {
  return {
    create: async (req, res) => {
      const input = parseOrThrow(createItemSchema, req.body);
      res.status(201).json({ data: await catalog.create(requireUser(req), input) });
    },
    update: async (req, res) => {
      const changes = parseOrThrow(updateItemSchema, req.body);
      res.json({ data: await catalog.update(requireUser(req), idParam(req), changes) });
    },
    remove: async (req, res) => {
      await catalog.deactivate(requireUser(req), idParam(req));
      res.status(204).end();
    },
    list: async (req, res) => {
      const { page, limit, ...filter } = parseOrThrow(listItemsQuery, req.query);
      const cleaned = Object.fromEntries(Object.entries(filter).filter(([, v]) => v !== undefined));
      res.json(await catalog.list(cleaned, { page, limit }, req.user));
    },
    get: async (req, res) => {
      res.json({ data: await catalog.get(idParam(req), req.user) });
    },
  };
}
