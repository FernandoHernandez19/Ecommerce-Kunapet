import { useMemo, useState } from 'react';
import { CheckSquare, Plus } from 'lucide-react';
import ProviderDashboardLayout from '../layouts/ProviderDashboardLayout';
import ServiceFilters, { type ServiceSort } from '../components/Service/ServiceFilters';
import ServiceCard from '../components/Service/ServiceCard';
import AddServiceCard from '../components/Service/AddServiceCard';
import BulkActionBar from '../components/Service/BulkActionBar';
import BulkPriceModal from '../components/Service/Modals/BulkPriceModal';
import BulkStatusModal from '../components/Service/Modals/BulkStatusModal';
import ServiceFormModal from '../components/Service/Modals/ServiceFormModal';
import { Button } from '../components/ui';
import { useConfirmDialog } from '../components/ConfirmDialog';
import useAuthStore from '../store/useAuthStore';
import useApiResource from '../hooks/useApiResource';
import { createItem, deactivateItem, listMyItems, patchItem, updateItem } from '../api/items';
import { BULK_LIMIT, bulkPriceCents, type BulkPriceConfig, type ItemFormInput, type UiItem } from '../api/adapters';
import { runSequentially } from '../api/bulk';
import { ApiError } from '../api/ApiError';
import { friendlyMessage } from '../api/errorMessages';

export default function ServiceManagementPage() {
  const user = useAuthStore((s) => s.user);

  // ── Datos (GET /items filtrado a los del proveedor) ─────────────────────────
  const { data, loading, error, reload, setData } = useApiResource(
    (signal) => listMyItems(user?.id ?? '', { signal }),
    [user?.id],
    { enabled: Boolean(user?.id) },
  );
  // Esta pantalla gestiona servicios; los productos del proveedor no se muestran aquí.
  const services = useMemo(() => (data ?? []).filter((i) => i.type === 'service'), [data]);

  // ── Estado de UI ────────────────────────────────────────────────────────────
  const [activeCategory,     setActiveCategory]     = useState('Todos');
  const [sortBy,             setSortBy]             = useState<ServiceSort>('recent');
  const [isBatchMode,        setIsBatchMode]        = useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [isPriceModalOpen,  setIsPriceModalOpen]  = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [formState, setFormState] = useState<{ open: boolean; service: UiItem | null }>({ open: false, service: null });
  const [busyIds, setBusyIds] = useState<string[]>([]);
  const [banner, setBanner] = useState<{ kind: 'error' | 'ok'; text: string } | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);

  const { confirm, ConfirmDialogRenderer } = useConfirmDialog();

  // Reemplaza un item en la lista local con la versión que devolvió la API.
  const replaceLocal = (updated: UiItem) =>
    setData((list) => (list ?? []).map((i) => (i.id === updated.id ? updated : i)));

  const toggleBatchMode = () => {
    setIsBatchMode((prev) => !prev);
    setSelectedServiceIds([]);
    setBanner(null);
  };

  const handleToggleSelection = (id: string) => {
    setSelectedServiceIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const withBusy = async (id: string, action: () => Promise<void>) => {
    setBusyIds((b) => [...b, id]);
    setBanner(null);
    try {
      await action();
    } catch (err) {
      setBanner({ kind: 'error', text: friendlyMessage(err) });
    } finally {
      setBusyIds((b) => b.filter((x) => x !== id));
    }
  };

  // ── Crear / editar ──────────────────────────────────────────────────────────
  const handleSubmitForm = async (form: ItemFormInput) => {
    if (formState.service) {
      replaceLocal(await updateItem(formState.service.id, form));
    } else {
      const created = await createItem(form);
      setData((list) => [created, ...(list ?? [])]);
    }
    setFormState({ open: false, service: null });
  };

  // ── Activar / desactivar individual ─────────────────────────────────────────
  const handleToggleActive = (id: string) => {
    const service = services.find((s) => s.id === id);
    if (!service) return;
    return withBusy(id, async () => replaceLocal(await patchItem(id, { isActive: !service.isActive })));
  };

  // ── "Eliminar" individual: la API desactiva el item, no lo borra ────────────
  const handleDeleteSingle = async (id: string) => {
    const service = services.find((s) => s.id === id);
    if (!service) return;
    const ok = await confirm({
      title: '¿Desactivar servicio?',
      message: `«${service.title}» dejará de mostrarse en el catálogo. Podrás reactivarlo cuando quieras.`,
      confirmLabel: 'Sí, desactivar',
      cancelLabel: 'Cancelar',
      variant: 'danger',
    });
    if (!ok) return;
    await withBusy(id, async () => {
      await deactivateItem(id);
      replaceLocal({ ...service, isActive: false });
    });
  };

  // ── ACCIONES EN LOTE: PATCH individuales y secuenciales (máx. 20) ───────────
  const runBulk = async (ids: string[], worker: (id: string) => Promise<UiItem>, verb: string) => {
    if (ids.length > BULK_LIMIT) {
      setBanner({ kind: 'error', text: `Selecciona como máximo ${BULK_LIMIT} servicios por acción masiva.` });
      return false;
    }
    setBulkBusy(true);
    setBanner(null);
    const { ok, failed } = await runSequentially(ids, worker);
    setBulkBusy(false);

    // La lista local refleja SOLO lo que la API confirmó.
    setData((list) => (list ?? []).map((i) => ok.find((r) => r.id === i.id)?.value ?? i));

    if (failed.length === 0) {
      setBanner({ kind: 'ok', text: `${verb}: ${ok.length} de ${ids.length}.` });
      return true;
    }
    const title = (id: string) => services.find((s) => s.id === id)?.title ?? id;
    const detail = failed.slice(0, 3).map((f) => `«${title(f.id)}» (${friendlyMessage(f.error)})`).join('; ');
    setBanner({
      kind: 'error',
      text: `${verb}: ${ok.length} de ${ids.length}. No se pudo en: ${detail}${failed.length > 3 ? ` y ${failed.length - 3} más` : ''}.`,
    });
    setSelectedServiceIds(failed.map((f) => f.id)); // quedan seleccionados para reintentar
    return false;
  };

  const executeBulkPriceUpdate = async (config: BulkPriceConfig) => {
    setIsPriceModalOpen(false);
    const allOk = await runBulk(
      selectedServiceIds,
      async (id) => {
        const service = services.find((s) => s.id === id);
        if (!service) throw new ApiError({ status: 404, code: 'not_found', message: 'El servicio ya no está en la lista.' });
        const next = bulkPriceCents(service.priceCents, config);
        if (next === null) {
          throw new ApiError({ status: 422, code: 'unprocessable_entity', message: 'El precio resultante no es válido.' });
        }
        return patchItem(id, { priceCents: next });
      },
      'Precios actualizados',
    );
    if (allOk) toggleBatchMode();
  };

  const executeBulkStatusUpdate = async (newStatus: boolean) => {
    setIsStatusModalOpen(false);
    const allOk = await runBulk(
      selectedServiceIds,
      (id) => patchItem(id, { isActive: newStatus }),
      newStatus ? 'Servicios activados' : 'Servicios desactivados',
    );
    if (allOk) toggleBatchMode();
  };

  const executeBulkDelete = async () => {
    const count = selectedServiceIds.length;
    const ok = await confirm({
      title: `¿Desactivar ${count} ${count === 1 ? 'servicio' : 'servicios'}?`,
      message: 'Dejarán de mostrarse en el catálogo. Podrás reactivarlos cuando quieras.',
      confirmLabel: `Desactivar ${count} ${count === 1 ? 'servicio' : 'servicios'}`,
      cancelLabel: 'Cancelar',
      variant: 'danger',
    });
    if (!ok) return;
    const allOk = await runBulk(
      selectedServiceIds,
      async (id) => {
        await deactivateItem(id);
        const service = services.find((s) => s.id === id);
        if (!service) throw new ApiError({ status: 404, code: 'not_found', message: 'El servicio ya no está en la lista.' });
        return { ...service, isActive: false };
      },
      'Servicios desactivados',
    );
    if (allOk) toggleBatchMode();
  };

  // ── Filtrado y orden ────────────────────────────────────────────────────────
  const visibleServices = useMemo(() => {
    const list = services.filter((s) => activeCategory === 'Todos' || s.categoryLabel === activeCategory);
    if (sortBy === 'price_asc') list.sort((a, b) => a.priceCents - b.priceCents);
    if (sortBy === 'price_desc') list.sort((a, b) => b.priceCents - a.priceCents);
    return list;
  }, [services, activeCategory, sortBy]);

  const openCreate = () => setFormState({ open: true, service: null });

  return (
    <ProviderDashboardLayout>
      <div
        className={`max-w-6xl mx-auto transition-all duration-300 ${
          isBatchMode && selectedServiceIds.length > 0 ? 'pb-28' : 'pb-8'
        }`}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Gestión de Servicios</h1>
            <p className="text-sm text-gray-500 font-medium">
              {loading ? 'Cargando…' : `${services.length} ${services.length === 1 ? 'servicio' : 'servicios'} en tu catálogo`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant={isBatchMode ? 'outline' : 'ghost'} size="md" leftIcon={<CheckSquare size={16} />} onClick={toggleBatchMode} disabled={loading || Boolean(error)}>
              {isBatchMode ? 'Cancelar selección' : 'Selección múltiple'}
            </Button>
            {!isBatchMode && (
              <Button variant="secondary" size="md" leftIcon={<Plus size={16} />} onClick={openCreate} disabled={loading || Boolean(error)}>
                Nuevo Servicio
              </Button>
            )}
          </div>
        </div>

        {banner && (
          <div
            role={banner.kind === 'error' ? 'alert' : 'status'}
            className={`mb-6 rounded-2xl border p-4 text-sm font-medium ${
              banner.kind === 'error' ? 'border-red-100 bg-red-50 text-red-700' : 'border-green-100 bg-green-50 text-green-700'
            }`}
          >
            {banner.text}
          </div>
        )}

        <ServiceFilters activeCategory={activeCategory} setActiveCategory={setActiveCategory} sortBy={sortBy} setSortBy={setSortBy} />

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" role="status" aria-label="Cargando servicios">
            {[0, 1, 2].map((i) => <div key={i} className="h-72 rounded-3xl bg-gray-100 animate-pulse" />)}
          </div>
        )}

        {!loading && error && (
          <div role="alert" className="text-center py-16">
            <p className="text-sm font-medium text-red-600 mb-4">{error}</p>
            <Button variant="secondary" size="md" onClick={reload}>Reintentar</Button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
              {visibleServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  busy={busyIds.includes(service.id) || bulkBusy}
                  onToggleActive={handleToggleActive}
                  onEdit={(s) => setFormState({ open: true, service: s })}
                  onDelete={handleDeleteSingle}
                  isBatchMode={isBatchMode}
                  isSelected={selectedServiceIds.includes(service.id)}
                  onToggleSelection={handleToggleSelection}
                />
              ))}
              {!isBatchMode && <AddServiceCard onClick={openCreate} />}
            </div>

            {visibleServices.length === 0 && (
              <div className="text-center py-20">
                <div className="text-5xl mb-4" aria-hidden="true">📭</div>
                <p className="text-lg font-bold text-gray-600 mb-2">
                  {services.length === 0 ? 'Aún no tienes servicios' : 'No hay servicios en esta categoría'}
                </p>
                <p className="text-sm text-gray-400">
                  {services.length === 0 ? 'Crea el primero con «Nuevo Servicio».' : 'Prueba cambiando el filtro o agrega un nuevo servicio.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>

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

      <ServiceFormModal
        isOpen={formState.open}
        service={formState.service}
        onClose={() => setFormState({ open: false, service: null })}
        onSubmit={handleSubmitForm}
      />

      <ConfirmDialogRenderer />
    </ProviderDashboardLayout>
  );
}
