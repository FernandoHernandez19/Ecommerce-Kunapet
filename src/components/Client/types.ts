/** Estado del formulario de registro de cliente (4 pasos) y tipos de sus mascotas. */

export type ClientPetSpecies = 'dog' | 'cat' | 'other';

/** Mascota capturada en el paso 2 del registro (aún no existe en la API). */
export interface ClientPetDraft {
  id: number;
  photo: File | null;
  photoPreview: string | null;
  species: ClientPetSpecies;
  name: string;
  breed: string;
  gender: string;
  age: string;
  birthdate: string;
}

export type ServiceInterest = 'vet' | 'grooming' | 'walks' | 'daycare';

export interface ClientRegistrationData {
  image: File | null;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  pets: ClientPetDraft[];
  services: ServiceInterest[];
  emailNotif: boolean;
  whatsappNotif: boolean;
}

export type UpdateClientData = <K extends keyof ClientRegistrationData>(field: K, value: ClientRegistrationData[K]) => void;
