import React from 'react';

const ReviewsSection = () => {
  const reviews = [
    {
      id: 1,
      author: "Mariana L.",
      date: "Hace 2 días",
      rating: 5,
      comment: "Carlos es excelente. Mi perro Bruno vuelve feliz y agotado. Me encantan las fotos que manda a mitad del paseo. ¡Súper recomendado!"
    },
    {
      id: 2,
      author: "Julián G.",
      date: "Hace 1 semana",
      rating: 5,
      comment: "Muy puntual y responsable. Se nota que sabe manejar a perros grandes con mucha energía."
    }
  ];

  return (
    <div className="space-y-5 border-t border-gray-200 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Reseñas y Calificaciones</h2>
        <button className="text-sm font-semibold text-brand-primary hover:text-[#c93623] transition-colors">
          Ver todas
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="p-5 border border-gray-100 rounded-2xl bg-white shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{review.author}</h4>
                    <p className="text-[11px] text-gray-400 font-medium">{review.date}</p>
                  </div>
                </div>
                {/* Estrellas */}
                <div className="flex text-amber-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed pt-1">{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;