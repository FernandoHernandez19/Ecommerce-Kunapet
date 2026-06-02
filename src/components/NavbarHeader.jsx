import React, { useState } from 'react'
import BrandImage from '../assets/Kunapet.png';
import PerfilImage from '../assets/Perfil.jpg'

export default function NavbarHeader() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [perfilOpen, setPerfilOpen] = useState(false);

    const perfilTitulo = (
  <div className="flex items-center gap-2 cursor-pointer">
    <img
      src={PerfilImage}
      alt="Perfil"
      className="rounded-full"
      style={{ width: '35px', height: '35px', objectFit: 'cover' }}
    />
    <span className="text-gray-800 font-semibold text-sm">Mi Perfil</span>
  </div>
);

  return (
    <>
      <nav className="bg-gray-100 mb-3">
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap lg:flex-nowrap">

            {/* Logo */}
            <a href="/" className="flex-shrink-0">
              <img src={BrandImage} alt="" style={{width: "12rem", height: "auto"}} />
            </a>

            {/* Search Bar - Hidden on mobile, visible on lg */}
            <div className="hidden lg:flex flex-grow mx-4 gap-2">
              <input
                type="search"
                placeholder="Buscar servicios, comida, juguetes..."
                className="flex-grow px-4 py-2 rounded-full bg-gray-200 border-0"
              />
              <button className="px-4 py-2 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600 transition">
                Buscar
              </button>
            </div>

            {/* Menu Toggle Button (Mobile) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-gray-800 font-bold text-2xl"
            >
              ☰
            </button>

            {/* Right Navigation Menu */}
            <div className="hidden lg:flex items-center gap-4">
              <a href="#action1" className="text-gray-800 font-semibold text-sm hover:text-orange-600 transition">Home</a>
              <a href="#action2" className="text-gray-800 font-semibold text-sm hover:text-orange-600 transition">Link</a>
            </div>

            {/* Perfil Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPerfilOpen(!perfilOpen)}
                className="flex items-center gap-2"
              >
                {perfilTitulo}
              </button>
              {perfilOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                  <a href="#compras" className="block px-4 py-2 text-gray-800 text-sm hover:bg-gray-100">Mis Compras</a>
                  <a href="#configuracion" className="block px-4 py-2 text-gray-800 text-sm hover:bg-gray-100">Configuración</a>
                  <hr className="my-1" />
                  <a href="#salir" className="block px-4 py-2 text-gray-800 text-sm hover:bg-gray-100">Cerrar sesión</a>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="lg:hidden mt-4 pb-4">
              <div className="flex flex-col gap-3 mb-4">
                <input
                  type="search"
                  placeholder="Buscar..."
                  className="w-full px-4 py-2 rounded-full bg-gray-200 border-0"
                />
                <button className="w-full px-4 py-2 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600 transition">
                  Buscar
                </button>
              </div>
              <a href="#action1" className="block text-gray-800 font-semibold text-sm hover:text-orange-600 transition py-2">Home</a>
              <a href="#action2" className="block text-gray-800 font-semibold text-sm hover:text-orange-600 transition py-2">Link</a>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}