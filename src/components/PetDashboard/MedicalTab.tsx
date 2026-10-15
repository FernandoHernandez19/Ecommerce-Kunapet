
export interface MedicalVaccine {
  name: string;
  dateApplied: string;
  nextDue: string;
  status: 'Vigente' | 'Próxima';
}

export interface MedicalRecords {
  allergies: string;
  vaccines: MedicalVaccine[];
}

export default function MedicalTab({ medicalRecords }: { medicalRecords: MedicalRecords }) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Alergias Críticas */}
      <div className="bg-red-50/50 border border-red-100 rounded-xl p-4">
        <h3 className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center mb-2">
          <span className="mr-2">⚠</span> Alergias y Restricciones Médicas
        </h3>
        <p className="text-sm text-gray-700 font-medium leading-relaxed">
          {medicalRecords.allergies || 'Sin alergias registradas.'}
        </p>
      </div>

      {/* Cartilla de Vacunación */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-brand-primary mr-2">💉</span> Control de Vacunas Obligatorias
        </h3>
        {medicalRecords.vaccines.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6 border border-dashed border-gray-200 rounded-xl">
            Aún no hay vacunas registradas
          </p>
        ) : (
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
                    <td className="p-3 pr-4 text-right">{vax.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
