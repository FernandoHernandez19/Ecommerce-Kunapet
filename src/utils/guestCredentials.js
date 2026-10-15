/**
 * Credenciales aleatorias para el acceso de invitado de la demo.
 * Se generan en el navegador, se usan una vez para registrar + iniciar sesión
 * y nunca se muestran ni se guardan.
 */
export const GUEST_EMAIL_DOMAIN = 'demo.kunapet.test';

const GUEST_NAMES = {
  client: 'Cliente de prueba',
  provider: 'Proveedor de prueba',
};

// Alfabeto de 32 caracteres sin ambiguos (0/O, 1/I): 256 % 32 === 0, así que no hay sesgo.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomPassword(length = 24) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
}

/** @param {'client'|'provider'} role */
export function generateGuestCredentials(role) {
  const id = crypto.randomUUID().replace(/-/g, '').slice(0, 16);
  return {
    name: GUEST_NAMES[role] ?? GUEST_NAMES.client,
    email: `invitado-${id}@${GUEST_EMAIL_DOMAIN}`,
    password: randomPassword(),
    role,
  };
}

export const isGuestAccessEnabled = () => import.meta.env.VITE_ENABLE_GUEST === 'true';
