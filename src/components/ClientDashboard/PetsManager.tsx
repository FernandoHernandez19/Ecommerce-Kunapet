import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Syringe, UtensilsCrossed, Edit3, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import usePetsStore from '../../store/usePetsStore';
import { Modal, Input } from '../ui';
import { friendlyMessage } from '../../api/errorMessages';
import { PET_NOTES_MAX, type PetEditForm, type UiPet, type UiSpecies } from '../../api/adapters';
import { genderSchema, speciesSchema } from '../../api/schemas';
import type { PetsStatus } from '../../store/usePetsStore';
import type { MockReservation } from '../../data/mockData';

const ACCENT = '#2D6A4F';
const SPECIES_EMOJI: Record<UiSpecies, string> = { dog: '🐶', cat: '🐱', other: '🐾' };

const VACCINE_STATUS = {
  ok:       { label: 'Vigente',  bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  upcoming: { label: 'Próxima',  bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-400'  },
  expired:  { label: 'Vencida',  bg: 'bg-red-50',     text: 'text-red-600',    dot: 'bg-red-500'    },
};

type VaccineBadgeKey = 'ok' | 'pending';

const VACCINE_BADGE = {
  ok:      { label: 'Al día',        bg: 'bg-emerald-50', text: 'text-emerald-700' },
  pending: { label: 'Vacuna próxima', bg: 'bg-amber-50',  text: 'text-amber-700'  },
};

const TABS = [
  { id: 'health', label: 'Historial Médico', Icon: Syringe },
  { id: 'diet', label: 'Notas', Icon: UtensilsCrossed },
] as const;

// ─── Tarjeta de mascota (vista lista) ─────────────────────────────────────────
const badgeFor = (status: VaccineBadgeKey | null) => (status ? VACCINE_BADGE[status] : null);

function PetCard({ pet, onSelect }: { pet: UiPet; onSelect: (pet: UiPet) => void }) {
  const badge = badgeFor(pet.vaccineStatus); // la API aún no tiene vacunas
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
            {pet.speciesLabel} · {pet.breed} · {pet.ageLabel}
          </p>
        </div>
        {badge && (
          <span className={`self-start text-xs font-bold px-2 py-1 rounded-full ${badge.bg} ${badge.text}`}>
            {badge.label}
          </span>
        )}
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
function LiveMapWidget({ reservation }: { reservation: MockReservation }) {
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
interface PetDetailProps {
  pet: UiPet;
  onBack: () => void;
  activeReservation: MockReservation | null;
}

function PetDetail({ pet, onBack, activeReservation }: PetDetailProps) {
  const [tab, setTab] = useState<'health' | 'diet'>('health');
  const badge = badgeFor(pet.vaccineStatus);

  const { updatePet, removePet } = usePetsStore();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Edit form state (valores de la API: species dog|cat|bird|exotic|other, gender female|male|unknown)
  const buildForm = (): PetEditForm => ({
    name: pet.name,
    species: pet.speciesApi,
    breed: pet.breed === 'Raza no especificada' ? '' : pet.breed,
    gender: pet.genderApi,
    birthdate: pet.birthdate,
    notes: pet.notes,
  });
  const [editForm, setEditForm] = useState<PetEditForm>(buildForm);

  const openEdit = () => {
    setEditForm(buildForm());
    setActionError(null);
    setIsEditOpen(true);
  };

  const handleDelete = async () => {
    setBusy(true);
    setActionError(null);
    try {
      await removePet(pet.id);
      onBack();
    } catch (err) {
      setActionError(friendlyMessage(err));
      setBusy(false);
    }
  };

  const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setActionError(null);
    try {
      await updatePet(pet.id, editForm);
      setIsEditOpen(false);
    } catch (err) {
      setActionError(friendlyMessage(err));
    } finally {
      setBusy(false);
    }
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
            onClick={openEdit}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: ACCENT }}
          >
            <Edit3 size={16} strokeWidth={2} /> Editar
          </button>
          <button
            onClick={() => { setActionError(null); setIsDeleteOpen(true); }}
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
              {pet.photo ? <img src={pet.photo} alt={pet.name} className="w-full h-full rounded-2xl object-cover" /> : SPECIES_EMOJI[pet.species]}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-extrabold text-gray-900">{pet.name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {pet.speciesLabel} · {pet.breed} · {pet.gender}
              </p>
              <p className="text-sm text-gray-500">
                {pet.ageLabel} · Nacimiento: {pet.birthdateLabel}
              </p>
              {pet.weightGrams && <p className="text-sm text-gray-500">Peso: {(pet.weightGrams / 1000).toFixed(1)} kg</p>}
              {badge && (
                <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full ${badge.bg} ${badge.text}`}>
                  {badge.label}
                </span>
              )}
            </div>
          </div>

          {/* Tabs internos */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-100">
              {TABS.map(({ id, label, Icon }) => (
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
                pet.vaccines.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-6">Aún no hay vacunas registradas</p>
                ) : (
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
                          const st = VACCINE_STATUS[v.status];
                          return (
                            <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                              <td className="py-3 font-semibold text-gray-800">{v.name}</td>
                              <td className="py-3 text-gray-500">{v.date}</td>
                              <td className="py-3 text-gray-500">{v.nextDue}</td>
                              <td className="py-3">
                                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full ${st.bg} ${st.text}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                  {st.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              )}

              {tab === 'diet' && (
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notas (alergias, necesidades, conducta)</h3>
                  {pet.notes ? (
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 leading-relaxed whitespace-pre-line">{pet.notes}</p>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-6">Aún no hay notas registradas</p>
                  )}
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
            Esta acción es irreversible: se eliminará el perfil de la mascota.
          </p>
          {actionError && <p role="alert" className="text-sm font-medium text-red-600">{actionError}</p>}
          <div className="flex gap-3 w-full mt-4">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="flex-1 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={busy}
              className="flex-1 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-xl transition-all"
            >
              {busy ? 'Eliminando…' : 'Sí, Eliminar'}
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
              <label htmlFor="pet-edit-species" className="text-sm font-bold text-gray-700 ml-1">Especie</label>
              <select id="pet-edit-species" 
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all appearance-none"
                value={editForm.species}
                onChange={(e) => {
                  const species = speciesSchema.safeParse(e.target.value);
                  if (species.success) setEditForm({ ...editForm, species: species.data });
                }}
              >
                <option value="dog">Perro</option>
                <option value="cat">Gato</option>
                <option value="bird">Ave</option>
                <option value="exotic">Exótico</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <Input 
              label="Raza" 
              value={editForm.breed} 
              onChange={(e) => setEditForm({...editForm, breed: e.target.value})} 
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="pet-edit-gender" className="text-sm font-bold text-gray-700 ml-1">Género</label>
              <select id="pet-edit-gender" 
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all appearance-none"
                value={editForm.gender}
                onChange={(e) => {
                  const gender = genderSchema.safeParse(e.target.value);
                  if (gender.success) setEditForm({ ...editForm, gender: gender.data });
                }}
              >
                <option value="male">Macho</option>
                <option value="female">Hembra</option>
                <option value="unknown">Sin especificar</option>
              </select>
            </div>
            <Input 
              type="date"
              label="Fecha de Nacimiento" 
              max={new Date().toISOString().slice(0, 10)}
              value={editForm.birthdate} 
              onChange={(e) => setEditForm({...editForm, birthdate: e.target.value})} 
            />
          </div>
          
          <div className="flex flex-col gap-1.5 mt-2">
            <label htmlFor="pet-notes" className="text-sm font-bold text-gray-700 ml-1">Notas (alergias, necesidades especiales, conducta)</label>
            <textarea
              id="pet-notes"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none"
              rows={4}
              maxLength={PET_NOTES_MAX}
              value={editForm.notes}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
            ></textarea>
            <span className="text-xs text-gray-400 text-right">{editForm.notes.length}/{PET_NOTES_MAX}</span>
          </div>

          {actionError && <p role="alert" className="text-sm font-medium text-red-600">{actionError}</p>}

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
              disabled={busy}
              className="px-6 py-3 text-sm font-bold text-white rounded-xl transition-all hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
              style={{ backgroundColor: ACCENT }}
            >
              <CheckCircle2 size={18} strokeWidth={2} /> {busy ? 'Guardando…' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ─── PetsManager Principal ────────────────────────────────────────────────────
interface PetsManagerProps {
  pets: UiPet[];
  status?: PetsStatus;
  error?: string | null;
  onRetry?: () => void;
  reservations: MockReservation[];
}

export default function PetsManager({ pets, status = 'ready', error = null, onRetry, reservations }: PetsManagerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigate = useNavigate();

  // La mascota seleccionada se toma de la lista del store: así refleja las ediciones.
  const selectedPet = selectedId ? pets.find((p) => p.id === selectedId) ?? null : null;

  const activeReservation = selectedPet
    ? reservations.find((r) => r.petId === selectedPet.id && r.status === 'in_progress') ?? null
    : null;

  if (selectedPet) {
    return (
      <PetDetail
        pet={selectedPet}
        onBack={() => setSelectedId(null)}
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

      {status === 'loading' && pets.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" role="status" aria-label="Cargando mascotas">
          {[0, 1, 2].map((i) => <div key={i} className="h-64 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      )}

      {status === 'error' && (
        <div role="alert" className="bg-white border border-red-100 rounded-2xl p-8 text-center">
          <p className="text-sm font-medium text-red-600 mb-4">{error}</p>
          <button onClick={onRetry} className="px-5 py-2.5 text-sm font-bold text-white rounded-xl" style={{ backgroundColor: ACCENT }}>
            Reintentar
          </button>
        </div>
      )}

      {status === 'ready' && pets.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
          <p className="text-3xl mb-3" aria-hidden="true">🐾</p>
          <h2 className="text-lg font-bold text-gray-900">Aún no tienes mascotas registradas</h2>
          <p className="text-sm text-gray-500 mt-1">Añade a tu primera mascota para empezar.</p>
        </div>
      )}

      {pets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} onSelect={(p) => setSelectedId(p.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
