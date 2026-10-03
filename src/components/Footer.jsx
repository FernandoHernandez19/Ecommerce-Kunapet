import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

const currentYear = new Date().getFullYear();

/**
 * Footer — Pie de página global de KunaPet.
 * Diseño on-brand con fondo oscuro, múltiples columnas y redes sociales.
 */
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Columna 1: Brand & Bio */}
          <div>
            <Link to="/" className="inline-block no-underline mb-6">
              <span className="text-3xl font-black text-white tracking-tight">
                Kuna<span className="text-emerald-500">Pet</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              El ecosistema definitivo para el bienestar de tus mascotas. Conectamos dueños amorosos con los mejores especialistas de la ciudad.
            </p>
            <div className="flex gap-4">
              {/* Facebook SVG */}
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              {/* Instagram SVG */}
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              {/* Twitter SVG */}
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Explorar</h3>
            <ul className="space-y-4 p-0 m-0 list-none">
              <li><Link to="/marketplace" className="text-gray-400 hover:text-emerald-400 no-underline transition-colors">Marketplace</Link></li>
              <li><Link to="/provider-registration" className="text-gray-400 hover:text-emerald-400 no-underline transition-colors">Únete como Proveedor</Link></li>
              <li><Link to="/help-center" className="text-gray-400 hover:text-emerald-400 no-underline transition-colors">Centro de Ayuda</Link></li>
              <li><Link to="/select-role" className="text-gray-400 hover:text-emerald-400 no-underline transition-colors">Crear Cuenta</Link></li>
            </ul>
          </div>

          {/* Columna 3: Legal */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Legal</h3>
            <ul className="space-y-4 p-0 m-0 list-none">
              <li><Link to="#" className="text-gray-400 hover:text-emerald-400 no-underline transition-colors">Términos de Servicio</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-emerald-400 no-underline transition-colors">Política de Privacidad</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-emerald-400 no-underline transition-colors">Política de Cookies</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-emerald-400 no-underline transition-colors">Garantía KunaPet</Link></li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Contacto</h3>
            <ul className="space-y-4 p-0 m-0 list-none">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-emerald-500 mt-1 shrink-0" />
                <span className="text-gray-400 text-sm">Av. Javier Prado Este 456<br/>San Isidro, Lima, Perú</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-emerald-500 shrink-0" />
                <span className="text-gray-400 text-sm">+51 999 888 777</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-emerald-500 shrink-0" />
                <span className="text-gray-400 text-sm">hola@kunapet.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="mx-auto px-4 py-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 m-0">
            © {currentYear} KunaPet. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Hecho con</span>
            <span className="text-red-500">❤</span>
            <span>para las mascotas</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
