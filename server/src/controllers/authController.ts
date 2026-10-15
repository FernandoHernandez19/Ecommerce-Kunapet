import type { RequestHandler } from 'express';
import { z } from 'zod';
import { parseOrThrow } from '../errors/validate.js';
import type { RateLimiter } from '../middleware/rateLimiter.js';
import type { AuthService } from '../services/AuthService.js';
import { REGISTRABLE_ROLES } from '../types/user.js';

// bcrypt solo usa los primeros 72 BYTES: se limita por bytes, no por caracteres.
const password = z
  .string({ error: 'La contraseña es obligatoria.' })
  .min(8, 'La contraseña debe tener al menos 8 caracteres.')
  .refine((v) => Buffer.byteLength(v, 'utf8') <= 72, 'La contraseña no puede superar 72 caracteres.');

const email = z
  .string({ error: 'El correo es obligatorio.' })
  .trim()
  .toLowerCase()
  .max(254, 'Correo demasiado largo.')
  .pipe(z.email('Correo inválido.'));

export const registerSchema = z.object({
  name: z
    .string({ error: 'El nombre es obligatorio.' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres.')
    .max(100, 'El nombre no puede superar 100 caracteres.'),
  email,
  password,
  // `admin` no está en el enum: se rechaza aunque el cliente lo envíe.
  role: z.enum(REGISTRABLE_ROLES, { error: 'El rol debe ser client o provider.' }).default('client'),
  phone: z
    .string()
    .trim()
    .max(30, 'Teléfono demasiado largo.')
    .nullish()
    .transform((v) => (v ? v : null)),
});

export const loginSchema = z.object({
  email,
  password: z
    .string({ error: 'La contraseña es obligatoria.' })
    .min(1, 'La contraseña es obligatoria.')
    .max(200, 'Contraseña demasiado larga.'),
});

export function createAuthController(
  auth: AuthService,
  loginLimiter: RateLimiter,
  registerLimiter: RateLimiter,
): { register: RequestHandler; login: RequestHandler; me: RequestHandler } {
  return {
    register: async (req, res) => {
      const input = parseOrThrow(registerSchema, req.body);
      registerLimiter.hit(req.ip ?? 'desconocida');
      const user = await auth.register(input);
      res.status(201).json({ user });
    },
    login: async (req, res) => {
      const { email, password } = parseOrThrow(loginSchema, req.body);
      loginLimiter.hit(`${req.ip ?? 'desconocida'}|${email}`);
      res.json(await auth.login(email, password));
    },
    me: (req, res) => {
      res.json({ user: req.user });
    },
  };
}
