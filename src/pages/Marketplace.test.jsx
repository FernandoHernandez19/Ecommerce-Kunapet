import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import { apiItem, apiService, errorResponse, page, routeFetch } from '../test/helpers';
import Marketplace from './Marketplace';

const renderMarketplace = (url = '/marketplace') =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Marketplace />
    </MemoryRouter>,
  );

describe('Marketplace conectado a la API', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false, sessionStatus: 'ready' });
    useCartStore.setState({ items: [], isOpen: false });
  });

  it('muestra el esqueleto de carga y luego los items (precio en soles, sin estrellas)', async () => {
    const { calls } = routeFetch(() => page([apiItem(), apiService()], 2));
    renderMarketplace();
    expect(screen.getByRole('status', { name: 'Cargando resultados' })).toBeInTheDocument();

    expect(await screen.findByText('Alimento NutriCan 15kg')).toBeInTheDocument();
    expect(screen.getByText('Baño y Corte')).toBeInTheDocument();
    expect(screen.getByText('S/ 145.50')).toBeInTheDocument();
    expect(screen.getByText('S/ 45.00')).toBeInTheDocument();
    expect(screen.getByText(/Mostrando/)).toHaveTextContent('Mostrando 2 de 2 resultados');
    // Sin calificaciones ni reseñas en la API: no se muestran
    expect(screen.queryByText(/reseñas/)).not.toBeInTheDocument();
    expect(calls).toHaveLength(1);
    expect(calls[0].path).toBe('/items');
    expect(calls[0].url.searchParams.get('page')).toBe('1');
    expect(calls[0].url.searchParams.get('limit')).toBe('12');
  });

  it('estado vacío con mensaje útil y "Limpiar filtros" cuando hay filtros', async () => {
    routeFetch(() => page([], 0));
    renderMarketplace('/marketplace?q=zzz');
    expect(await screen.findByText('No encontramos resultados')).toBeInTheDocument();
    expect(screen.getByText('Prueba con otros filtros o quita la búsqueda.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Limpiar filtros' })).toBeInTheDocument();
  });

  it('error con botón "Reintentar" que vuelve a pedir y muestra los datos', async () => {
    let attempt = 0;
    const { calls } = routeFetch(() => {
      attempt += 1;
      return attempt === 1 ? errorResponse(500, 'internal_error', 'Error interno del servidor.') : page([apiItem()], 1);
    });
    renderMarketplace();
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Ocurrió un error inesperado');
    fireEvent.click(within(alert).getByRole('button', { name: 'Reintentar' }));
    expect(await screen.findByText('Alimento NutriCan 15kg')).toBeInTheDocument();
    expect(calls).toHaveLength(2);
  });

  it('envía al servidor q (URL), type, category y rango de precio en céntimos', async () => {
    const { calls } = routeFetch(() => page([apiItem()], 1));
    renderMarketplace('/marketplace?q=bano&category=Grooming');
    await screen.findByText('Alimento NutriCan 15kg');
    expect(calls[0].url.searchParams.get('q')).toBe('bano');
    expect(calls[0].url.searchParams.get('category')).toBe('grooming');

    fireEvent.click(screen.getByRole('button', { name: 'Servicios' }));
    fireEvent.change(screen.getByLabelText('Mín'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Máx'), { target: { value: '60.5' } });
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar Filtros' }));

    await waitFor(() => expect(calls.length).toBe(2));
    const params = calls[1].url.searchParams;
    expect(params.get('type')).toBe('service');
    expect(params.get('minPriceCents')).toBe('1000');
    expect(params.get('maxPriceCents')).toBe('6050');
    expect(params.get('q')).toBe('bano');
  });

  it('no aplica un rango de precio inválido', async () => {
    const { calls } = routeFetch(() => page([apiItem()], 1));
    renderMarketplace();
    await screen.findByText('Alimento NutriCan 15kg');
    fireEvent.change(screen.getByLabelText('Mín'), { target: { value: '50' } });
    fireEvent.change(screen.getByLabelText('Máx'), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar Filtros' }));
    expect(await screen.findByText('El precio mínimo no puede superar al máximo.')).toBeInTheDocument();
    expect(calls).toHaveLength(1);
  });

  it('"Cargar más" pide la página siguiente, agrega sin duplicar y desaparece al terminar', async () => {
    const second = apiService({ id: '33333333-3333-4333-8333-333333333333', title: 'Paseo grupal' });
    const { calls } = routeFetch(({ url }) =>
      url.searchParams.get('page') === '1' ? page([apiItem()], 2) : page([apiItem(), second], 2, { page: 2 }),
    );
    renderMarketplace();
    await screen.findByText('Alimento NutriCan 15kg');
    expect(screen.getByText(/Mostrando/)).toHaveTextContent('Mostrando 1 de 2 resultados');

    const more = screen.getByRole('button', { name: /Cargar más resultados/ });
    fireEvent.click(more);
    fireEvent.click(more); // doble clic: no debe duplicar la petición
    expect(await screen.findByText('Paseo grupal')).toBeInTheDocument();
    expect(calls.map((c) => c.url.searchParams.get('page'))).toEqual(['1', '2']);
    expect(screen.getAllByText('Alimento NutriCan 15kg')).toHaveLength(1);
    expect(screen.queryByRole('button', { name: /Cargar más resultados/ })).not.toBeInTheDocument();
  });

  it('"Añadir" en un producto lo agrega al carrito con su id real y precio en céntimos', async () => {
    routeFetch(() => page([apiItem()], 1));
    renderMarketplace();
    await screen.findByText('Alimento NutriCan 15kg');
    fireEvent.click(screen.getByRole('button', { name: /Añadir/ }));
    expect(useCartStore.getState().items).toEqual([
      expect.objectContaining({ id: '11111111-1111-4111-8111-111111111111', type: 'product', priceCents: 14550, quantity: 1, provider: 'PetShop Central' }),
    ]);
  });
});
