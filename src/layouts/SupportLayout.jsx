import React from 'react';
import ChatButton from '../components/Support/ChatButton';

export default function SupportLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-800 flex flex-col relative">
      {/* Cabecera de Soporte (Solución de Idioma) */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-30">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-black text-[#006D44] tracking-tight">KunaPet Support</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-gray-500">
          <a href="/marketplace" className="hover:text-gray-900 transition-colors">Marketplace</a>
          <a href="/mis-mascotas" className="hover:text-gray-900 transition-colors">Mis Mascotas</a>
          <a href="/reclamos" className="hover:text-gray-900 transition-colors">Reclamos</a>
          <a href="/ayuda" className="text-[#006D44] border-b-2 border-[#006D44] pb-1">Centro de Ayuda</a>
        </nav>

        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
          </button>
          <button className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 lg:py-16">
        {children}
      </main>

      {/* Botón Flotante Global (Solución UX) */}
      <ChatButton />

      {/* Footer de Soporte */}
      <footer className="bg-[#F5F4F0] py-8 px-6 lg:px-12 border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-semibold text-gray-500">© 2024 KunaPet Marketplace. Todos los derechos reservados.</p>
          <div className="flex space-x-6 text-sm font-semibold text-gray-500">
            <a href="/privacidad" className="hover:text-gray-900 transition-colors">Política de Privacidad</a>
            <a href="/terminos" className="hover:text-gray-900 transition-colors">Términos de Servicio</a>
            <a href="/contacto" className="hover:text-gray-900 transition-colors">Contactar Soporte</a>
            <a href="/seguridad" className="hover:text-gray-900 transition-colors">Confianza y Seguridad</a>
          </div>
        </div>
      </footer>
    </div>
  );
}