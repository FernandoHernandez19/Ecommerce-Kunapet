import type { CheckoutItem, CheckoutTotals } from './types';
import { ShieldCheck, LockKeyhole, ChevronRight } from 'lucide-react';

interface OrderSummaryProps {
  items: CheckoutItem[];
  totals: CheckoutTotals;
  onPay: () => void;
  isReadyToPay: boolean;
  currentStep: number;
  onNextStep: () => void;
  isLoading: boolean;
}

export default function OrderSummary({ items, totals, onPay, isReadyToPay, currentStep, onNextStep, isLoading }: OrderSummaryProps) {
  const services = items.filter(item => item.type === 'service');
  const products = items.filter(item => item.type === 'product');

  const getButtonProps = () => {
    switch (currentStep) {
      case 1:
        return {
          text: 'Confirmar Carrito',
          icon: <ChevronRight size={18} />,
          action: onNextStep,
          disabled: false
        };
      case 2:
        return {
          text: 'Confirmar Datos de Entrega',
          icon: <ChevronRight size={18} />,
          action: onNextStep,
          disabled: !isReadyToPay // For step 2 this will mean date/address selected, passed via isReadyToPay
        };
      case 3:
      default:
        return {
          text: 'Confirmar pedido',
          icon: <LockKeyhole size={18} />,
          action: onPay,
          disabled: !isReadyToPay || isLoading
        };
    }
  };

  const btnProps = getButtonProps();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24 hidden lg:block">
      <h2 className="text-xl font-extrabold text-gray-900 mb-6 border-b border-gray-100 pb-4">
        Resumen de compra
      </h2>

      {/* Servicios */}
      {services.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Servicios a reservar</h3>
          <div className="space-y-4">
            {services.map((item, idx) => (
              <div key={`srv-${idx}`} className="flex space-x-4">
                {item.image ? <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0" /> : <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0" aria-hidden="true" />}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">{item.title}</h4>
                  <p className="text-xs text-brand-secondary font-medium mb-1 truncate">{item.subtitle}</p>
                  <p className="text-sm font-bold text-gray-900">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Productos */}
      {products.length > 0 && (
        <div className="mb-6 border-t border-gray-100 pt-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Productos</h3>
          <div className="space-y-4">
            {products.map((item, idx) => (
              <div key={`prd-${idx}`} className="flex space-x-4">
                {item.image ? <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0" /> : <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0" aria-hidden="true" />}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">{item.title}</h4>
                  <p className="text-xs text-gray-500 font-medium mb-1 truncate">{item.subtitle}</p>
                  <p className="text-sm font-bold text-gray-900">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtotales */}
      <div className="space-y-3 text-sm mb-6 border-t border-gray-100 pt-6">
        <div className="flex justify-between text-gray-600 font-medium">
          <span>Subtotal</span>
          <span>{totals.subtotal}</span>
        </div>
        <div className="flex justify-between text-gray-600 font-medium">
          <span>Envío (estimado)</span>
          <span>{totals.shipping}</span>
        </div>
        <div className="flex justify-between text-gray-600 font-medium">
          <span>Tarifa de servicio (estimada)</span>
          <span>{totals.serviceFee}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-end mb-8 border-t border-gray-100 pt-4">
        <span className="text-lg font-bold text-gray-900">Total estimado</span>
        <span className="text-3xl font-black text-brand-secondary">{totals.total}</span>
      </div>
      <p className="-mt-6 mb-6 text-xs text-gray-400">
        Es una estimación: el total definitivo lo calcula el servidor al confirmar el pedido.
      </p>

      {/* Botón de Pago CTA Dinámico */}
      <button 
        onClick={btnProps.action}
        disabled={btnProps.disabled}
        className={`w-full py-4 rounded-xl text-base font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
          btnProps.disabled 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
            : 'bg-brand-secondary hover:bg-brand-secondary-hover text-white'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Procesando...
          </span>
        ) : (
          <>
            {currentStep === 3 && btnProps.icon}
            <span>{btnProps.text}</span>
            {currentStep !== 3 && btnProps.icon}
          </>
        )}
      </button>

      {/* Trust Badges */}
      <div className="mt-5 flex items-center justify-center gap-2 text-gray-400">
        <ShieldCheck size={16} />
        <p className="text-center text-xs font-bold uppercase tracking-wider">
          Demo sin cobro real
        </p>
      </div>
    </div>
  );
}