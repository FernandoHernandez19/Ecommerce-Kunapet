import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/NavbarHeader';
import ServiceGallery from '../components/Service/ServiceGallery';
import ServiceInfo from '../components/Service/ServiceInfo';
import ServiceDescription from '../components/Service/ServiceDescription';
import ProviderProfileCard from '../components/ProviderProfileCard';
import BookingWidget from '../components/BookingWidget';
import AddToCartWidget from '../components/AddToCartWidget';
import RelatedServices from '../components/Service/RelatedServices';
import { getItem } from '../api/items';
import useApiResource from '../hooks/useApiResource';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const { data: service, loading, error, errorCode, reload } = useApiResource(
    (signal) => getItem(id ?? '', { signal }),
    [id],
    { enabled: Boolean(id) },
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" role="status" aria-label="Cargando">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (error) {
    const notFound = errorCode === 'not_found';
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div role="alert" className="max-w-md mx-auto text-center py-20 px-4">
          <h1 className="text-xl font-bold text-gray-900 mb-2">{notFound ? 'Ítem no encontrado' : 'No pudimos cargar el ítem'}</h1>
          <p className="text-sm text-gray-500 mb-6">{notFound ? 'Puede que ya no esté disponible.' : error}</p>
          <div className="flex justify-center gap-3">
            {!notFound && (
              <button type="button" onClick={reload} className="px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-bold rounded-xl transition-colors">
                Reintentar
              </button>
            )}
            <Link to="/marketplace" className="px-5 py-2.5 border border-gray-300 bg-white text-sm font-semibold text-gray-700 rounded-xl hover:bg-gray-50 no-underline">
              Volver al marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!service) return null;

  const isService = service.type === 'service';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex space-x-2">
            <li className="flex items-center">
              <Link to="/" className="hover:text-brand-primary transition-colors">Inicio</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <Link to="/marketplace" className="hover:text-brand-primary transition-colors">Marketplace</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <span className="text-gray-500">{service.category}</span>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-800 font-medium" aria-current="page">{service.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <ServiceGallery image={service.image} title={service.title} />

            <ServiceInfo
              title={service.title}
              rating={service.rating}
              reviewsCount={service.reviewCount}
              location={service.location}
              targetDogs={service.targetLabel}
            />

            <ServiceDescription
              description={service.description}
              extraInfo={service.extraInfo}
              features={service.features}
            />

            <ProviderProfileCard provider={service.provider} />

            <section className="space-y-2 border-t border-gray-200 pt-6" aria-labelledby="reviews-title">
              <h2 id="reviews-title" className="text-xl font-bold text-gray-900">Reseñas</h2>
              <p className="text-sm text-gray-500">Aún no hay reseñas para este ítem.</p>
            </section>
          </div>

          <div className="lg:col-span-1 lg:sticky lg:top-24">
            {isService ? <BookingWidget item={service} /> : <AddToCartWidget item={service} />}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200">
          <RelatedServices category={service.categorySlug} excludeId={service.id} />
        </div>
      </main>
    </div>
  );
}
