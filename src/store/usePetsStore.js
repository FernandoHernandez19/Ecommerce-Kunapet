/**
 * usePetsStore — Zustand store global de mascotas para KunaPet.
 *
 * Gestiona:
 *  - Lista de mascotas del cliente autenticado
 *  - addPet: crea una nueva mascota con ID único y la añade al array
 *  - Persistencia en localStorage (persist middleware de Zustand)
 *
 * Cuando el backend esté listo, reemplazar las acciones mock
 * por llamadas al API — el resto de la app no cambia.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mockPets } from '../data/mockData';

// ─── Store ────────────────────────────────────────────────────────────────────
const usePetsStore = create(
  persist(
    (set) => ({
      // Estado inicial: mascotas del mock como punto de partida
      pets: mockPets,

      // ── ADD PET ──────────────────────────────────────────────────────────────
      // Recibe el formData del wizard y construye el objeto mascota completo
      addPet: (formData) => {
        const newPet = {
          id:            `p-${Date.now()}`,
          name:          formData.name,
          species:       formData.species || 'other',
          breed:         formData.breed || 'Sin especificar',
          gender:        formData.gender || 'Sin especificar',
          age:           formData.dob
                           ? new Date().getFullYear() - new Date(formData.dob).getFullYear()
                           : 0,
          birthdate:     formData.dob || '',
          photo:         formData.photo || null,
          vaccineStatus: formData.vaccines?.length > 0 ? 'ok' : 'pending',
          vaccines:      (formData.vaccines || []).map((name, i) => ({
            id:      `v-${Date.now()}-${i}`,
            name,
            date:    new Date().toISOString().split('T')[0],
            nextDue: '',
            status:  'ok',
          })),
          diet:     formData.specialNeeds || '',
          behavior: formData.allergies
                      ? `Alergias: ${formData.allergies}`
                      : 'Sin comportamientos especiales registrados.',
        };

        set((state) => ({ pets: [...state.pets, newPet] }));
        return newPet;
      },

      // ── REMOVE PET ───────────────────────────────────────────────────────────
      removePet: (petId) => {
        set((state) => ({ pets: state.pets.filter((p) => p.id !== petId) }));
      },

      // ── UPDATE PET ───────────────────────────────────────────────────────────
      updatePet: (petId, partialData) => {
        set((state) => ({
          pets: state.pets.map((p) =>
            p.id === petId ? { ...p, ...partialData } : p
          ),
        }));
      },
    }),
    {
      name:    'kunapet-pets',                       // Clave en localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default usePetsStore;
