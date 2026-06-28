/**
 * petService — Capa de datos para el perfil de mascotas del cliente.
 *
 * Cubre: CRUD de mascotas, historial de servicios por mascota, vacunas.
 * Listo para conectar con el endpoint C# /api/pets
 */

const MOCK_DELAY = 500;
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// ─── Mock data ────────────────────────────────────────────────────────────────
let MOCK_PETS_DB = [
  {
    id:           'pet-1',
    ownerId:      'usr-001',
    name:         'Luna',
    type:         'Perro',
    breed:        'Golden Retriever',
    age:          '2 años',
    weight:       '28 kg',
    gender:       'Hembra',
    avatarUrl:    null,
    nextVaccine:  'Oct 15',
    vaccineStatus: 'warning',
    notes:        'Alergia al trigo. Le encanta el agua.',
    createdAt:    '2024-01-10T10:00:00Z',
  },
  {
    id:           'pet-2',
    ownerId:      'usr-001',
    name:         'Milo',
    type:         'Gato',
    breed:        'Mestizo',
    age:          '4 años',
    weight:       '4.5 kg',
    gender:       'Macho',
    avatarUrl:    null,
    nextVaccine:  'Al día',
    vaccineStatus: 'success',
    notes:        'Muy tranquilo. No le gustan los niños.',
    createdAt:    '2023-06-20T09:00:00Z',
  },
];

// ─── Funciones ────────────────────────────────────────────────────────────────

/**
 * getPets — Lista todas las mascotas del usuario autenticado.
 * @param {string} ownerId
 */
export async function getPets(ownerId) {
  await delay(MOCK_DELAY);
  // TODO: return (await api.get('/pets', { params: { ownerId } })).data;
  return MOCK_PETS_DB.filter((p) => p.ownerId === ownerId);
}

/**
 * getPetById — Obtiene una mascota específica.
 * @param {string} id
 */
export async function getPetById(id) {
  await delay(MOCK_DELAY);
  // TODO: return (await api.get(`/pets/${id}`)).data;
  const pet = MOCK_PETS_DB.find((p) => p.id === id);
  if (!pet) throw new Error(`Mascota con id "${id}" no encontrada.`);
  return pet;
}

/**
 * createPet — Registra una nueva mascota.
 * @param {object} data  Datos del formulario AddPetWizard
 */
export async function createPet(data) {
  await delay(MOCK_DELAY);
  // TODO: return (await api.post('/pets', data)).data;
  const newPet = {
    ...data,
    id:           `pet-${Date.now()}`,
    vaccineStatus: 'warning',
    createdAt:    new Date().toISOString(),
  };
  MOCK_PETS_DB.push(newPet);
  return newPet;
}

/**
 * updatePet — Actualiza datos de una mascota.
 * @param {string} id
 * @param {object} updates
 */
export async function updatePet(id, updates) {
  await delay(MOCK_DELAY);
  // TODO: return (await api.patch(`/pets/${id}`, updates)).data;
  const idx = MOCK_PETS_DB.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error('Mascota no encontrada.');
  MOCK_PETS_DB[idx] = { ...MOCK_PETS_DB[idx], ...updates };
  return MOCK_PETS_DB[idx];
}

/**
 * deletePet — Elimina una mascota.
 * @param {string} id
 */
export async function deletePet(id) {
  await delay(MOCK_DELAY);
  // TODO: await api.delete(`/pets/${id}`);
  MOCK_PETS_DB = MOCK_PETS_DB.filter((p) => p.id !== id);
}

/**
 * getPetServiceHistory — Historial de servicios de una mascota.
 * @param {string} petId
 */
export async function getPetServiceHistory(petId) {
  await delay(MOCK_DELAY);
  // TODO: return (await api.get(`/pets/${petId}/history`)).data;
  // Mock: retorna historial genérico
  return [
    { id: 'h-1', date: '2024-09-12', service: 'Paseo de 1 hora', provider: 'Carlos M.', status: 'COMPLETADO' },
    { id: 'h-2', date: '2024-08-30', service: 'Consulta Veterinaria', provider: 'VetClinic', status: 'COMPLETADO' },
  ];
}
