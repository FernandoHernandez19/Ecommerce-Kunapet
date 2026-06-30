import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../Provider/ImageUploader';
import Input from '../ui/Input';
import Button from '../ui/Button';

// Ícono persona
const PersonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

// Ícono teléfono
const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3" />
  </svg>
);

// Ícono ciudad
const CityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

const CIUDADES = [
  'Lima', 'Miraflores', 'San Isidro', 'Barranco', 'Surco',
  'La Molina', 'San Borja', 'Jesús María', 'Lince', 'Pueblo Libre',
  'Arequipa', 'Trujillo', 'Cusco', 'Piura', 'Chiclayo',
];

export default function StepClientProfile({ formData, updateData, onNext }) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName?.trim())
      newErrors.fullName = 'El nombre completo es obligatorio.';
    if (!formData.phone?.trim())
      newErrors.phone = 'El teléfono es obligatorio.';
    else if (!/^[0-9\s+\-()]{7,15}$/.test(formData.phone.trim()))
      newErrors.phone = 'Ingresa un número de teléfono válido.';
    if (!formData.city)
      newErrors.city = 'Selecciona tu ciudad.';
    return newErrors;
  };

  const handleNext = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    onNext();
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100 relative overflow-hidden animate-fade-in-up">
      {/* Marca de agua */}
      <div className="absolute -right-8 -top-8 text-[#2D6A4F]/5 pointer-events-none select-none z-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-52 h-52">
          <path d="M11.999 4c-1.528 0-2.813 1.053-3.155 2.505-.187.795-.916 1.353-1.72 1.393-1.637.08-2.95 1.393-3.03 3.03-.04.804-.598 1.533-1.393 1.72C1.249 13.01 2.222 14.5 3.75 14.5c.328 0 .644-.06.94-.17a2.531 2.531 0 0 0 1.258-1.258c.11-.296.17-.612.17-.94 0-1.785 1.448-3.233 3.233-3.233 1.785 0 3.232 1.448 3.232 3.232 0 .328.06.644.17.94a2.532 2.532 0 0 0 1.259 1.258c.296.11.612.17.94.17 1.528 0 2.501-1.49 2.048-2.905-.187-.795-.745-1.533-1.393-1.72-.08-1.637-1.393-2.95-3.03-3.03-.804-.04-1.533-.598-1.72-1.393C14.812 5.053 13.527 4 11.999 4Z" />
          <path d="M12 14.5c-3.038 0-5.5 2.462-5.5 5.5h11c0-3.038-2.462-5.5-5.5-5.5Z" />
        </svg>
      </div>

      <div className="relative z-10 mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900">Perfil Personal</h2>
        <p className="text-sm text-gray-500 mt-2 font-medium">
          Cuéntanos sobre ti. Esta información nos ayudará a personalizar tu experiencia.
        </p>
      </div>

      <form className="relative z-10 flex flex-col gap-6">
        {/* Foto de perfil */}
        <ImageUploader onImageSelect={(file) => updateData('image', file)} />

        {/* Nombre Completo */}
        <Input
          id="client-fullname"
          label="Nombre Completo"
          required
          placeholder="Ej. Juan Pérez"
          value={formData.fullName}
          onChange={(e) => updateData('fullName', e.target.value)}
          leftIcon={<PersonIcon />}
          error={errors.fullName}
        />

        {/* Teléfono */}
        <Input
          id="client-phone"
          label="Teléfono móvil"
          required
          placeholder="Ej. 999 999 999"
          value={formData.phone}
          onChange={(e) => updateData('phone', e.target.value)}
          leftIcon={<PhoneIcon />}
          error={errors.phone}
        />

        {/* Ciudad (select nativo estilizado) */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="client-city" className="text-sm font-semibold text-gray-800 select-none">
            Ciudad <span className="ml-1 text-[#2D6A4F]" aria-hidden="true">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 flex items-center pointer-events-none text-gray-400" aria-hidden="true">
              <CityIcon />
            </span>
            <select
              id="client-city"
              value={formData.city}
              onChange={(e) => updateData('city', e.target.value)}
              className={`w-full bg-gray-100 text-sm rounded-xl border pl-10 pr-4 py-3 appearance-none
                focus:outline-none focus:bg-white focus:ring-2 focus:ring-offset-0 transition-all duration-200
                ${errors.city
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                  : 'border-gray-200 focus:border-[#2D6A4F] focus:ring-[#2D6A4F]/20'
                }
                ${!formData.city ? 'text-gray-400' : 'text-gray-900'}`}
            >
              <option value="">Selecciona tu ciudad</option>
              {CIUDADES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {/* Flecha custom */}
            <span className="absolute right-3.5 pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </div>
          {errors.city && (
            <p role="alert" className="text-xs font-medium text-red-500 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.city}
            </p>
          )}
        </div>

        {/* Acciones */}
        <div className="mt-4 pt-6 border-t border-gray-100 flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate('/select-role')}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="lg"
            rightIcon={<span className="font-bold">→</span>}
            onClick={handleNext}
          >
            Siguiente Paso
          </Button>
        </div>
      </form>
    </div>
  );
}
