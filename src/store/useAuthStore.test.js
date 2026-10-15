import { beforeEach, describe, expect, it, vi } from 'vitest';
import { errorResponse, jsonResponse, mockFetch, sampleUser } from '../test/helpers';

// El store se hidrata desde localStorage al importarse: se reimporta en cada prueba.
async function loadStores() {
  vi.resetModules();
  const [{ default: useAuthStore }, { default: useCartStore }, { default: usePetsStore }] = await Promise.all([
    import('./useAuthStore'),
    import('./useCartStore'),
    import('./usePetsStore'),
  ]);
  return { useAuthStore, useCartStore, usePetsStore };
}

const persistedAuth = () => JSON.parse(localStorage.getItem('kunapet-auth') ?? 'null');

describe('useAuthStore', () => {
  beforeEach(() => localStorage.clear());

  it('login correcto guarda { user, token } y persiste SOLO esos dos campos', async () => {
    const { useAuthStore } = await loadStores();
    mockFetch(jsonResponse({ user: sampleUser, token: 'jwt-1', expiresIn: 3600 }));
    const result = await useAuthStore.getState().login({ email: 'camila@kunapet.com', password: 'UnaClaveLarga123' });

    expect(result).toMatchObject({ success: true, user: sampleUser });
    const s = useAuthStore.getState();
    expect(s).toMatchObject({ user: sampleUser, token: 'jwt-1', isAuthenticated: true, error: null, isLoading: false });
    expect(Object.keys(persistedAuth().state).sort()).toEqual(['token', 'user']);
    expect(localStorage.getItem('kunapet-auth')).not.toContain('UnaClaveLarga123');
  });

  it('credenciales incorrectas: mensaje amigable y sin sesión', async () => {
    const { useAuthStore } = await loadStores();
    mockFetch(errorResponse(401, 'unauthorized', 'Correo o contraseña incorrectos.'));
    const result = await useAuthStore.getState().login({ email: 'a@b.co', password: 'mala-clave-1' });

    expect(result).toMatchObject({ success: false, error: 'Correo o contraseña incorrectos.' });
    expect(useAuthStore.getState()).toMatchObject({ isAuthenticated: false, token: null, error: 'Correo o contraseña incorrectos.' });
    expect(persistedAuth()?.state?.token ?? null).toBeNull();
  });

  it('límite de intentos y fallo de red: mensajes amigables', async () => {
    const { useAuthStore } = await loadStores();
    mockFetch(errorResponse(429, 'rate_limited', 'Demasiados intentos de inicio de sesión. Inténtalo más tarde.'), () => Promise.reject(new TypeError('x')));
    const limited = await useAuthStore.getState().login({ email: 'a@b.co', password: 'x' });
    expect(limited.error).toBe('Demasiados intentos. Espera unos minutos e inténtalo de nuevo.');
    const offline = await useAuthStore.getState().login({ email: 'a@b.co', password: 'x' });
    expect(offline.error).toMatch(/conectar con el servidor/);
  });

  it('register crea la cuenta y luego inicia sesión', async () => {
    const { useAuthStore } = await loadStores();
    const fetchMock = mockFetch(jsonResponse({ user: sampleUser }, 201), jsonResponse({ user: sampleUser, token: 'jwt-2', expiresIn: 3600 }));
    const result = await useAuthStore.getState().register({
      name: 'Camila', email: 'camila@kunapet.com', password: 'UnaClaveLarga123', role: 'client',
    });
    expect(result.success).toBe(true);
    expect(fetchMock.mock.calls.map((c) => c[0].split('/api/v1')[1])).toEqual(['/auth/register', '/auth/login']);
    expect(useAuthStore.getState()).toMatchObject({ token: 'jwt-2', isAuthenticated: true });
  });

  it('register con correo repetido: mensaje amigable y sin llamar al login', async () => {
    const { useAuthStore } = await loadStores();
    const fetchMock = mockFetch(errorResponse(409, 'conflict', 'Ya existe una cuenta con ese correo.'));
    const result = await useAuthStore.getState().register({ name: 'C', email: 'c@x.com', password: 'UnaClaveLarga123', role: 'client' });
    expect(result).toMatchObject({ success: false, code: 'conflict', error: 'Ese correo ya está registrado. Inicia sesión o usa otro correo.' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('restaura una sesión válida: arranca "verificando" y /auth/me la confirma', async () => {
    localStorage.setItem('kunapet-auth', JSON.stringify({ state: { user: sampleUser, token: 'jwt-guardado' }, version: 0 }));
    const { useAuthStore } = await loadStores();
    expect(useAuthStore.getState()).toMatchObject({ sessionStatus: 'verifying', token: 'jwt-guardado' });

    const refreshed = { ...sampleUser, name: 'Camila R.' };
    const fetchMock = mockFetch(jsonResponse({ user: refreshed }));
    await useAuthStore.getState().verifySession();
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/auth\/me$/);
    expect(useAuthStore.getState()).toMatchObject({ sessionStatus: 'ready', isAuthenticated: true, user: refreshed });
  });

  it('restaura una sesión inválida: /auth/me falla y se cierra la sesión', async () => {
    localStorage.setItem('kunapet-auth', JSON.stringify({ state: { user: sampleUser, token: 'jwt-vencido' }, version: 0 }));
    const { useAuthStore } = await loadStores();
    mockFetch(errorResponse(401, 'unauthorized', 'No autenticado o token inválido.'));
    await useAuthStore.getState().verifySession();
    expect(useAuthStore.getState()).toMatchObject({ sessionStatus: 'ready', isAuthenticated: false, token: null, user: null });
    expect(persistedAuth().state).toEqual({ user: null, token: null });
  });

  it('sin sesión guardada no llama a la API y queda listo', async () => {
    const { useAuthStore } = await loadStores();
    const fetchMock = mockFetch();
    expect(useAuthStore.getState().sessionStatus).toBe('ready');
    await useAuthStore.getState().verifySession();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('dos verificaciones simultáneas hacen una sola petición', async () => {
    localStorage.setItem('kunapet-auth', JSON.stringify({ state: { user: sampleUser, token: 'jwt' }, version: 0 }));
    const { useAuthStore } = await loadStores();
    const fetchMock = mockFetch(jsonResponse({ user: sampleUser }));
    await Promise.all([useAuthStore.getState().verifySession(), useAuthStore.getState().verifySession()]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('logout limpia la sesión y los stores persistidos del carrito y de mascotas', async () => {
    const { useAuthStore, useCartStore, usePetsStore } = await loadStores();
    mockFetch(jsonResponse({ user: sampleUser, token: 'jwt-1', expiresIn: 3600 }));
    await useAuthStore.getState().login({ email: 'camila@kunapet.com', password: 'UnaClaveLarga123' });
    useCartStore.getState().addItem({ id: '1', type: 'product', price: 10, title: 'X' });
    usePetsStore.getState().addPet({ name: 'Rex', species: 'dog' });
    expect(localStorage.getItem('kunapet-cart')).toContain('"items"');
    expect(usePetsStore.getState().pets.some((p) => p.name === 'Rex')).toBe(true);

    useAuthStore.getState().logout();

    expect(useAuthStore.getState()).toMatchObject({ user: null, token: null, isAuthenticated: false });
    expect(useCartStore.getState().items).toEqual([]);
    expect(usePetsStore.getState().pets.some((p) => p.name === 'Rex')).toBe(false);
    expect(localStorage.getItem('kunapet-cart')).toBeNull();
    expect(localStorage.getItem('kunapet-pets')).toBeNull();
    expect(persistedAuth().state).toEqual({ user: null, token: null });
  });
});
