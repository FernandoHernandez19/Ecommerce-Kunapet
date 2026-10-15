import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import useAuthStore from '../store/useAuthStore';
import { errorResponse, fetchBody, first, jsonResponse, mockFetch, sampleUser } from '../test/helpers';
import Login from './Login';

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/" element={<p>Inicio</p>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </MemoryRouter>,
  );
}

const emailField = () => screen.getByLabelText(/Correo electrónico/);
const passwordField = () => screen.getByLabelText(/Contraseña/);
const submit = () => fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

describe('Formulario de login', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false, sessionStatus: 'ready', error: null });
  });

  it('con los campos vacíos muestra los errores y no llama a la API', () => {
    const fetchMock = mockFetch();
    renderLogin();

    submit();

    expect(screen.getByText('El correo electrónico es obligatorio.')).toBeInTheDocument();
    expect(screen.getByText('La contraseña es obligatoria.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rechaza un correo con formato inválido antes de llamar a la API', () => {
    const fetchMock = mockFetch();
    renderLogin();

    fireEvent.change(emailField(), { target: { value: 'no-es-un-correo' } });
    fireEvent.change(passwordField(), { target: { value: 'una-clave-larga' } });
    submit();

    expect(screen.getByText('Ingresa un correo válido (ej: nombre@ejemplo.com).')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('con credenciales incorrectas muestra el mensaje del servidor en una alerta', async () => {
    mockFetch(errorResponse(401, 'unauthorized', 'Credenciales inválidas'));
    renderLogin();

    fireEvent.change(emailField(), { target: { value: 'camila@kunapet.com' } });
    fireEvent.change(passwordField(), { target: { value: 'clave-equivocada' } });
    submit();

    expect(await screen.findByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos.');
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('con credenciales correctas guarda la sesión y vuelve al inicio', async () => {
    const fetchMock = mockFetch(jsonResponse({ user: sampleUser, token: 'jwt-ok', expiresIn: 3600 }));
    renderLogin();

    fireEvent.change(emailField(), { target: { value: 'camila@kunapet.com' } });
    fireEvent.change(passwordField(), { target: { value: 'clave-correcta' } });
    submit();

    expect(await screen.findByText('Inicio')).toBeInTheDocument();
    await waitFor(() => expect(useAuthStore.getState().token).toBe('jwt-ok'));
    expect(fetchBody(first(fetchMock.mock.calls))).toEqual({ email: 'camila@kunapet.com', password: 'clave-correcta' });
  });

  it('el botón del ojo alterna la visibilidad de la contraseña', () => {
    renderLogin();
    expect(passwordField()).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByRole('button', { name: /contraseña/i }));
    expect(passwordField()).toHaveAttribute('type', 'text');
  });
});
