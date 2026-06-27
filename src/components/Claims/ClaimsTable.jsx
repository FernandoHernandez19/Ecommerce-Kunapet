import React from 'react';

export default function ClaimsTable({ claims }) {
  // Función auxiliar para los colores de prioridad
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Alta': return 'bg-red-500';
      case 'Media': return 'bg-amber-400';
      case 'Baja': return 'bg-emerald-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col overflow-hidden h-full">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Cola de Reclamaciones</h2>
        <p className="text-sm text-gray-500 mt-1">20 reclamaciones activas requieren atención.</p>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Proveedor</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
            {claims.map((claim, idx) => (
              <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4 font-bold text-[#006D44]">{claim.id}</td>
                <td className="px-6 py-4 text-gray-500">{claim.date}</td>
                <td className="px-6 py-4 flex items-center space-x-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${claim.avatarColor} text-white`}>
                    {claim.clientInitials}
                  </span>
                  <span className="font-medium text-gray-900">{claim.client}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{claim.provider}</td>
                <td className="px-6 py-4">
                   <div className="flex items-center space-x-2">
                     <span className={`w-2 h-2 rounded-full ${getPriorityColor(claim.priority)}`}></span>
                     <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md">{claim.status}</span>
                   </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#006D44] hover:text-[#005233] font-bold text-xs uppercase tracking-wider">Revisar &rarr;</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
        <p className="text-sm text-gray-600 font-medium">Mostrando <span className="font-bold text-gray-900">1-3</span> de <span className="font-bold text-gray-900">20</span></p>
        <div className="flex space-x-2">
           <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-400 cursor-not-allowed">Anterior</button>
           <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-50">Siguiente</button>
        </div>
      </div>
    </div>
  );
}