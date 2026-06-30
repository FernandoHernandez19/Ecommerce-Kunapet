import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, ArrowRight, ShieldCheck, Star, Zap } from 'lucide-react';

// ─── Sub-componente: RoleCard ─────────────────────────────────────────────────
function RoleCard({ to, icon: Icon, iconColor, bgColor, borderHoverColor, title, description, cta, features }) {
  return (
    <Link
      to={to}
      className={[
        'group block w-full max-w-sm rounded-3xl p-7 shadow-card',
        'border-2 border-transparent no-underline',
        'transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover',
        borderHoverColor,
        bgColor,
      ].join(' ')}
    >
      {/* Ícono */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm bg-white"
      >
        <Icon size={30} className={iconColor} aria-hidden="true" />
      </div>

      {/* Título */}
      <h2 className="text-xl font-black text-gray-900 text-center mb-3 leading-snug">
        {title}
      </h2>

      {/* Descripción */}
      <p className="text-gray-500 text-sm text-center leading-relaxed mb-5">
        {description}
      </p>

      {/* Features */}
      <ul className="space-y-2 mb-6" aria-label={`Características de ${title}`}>
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs font-medium text-gray-600">
            <span className={['w-1.5 h-1.5 rounded-full shrink-0', iconColor.replace('text-', 'bg-')].join(' ')} aria-hidden="true" />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA Link */}
      <div className={`flex items-center justify-center gap-2 font-bold text-sm transition-all ${iconColor} group-hover:gap-3`}>
        {cta}
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </div>
    </Link>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function SelectRole() {
  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col items-center justify-center px-4 py-12">

      {/* ── Header ── */}
      <div className="text-center mb-10 animate-fade-in">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-pill bg-white border border-surface-border shadow-card text-xs font-bold text-gray-500 uppercase tracking-widest">
          <span aria-hidden="true">🐾</span>
          KunaPet — Elige tu camino
        </div>

        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">
          ¿Cómo quieres usar KunaPet?
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto text-base leading-relaxed">
          Elige el perfil que mejor te represente. Personalizaremos toda la
          experiencia para ti desde el primer paso.
        </p>
      </div>

      {/* ── Cards de rol ── */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl animate-slide-up">

        {/* CLIENTE */}
        <RoleCard
          to="/client-registration"
          icon={Users}
          iconColor="text-brand-primary"
          bgColor="bg-brand-primary-light"
          borderHoverColor="hover:border-brand-primary/40"
          title="Busco servicios para mis mascotas"
          description="Descubre veterinarias, grooming, paseos y experiencias diseñadas para cuidar a tus peludos como se merecen."
          cta="Iniciar sesión como cliente"
          features={[
            'Reservas en 1 clic',
            'Historial de mascotas',
            'Pagos seguros integrados',
          ]}
        />

        {/* PROVEEDOR */}
        <RoleCard
          to="/provider-registration"
          icon={Briefcase}
          iconColor="text-brand-accent"
          bgColor="bg-brand-accent-light"
          borderHoverColor="hover:border-brand-accent/40"
          title="Quiero ofrecer mis servicios"
          description="Registra tu negocio de mascotas y llega a miles de clientes en tu zona. Gestiona citas, pagos y reseñas en un solo lugar."
          cta="Empezar como proveedor"
          features={[
            'Panel de gestión completo',
            'Agenda y pagos automáticos',
            'Métricas de tu negocio',
          ]}
        />
      </div>

      {/* ── Trust signals ── */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 animate-fade-in">
        <div className="flex items-center gap-1.5 font-medium">
          <ShieldCheck size={16} className="text-brand-secondary" aria-hidden="true" />
          <span>100% seguro</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <Star size={16} className="text-brand-accent" aria-hidden="true" />
          <span>+12.000 usuarios activos</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <Zap size={16} className="text-brand-primary" aria-hidden="true" />
          <span>Registro en menos de 3 minutos</span>
        </div>
      </div>

      {/* ── Volver al inicio ── */}
      <Link
        to="/"
        className="mt-8 text-sm text-gray-400 hover:text-gray-600 font-medium no-underline transition-colors"
      >
        ← Volver al inicio
      </Link>
    </div>
  );
}
