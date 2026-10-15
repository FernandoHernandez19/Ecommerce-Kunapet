import { useCallback, useEffect, useRef, useState } from 'react';
import { friendlyMessage } from '../api/errorMessages';
import { isApiError } from '../api/ApiError';
import type { ApiErrorCode } from '@/types/api';

/**
 * Estado de un recurso remoto como unión discriminada por `status`. Cada variante conserva
 * también los campos «planos» (`data`, `loading`, `error`, `errorCode`) para poder
 * desestructurar cómodamente; el compilador sabe qué combinaciones son posibles.
 */
export type ResourceState<T> =
  | { status: 'idle'; loading: false; data: null; error: null; errorCode: null }
  | { status: 'loading'; loading: true; data: T | null; error: null; errorCode: null }
  | { status: 'error'; loading: false; data: T | null; error: string; errorCode: ApiErrorCode | null }
  | { status: 'success'; loading: false; data: T; error: null; errorCode: null };

export type ApiResource<T> = ResourceState<T> & {
  /** Repite la petición (botón «Reintentar»). */
  reload: () => void;
  /** Actualiza localmente el dato (p. ej. tras crear o editar) sin volver a pedirlo. */
  setData: (updater: T | ((current: T | null) => T)) => void;
};

/**
 * Carga un recurso de la API con estados de carga y error, reintento y cancelación.
 *
 * - `load(signal)` recibe un AbortSignal: se aborta al desmontar o al cambiar `deps`.
 * - Una respuesta de una petición vieja nunca pisa a la nueva (sin parpadeos ni carreras).
 * - `enabled: false` deja el recurso en `idle` sin pedir nada.
 */
export default function useApiResource<T>(
  load: (signal: AbortSignal) => Promise<T>,
  deps: readonly unknown[],
  { enabled = true }: { enabled?: boolean } = {},
): ApiResource<T> {
  const [state, setState] = useState<ResourceState<T>>(
    enabled
      ? { status: 'loading', loading: true, data: null, error: null, errorCode: null }
      : { status: 'idle', loading: false, data: null, error: null, errorCode: null },
  );
  const [tick, setTick] = useState(0);
  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    if (!enabled) return undefined;
    const controller = new AbortController();
    setState((s) => ({ status: 'loading', loading: true, data: s.data, error: null, errorCode: null }));
    loadRef
      .current(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ status: 'success', loading: false, data, error: null, errorCode: null });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setState((s) => ({
          status: 'error',
          loading: false,
          data: s.data,
          error: friendlyMessage(err),
          errorCode: isApiError(err) ? err.code : null,
        }));
      });
    return () => controller.abort();
    // `deps` es la lista de dependencias del llamador (como en useEffect): no se puede analizar estáticamente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, tick, ...deps]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  const setData = useCallback((updater: T | ((current: T | null) => T)) => {
    setState((s) => {
      // Si T fuese un tipo función habría ambigüedad; los datos de la API nunca lo son.
      const next = updater instanceof Function ? updater(s.data) : updater;
      return { status: 'success', loading: false, data: next, error: null, errorCode: null };
    });
  }, []);

  return { ...state, reload, setData };
}
