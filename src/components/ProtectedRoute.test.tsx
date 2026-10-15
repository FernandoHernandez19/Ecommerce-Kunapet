import { act, fireEvent, render, screen } from '@testing-library/react';
import type { Role } from '@/types/api';
import type { AuthStore } from '../store/useAuthStore';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useAuthStore from '../store/useAuthStore';
import { errorResponse, jsonResponse, mockFetch, sampleUser } from '../test/helpers';
import ServerWakingNotice from './ServerWakingNotice';
import { SLOW_AFTER_MS } from '../store/useServerStatusStore';
import ProtectedRoute, { PublicOnlyRoute } from './ProtectedRoute';

const setSession = (patch: Partial<Pick<AuthStore, 'user' | 'token' | 'isAuthenticated' | 'sessionStatus'>>): void => {
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false, sessionStatus: 'ready', ...patch });
};

function renderAt(path: string, allowedRoles?: readonly Role[]) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<PublicOnlyRoute><p>Pantalla de login</p></PublicOnlyRoute>} />
        <Route path="/unauthorized" element={<p>No autorizado</p>} />
        <Route path="/clientdashboard" element={<p>Panel del cliente</p>} />
        <Route path="/secreto" element={<ProtectedRoute allowedRoles={allowedRoles}><p>Contenido protegido</p></ProtectedRoute>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => setSession({}));

  it('mientras verifica la sesión muestra "verificando" y no redirige', () => {
    setSession({ user: sampleUser, token: 't', isAuthenticated: true, sessionStatus: 'verifying' });
    renderAt('/secreto', ['client']);
    expect(screen.getByRole('status')).toHaveTextContent('Verificando tu sesión');
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
    expect(screen.queryByText('Pantalla de login')).not.toBeInTheDocument();
  });

  it('sin sesión redirige a /login', () => {
    renderAt('/secreto', ['client']);
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument();
  });

  it('con un rol incorrecto redirige a /unauthorized', () => {
    setSession({ user: { ...sampleUser, role: 'provider' }, token: 't', isAuthenticated: true });
    renderAt('/secreto', ['client']);
    expect(screen.getByText('No autorizado')).toBeInTheDocument();
  });

  it('con el rol correcto muestra el contenido', () => {
    setSession({ user: sampleUser, token: 't', isAuthenticated: true });
    renderAt('/secreto', ['client']);
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
  });

  it('sin roles definidos permite a cualquier usuario autenticado', () => {
    setSession({ user: { ...sampleUser, role: 'admin' }, token: 't', isAuthenticated: true });
    renderAt('/secreto');
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
  });
});

describe('PublicOnlyRoute', () => {
  beforeEach(() => setSession({}));

  it('espera la verificación antes de decidir (sin parpadeo del login)', () => {
    setSession({ user: sampleUser, token: 't', isAuthenticated: true, sessionStatus: 'verifying' });
    renderAt('/login', []);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Pantalla de login')).not.toBeInTheDocument();
  });

  it('un usuario autenticado es enviado a su panel', () => {
    setSession({ user: sampleUser, token: 't', isAuthenticated: true });
    renderAt('/login', []);
    expect(screen.getByText('Panel del cliente')).toBeInTheDocument();
  });

  it('un visitante ve la pantalla pública', () => {
    renderAt('/login', []);
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument();
  });
});

describe('verificación de sesión con fallos de red', () => {
  beforeEach(() => setSession({}));

  it('tras un fallo de red conserva la sesión y muestra «Reintentar»; al reintentar entra', async () => {
    setSession({ user: sampleUser, token: 'jwt-guardado', isAuthenticated: true, sessionStatus: 'verifying' });
    mockFetch(() => Promise.reject(new TypeError('x')), jsonResponse({ user: sampleUser }));
    renderAt('/secreto', ['client']);

    await act(async () => {
      await useAuthStore.getState().verifySession();
    });
    expect(screen.getByRole('alert')).toHaveTextContent('No pudimos verificar tu sesión');
    expect(screen.queryByText('Pantalla de login')).not.toBeInTheDocument(); // no la mandó a /login
    expect(useAuthStore.getState().token).toBe('jwt-guardado');

    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(await screen.findByText('Contenido protegido')).toBeInTheDocument();
  });

  it('con 401 en la verificación sí redirige a /login', async () => {
    setSession({ user: sampleUser, token: 'jwt-vencido', isAuthenticated: true, sessionStatus: 'verifying' });
    mockFetch(errorResponse(401, 'unauthorized', 'x'));
    renderAt('/secreto', ['client']);
    await act(async () => {
      await useAuthStore.getState().verifySession();
    });
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument();
  });

  it('si el servidor tarda más de 5 s se muestra el aviso de servidor despertando', async () => {
    vi.useFakeTimers();
    setSession({ user: sampleUser, token: 'jwt-guardado', isAuthenticated: true, sessionStatus: 'verifying' });
    vi.stubGlobal('fetch', vi.fn<typeof fetch>(() => new Promise<Response>(() => undefined))); // nunca responde
    render(
      <MemoryRouter initialEntries={['/secreto']}>
        <ServerWakingNotice />
        <Routes>
          <Route path="/secreto" element={<ProtectedRoute allowedRoles={['client']}><p>Contenido protegido</p></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>,
    );
    void useAuthStore.getState().verifySession();
    expect(screen.queryByText(/servidor gratuito se está despertando/)).not.toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(SLOW_AFTER_MS + 100);
    });
    expect(screen.getByText(/servidor gratuito se está despertando/)).toBeInTheDocument();
    expect(screen.getByText('Verificando tu sesión…')).toBeInTheDocument();
  });
});
