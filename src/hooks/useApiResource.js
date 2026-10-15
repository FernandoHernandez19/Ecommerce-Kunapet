import { useCallback, useEffect, useRef, useState } from 'react';
import { friendlyMessage } from '../api/errorMessages';

/**
 * Carga un recurso de la API con estados de carga y error, reintento y cancelación.
 *
 * - `load(signal)` recibe un AbortSignal: se aborta al desmontar o al cambiar `deps`.
 * - Una respuesta de una petición vieja nunca pisa a la nueva (sin parpadeos ni carreras).
 * - `reload()` repite la petición (botón "Reintentar").
 *
 * @template T
 * @param {(signal: AbortSignal) => Promise<T>} load
 * @param {unknown[]} deps
 * @param {{ enabled?: boolean }} [options]
 */
export default function useApiResource(load, deps, { enabled = true } = {}) {
  const [state, setState] = useState({ data: null, error: null, loading: enabled });
  const [tick, setTick] = useState(0);
  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    if (!enabled) return undefined;
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    loadRef
      .current(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ data, error: null, loading: false });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setState((s) => ({ ...s, error: friendlyMessage(err), loading: false }));
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, tick, ...deps]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  const setData = useCallback((updater) => {
    setState((s) => ({ ...s, data: typeof updater === 'function' ? updater(s.data) : updater }));
  }, []);

  return { ...state, reload, setData };
}
