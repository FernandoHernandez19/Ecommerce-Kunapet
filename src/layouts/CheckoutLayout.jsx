import React from 'react';

export default function CheckoutLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-800 flex flex-col">
      {/* Cabecera Minimalista */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-30">
        <a href="/marketplace" className="flex items-center text-sm font-semibold text-gray-500 hover:text-brand-secondary transition-colors">
          <span className="mr-2">←</span> Seguir comprando
        </a>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <span className="text-2xl font-black text-[#e23d28] tracking-tight">KunaPet</span>
        </div>
        <div className="w-24"></div> {/* Espaciador para centrar el logo */}
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 lg:py-12">
        {children}
      </main>

      {/* Footer Traducido */}
      <footer className="bg-white py-10 px-6 lg:px-12 border-t border-gray-200 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <span className="text-xl font-black text-[#e23d28]">KunaPet</span>
            <p className="text-sm font-semibold text-gray-500">© 2024 KunaPet Marketplace. Todos los derechos reservados.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-semibold text-gray-500 border-t border-gray-100 pt-8">
            <a href="/terminos" className="hover:text-gray-900 transition-colors">Términos de Servicio</a>
            <a href="/cookies" className="hover:text-gray-900 transition-colors">Configuración de Cookies</a>
            <a href="/empleos" className="hover:text-gray-900 transition-colors">Empleos</a>
            <a href="/privacidad" className="hover:text-gray-900 transition-colors">Política de Privacidad</a>
            <a href="/soporte" className="hover:text-gray-900 transition-colors">Centro de Soporte</a>
            <a href="/ayuda" className="hover:text-gray-900 transition-colors">Centro de Ayuda</a>
          </div>
        </div>
      </footer>
    </div>
  );
}