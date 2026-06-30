import React from 'react';
import { MessageSquare, FileText, XCircle, CalendarCheck, User } from 'lucide-react';

const ACCENT = '#2D6A4F';

const TYPE_CONFIG = {
  'Paseo':       { bg: 'bg-blue-50',    text: 'text-blue-700',   icon: '🦮' },
  'Veterinaria': { bg: 'bg-red-50',     text: 'text-red-700',    icon: '🩺' },
  'Peluquería':  { bg: 'bg-purple-50',  text: 'text-purple-700', icon: '✂️' },
  'Guardería':   { bg: 'bg-amber-50',   text: 'text-amber-700',  icon: '🏠' },
};

const STATUS_CONFIG = {
  in_progress: { label: 'En Curso',    bg: 'bg-blue-500',   text: 'text-white'   },
  scheduled:   { label: 'Programado',  bg: 'bg-amber-400',  text: 'text-white'   },
  completed:   { label: 'Completado',  bg: 'bg-green-500',  text: 'text-white'   },
  cancelled:   { label: 'Cancelado',   bg: 'bg-gray-300',   text: 'text-gray-700'},
};

function ReservationCard({ res }) {
  const type = TYPE_CONFIG[res.type] ?? { bg: 'bg-gray-50', text: 'text-gray-600', icon: '📋' };
  const status = STATUS_CONFIG[res.status] ?? STATUS_CONFIG.scheduled;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center gap-4">
      {/* Ícono de tipo */}
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${type.bg}`}>
        {type.icon}
      </div>

      {/* Info principal */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-bold text-gray-900">{res.type} · {res.petName}</p>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
            {status.label}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-1 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <CalendarCheck size={12} strokeWidth={1.5} /> {res.date} · {res.time}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <User size={12} strokeWidth={1.5} /> {res.provider}
          </span>
          <span className="text-xs font-bold text-gray-700">{res.price}</span>
        </div>
      </div>

      {/* Botones contextuales */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        {res.status === 'completed' && (
          <button className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
            <FileText size={13} strokeWidth={1.5} /> Reporte
          </button>
        )}
        {(res.status === 'in_progress' || res.status === 'scheduled') && (
          <button
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl text-white transition-all hover:opacity-90"
            style={{ backgroundColor: ACCENT }}
          >
            <MessageSquare size={13} strokeWidth={1.5} /> Chat
          </button>
        )}
        {res.status === 'scheduled' && (
          <button className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all">
            <XCircle size={13} strokeWidth={1.5} /> Cancelar
          </button>
        )}
      </div>
    </div>
  );
}

export default function ReservationsView({ reservations }) {
  const active = reservations.filter((r) => r.status === 'in_progress');
  const upcoming = reservations.filter((r) => r.status === 'scheduled');
  const past = reservations.filter((r) => r.status === 'completed' || r.status === 'cancelled');

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-extrabold text-gray-900">Mis Reservas</h1>

      {active.length > 0 && (
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse inline-block" />
            En Curso
          </h2>
          <div className="flex flex-col gap-3">{active.map((r) => <ReservationCard key={r.id} res={r} />)}</div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Próximas</h2>
          <div className="flex flex-col gap-3">{upcoming.map((r) => <ReservationCard key={r.id} res={r} />)}</div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Historial</h2>
          <div className="flex flex-col gap-3">{past.map((r) => <ReservationCard key={r.id} res={r} />)}</div>
        </section>
      )}
    </div>
  );
}
