import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import usePetsStore from '../store/usePetsStore';
import { apiPet, errorResponse, first, jsonResponse, routeFetch } from '../test/helpers';
import AddPetWizard from './AddPetWizard';

function renderWizard() {
  return render(
    <MemoryRouter initialEntries={['/add-pet']}>
      <Routes>
        <Route path="/add-pet" element={<AddPetWizard />} />
        <Route path="/clientdashboard" element={<p>Panel del cliente</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

const next = () => fireEvent.click(screen.getByRole('button', { name: /Siguiente/ }));
const save = () => fireEvent.click(screen.getByRole('button', { name: /Guardar mascota/ }));

describe('Asistente para agregar una mascota', () => {
  beforeEach(() => {
    usePetsStore.getState().reset();
  });

  it('el primer paso exige nombre y especie antes de avanzar', () => {
    renderWizard();

    next();
    expect(screen.getByRole('alert')).toHaveTextContent('El nombre de la mascota es obligatorio.');

    fireEvent.change(screen.getByLabelText(/Nombre de la Mascota/), { target: { value: 'Rex' } });
    next();
    expect(screen.getByRole('alert')).toHaveTextContent('Selecciona la especie de tu mascota.');
    expect(screen.queryByRole('button', { name: /Guardar mascota/ })).not.toBeInTheDocument();
  });

  it('rechaza una fecha de nacimiento futura', () => {
    renderWizard();

    fireEvent.change(screen.getByLabelText(/Nombre de la Mascota/), { target: { value: 'Rex' } });
    fireEvent.click(screen.getByRole('button', { name: /Perro/ }));
    fireEvent.change(screen.getByLabelText(/Fecha de Nacimiento/), { target: { value: '2999-01-01' } });
    next();

    expect(screen.getByRole('alert')).toHaveTextContent('La fecha de nacimiento no puede ser futura.');
  });

  it('completa los dos pasos, envía POST /pets con el body adaptado y vuelve al panel', async () => {
    const { calls } = routeFetch(({ method }) => (method === 'POST' ? jsonResponse({ data: apiPet({ id: 'p9', name: 'Rex', species: 'dog' }) }, 201) : undefined));
    renderWizard();

    fireEvent.change(screen.getByLabelText(/Nombre de la Mascota/), { target: { value: 'Rex' } });
    fireEvent.click(screen.getByRole('button', { name: /Perro/ }));
    fireEvent.change(screen.getByLabelText(/Raza/), { target: { value: 'Labrador' } });
    next();

    fireEvent.change(screen.getByLabelText(/Peso Aproximado/), { target: { value: '12.5' } });
    fireEvent.change(screen.getByLabelText(/Alergias conocidas/), { target: { value: 'Pollo' } });
    save();

    expect(await screen.findByText('Panel del cliente')).toBeInTheDocument();
    expect(calls).toHaveLength(1);
    expect(first(calls)).toMatchObject({
      method: 'POST',
      path: '/pets',
      body: { name: 'Rex', species: 'dog', breed: 'Labrador', weightGrams: 12500 },
    });
    expect(usePetsStore.getState().pets.map((p) => p.id)).toEqual(['p9']);
  });

  it('un error de la API se muestra en una alerta y el asistente sigue en el último paso', async () => {
    routeFetch(({ method }) => (method === 'POST' ? errorResponse(403, 'forbidden', 'x') : undefined));
    renderWizard();

    fireEvent.change(screen.getByLabelText(/Nombre de la Mascota/), { target: { value: 'Rex' } });
    fireEvent.click(screen.getByRole('button', { name: /Gato/ }));
    next();
    save();

    expect(await screen.findByRole('alert')).toHaveTextContent('No tienes permiso para realizar esta acción.');
    expect(screen.getByRole('button', { name: /Guardar mascota/ })).toBeEnabled();
    expect(screen.queryByText('Panel del cliente')).not.toBeInTheDocument();
  });

  it('«Atrás» vuelve al primer paso conservando lo escrito', () => {
    renderWizard();

    fireEvent.change(screen.getByLabelText(/Nombre de la Mascota/), { target: { value: 'Rex' } });
    fireEvent.click(screen.getByRole('button', { name: /Perro/ }));
    next();
    fireEvent.click(screen.getByRole('button', { name: 'Atrás' }));

    expect(screen.getByLabelText(/Nombre de la Mascota/)).toHaveValue('Rex');
  });
});
