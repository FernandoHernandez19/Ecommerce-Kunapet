import React from 'react';
import { Trash2, ChevronRight, Minus, Plus } from 'lucide-react';
import { MAX_QUANTITY } from '../../store/useCartStore';

function Thumb({ item, size }) {
  return item.image ? (
    <img src={item.image} alt={item.title} className={`${size} rounded-xl object-cover shrink-0`} />
  ) : (
    <div className={`${size} rounded-xl bg-gray-100 flex items-center justify-center text-xl shrink-0`} aria-hidden="true">🐾</div>
  );
}

function Quantity({ item, onQuantity }) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <button type="button" aria-label="Disminuir cantidad" onClick={() => onQuantity(item, item.quantity - 1)} className="p-1 rounded-lg border border-gray-200 text-gray-500 hover:text-green-700">
        <Minus size={14} />
      </button>
      <span className="w-6 text-center text-sm font-semibold text-gray-700" aria-live="polite">{item.quantity}</span>
      <button type="button" aria-label="Aumentar cantidad" disabled={item.quantity >= MAX_QUANTITY} onClick={() => onQuantity(item, item.quantity + 1)} className="p-1 rounded-lg border border-gray-200 text-gray-500 hover:text-green-700 disabled:opacity-40">
        <Plus size={14} />
      </button>
    </div>
  );
}

export default function StepCartReview({ items, onNext, onRemove, onQuantity }) {
  const services = items.filter(item => item.type === 'service');
  const products = items.filter(item => item.type === 'product');

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Revisa tu carrito</h1>
      <p className="text-sm text-gray-500 mb-6">Confirma las cantidades de tus productos y servicios.</p>
      
      {services.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Servicios Contratados</h2>
          <div className="space-y-6">
            {services.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex gap-4 mb-4 pb-4 border-b border-gray-50">
                  <Thumb item={item} size="w-16 h-16" />
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-brand-secondary font-medium">{item.subtitle}</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{item.price}</p>
                    <Quantity item={item} onQuantity={onQuantity} />
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(item)}
                    aria-label={`Quitar ${item.title} del carrito`}
                    className="text-gray-400 hover:text-red-500 transition-colors self-start p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <p className="text-xs text-gray-500">
                  La reserva con fecha y la asignación de mascotas llegan en una próxima versión.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {products.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Productos Físicos</h2>
          <div className="space-y-4">
            {products.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex gap-4 items-center">
                <Thumb item={item} size="w-14 h-14" />
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-500">{item.subtitle}</p>
                  <Quantity item={item} onQuantity={onQuantity} />
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{item.price}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(item)}
                  aria-label={`Quitar ${item.title} del carrito`}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2 ml-2"
                >
                  <Trash2 size={16} />
                </button>
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
          Continuar al Despacho <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
