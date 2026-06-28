import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import CarouselBanner from '../components/Carousel';
import CardsHorizontal from '../components/CardsHorizontal';

export default function Home() {
  return (
    <MainLayout>
      {/* ── Banner Principal ── */}
      <CarouselBanner />

      {/* ── Sección de Estadísticas / Trust Signals ── */}
      <section className="bg-emerald-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-black mb-1">500+</div>
            <div className="text-emerald-100 text-sm font-medium">Especialistas activos</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black mb-1">10k+</div>
            <div className="text-emerald-100 text-sm font-medium">Mascotas felices</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black mb-1">4.9/5</div>
            <div className="text-emerald-100 text-sm font-medium">Calificación promedio</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black mb-1">24/7</div>
            <div className="text-emerald-100 text-sm font-medium">Soporte continuo</div>
          </div>
        </div>
      </section>

      {/* ── Categorías (CardsHorizontal que acabas de editar) ── */}
      <section className="py-16 bg-surface-primary">
        <div className="max-w-7xl mx-auto px-4 text-center mb-2">
          <h2 className="text-3xl font-black text-gray-900">¿Qué necesita tu peludo hoy?</h2>
          <p className="text-gray-500 mt-3">Encuentra los mejores servicios cerca de ti</p>
        </div>
        <CardsHorizontal />
      </section>

      {/* ── CTA Final ── */}
      <section className="bg-brand-secondary/10 py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-black text-gray-900 mb-6">
            Únete a la familia <span className="text-brand-secondary">KunaPet</span>
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Ya sea que busques el mejor cuidado para tu mascota o quieras ofrecer tus servicios profesionales, este es el lugar correcto.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/select-role" className="px-8 py-4 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
              Crear mi cuenta gratis
            </Link>
            <Link to="/marketplace" className="px-8 py-4 bg-white text-gray-900 border border-gray-200 hover:border-gray-300 font-bold rounded-xl transition-all shadow-sm hover:shadow-md">
              Explorar servicios
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
