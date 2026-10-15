import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getOrder } from '../api/orders';
import useApiResource from '../hooks/useApiResource';

/** Detalle de un pedido del cliente (GET /orders/:id). Se abre con /order-confirmation?id=<id>. */
export default function OrderConfirmationPage() {
  const [params] = useSearchParams();
  const id = params.get('id');
  const { data: order, loading, error, errorCode, reload } = useApiResource(
    (signal) => getOrder(id, { signal }),
    [id],
    { enabled: Boolean(id) },
  );

  let body;
  if (!id) {
    body = (
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">No se indicó ningún pedido</h1>
        <p className="text-sm text-gray-500">Entra desde «Mis Pedidos» para ver el detalle.</p>
      </div>
    );
  } else if (loading) {
    body = <div className="h-64 rounded-2xl bg-gray-100 animate-pulse" role="status" aria-label="Cargando pedido" />;
  } else if (error) {
    const notFound = errorCode === 'not_found';
    body = (
      <div role="alert" className="text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">{notFound ? 'Pedido no encontrado' : 'No pudimos cargar el pedido'}</h1>
        <p className="text-sm text-gray-500 mb-5">{notFound ? 'Puede que no exista o no sea tuyo.' : error}</p>
        {!notFound && <button onClick={reload} className="px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-bold rounded-xl">Reintentar</button>}
      </div>
    );
  } else if (order) {
    body = (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
          <h1 className="text-2xl font-extrabold text-gray-900">Pedido {order.shortId}</h1>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">{order.statusLabel}</span>
        </div>
        <p className="text-sm text-gray-500 mb-6">Creado el {order.dateTime} · Pago: {order.paymentLabel} (demo sin cobro real)</p>

        <ul className="divide-y divide-gray-50 mb-6">
          {order.lines.map((l) => (
            <li key={l.itemId} className="py-3 flex justify-between gap-4 text-sm">
              <span className="min-w-0 text-gray-700">
                <span className="font-semibold">{l.title}</span>
                <span className="block text-xs text-gray-400">{l.type === 'service' ? 'Servicio' : 'Producto'} · {l.quantity} × {l.unitPrice}</span>
              </span>
              <span className="font-semibold text-gray-900 shrink-0">{l.lineTotal}</span>
            </li>
          ))}
        </ul>

        <dl className="space-y-1.5 text-sm border-t border-gray-100 pt-4">
          <div className="flex justify-between text-gray-600"><dt>Subtotal</dt><dd>{order.totals.subtotal}</dd></div>
          <div className="flex justify-between text-gray-600"><dt>Envío</dt><dd>{order.totals.shipping}</dd></div>
          <div className="flex justify-between text-gray-600"><dt>Tarifa de servicio</dt><dd>{order.totals.platformFee}</dd></div>
          <div className="flex justify-between text-lg font-black text-gray-900 pt-2"><dt>Total</dt><dd>{order.totals.total}</dd></div>
        </dl>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pt-12 pb-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/clientdashboard?tab=orders" className="inline-block mb-6 text-sm font-semibold text-gray-500 hover:text-gray-900 no-underline">
          ← Volver a Mis Pedidos
        </Link>
        {body}
      </div>
    </div>
  );
}
