import React from 'react';

export default function ProviderOnboardingLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans flex flex-col items-center">
      <header className="w-full bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-12 h-20 sticky top-0 z-30">
        <div className="flex items-center space-x-2 cursor-pointer">
          <span className="text-[#006D44] text-2xl">🐾</span>
          <span className="text-xl font-black text-[#006D44] tracking-tight">KunaPet</span>
        </div>
        <button className="flex items-center space-x-2 text-sm font-semibold text-gray-600 hover:text-[#006D44] transition-colors">
          <span>❓</span>
          <span>Ayuda</span>
        </button>
      </header>
      
      <main className="w-full max-w-4xl py-12 px-4 sm:px-6">
        {children}
      </main>
    </div>
  );
}