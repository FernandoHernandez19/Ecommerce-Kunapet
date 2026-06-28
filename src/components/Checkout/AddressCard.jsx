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
import { MapPin, Truck, Pencil } from 'lucide-react';

export default function AddressCard({
  address = {
    label:      'Casa (Principal)',
    street:     'Av. Javier Prado Este 456, Dpto 302',
    district:   'San Isidro',
    city:       'Lima',
    country:    'Perú',
    reference:  'Frente al parque El Olivar',
  },
  onEdit,
  isLoading = false,
}) {
  return (
    <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <span className="p-1.5 bg-brand-secondary-light rounded-lg">
            <Truck size={16} className="text-brand-secondary" aria-hidden="true" />
          </span>
          Dirección de Envío y Servicio
        </h2>

        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 text-xs font-bold text-brand-secondary hover:text-brand-secondary-hover transition-colors"
            aria-label="Editar dirección"
          >
            <Pencil size={12} />
            Editar
          </button>
        )}
      </div>

      {/* Dirección */}
      {isLoading ? (
        <div className="bg-surface-secondary rounded-xl p-4 animate-pulse">
          <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-2/3 mb-1" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      ) : (
        <div className="bg-surface-secondary border border-surface-border rounded-xl p-4 flex items-start gap-3">
          <MapPin
            size={18}
            className="text-gray-400 mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <address className="not-italic">
            <p className="text-sm font-bold text-gray-900 mb-0.5">
              {address.label}
            </p>
            <p className="text-sm text-gray-600">{address.street}</p>
            <p className="text-sm text-gray-600">
              {address.district}, {address.city}, {address.country}
            </p>
            {address.reference && (
              <p className="text-xs text-gray-400 font-medium mt-2">
                Ref: {address.reference}
              </p>
            )}
          </address>
        </div>
      )}
    </div>
  );
}
