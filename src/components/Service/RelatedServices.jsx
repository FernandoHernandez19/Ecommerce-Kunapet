import React from 'react';
import { Link } from 'react-router-dom';
import { listItems } from '../../api/items';
import useApiResource from '../../hooks/useApiResource';

/** Otros items de la misma categoría, traídos de la API. */
const RelatedServices = ({ category, excludeId }) => {
  const { data, loading, error, reload } = useApiResource(
    async (signal) => {
      const { data: items } = await listItems({ category, limit: 4 }, { signal });
      return items.filter((i) => i.id !== excludeId).slice(0, 3);
    },
    [category, excludeId],
    { enabled: Boolean(category) },
  );

  if (!category) return null;

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-900">También te podría interesar</h2>

      {loading && <p className="text-sm text-gray-400" role="status">Cargando recomendaciones…</p>}

      {error && (
        <div role="alert" className="text-sm text-red-600">
          {error}{' '}
          <button type="button" onClick={reload} className="font-semibold underline">Reintentar</button>
        </div>
      )}

      {!loading && !error && data?.length === 0 && (
        <p className="text-sm text-gray-500">Por ahora no hay otros items en esta categoría.</p>
      )}

      {data?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <Link
              key={item.id}
              to={`/item/${item.id}`}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col no-underline"
            >
              <div className="h-44 bg-gray-100 overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">🐾</div>
                )}
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-bold text-sm text-gray-950 group-hover:text-brand-primary transition-colors line-clamp-1">{item.title}</h3>
                <p className="text-sm font-semibold text-gray-700">{item.priceText}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedServices;
