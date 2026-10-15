import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import useAuthStore from '../store/useAuthStore';
import { errorResponse, fetchHeaders, jsonResponse, mockFetch, sampleUser } from '../test/helpers';
import { ApiError } from './ApiError';
import { REQUEST_TIMEOUT_MS, api, request, setUnauthorizedHandler } from './client';
import { userEnvelopeSchema } from './schemas';

const TOKEN = 'token-de-prueba-123';

function signIn(): void {
  useAuthStore.setState({ user: sampleUser, token: TOKEN, isAuthenticated: true, sessionStatus: 'ready' });
}

/** Espera a que la promesa falle y devuelve el error, comprobando que es un ApiError. */
async function failure(promise: Promise<unknown>): Promise<ApiError> {
  try {
    await promise;
  } catch (err) {
    if (err instanceof ApiError) return err;
    throw err;
  }
  throw new Error('Se esperaba que la petición fallara');
}

describe('cliente HTTP', () => {
  beforeEach(() => useAuthStore.setState({ user: null, token: null, isAuthenticated: false, sessionStatus: 'ready' }));

  it('adjunta Authorization con el token del store y usa la URL base', async () => {
    signIn();
    const fetchMock = mockFetch(jsonResponse({ user: sampleUser }));
    await api.get('/auth/me');
    const call = fetchMock.mock.calls[0];
    expect(call?.[0]).toBe('http://localhost:3000/api/v1/auth/me');
    expect(call?.[1]?.method).toBe('GET');
    expect(call && fetchHeaders(call).get('Authorization')).toBe(`Bearer ${TOKEN}`);
  });

  it('no envía Authorization sin token ni con auth: false', async () => {
    const fetchMock = mockFetch(jsonResponse({}), jsonResponse({}));
    await api.get('/items');
    signIn();
    await api.post('/auth/login', { a: 1 }, { auth: false });
    for (const call of fetchMock.mock.calls) expect(fetchHeaders(call).has('Authorization')).toBe(false);
  });

  it('envía el cuerpo como JSON', async () => {
    const fetchMock = mockFetch(jsonResponse({ ok: true }));
    await api.post('/orders', { items: [] });
    const call = fetchMock.mock.calls[0];
    expect(call?.[1]?.body).toBe('{"items":[]}');
    expect(call && fetchHeaders(call).get('Content-Type')).toBe('application/json');
  });

  it('devuelve el JSON y null en 204', async () => {
    mockFetch(jsonResponse({ data: [1] }), new Response(null, { status: 204 }));
    expect(await api.get('/items')).toEqual({ data: [1] });
    expect(await api.delete('/items/1')).toBeNull();
  });

  it('con schema devuelve el dato tipado y validado', async () => {
    mockFetch(jsonResponse({ user: sampleUser }));
    const res = await api.get('/auth/me', { schema: userEnvelopeSchema });
    // `res.user.email` compila porque el tipo se deriva del esquema (z.infer)
    expect(res.user.email).toBe('camila@kunapet.com');
  });

  it('request<T> con schema: respuesta que no cumple el contrato → ApiError invalid_response', async () => {
    mockFetch(jsonResponse({ user: { id: 'u1' } }));
    const err = await failure(request('/auth/me', { schema: userEnvelopeSchema }));
    expect(err).toMatchObject({ status: 200, code: 'invalid_response' });
    expect(err.message).toMatch(/datos inesperados/);
    // Solo se informan rutas y códigos de zod, nunca los valores recibidos
    expect(JSON.stringify(err.details)).not.toContain('u1');
  });

  it('un 200 que no es JSON también es invalid_response', async () => {
    mockFetch(new Response('<html>hola</html>', { status: 200 }));
    expect(await failure(api.get('/x'))).toMatchObject({ code: 'invalid_response' });
  });

  it('no valida los errores HTTP con el schema de éxito', async () => {
    mockFetch(errorResponse(404, 'not_found', 'Item no encontrado.'));
    const err = await failure(api.get('/items/x', { schema: z.object({ data: z.string() }) }));
    expect(err).toMatchObject({ status: 404, code: 'not_found' });
  });

  it('convierte el error del contrato en ApiError { status, code, message, details }', async () => {
    const details = [{ path: 'email', message: 'Correo inválido.' }];
    mockFetch(errorResponse(400, 'validation_error', 'Datos inválidos.', details));
    const err = await failure(api.post('/auth/register', {}));
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({ status: 400, code: 'validation_error', message: 'Datos inválidos.', details });
  });

  it('un código de error desconocido del servidor se trata como internal_error (conserva el mensaje)', async () => {
    mockFetch(errorResponse(418, 'soy_una_tetera', 'No puedo preparar café.'));
    expect(await failure(api.get('/x'))).toMatchObject({ status: 418, code: 'internal_error', message: 'No puedo preparar café.' });
  });

  it('usa un código por estado si el cuerpo no tiene el formato del contrato', async () => {
    mockFetch(new Response('<html>Bad gateway</html>', { status: 502 }), new Response('no json', { status: 404 }));
    const a = await failure(api.get('/x'));
    const b = await failure(api.get('/y'));
    expect(a).toMatchObject({ status: 502, code: 'internal_error' });
    expect(b).toMatchObject({ status: 404, code: 'not_found' });
    expect(a.message).not.toContain('html');
  });

  it('un 401 en una ruta que no es el login cierra sesión y redirige', async () => {
    signIn();
    const redirect = vi.fn();
    const off = setUnauthorizedHandler(redirect);
    mockFetch(errorResponse(401, 'unauthorized', 'No autenticado o token inválido.'));
    const err = await failure(api.get('/orders'));
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
    await failure(request('/auth/login', { method: 'POST', body: {}, auth: false, handleUnauthorized: false }));
    off();
    expect(useAuthStore.getState().token).toBe(TOKEN);
    expect(redirect).not.toHaveBeenCalled();
  });

  it('un fallo de red produce ApiError network_error con mensaje en español', async () => {
    mockFetch(() => Promise.reject(new TypeError('Failed to fetch')));
    const err = await failure(api.get('/items'));
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({ status: 0, code: 'network_error' });
    expect(err.message).toMatch(/conectar con el servidor/);
    expect(err.message).not.toContain('Failed to fetch');
  });

  it('aborta a los 45 s y devuelve ApiError timeout', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn<typeof fetch>(
      (_input, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
        }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const pending = failure(api.get('/items'));
    await vi.advanceTimersByTimeAsync(REQUEST_TIMEOUT_MS - 1);
    expect(fetchMock.mock.calls[0]?.[1]?.signal?.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(2);
    expect(await pending).toMatchObject({ status: 0, code: 'timeout' });
    expect(REQUEST_TIMEOUT_MS).toBe(45_000);
  });

  it('una señal externa cancelada produce ApiError aborted', async () => {
    const controller = new AbortController();
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>(
        (_input, init) =>
          new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
          }),
      ),
    );
    const pending = failure(api.get('/items', { signal: controller.signal }));
    controller.abort();
    expect(await pending).toMatchObject({ code: 'aborted' });
  });

  it('nunca imprime el token ni lo incluye en los errores', async () => {
    signIn();
    const spies = [vi.spyOn(console, 'log'), vi.spyOn(console, 'info'), vi.spyOn(console, 'warn'), vi.spyOn(console, 'error'), vi.spyOn(console, 'debug')];
    for (const spy of spies) spy.mockImplementation(() => undefined);
    mockFetch(errorResponse(500, 'internal_error', 'Error interno del servidor.'), () => Promise.reject(new TypeError('x')));
    const e1 = await failure(api.get('/a'));
    const e2 = await failure(api.get('/b'));
    const printed = spies.flatMap((s) => s.mock.calls).flat().map(String).join(' ');
    expect(printed).not.toContain(TOKEN);
    expect(JSON.stringify([e1.message, e2.message, e1.details])).not.toContain(TOKEN);
  });
});
