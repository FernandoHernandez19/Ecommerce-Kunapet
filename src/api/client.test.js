import { beforeEach, describe, expect, it, vi } from 'vitest';
import useAuthStore from '../store/useAuthStore';
import { errorResponse, fetchHeaders, jsonResponse, mockFetch, sampleUser } from '../test/helpers';
import { ApiError } from './ApiError';
import { REQUEST_TIMEOUT_MS, api, request, setUnauthorizedHandler } from './client';

const TOKEN = 'token-de-prueba-123';

function signIn() {
  useAuthStore.setState({ user: sampleUser, token: TOKEN, isAuthenticated: true, sessionStatus: 'ready' });
}

describe('cliente HTTP', () => {
  beforeEach(() => useAuthStore.setState({ user: null, token: null, isAuthenticated: false, sessionStatus: 'ready' }));

  it('adjunta Authorization con el token del store y usa la URL base', async () => {
    signIn();
    const fetchMock = mockFetch(jsonResponse({ user: sampleUser }));
    await api.get('/auth/me');
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:3000/api/v1/auth/me');
    expect(init.method).toBe('GET');
    expect(fetchHeaders(fetchMock.mock.calls[0]).get('Authorization')).toBe(`Bearer ${TOKEN}`);
  });

  it('no envía Authorization sin token ni con auth: false', async () => {
    const fetchMock = mockFetch(jsonResponse({}), jsonResponse({}));
    await api.get('/items');
    signIn();
    await api.post('/auth/login', { a: 1 }, { auth: false });
    expect(fetchHeaders(fetchMock.mock.calls[0]).has('Authorization')).toBe(false);
    expect(fetchHeaders(fetchMock.mock.calls[1]).has('Authorization')).toBe(false);
  });

  it('envía el cuerpo como JSON', async () => {
    const fetchMock = mockFetch(jsonResponse({ ok: true }));
    await api.post('/orders', { items: [] });
    const [, init] = fetchMock.mock.calls[0];
    expect(init.body).toBe('{"items":[]}');
    expect(fetchHeaders(fetchMock.mock.calls[0]).get('Content-Type')).toBe('application/json');
  });

  it('devuelve el JSON y null en 204', async () => {
    mockFetch(jsonResponse({ data: [1] }), new Response(null, { status: 204 }));
    expect(await api.get('/items')).toEqual({ data: [1] });
    expect(await api.delete('/items/1')).toBeNull();
  });

  it('convierte el error del contrato en ApiError { status, code, message, details }', async () => {
    const details = [{ path: 'email', message: 'Correo inválido.' }];
    mockFetch(errorResponse(400, 'validation_error', 'Datos inválidos.', details));
    const err = await api.post('/auth/register', {}).catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({ status: 400, code: 'validation_error', message: 'Datos inválidos.', details });
  });

  it('usa un código por estado si el cuerpo no tiene el formato del contrato', async () => {
    mockFetch(new Response('<html>Bad gateway</html>', { status: 502 }), new Response('no json', { status: 404 }));
    const a = await api.get('/x').catch((e) => e);
    const b = await api.get('/y').catch((e) => e);
    expect(a).toMatchObject({ status: 502, code: 'internal_error' });
    expect(b).toMatchObject({ status: 404, code: 'not_found' });
    expect(a.message).not.toContain('html');
  });

  it('un 401 en una ruta que no es el login cierra sesión y redirige', async () => {
    signIn();
    const redirect = vi.fn();
    const off = setUnauthorizedHandler(redirect);
    mockFetch(errorResponse(401, 'unauthorized', 'No autenticado o token inválido.'));
    const err = await api.get('/orders').catch((e) => e);
    off();
    expect(err).toMatchObject({ status: 401, code: 'unauthorized' });
    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(redirect).toHaveBeenCalledTimes(1);
  });

  it('un 401 con handleUnauthorized: false (login, /auth/me) no cierra sesión ni redirige', async () => {
    signIn();
    const redirect = vi.fn();
    const off = setUnauthorizedHandler(redirect);
    mockFetch(errorResponse(401, 'unauthorized', 'Correo o contraseña incorrectos.'));
    await request('/auth/login', { method: 'POST', body: {}, auth: false, handleUnauthorized: false }).catch(() => {});
    off();
    expect(useAuthStore.getState().token).toBe(TOKEN);
    expect(redirect).not.toHaveBeenCalled();
  });

  it('un fallo de red produce ApiError network_error con mensaje en español', async () => {
    mockFetch(() => Promise.reject(new TypeError('Failed to fetch')));
    const err = await api.get('/items').catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({ status: 0, code: 'network_error' });
    expect(err.message).toMatch(/conectar con el servidor/);
    expect(err.message).not.toContain('Failed to fetch');
  });

  it('aborta a los 45 s y devuelve ApiError timeout', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn((_url, init) => new Promise((_resolve, reject) => {
        init.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      })),
    );
    const pending = api.get('/items').catch((e) => e);
    await vi.advanceTimersByTimeAsync(REQUEST_TIMEOUT_MS - 1);
    expect(fetch.mock.calls[0][1].signal.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(2);
    const err = await pending;
    expect(err).toMatchObject({ status: 0, code: 'timeout' });
    expect(REQUEST_TIMEOUT_MS).toBe(45_000);
  });

  it('nunca imprime el token ni lo incluye en los errores', async () => {
    signIn();
    const spies = ['log', 'info', 'warn', 'error', 'debug'].map((m) => vi.spyOn(console, m).mockImplementation(() => {}));
    mockFetch(errorResponse(500, 'internal_error', 'Error interno del servidor.'), () => Promise.reject(new TypeError('x')));
    const e1 = await api.get('/a').catch((e) => e);
    const e2 = await api.get('/b').catch((e) => e);
    const printed = spies.flatMap((s) => s.mock.calls).flat().map(String).join(' ');
    expect(printed).not.toContain(TOKEN);
    expect(JSON.stringify([e1.message, e2.message, e1.details])).not.toContain(TOKEN);
  });
});
