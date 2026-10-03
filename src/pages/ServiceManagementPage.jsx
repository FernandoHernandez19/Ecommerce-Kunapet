import React, { useState } from 'react';
import { CheckSquare, Plus } from 'lucide-react';
import ProviderDashboardLayout from '../layouts/ProviderDashboardLayout';
import ServiceFilters from '../components/Service/ServiceFilters';
import ServiceCard from '../components/Service/ServiceCard';
import AddServiceCard from '../components/Service/AddServiceCard';
import BulkActionBar from '../components/Service/BulkActionBar';
import BulkPriceModal from '../components/Service/Modals/BulkPriceModal';
import BulkStatusModal from '../components/Service/Modals/BulkStatusModal';
import { Button } from '../components/ui';
import { useConfirmDialog } from '../components/ConfirmDialog';

// ─── Mock data inicial — se reemplazará por serviceService.getServices() ──────
const MOCK_SERVICES = [
  {
    id: 'srv-1',
    title: 'Paseo de Perros (Grupal)',
    price: 25.00,
    duration: '60 min',
    icon: '🚶‍♂️',
    iconBg: 'bg-emerald-100',
    isActive: true,
    category: 'Paseos',
    description: 'Paseo grupal en parques cercanos. Máximo 4 perros por grupo.',
  },
  {
    id: 'srv-2',
    title: 'Grooming Completo',
    price: 65.00,
    duration: '90 min',
    icon: '🚿',
    iconBg: 'bg-amber-100',
    isActive: true,
    category: 'Grooming',
    description: 'Baño, secado, corte de uñas, limpieza de oídos y perfume.',
  },
  {
    id: 'srv-3',
    title: 'Consulta Veterinaria',
    price: 55.00,
    duration: '30 min',
    icon: '🏥',
    iconBg: 'bg-blue-100',
    isActive: false,
    category: 'Veterinaria',
    description: 'Revisión general de salud con diagnóstico y recomendaciones.',
  },
];

export default function ServiceManagementPage() {
  // ── Estado de UI ────────────────────────────────────────────────────────────
  const [activeCategory,     setActiveCategory]     = useState('Todos');
  const [isBatchMode,        setIsBatchMode]        = useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);

  // ── Estado de Modales ───────────────────────────────────────────────────────
  const [isPriceModalOpen,  setIsPriceModalOpen]  = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  // ── Estado de servicios ─────────────────────────────────────────────────────
  const [services, setServices] = useState(MOCK_SERVICES);

  // ── ConfirmDialog hook (reemplaza window.confirm) ───────────────────────────
  const { confirm, ConfirmDialogRenderer } = useConfirmDialog();

  // ── Modo lote ───────────────────────────────────────────────────────────────
  const toggleBatchMode = () => {
    setIsBatchMode((prev) => !prev);
    setSelectedServiceIds([]);
  };

  const handleToggleSelection = (id) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // ── Toggle activo individual ────────────────────────────────────────────────
  const handleToggleActive = (id) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  // ── DELETE individual (FIX M6: onDelete ahora se pasa a ServiceCard) ────────
  const handleDeleteSingle = async (id) => {
    const service = services.find((s) => s.id === id);
    const ok = await confirm({
      title: '¿Eliminar servicio?',
      message: `"${service?.title}" se eliminará permanentemente de tu catálogo.`,
      confirmLabel: 'Sí, eliminar',
      cancelLabel: 'Cancelar',
      variant: 'danger',
    });
    if (ok) {
      setServices((prev) => prev.filter((s) => s.id !== id));
    }
  };

  // ── ACCIONES EN LOTE ────────────────────────────────────────────────────────
  const executeBulkPriceUpdate = (config) => {
    setServices((prev) =>
      prev.map((srv) => {
        if (!selectedServiceIds.includes(srv.id)) return srv;
        let newPrice = srv.price;
        if (config.type === 'fixed') {
          newPrice =
            config.action === 'increase'
              ? srv.price + config.amount
              : srv.price - config.amount;
        } else if (config.type === 'percentage') {
          const modifier = srv.price * (config.amount / 100);
          newPrice =
            config.action === 'increase'
              ? srv.price + modifier
              : srv.price - modifier;
        }
        return { ...srv, price: Math.max(0, newPrice) };
      })
    );
    setIsPriceModalOpen(false);
    toggleBatchMode();
  };

  const executeBulkStatusUpdate = (newStatus) => {
    setServices((prev) =>
      prev.map((srv) =>
        selectedServiceIds.includes(srv.id) ? { ...srv, isActive: newStatus } : srv
      )
    );
    setIsStatusModalOpen(false);
    toggleBatchMode();
  };

  // ── DELETE MASIVO (A7: reemplaza window.confirm) ────────────────────────────
  const executeBulkDelete = async () => {
    const count = selectedServiceIds.length;
    const ok = await confirm({
      title: `¿Eliminar ${count} ${count === 1 ? 'servicio' : 'servicios'}?`,
      message:
        'Esta acción es permanente y no se puede deshacer. Los servicios desaparecerán de tu catálogo inmediatamente.',
      confirmLabel: `Eliminar ${count} ${count === 1 ? 'servicio' : 'servicios'}`,
      cancelLabel: 'Cancelar',
      variant: 'danger',
    });
    if (ok) {
      setServices((prev) =>
        prev.filter((srv) => !selectedServiceIds.includes(srv.id))
      );
      toggleBatchMode();
    }
  };

  // ── Filtrado ─────────────────────────────────────────────────────────────────
  const filteredServices = services.filter(
    (srv) => activeCategory === 'Todos' || srv.category === activeCategory
  );

  return (
    <ProviderDashboardLayout>
      <div
        className={`max-w-6xl mx-auto transition-all duration-300 ${
          isBatchMode && selectedServiceIds.length > 0 ? 'pb-28' : 'pb-8'
        }`}
      >
        {/* ── Cabecera ── */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">
              Gestión de Servicios
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              {services.length} {services.length === 1 ? 'servicio' : 'servicios'} en tu catálogo
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Botón: Acciones en lote */}
            <Button
              variant={isBatchMode ? 'outline' : 'ghost'}
              size="md"
              leftIcon={<CheckSquare size={16} />}
              onClick={toggleBatchMode}
            >
              {isBatchMode ? 'Cancelar selección' : 'Selección múltiple'}
            </Button>

            {/* Botón: Nuevo servicio (solo fuera de modo lote) */}
            {!isBatchMode && (
              <Button
                variant="secondary"
                size="md"
                leftIcon={<Plus size={16} />}
              >
                Nuevo Servicio
              </Button>
            )}
          </div>
        </div>

        {/* ── Filtros ── */}
        <ServiceFilters
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {/* ── Grid de servicios ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              // FIX M6: precio formateado solo para display, el precio real queda en service.price
              service={{ ...service, price: `S/ ${service.price.toFixed(2)}` }}
              onToggleActive={handleToggleActive}
              onDelete={handleDeleteSingle}        // ✅ FIX M6 — prop ahora pasada
              isBatchMode={isBatchMode}
              isSelected={selectedServiceIds.includes(service.id)}
              onToggleSelection={handleToggleSelection}
            />
          ))}

          {/* Tarjeta "Agregar nuevo" (solo fuera de modo lote) */}
          {!isBatchMode && <AddServiceCard />}
        </div>

        {/* ── Estado vacío ── */}
        {filteredServices.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4" aria-hidden="true">📭</div>
            <p className="text-lg font-bold text-gray-600 mb-2">
              No hay servicios en esta categoría
            </p>
            <p className="text-sm text-gray-400">
              Prueba cambiando el filtro o agrega un nuevo servicio.
            </p>
          </div>
        )}
      </div>

      {/* ── Barra de acciones en lote (flotante) ── */}
      <BulkActionBar
        selectedCount={selectedServiceIds.length}
        onUpdatePrices={() => setIsPriceModalOpen(true)}
        onChangeAvailability={() => setIsStatusModalOpen(true)}
        onDelete={executeBulkDelete}
        onClose={toggleBatchMode}
      />

      {/* ── Modales de lote ── */}
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

      {/* ── ConfirmDialog (se monta aquí para tener acceso al estado) ── */}
      <ConfirmDialogRenderer />
    </ProviderDashboardLayout>
  );
}