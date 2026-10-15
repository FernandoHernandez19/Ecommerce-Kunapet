import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import { errorResponse, jsonResponse, routeFetch, sampleUser } from '../test/helpers';
import CheckoutPage from './CheckoutPage';

const PRODUCT_ID = '11111111-1111-4111-8111-111111111111';
const SERVICE_ID = '22222222-2222-4222-8222-222222222222';

// Pedido tal como lo devolvería el servidor: sus totales son los que la pantalla debe mostrar.
const serverOrder = {
  id: '9a8b7c6d-5e4f-4a3b-9c2d-1e0f9a8b7c6d', clientId: sampleUser.id, status: 'pending_payment', paymentMethod: 'yape',
  items: [
    { itemId: PRODUCT_ID, title: 'Alimento NutriCan 15kg', type: 'product', unitPriceCents: 15000, quantity: 2, lineTotalCents: 30000 },
  ],
  subtotalCents: 30000, shippingCents: 1500, platformFeeCents: 250, totalCents: 31750, currency: 'PEN',
  createdAt: '2025-06-29T19:00:00.000Z', updatedAt: '2025-06-29T19:00:00.000Z',
};

function seedCart() {
  useCartStore.setState({
    items: [
      // El carrito guarda un precio DESACTUALIZADO (145.50); el servidor usa 150.00
      { id: PRODUCT_ID, type: 'product', title: 'Alimento NutriCan 15kg', priceCents: 14550, image: null, provider: 'PetShop', quantity: 2 },
      { id: SERVICE_ID, type: 'service', title: 'Baño y Corte', priceCents: 4500, image: null, provider: 'Spa', quantity: 1 },
    ],
  });
}

const renderCheckout = () => render(<MemoryRouter><CheckoutPage /></MemoryRouter>);

// Avanza por los pasos 1 → 2 → 3 (en jsdom los botones "móviles" y los del resumen existen a la vez).
function goToPayment() {
  fireEvent.click(screen.getAllByRole('button', { name: /Confirmar Carrito|Continuar al Despacho/ })[0]);
  fireEvent.click(screen.getAllByRole('button', { name: /Confirmar Datos de Entrega|Continuar al Pago/ })[0]);
}
const confirm = () => fireEvent.click(screen.getAllByRole('button', { name: /Confirmar pedido/ })[0]);

describe('Checkout con pedidos reales', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: sampleUser, token: 'jwt', isAuthenticated: true, sessionStatus: 'ready' });
    useCartStore.setState({ items: [], isOpen: false });
  });

  it('con el carrito vacío muestra un estado vacío útil', () => {
    renderCheckout();
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ir al marketplace' })).toBeInTheDocument();
  });

  it('usa los items del carrito (nada fijo en el código) y rotula los totales como estimación', () => {
    seedCart();
    renderCheckout();
    expect(screen.getAllByText('Alimento NutriCan 15kg').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Baño y Corte').length).toBeGreaterThan(0);
    expect(screen.queryByText('Paseo de 1 hora')).not.toBeInTheDocument();
    // estimación: 2×145.50 + 45.00 = 336.00 + envío 15.00 + comisión 2.50 = 353.50
    expect(screen.getByText('Total estimado')).toBeInTheDocument();
    expect(screen.getAllByText('S/ 353.50').length).toBeGreaterThan(0);
    expect(screen.getByText(/Es una estimación/)).toBeInTheDocument();
  });

  it('envía SOLO itemId, quantity y paymentMethod; muestra los totales del servidor y vacía el carrito', async () => {
    seedCart();
    const { calls } = routeFetch(({ method }) => (method === 'POST' ? jsonResponse({ data: serverOrder }, 201) : undefined));
    renderCheckout();
    goToPayment();
    fireEvent.click(screen.getByLabelText(/Yape/));
    confirm();

    expect(await screen.findByText('Pedido registrado')).toBeInTheDocument();
    expect(screen.getByText('Pago pendiente (demo sin cobro real)')).toBeInTheDocument();

    expect(calls).toHaveLength(1);
    expect(calls[0]).toMatchObject({ method: 'POST', path: '/orders' });
    expect(calls[0].body).toEqual({
      items: [{ itemId: PRODUCT_ID, quantity: 2 }, { itemId: SERVICE_ID, quantity: 1 }],
      paymentMethod: 'yape',
    });
    expect(JSON.stringify(calls[0].body)).not.toMatch(/price|total|shipping|fee|cents/i);

    // Totales del SERVIDOR (317.50), no la estimación del carrito (353.50)
    expect(screen.getByText('S/ 317.50')).toBeInTheDocument();
    expect(screen.queryByText('S/ 353.50')).not.toBeInTheDocument();
    expect(screen.getByText('#9A8B7C6D')).toBeInTheDocument();
    expect(useCartStore.getState().items).toEqual([]);
  });

  it('usa el método de pago elegido (tarjeta por defecto)', async () => {
    seedCart();
    const { calls } = routeFetch(() => jsonResponse({ data: serverOrder }, 201));
    renderCheckout();
    goToPayment();
    confirm();
    await screen.findByText('Pedido registrado');
    expect(calls[0].body.paymentMethod).toBe('card');
  });

  it('404 por un item: lo quita del carrito, avisa y vuelve al paso 1 sin vaciar el resto', async () => {
    useCartStore.setState({
      items: [
        { id: 'srv-1-2025-06-29-10:00 AM', type: 'service', title: 'Paseo antiguo', price: 25, quantity: 1 }, // formato viejo, sin priceCents
        { id: PRODUCT_ID, type: 'product', title: 'Alimento NutriCan 15kg', priceCents: 14550, quantity: 1 },
      ],
    });
    routeFetch(() => errorResponse(404, 'not_found', 'El item srv-1-2025-06-29-10:00 AM no existe.'));
    renderCheckout();
    goToPayment();
    confirm();

    const alert = await screen.findByText(/Quitamos «Paseo antiguo» del carrito/);
    expect(alert).toBeInTheDocument();
    expect(useCartStore.getState().items.map((i) => i.id)).toEqual([PRODUCT_ID]);
    expect(screen.getByText('Revisa tu carrito')).toBeInTheDocument();
    expect(screen.queryByText('Pedido registrado')).not.toBeInTheDocument();
  });

  it('422 por un item inactivo: lo quita según la posición indicada por el servidor', async () => {
    seedCart();
    routeFetch(() =>
      errorResponse(422, 'unprocessable_entity', 'Uno de los items ya no está disponible.', [{ path: 'items.1.itemId', message: 'El item está inactivo.' }]),
    );
    renderCheckout();
    goToPayment();
    confirm();
    await screen.findByText(/Quitamos «Baño y Corte» del carrito/);
    expect(useCartStore.getState().items.map((i) => i.id)).toEqual([PRODUCT_ID]);
  });

  it('un error genérico se muestra en el paso de pago y conserva el carrito', async () => {
    seedCart();
    routeFetch(() => errorResponse(503, 'service_unavailable', 'x'));
    renderCheckout();
    goToPayment();
    confirm();
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(useCartStore.getState().items).toHaveLength(2);
    expect(screen.getByText('Método de pago')).toBeInTheDocument();
  });

  it('el botón se bloquea mientras se envía (sin pedidos duplicados)', async () => {
    seedCart();
    const { calls } = routeFetch(() => jsonResponse({ data: serverOrder }, 201));
    renderCheckout();
    goToPayment();
    const btn = screen.getAllByRole('button', { name: /Confirmar pedido/ })[0];
    fireEvent.click(btn);
    fireEvent.click(btn);
    await screen.findByText('Pedido registrado');
    expect(calls).toHaveLength(1);
  });
});
