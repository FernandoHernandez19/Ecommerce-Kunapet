import React, { useMemo, useState } from 'react';
import useCartStore, { ITEM_TYPES, MAX_QUANTITY } from '../store/useCartStore';
import { estimateTotals, formatMoney } from '../api/adapters';

/**
 * Widget de compra de un PRODUCTO. Los importes son una estimación:
 * el total definitivo lo calcula el servidor al crear el pedido.
 */
const AddToCartWidget = ({ item }) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const totals = useMemo(
    () => estimateTotals([{ type: ITEM_TYPES.PRODUCT, priceCents: item.priceCents, quantity }]),
    [item.priceCents, quantity],
  );

  const handleIncrement = () => setQuantity((prev) => Math.min(MAX_QUANTITY, prev + 1));
  const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem({
      id: item.id,
      type: ITEM_TYPES.PRODUCT,
      title: item.title,
      priceCents: item.priceCents,
      image: item.image,
      provider: item.provider?.name || 'Proveedor',
      quantity,
    });
    setAdded(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 transition-all">
      <div className="flex items-baseline justify-between mb-6">
        <span className="text-2xl font-bold text-gray-900">{formatMoney(item.priceCents)}</span>
      </div>

      <form onSubmit={handleAddToCart} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Cantidad</label>
          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-2 bg-white">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={quantity <= 1}
              aria-label="Disminuir cantidad"
              className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg font-bold disabled:opacity-50 transition-colors"
            >
              —
            </button>
            <span className="font-semibold text-gray-800 text-base" aria-live="polite">{quantity}</span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={quantity >= MAX_QUANTITY}
              aria-label="Aumentar cantidad"
              className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg font-bold disabled:opacity-50 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Producto (x{quantity})</span>
            <span>{formatMoney(totals.subtotalCents)}</span>
          </div>
          <div className="flex justify-between">
            <span>Envío (estimado)</span>
            <span>{formatMoney(totals.shippingCents)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tarifa de servicio (estimada)</span>
            <span>{formatMoney(totals.platformFeeCents)}</span>
          </div>
          <div className="flex justify-between items-baseline pt-3 border-t border-gray-100 text-gray-900 font-bold text-base">
            <span>Total estimado</span>
            <span className="text-xl text-gray-900">{formatMoney(totals.totalCents)}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-brand-primary hover:bg-[#c93623] text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-700/10 hover:shadow-emerald-700/20 active:scale-[0.99] transition-all text-center block text-sm"
        >
          Añadir al carrito
        </button>
        <p role="status" aria-live="polite" className="text-center text-xs font-medium text-green-700 min-h-[1rem]">
          {added ? 'Agregado al carrito.' : ''}
        </p>
      </form>
    </div>
  );
};

export default AddToCartWidget;
