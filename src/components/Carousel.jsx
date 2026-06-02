import React, { useState, useEffect } from 'react';
import '../index.css';

export default function CarouselBanner() {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'Veterinarias Confiables',
      subtitle: 'Encuentra los mejores especialistas para tu peludo',
      color: '#f05a28',
      icon: '🏥'
    },
    {
      id: 2,
      title: 'Grooming Premium',
      subtitle: 'Servicios de higiene y estética de calidad',
      color: '#f89e35',
      icon: '✨'
    },
    {
      id: 3,
      title: 'Paseos y Cuidados',
      subtitle: 'Diversión y bienestar para tus mascotas',
      color: '#e0b020',
      icon: '🚶'
    },
    {
      id: 4,
      title: 'Membresías Exclusivas',
      subtitle: 'Acceso a beneficios especiales todo el año',
      color: '#e23d28',
      icon: '👑'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const slide = slides[activeSlide];

  const goToSlide = (index) => setActiveSlide(index);
  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="carousel-banner relative w-full overflow-hidden">
      <div className="relative w-full" style={{ minHeight: '400px' }}>
        <div
          className="carousel-content flex items-center justify-center w-full transition-all duration-500"
          style={{
            background: `linear-gradient(135deg, ${slide.color}, ${slide.color}dd)`,
            minHeight: 'inherit'
          }}
        >
          <div className="text-center text-white px-4">
            <div className="carousel-icon mb-3" style={{ fontSize: '4rem' }}>
              {slide.icon}
            </div>
            <h1 className="carousel-title font-bold mb-3 text-4xl">{slide.title}</h1>
            <p className="carousel-subtitle text-lg mb-4">{slide.subtitle}</p>
            <button className="bg-white text-gray-800 font-semibold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition">
              Explorar
            </button>
          </div>
        </div>

        {/* Controles de navegación */}
        <button
          onClick={prevSlide}
          className="carousel-control-prev absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-30 hover:bg-opacity-60 rounded-full flex items-center justify-center transition z-10 text-white text-2xl"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="carousel-control-next absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-30 hover:bg-opacity-60 rounded-full flex items-center justify-center transition z-10 text-white text-2xl"
        >
          ❯
        </button>
      </div>

      {/* Indicadores */}
      <div className="carousel-indicators flex justify-center gap-3 py-4 pb-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === activeSlide
                ? 'bg-white shadow-md'
                : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
