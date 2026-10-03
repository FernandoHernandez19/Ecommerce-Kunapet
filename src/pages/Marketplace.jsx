import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavbarHeader from '../components/NavbarHeader';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { mockMarketplaceItems } from '../data/mockData';

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recomendados' },
  { value: 'price_asc',   label: 'Precio: menor a mayor' },
  { value: 'price_desc',  label: 'Precio: mayor a menor' },
  { value: 'rating',      label: 'Mejor calificados' },
];

export default function Marketplace() {
  const [products]              = useState(mockMarketplaceItems);
  const [sortBy, setSortBy]     = useState('recommended');
  const [showSort, setShowSort] = useState(false);
  const navigate                = useNavigate();
  const location                = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');
  const initialCategories = categoryParam ? categoryParam.split(',') : [];

  const [filters, setFilters]   = useState({ selectedCategories: initialCategories });

  const zone = filters.district || 'todo Lima';
  
  let petType = 'todas las mascotas';
  if (filters.selectedPets?.length > 0) {
    const plurals = filters.selectedPets.map(pet => pet + 's');
    if (plurals.length === 1) {
      petType = plurals[0];
    } else if (plurals.length === 2) {
      petType = plurals.join(' y ');
    } else {
      petType = plurals.slice(0, -1).join(', ') + ' y ' + plurals[plurals.length - 1];
    }
  }

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? 'Recomendados';

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortSelect = (value) => {
    setSortBy(value);
    setShowSort(false);
  };

  // 1. Filtrar productos
  const filteredProducts = products.filter((product) => {
    // Calificación mínima
    if (filters.minRating && product.rating < filters.minRating) return false;
    
    // Rango de precio
    if (filters.priceMin && product.price < Number(filters.priceMin)) return false;
    if (filters.priceMax && product.price > Number(filters.priceMax)) return false;
    
    // Categorías (Macheo flexible usando includes)
    if (filters.selectedCategories?.length > 0) {
      const matchCat = filters.selectedCategories.some((cat) =>
        product.category.toLowerCase().includes(cat.toLowerCase())
      );
      if (!matchCat) return false;
    }
    
    // Tipo de Mascota (Macheo OR: mostrar si coincide con alguna de las seleccionadas)
    if (filters.selectedPets?.length > 0) {
      const matchPet = filters.selectedPets.some((pet) => 
        product.targetPets?.includes(pet)
      );
      if (!matchPet) return false;
    }

    // Distrito (Mostrar si es Envío a todo Lima, o si coincide la ubicación)
    if (filters.district) {
      const distLower = filters.district.toLowerCase();
      const locLower = product.location.toLowerCase();
      const isGeneralDelivery = locLower.includes('envío');
      const isDistrictMatch = distLower.includes(locLower) || locLower.includes(distLower);
      if (!isGeneralDelivery && !isDistrictMatch) return false;
    }

    // Disponible Ahora
    if (filters.availableNow && !product.availableNow) {
      return false;
    }

    return true;
  });

  // 2. Ordenar productos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // 'recommended'
  });

  const totalResults = sortedProducts.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarHeader />

      <div className="flex max-w-screen-xl mx-auto">
        <FilterSidebar onApply={handleApplyFilters} initialCategories={initialCategories} />

        <main className="flex-1 px-6 py-6 min-w-0">

          {/* Encabezado y ordenamiento */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resultados</h1>
              <p className="text-sm text-gray-500 mt-1">
                Mostrando <strong>{totalResults}</strong> productos en{' '}
                <strong>{zone}</strong> para <strong>{petType}</strong>.
              </p>
            </div>

            {/* Dropdown ordenar */}
            <div className="relative">
              <button
                onClick={() => setShowSort((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300 transition"
              >
                {sortLabel}
                {showSort
                  ? <ChevronUp className="w-4 h-4 text-gray-400" />
                  : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>

              {showSort && (
                <div className="absolute right-0 mt-1 w-52 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSortSelect(opt.value)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sortBy === opt.value
                          ? 'bg-green-50 text-green-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Grid de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                provider={product.provider.name}
                onVerMas={() => navigate('/item/' + product.id)}
              />
            ))}
          </div>

          {/* Cargar más */}
          <div className="flex justify-center mt-8">
            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition">
              Cargar más resultados
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}