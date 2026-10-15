import { createApp } from './app.js';
import { ConfigError, loadConfig } from './config/env.js';
import { InMemoryItemRepository } from './repositories/ItemRepository.js';
import { InMemoryOrderRepository } from './repositories/OrderRepository.js';
import { InMemoryPetRepository } from './repositories/PetRepository.js';
import { InMemoryUserRepository } from './repositories/UserRepository.js';
import { applySeed } from './seed/index.js';

async function main(): Promise<void> {
  const config = loadConfig();
  const userRepository = new InMemoryUserRepository();
  const itemRepository = new InMemoryItemRepository();
  const petRepository = new InMemoryPetRepository();
  const orderRepository = new InMemoryOrderRepository();

  await applySeed(config, { users: userRepository, items: itemRepository, pets: petRepository });

  createApp(config, { userRepository, itemRepository, petRepository, orderRepository }).listen(config.port, () => {
    console.log(`KunaPet API escuchando en el puerto ${config.port}`);
  });
}

main().catch((err: unknown) => {
  if (err instanceof ConfigError) {
    console.error(err.message);
  } else {
    console.error('No se pudo iniciar el servidor.');
  }
  process.exit(1);
});
