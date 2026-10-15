import { CheckCircle, ExternalLink, Home } from 'lucide-react';
import type { UiOrder } from '../../api/adapters';
import { useNavigate } from 'react-router-dom';

/** Pantalla final: muestra el pedido y los totales que devolvió el servidor (no los del carrito). */
export default function StepOrderSuccess({ order }: { order: UiOrder }) {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in-up max-w-2xl mx-auto text-center py-12 px-4">
      <div className="w-24 h-24 bg-brand-secondary-light/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
        <div className="absolute inset-0 bg-brand-secondary/10 rounded-full animate-ping opacity-75"></div>
        <CheckCircle size={48} className="text-brand-secondary relative z-10" />
      </div>

      <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
        Pedido registrado
      </h1>
      <p role="status" className="text-lg font-semibold text-amber-700 mb-8">
        Pago pendiente (demo sin cobro real)
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-10 max-w-md mx-auto text-left">
        <div className="flex justify-between items-baseline mb-4">
          <div>
            <p className="text-sm text-gray-500">Número de pedido</p>
            <p className="text-xl font-mono font-bold text-gray-900">{order.shortId}</p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">{order.statusLabel}</span>
        </div>

        <ul className="divide-y divide-gray-50 mb-4">
          {order.lines.map((l) => (
            <li key={l.itemId} className="py-2 flex justify-between gap-3 text-sm">
              <span className="text-gray-700 min-w-0">
                <span className="font-semibold">{l.title}</span> <span className="text-gray-400">× {l.quantity}</span>
              </span>
              <span className="font-semibold text-gray-900 shrink-0">{l.lineTotal}</span>
            </li>
          ))}
        </ul>

        <dl className="space-y-1.5 text-sm border-t border-gray-100 pt-4">
          <div className="flex justify-between text-gray-600"><dt>Subtotal</dt><dd>{order.totals.subtotal}</dd></div>
          <div className="flex justify-between text-gray-600"><dt>Envío</dt><dd>{order.totals.shipping}</dd></div>
          <div className="flex justify-between text-gray-600"><dt>Tarifa de servicio</dt><dd>{order.totals.platformFee}</dd></div>
          <div className="flex justify-between text-base font-black text-gray-900 pt-2"><dt>Total</dt><dd>{order.totals.total}</dd></div>
        </dl>
        <p className="text-xs text-gray-400 mt-3">Método elegido: {order.paymentLabel}. Importes calculados por el servidor.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => navigate('/clientdashboard', { state: { tab: 'orders' } })}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-secondary hover:bg-brand-secondary-hover text-white rounded-xl font-bold transition-all shadow-md"
        >
          Ir a Mis Pedidos <ExternalLink size={18} />
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl font-bold transition-all"
        >
          Volver al Home <Home size={18} />
        </button>
      </div>
    </div>
  );
}
