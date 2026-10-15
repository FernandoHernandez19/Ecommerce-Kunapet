/**
 * usePetsStore — Zustand store de las mascotas del cliente (API real: /pets).
 *
 * Ya NO se persiste en localStorage: la fuente de verdad es el servidor, y así no se
 * mezclan mascotas de un usuario con las de otro. Se carga con fetchPets() al entrar al
 * panel y se vacía al cerrar sesión (reset).
 */
import { create } from 'zustand';
import * as petsApi from '../api/pets';
import { friendlyMessage } from '../api/errorMessages';

// Clave que usaba el store antiguo (datos de ejemplo): se limpia por si quedó en el navegador.
try {
  localStorage.removeItem('kunapet-pets');
} catch {
  /* localStorage no disponible */
}

const initialState = {
  pets: [],
  status: 'idle', // 'idle' | 'loading' | 'ready' | 'error'
  error: null,
};

const usePetsStore = create((set) => ({
  ...initialState,

  // GET /pets. Recibe un AbortSignal para cancelar al desmontar.
  fetchPets: async (signal) => {
    set({ status: 'loading', error: null });
    try {
      const pets = await petsApi.listPets({ signal });
      if (signal?.aborted) return;
      set({ pets, status: 'ready', error: null });
    } catch (err) {
      if (signal?.aborted) return;
      set({ status: 'error', error: friendlyMessage(err) });
    }
  },

  // POST /pets con los datos del wizard. Lanza el error de la API (ApiError) para que
  // el formulario lo muestre; devuelve la mascota creada.
  addPet: async (formData) => {
    const pet = await petsApi.createPetFromWizard(formData);
    set((state) => ({ pets: [pet, ...state.pets], status: 'ready' }));
    return pet;
  },

  // PATCH /pets/:id con el formulario de edición.
  updatePet: async (petId, form) => {
    const pet = await petsApi.updatePetFromForm(petId, form);
    set((state) => ({ pets: state.pets.map((p) => (p.id === petId ? pet : p)) }));
    return pet;
  },

  // DELETE /pets/:id
  removePet: async (petId) => {
    await petsApi.deletePet(petId);
    set((state) => ({ pets: state.pets.filter((p) => p.id !== petId) }));
  },

  reset: () => set({ ...initialState }),
}));

export default usePetsStore;
