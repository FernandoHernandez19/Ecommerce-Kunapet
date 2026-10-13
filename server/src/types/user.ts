export const ROLES = ['client', 'provider', 'admin'] as const;
export type Role = (typeof ROLES)[number];

/** Roles que se pueden elegir en el registro público. `admin` nunca. */
export const REGISTRABLE_ROLES = ['client', 'provider'] as const;
export type RegistrableRole = (typeof REGISTRABLE_ROLES)[number];

/** Registro interno: incluye el hash. Nunca debe salir en una respuesta HTTP. */
export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  phone: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

/** Representación pública del usuario (sin hash). */
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export function toPublicUser(record: UserRecord): User {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    role: record.role,
    phone: record.phone,
    avatarUrl: record.avatarUrl,
    createdAt: record.createdAt,
  };
}
