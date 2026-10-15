import { beforeEach, describe, expect, it } from 'vitest';
import useAuthStore from '../store/useAuthStore';
import { ApiError } from '../api/ApiError';
import { errorResponse, fetchBody, fetchHeaders, jsonResponse, mockFetch, sampleUser } from '../test/helpers';
import * as authService from './authService';

describe('authService', () => {
  beforeEach(() => useAuthStore.setState({ user: null, token: null, isAuthenticated: false, sessionStatus: 'ready' }));

  it('login: POST /auth/login con el correo recortado, sin Authorization', async () => {
    useAuthStore.setState({ token: 'viejo' });
    const fetchMock = mockFetch(jsonResponse({ user: sampleUser, token: 'jwt', expiresIn: 3600 }));
    const result = await authService.login({ email: '  camila@kunapet.com ', password: 'UnaClaveLarga123' });

    const call = fetchMock.mock.calls[0];
    expect(call?.[0]).toBe('http://localhost:3000/api/v1/auth/login');
    expect(call?.[1]?.method).toBe('POST');
    expect(call && fetchBody(call)).toEqual({ email: 'camila@kunapet.com', password: 'UnaClaveLarga123' });
    expect(call && fetchHeaders(call).has('Authorization')).toBe(false);
    expect(result).toEqual({ user: sampleUser, token: 'jwt', expiresIn: 3600 });
  });

  it('login: propaga el ApiError del servidor', async () => {
    mockFetch(errorResponse(401, 'unauthorized', 'Correo o contraseña incorrectos.'));
    await expect(authService.login({ email: 'a@b.co', password: 'x' })).rejects.toMatchObject({
      status: 401,
      code: 'unauthorized',
    });
  });

  it('register: envía name, email, password y role; omite el teléfono vacío', async () => {
    const fetchMock = mockFetch(jsonResponse({ user: sampleUser }, 201));
    await authService.register({ name: ' Camila ', email: 'c@x.com', password: 'UnaClaveLarga123', role: 'provider', phone: '  ' });
    const call = fetchMock.mock.calls[0];
    expect(call?.[0]).toBe('http://localhost:3000/api/v1/auth/register');
    expect(call && fetchBody(call)).toEqual({ name: 'Camila', email: 'c@x.com', password: 'UnaClaveLarga123', role: 'provider' });
  });

  it('getProfile: GET /auth/me con el token del store', async () => {
    useAuthStore.setState({ token: 'jwt-actual' });
    const fetchMock = mockFetch(jsonResponse({ user: sampleUser }));
    expect(await authService.getProfile()).toEqual({ user: sampleUser });
    const call = fetchMock.mock.calls[0];
    expect(call?.[0]).toBe('http://localhost:3000/api/v1/auth/me');
    expect(call && fetchHeaders(call).get('Authorization')).toBe('Bearer jwt-actual');
  });

  it('login: una respuesta sin token → ApiError invalid_response (no se asume correcta)', async () => {
    mockFetch(jsonResponse({ user: sampleUser, expiresIn: 3600 }));
    const err: unknown = await authService.login({ email: 'a@b.co', password: 'x' }).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({ code: 'invalid_response' });
  });

  it('login: un rol desconocido → invalid_response', async () => {
    mockFetch(jsonResponse({ user: { ...sampleUser, role: 'superadmin' }, token: 't', expiresIn: 1 }));
    await expect(authService.login({ email: 'a@b.co', password: 'x' })).rejects.toMatchObject({ code: 'invalid_response' });
  });

  it('register y getProfile: usuario incompleto → invalid_response', async () => {
    mockFetch(jsonResponse({ user: { id: 'u1' } }, 201), jsonResponse({ user: null }));
    await expect(authService.register({ name: 'C', email: 'c@x.com', password: 'UnaClaveLarga123', role: 'client' })).rejects.toMatchObject({ code: 'invalid_response' });
    await expect(authService.getProfile()).rejects.toMatchObject({ code: 'invalid_response' });
  });
});
