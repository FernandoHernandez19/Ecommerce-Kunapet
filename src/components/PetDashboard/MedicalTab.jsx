import React from 'react';

export default function MedicalTab({ medicalRecords }) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Alergias Críticas */}
      <div className="bg-red-50/50 border border-red-100 rounded-xl p-4">
        <h3 className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center mb-2">
          <span className="mr-2">⚠</span> Alergias y Restricciones Médicas
        </h3>
        <p className="text-sm text-gray-700 font-medium leading-relaxed">
          {medicalRecords.allergies || 'Ninguna alergia crítica reportada hasta el momento.'}
        </p>
      </div>

      {/* Cartilla de Vacunación */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-brand-primary mr-2">💉</span> Control de Vacunas Obligatorias
        </h3>
        <div className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-3 pl-4">Vacuna</th>
                <th className="p-3">Fecha Aplicación</th>
                <th className="p-3">Próxima Dosis</th>
                <th className="p-3 pr-4 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-gray-700 divide-y divide-gray-50">
              {medicalRecords.vaccines.map((vax, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-3 pl-4 font-bold text-gray-900">{vax.name}</td>
                  <td className="p-3 text-gray-500">{vax.dateApplied}</td>
                  <td className="p-3 text-gray-500">{vax.nextDue}</td>
                  <td className="p-3 pr-4 text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      vax.status === 'Vigente' ? 'bg-red-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {vax.status === 'Próxima' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-ping"></span>
                      )}
                      {vax.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}