import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import useAuthStore from '../store/useAuthStore';
import { sampleUser } from '../test/helpers';
import ProtectedRoute, { PublicOnlyRoute } from './ProtectedRoute';

const setSession = (patch) =>
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false, sessionStatus: 'ready', ...patch });

function renderAt(path, allowedRoles) {
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
    renderAt('/secreto', undefined);
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
  });
});

describe('PublicOnlyRoute', () => {
  beforeEach(() => setSession({}));

  it('espera la verificación antes de decidir (sin parpadeo del login)', () => {
    setSession({ user: sampleUser, token: 't', isAuthenticated: true, sessionStatus: 'verifying' });
    renderAt('/login');
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Pantalla de login')).not.toBeInTheDocument();
  });

  it('un usuario autenticado es enviado a su panel', () => {
    setSession({ user: sampleUser, token: 't', isAuthenticated: true });
    renderAt('/login');
    expect(screen.getByText('Panel del cliente')).toBeInTheDocument();
  });

  it('un visitante ve la pantalla pública', () => {
    renderAt('/login');
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument();
  });
});
