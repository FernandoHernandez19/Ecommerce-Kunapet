import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { toUiPet } from '../api/adapters';
import { apiPet, errorResponse, jsonResponse, mockFetch, sampleUser } from '../test/helpers';
import type { AuthResult } from './useAuthStore';

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

const persistedEnvelope = z.object({ state: z.record(z.string(), z.unknown()) });

/** Lo guardado en localStorage bajo kunapet-auth (null si no hay nada). */
const persistedAuth = (): z.infer<typeof persistedEnvelope> | null => {
  const raw = localStorage.getItem('kunapet-auth');
  return raw === null ? null : persistedEnvelope.parse(JSON.parse(raw) as unknown);
};

/** Mensaje de error de un resultado fallido (falla la prueba si el resultado fue exitoso). */
const errorOf = (result: AuthResult): string => {
  if (result.success) throw new Error('Se esperaba un resultado fallido');
  return result.error;
};

describe('useAuthStore', () => {
  beforeEach(() => localStorage.clear());

  it('login correcto guarda { user, token } y persiste SOLO esos dos campos', async () => {
    const { useAuthStore } = await loadStores();
    mockFetch(jsonResponse({ user: sampleUser, token: 'jwt-1', expiresIn: 3600 }));
    const result = await useAuthStore.getState().login({ email: 'camila@kunapet.com', password: 'UnaClaveLarga123' });

    expect(result).toMatchObject({ success: true, user: sampleUser });
    const s = useAuthStore.getState();
    expect(s).toMatchObject({ user: sampleUser, token: 'jwt-1', isAuthenticated: true, error: null, isLoading: false });
    expect(Object.keys(persistedAuth()?.state ?? {}).sort()).toEqual(['token', 'user']);
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
    expect(errorOf(limited)).toBe('Demasiados intentos. Espera unos minutos e inténtalo de nuevo.');
    const offline = await useAuthStore.getState().login({ email: 'a@b.co', password: 'x' });
    expect(errorOf(offline)).toMatch(/conectar con el servidor/);
  });

  it('register crea la cuenta y luego inicia sesión', async () => {
    const { useAuthStore } = await loadStores();
    const fetchMock = mockFetch(jsonResponse({ user: sampleUser }, 201), jsonResponse({ user: sampleUser, token: 'jwt-2', expiresIn: 3600 }));
    const result = await useAuthStore.getState().register({
      name: 'Camila', email: 'camila@kunapet.com', password: 'UnaClaveLarga123', role: 'client',
    });
    expect(result.success).toBe(true);
    expect(fetchMock.mock.calls.map((c) => String(c[0]).split('/api/v1')[1])).toEqual(['/auth/register', '/auth/login']);
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
    expect(persistedAuth()?.state).toEqual({ user: null, token: null });
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

  it('logout limpia la sesión, el carrito persistido y las mascotas', async () => {
    const { useAuthStore, useCartStore, usePetsStore } = await loadStores();
    mockFetch(jsonResponse({ user: sampleUser, token: 'jwt-1', expiresIn: 3600 }));
    await useAuthStore.getState().login({ email: 'camila@kunapet.com', password: 'UnaClaveLarga123' });
    useCartStore.getState().addItem({ id: '1', type: 'product', price: 10, title: 'X' });
    usePetsStore.setState({ pets: [toUiPet(apiPet({ name: 'Rex' }))], status: 'ready' });
    expect(localStorage.getItem('kunapet-cart')).toContain('"items"');
    expect(usePetsStore.getState().pets).toHaveLength(1);

    useAuthStore.getState().logout();

    expect(useAuthStore.getState()).toMatchObject({ user: null, token: null, isAuthenticated: false });
    expect(useCartStore.getState().items).toEqual([]);
    expect(usePetsStore.getState()).toMatchObject({ pets: [], status: 'idle' });
    expect(localStorage.getItem('kunapet-cart')).toBeNull();
    expect(localStorage.getItem('kunapet-pets')).toBeNull();
    expect(persistedAuth()?.state).toEqual({ user: null, token: null });
  });

  describe('verifySession: solo el 401 cierra la sesión', () => {
    const SAVED = JSON.stringify({ state: { user: sampleUser, token: 'jwt-guardado' }, version: 0 });

    async function withSavedSession() {
      localStorage.setItem('kunapet-auth', SAVED);
      return loadStores();
    }

    it('401 → cierra la sesión y limpia lo guardado', async () => {
      const { useAuthStore } = await withSavedSession();
      mockFetch(errorResponse(401, 'unauthorized', 'No autenticado o token inválido.'));
      await useAuthStore.getState().verifySession();
      expect(useAuthStore.getState()).toMatchObject({ token: null, user: null, isAuthenticated: false, sessionStatus: 'ready', verifyError: null });
    });

    it('error de red → conserva la sesión guardada y avisa para reintentar', async () => {
      const { useAuthStore } = await withSavedSession();
      mockFetch(() => Promise.reject(new TypeError('Failed to fetch')));
      await useAuthStore.getState().verifySession();
      const state = useAuthStore.getState();
      expect(state).toMatchObject({ token: 'jwt-guardado', isAuthenticated: true, sessionStatus: 'verifying' });
      expect(state.user).toEqual(sampleUser);
      expect(state.verifyError).toMatch(/conectar con el servidor/);
      expect(persistedAuth()?.state).toEqual({ user: sampleUser, token: 'jwt-guardado' }); // sigue guardada
    });

    it('timeout → conserva la sesión guardada', async () => {
      vi.useFakeTimers();
      const { useAuthStore } = await withSavedSession();
      vi.stubGlobal(
        'fetch',
        vi.fn<typeof fetch>(
          (_input, init) =>
            new Promise<Response>((_resolve, reject) => {
              init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
            }),
        ),
      );
      const pending = useAuthStore.getState().verifySession();
      await vi.advanceTimersByTimeAsync(45_001);
      await pending;
      expect(useAuthStore.getState()).toMatchObject({ token: 'jwt-guardado', isAuthenticated: true, sessionStatus: 'verifying' });
      expect(useAuthStore.getState().verifyError).toMatch(/tardó demasiado/);
    });

    it('5xx → conserva la sesión guardada', async () => {
      const { useAuthStore } = await withSavedSession();
      mockFetch(errorResponse(503, 'service_unavailable', 'Servicio no disponible.'), errorResponse(500, 'internal_error', 'x'));
      await useAuthStore.getState().verifySession();
      expect(useAuthStore.getState()).toMatchObject({ token: 'jwt-guardado', isAuthenticated: true });
      expect(useAuthStore.getState().verifyError).not.toBeNull();
      await useAuthStore.getState().verifySession();
      expect(useAuthStore.getState()).toMatchObject({ token: 'jwt-guardado', isAuthenticated: true });
    });

    it('una respuesta inválida (no cumple el contrato) tampoco cierra la sesión', async () => {
      const { useAuthStore } = await withSavedSession();
      mockFetch(jsonResponse({ user: { id: 'u1' } }));
      await useAuthStore.getState().verifySession();
      expect(useAuthStore.getState()).toMatchObject({ token: 'jwt-guardado', isAuthenticated: true });
    });

    it('reintentar tras un fallo de red valida la sesión y limpia el aviso', async () => {
      const { useAuthStore } = await withSavedSession();
      mockFetch(() => Promise.reject(new TypeError('x')), jsonResponse({ user: sampleUser }));
      await useAuthStore.getState().verifySession();
      expect(useAuthStore.getState().verifyError).not.toBeNull();
      await useAuthStore.getState().verifySession();
      expect(useAuthStore.getState()).toMatchObject({ sessionStatus: 'ready', verifyError: null, isAuthenticated: true });
    });

    it('si el reintento responde 401, ahí sí se cierra la sesión', async () => {
      const { useAuthStore } = await withSavedSession();
      mockFetch(() => Promise.reject(new TypeError('x')), errorResponse(401, 'unauthorized', 'x'));
      await useAuthStore.getState().verifySession();
      await useAuthStore.getState().verifySession();
      expect(useAuthStore.getState()).toMatchObject({ token: null, isAuthenticated: false, sessionStatus: 'ready' });
    });
  });
});
