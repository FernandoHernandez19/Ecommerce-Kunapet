import React, { useState, useMemo } from 'react';

const BookingWidget = ({ basePrice, serviceFee, serviceId }) => {
  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(null);
  const [dogCount, setDogCount] = useState(1);

  // Datos quemados de disponibilidad según diseño
  const timeSlots = [
    { time: '08:00 AM', status: 'available' },
    { time: '10:00 AM', status: 'available' },
    { time: '04:00 PM', status: 'available' },
    { time: '06:00 PM', status: 'full', label: '06:00 PM (Lleno)' }
  ];

  // Cálculos optimizados con useMemo para evitar re-renders innecesarios
  const subtotal = useMemo(() => basePrice * dogCount, [basePrice, dogCount]);
  const total = useMemo(() => subtotal + serviceFee, [subtotal, serviceFee]);

  const handleIncrement = () => setDogCount(prev => prev + 1);
  const handleDecrement = () => setDogCount(prev => Math.max(1, prev - 1));

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!date) return alert("Por favor, selecciona una fecha para el paseo.");
    if (!selectedTime) return alert("Por favor, selecciona un horario disponible.");

    const orderPayload = {
      serviceId,
      date,
      time: selectedTime,
      quantity: dogCount,
      totalAmount: total
    };
    
    console.log("Payload enviado al checkout/carrito:", orderPayload);
    // Aquí puedes disparar tu acción de Redux, Context o redirección a la pasarela
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 transition-all">
      <div className="flex items-baseline justify-between mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">${basePrice.toLocaleString('es-AR')}</span>
          <span className="text-sm text-gray-500">/ paseo</span>
        </div>
      </div>

      <form onSubmit={handleCheckout} className="space-y-5">
        {/* Selector de Fecha */}
        <div>
          <label htmlFor="booking-date" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Selecciona una fecha
          </label>
          <input
            id="booking-date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Selector de Horarios */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Horarios disponibles
          </label>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => {
              const isFull = slot.status === 'full';
              const isSelected = selectedTime === slot.time;
              
              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={isFull}
                  onClick={() => setSelectedTime(slot.time)}
                  className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all text-center ${
                    isFull 
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed text-xs' 
                      : isSelected
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  {isFull ? slot.label : slot.time}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contador de Perros */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Cantidad de perros
          </label>
          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-2 bg-white">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={dogCount <= 1}
              className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg font-bold disabled:opacity-50 transition-colors"
            >
              —
            </button>
            <span className="font-semibold text-gray-800 text-base" aria-live="polite">
              {dogCount}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg font-bold transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Desglose de Costos */}
        <div className="pt-4 border-t border-gray-100 space-y-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Paseo (x{dogCount})</span>
            <span>${subtotal.toLocaleString('es-AR')}</span>
          </div>
          <div className="flex justify-between">
            <span>Tarifa de servicio</span>
            <span>${serviceFee.toLocaleString('es-AR')}</span>
          </div>
          <div className="flex justify-between items-baseline pt-3 border-t border-gray-100 text-gray-900 font-bold text-base">
            <span>Total</span>
            <span className="text-xl text-gray-900">${total.toLocaleString('es-AR')}</span>
          </div>
        </div>

        {/* CTA Principal */}
        <button
          type="submit"
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-700/10 hover:shadow-emerald-700/20 active:scale-[0.99] transition-all text-center block text-sm"
        >
          Reservar Paseo
        </button>
        
        <p className="text-center text-xs text-gray-400 font-medium">No se te cobrará aún</p>
      </form>
    </div>
  );
};

export default BookingWidget;