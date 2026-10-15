/** Estado del formulario del asistente de alta de mascota (AddPetWizard). */
export interface PetWizardForm {
  name: string;
  species: '' | 'perro' | 'gato' | 'otro';
  breed: string;
  /** Fecha de nacimiento YYYY-MM-DD. */
  dob: string;
  /** Peso en kg, tal como lo escribe el usuario. */
  weight: string;
  isSterilized: boolean;
  vaccines: string[];
  allergies: string;
  specialNeeds: string;
}

/** Actualiza un campo del formulario conservando el tipo de cada uno. */
export type UpdatePetField = <K extends keyof PetWizardForm>(field: K, value: PetWizardForm[K]) => void;

/** Estado del paso «Comportamiento» (página StepBehaviorPage, que puede usarse suelta). */
export interface BehaviorFormData {
  name?: string;
  breed?: string;
  age?: string;
  photo?: string | null;
  traits?: string[];
  bio?: string;
}
