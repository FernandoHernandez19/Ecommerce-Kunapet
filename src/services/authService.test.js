import { beforeEach, describe, expect, it } from 'vitest';
import useAuthStore from '../store/useAuthStore';
import { errorResponse, fetchHeaders, jsonResponse, mockFetch, sampleUser } from '../test/helpers';
import * as authService from './authService';

describe('authService', () => {
  beforeEach(() => useAuthStore.setState({ user: null, token: null, isAuthenticated: false, sessionStatus: 'ready' }));

  it('login: POST /auth/login con el correo recortado, sin Authorization', async () => {
    useAuthStore.setState({ token: 'viejo' });
    const fetchMock = mockFetch(jsonResponse({ user: sampleUser, token: 'jwt', expiresIn: 3600 }));
    const result = await authService.login({ email: '  camila@kunapet.com ', password: 'UnaClaveLarga123' });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:3000/api/v1/auth/login');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({ email: 'camila@kunapet.com', password: 'UnaClaveLarga123' });
    expect(fetchHeaders(fetchMock.mock.calls[0]).has('Authorization')).toBe(false);
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
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:3000/api/v1/auth/register');
    expect(JSON.parse(init.body)).toEqual({ name: 'Camila', email: 'c@x.com', password: 'UnaClaveLarga123', role: 'provider' });
  });

  it('getProfile: GET /auth/me con el token del store', async () => {
    useAuthStore.setState({ token: 'jwt-actual' });
    const fetchMock = mockFetch(jsonResponse({ user: sampleUser }));
    expect(await authService.getProfile()).toEqual({ user: sampleUser });
    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:3000/api/v1/auth/me');
    expect(fetchHeaders(fetchMock.mock.calls[0]).get('Authorization')).toBe('Bearer jwt-actual');
  });
});
