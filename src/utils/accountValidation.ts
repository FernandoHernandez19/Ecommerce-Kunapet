/**
 * Validación de credenciales de registro. Debe coincidir con el servidor
 * (docs/api-contract.md §3): correo válido y contraseña de 8 a 72 caracteres
 * (bcrypt solo usa los primeros 72 BYTES, así que también se limita por bytes).
 */
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string | null | undefined): string | undefined {
  if (!email?.trim()) return 'El correo electrónico es obligatorio.';
  if (!EMAIL_RE.test(email.trim())) return 'Ingresa un correo válido (ej: nombre@ejemplo.com).';
  return undefined;
}

export function validatePassword(password: string | null | undefined): string | undefined {
  if (!password) return 'La contraseña es obligatoria.';
  if (password.length < PASSWORD_MIN) return `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres.`;
  if (password.length > PASSWORD_MAX || new TextEncoder().encode(password).length > PASSWORD_MAX) {
    return `La contraseña no puede superar ${PASSWORD_MAX} caracteres.`;
  }
  return undefined;
}

/** @returns {{ email?: string, password?: string }} solo las claves con error */
export interface CredentialErrors {
  email?: string;
  password?: string;
}

export function validateCredentials({ email, password }: { email?: string; password?: string }): CredentialErrors {
  const errors: CredentialErrors = {};
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  return errors;
}
