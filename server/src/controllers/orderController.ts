import type { RequestHandler } from 'express';
import { z } from 'zod';
import { UnauthorizedError, ValidationError } from '../errors/AppError.js';
import { parseOrThrow } from '../errors/validate.js';
import type { OrderService } from '../services/OrderService.js';
import { PAYMENT_METHODS } from '../types/order.js';
import type { User } from '../types/user.js';
import { paginationShape } from '../utils/pagination.js';

// Body estricto: cualquier campo extra (price, total, shipping…) se rechaza con 400.
export const createOrderSchema = z.strictObject({
  items: z
    .array(
      z.strictObject({
        itemId: z.string({ error: 'itemId es obligatorio.' }).min(1, 'itemId es obligatorio.').max(64),
        quantity: z
          .number({ error: 'quantity debe ser un número.' })
          .int('quantity debe ser un entero.')
          .min(1, 'quantity mínimo 1.')
          .max(20, 'quantity máximo 20.'),
      }),
    )
    .min(1, 'El pedido necesita al menos un item.')
    .max(20, 'Un pedido admite como máximo 20 líneas.')
    .refine((lines) => new Set(lines.map((l) => l.itemId)).size === lines.length, 'No repitas el mismo item en varias líneas.'),
  paymentMethod: z.enum(PAYMENT_METHODS, { error: 'paymentMethod debe ser card, yape o transfer.' }),
});

const listQuery = z.object(paginationShape);

type Req = Parameters<RequestHandler>[0];

function requireUser(req: Req): User {
  if (!req.user) throw new UnauthorizedError();
  return req.user;
}

export function createOrderController(orders: OrderService): Record<'create' | 'list' | 'get', RequestHandler> {
  return {
    create: async (req, res) => {
      const input = parseOrThrow(createOrderSchema, req.body);
      res.status(201).json({ data: await orders.create(requireUser(req), input) });
    },
    list: async (req, res) => {
      res.json(await orders.list(requireUser(req), parseOrThrow(listQuery, req.query)));
    },
    get: async (req, res) => {
      const id = req.params['id'];
      if (typeof id !== 'string') throw new ValidationError();
      res.json({ data: await orders.get(requireUser(req), id) });
    },
  };
}
