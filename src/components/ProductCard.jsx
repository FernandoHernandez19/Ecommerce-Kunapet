import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, ArrowRight, Award, Clock, ShoppingCart, Calendar } from 'lucide-react';
import useCartStore, { ITEM_TYPES } from '../store/useCartStore';

/**
 * ProductCard — muestra un producto o servicio del marketplace de KunaPet.
 *
 * Props:
 *  - image       {string}  URL de la imagen
 *  - title       {string}  Nombre del producto/servicio
 *  - provider    {string}  Nombre del proveedor
 *  - providerUrl {string}  Enlace al perfil del proveedor
 *  - rating      {number}  Calificación (ej: 4.9)
 *  - reviewCount {number}  Cantidad de reseñas
 *  - price       {number}  Precio actual en soles
 *  - originalPrice {number|null} Precio original tachado (si hay descuento)
 *  - priceLabel  {string}  Prefijo de precio ("S/", "Desde S/", "Costo Fijo S/")
 *  - category    {string}  Etiqueta de categoría (ej: "Alimento Premium")
 *  - badge       {string|null} "bestseller" | "available" | null
 *  - distance    {string|null} Distancia al proveedor (ej: "1.2 km")
 *  - onVerMas    {func}    Callback al pulsar "Ver más"
 */
const BADGE_CONFIG = {
  bestseller: {
    icon: <Award className="w-3 h-3" />,
    label: 'Más Vendido',
    className: 'bg-amber-100 text-amber-700 border border-amber-200',
  },
  available: {
    icon: <Clock className="w-3 h-3" />,
    label: 'Disponible Hoy',
    className: 'bg-white/90 text-gray-700 border border-gray-200 shadow-sm',
  },
};

const StarRating = ({ rating }) => (
  <span className="flex items-center gap-0.5">
    <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
    <span className="text-sm font-semibold text-gray-800">{rating}</span>
  </span>
);

const ProductCard = ({
  id,
  image,
  title,
  provider,
  providerUrl = '#',
  rating,
  reviewCount,
  price,
  originalPrice = null,
  priceLabel = 'S/',
  category,
  badge = null,
  distance = null,
  onVerMas,
}) => {
  const [favorited, setFavorited] = useState(false);
  const badgeMeta = badge ? BADGE_CONFIG[badge] : null;

  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();

  const isService = category && category.toLowerCase().includes('servicio');

  const handleActionClick = (e) => {
    e.stopPropagation();
    if (isService) {
      // Redirige al detalle para configuración obligatoria (fecha, mascota)
      navigate(`/item/${id}`);
    } else {
      addItem({
        id,
        title,
        price,
        image,
        provider,
        type: ITEM_TYPES.PRODUCT
      });
    }
  };

  return (
    <div 
      onClick={onVerMas}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col cursor-pointer"
    >

      {/* Image area */}
      <div className="relative w-full h-44 bg-gray-100 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">🐾</div>
        )}

        {/* Badge top-left (bestseller) */}
        {badgeMeta && badge === 'bestseller' && (
          <span className={`absolute top-2 left-2 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${badgeMeta.className}`}>
            {badgeMeta.icon}
            {badgeMeta.label}
          </span>
        )}

        {/* Badge bottom (available today) */}
        {badgeMeta && badge === 'available' && (
          <span className={`absolute bottom-2 left-2 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${badgeMeta.className}`}>
            {badgeMeta.icon}
            {badgeMeta.label}
          </span>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setFavorited((v) => !v);
          }}
          aria-label={favorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              favorited ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">

        {/* Category badge */}
        {category && (
          <span className="self-start px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            {category}
          </span>
        )}

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2">
          {title}
        </h3>

        {/* Provider */}
        <p className="text-sm text-gray-500">
          Proporcionado por{' '}
          <a
            href={providerUrl}
            onClick={(e) => e.stopPropagation()}
            className="text-green-600 hover:underline font-medium"
          >
            {provider}
          </a>
        </p>

        {/* Rating + distance */}
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <StarRating rating={rating} />
          <span>({reviewCount} reseñas)</span>
          {distance && (
            <span className="flex items-center gap-0.5 ml-auto">
              <MapPin className="w-3 h-3" />
              {distance}
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between mt-auto pt-2 border-t border-gray-50">
          <div className="flex flex-col">
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                S/ {originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-lg font-bold text-gray-900">
              {priceLabel !== 'S/' ? (
                <span className="text-xs font-normal text-gray-500 mr-1">{priceLabel}</span>
              ) : null}
              S/ {price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleActionClick}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${
              isService 
                ? "bg-white border-2 border-green-700 text-green-700 hover:bg-green-50" 
                : "bg-green-700 hover:bg-green-800 text-white"
            }`}
          >
            {isService ? <Calendar className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
            {isService ? "Agendar" : "Añadir"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;