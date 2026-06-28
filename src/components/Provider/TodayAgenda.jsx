import React from 'react';

export default function TodayAgenda({ appointments }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Agenda de hoy</h3>
        <button className="text-sm font-semibold text-brand-primary hover:text-[#c93623]">Ver calendario completo</button>
      </div>
      
      <div className="space-y-6">
        {appointments.map((apt, index) => (
          <div key={index} className="flex items-start justify-between border-l-2 border-emerald-200 pl-4 py-1">
            <div className="flex space-x-6">
              <div className="text-center w-12">
                <span className="block text-sm font-bold text-gray-900">{apt.time}</span>
                <span className="text-[10px] text-gray-500 font-semibold uppercase">{apt.meridian}</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">{apt.service}</h4>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{apt.pet} • {apt.client}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-700 bg-gray-50 rounded-lg">💬</button>
              <button className={`px-4 py-2 rounded-lg text-xs font-bold transition-all w-24 text-center ${
                apt.status === 'READY' ? 'bg-brand-primary text-white shadow-md hover:bg-[#c93623]' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}>
                {apt.statusText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}