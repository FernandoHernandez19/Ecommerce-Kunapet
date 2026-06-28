import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const PET_TYPES = ['Perro', 'Gato', 'Ave', 'Exótico'];
const CATEGORIES = ['Alimentos', 'Medicina', 'Grooming', 'Veterinaria', 'Accesorios'];
const DISTRICTS = ['San Borja, Lima', 'Miraflores', 'Surco', 'La Molina', 'Barranco'];

const FilterSidebar = ({ onApply }) => {
  const [selectedPets, setSelectedPets] = useState([]);
  const [selectedCategories, setCategories] = useState([]);
  const [district, setDistrict] = useState('San Borja, Lima');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [availableNow, setAvailableNow] = useState(false);

  const togglePet = (pet) =>
    setSelectedPets((prev) =>
      prev.includes(pet) ? prev.filter((p) => p !== pet) : [...prev, pet]
    );

  const toggleCategory = (cat) =>
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const handleClear = () => {
    setSelectedPets([]);
    setCategories([]);
    setDistrict('San Borja, Lima');
    setPriceMin('');
    setPriceMax('');
    setAvailableNow(false);
  };

  const handleApply = () => {
    onApply?.({ selectedPets, selectedCategories, district, priceMin, priceMax, availableNow });
  };

  return (
    <aside className="w-64 shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 m-4 p-5 flex flex-col gap-5 self-start">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">Filtros</h2>
        <button
          onClick={handleClear}
          className="text-sm font-semibold text-green-700 hover:text-green-800 transition-colors"
        >
          Limpiar
        </button>
      </div>

      {/* ── Tipo de Mascota ── */}
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-gray-800">Tipo de Mascota</h3>
        <div className="flex flex-wrap gap-2">
          {PET_TYPES.map((pet) => {
            const active = selectedPets.includes(pet);
            return (
              <button
                key={pet}
                onClick={() => togglePet(pet)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${active
                  ? 'bg-green-700 text-white border-green-700'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-green-500 hover:text-green-700'
                  }`}
              >
                {pet}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Categoría ── */}
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-gray-800">Categoría</h3>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* ── Distrito ── */}
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-gray-800">Distrito</h3>
        <div className="relative">
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer pr-8"
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </section>

      {/* ── Precio ── */}
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-gray-800">Precio (S/.)</h3>
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-gray-500">Mín</label>
            <input
              type="number"
              placeholder="0"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-gray-500">Máx</label>
            <input
              type="number"
              placeholder="5000"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </section>

      {/* ── Calificación ── */}
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-gray-800">Calificación</h3>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} className="text-amber-400 text-base">★</span>
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700">4+ &amp; más</span>
        </div>
      </section>

      {/* ── Disponible Ahora ── */}
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-gray-800">Disponible Ahora</h3>
        <button
          onClick={() => setAvailableNow((v) => !v)}
          className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 ${availableNow ? 'bg-green-500' : 'bg-gray-300'
            }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${availableNow ? 'translate-x-5' : 'translate-x-0'
              }`}
          />
        </button>
      </section>

      {/* ── Aplicar ── */}
      <button
        onClick={handleApply}
        className="w-full py-2.5 bg-green-700 hover:bg-green-800 active:bg-green-700 text-white text-sm font-bold rounded-xl transition-colors mt-1"
      >
        Aplicar Filtros
      </button>
    </aside>
  );
};

export default FilterSidebar;