import React from 'react';

export default function RecentOrders({ orders }) {
  const getStatusPill = (status) => {
    switch(status) {
      case 'PENDIENTE': return 'bg-amber-100 text-amber-800';
      case 'EN CAMINO': return 'bg-red-100 text-emerald-800';
      case 'ENTREGADO': return 'bg-gray-200 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-8 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900">Pedidos Recientes</h3>
        <button className="text-gray-400 hover:text-gray-700">▼</button>
      </div>

      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-gray-100 text-xs font-bold text-gray-500">
            <th className="pb-3 pt-2">ID</th>
            <th className="pb-3 pt-2">Cliente</th>
            <th className="pb-3 pt-2">Productos</th>
            <th className="pb-3 pt-2">Total</th>
            <th className="pb-3 pt-2">Estado</th>
            <th className="pb-3 pt-2 text-right">Acción</th>
          </tr>
        </thead>
        <tbody className="text-sm font-medium text-gray-700">
          {orders.map((order, idx) => (
            <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td className="py-4 text-gray-900 font-bold">{order.id}</td>
              <td className="py-4 flex items-center space-x-2">
                <span className="w-7 h-7 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-xs font-bold">
                  {order.client.split(' ').map(n => n[0]).join('')}
                </span>
                <span>{order.client}</span>
              </td>
              <td className="py-4 text-gray-500 text-xs">{order.products}</td>
              <td className="py-4 font-bold text-gray-900">{order.total}</td>
              <td className="py-4">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase ${getStatusPill(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="py-4 text-right">
                {/* Solución a la Mejora UX: Si es PENDIENTE le damos una acción clara */}
                <button className="text-brand-primary hover:text-emerald-900 font-bold text-xs">
                  {order.status === 'PENDIENTE' ? 'Procesar' : order.action}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}