import React, { useState, useRef } from 'react';
import { Pencil, Trash2, PawPrint, Camera } from 'lucide-react';
import { Button, Input } from '../ui';

// ─── Constantes ────────────────────────────────────────────────────────────────
const ACCENT = '#2D6A4F';

const SPECIES = [
  { id: 'dog',   label: 'Perro', emoji: '🐶' },
  { id: 'cat',   label: 'Gato',  emoji: '🐱' },
  { id: 'other', label: 'Otro',  emoji: '🐾' },
];

const BREEDS = {
  dog:   ['Labrador', 'Golden Retriever', 'Bulldog Francés', 'Poodle', 'Chihuahua', 'Beagle', 'Shih Tzu', 'Otro'],
  cat:   ['Siamés', 'Persa', 'Maine Coon', 'Bengalí', 'Ragdoll', 'Común Europeo', 'Otro'],
  other: ['Conejo', 'Hamster', 'Ave', 'Reptil', 'Pez', 'Otro'],
};

const GENDERS = ['Macho', 'Hembra'];

const EMPTY_FORM = {
  id: null, photo: null, photoPreview: null,
  species: 'dog', name: '', breed: '', gender: '', age: '', birthdate: '',
};

// ─── Sub-componente: Tarjeta de mascota ─────────────────────────────────────
function PetCard({ pet, onEdit, onDelete }) {
  const speciesObj = SPECIES.find((s) => s.id === pet.species) ?? SPECIES[2];
  return (
    <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 group hover:border-[#2D6A4F]/30 transition-all">
      {/* Avatar */}
      <div className="w-14 h-14 rounded-2xl bg-[#2D6A4F]/10 flex items-center justify-center shrink-0 overflow-hidden">
        {pet.photoPreview
          ? <img src={pet.photoPreview} alt={pet.name} className="w-full h-full object-cover" />
          : <span className="text-3xl">{speciesObj.emoji}</span>
        }
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 truncate">{pet.name}</p>
        <p className="text-xs text-gray-400 font-medium mt-0.5">
          {speciesObj.label}
          {pet.breed ? ` · ${pet.breed}` : ''}
          {pet.age ? ` · ${pet.age} año${pet.age !== '1' ? 's' : ''}` : ''}
          {pet.gender ? ` · ${pet.gender}` : ''}
        </p>
      </div>
      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => onEdit(pet)}
          className="p-2 rounded-xl text-gray-400 hover:text-[#2D6A4F] hover:bg-[#2D6A4F]/10 transition-all"
          aria-label="Editar mascota"
        >
          <Pencil size={15} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(pet.id)}
          className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
          aria-label="Eliminar mascota"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── Sub-componente: Formulario de mascota ───────────────────────────────────
function PetForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial, id: initial?.id ?? Date.now() });
  const [errors, setErrors] = useState({});
  const fileRef = useRef();

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    set('photo', file);
    set('photoPreview', URL.createObjectURL(file));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'El nombre es obligatorio.';
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Foto circular */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative w-24 h-24 rounded-full bg-[#2D6A4F]/10 border-2 border-dashed border-[#2D6A4F]/30
            flex items-center justify-center hover:bg-[#2D6A4F]/15 transition-all overflow-hidden group"
          aria-label="Subir foto de mascota"
        >
          {form.photoPreview
            ? <img src={form.photoPreview} alt="preview" className="w-full h-full object-cover" />
            : <PawPrint size={28} className="text-[#2D6A4F]/40" />
          }
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
            <Camera size={20} className="text-white" />
          </div>
        </button>
        <p className="text-xs text-gray-400 font-medium">Foto de la mascota (opcional)</p>
        <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={handlePhoto} />
      </div>

      {/* Especie */}
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-3">Especie <span style={{ color: ACCENT }}>*</span></p>
        <div className="grid grid-cols-3 gap-3">
          {SPECIES.map((s) => {
            const active = form.species === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => { set('species', s.id); set('breed', ''); }}
                className={`flex flex-col items-center gap-2 py-4 rounded-2xl border-2 font-bold text-sm transition-all ${
                  active
                    ? 'border-[#2D6A4F] bg-[#2D6A4F]/8 text-[#2D6A4F]'
                    : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
                }`}
                style={active ? { backgroundColor: `${ACCENT}12`, borderColor: ACCENT, color: ACCENT } : {}}
              >
                <span className="text-3xl">{s.emoji}</span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nombre */}
      <Input
        id="pet-name"
        label="Nombre"
        required
        placeholder="Ej. Max, Luna, Simba…"
        value={form.name}
        onChange={(e) => set('name', e.target.value)}
        error={errors.name}
      />

      {/* Raza */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="pet-breed" className="text-sm font-semibold text-gray-800">Raza</label>
        <select
          id="pet-breed"
          value={form.breed}
          onChange={(e) => set('breed', e.target.value)}
          className="w-full bg-gray-100 text-sm rounded-xl border border-gray-200 px-4 py-3 appearance-none
            focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] transition-all text-gray-900"
        >
          <option value="">Selecciona una raza…</option>
          {(BREEDS[form.species] ?? []).map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* Sexo — Radios estilizados */}
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-3">Sexo</p>
        <div className="flex gap-3">
          {GENDERS.map((g) => {
            const active = form.gender === g;
            return (
              <label
                key={g}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 cursor-pointer transition-all flex-1 justify-center font-semibold text-sm ${
                  active
                    ? 'text-white'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                }`}
                style={active ? { backgroundColor: ACCENT, borderColor: ACCENT, color: '#fff' } : {}}
              >
                <input
                  type="radio"
                  name="pet-gender"
                  value={g}
                  checked={active}
                  onChange={() => set('gender', g)}
                  className="sr-only"
                />
                <span>{g === 'Macho' ? '♂' : '♀'}</span>
                <span>{g}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Edad + Fecha de Nacimiento */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="pet-age"
          label="Edad (años)"
          type="number"
          min="0"
          max="30"
          placeholder="Ej. 3"
          value={form.age}
          onChange={(e) => set('age', e.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="pet-birthdate" className="text-sm font-semibold text-gray-800">Fecha de Nacimiento</label>
          <input
            id="pet-birthdate"
            type="date"
            value={form.birthdate}
            onChange={(e) => set('birthdate', e.target.value)}
            className="w-full bg-gray-100 text-sm rounded-xl border border-gray-200 px-4 py-3
              focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] transition-all text-gray-900"
          />
        </div>
      </div>

      {/* Footer del formulario */}
      <div className="pt-5 border-t border-gray-100 flex justify-between items-center">
        <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleSave}
          rightIcon={<PawPrint size={16} />}
        >
          Guardar Mascota
        </Button>
      </div>
    </div>
  );
}

// ─── Componente Principal: Step 2 ────────────────────────────────────────────
export default function StepClientPets({ formData, updateData, onNext, onBack }) {
  const pets = formData.pets ?? [];

  // isFormOpen: false = vista lista | true = vista formulario
  const [isFormOpen, setIsFormOpen] = useState(pets.length === 0);
  const [editingPet, setEditingPet] = useState(null);
  const [listError, setListError] = useState('');

  // ── Persistencia en el estado global ──────────────────────────────────────
  const savePet = (petData) => {
    const exists = pets.some((p) => p.id === petData.id);
    const updated = exists
      ? pets.map((p) => (p.id === petData.id ? petData : p))
      : [...pets, petData];
    updateData('pets', updated);
    setEditingPet(null);
    setIsFormOpen(false);
    setListError('');
  };

  const deletePet = (id) => updateData('pets', pets.filter((p) => p.id !== id));

  const openAdd = () => { setEditingPet(null); setIsFormOpen(true); };
  const openEdit = (pet) => { setEditingPet(pet); setIsFormOpen(true); };
  const closeForm = () => { setEditingPet(null); setIsFormOpen(false); };

  // ── Validación de negocio: al menos 1 mascota ──────────────────────────────
  const handleNext = () => {
    if (pets.length === 0) {
      setListError('Debes añadir al menos una mascota para continuar.');
      return;
    }
    setListError('');
    onNext();
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100 relative overflow-hidden">
      {/* Marca de agua */}
      <div className="absolute -right-8 -top-8 text-[#2D6A4F]/5 pointer-events-none select-none z-0">
        <PawPrint size={200} strokeWidth={1} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900">Mis Mascotas</h2>
          <p className="text-sm text-gray-500 mt-2 font-medium">
            {isFormOpen
              ? (editingPet ? 'Edita los datos de tu mascota.' : 'Cuéntanos sobre tu mascota.')
              : 'Gestiona las mascotas de tu perfil.'
            }
          </p>
        </div>

        {/* ── VISTA: FORMULARIO ─────────────────────────────────────────────── */}
        {isFormOpen ? (
          <PetForm
            initial={editingPet}
            onSave={savePet}
            onCancel={pets.length > 0 ? closeForm : undefined}
          />
        ) : (
          /* ── VISTA: LISTA ─────────────────────────────────────────────────── */
          <div className="flex flex-col gap-4">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} onEdit={openEdit} onDelete={deletePet} />
            ))}

            {/* Botón añadir (dashed) */}
            <button
              type="button"
              onClick={openAdd}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl
                border-2 border-dashed border-gray-300 text-gray-500 font-bold text-sm
                hover:border-[#2D6A4F]/50 hover:text-[#2D6A4F] hover:bg-[#2D6A4F]/5 transition-all"
            >
              <span className="text-xl leading-none">+</span>
              Añadir otra mascota
            </button>

            {/* Error de negocio */}
            {listError && (
              <p role="alert" className="text-xs text-red-500 font-medium flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {listError}
              </p>
            )}

            {/* Navegación global */}
            <div className="mt-4 pt-6 border-t border-gray-100 flex justify-between items-center">
              <Button variant="ghost" onClick={onBack}>← Atrás</Button>
              <Button
                variant="primary"
                size="lg"
                rightIcon={<span className="font-bold">→</span>}
                onClick={handleNext}
              >
                Siguiente Paso
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
