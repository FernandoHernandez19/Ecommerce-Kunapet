
/** Imagen del item. La API guarda una sola imagen (imageUrl); sin imagen se muestra un marcador. */
const ServiceGallery = ({ image, title }: { image: string | null; title?: string }) => (
  <div className="relative h-[320px] sm:h-[420px] w-full rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
    {image ? (
      <img src={image} alt={title ?? 'Imagen del item'} className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-300" role="img" aria-label="Sin imagen">
        <span className="text-6xl" aria-hidden="true">🐾</span>
        <span className="text-sm mt-2">Sin imagen</span>
      </div>
    )}
  </div>
);

export default ServiceGallery;
