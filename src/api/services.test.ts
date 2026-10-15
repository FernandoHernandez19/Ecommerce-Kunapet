import { describe, expect, it } from 'vitest';
import { apiItem, apiOrder, apiPet, jsonResponse, page, routeFetch } from '../test/helpers';
import { ApiError } from './ApiError';
import { friendlyMessage } from './errorMessages';
import { createItem, deactivateItem, getItem, listItems, listMyItems, patchItem, updateItem } from './items';
import { createOrder, getOrder, listOrders } from './orders';
import { createPetFromWizard, deletePet, getPet, listPets, updatePetFromForm } from './pets';

async function failure(promise: Promise<unknown>): Promise<ApiError> {
  try {
    await promise;
  } catch (err) {
    if (err instanceof ApiError) return err;
    throw err;
  }
  throw new Error('Se esperaba un ApiError');
}

describe('servicios de datos: validan la respuesta en la frontera', () => {
  it('items: lista y detalle válidos se adaptan al modelo de vista', async () => {
    routeFetch(({ path }) => (path === '/items' ? page([apiItem()], 1) : { data: apiItem() }));
    const list = await listItems({ q: 'bano', limit: 5 });
    expect(list.data[0]).toMatchObject({ priceText: 'S/ 145.50', category: 'Alimentos' });
    expect((await getItem('x')).provider.name).toBe('PetShop Central');
  });

  it('items: una lista con un item mal formado → invalid_response con mensaje amigable', async () => {
    routeFetch(() => page([{ ...apiItem(), priceCents: '14550' }], 1));
    const err = await failure(listItems());
    expect(err).toMatchObject({ code: 'invalid_response' });
    expect(friendlyMessage(err)).toBe('El servidor respondió con datos inesperados. Inténtalo de nuevo.');
  });

  it('items: falta la envoltura { data } o el meta → invalid_response', async () => {
    routeFetch(({ path }) => (path === '/items/a' ? apiItem() : { data: [apiItem()] }));
    expect(await failure(getItem('a'))).toMatchObject({ code: 'invalid_response' });
    expect(await failure(listItems())).toMatchObject({ code: 'invalid_response' });
  });

  it('items del proveedor: pagina, filtra por provider.id y valida cada página', async () => {
    const mine = apiItem({ id: 'm1', provider: { id: 'u1', name: 'Yo', avatarUrl: null } });
    const other = apiItem({ id: 'o1', provider: { id: 'u2', name: 'Otro', avatarUrl: null } });
    routeFetch(() => page([mine, other], 2, { limit: 100 }));
    expect((await listMyItems('u1')).map((i) => i.id)).toEqual(['m1']);
  });

  it('items: crear, editar (sin type) y desactivar', async () => {
    const { calls } = routeFetch(({ method }) => (method === 'DELETE' ? new Response(null, { status: 204 }) : { data: apiItem() }));
    await createItem({ type: 'service', title: 'Paseo', description: 'd', category: 'Paseos', price: '25.50', durationMinutes: '60' });
    await updateItem('i1', { type: 'service', title: 'Paseo', description: 'd', category: 'Paseos', price: '30', durationMinutes: '60' });
    await patchItem('i1', { isActive: false });
    await deactivateItem('i1');
    expect(calls.map((c) => `${c.method} ${c.path}`)).toEqual(['POST /items', 'PATCH /items/i1', 'PATCH /items/i1', 'DELETE /items/i1']);
    expect(calls[0]?.body).toMatchObject({ type: 'service', priceCents: 2550, durationMinutes: 60 });
    expect(calls[1]?.body).not.toHaveProperty('type');
    expect(calls[1]?.body).toMatchObject({ priceCents: 3000 });
  });

  it('mascotas: lista, detalle, alta, edición y borrado; una mascota inválida → invalid_response', async () => {
    const { calls } = routeFetch(({ method, path }) => {
      if (method === 'DELETE') return new Response(null, { status: 204 });
      if (path === '/pets' && method === 'GET') return page([apiPet()], 1, { limit: 100 });
      return { data: apiPet() };
    });
    expect((await listPets())[0]?.name).toBe('Luna');
    expect((await getPet('p1')).speciesLabel).toBe('Perro');
    await createPetFromWizard({ name: 'Rex', species: 'perro' });
    await updatePetFromForm('p1', { name: 'Luna', species: 'dog', breed: '', gender: 'female', birthdate: '', notes: '' });
    await deletePet('p1');
    expect(calls.map((c) => c.method)).toEqual(['GET', 'GET', 'POST', 'PATCH', 'DELETE']);

    routeFetch(() => page([{ ...apiPet(), species: 'dragon' }], 1));
    expect(await failure(listPets())).toMatchObject({ code: 'invalid_response' });
  });

  it('pedidos: createOrder envía solo itemId, quantity y paymentMethod', async () => {
    const { calls } = routeFetch(() => jsonResponse({ data: apiOrder() }, 201));
    const order = await createOrder([{ itemId: 'i1', quantity: 2, ...({ priceCents: 1 } as object) }], 'yape');
    expect(calls[0]?.body).toEqual({ items: [{ itemId: 'i1', quantity: 2 }], paymentMethod: 'yape' });
    expect(order.totals.total).toBe('S/ 308.50');
  });

  it('pedidos: lista, detalle y respuestas inválidas', async () => {
    routeFetch(({ path }) => (path === '/orders' ? page([apiOrder()], 1) : { data: apiOrder() }));
    expect((await listOrders()).data).toHaveLength(1);
    expect((await getOrder('o1')).shortId).toBe('#9A8B7C6D');

    routeFetch(() => ({ data: { ...apiOrder(), status: 'pending' } }));
    expect(await failure(getOrder('o1'))).toMatchObject({ code: 'invalid_response' });
  });
});
