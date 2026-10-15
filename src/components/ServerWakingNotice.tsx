import useServerStatusStore from '../store/useServerStatusStore';

/**
 * Aviso discreto cuando la API tarda en responder (servidor gratuito despertando).
 * La región aria-live siempre está en el DOM para que los lectores de pantalla
 * anuncien el texto cuando aparece.
 */
export default function ServerWakingNotice() {
  const isWaking = useServerStatusStore((s) => s.isWaking);

  return (
    <div
      aria-live="polite"
      role="status"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4"
    >
      {isWaking && (
        <p className="pointer-events-auto max-w-md rounded-2xl bg-gray-900/90 px-4 py-3 text-center text-sm font-medium text-white shadow-lg">
          El servidor gratuito se está despertando; puede tardar hasta un minuto.
        </p>
      )}
    </div>
  );
}
