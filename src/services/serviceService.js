/**
 * serviceService — Capa de datos para el catálogo de servicios del proveedor.
 *
 * Cubre: CRUD de servicios, filtrado por categoría, búsqueda.
 * Listo para conectar con el endpoint C# /api/services
 */

const MOCK_DELAY = 500;
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// ─── Mock data centralizada ───────────────────────────────────────────────────
// Fuente única de verdad para ServiceManagementPage y otros consumidores.
let MOCK_SERVICES_DB = [
  {
    id:          'srv-1',
    providerId:  'usr-002',
    title:       'Paseo de Perros (Grupal)',
    description: 'Paseo grupal en parques cercanos. Máximo 4 perros por grupo.',
    price:       25.00,
    duration:    '60 min',
    icon:        '🚶‍♂️',
    iconBg:      'bg-emerald-100',
    isActive:    true,
    category:    'Paseos',
    createdAt:   '2024-01-20T10:00:00Z',
  },
  {
    id:          'srv-2',
    providerId:  'usr-002',
    title:       'Grooming Completo',
    description: 'Baño, secado, corte de uñas, limpieza de oídos y perfume.',
    price:       65.00,
    duration:    '90 min',
    icon:        '🚿',
    iconBg:      'bg-amber-100',
    isActive:    true,
    category:    'Grooming',
    createdAt:   '2024-02-05T11:00:00Z',
  },
  {
    id:          'srv-3',
    providerId:  'usr-002',
    title:       'Consulta Veterinaria',
    description: 'Revisión general de salud con diagnóstico y recomendaciones.',
    price:       55.00,
    duration:    '30 min',
    icon:        '🏥',
    iconBg:      'bg-blue-100',
    isActive:    false,
    category:    'Veterinaria',
    createdAt:   '2024-03-10T09:00:00Z',
  },
];

// ─── Funciones ────────────────────────────────────────────────────────────────

/**
 * getServices — Lista todos los servicios del proveedor autenticado.
 * @param {{ category?: string, isActive?: boolean }} filters
 */
export async function getServices(filters = {}) {
  await delay(MOCK_DELAY);
  // TODO: return (await api.get('/services', { params: filters })).data;
  let result = [...MOCK_SERVICES_DB];
  if (filters.category && filters.category !== 'Todos') {
    result = result.filter((s) => s.category === filters.category);
  }
  if (typeof filters.isActive === 'boolean') {
    result = result.filter((s) => s.isActive === filters.isActive);
  }
  return result;
}

/**
 * getServiceById — Obtiene un servicio por ID.
 * @param {string} id
 */
export async function getServiceById(id) {
  await delay(MOCK_DELAY);
  // TODO: return (await api.get(`/services/${id}`)).data;
  const service = MOCK_SERVICES_DB.find((s) => s.id === id);
  if (!service) throw new Error(`Servicio con id "${id}" no encontrado.`);
  return service;
}

/**
 * createService — Crea un nuevo servicio.
 * @param {object} data
 */
export async function createService(data) {
  await delay(MOCK_DELAY);
  // TODO: return (await api.post('/services', data)).data;
  const newService = {
    ...data,
    id:        `srv-${Date.now()}`,
    createdAt: new Date().toISOString(),
    isActive:  true,
  };
  MOCK_SERVICES_DB.push(newService);
  return newService;
}

/**
 * updateService — Actualiza un servicio existente.
 * @param {string} id
 * @param {object} updates
 */
export async function updateService(id, updates) {
  await delay(MOCK_DELAY);
  // TODO: return (await api.patch(`/services/${id}`, updates)).data;
  const idx = MOCK_SERVICES_DB.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error('Servicio no encontrado.');
  MOCK_SERVICES_DB[idx] = { ...MOCK_SERVICES_DB[idx], ...updates };
  return MOCK_SERVICES_DB[idx];
}

/**
 * deleteService — Elimina un servicio (soft-delete en producción).
 * @param {string} id
 */
export async function deleteService(id) {
  await delay(MOCK_DELAY);
  // TODO: await api.delete(`/services/${id}`);
  MOCK_SERVICES_DB = MOCK_SERVICES_DB.filter((s) => s.id !== id);
}

/**
 * bulkUpdateStatus — Actualiza el estado de múltiples servicios.
 * @param {string[]} ids
 * @param {boolean}  isActive
 */
export async function bulkUpdateStatus(ids, isActive) {
  await delay(MOCK_DELAY);
  // TODO: await api.patch('/services/bulk/status', { ids, isActive });
  MOCK_SERVICES_DB = MOCK_SERVICES_DB.map((s) =>
    ids.includes(s.id) ? { ...s, isActive } : s
  );
}

/**
 * bulkDelete — Elimina múltiples servicios.
 * @param {string[]} ids
 */
export async function bulkDelete(ids) {
  await delay(MOCK_DELAY);
  // TODO: await api.post('/services/bulk/delete', { ids });
  MOCK_SERVICES_DB = MOCK_SERVICES_DB.filter((s) => !ids.includes(s.id));
}
