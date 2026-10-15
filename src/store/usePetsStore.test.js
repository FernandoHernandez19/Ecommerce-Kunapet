import { describe, expect, it } from 'vitest';
import { errorResponse, jsonResponse, routeFetch } from '../test/helpers';
import usePetsStore from './usePetsStore';

const apiPet = (o = {}) => ({
  id: 'p1', ownerId: 'u1', name: 'Luna', species: 'dog', breed: 'Golden', gender: 'female', birthDate: '2022-03-15',
  weightGrams: 28000, notes: null, photoUrl: null, createdAt: '2025-01-10T10:00:00.000Z', updatedAt: '2025-01-10T10:00:00.000Z', ...o,
});

describe('usePetsStore (API real)', () => {
  it('fetchPets carga la lista y no usa localStorage', async () => {
    usePetsStore.getState().reset();
    const { calls } = routeFetch(() => ({ data: [apiPet()], meta: { page: 1, limit: 100, total: 1 } }));
    await usePetsStore.getState().fetchPets();
    expect(calls[0].path).toBe('/pets');
    expect(usePetsStore.getState()).toMatchObject({ status: 'ready', error: null });
    expect(usePetsStore.getState().pets[0]).toMatchObject({ name: 'Luna', ageLabel: expect.any(String) });
    expect(localStorage.getItem('kunapet-pets')).toBeNull();
  });

  it('fetchPets con error deja status "error" con mensaje amigable', async () => {
    usePetsStore.getState().reset();
    routeFetch(() => errorResponse(500, 'internal_error', 'x'));
    await usePetsStore.getState().fetchPets();
    expect(usePetsStore.getState()).toMatchObject({ status: 'error', error: 'Ocurrió un error inesperado. Inténtalo de nuevo.' });
  });

  it('crear: POST /pets con el body del wizard adaptado y la mascota queda en la lista', async () => {
    usePetsStore.getState().reset();
    const { calls } = routeFetch(({ method }) => (method === 'POST' ? jsonResponse({ data: apiPet({ id: 'p2', name: 'Rex', species: 'cat' }) }, 201) : undefined));
    const pet = await usePetsStore.getState().addPet({ name: 'Rex', species: 'gato', breed: '', dob: '', weight: '4,5', allergies: 'Pollo', specialNeeds: '', isSterilized: false, vaccines: ['Rabia'] });
    expect(calls[0]).toMatchObject({ method: 'POST', path: '/pets' });
    expect(calls[0].body).toEqual({ name: 'Rex', species: 'cat', weightGrams: 4500, notes: 'Alergias: Pollo\nEsterilizado: No' });
    expect(pet).toMatchObject({ id: 'p2', speciesLabel: 'Gato' });
    expect(usePetsStore.getState().pets.map((p) => p.id)).toEqual(['p2']);
  });

  it('crear con error de la API: lanza ApiError y no agrega nada', async () => {
    usePetsStore.getState().reset();
    routeFetch(() => errorResponse(400, 'validation_error', 'Datos inválidos.', [{ path: 'name', message: 'El nombre es obligatorio.' }]));
    await expect(usePetsStore.getState().addPet({ name: '', species: 'perro' })).rejects.toMatchObject({ status: 400, code: 'validation_error' });
    expect(usePetsStore.getState().pets).toEqual([]);
  });

  it('editar: PATCH /pets/:id y reemplaza la mascota', async () => {
    usePetsStore.setState({ pets: [{ id: 'p1', name: 'Luna' }], status: 'ready' });
    const { calls } = routeFetch(({ method }) => (method === 'PATCH' ? { data: apiPet({ name: 'Luna II' }) } : undefined));
    await usePetsStore.getState().updatePet('p1', { name: 'Luna II', species: 'dog', breed: '', gender: 'female', birthdate: '2022-03-15', notes: '' });
    expect(calls[0]).toMatchObject({ method: 'PATCH', path: '/pets/p1' });
    expect(calls[0].body).toMatchObject({ name: 'Luna II', birthDate: '2022-03-15', notes: null });
    expect(usePetsStore.getState().pets[0].name).toBe('Luna II');
  });

  it('borrar: DELETE /pets/:id solo quita la mascota si la API respondió bien', async () => {
    usePetsStore.setState({ pets: [{ id: 'p1' }, { id: 'p2' }], status: 'ready' });
    const { calls } = routeFetch(({ path }) => (path === '/pets/p1' ? new Response(null, { status: 204 }) : errorResponse(404, 'not_found', 'Mascota no encontrada.')));
    await usePetsStore.getState().removePet('p1');
    expect(calls[0]).toMatchObject({ method: 'DELETE', path: '/pets/p1' });
    expect(usePetsStore.getState().pets.map((p) => p.id)).toEqual(['p2']);

    await expect(usePetsStore.getState().removePet('p2')).rejects.toMatchObject({ code: 'not_found' });
    expect(usePetsStore.getState().pets.map((p) => p.id)).toEqual(['p2']);
  });
});
