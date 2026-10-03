import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, CalendarCheck, ShoppingBag, Zap, Star, MapPin } from 'lucide-react';

const ACCENT = '#2D6A4F';

// ─── Constantes de UI ─────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  in_progress: { label: 'En Curso',   bg: 'bg-blue-50',   text: 'text-blue-700',  dot: 'bg-blue-500'  },
  scheduled:   { label: 'Próximo',    bg: 'bg-amber-50',  text: 'text-amber-700', dot: 'bg-amber-500' },
  completed:   { label: 'Completado', bg: 'bg-green-50',  text: 'text-green-700', dot: 'bg-green-500' },
  delivered:   { label: 'Entregado',  bg: 'bg-gray-100',  text: 'text-gray-600',  dot: 'bg-gray-400'  },
};

const VACCINE_CONFIG = {
  ok:      { label: 'Vacunas al día',  bg: 'bg-emerald-50', text: 'text-emerald-700' },
  pending: { label: 'Vacuna próxima',  bg: 'bg-amber-50',   text: 'text-amber-700'  },
  expired: { label: 'Vencida',         bg: 'bg-red-50',     text: 'text-red-600'    },
};

const QUICK_ACTIONS = [
  { id: 'book',    label: 'Reservar Servicio',  Icon: CalendarCheck, color: ACCENT },
  { id: 'orders',  label: 'Mis Pedidos',         Icon: ShoppingBag,   color: '#2563eb' },
  { id: 'vet',     label: 'Veterinaria Urgente', Icon: Zap,           color: '#dc2626' },
  { id: 'reviews', label: 'Mis Reseñas',         Icon: Star,          color: '#d97706' },
];

const SPECIES_EMOJI = { dog: '🐶', cat: '🐱', other: '🐾' };

// ─── Pet Card Compacta ────────────────────────────────────────────────────────
function PetCardCompact({ pet }) {
  const vaccine = VACCINE_CONFIG[pet.vaccineStatus] ?? VACCINE_CONFIG.ok;
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 hover:shadow-md transition-all">
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
        style={{ backgroundColor: `${ACCENT}12` }}>
        {pet.photo
          ? <img src={pet.photo} alt={pet.name} className="w-full h-full rounded-full object-cover" />
          : SPECIES_EMOJI[pet.species]
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-gray-900 truncate">{pet.name}</p>
        <p className="text-xs text-gray-400 truncate">{pet.breed}</p>
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${vaccine.bg} ${vaccine.text}`}>
        {vaccine.label}
      </span>
    </div>
  );
}

// ─── Timeline Item ────────────────────────────────────────────────────────────
function TimelineItem({ item, isLast }) {
  const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.completed;
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-2.5 h-2.5 rounded-full mt-1 ${cfg.dot}`} />
        {!isLast && <div className="w-px flex-1 bg-gray-100 mt-1" />}
      </div>
      <div className="pb-5 min-w-0 flex-1">
        <p className="text-xs text-gray-400 font-medium mb-0.5">{item.time}</p>
        <p className="text-sm font-bold text-gray-800">{item.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{item.details}</p>
        <span className={`inline-block mt-1.5 text-xs font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
          {cfg.label}
        </span>
      </div>
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function DashboardHome({ user, pets, activity, setActiveView }) {
  const navigate = useNavigate();
  const firstName = user?.name?.split(' ')[0] ?? 'Cliente';
  const activeCount = activity.filter((a) => a.status === 'in_progress').length;

  const handleActionClick = (e, actionId) => {
    if (e) e.preventDefault();
    switch (actionId) {
      case 'book':
        // Navegación Externa a otra página
        navigate('/marketplace?category=Grooming,Veterinaria');
        break;
      case 'orders':
        // Navegación Interna entre las pestañas del Dashboard
        setActiveView('orders');
        break;
      case 'vet':
        // Navegación Externa usando parámetros de consulta (query params)
        navigate('/marketplace?category=Veterinaria');
        break;
      case 'reviews':
        setActiveView('reviews');
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Saludo */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          ¡Hola, {firstName}! 👋
        </h1>
        <p className="mt-1 text-gray-500 font-medium">
          {activeCount > 0
            ? <>Tienes <span className="font-bold" style={{ color: ACCENT }}>{activeCount} servicio{activeCount > 1 ? 's' : ''}</span> activo{activeCount > 1 ? 's' : ''} ahora mismo.</>
            : 'No tienes servicios activos en este momento.'
          }
        </p>
      </div>

      {/* Grid principal 2/3 + 1/3 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

        {/* ── Columna izquierda (2/3) ──────────────────────────────────────── */}
        <div className="xl:col-span-2 flex flex-col gap-6">

          {/* Acciones rápidas */}
          <section>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Acciones Rápidas</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {QUICK_ACTIONS.map(({ id, label, Icon, color }) => (
                <button
                  key={id}
                  onClick={(e) => handleActionClick(e, id)}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm
                    hover:shadow-md hover:border-gray-200 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                    style={{ backgroundColor: `${color}15` }}>
                    <Icon size={18} strokeWidth={1.5} style={{ color }} />
                  </div>
                  <span className="text-xs font-bold text-gray-700 text-center leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Mascotas compactas */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Mis Mascotas</h2>
              <button
                onClick={() => setActiveView('pets')}
                className="text-xs font-bold hover:underline transition-all"
                style={{ color: ACCENT }}
              >
                Ver todas →
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {pets.map((pet) => <PetCardCompact key={pet.id} pet={pet} />)}
            </div>
          </section>
        </div>

        {/* ── Columna derecha (1/3): Actividad reciente ────────────────────── */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
            <h2 className="text-sm font-bold text-gray-900 mb-5">Actividad Reciente</h2>
            <div className="flex flex-col">
              {activity.map((item, i) => (
                <TimelineItem key={item.id} item={item} isLast={i === activity.length - 1} />
              ))}
            </div>
            <button
              onClick={() => setActiveView('reservations')}
              className="mt-4 w-full text-center text-xs font-bold py-2.5 rounded-xl border border-gray-100 text-gray-500 hover:bg-gray-50 transition-all"
            >
              Ver todas las reservas →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
