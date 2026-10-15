import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import useCartStore, { type CartItem } from '../store/useCartStore';
import CartDrawer from './CartDrawer';

const alimento: CartItem = {
  id: '11111111-1111-4111-8111-111111111111',
  type: 'product',
  title: 'Alimento NutriCan 15kg',
  priceCents: 1250,
  image: null,
  provider: 'PetShop Central',
  quantity: 2,
};
const paseo: CartItem = {
  id: '22222222-2222-4222-8222-222222222222',
  type: 'service',
  title: 'Paseo de 1 hora',
  priceCents: 3000,
  image: null,
  provider: 'Paseos Felices',
  quantity: 1,
};

function CurrentPath() {
  return <p data-testid="ruta">{useLocation().pathname}</p>;
}

function renderDrawer() {
  return render(
    <MemoryRouter initialEntries={['/marketplace']}>
      <CartDrawer />
      <Routes>
        <Route path="*" element={<CurrentPath />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Carrito lateral', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], isOpen: false });
  });

  it('cerrado no muestra nada', () => {
    useCartStore.setState({ items: [alimento], isOpen: false });
    renderDrawer();
    expect(screen.queryByRole('heading', { name: 'Tu Carrito' })).not.toBeInTheDocument();
  });

  it('vacío muestra el aviso y «Seguir explorando» lo cierra', () => {
    useCartStore.setState({ items: [], isOpen: true });
    renderDrawer();

    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Ir a Pagar' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Seguir explorando' }));
    expect(useCartStore.getState().isOpen).toBe(false);
  });

  it('lista las líneas y muestra el total estimado (productos + envío + tarifa)', () => {
    useCartStore.setState({ items: [alimento, paseo], isOpen: true });
    renderDrawer();

    expect(screen.getByRole('heading', { name: 'Alimento NutriCan 15kg' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Paseo de 1 hora' })).toBeInTheDocument();
    // 2 × 12.50 + 1 × 30.00 = 55.00; envío 15.00 (hay productos); tarifa 2.50
    expect(screen.getByText('Subtotal').nextSibling).toHaveTextContent('S/ 55.00');
    expect(screen.getByText('Envío estimado').nextSibling).toHaveTextContent('S/ 15.00');
    expect(screen.getByText('Tarifa de servicio (estimada)').nextSibling).toHaveTextContent('S/ 2.50');
    expect(screen.getByText('Total estimado').nextSibling).toHaveTextContent('S/ 72.50');
  });

  it('los botones de cantidad cambian la línea y el subtotal', () => {
    useCartStore.setState({ items: [alimento], isOpen: true });
    renderDrawer();

    fireEvent.click(screen.getByRole('button', { name: 'Aumentar cantidad de Alimento NutriCan 15kg' }));
    expect(useCartStore.getState().items[0]?.quantity).toBe(3);
    expect(screen.getByText('Subtotal').nextSibling).toHaveTextContent('S/ 37.50');

    fireEvent.click(screen.getByRole('button', { name: 'Disminuir cantidad de Alimento NutriCan 15kg' }));
    fireEvent.click(screen.getByRole('button', { name: 'Disminuir cantidad de Alimento NutriCan 15kg' }));
    expect(useCartStore.getState().items[0]?.quantity).toBe(1);
    expect(screen.getByText('Subtotal').nextSibling).toHaveTextContent('S/ 12.50');
  });

  it('eliminar quita la línea; sin líneas aparece el estado vacío', () => {
    useCartStore.setState({ items: [paseo], isOpen: true });
    renderDrawer();

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Paseo de 1 hora del carrito' }));

    expect(useCartStore.getState().items).toEqual([]);
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
  });

  it('«Ir a Pagar» cierra el carrito y navega al checkout', () => {
    useCartStore.setState({ items: [alimento], isOpen: true });
    renderDrawer();

    fireEvent.click(screen.getByRole('button', { name: 'Ir a Pagar' }));

    expect(useCartStore.getState().isOpen).toBe(false);
    expect(screen.getByTestId('ruta')).toHaveTextContent('/checkout');
  });

  it('el botón de cerrar (con nombre accesible) cierra el carrito', () => {
    useCartStore.setState({ items: [alimento], isOpen: true });
    renderDrawer();

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar carrito' }));
    expect(useCartStore.getState().isOpen).toBe(false);
  });
});
