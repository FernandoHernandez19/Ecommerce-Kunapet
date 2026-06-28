import React, { useState } from 'react';
import ProviderDashboardLayout from '../layouts/ProviderDashboardLayout';
import ServiceFilters from '../components/Service/ServiceFilters';
import ServiceCard from '../components/Service/ServiceCard';
import AddServiceCard from '../components/Service/AddServiceCard';
import BulkActionBar from '../components/Service/BulkActionBar';
import BulkPriceModal from '../components/Service/Modals/BulkPriceModal';
import BulkStatusModal from '../components/Service/Modals/BulkStatusModal';

export default function ServiceManagementPage() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  
  // Estado de los Modales
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  // Estado mock de los servicios
  const [services, setServices] = useState([
    { id: 'srv-1', title: 'Paseo de Perros (Grupal)', price: 25.00, duration: '60 min', icon: '🚶‍♂️', iconBg: 'bg-emerald-100', isActive: true, category: 'Paseos' },
    { id: 'srv-2', title: 'Grooming Completo', price: 65.00, duration: '90 min', icon: '🚿', iconBg: 'bg-amber-100', isActive: true, category: 'Grooming' }
  ]);

  // Manejo del Lote
  const toggleBatchMode = () => {
    setIsBatchMode(!isBatchMode);
    if (isBatchMode) setSelectedServiceIds([]);
  };

  const handleToggleSelection = (id) => {
    setSelectedServiceIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  // --- EJECUCIÓN DE ACCIONES EN LOTE ---

  const executeBulkPriceUpdate = (config) => {
    const updatedServices = services.map(srv => {
      if (selectedServiceIds.includes(srv.id)) {
        let newPrice = srv.price;
        if (config.type === 'fixed') {
          newPrice = config.action === 'increase' ? srv.price + config.amount : srv.price - config.amount;
        } else if (config.type === 'percentage') {
          const modifier = srv.price * (config.amount / 100);
          newPrice = config.action === 'increase' ? srv.price + modifier : srv.price - modifier;
        }
        return { ...srv, price: Math.max(0, newPrice) }; // Evitar precios negativos
      }
      return srv;
    });
    setServices(updatedServices);
    setIsPriceModalOpen(false);
    toggleBatchMode(); // Salir del modo lote tras el éxito
  };

  const executeBulkStatusUpdate = (newStatus) => {
    const updatedServices = services.map(srv => 
      selectedServiceIds.includes(srv.id) ? { ...srv, isActive: newStatus } : srv
    );
    setServices(updatedServices);
    setIsStatusModalOpen(false);
    toggleBatchMode();
  };

  const executeBulkDelete = () => {
    if (window.confirm(`¿Seguro que deseas eliminar ${selectedServiceIds.length} servicios?`)) {
      setServices(services.filter(srv => !selectedServiceIds.includes(srv.id)));
      toggleBatchMode();
    }
  };

  const filteredServices = services.filter(srv => activeCategory === 'Todos' || srv.category === activeCategory);

  return (
    <ProviderDashboardLayout>
      <div className={`max-w-6xl mx-auto transition-all duration-300 ${isBatchMode && selectedServiceIds.length > 0 ? 'pb-28' : 'pb-8'}`}>
        
        {/* Cabecera y botón Acciones en lote */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Gestión de Servicios</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleBatchMode} className={`font-extrabold py-3 px-6 rounded-full border-2 transition-colors ${isBatchMode ? 'border-[#006D44] bg-emerald-50 text-[#006D44]' : 'border-gray-200 text-[#006D44] hover:bg-gray-50'}`}>
              <span>{isBatchMode ? 'Cancelar Lote' : '✓= Acciones en lote'}</span>
            </button>
          </div>
        </div>

        <ServiceFilters activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

        {/* Cuadrícula */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
          {filteredServices.map(service => (
            <ServiceCard 
              key={service.id} 
              service={{ ...service, price: `S/ ${service.price.toFixed(2)}` }} // Formateo visual
              onToggleActive={(id) => setServices(services.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s))}
              isBatchMode={isBatchMode}
              isSelected={selectedServiceIds.includes(service.id)}
              onToggleSelection={handleToggleSelection}
            />
          ))}
          {!isBatchMode && <AddServiceCard />}
        </div>
      </div>

      {/* Modales y Barra Flotante */}
      <BulkActionBar 
        selectedCount={selectedServiceIds.length}
        onUpdatePrices={() => setIsPriceModalOpen(true)}
        onChangeAvailability={() => setIsStatusModalOpen(true)}
        onDelete={executeBulkDelete}
        onClose={toggleBatchMode}
      />

      <BulkPriceModal 
        isOpen={isPriceModalOpen} 
        onClose={() => setIsPriceModalOpen(false)}
        selectedCount={selectedServiceIds.length}
        onConfirm={executeBulkPriceUpdate}
      />

      <BulkStatusModal 
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        selectedCount={selectedServiceIds.length}
        onConfirm={executeBulkStatusUpdate}
      />
      
    </ProviderDashboardLayout>
  );
}