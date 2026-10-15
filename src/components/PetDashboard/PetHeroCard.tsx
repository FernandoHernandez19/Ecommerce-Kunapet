import type { UiPet } from '../../api/adapters';
export default function PetHeroCard({ pet, onEdit }: { pet: UiPet; onEdit: () => void }) {
  const weight = pet.weightGrams ? `${(pet.weightGrams / 1000).toFixed(1)} kg` : 'Peso no registrado';
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
      <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4">
        <div className="relative">
          {pet.photo ? (
            <img
              src={pet.photo}
              alt={pet.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-red-50 shadow-inner"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-red-50 bg-gray-50 flex items-center justify-center text-4xl" aria-hidden="true">
              {pet.species === 'cat' ? '🐱' : pet.species === 'dog' ? '🐶' : '🐾'}
            </div>
          )}
          <span className="absolute bottom-0 right-1 bg-brand-primary text-white text-xs p-1 rounded-full shadow-sm">
            🐾
          </span>
        </div>
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-gray-900">{pet.name}</h1>
            <span className="text-xs bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full font-bold">
              {pet.breed}
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium mt-1">
            {pet.ageLabel} • {weight} • {pet.gender}
          </p>
        </div>
      </div>

      <button
        onClick={onEdit}
        className="w-full sm:w-auto px-4 py-2 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
      >
        Editar Perfil
      </button>
    </div>
  );
}
