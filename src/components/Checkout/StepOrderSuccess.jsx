import React from 'react';
import { CheckCircle, ExternalLink, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StepOrderSuccess({ orderId = 'ORD-2026-987654' }) {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in-up max-w-2xl mx-auto text-center py-12 px-4">
      <div className="w-24 h-24 bg-brand-secondary-light/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
        <div className="absolute inset-0 bg-brand-secondary/10 rounded-full animate-ping opacity-75"></div>
        <CheckCircle size={48} className="text-brand-secondary relative z-10" />
      </div>
      
      <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
        ¡Tu pedido y servicios están confirmados!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Hemos enviado un correo con los detalles de tu compra y agenda.
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-10 max-w-sm mx-auto">
        <p className="text-sm text-gray-500 mb-1">Número de orden</p>
        <p className="text-xl font-mono font-bold text-gray-900">{orderId}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={() => navigate('/clientdashboard', { state: { tab: 'orders' } })}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-secondary hover:bg-brand-secondary-hover text-white rounded-xl font-bold transition-all shadow-md"
        >
          Ir a Mis Pedidos <ExternalLink size={18} />
        </button>
        <button 
          onClick={() => navigate('/')}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl font-bold transition-all"
        >
          Volver al Home <Home size={18} />
        </button>
      </div>
    </div>
  );
}
