/**
 * useServerStatusStore — detecta peticiones lentas a la API.
 *
 * El plan gratuito de Render duerme el servicio y tarda hasta ~1 min en despertar.
 * Si una petición lleva más de SLOW_AFTER_MS sin respuesta, `isWaking` pasa a true
 * y la interfaz muestra un aviso (ServerWakingNotice) hasta que responde.
 */
import { create } from 'zustand';

export const SLOW_AFTER_MS = 5_000;

const useServerStatusStore = create((set) => ({
  slowCount: 0, // peticiones que ya superaron el umbral y siguen pendientes
  isWaking: false,
  _setSlowCount: (slowCount) => set({ slowCount, isWaking: slowCount > 0 }),
}));

/**
 * Registra una petición en curso. Devuelve `done()`, que debe llamarse siempre
 * al terminar (éxito o error).
 */
export function trackRequest() {
  let slow = false;
  let finished = false;
  const adjust = (delta) => {
    const { slowCount, _setSlowCount } = useServerStatusStore.getState();
    _setSlowCount(Math.max(0, slowCount + delta));
  };
  const timer = setTimeout(() => {
    if (finished) return;
    slow = true;
    adjust(1);
  }, SLOW_AFTER_MS);

  return function done() {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    if (slow) adjust(-1);
  };
}

export default useServerStatusStore;
