import { describe, expect, it } from 'vitest';
import { validateCredentials } from './accountValidation';
import { GUEST_EMAIL_DOMAIN, generateGuestCredentials } from './guestCredentials';

describe('generateGuestCredentials', () => {
  it('genera correos y contraseñas distintos en cada llamada', () => {
    const batch = Array.from({ length: 50 }, () => generateGuestCredentials('client'));
    expect(new Set(batch.map((c) => c.email)).size).toBe(50);
    expect(new Set(batch.map((c) => c.password)).size).toBe(50);
  });

  it('usa el dominio de la demo y el rol pedido', () => {
    const c = generateGuestCredentials('provider');
    expect(c.email.endsWith(`@${GUEST_EMAIL_DOMAIN}`)).toBe(true);
    expect(c.role).toBe('provider');
    expect(c.name).toBe('Proveedor de prueba');
  });

  it('cumple las reglas del servidor (correo válido, contraseña de 8 a 72)', () => {
    for (let i = 0; i < 20; i++) {
      expect(validateCredentials(generateGuestCredentials('client'))).toEqual({});
    }
  });
});
