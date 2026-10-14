/** Minúsculas y sin tildes/diacríticos, para comparar texto sin distinguir "Baño" de "bano". */
export function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}
