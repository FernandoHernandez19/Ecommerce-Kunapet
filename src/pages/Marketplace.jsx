import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import NavbarHeader from '../components/NavbarHeader';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';

const MOCK_PRODUCTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400&q=80',
    title: 'NutriCan Pro Adultos Raza Grande - Sabor Pollo y Arroz 15kg',
    provider: 'PetShop Central',
    providerUrl: '#',
    rating: 4.9,
    reviewCount: 128,
    price: 145.5,
    originalPrice: 180.0,
    priceLabel: 'S/',
    category: 'Alimento Premium',
    badge: 'bestseller',
    distance: null,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
    title: 'Bravecto Antipulgas Perros 10-20kg',
    provider: 'VetExpress',
    providerUrl: '#',
    rating: 4.8,
    reviewCount: 45,
    price: 115.0,
    originalPrice: null,
    priceLabel: 'S/',
    category: 'Medicina',
    badge: null,
    distance: null,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&q=80',
    title: 'Baño y Corte de Pelo Completo',
    provider: "Spa Canino 'Pelusa'",
    providerUrl: '#',
    rating: 5.0,
    reviewCount: 210,
    price: 45.0,
    originalPrice: null,
    priceLabel: 'Desde',
    category: 'Servicio • Grooming',
    badge: 'available',
    distance: '1.2 km',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=400&q=80',
    title: 'Juguete Kong Classic Masticable Rojo',
    provider: 'PetMundo',
    providerUrl: '#',
    rating: 4.7,
    reviewCount: 89,
    price: 65.0,
    originalPrice: null,
    priceLabel: 'S/',
    category: 'Accesorios',
    badge: null,
    distance: null,
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&q=80',
    title: 'Consulta Veterinaria General',
    provider: 'Clinica Vet San Borja Sur',
    providerUrl: '#',
    rating: 4.9,
    reviewCount: 156,
    price: 60.0,
    originalPrice: null,
    priceLabel: 'Costo Fijo',
    category: 'Servicio • Veterinaria',
    badge: null,
    distance: '0.8 km',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&q=80',
    title: 'Collar Antipulgas y Garrapatas 8 meses',
    provider: 'VetExpress',
    providerUrl: '#',
    rating: 4.6,
    reviewCount: 34,
    price: 89.9,
    originalPrice: null,
    priceLabel: 'S/',
    category: 'Medicina',
    badge: null,
    distance: null,
  },
];

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recomendados' },
  { value: 'price_asc',   label: 'Precio: menor a mayor' },
  { value: 'price_desc',  label: 'Precio: mayor a menor' },
  { value: 'rating',      label: 'Mejor calificados' },
];

export default function Marketplace() {
  const [products]              = useState(MOCK_PRODUCTS);
  const [sortBy, setSortBy]     = useState('recommended');
  const [showSort, setShowSort] = useState(false);
  const [filters, setFilters]   = useState({});

  const totalResults = 124;
  const zone         = 'San Borja';
  const petType      = 'Perros';

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? 'Recomendados';

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortSelect = (value) => {
    setSortBy(value);
    setShowSort(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarHeader />

      <div className="flex max-w-screen-xl mx-auto">
        <FilterSidebar onApply={handleApplyFilters} />

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
            {products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onVerMas={() => console.log('Ver más:', product.id)}
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