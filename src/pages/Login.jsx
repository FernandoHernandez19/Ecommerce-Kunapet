import React, { useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-16 max-w-6xl">

        {/* ===== PANEL IZQUIERDO - INFO (Oculto en móvil) ===== */}
        <div
          className="hidden lg:flex flex-col justify-center p-12 text-white rounded-[2rem] shadow-2xl flex-1"
          style={{
            background: 'linear-gradient(135deg, #f05a28 0%, #f89e35 100%)',
            minHeight: '600px'
          }}
        >
          {/* Badge: ESCRITORIO DE KUNAPET */}
          <div className="inline-flex items-center gap-2 w-fit mb-8 px-4 py-2 rounded-full border border-white/40 bg-white/10 backdrop-blur-sm">
            <span className="text-2xl">🐾</span>
            <span className="text-sm font-bold tracking-widest">ESCRITORIO DE KUNAPET</span>
          </div>

          {/* Título Principal */}
          <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight" style={{ letterSpacing: '-1.5px' }}>
            Todo tu ecosistema mascota en un panel.
          </h1>

          {/* Descripción */}
          <p className="text-lg mb-12 leading-relaxed opacity-95">
            Gestiona servicios, agenda Grooming, revisa tu carrito y personaliza la experiencia de tus peludos desde un solo lugar.
          </p>

          {/* Grid de Características (2x2) */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className="p-4 rounded-2xl font-bold text-base"
              style={{ background: 'rgba(255, 255, 255, 0.15)' }}
            >
              Reservas inteligentes
            </div>
            <div
              className="p-4 rounded-2xl font-bold text-base"
              style={{ background: 'rgba(255, 255, 255, 0.15)' }}
            >
              Pago en 2 pasos
            </div>
            <div
              className="p-4 rounded-2xl font-bold text-base"
              style={{ background: 'rgba(255, 255, 255, 0.15)' }}
            >
              Membresías activas
            </div>
            <div
              className="p-4 rounded-2xl font-bold text-base"
              style={{ background: 'rgba(255, 255, 255, 0.15)' }}
            >
              Alertas en tiempo real
            </div>
          </div>
        </div>

        {/* ===== PANEL DERECHO - FORMULARIO LOGIN ===== */}
        <div className="w-full lg:w-96 flex flex-col justify-center">
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10">

            {/* Header del Formulario */}
            <div className="mb-8">
              <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-3">
                Bienvenido
              </p>
              <h2 className="text-3xl font-black text-gray-900 mb-4">
                Inicia sesión en KunaPet
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Conecta tu cuenta de cliente o proveedor. Si eres nuevo, crea tu cuenta y elige tu rol en pasos guiados.
              </p>
            </div>

            <form className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  Correo electrónico
                </label>
                <div className="relative">
                  <FiMail
                    className="absolute text-gray-400 left-4"
                    size={20}
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="email"
                    placeholder="nombre@ejemplo.com"
                    className="w-full py-3 pl-12 pr-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-gray-50 transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  Contraseña
                </label>
                <div className="relative">
                  <FiLock
                    className="absolute text-gray-400 left-4"
                    size={20}
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    className="w-full py-3 pl-12 pr-12 bg-gray-100 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-gray-50 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">¿Olvidaste tu contraseña?</span>
                <a href="#" className="font-bold text-red-600 hover:text-red-700 transition no-underline">
                  Recuperar acceso
                </a>
              </div>

              {/* Login Button */}
              <button
                type="button"
                className="w-full py-3 px-6 bg-red-600 text-white font-bold text-lg rounded-full hover:bg-red-700 active:scale-95 transition shadow-md"
                style={{ backgroundColor: '#e23d28' }}
              >
                Ingresar
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500 font-semibold">
                    ¿No tienes cuenta?
                  </span>
                </div>
              </div>

              {/* Sign Up Button */}
              <button
                type="button"
                className="w-full py-3 px-6 border-2 font-bold text-lg rounded-full transition hover:bg-red-50"
                style={{ borderColor: '#e23d28', color: '#e23d28' }}
              >
                Crear cuenta
              </button>

              {/* Helper Text */}
              <p className="text-center text-xs text-gray-500 mt-6 leading-relaxed">
                Este botón te llevará al selector de roles para iniciar el registro guiado.
              </p>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
