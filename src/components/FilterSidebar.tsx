import { useEffect, useState } from 'react';
import { categoryToSlug, solesToCents } from '../api/adapters';
import type { ItemType } from '@/types/api';

/**
 * Filtros del marketplace. Solo incluye lo que la API puede filtrar en el servidor:
 * tipo (producto/servicio), categoría (una a la vez) y rango de precio.
 * (Tipo de mascota, distrito, disponibilidad y calificación no existen en la API.)
 */
export interface CatalogFilters {
  type: ItemType | '';
  category: string;
  priceMin: string;
  priceMax: string;
}

const TYPES: { value: ItemType | ''; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'product', label: 'Productos' },
  { value: 'service', label: 'Servicios' },
];
export const CATEGORIES = ['Alimentos', 'Medicina', 'Accesorios', 'Grooming', 'Veterinaria', 'Paseos'];

interface FilterSidebarProps {
  onApply?: (filters: CatalogFilters) => void;
  initialCategory?: string;
}

const FilterSidebar = ({ onApply, initialCategory = '' }: FilterSidebarProps) => {
  const [type, setType] = useState<ItemType | ''>('');
  const [category, setCategory] = useState(initialCategory);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [error, setError] = useState('');

  // Si la URL cambia de categoría (p. ej. desde el carrusel), el filtro la sigue.
  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  const handleClear = () => {
    setType('');
    setCategory('');
    setPriceMin('');
    setPriceMax('');
    setError('');
    onApply?.({ type: '', category: '', priceMin: '', priceMax: '' });
  };

  const handleApply = () => {
    const min = priceMin === '' ? null : solesToCents(priceMin);
    const max = priceMax === '' ? null : solesToCents(priceMax);
    if ((priceMin !== '' && min === null) || (priceMax !== '' && max === null)) {
      setError('Ingresa precios válidos (números mayores o iguales a 0).');
      return;
    }
    if (min !== null && max !== null && min > max) {
      setError('El precio mínimo no puede superar al máximo.');
      return;
    }
    setError('');
    onApply?.({ type, category: category ? categoryToSlug(category) : '', priceMin, priceMax });
  };

  return (
    <aside className="w-64 shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 m-4 p-5 flex flex-col gap-5 self-start">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">Filtros</h2>
        <button type="button" onClick={handleClear} className="text-sm font-semibold text-green-700 hover:text-green-800 transition-colors">
          Limpiar
        </button>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-bold text-gray-800 mb-2">Tipo</legend>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              aria-pressed={type === t.value}
              onClick={() => setType(t.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                type === t.value
                  ? 'bg-green-700 text-white border-green-700'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-green-500 hover:text-green-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-bold text-gray-800 mb-2">Categoría</legend>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="categoria"
                checked={categoryToSlug(category) === categoryToSlug(cat)}
                onChange={() => setCategory(cat)}
                onClick={() => categoryToSlug(category) === categoryToSlug(cat) && setCategory('')}
                className="w-4 h-4 border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-bold text-gray-800 mb-2">Precio (S/.)</legend>
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="price-min" className="text-xs text-gray-500">Mín</label>
            <input
              id="price-min"
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="price-max" className="text-xs text-gray-500">Máx</label>
            <input
              id="price-max"
              type="number"
              min="0"
              step="0.01"
              placeholder="5000"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        {error && <p role="alert" className="text-xs font-medium text-red-500">{error}</p>}
      </fieldset>

      <button
        type="button"
        onClick={handleApply}
        className="w-full py-2.5 bg-green-700 hover:bg-green-800 active:bg-green-700 text-white text-sm font-bold rounded-xl transition-colors mt-1"
      >
        Aplicar Filtros
      </button>
    </aside>
  );
};

export default FilterSidebar;
