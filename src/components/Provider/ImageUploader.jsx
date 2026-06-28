import React, { useState } from 'react';

export default function ImageUploader({ onImageSelect }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    // Aquí iría la lógica para procesar e.dataTransfer.files[0]
    onImageSelect(e.dataTransfer.files[0]);
  };

  return (
    <div className="mb-6 relative z-10">
      <label className="block text-xs font-bold text-gray-700 mb-2">Foto de Perfil o Logo</label>
      <div 
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragging ? 'border-[#006D44] bg-emerald-50/50' : 'border-gray-300 bg-gray-50/50 hover:bg-gray-50'
        }`}
      >
        <div className="w-12 h-12 bg-emerald-400 text-white rounded-full flex items-center justify-center text-xl mb-4 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
        </div>
        <p className="text-sm font-bold text-gray-800">Haz clic o <span className="text-[#006D44]">arrastra</span> una imagen aquí</p>
        <p className="text-xs text-gray-500 mt-1 font-medium">PNG, JPG hasta 5MB. Se recomienda formato cuadrado.</p>
        <input type="file" className="hidden" accept="image/png, image/jpeg" />
      </div>
    </div>
  );
}