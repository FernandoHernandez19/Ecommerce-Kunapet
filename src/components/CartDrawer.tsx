import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import useCartStore, { useCartTotals, unitCents } from '../store/useCartStore';
import { formatMoney } from '../api/adapters';

const CartDrawer = () => {
  const navigate = useNavigate();
  const { 
    isOpen, 
    closeCart, 
    items, 
    updateQuantity, 
    removeItem 
  } = useCartStore();
  const totals = useCartTotals();

  // Bloquear el scroll del body cuando el drawer está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay oscuro */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        onClick={closeCart}
      />
      
      {/* Contenedor del Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gray-800" />
            <h2 className="text-lg font-bold text-gray-900">Tu Carrito</h2>
          </div>
          <button 
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Items */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
              <ShoppingBag className="w-16 h-16 opacity-20" />
              <p className="text-sm font-medium">Tu carrito está vacío</p>
              <button 
                onClick={closeCart}
                className="mt-4 px-6 py-2 bg-green-50 text-green-700 font-semibold rounded-full hover:bg-green-100 transition-colors"
              >
                Seguir explorando
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.type}-${item.id}`} className="flex gap-4 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
                
                {/* Imagen */}
                <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">🐾</div>
                  )}
                </div>

                {/* Detalles */}
                <div className="flex flex-col flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {item.provider ?? ''}
                  </p>
                  
                  <div className="flex items-end justify-between mt-auto pt-2">
                    <span className="font-bold text-green-700">{formatMoney(unitCents(item))}</span>
                    
                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-3">
                      {(
                        <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                          <button 
                            onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                            aria-label={`Disminuir cantidad de ${item.title}`}
                            className="p-1.5 text-gray-500 hover:text-green-700 transition-colors disabled:opacity-50"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-gray-700">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                            aria-label={`Aumentar cantidad de ${item.title}`}
                            className="p-1.5 text-gray-500 hover:text-green-700 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                      
                      <button 
                        onClick={() => removeItem(item.id, item.type)}
                        className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                        aria-label={`Eliminar ${item.title} del carrito`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Resumen y Checkout */}
        {items.length > 0 && (
          <div className="p-5 bg-gray-50 border-t border-gray-200 flex flex-col gap-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium">{formatMoney(totals.subtotalCents)}</span>
            </div>
            {totals.shippingCents > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Envío estimado</span>
                <span className="font-medium">{formatMoney(totals.shippingCents)}</span>
              </div>
            )}
            {totals.platformFeeCents > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tarifa de servicio (estimada)</span>
                <span className="font-medium">{formatMoney(totals.platformFeeCents)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-lg font-black text-gray-900 pt-3 border-t border-gray-200 mt-1">
              <span>Total estimado</span>
              <span className="text-green-700">{formatMoney(totals.totalCents)}</span>
            </div>
            <p className="text-xs text-gray-400">El total definitivo lo calcula el servidor al confirmar el pedido.</p>

            <button 
              onClick={handleCheckout}
              className="w-full py-3.5 mt-2 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl shadow-lg shadow-green-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              Ir a Pagar
            </button>
          </div>
        )}
        
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
};

export default CartDrawer;
