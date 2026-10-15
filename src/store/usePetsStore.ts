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
import type { PetEditForm, UiPet, WizardPetForm } from '../api/adapters';

// Clave que usaba el store antiguo (datos de ejemplo): se limpia por si quedó en el navegador.
try {
  localStorage.removeItem('kunapet-pets');
} catch {
  /* localStorage no disponible */
}

export type PetsStatus = 'idle' | 'loading' | 'ready' | 'error';

interface PetsState {
  pets: UiPet[];
  status: PetsStatus;
  error: string | null;
}

interface PetsActions {
  /** GET /pets. Recibe un AbortSignal para cancelar al desmontar. */
  fetchPets: (signal?: AbortSignal) => Promise<void>;
  /** POST /pets con los datos del wizard. Lanza ApiError para que el formulario lo muestre. */
  addPet: (formData: WizardPetForm) => Promise<UiPet>;
  /** PATCH /pets/:id con el formulario de edición. */
  updatePet: (petId: string, form: PetEditForm) => Promise<UiPet>;
  /** DELETE /pets/:id */
  removePet: (petId: string) => Promise<void>;
  reset: () => void;
}

export type PetsStore = PetsState & PetsActions;

const initialState: PetsState = {
  pets: [],
  status: 'idle',
  error: null,
};

const usePetsStore = create<PetsStore>()((set) => ({
  ...initialState,

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

  addPet: async (formData) => {
    const pet = await petsApi.createPetFromWizard(formData);
    set((state) => ({ pets: [pet, ...state.pets], status: 'ready' }));
    return pet;
  },

  updatePet: async (petId, form) => {
    const pet = await petsApi.updatePetFromForm(petId, form);
    set((state) => ({ pets: state.pets.map((p) => (p.id === petId ? pet : p)) }));
    return pet;
  },

  removePet: async (petId) => {
    await petsApi.deletePet(petId);
    set((state) => ({ pets: state.pets.filter((p) => p.id !== petId) }));
  },

  reset: () => set({ ...initialState }),
}));

export default usePetsStore;
