import React from 'react';

export default function DietBehaviorTab({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      {/* Nutrición y Dieta */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-emerald-700 mr-2">🍖</span> Pautas de Alimentación
        </h3>
        <ul className="space-y-4 text-sm font-medium text-gray-600">
          <li className="flex justify-between border-b border-gray-50 pb-2">
            <span>Marca preferida:</span>
            <span className="text-gray-900 font-bold">{data.diet.brand}</span>
          </li>
          <li className="flex justify-between border-b border-gray-50 pb-2">
            <span>Porción diaria:</span>
            <span className="text-gray-900 font-bold">{data.diet.portion}</span>
          </li>
          <li>
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Notas específicas:</span>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-xs leading-relaxed font-medium">
              {data.diet.notes}
            </p>
          </li>
        </ul>
      </div>

      {/* Temperamento y Conducta */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-emerald-700 mr-2">🦮</span> Comportamiento en Paseos
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {data.behavior.tags.map((tag, i) => (
            <span key={i} className="text-xs font-bold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <div>
          <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Indicaciones para el Paseador:</span>
          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-xs leading-relaxed font-medium">
            {data.behavior.notes}
          </p>
        </div>
      </div>
    </div>
  );
}