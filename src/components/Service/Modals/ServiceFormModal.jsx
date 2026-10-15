import React, { useEffect, useState } from 'react';
import { SERVICE_CATEGORIES, validateServiceForm } from '../../../api/adapters';
import { friendlyMessage } from '../../../api/errorMessages';

const EMPTY = { title: '', description: '', category: SERVICE_CATEGORIES[0], price: '', durationMinutes: '60' };

/**
 * Crear o editar un servicio. `onSubmit(form)` debe devolver una promesa; si rechaza,
 * el error de la API se muestra dentro del modal.
 */
export default function ServiceFormModal({ isOpen, service, onClose, onSubmit }) {
  const editing = Boolean(service);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setErrors({});
    setSubmitError(null);
    setBusy(false);
    setForm(
      service
        ? {
            title: service.title,
            description: service.description,
            category: service.categoryLabel,
            price: (service.priceCents / 100).toFixed(2),
            durationMinutes: String(service.durationMinutes ?? ''),
          }
        : EMPTY,
    );
  }, [isOpen, service]);

  if (!isOpen) return null;

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validateServiceForm(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setBusy(true);
    setSubmitError(null);
    try {
      await onSubmit({ ...form, type: 'service' });
    } catch (err) {
      setSubmitError(friendlyMessage(err));
      setBusy(false);
    }
  };

  const field = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#e23d28]/20';
  const FieldError = ({ name }) => (errors[name] ? <p role="alert" className="mt-1 text-xs font-medium text-red-500">{errors[name]}</p> : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="service-form-title">
      <form onSubmit={handleSubmit} noValidate className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 id="service-form-title" className="text-xl font-extrabold text-gray-900 mb-6">
          {editing ? 'Editar servicio' : 'Nuevo servicio'}
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="svc-title" className="block text-xs font-bold text-gray-700 mb-1.5">Título</label>
            <input id="svc-title" className={field} value={form.title} onChange={set('title')} maxLength={120} />
            <FieldError name="title" />
          </div>
          <div>
            <label htmlFor="svc-desc" className="block text-xs font-bold text-gray-700 mb-1.5">Descripción</label>
            <textarea id="svc-desc" rows={3} className={`${field} resize-none`} value={form.description} onChange={set('description')} maxLength={2000} />
            <FieldError name="description" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="svc-cat" className="block text-xs font-bold text-gray-700 mb-1.5">Categoría</label>
              <select id="svc-cat" className={field} value={form.category} onChange={set('category')}>
                {SERVICE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <FieldError name="category" />
            </div>
            <div>
              <label htmlFor="svc-price" className="block text-xs font-bold text-gray-700 mb-1.5">Precio (S/)</label>
              <input id="svc-price" inputMode="decimal" className={field} value={form.price} onChange={set('price')} placeholder="25.00" />
              <FieldError name="price" />
            </div>
            <div>
              <label htmlFor="svc-dur" className="block text-xs font-bold text-gray-700 mb-1.5">Duración (min)</label>
              <input id="svc-dur" inputMode="numeric" className={field} value={form.durationMinutes} onChange={set('durationMinutes')} />
              <FieldError name="durationMinutes" />
            </div>
          </div>
        </div>

        {submitError && <p role="alert" className="mt-4 text-sm font-medium text-red-600">{submitError}</p>}

        <div className="flex justify-end gap-3 mt-8">
          <button type="button" onClick={onClose} disabled={busy} className="px-6 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
            Cancelar
          </button>
          <button type="submit" disabled={busy} className="px-6 py-3 text-sm font-bold text-white bg-[#e23d28] hover:bg-[#c93623] disabled:opacity-60 rounded-xl transition-all">
            {busy ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear servicio'}
          </button>
        </div>
      </form>
    </div>
  );
}
