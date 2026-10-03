import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag, HeartPulse, Briefcase,
  ArrowRight, ShieldCheck, Star, Zap,
  MapPin, Syringe, CalendarCheck,
  Users, LayoutDashboard,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import useAuthStore, { ROLES } from '../store/useAuthStore';

// ─── Constantes ────────────────────────────────────────────────────────────────
const BRAND_SEC = '#2D6A4F'; // var(--color-brand-secondary) — verde institucional
const BRAND_PRI = '#e23d28'; // var(--color-brand-primary)  — coral/rojo

const DASHBOARD_BY_ROLE = {
  [ROLES.CLIENT]:   '/clientdashboard',
  [ROLES.PROVIDER]: '/providerdashboard',
  [ROLES.ADMIN]:    '/admindashboard',
};

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: '500+',  label: 'Especialistas activos' },
  { value: '10k+',  label: 'Mascotas felices'       },
  { value: '4.9/5', label: 'Calificación promedio'  },
  { value: '24/7',  label: 'Soporte continuo'       },
];

// ─── Tarjetas del Ecosistema ─────────────────────────────────────────────────
const ECOSYSTEM_CARDS = [
  {
    id: 'marketplace',
    Icon: ShoppingBag,
    iconBg: `${BRAND_PRI}12`,
    iconColor: BRAND_PRI,
    accentColor: BRAND_PRI,
    badge: 'Marketplace',
    title: 'Marketplace Inteligente',
    description:
      'Encuentra alimentos premium, juguetes y accesorios filtrando por tipo de mascota, distrito y calificación. Compra segura con entrega en 24h.',
    features: [
      { Icon: MapPin,       text: 'Filtros por distrito y zona' },
      { Icon: ShieldCheck,  text: 'Pagos 100% seguros'         },
      { Icon: Star,         text: 'Reseñas verificadas'         },
    ],
    cta: 'Explorar Marketplace',
    to: '/marketplace',
  },
  {
    id: 'monitoring',
    Icon: HeartPulse,
    iconBg: `${BRAND_SEC}12`,
    iconColor: BRAND_SEC,
    accentColor: BRAND_SEC,
    badge: 'Historial & Monitoreo',
    title: 'Historial y Seguimiento en Vivo',
    description:
      'Perfiles médicos completos con control de vacunas obligatorias y alertas de vencimiento. Mapa GPS en tiempo real para paseos activos.',
    features: [
      { Icon: Syringe,      text: 'Control de vacunas con alertas'     },
      { Icon: MapPin,       text: 'Rastreo GPS en tiempo real'         },
      { Icon: CalendarCheck,text: 'Historial médico centralizado'      },
    ],
    cta: 'Ver mi Panel',
    to: '/clientdashboard',
  },
  {
    id: 'providers',
    Icon: Briefcase,
    iconBg: '#e0b02012',
    iconColor: '#e0b020',
    accentColor: '#e0b020',
    badge: 'Para Profesionales',
    title: 'Herramientas para Profesionales',
    description:
      'Veterinarias, estéticas y paseadores autmatizan su agenda, cobros y reseñas desde un panel unificado. Llega a miles de clientes en tu zona.',
    features: [
      { Icon: CalendarCheck, text: 'Agenda y citas automáticas'     },
      { Icon: Star,          text: 'Reseñas y reputación digital'   },
      { Icon: Zap,           text: 'Métricas de tu negocio en vivo' },
    ],
    cta: 'Registrar mi negocio',
    to: '/provider-registration',
  },
];

// ─── Sub-componente: Tarjeta de ecosistema ────────────────────────────────────
function EcosystemCard({ card }) {
  const { Icon, iconBg, iconColor, accentColor, badge, title, description, features, cta, to } = card;
  return (
    <div className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
      {/* Header coloreado */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-5">
          {/* Ícono */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: iconBg }}
          >
            <Icon size={22} strokeWidth={1.5} style={{ color: iconColor }} />
          </div>
          {/* Badge */}
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
          >
            {badge}
          </span>
        </div>

        <h3 className="text-lg font-extrabold text-gray-900 mb-2 leading-snug">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
      </div>

      {/* Features */}
      <div className="px-6 pb-5 flex flex-col gap-2.5 flex-1">
        {features.map(({ Icon: FIcon, text }) => (
          <div key={text} className="flex items-center gap-2.5 text-xs font-medium text-gray-600">
            <FIcon size={14} strokeWidth={1.5} style={{ color: accentColor }} className="shrink-0" />
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-6 pb-6">
        <Link
          to={to}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-bold transition-all no-underline group-hover:gap-3 text-white"
          style={{ backgroundColor: accentColor }}
        >
          {cta}
          <ArrowRight size={15} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

// ─── Hero Autenticado ─────────────────────────────────────────────────────────
function HeroAuthenticated({ user }) {
  const navigate = useNavigate();
  const dashPath = DASHBOARD_BY_ROLE[user?.role] ?? '/clientdashboard';
  const firstName = user?.name?.split(' ')[0] ?? 'de vuelta';
  const isProvider = user?.role === ROLES.PROVIDER;

  return (
    <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BRAND_SEC}08 0%, #fff 60%)` }}>
      {/* Decoración de fondo */}
      <div
        className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-5 pointer-events-none"
        style={{ backgroundColor: BRAND_SEC }}
      />
      <div
        className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-5 pointer-events-none"
        style={{ backgroundColor: BRAND_PRI }}
      />

      <div className="max-w-screen-xl mx-auto px-4 py-14 md:py-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 animate-fade-in">
          {/* Texto */}
          <div className="flex-1 min-w-0">
            {/* Badge de rol */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-5"
              style={{ backgroundColor: `${BRAND_SEC}15`, color: BRAND_SEC }}>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {isProvider ? '⚙️ Panel de Proveedor' : '🐾 Panel de Cliente'}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-4">
              ¡Hola de nuevo,{' '}
              <span style={{ color: BRAND_SEC }}>{firstName}</span>!
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-lg leading-relaxed">
              Explora las novedades del ecosistema o gestiona tus actividades pendientes.
            </p>
          </div>

          {/* CTA Card flotante */}
          <div className="shrink-0 w-full md:w-auto">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[var(--shadow-card)] p-6 flex flex-col gap-4 min-w-[280px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${BRAND_SEC}15` }}>
                  <LayoutDashboard size={18} strokeWidth={1.5} style={{ color: BRAND_SEC }} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold">Tu espacio en KunaPet</p>
                  <p className="text-sm font-bold text-gray-900">
                    {isProvider ? 'Panel de Proveedor' : 'Panel de Cliente'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate(dashPath)}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: BRAND_SEC }}
              >
                Ir a mi Panel de Control
                <ArrowRight size={15} strokeWidth={2} />
              </button>
              <Link
                to="/marketplace"
                className="text-center text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors no-underline"
              >
                o explorar el Marketplace →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Hero Público ─────────────────────────────────────────────────────────────
function HeroPublic() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Decoraciones */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-[0.06]"
          style={{ backgroundColor: BRAND_SEC }} />
        <div className="absolute top-1/2 -left-10 w-48 h-48 rounded-full opacity-[0.04]"
          style={{ backgroundColor: BRAND_PRI }} />
      </div>

      <div className="relative max-w-screen-xl mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-surface-secondary border border-surface-border text-xs font-bold text-gray-500 uppercase tracking-widest mb-8 animate-fade-in">
          <span>🐾</span> El ecosistema completo para mascotas
        </div>

        {/* Título */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 max-w-3xl leading-[1.1] mb-6 animate-fade-in">
          Todo lo que tu mascota necesita,{' '}
          <span style={{ color: BRAND_SEC }}>en un solo ecosistema</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl leading-relaxed mb-12 animate-fade-in">
          Conecta con veterinarias, paseadores y tiendas verificadas. Gestiona la salud, los servicios y los pedidos de tus peludos, todo desde KunaPet.
        </p>

        {/* Selector de Roles embebido (versión compacta) */}
        <div className="w-full max-w-2xl animate-slide-up">
          <p className="text-sm font-bold text-gray-400 mb-5 uppercase tracking-widest">¿Cómo quieres empezar?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Card Cliente */}
            <Link
              to="/client-registration"
              className="group flex-1 max-w-xs flex flex-col items-center gap-3 p-6 rounded-3xl border-2 border-transparent no-underline transition-all duration-300 hover:-translate-y-1 bg-brand-primary-light hover:border-brand-primary/40 hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                <Users size={26} strokeWidth={1.5} className="text-brand-primary" />
              </div>
              <h2 className="text-base font-extrabold text-gray-900 text-center leading-snug">
                Busco servicios para mis mascotas
              </h2>
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                Reservas, historial médico y seguimiento en tiempo real.
              </p>
              <span className="flex items-center gap-1 text-sm font-bold text-brand-primary mt-1 group-hover:gap-2 transition-all">
                Crear cuenta gratis <ArrowRight size={14} strokeWidth={2} />
              </span>
            </Link>

            {/* Divider vertical */}
            <div className="hidden sm:flex flex-col items-center justify-center gap-2 px-2">
              <div className="w-px flex-1 bg-gray-200" />
              <span className="text-xs font-bold text-gray-400 bg-white px-2">o</span>
              <div className="w-px flex-1 bg-gray-200" />
            </div>

            {/* Card Proveedor */}
            <Link
              to="/provider-registration"
              className="group flex-1 max-w-xs flex flex-col items-center gap-3 p-6 rounded-3xl border-2 border-transparent no-underline transition-all duration-300 hover:-translate-y-1 bg-brand-accent-light hover:border-brand-accent/40 hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                <Briefcase size={26} strokeWidth={1.5} className="text-brand-accent" />
              </div>
              <h2 className="text-base font-extrabold text-gray-900 text-center leading-snug">
                Quiero ofrecer mis servicios
              </h2>
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                Agenda, pagos y métricas para tu negocio de mascotas.
              </p>
              <span className="flex items-center gap-1 text-sm font-bold text-brand-accent mt-1 group-hover:gap-2 transition-all">
                Registrar mi negocio <ArrowRight size={14} strokeWidth={2} />
              </span>
            </Link>
          </div>

          {/* Trust signals */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheck size={14} strokeWidth={1.5} className="text-brand-secondary" /> 100% seguro
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Star size={14} strokeWidth={1.5} className="text-brand-accent" /> +12.000 usuarios activos
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Zap size={14} strokeWidth={1.5} className="text-brand-primary" /> Registro en menos de 3 min
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats Banner ─────────────────────────────────────────────────────────────
function StatsBanner() {
  return (
    <section style={{ backgroundColor: BRAND_SEC }} className="py-12">
      <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {STATS.map(({ value, label }) => (
          <div key={label}>
            <p className="text-3xl md:text-4xl font-black text-white mb-1">{value}</p>
            <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Ecosystem Cards Section ──────────────────────────────────────────────────
function EcosystemSection() {
  return (
    <section className="bg-surface-secondary py-20">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-surface-border text-xs font-bold text-gray-500 uppercase tracking-widest mb-5">
            🌐 El ecosistema KunaPet
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
            Tres soluciones,{' '}
            <span style={{ color: BRAND_SEC }}>una sola plataforma</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            Diseñado para clientes, mascotas y profesionales. Todo lo que necesitas para
            vivir la mejor experiencia de cuidado animal.
          </p>
        </div>

        {/* Grid 3 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ECOSYSTEM_CARDS.map((card) => (
            <EcosystemCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Final ────────────────────────────────────────────────────────────────
function CtaSection({ isAuthenticated, user }) {
  const navigate = useNavigate();
  const dashPath = DASHBOARD_BY_ROLE[user?.role] ?? '/clientdashboard';

  return (
    <section className="relative overflow-hidden py-20 bg-white">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 70% 50%, ${BRAND_SEC}08 0%, transparent 70%)` }} />
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
          Únete a la familia{' '}
          <span style={{ color: BRAND_SEC }}>KunaPet</span>
        </h2>
        <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Ya sea que busques el mejor cuidado para tu mascota o quieras ofrecer tus servicios
          profesionales, este es el lugar correcto.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate(dashPath)}
                className="px-8 py-4 text-white font-bold rounded-2xl transition-all shadow-[var(--shadow-brand)] hover:shadow-[var(--shadow-brand)] hover:-translate-y-0.5 active:scale-[0.98]"
                style={{ backgroundColor: BRAND_SEC }}
              >
                Ir a mi Panel de Control
              </button>
              <Link
                to="/marketplace"
                className="px-8 py-4 bg-white text-gray-900 border border-gray-200 hover:border-gray-300 font-bold rounded-2xl transition-all shadow-sm hover:shadow-md no-underline"
              >
                Explorar servicios
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/select-role"
                className="px-8 py-4 text-white font-bold rounded-2xl transition-all hover:-translate-y-0.5 no-underline"
                style={{ backgroundColor: BRAND_SEC }}
              >
                Crear mi cuenta gratis
              </Link>
              <Link
                to="/marketplace"
                className="px-8 py-4 bg-white text-gray-900 border border-gray-200 hover:border-gray-300 font-bold rounded-2xl transition-all shadow-sm hover:shadow-md no-underline"
              >
                Explorar servicios
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── EcosystemHome — Componente raíz de la ruta "/" ──────────────────────────
export default function Home() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <MainLayout>
      {/* ── Hero adaptativo por estado de autenticación ── */}
      {isAuthenticated && user
        ? <HeroAuthenticated user={user} />
        : <HeroPublic />
      }

      {/* ── Stats (siempre visible) ── */}
      <StatsBanner />

      {/* ── Tres soluciones del ecosistema (siempre visible) ── */}
      <EcosystemSection />

      {/* ── CTA final (adaptado al estado de auth) ── */}
      <CtaSection isAuthenticated={isAuthenticated} user={user} />
    </MainLayout>
  );
}
