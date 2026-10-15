import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useAuthStore from '../store/useAuthStore';
import { z } from 'zod';
import type { User } from '@/types/api';
import { fetchBody, jsonResponse, mockFetch, sampleUser } from '../test/helpers';
import Login from './Login';

const credentialsSchema = z.object({ email: z.string(), password: z.string(), role: z.string() });

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/clientdashboard" element={<p>Panel del cliente</p>} />
        <Route path="/providerdashboard" element={<p>Panel del proveedor</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('acceso de invitado', () => {
  beforeEach(() => useAuthStore.setState({ user: null, token: null, isAuthenticated: false, sessionStatus: 'ready', error: null }));

  it('no muestra los botones si VITE_ENABLE_GUEST no es "true"', () => {
    renderLogin();
    expect(screen.queryByText('Entrar como cliente de prueba')).not.toBeInTheDocument();
    vi.stubEnv('VITE_ENABLE_GUEST', 'false');
    renderLogin();
    expect(screen.queryByText('Entrar como proveedor de prueba')).not.toBeInTheDocument();
  });

  it('registra y entra con credenciales aleatorias que no se exponen', async () => {
    vi.stubEnv('VITE_ENABLE_GUEST', 'true');
    const fetchMock = mockFetch(
      jsonResponse({ user: { ...sampleUser, role: 'client' } }, 201),
      jsonResponse({ user: { ...sampleUser, role: 'client' }, token: 'jwt-invitado', expiresIn: 3600 }),
    );
    const { container } = renderLogin();
    fireEvent.click(screen.getByText('Entrar como cliente de prueba'));

    await screen.findByText('Panel del cliente');
    const [registerCall, loginCall] = fetchMock.mock.calls;
    if (!registerCall || !loginCall) throw new Error('Se esperaban dos llamadas (registro y login)');
    expect(String(registerCall[0])).toMatch(/\/auth\/register$/);
    expect(String(loginCall[0])).toMatch(/\/auth\/login$/);
    const registered = credentialsSchema.parse(fetchBody(registerCall));
    const loggedIn = fetchBody(loginCall);
    expect(registered).toMatchObject({ role: 'client' });
    expect(registered.email).toMatch(/^invitado-[0-9a-f]{16}@demo\.kunapet\.test$/);
    expect(loggedIn).toEqual({ email: registered.email, password: registered.password });

    // Ni la pantalla ni localStorage contienen la contraseña.
    expect(container.textContent).not.toContain(registered.password);
    expect(localStorage.getItem('kunapet-auth')).not.toContain(registered.password);
    expect(useAuthStore.getState().token).toBe('jwt-invitado');
  });

  it('el botón de proveedor registra con role provider', async () => {
    vi.stubEnv('VITE_ENABLE_GUEST', 'true');
    const providerUser: User = { ...sampleUser, role: 'provider' };
    const fetchMock = mockFetch(
      jsonResponse({ user: providerUser }, 201),
      jsonResponse({ user: providerUser, token: 'jwt-p', expiresIn: 3600 }),
    );
    renderLogin();
    fireEvent.click(screen.getByText('Entrar como proveedor de prueba'));
    await waitFor(() => expect(screen.getByText('Panel del proveedor')).toBeInTheDocument());
    const registerCall = fetchMock.mock.calls[0];
    if (!registerCall) throw new Error('Se esperaba la llamada de registro');
    expect(fetchBody(registerCall)).toMatchObject({ role: 'provider' });
  });
});
