import type { Config } from '../config/env.js';
import { formatCredentials, seedDemoCatalog, seedDemoData, shouldSeed, type SeedTargets } from './demoData.js';

/**
 * Decide qué sembrar al arrancar y evita sembrar dos veces:
 * - SEED_DEMO_DATA=true (nunca en producción): usuarios de cada rol, catálogo y mascotas;
 *   imprime las contraseñas aleatorias una sola vez.
 * - DEMO_MODE=true (también en producción): solo el catálogo, sin imprimir nada sensible.
 */
export async function applySeed(config: Config, targets: SeedTargets): Promise<void> {
  if (shouldSeed(config)) {
    console.log(formatCredentials(await seedDemoData(targets, config.bcryptCost)));
    return;
  }
  if (config.seedDemoData) {
    console.warn('SEED_DEMO_DATA=true se ignora porque NODE_ENV=production.');
  }
  if (config.demoMode) {
    await seedDemoCatalog(targets, config.bcryptCost);
    console.log('Modo demo: catálogo de ejemplo cargado.');
  }
}
