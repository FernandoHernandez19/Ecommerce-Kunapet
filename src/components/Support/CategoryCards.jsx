import React from 'react';

export default function CategoryCards() {
  const categories = [
    { id: 1, title: 'Pedidos', desc: 'Envíos, devoluciones y seguimiento de productos.', icon: '🛍️', bg: 'bg-emerald-100', text: 'text-emerald-700' },
    { id: 2, title: 'Servicios', desc: 'Paseos, veterinaria y estética canina.', icon: '📅', bg: 'bg-emerald-100', text: 'text-emerald-700' },
    { id: 3, title: 'Mis Mascotas', desc: 'Perfiles, historial médico y reclamaciones.', icon: '🐾', bg: 'bg-amber-100', text: 'text-amber-800' },
    { id: 4, title: 'Mi Cuenta', desc: 'Contraseñas, pagos y configuración.', icon: '⚙️', bg: 'bg-gray-100', text: 'text-gray-700' }
  ];

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Explora por Categoría</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <button key={cat.id} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-emerald-200 hover:-translate-y-1 transition-all group outline-none focus:ring-2 focus:ring-emerald-500">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4 ${cat.bg} ${cat.text} group-hover:scale-110 transition-transform`}>
              {cat.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{cat.title}</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">{cat.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}