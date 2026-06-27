import React from 'react';

export default function OrderSummaryCard({ items, total }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-full flex flex-col">
      <h2 className="text-lg font-bold text-gray-900 flex items-center mb-6">
        <span className="text-[#006D44] mr-2">🧾</span> Resumen de Pedido
      </h2>

      <div className="space-y-6 flex-1">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-start">
            <div className="flex space-x-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gray-50 border border-gray-100 overflow-hidden`}>
                {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" /> : item.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                <p className="text-xs text-gray-500 font-medium mb-1.5">{item.description}</p>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${item.type === 'Producto' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                  {item.type}
                </span>
              </div>
            </div>
            <span className="font-bold text-gray-900">{item.price}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-end">
        <span className="text-gray-600 font-medium">Total Pagado</span>
        <span className="text-3xl font-black text-[#006D44]">{total}</span>
      </div>
    </div>
  );
}