/** Servicio de datos de mascotas del cliente (GET/POST/PATCH/DELETE /pets). */
import { api } from './client';
import { editFormToApiPet, toUiPet, wizardToApiPet } from './adapters';

export async function listPets({ signal } = {}) {
  const res = await api.get('/pets?limit=100', { signal });
  return res.data.map((p) => toUiPet(p));
}

export async function getPet(id, { signal } = {}) {
  const res = await api.get(`/pets/${encodeURIComponent(id)}`, { signal });
  return toUiPet(res.data);
}

/** Crea una mascota a partir de los datos del wizard. */
export async function createPetFromWizard(form) {
  const res = await api.post('/pets', wizardToApiPet(form));
  return toUiPet(res.data);
}

/** Actualiza una mascota con el formulario de edición de PetsManager. */
export async function updatePetFromForm(id, form) {
  const res = await api.patch(`/pets/${encodeURIComponent(id)}`, editFormToApiPet(form));
  return toUiPet(res.data);
}

export function deletePet(id) {
  return api.delete(`/pets/${encodeURIComponent(id)}`);
}
