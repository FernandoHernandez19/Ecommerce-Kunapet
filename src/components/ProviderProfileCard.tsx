
/**
 * Tarjeta del proveedor. Muestra solo lo que la API entrega públicamente
 * (id, nombre y avatar): sin verificación, experiencia ni ventas inventadas.
 */
import type { UiProvider } from '../api/adapters';

const ProviderProfileCard = ({ provider }: { provider?: UiProvider | null }) => {
  const initial = provider?.name?.trim().charAt(0).toUpperCase() || '?';

  return (
    <div className="p-5 border border-gray-200 rounded-2xl bg-white shadow-sm flex items-center space-x-4">
      <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 flex items-center justify-center">
        {provider?.avatar ? (
          <img src={provider.avatar} alt={provider.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xl font-bold text-gray-500" aria-hidden="true">{initial}</span>
        )}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">Proporcionado por</p>
        <h3 className="font-bold text-gray-950 text-base">{provider?.name ?? 'Proveedor KunaPet'}</h3>
      </div>
    </div>
  );
};

export default ProviderProfileCard;
