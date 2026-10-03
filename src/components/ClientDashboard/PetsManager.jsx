import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Syringe, UtensilsCrossed, ChevronRight, Edit3, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import usePetsStore from '../../store/usePetsStore';
import { Modal, Input } from '../ui';

const ACCENT = '#2D6A4F';
const SPECIES_EMOJI = { dog: '🐶', cat: '🐱', other: '🐾' };
const SPECIES_LABEL = { dog: 'Perro', cat: 'Gato', other: 'Otro' };

const VACCINE_STATUS = {
  ok:       { label: 'Vigente',  bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  upcoming: { label: 'Próxima',  bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-400'  },
  expired:  { label: 'Vencida',  bg: 'bg-red-50',     text: 'text-red-600',    dot: 'bg-red-500'    },
};

const VACCINE_BADGE = {
  ok:      { label: 'Al día',        bg: 'bg-emerald-50', text: 'text-emerald-700' },
  pending: { label: 'Vacuna próxima', bg: 'bg-amber-50',  text: 'text-amber-700'  },
};

// ─── Tarjeta de mascota (vista lista) ─────────────────────────────────────────
function PetCard({ pet, onSelect }) {
  const badge = VACCINE_BADGE[pet.vaccineStatus] ?? VACCINE_BADGE.ok;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col">
      {/* Avatar */}
      <div className="h-32 flex items-center justify-center text-6xl"
        style={{ backgroundColor: `${ACCENT}0D` }}>
        {pet.photo
          ? <img src={pet.photo} alt={pet.name} className="h-full w-full object-cover" />
          : SPECIES_EMOJI[pet.species]
        }
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <p className="font-extrabold text-gray-900">{pet.name}</p>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            {SPECIES_LABEL[pet.species]} · {pet.breed} · {pet.age} años
          </p>
        </div>
        <span className={`self-start text-xs font-bold px-2 py-1 rounded-full ${badge.bg} ${badge.text}`}>
          {badge.label}
        </span>
        <button
          onClick={() => onSelect(pet)}
          className="mt-auto text-sm font-bold py-2.5 rounded-xl border-2 transition-all hover:text-white"
          style={{ borderColor: ACCENT, color: ACCENT }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = ACCENT; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = ACCENT; }}
        >
          Ver Perfil
        </button>
      </div>
    </div>
  );
}

// ─── Widget Mapa en Vivo ───────────────────────────────────────────────────────
function LiveMapWidget({ reservation }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <p className="text-sm font-bold text-gray-900">Servicio en Vivo</p>
        </div>
        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">En Curso</span>
      </div>
      {/* Mapa simulado */}
      <div className="h-48 relative flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 20px,#2D6A4F 20px,#2D6A4F 21px),repeating-linear-gradient(90deg,transparent,transparent 20px,#2D6A4F 20px,#2D6A4F 21px)' }}
        />
        <div className="relative flex flex-col items-center gap-2">
          <MapPin size={32} strokeWidth={1.5} style={{ color: ACCENT }} />
          <div className="bg-white rounded-xl px-3 py-1.5 shadow-md text-xs font-bold text-gray-800">
            {reservation.provider} · En movimiento
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 font-medium">
          {reservation.type} · {reservation.time}
        </p>
        <p className="text-sm font-bold text-gray-800 mt-0.5">
          Con {reservation.provider}
        </p>
      </div>
    </div>
  );
}

// ─── Vista Detalle de Mascota ─────────────────────────────────────────────────
function PetDetail({ pet, onBack, activeReservation }) {
  const [tab, setTab] = useState('health');
  const badge = VACCINE_BADGE[pet.vaccineStatus] ?? VACCINE_BADGE.ok;

  const { updatePet, removePet } = usePetsStore();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    gender: pet.gender,
    birthdate: pet.birthdate,
    diet: pet.diet || '',
    behavior: pet.behavior || '',
  });

  const handleDelete = () => {
    removePet(pet.id);
    onBack();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    let newAge = pet.age;
    if (editForm.birthdate) {
      newAge = new Date().getFullYear() - new Date(editForm.birthdate).getFullYear();
    }
    updatePet(pet.id, { ...editForm, age: newAge });
    setIsEditOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-all"
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
          </button>
          <h1 className="text-2xl font-extrabold text-gray-900">Perfil de {pet.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: ACCENT }}
          >
            <Edit3 size={16} strokeWidth={2} /> Editar
          </button>
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-all"
          >
            <Trash2 size={16} strokeWidth={2} /> Eliminar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ── Izquierda: info + tabs ─────────────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Tarjeta de identificación */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shrink-0"
              style={{ backgroundColor: `${ACCENT}12` }}>
              {SPECIES_EMOJI[pet.species]}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-extrabold text-gray-900">{pet.name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {SPECIES_LABEL[pet.species]} · {pet.breed} · {pet.gender}
              </p>
              <p className="text-sm text-gray-500">
                {pet.age} años · Nacimiento: {pet.birthdate}
              </p>
              <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full ${badge.bg} ${badge.text}`}>
                {badge.label}
              </span>
            </div>
          </div>

          {/* Tabs internos */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-100">
              {[
                { id: 'health', label: 'Historial Médico', Icon: Syringe },
                { id: 'diet',   label: 'Dieta & Conducta',  Icon: UtensilsCrossed },
              ].map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold transition-all border-b-2 ${
                    tab === id
                      ? 'border-[#2D6A4F] text-[#2D6A4F]'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Icon size={15} strokeWidth={1.5} /> {label}
                </button>
              ))}
            </div>

            <div className="p-5">
              {tab === 'health' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-gray-100">
                        <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Vacuna</th>
                        <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha</th>
                        <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Próxima dosis</th>
                        <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {pet.vaccines.map((v) => {
                        const s = VACCINE_STATUS[v.status] ?? VACCINE_STATUS.ok;
                        return (
                          <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 font-semibold text-gray-800">{v.name}</td>
                            <td className="py-3 text-gray-500">{v.date}</td>
                            <td className="py-3 text-gray-500">{v.nextDue}</td>
                            <td className="py-3">
                              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full ${s.bg} ${s.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                {s.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {tab === 'diet' && (
                <div className="flex flex-col gap-5">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Plan de Dieta</h3>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 leading-relaxed">{pet.diet}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Conducta</h3>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 leading-relaxed">{pet.behavior}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Derecha: widget mapa condicional ──────────────────────────── */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {activeReservation ? (
            <LiveMapWidget reservation={activeReservation} />
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${ACCENT}12` }}>
                <MapPin size={22} strokeWidth={1.5} style={{ color: ACCENT }} />
              </div>
              <p className="text-sm font-semibold text-gray-500">
                Sin servicio activo en este momento
              </p>
              <p className="text-xs text-gray-400">
                El mapa en tiempo real aparece cuando {pet.name} tiene un paseo en curso.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal Eliminar ── */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Eliminar Mascota" size="sm">
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
            <AlertTriangle size={32} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">¿Eliminar a {pet.name}?</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Esta acción es irreversible y eliminará todo el historial médico y de reservas asociado a esta mascota.
          </p>
          <div className="flex gap-3 w-full mt-4">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="flex-1 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all"
            >
              Sí, Eliminar
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Modal Editar ── */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Editar Perfil" size="lg">
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-5 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              label="Nombre de la mascota" 
              value={editForm.name} 
              onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
              required 
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">Especie</label>
              <select 
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all appearance-none"
                value={editForm.species}
                onChange={(e) => setEditForm({...editForm, species: e.target.value})}
              >
                <option value="dog">Perro</option>
                <option value="cat">Gato</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <Input 
              label="Raza" 
              value={editForm.breed} 
              onChange={(e) => setEditForm({...editForm, breed: e.target.value})} 
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">Género</label>
              <select 
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all appearance-none"
                value={editForm.gender}
                onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
              >
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>
            <Input 
              type="date"
              label="Fecha de Nacimiento" 
              value={editForm.birthdate} 
              onChange={(e) => setEditForm({...editForm, birthdate: e.target.value})} 
            />
          </div>
          
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">Plan de Dieta / Necesidades Especiales</label>
              <textarea 
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none"
                rows="3"
                value={editForm.diet}
                onChange={(e) => setEditForm({...editForm, diet: e.target.value})}
              ></textarea>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">Notas de Conducta (Alergias, miedos, etc.)</label>
              <textarea 
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none"
                rows="3"
                value={editForm.behavior}
                onChange={(e) => setEditForm({...editForm, behavior: e.target.value})}
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-6 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-bold text-white rounded-xl transition-all hover:opacity-90 flex items-center gap-2"
              style={{ backgroundColor: ACCENT }}
            >
              <CheckCircle2 size={18} strokeWidth={2} /> Guardar Cambios
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ─── PetsManager Principal ────────────────────────────────────────────────────
export default function PetsManager({ pets, reservations }) {
  const [selectedPet, setSelectedPet] = useState(null);
  const navigate = useNavigate();

  const activeReservation = selectedPet
    ? reservations.find((r) => r.petId === selectedPet.id && r.status === 'in_progress')
    : null;

  if (selectedPet) {
    return (
      <PetDetail
        pet={selectedPet}
        onBack={() => setSelectedPet(null)}
        activeReservation={activeReservation}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-900">Mis Mascotas</h1>
        <button
          onClick={() => navigate('/add-pet')}
          className="text-sm font-bold px-4 py-2.5 rounded-xl text-white transition-all hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          + Añadir Mascota
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} onSelect={setSelectedPet} />
        ))}
      </div>
    </div>
  );
}
