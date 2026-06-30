import React, { useState, useMemo } from 'react';
import useCartStore, { ITEM_TYPES } from '../store/useCartStore';

const AddToCartWidget = ({ basePrice, serviceFee, serviceId, item }) => {
  const [quantity, setQuantity] = useState(1);

  const subtotal = useMemo(() => basePrice * quantity, [basePrice, quantity]);
  const total = useMemo(() => subtotal + serviceFee, [subtotal, serviceFee]);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));

  const addItem = useCartStore(s => s.addItem);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem({
      id: serviceId,
      title: item?.title || 'Producto',
      price: basePrice,
      image: item?.image,
      provider: item?.provider?.name || 'Proveedor',
      type: ITEM_TYPES.PRODUCT,
      quantity
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 transition-all">
      <div className="flex items-baseline justify-between mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">S/ {basePrice.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <form onSubmit={handleAddToCart} className="space-y-5">
        {/* Contador de Cantidad */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Cantidad
          </label>
          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-2 bg-white">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg font-bold disabled:opacity-50 transition-colors"
            >
              —
            </button>
            <span className="font-semibold text-gray-800 text-base" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg font-bold transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Desglose de Costos */}
        <div className="pt-4 border-t border-gray-100 space-y-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Producto (x{quantity})</span>
            <span>S/ {subtotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between">
            <span>Costo de envío estimado</span>
            <span>S/ {serviceFee.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-baseline pt-3 border-t border-gray-100 text-gray-900 font-bold text-base">
            <span>Total Estimado</span>
            <span className="text-xl text-gray-900">S/ {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* CTA Principal */}
        <button
          type="submit"
          className="w-full bg-brand-primary hover:bg-[#c93623] text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-700/10 hover:shadow-emerald-700/20 active:scale-[0.99] transition-all text-center block text-sm"
        >
          Añadir al carrito
        </button>
      </form>
    </div>
  );
};

export default AddToCartWidget;
