import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronRight } from 'lucide-react';
import AddressCard from './AddressCard';
import AddressFormModal from './AddressFormModal';
import AddressSelectorModal from './AddressSelectorModal';
import { mockUser } from '../../data/mockData';

export default function StepLogistics({ items, onNext }) {
  const hasServices = items.some(item => item.type === 'service');
  const hasProducts = items.some(item => item.type === 'product');

  // Estado para la agenda simulada
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Estado de direcciones
  const [addresses, setAddresses] = useState(mockUser.addresses);
  const [selectedAddressId, setSelectedAddressId] = useState(
    mockUser.addresses.find(a => a.isDefault)?.id || mockUser.addresses[0]?.id
  );

  // Estados de los Modales
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  const dates = [
    { day: 'Lun', date: '14' },
    { day: 'Mar', date: '15' },
    { day: 'Mié', date: '16' },
    { day: 'Jue', date: '17' },
    { day: 'Vie', date: '18' },
    { day: 'Sáb', date: '19' },
  ];

  const times = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'];

  const handleSaveNewAddress = (newAddressData) => {
    const newAddress = {
      ...newAddressData,
      id: `a${Date.now()}`, // ID simulado
      isDefault: false
    };
    setAddresses([...addresses, newAddress]);
    setSelectedAddressId(newAddress.id);
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Despacho y Reserva</h1>
      <p className="text-sm text-gray-500 mb-6">Confirma dónde y cuándo quieres recibir tus pedidos o servicios.</p>

      {hasProducts && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Dirección de Entrega</h2>
          {selectedAddress && (
            <AddressCard address={selectedAddress} onEdit={() => setIsSelectorOpen(true)} />
          )}
          <button 
            onClick={() => setIsFormOpen(true)}
            className="text-sm font-bold text-brand-secondary hover:text-brand-secondary-hover transition-colors underline-offset-2 hover:underline"
          >
            + Agregar nueva dirección
          </button>
        </div>
      )}

      {hasServices && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
            <CalendarIcon size={16} className="text-brand-secondary" />
            Resumen de tus citas
          </h2>
          <div className="space-y-4">
            {items.filter(item => item.type === 'service').map((service) => (
              <div key={service.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-secondary-light/20 flex items-center justify-center shrink-0 mt-1">
                  <CalendarIcon size={20} className="text-brand-secondary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{service.title}</h3>
                  {/* El subtitle en los mocks contiene 'Para Luna • 12 Oct, 10:00 AM' */}
                  <p className="text-sm text-brand-secondary font-medium mb-2">{service.subtitle}</p>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Cita Pre-agendada
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="lg:hidden mt-6">
        <button 
          onClick={onNext}
          className="w-full bg-brand-secondary text-white font-bold py-4 rounded-xl shadow-md flex justify-center items-center gap-2"
        >
          Continuar al Pago <ChevronRight size={18} />
        </button>
      </div>

      {/* Modal para Seleccionar Dirección Existente */}
      <AddressSelectorModal 
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        onSelect={(addr) => setSelectedAddressId(addr.id)}
        onAddNew={() => setIsFormOpen(true)}
      />

      {/* Modal para Crear Nueva Dirección */}
      <AddressFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveNewAddress}
      />
    </div>
  );
}
