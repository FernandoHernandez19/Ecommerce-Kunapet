import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { Button, Input } from '../components/ui';
import useAuthStore, { ROLES } from '../store/useAuthStore';

// ─── Validación ───────────────────────────────────────────────────────────────
function validate(email, password) {
  const errors = {};
  if (!email.trim()) {
    errors.email = 'El correo electrónico es obligatorio.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Ingresa un correo válido (ej: nombre@ejemplo.com).';
  }
  if (!password) {
    errors.password = 'La contraseña es obligatoria.';
  } else if (password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres.';
  }
  return errors;
}

// ─── Dashboard por rol ────────────────────────────────────────────────────────
const DASHBOARD_BY_ROLE = {
  [ROLES.CLIENT]: '/clientdashboard',
  [ROLES.PROVIDER]: '/providerdashboard',
  [ROLES.ADMIN]: '/admindashboard',
};

export default function Login() {
  // ── Formulario ────────────────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({ email: false, password: false });

  // ── Store y navegación ────────────────────────────────────────────────────
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Si venía de una ruta protegida, volver a ella tras login
  const from = location.state?.from?.pathname;

  // ── Validación en tiempo real (solo si ya tocó el campo) ──────────────────
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate(email, password);
    setFieldErrors(errs);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    // Marcar todos los campos como tocados antes de validar
    setTouched({ email: true, password: true });
    const errors = validate(email, password);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const result = await login({ email, password });

    if (result.success) {
      // Redirigir: primero a la ruta de origen (si venía de ProtectedRoute),
      // si no, siempre al Home — el Hero adaptativo mostrará el panel personalizado.
      const destination = from ?? '/';
      navigate(destination, { replace: true });
    }

  };

  // ── Credenciales de demo ──────────────────────────────────────────────────
  const DEMO_ACCOUNTS = [
    { label: 'Cliente demo', email: 'camila@kunapet.com', role: 'client' },
    { label: 'Proveedor demo', email: 'proveedor@kunapet.com', role: 'provider' },
    { label: 'Admin demo', email: 'admin@kunapet.com', role: 'admin' },
  ];

  const fillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('demo123456');
    setFieldErrors({});
    setTouched({ email: false, password: false });
    clearError();
  };

  return (
    <div className="bg-surface-secondary min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-16 max-w-6xl animate-fade-in">

        {/* ══════════════════════════════════════════════════════════════════
            PANEL IZQUIERDO — Hero (solo desktop)
        ══════════════════════════════════════════════════════════════════ */}
        <div
          className="hidden lg:flex flex-col justify-center p-12 text-white rounded-4xl shadow-2xl flex-1"
          style={{
            background: 'linear-gradient(135deg, #e23d28 0%, #f89e35 100%)',
            minHeight: '600px',
          }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 w-fit mb-8 px-4 py-2 rounded-pill border border-white/40 bg-white/10 backdrop-blur-sm">
            <span className="text-xl" aria-hidden="true">🐾</span>
            <span className="text-sm font-bold tracking-widest uppercase">Escritorio de KunaPet</span>
          </div>

          {/* Título */}
          <h1
            className="text-5xl lg:text-6xl font-black mb-6 leading-tight"
            style={{ letterSpacing: '-1.5px' }}
          >
            Todo tu ecosistema mascota en un panel.
          </h1>

          {/* Descripción */}
          <p className="text-lg mb-12 leading-relaxed opacity-95">
            Gestiona servicios, agenda Grooming, revisa tu carrito y personaliza
            la experiencia de tus peludos desde un solo lugar.
          </p>

          {/* Grid de características */}
          <div className="grid grid-cols-2 gap-4">
            {[
              'Reservas inteligentes',
              'Pago en 2 pasos',
              'Membresías activas',
              'Alertas en tiempo real',
            ].map((feature) => (
              <div
                key={feature}
                className="p-4 rounded-2xl font-bold text-base"
                style={{ background: 'rgba(255,255,255,0.15)' }}
              >
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            PANEL DERECHO — Formulario
        ══════════════════════════════════════════════════════════════════ */}
        <div className="w-full lg:w-96 flex flex-col justify-center">
          <div className="bg-white rounded-4xl shadow-card-hover p-8 md:p-10 animate-slide-up">

            {/* Header */}
            <div className="mb-8">
              <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-3">
                Bienvenido
              </p>
              <h2 className="text-3xl font-black text-gray-900 mb-4">
                Inicia sesión en KunaPet
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Conecta tu cuenta de cliente o proveedor. Si eres nuevo,
                crea tu cuenta en pasos guiados.
              </p>
            </div>

            {/* ── Error global del servidor ── */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 p-4 mb-6 bg-danger-light border border-danger/20 rounded-2xl animate-fade-in"
              >
                <AlertCircle size={18} className="text-danger shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm font-medium text-danger-text">{error}</p>
              </div>
            )}

            {/* ── Formulario ── */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* Email */}
              <Input
                id="login-email"
                label="Correo electrónico"
                type="email"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (touched.email) {
                    setFieldErrors(validate(e.target.value, password));
                  }
                }}
                onBlur={() => handleBlur('email')}
                error={touched.email ? fieldErrors.email : undefined}
                leftIcon={<Mail size={18} />}
                required
                autoComplete="email"
              />

              {/* Password */}
              <Input
                id="login-password"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touched.password) {
                    setFieldErrors(validate(email, e.target.value));
                  }
                }}
                onBlur={() => handleBlur('password')}
                error={touched.password ? fieldErrors.password : undefined}
                leftIcon={<Lock size={18} />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                required
                autoComplete="current-password"
              />

              {/* Recuperar contraseña */}
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-sm font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors no-underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Botón Ingresar */}
              <Button
                type="submit"
                variant="outline"
                size="lg"
                fullWidth
                isLoading={isLoading}
                rightIcon={!isLoading ? <ArrowRight size={18} /> : null}
              >

                {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
              </Button>

              {/* Divider */}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500 font-semibold">
                    ¿No tienes cuenta?
                  </span>
                </div>
              </div>

              {/* Botón Crear cuenta */}
              <Button
                type="button"
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => navigate('/select-role')}
              >
                Crear cuenta
              </Button>

              <p className="text-center text-xs text-gray-400 mt-2 leading-relaxed">
                Te llevaremos al selector de roles para iniciar el registro guiado.
              </p>
            </form>

            {/* ── Cuentas de Demo ── */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 text-center uppercase tracking-wider mb-3">
                🎯 Acceso demo rápido
              </p>
              <div className="grid grid-cols-3 gap-2">
                {DEMO_ACCOUNTS.map(({ label, email: demoEmail }) => (
                  <button
                    key={demoEmail}
                    type="button"
                    onClick={() => fillDemo(demoEmail)}
                    className="text-xs font-semibold text-gray-500 hover:text-brand-primary hover:bg-brand-primary-light px-2 py-1.5 rounded-lg border border-gray-200 hover:border-brand-primary/30 transition-all text-center"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
