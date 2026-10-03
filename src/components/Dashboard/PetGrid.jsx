import React from 'react';

export default function PetGrid({ pets }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Mis Mascotas</h2>
        <a href="/pets" className="text-sm font-semibold text-brand-primary hover:text-[#c93623] transition-colors">
          Ver todas
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pets.map((pet) => (
          <div key={pet.id} className="p-5 border border-gray-100 rounded-2xl bg-white shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-white shadow-inner">
              <img 
                src={pet.type === 'Perro' ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=120' : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=120'} 
                alt={pet.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-gray-950 text-base truncate">{pet.name}</h3>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  pet.type === 'Perro' ? 'bg-red-50 text-brand-primary' : 'bg-amber-50 text-amber-700'
                }`}>
                  {pet.type}
                </span>
                <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-full truncate max-w-[80px]">
                  {pet.breed}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs pt-1 border-t border-gray-50">
                <div>
                  <p className="text-gray-400 font-medium">Edad</p>
                  <p className="font-bold text-gray-800">{pet.age}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 font-medium">Próxima Vacuna</p>
                  <p className={`font-bold ${pet.status === 'warning' ? 'text-amber-600' : 'text-brand-primary'}`}>
                    {pet.status === 'warning' ? `📅 ${pet.nextVaccine}` : `✓ ${pet.nextVaccine}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Tarjeta de Registro de Nueva Mascota */}
        <button className="p-5 border-2 border-dashed border-gray-200 hover:border-brand-primary rounded-2xl bg-gray-50/50 hover:bg-white flex flex-col items-center justify-center space-y-2 group transition-all h-[122px]">
          <span className="text-2xl text-gray-400 group-hover:text-brand-primary transition-colors">＋</span>
          <span className="text-xs font-bold text-gray-500 group-hover:text-brand-primary transition-colors">Registrar nueva mascota</span>
        </button>
      </div>
    </div>
  );
}