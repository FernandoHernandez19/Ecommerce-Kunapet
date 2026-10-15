/**
 * Ejecuta `worker(id)` para cada id, de uno en uno (la API no tiene endpoints masivos),
 * y devuelve qué salió bien y qué falló. Un fallo no detiene el resto, salvo una sesión
 * vencida (unauthorized), porque todo lo demás fallaría igual.
 */
export interface BulkResult<T> {
  ok: { id: string; value: T }[];
  failed: { id: string; error: unknown }[];
}

function isUnauthorized(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'unauthorized';
}

export async function runSequentially<T>(ids: string[], worker: (id: string) => Promise<T>): Promise<BulkResult<T>> {
  const ok: BulkResult<T>['ok'] = [];
  const failed: BulkResult<T>['failed'] = [];
  for (const [index, id] of ids.entries()) {
    try {
      ok.push({ id, value: await worker(id) });
    } catch (error) {
      failed.push({ id, error });
      if (isUnauthorized(error)) {
        // El resto no se intenta: se reportan como no procesados.
        for (const rest of ids.slice(index + 1)) failed.push({ id: rest, error });
        break;
      }
    }
  }
  return { ok, failed };
}
