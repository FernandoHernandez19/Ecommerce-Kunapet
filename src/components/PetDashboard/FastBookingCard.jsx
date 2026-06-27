import React from 'react';

export default function FastBookingCard() {
  return (
    <div className="bg-gradient-to-br from-emerald-900 to-[#005233] text-white rounded-2xl p-6 shadow-md">
      <h3 className="text-base font-bold mb-2 flex items-center gap-2">
        <span>⚡</span> Reserva Rápida
      </h3>
      <p className="text-xs text-emerald-100 font-medium mb-4 leading-relaxed">
        ¿Mismo plan de siempre? Agenda el paseo habitual de 1 hora con tu paseador preferido en un instante.
      </p>
      <button className="w-full py-2.5 bg-white text-[#006D44] hover:bg-emerald-50 text-xs font-extrabold rounded-xl shadow-sm transition-all">
        Programar Próximo Paseo
      </button>
    </div>
  );
}