/**
 * Ejecuta `worker(id)` para cada id, de uno en uno (la API no tiene endpoints masivos),
 * y devuelve qué salió bien y qué falló. Un fallo no detiene el resto, salvo una sesión
 * vencida (unauthorized), porque todo lo demás fallaría igual.
 *
 * @template T
 * @param {string[]} ids
 * @param {(id: string) => Promise<T>} worker
 * @returns {Promise<{ ok: { id: string, value: T }[], failed: { id: string, error: unknown }[] }>}
 */
export async function runSequentially(ids, worker) {
  const ok = [];
  const failed = [];
  for (const id of ids) {
    try {
      ok.push({ id, value: await worker(id) });
    } catch (error) {
      failed.push({ id, error });
      if (error?.code === 'unauthorized') {
        // El resto no se intenta: se reportan como no procesados.
        for (const rest of ids.slice(ids.indexOf(id) + 1)) failed.push({ id: rest, error });
        break;
      }
    }
  }
  return { ok, failed };
}
