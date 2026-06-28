import React from 'react';

const RelatedServices = () => {
  const recommendations = [
    {
      id: "rec_01",
      title: "Baño y Peluquería a Domicilio",
      price: 25000,
      rating: 4.8,
      reviews: 65,
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: "rec_02",
      title: "Adiestramiento Básico 1a1",
      price: 30000,
      rating: 5.0,
      reviews: 42,
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-900">Otros servicios que te podrían interesar</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div className="relative h-44 bg-gray-100 overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
              <button className="absolute top-3 right-3 p-2 bg-white rounded-full text-gray-700 shadow-sm hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-gray-950 group-hover:text-brand-primary transition-colors line-clamp-1">{item.title}</h3>
                <div className="flex items-center text-xs text-amber-500 font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 mr-0.5">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                  </svg>
                  <span>{item.rating}</span>
                  <span className="text-gray-400 font-normal ml-1">({item.reviews})</span>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-50 flex justify-between items-center">
                <span className="text-base font-extrabold text-gray-900">${item.price.toLocaleString('es-AR')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedServices;