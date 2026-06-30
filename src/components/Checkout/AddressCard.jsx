/**
 * AddressCard — Tarjeta de dirección de envío/servicio en el Checkout.
 *
 * Muestra la dirección guardada del usuario con opción de editar.
 * Cuando se integre el API, recibirá la dirección desde useAuthStore o
 * un endpoint dedicado de direcciones del usuario.
 *
 * Props:
 *  @param {object}   address     — Objeto de dirección
 *  @param {Function} onEdit      — Callback para abrir el editor de dirección
 *  @param {boolean}  isLoading   — Estado de carga
 */

import React from 'react';
import { MapPin } from 'lucide-react';

export default function AddressCard({
  address = {
    label:      'Casa (Principal)',
    street:     'Av. Javier Prado Este 456, Dpto 302',
    district:   'San Isidro',
    city:       'Lima',
    country:    'Perú',
    reference:  'Frente al parque El Olivar',
  },
  onEdit = () => {},
  isLoading = false,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-6 flex items-center justify-between">
      {isLoading ? (
        <div className="flex-1 animate-pulse">
          <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-brand-secondary-light/30 flex items-center justify-center shrink-0">
            <MapPin size={20} className="text-brand-secondary" />
          </div>
          <div className="not-italic">
            <p className="text-sm font-bold text-gray-900 mb-0.5">
              Dirección de Envío y Servicio
            </p>
            <p className="text-xs text-gray-600">
              {address.street}, {address.district}
            </p>
          </div>
        </div>
      )}
      
      {!isLoading && (
        <button
          onClick={onEdit}
          className="text-xs font-bold text-brand-secondary hover:text-brand-secondary-hover transition-colors underline-offset-2 hover:underline shrink-0 ml-4"
          aria-label="Cambiar dirección"
        >
          Cambiar
        </button>
      )}
    </div>
  );
}
