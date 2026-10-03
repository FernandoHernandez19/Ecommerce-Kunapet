/**
 * MainLayout — Layout base para páginas públicas de KunaPet.
 *
 * Estructura:
 *   NavbarHeader (sticky top)
 *   └─ main (contenido de la página)
 *       └─ children
 *   FooterBottom
 *
 * Usado por: Home, Marketplace, ServiceDetail, HelpCenter
 * (actualmente cada página monta Navbar y Footer de forma independiente;
 *  esta versión centralizada permite migrarlas gradualmente)
 */

import React from 'react';
import NavbarHeader from '../components/NavbarHeader';
import FooterBottom from '../components/Footer';

export default function MainLayout({ children, hideFooter = false }) {
  return (
    <div className="flex flex-col min-h-screen bg-surface-secondary font-sans">
      {/* Navegación global sticky */}
      <NavbarHeader />

      {/* Contenido principal */}
      <main className="flex-1" id="main-content" tabIndex={-1}>
        {children}
      </main>

      {/* Footer */}
      {!hideFooter && <FooterBottom />}
    </div>
  );
}
