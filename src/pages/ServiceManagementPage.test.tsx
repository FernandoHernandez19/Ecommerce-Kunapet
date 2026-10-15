import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import useAuthStore from '../store/useAuthStore';
import type { Item, User } from '@/types/api';
import { apiItem, apiService, errorResponse, jsonResponse, page as basePage, routeFetch, sampleUser } from '../test/helpers';

// El servidor devuelve meta.limit = el limit pedido (la pantalla pide 100).
const page = (data: Item[], total = data.length) => basePage(data, total, { limit: 100 });
import ServiceManagementPage from './ServiceManagementPage';

const provider: User = { ...sampleUser, id: 'prov-1', role: 'provider', name: 'Spa Pelusa' };
const mine = (id: string, title: string, extra: Partial<Item> = {}) => apiService({ id, title, providerId: 'prov-1', provider: { id: 'prov-1', name: 'Spa Pelusa', avatarUrl: null }, ...extra });

const renderPage = () => render(<MemoryRouter><ServiceManagementPage /></MemoryRouter>);

const card = (title: string): HTMLElement => {
  const found = screen.getByRole('heading', { name: title }).closest<HTMLElement>('div[class*="rounded-3xl"]');
  if (!found) throw new Error(`No se encontró la tarjeta de «${title}»`);
  return found;
};

/** El body que registró routeFetch es `unknown`: lo leemos como objeto plano. */
const bodyOf = (body: unknown): Record<string, unknown> => (typeof body === 'object' && body !== null ? Object.fromEntries(Object.entries(body)) : {});

describe('Gestión de servicios del proveedor', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: provider, token: 'jwt', isAuthenticated: true, sessionStatus: 'ready' });
  });

  it('lista SOLO los servicios del proveedor (no los de otros ni los productos)', async () => {
    const { calls } = routeFetch(() =>
      page([
        mine('s1', 'Paseo grupal', { category: 'paseos' }),
        mine('s2', 'Grooming completo'),
        apiService({ id: 'x1', title: 'Servicio ajeno', providerId: 'prov-2', provider: { id: 'prov-2', name: 'Otro', avatarUrl: null } }),
        apiItem({ id: 'p1', title: 'Producto propio', providerId: 'prov-1', provider: { id: 'prov-1', name: 'Spa Pelusa', avatarUrl: null } }),
      ], 4),
    );
    renderPage();
    expect(screen.getByRole('status', { name: 'Cargando servicios' })).toBeInTheDocument();
    expect(await screen.findByText('Paseo grupal')).toBeInTheDocument();
    expect(screen.getByText('Grooming completo')).toBeInTheDocument();
    expect(screen.queryByText('Servicio ajeno')).not.toBeInTheDocument();
    expect(screen.queryByText('Producto propio')).not.toBeInTheDocument();
    expect(screen.getByText('2 servicios en tu catálogo')).toBeInTheDocument();
    expect(calls[0].url.searchParams.get('limit')).toBe('100');
  });

  it('estado vacío y error con "Reintentar"', async () => {
    let n = 0;
    routeFetch(() => { n += 1; return n === 1 ? errorResponse(500, 'internal_error', 'x') : page([], 0); });
    renderPage();
    const alert = await screen.findByRole('alert');
    fireEvent.click(within(alert).getByRole('button', { name: 'Reintentar' }));
    expect(await screen.findByText('Aún no tienes servicios')).toBeInTheDocument();
  });

  it('crea un servicio: valida, envía POST /items con céntimos y lo agrega a la lista', async () => {
    const created = mine('new-1', 'Paseo nocturno', { category: 'paseos', priceCents: 3050, durationMinutes: 45 });
    const { calls } = routeFetch(({ method }) => (method === 'POST' ? jsonResponse({ data: created }, 201) : page([], 0)));
    renderPage();
    await screen.findByText('Aún no tienes servicios');

    fireEvent.click(screen.getByRole('button', { name: /Nuevo Servicio/ }));
    // Validación local antes de llamar a la API
    fireEvent.click(screen.getByRole('button', { name: 'Crear servicio' }));
    expect(await screen.findByText('El título debe tener al menos 2 caracteres.')).toBeInTheDocument();
    expect(calls.filter((c) => c.method === 'POST')).toHaveLength(0);

    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Paseo nocturno' } });
    fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Paseo de 45 minutos' } });
    fireEvent.change(screen.getByLabelText('Categoría'), { target: { value: 'Paseos' } });
    fireEvent.change(screen.getByLabelText('Precio (S/)'), { target: { value: '30.50' } });
    fireEvent.change(screen.getByLabelText('Duración (min)'), { target: { value: '45' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear servicio' }));

    expect(await screen.findByText('Paseo nocturno')).toBeInTheDocument();
    const post = calls.find((c) => c.method === 'POST');
    expect(post?.path).toBe('/items');
    expect(post?.body).toEqual({ type: 'service', title: 'Paseo nocturno', description: 'Paseo de 45 minutos', category: 'paseos', priceCents: 3050, durationMinutes: 45 });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('un error de la API al crear se muestra dentro del modal', async () => {
    routeFetch(({ method }) => (method === 'POST' ? errorResponse(403, 'forbidden', 'x') : page([], 0)));
    renderPage();
    await screen.findByText('Aún no tienes servicios');
    fireEvent.click(screen.getByRole('button', { name: /Nuevo Servicio/ }));
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Paseo' } });
    fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'd' } });
    fireEvent.change(screen.getByLabelText('Precio (S/)'), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear servicio' }));
    expect(await screen.findByText('No tienes permiso para realizar esta acción.')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('desactiva un servicio con el interruptor (PATCH isActive:false)', async () => {
    const { calls } = routeFetch(({ method, body }) =>
      method === 'PATCH' ? jsonResponse({ data: mine('s1', 'Paseo grupal', { isActive: bodyOf(body).isActive === true }) }) : page([mine('s1', 'Paseo grupal')], 1),
    );
    renderPage();
    await screen.findByText('Paseo grupal');
    const toggle = screen.getByRole('switch', { name: /Desactivar Paseo grupal/ });
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(toggle);
    await waitFor(() => expect(screen.getByRole('switch', { name: /Activar Paseo grupal/ })).toHaveAttribute('aria-checked', 'false'));
    const patch = calls.find((c) => c.method === 'PATCH');
    expect(patch).toMatchObject({ path: '/items/s1', body: { isActive: false } });
    expect(within(card('Paseo grupal')).getByText('Inactivo')).toBeInTheDocument();
  });

  it('"eliminar" pide confirmación y llama a DELETE (la API desactiva): el servicio queda inactivo', async () => {
    const { calls } = routeFetch(({ method }) => (method === 'DELETE' ? new Response(null, { status: 204 }) : page([mine('s1', 'Paseo grupal')], 1)));
    renderPage();
    await screen.findByText('Paseo grupal');
    fireEvent.click(screen.getByRole('button', { name: 'Desactivar Paseo grupal' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Sí, desactivar' }));
    await waitFor(() => expect(within(card('Paseo grupal')).getByText('Inactivo')).toBeInTheDocument());
    expect(calls.find((c) => c.method === 'DELETE')).toMatchObject({ path: '/items/s1' });
  });

  it('acción masiva con error parcial: PATCH secuenciales, refleja solo lo confirmado y deja los fallidos seleccionados', async () => {
    const order: string[] = [];
    const { calls } = routeFetch(({ method, path, body }) => {
      if (method === 'PATCH') {
        order.push(path);
        if (path === '/items/s2') return errorResponse(500, 'internal_error', 'x');
        return jsonResponse({ data: mine((path.split('/').pop() ?? ''), path === '/items/s1' ? 'Paseo grupal' : 'Baño', { isActive: bodyOf(body).isActive === true }) });
      }
      return page([mine('s1', 'Paseo grupal'), mine('s2', 'Grooming completo'), mine('s3', 'Baño')], 3);
    });
    renderPage();
    await screen.findByText('Paseo grupal');

    fireEvent.click(screen.getByRole('button', { name: /Selección múltiple/ }));
    for (const t of ['Paseo grupal', 'Grooming completo', 'Baño']) fireEvent.click(card(t));
    fireEvent.click(screen.getByRole('button', { name: /Cambiar Disponibilidad/ }));
    fireEvent.click(screen.getByRole('button', { name: /Marcar como Inactivos/ }));

    const banner = await screen.findByRole('alert');
    expect(banner).toHaveTextContent('Servicios desactivados: 2 de 3');
    expect(banner).toHaveTextContent('«Grooming completo»');
    expect(order).toEqual(['/items/s1', '/items/s2', '/items/s3']); // en orden, de uno en uno
    expect(calls.filter((c) => c.method === 'PATCH')).toHaveLength(3);

    // La interfaz refleja lo confirmado por la API: s1 y s3 inactivos, s2 sigue activo
    expect(within(card('Paseo grupal')).getByText('Inactivo')).toBeInTheDocument();
    expect(within(card('Baño')).getByText('Inactivo')).toBeInTheDocument();
    expect(within(card('Grooming completo')).queryByText('Inactivo')).not.toBeInTheDocument();
    // El fallido sigue seleccionado para reintentar
    expect(screen.getByText('Seleccionados').previousSibling).toHaveTextContent('1');
  });

  it('acción masiva de precios: aplica el porcentaje en céntimos a cada servicio', async () => {
    const { calls } = routeFetch(({ method, path, body }) => {
      if (method === 'PATCH') return jsonResponse({ data: mine((path.split('/').pop() ?? ''), 'Paseo grupal', { priceCents: Number(bodyOf(body).priceCents) }) });
      return page([mine('s1', 'Paseo grupal', { priceCents: 2500 })], 1);
    });
    renderPage();
    await screen.findByText('Paseo grupal');
    fireEvent.click(screen.getByRole('button', { name: /Selección múltiple/ }));
    fireEvent.click(card('Paseo grupal'));
    fireEvent.click(screen.getByRole('button', { name: /Actualizar Precios/ }));
    fireEvent.change(screen.getByPlaceholderText('Ej: 10'), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar Cambios' }));
    await screen.findByText('S/ 27.50');
    expect(calls.find((c) => c.method === 'PATCH')?.body).toEqual({ priceCents: 2750 });
  });

  it('rechaza una acción masiva de más de 20 servicios sin llamar a la API', async () => {
    const many = Array.from({ length: 21 }, (_, i) => mine(`s${i}`, `Servicio ${i}`));
    const { calls } = routeFetch(() => page(many, 21));
    renderPage();
    await screen.findByText('Servicio 0');
    fireEvent.click(screen.getByRole('button', { name: /Selección múltiple/ }));
    for (const s of many) fireEvent.click(card(s.title));
    fireEvent.click(screen.getByRole('button', { name: /Cambiar Disponibilidad/ }));
    fireEvent.click(screen.getByRole('button', { name: /Marcar como Inactivos/ }));
    expect(await screen.findByText(/como máximo 20 servicios/)).toBeInTheDocument();
    expect(calls.filter((c) => c.method === 'PATCH')).toHaveLength(0);
  });
});
