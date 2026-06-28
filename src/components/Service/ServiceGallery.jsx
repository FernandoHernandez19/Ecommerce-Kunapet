import React, { useState } from 'react';

const ServiceGallery = () => {
  // Array de imágenes simulando la galería del servicio
  const images = [
    "https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&auto=format&fit=crop&q=80", // Perros felices principal
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&auto=format&fit=crop&q=80"  // Perros jugando miniatura
  ];

  const [activeImage, setActiveImage] = useState(images[0]);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="space-y-3">
      {/* Imagen Principal */}
      <div className="relative h-[320px] sm:h-[420px] w-full rounded-2xl overflow-hidden bg-gray-100 group shadow-sm">
        <img 
          src={activeImage} 
          alt="Visualización del servicio de paseo" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        
        {/* Botones Flotantes de Interacción */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          {/* Favorito */}
          <button 
            type="button"
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2.5 bg-white rounded-full shadow-md text-gray-700 hover:text-red-500 transition-colors focus:outline-none"
            aria-label="Añadir a favoritos"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 ${isFavorite ? 'text-red-500' : ''}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>
          
          {/* Compartir */}
          <button 
            type="button"
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="p-2.5 bg-white rounded-full shadow-md text-gray-700 hover:text-brand-primary transition-colors focus:outline-none"
            aria-label="Compartir servicio"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Miniaturas */}
      <div className="flex gap-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(img)}
            className={`w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border-2 transition-all ${
              activeImage === img ? 'border-brand-primary scale-95 shadow-sm' : 'border-transparent opacity-80 hover:opacity-100'
            }`}
          >
            <img src={img} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceGallery;