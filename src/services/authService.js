/**
 * authService — Capa de abstracción de autenticación para KunaPet.
 *
 * Actualmente usa datos mock. Cuando el API de C# (ASP.NET Core) esté listo,
 * solo hay que reemplazar el contenido de cada función por una llamada real
 * a la API. El resto de la app (stores, componentes) no necesita cambiar.
 *
 * Patrón de integración futura:
 *   import api from './apiClient'; // Axios / fetch wrapper
 *   const res = await api.post('/auth/login', credentials);
 *   return res.data;
 */

// ─── Constantes ───────────────────────────────────────────────────────────────
const MOCK_DELAY = 600; // ms — simula latencia de red

// Usuarios de prueba (equivalentes a lo que devolvería el backend)
const MOCK_USERS = [
  {
    id:        'usr-001',
    email:     'camila@kunapet.com',
    name:      'Camila Rodríguez',
    role:      'client',
    avatar:    null,
    phone:     '+51 999 123 456',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id:        'usr-002',
    email:     'proveedor@kunapet.com',
    name:      'PetShop Central',
    role:      'provider',
    avatar:    null,
    phone:     '+51 999 654 321',
    createdAt: '2024-02-10T09:00:00Z',
  },
  {
    id:        'usr-003',
    email:     'admin@kunapet.com',
    name:      'Fernando H.',
    role:      'admin',
    avatar:    null,
    phone:     null,
    createdAt: '2023-12-01T08:00:00Z',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// ─── Funciones del servicio ───────────────────────────────────────────────────

/**
 * login — Autentica al usuario.
 * @param {{ email: string, password: string }} credentials
 * @returns {{ user: object, token: string }}
 * @throws {Error} Si las credenciales son inválidas
 */
export async function login(credentials) {
  await delay(MOCK_DELAY);

  const user = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
  );

  // Contraseña universal de demo (en producción el backend valida el hash)
  const validPasswords = ['demo123456', '123456', 'password'];
  if (!user || !validPasswords.includes(credentials.password)) {
    throw new Error('Correo o contraseña incorrectos. Por favor intenta de nuevo.');
  }

  return {
    user,
    token: `mock-jwt-${user.role}-${Date.now()}`,
  };
}

/**
 * logout — Invalida la sesión del usuario.
 * En producción: llama al endpoint DELETE /auth/session para invalidar el JWT.
 */
export async function logout() {
  await delay(200);
  // TODO: await api.delete('/auth/session');
}

/**
 * getProfile — Obtiene el perfil actualizado del usuario autenticado.
 * @param {string} userId
 * @returns {object} Datos del usuario
 */
export async function getProfile(userId) {
  await delay(MOCK_DELAY);
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) throw new Error('Usuario no encontrado.');
  return user;
}

/**
 * updateProfile — Actualiza datos del perfil.
 * @param {string} userId
 * @param {object} updates
 */
export async function updateProfile(userId, updates) {
  await delay(MOCK_DELAY);
  // TODO: await api.patch(`/users/${userId}`, updates);
  return { ...MOCK_USERS.find((u) => u.id === userId), ...updates };
}
