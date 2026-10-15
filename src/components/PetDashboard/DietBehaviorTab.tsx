
/** Notas de la mascota (alergias, necesidades especiales y conducta): es el único campo libre de la API. */
export default function DietBehaviorTab({ notes }: { notes: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm animate-fade-in">
      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
        <span className="text-brand-primary mr-2">🍖</span> Notas de cuidado
      </h3>
      {notes ? (
        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm leading-relaxed font-medium whitespace-pre-line">{notes}</p>
      ) : (
        <p className="text-sm text-gray-500 text-center py-6">Aún no hay notas registradas</p>
      )}
    </div>
  );
}
