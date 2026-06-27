import React from 'react';

export default function PopularArticles() {
  const articles = [
    { id: 1, title: '¿Cómo solicito un reembolso por una consulta veterinaria?', desc: 'Conoce los pasos necesarios para enviar tu reclamación y el tiempo estimado de procesamiento para reembolsos médicos.' },
    { id: 2, title: 'Guía para preparar a tu perro para su primer paseo con un cuidador', desc: 'Consejos prácticos para asegurar que tu mascota se sienta cómoda y segura durante su primera experiencia con nuestros paseadores.' },
    { id: 3, title: 'Tiempos de entrega estándar para alimentos premium', desc: 'Información sobre nuestras políticas de envío y zonas de cobertura para entregas el mismo día.' }
  ];

  return (
    <div className="flex-1">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Artículos Populares</h2>
      <div className="space-y-4">
        {articles.map((article) => (
          <a key={article.id} href={`/articulo/${article.id}`} className="block bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group">
            <div className="flex items-start justify-between">
              <div className="flex space-x-4">
                <div className="mt-1 text-emerald-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors mb-1">{article.title}</h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">{article.desc}</p>
                </div>
              </div>
              <div className="text-gray-300 group-hover:text-emerald-600 transition-colors ml-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}