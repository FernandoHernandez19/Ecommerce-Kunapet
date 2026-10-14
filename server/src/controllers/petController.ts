import type { RequestHandler } from 'express';
import { z } from 'zod';
import { UnauthorizedError, ValidationError } from '../errors/AppError.js';
import { parseOrThrow } from '../errors/validate.js';
import type { PetService } from '../services/PetService.js';
import { GENDERS, SPECIES } from '../types/pet.js';
import type { User } from '../types/user.js';
import { paginationShape } from '../utils/pagination.js';

/** Fecha real en formato YYYY-MM-DD y no futura. */
const birthDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'birthDate debe tener el formato YYYY-MM-DD.')
  .refine((v) => {
    const d = new Date(`${v}T00:00:00.000Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(v);
  }, 'birthDate no es una fecha válida.')
  .refine((v) => v <= new Date().toISOString().slice(0, 10), 'birthDate no puede ser futura.')
  .refine((v) => v >= '1990-01-01', 'birthDate es demasiado antigua.');

const fields = {
  name: z.string().trim().min(1, 'El nombre es obligatorio.').max(60, 'El nombre no puede superar 60 caracteres.'),
  species: z.enum(SPECIES, { error: 'species inválida.' }),
  breed: z.string().trim().max(60, 'La raza no puede superar 60 caracteres.').nullable(),
  gender: z.enum(GENDERS, { error: 'gender debe ser female, male o unknown.' }).nullable(),
  birthDate: birthDate.nullable(),
  weightGrams: z.number().int('weightGrams debe ser un entero.').min(1).max(200_000).nullable(),
  notes: z.string().trim().max(500, 'Las notas no pueden superar 500 caracteres.').nullable(),
  photoUrl: z
    .url({ protocol: /^https?$/, error: 'photoUrl debe ser una URL http(s).' })
    .max(500, 'photoUrl demasiado larga.')
    .nullable(),
};

export const createPetSchema = z
  .strictObject({
    name: fields.name,
    species: fields.species,
    breed: fields.breed.optional(),
    gender: fields.gender.optional(),
    birthDate: fields.birthDate.optional(),
    weightGrams: fields.weightGrams.optional(),
    notes: fields.notes.optional(),
    photoUrl: fields.photoUrl.optional(),
  })
  .transform((v) => ({
    name: v.name,
    species: v.species,
    breed: v.breed ?? null,
    gender: v.gender ?? null,
    birthDate: v.birthDate ?? null,
    weightGrams: v.weightGrams ?? null,
    notes: v.notes ?? null,
    photoUrl: v.photoUrl ?? null,
  }));

export const updatePetSchema = z
  .strictObject(fields)
  .partial()
  .refine((v) => Object.keys(v).length > 0, { message: 'Envía al menos un campo para actualizar.' });

const listQuery = z.object(paginationShape);

type Req = Parameters<RequestHandler>[0];

function requireUser(req: Req): User {
  if (!req.user) throw new UnauthorizedError();
  return req.user;
}

function idParam(req: Req): string {
  const id = req.params['id'];
  if (typeof id !== 'string') throw new ValidationError();
  return id;
}

export function createPetController(pets: PetService): Record<'list' | 'create' | 'get' | 'update' | 'remove', RequestHandler> {
  return {
    list: async (req, res) => {
      res.json(await pets.list(requireUser(req), parseOrThrow(listQuery, req.query)));
    },
    create: async (req, res) => {
      const input = parseOrThrow(createPetSchema, req.body);
      res.status(201).json({ data: await pets.create(requireUser(req), input) });
    },
    get: async (req, res) => {
      res.json({ data: await pets.get(requireUser(req), idParam(req)) });
    },
    update: async (req, res) => {
      const changes = parseOrThrow(updatePetSchema, req.body);
      res.json({ data: await pets.update(requireUser(req), idParam(req), changes) });
    },
    remove: async (req, res) => {
      await pets.remove(requireUser(req), idParam(req));
      res.status(204).end();
    },
  };
}
