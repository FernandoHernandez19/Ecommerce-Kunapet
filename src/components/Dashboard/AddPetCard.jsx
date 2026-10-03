import React from 'react';

export default function AddPetCard({ onClick }) {
  return (
    <button 
      onClick={onClick}
      className="w-full p-5 border-2 border-dashed border-gray-200 hover:border-brand-primary rounded-2xl bg-gray-50/50 hover:bg-white flex flex-col items-center justify-center space-y-2 group transition-all h-full min-h-[122px] outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
    >
      <span className="text-2xl text-gray-400 group-hover:text-brand-primary transition-colors">＋</span>
      <span className="text-xs font-bold text-gray-500 group-hover:text-brand-primary transition-colors">
        Registrar nueva mascota
      </span>
    </button>
  );
}