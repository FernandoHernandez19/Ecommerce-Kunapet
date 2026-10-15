/** Mascota con el formato antiguo de las tarjetas de Dashboard/* (no es el tipo de la API). */
export interface DashboardPet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  status: 'warning' | 'success' | string;
  nextVaccine: string;
  photoUrl?: string | null;
}

/** Actividad con el formato antiguo de la línea de tiempo (estados en mayúsculas). */
export interface DashboardActivity {
  id: string;
  time: string;
  title: string;
  details: string;
  status: 'EN CURSO' | 'COMPLETADO' | 'ENTREGADO' | string;
}
