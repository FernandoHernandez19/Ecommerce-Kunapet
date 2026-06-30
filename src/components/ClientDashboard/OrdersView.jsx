import React, { useState } from 'react';
import { Package, Truck, CheckCircle2, Clock, Download, ShoppingCart } from 'lucide-react';

const ACCENT = '#2D6A4F';

const TRACKING_STEPS = [
  { id: 0, label: 'Confirmado',    Icon: CheckCircle2 },
  { id: 1, label: 'En Preparación', Icon: Package      },
  { id: 2, label: 'En Camino',     Icon: Truck        },
  { id: 3, label: 'Entregado',     Icon: CheckCircle2 },
];

const STATUS_LABELS = {
  shipping:  { label: 'En Camino',     bg: 'bg-blue-50',   text: 'text-blue-700'   },
  delivered: { label: 'Entregado',     bg: 'bg-green-50',  text: 'text-green-700'  },
  preparing: { label: 'En Preparación', bg: 'bg-amber-50', text: 'text-amber-700'  },
  pending:   { label: 'Pendiente',     bg: 'bg-gray-100',  text: 'text-gray-600'   },
};

// ─── Tracking horizontal ─────────────────────────────────────────────────────
function TrackingBanner({ order }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <p className="text-sm font-bold text-gray-900">Seguimiento Activo</p>
        <span className="ml-auto text-xs font-bold text-gray-400">{order.id}</span>
      </div>
      <p className="text-sm font-semibold text-gray-700 mb-5 truncate">{order.product}</p>

      {/* Stepper horizontal */}
      <div className="flex items-center">
        {TRACKING_STEPS.map((step, i) => {
          const done = order.trackingStep > step.id;
          const active = order.trackingStep === step.id;
          const { Icon } = step;
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    done || active ? 'text-white' : 'bg-gray-100 text-gray-400'
                  }`}
                  style={done || active ? { backgroundColor: ACCENT } : {}}
                >
                  <Icon size={16} strokeWidth={2} />
                </div>
                <span className={`text-xs font-semibold text-center leading-tight max-w-[60px] ${
                  active ? 'font-bold' : done ? 'text-gray-500' : 'text-gray-400'
                }`}
                  style={active ? { color: ACCENT } : {}}>
                  {step.label}
                </span>
              </div>
              {i < TRACKING_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 mb-5 transition-all ${done ? '' : 'bg-gray-200'}`}
                  style={done ? { backgroundColor: ACCENT } : {}} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ─── Historial tabla ─────────────────────────────────────────────────────────
function OrdersTable({ orders }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              {['ID Pedido', 'Producto', 'Fecha', 'Total', 'Estado', 'Factura'].map((h) => (
                <th key={h} className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((o) => {
              const s = STATUS_LABELS[o.status] ?? STATUS_LABELS.pending;
              return (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-gray-500">{o.id}</td>
                  <td className="px-5 py-4 font-semibold text-gray-800 max-w-[200px] truncate">{o.product}</td>
                  <td className="px-5 py-4 text-gray-500">{o.date}</td>
                  <td className="px-5 py-4 font-bold text-gray-800">{o.cost}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>{s.label}</span>
                  </td>
                  <td className="px-5 py-4">
                    <button className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-900 transition-all">
                      <Download size={13} strokeWidth={1.5} /> {o.invoice}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Volver a comprar ─────────────────────────────────────────────────────────
function ReorderGrid({ orders }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((o) => (
        <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-all">
          <div className="h-28 rounded-xl flex items-center justify-center text-4xl"
            style={{ backgroundColor: `${ACCENT}0D` }}>
            📦
          </div>
          <p className="text-sm font-bold text-gray-800 line-clamp-2">{o.product}</p>
          <p className="text-sm font-bold" style={{ color: ACCENT }}>{o.cost}</p>
          <button
            className="flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-xl text-white transition-all hover:opacity-90"
            style={{ backgroundColor: ACCENT }}
          >
            <ShoppingCart size={14} strokeWidth={1.5} /> Comprar de nuevo
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── OrdersView Principal ─────────────────────────────────────────────────────
export default function OrdersView({ orders }) {
  const [tab, setTab] = useState('history');
  const activeShipping = orders.find((o) => o.status === 'shipping' || o.status === 'preparing');

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-extrabold text-gray-900">Mis Pedidos</h1>

      {/* Tracking activo — condicional */}
      {activeShipping && <TrackingBanner order={activeShipping} />}

      {/* Sub-tabs */}
      <div className="flex flex-col gap-5">
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 w-fit">
          {[
            { id: 'history', label: 'Historial Detallado' },
            { id: 'reorder', label: 'Volver a Comprar'   },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                tab === id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'history' && <OrdersTable orders={orders} />}
        {tab === 'reorder' && <ReorderGrid orders={orders} />}
      </div>
    </div>
  );
}
