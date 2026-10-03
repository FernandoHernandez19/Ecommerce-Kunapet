import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { HelpCircle } from 'lucide-react';

/**
 * NotFoundPage — Página 404 para rutas inexistentes.
 * Ahora incluye MainLayout para mantener consistencia y accesibilidad.
 */
export default function NotFoundPage() {
  return (
    <MainLayout>
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
        {/* Ícono animado */}
        <div className="text-8xl mb-8 animate-bounce" aria-hidden="true">🐾</div>

        {/* Código de error */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary-light text-brand-primary rounded-full font-bold uppercase tracking-widest text-sm mb-6">
          <HelpCircle size={16} />
          Error 404
        </div>

        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight max-w-2xl">
          ¡Ups! Esta página se nos escapó del corral
        </h1>

        {/* Subtítulo */}
        <p className="text-gray-500 text-lg max-w-md mx-auto mb-10 leading-relaxed">
          La página que buscas no existe o fue movida. Pero no te preocupes, tus mascotas siguen aquí esperando.
        </p>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
          <Link
            to="/"
            className="px-8 py-4 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 no-underline"
          >
            Volver al inicio
          </Link>
          <Link
            to="/marketplace"
            className="px-8 py-4 bg-white text-brand-primary border border-brand-primary hover:bg-brand-primary-light font-bold rounded-xl transition-all shadow-sm hover:shadow-md no-underline"
          >
            Explorar Marketplace
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
