import React, { useState } from 'react';
import { Star, Edit3, Trash2, X } from 'lucide-react';
import { mockMyReviews } from '../../data/mockData';
import { Link } from 'react-router-dom';

export default function MyReviewsView() {
  const [reviews, setReviews] = useState(mockMyReviews);
  const [editingReview, setEditingReview] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setReviews(
      reviews.map((r) => (r.id === editingReview.id ? editingReview : r))
    );
    setEditingReview(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Mis Reseñas</h1>
          <p className="text-sm text-gray-500 mt-1">
            Administra las opiniones que has dejado sobre productos y servicios.
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center flex flex-col items-center">
          <Star className="w-16 h-16 text-gray-200 mb-4" />
          <h3 className="text-lg font-bold text-gray-900">Aún no has escrito ninguna reseña</h3>
          <p className="text-gray-500 mt-2 max-w-sm">
            Tus reseñas ayudan a otros clientes a elegir los mejores servicios y productos para sus mascotas.
          </p>
          <Link to="/marketplace" className="mt-6 px-6 py-2 bg-brand-primary text-white font-bold rounded-xl hover:bg-[#c93623] transition-colors no-underline">
            Explorar Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              {/* Info del ítem reseñado */}
              <Link to={`/item/${review.itemId}`} className="flex items-center gap-3 mb-4 group no-underline">
                <img src={review.itemImage} alt={review.itemTitle} className="w-12 h-12 rounded-xl object-cover border border-gray-100 group-hover:border-brand-primary transition-colors" />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-brand-primary transition-colors">{review.itemTitle}</h4>
                  <p className="text-xs text-gray-400">{review.date}</p>
                </div>
              </Link>
              
              {/* Estrellas y Comentario */}
              <div className="mb-4 flex-1">
                <div className="flex text-amber-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current text-amber-400' : 'text-gray-200 fill-current'}`} />
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  "{review.comment}"
                </p>
              </div>

              {/* Acciones */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-50">
                <button
                  onClick={() => setEditingReview(review)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: EDITAR RESEÑA */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditingReview(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Editar Reseña</h2>
              <button onClick={() => setEditingReview(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-5 flex flex-col gap-5">
              
              <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <img src={editingReview.itemImage} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <span className="text-sm font-bold text-gray-700 truncate">{editingReview.itemTitle}</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-semibold text-gray-700">Calificación</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setEditingReview({ ...editingReview, rating: star })}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoverRating || editingReview.rating) 
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
                  value={editingReview.comment}
                  onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                  className="w-full h-32 p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-shadow text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setEditingReview(null)}
                  className="px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-brand-primary hover:bg-[#c93623] rounded-xl transition shadow-lg shadow-brand-primary/20"
                >
                  Guardar Cambios
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
