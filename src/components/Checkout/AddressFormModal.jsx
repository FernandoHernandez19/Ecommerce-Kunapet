import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, MapPin } from 'lucide-react';

export default function AddressFormModal({ isOpen, onClose, onSave, initialAddress = {} }) {
  const [formData, setFormData] = useState({
    label: initialAddress.label || '',
    street: initialAddress.street || '',
    district: initialAddress.district || '',
    reference: initialAddress.reference || ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      city: 'Lima',
      country: 'Perú'
    });
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="p-2 bg-brand-secondary-light/30 rounded-xl">
              <MapPin size={20} className="text-brand-secondary" />
            </span>
            Nueva Dirección
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nombre (ej. Trabajo, Oficina)</label>
              <input 
                required
                type="text" 
                name="label"
                value={formData.label}
                onChange={handleChange}
                placeholder="Oficina San Isidro" 
                className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 transition-all bg-gray-50 hover:bg-white focus:bg-white" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Calle y número</label>
              <input 
                required
                type="text" 
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Av. Principal 123, Of 4B" 
                className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 transition-all bg-gray-50 hover:bg-white focus:bg-white" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Distrito</label>
              <input 
                required
                type="text" 
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="San Isidro" 
                className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 transition-all bg-gray-50 hover:bg-white focus:bg-white" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Referencia (Opcional)</label>
              <input 
                type="text" 
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                placeholder="Frente al parque" 
                className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 transition-all bg-gray-50 hover:bg-white focus:bg-white" 
              />
            </div>
          </div>

          <div className="mt-8">
            <button 
              type="submit"
              className="w-full bg-brand-secondary hover:bg-brand-secondary-hover text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98]"
            >
              Guardar Dirección
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
