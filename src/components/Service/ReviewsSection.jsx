import React, { useState } from 'react';
import { X, Star } from 'lucide-react';

const INITIAL_REVIEWS = [
  {
    id: 1,
    author: "Mariana L.",
    date: "Hace 2 días",
    rating: 5,
    comment: "Excelente servicio. Volveré a comprar definitivamente. ¡Súper recomendado!"
  },
  {
    id: 2,
    author: "Julián G.",
    date: "Hace 1 semana",
    rating: 4,
    comment: "Muy puntual y responsable. Buena atención al cliente."
  }
];

const ReviewCard = ({ review }) => (
  <div className="p-5 border border-gray-100 rounded-2xl bg-white shadow-sm space-y-3 flex flex-col justify-between">
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs uppercase">
            {review.author.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900">{review.author}</h4>
            <p className="text-[11px] text-gray-400 font-medium">{review.date}</p>
          </div>
        </div>
        <div className="flex text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current text-amber-400' : 'text-gray-200 fill-current'}`} />
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed pt-1">{review.comment}</p>
    </div>
  </div>
);

const ReviewsSection = () => {
  const [reviewsList, setReviewsList] = useState(INITIAL_REVIEWS);
  const [showAllModal, setShowAllModal] = useState(false);
  const [showWriteModal, setShowWriteModal] = useState(false);

  // Estados para el formulario
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState('');

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (newRating === 0) {
      alert('Por favor selecciona una calificación.');
      return;
    }
    if (!newComment.trim()) {
      alert('Por favor escribe un comentario.');
      return;
    }

    const newReview = {
      id: Date.now(),
      author: "Tú",
      date: "Hace un momento",
      rating: newRating,
      comment: newComment
    };

    setReviewsList([newReview, ...reviewsList]);
    setShowWriteModal(false);
    setNewRating(0);
    setNewComment('');
  };

  return (
    <div className="space-y-5 border-t border-gray-200 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Reseñas y Calificaciones</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowWriteModal(true)}
            className="text-sm font-semibold px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            Dejar reseña
          </button>
          <button 
            onClick={() => setShowAllModal(true)}
            className="text-sm font-semibold text-brand-primary hover:text-[#c93623] transition-colors"
          >
            Ver todas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reviewsList.slice(0, 2).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* MODAL: VER TODAS LAS RESEÑAS */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAllModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Todas las Reseñas ({reviewsList.length})</h2>
              <button onClick={() => setShowAllModal(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
              {reviewsList.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* MODAL: ESCRIBIR RESEÑA */}
      {showWriteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowWriteModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Escribir una Reseña</h2>
              <button onClick={() => setShowWriteModal(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitReview} className="p-5 flex flex-col gap-5">
              
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-semibold text-gray-700">¿Cómo calificarías tu experiencia?</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setNewRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoverRating || newRating) 
                            ? 'fill-current text-amber-400' 
                            : 'text-gray-200 fill-current'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Comentario</label>
                <textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Cuéntanos más sobre tu experiencia..."
                  className="w-full h-32 p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-shadow text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowWriteModal(false)}
                  className="px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-brand-primary hover:bg-[#c93623] rounded-xl transition shadow-lg shadow-brand-primary/20"
                >
                  Publicar reseña
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReviewsSection;