/** Servicio de datos de mascotas del cliente (GET/POST/PATCH/DELETE /pets). */
import { api } from './client';
import { editFormToApiPet, toUiPet, wizardToApiPet, type PetEditForm, type UiPet, type WizardPetForm } from './adapters';
import { petListSchema, petResponseSchema } from './schemas';

interface Signaled {
  signal?: AbortSignal;
}

export async function listPets({ signal }: Signaled = {}): Promise<UiPet[]> {
  const res = await api.get('/pets?limit=100', { signal, schema: petListSchema });
  return res.data.map((p) => toUiPet(p));
}

export async function getPet(id: string, { signal }: Signaled = {}): Promise<UiPet> {
  const res = await api.get(`/pets/${encodeURIComponent(id)}`, { signal, schema: petResponseSchema });
  return toUiPet(res.data);
}

/** Crea una mascota a partir de los datos del wizard. */
export async function createPetFromWizard(form: WizardPetForm): Promise<UiPet> {
  const res = await api.post('/pets', wizardToApiPet(form), { schema: petResponseSchema });
  return toUiPet(res.data);
}

/** Actualiza una mascota con el formulario de edición de PetsManager. */
export async function updatePetFromForm(id: string, form: PetEditForm): Promise<UiPet> {
  const res = await api.patch(`/pets/${encodeURIComponent(id)}`, editFormToApiPet(form), { schema: petResponseSchema });
  return toUiPet(res.data);
}

export async function deletePet(id: string): Promise<void> {
  await api.delete(`/pets/${encodeURIComponent(id)}`);
}
