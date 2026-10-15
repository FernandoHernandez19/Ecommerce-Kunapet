import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import type { Config } from './config/env.js';
import { createAuthController } from './controllers/authController.js';
import { createErrorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { createOrderController } from './controllers/orderController.js';
import { createPetController } from './controllers/petController.js';
import { createItemController } from './controllers/itemController.js';
import { createAuthenticate, createOptionalAuthenticate } from './middleware/auth.js';
import { createLoginLimiter, createRegisterLimiter } from './middleware/rateLimiter.js';
import { InMemoryItemRepository, type ItemRepository } from './repositories/ItemRepository.js';
import { InMemoryOrderRepository, type OrderRepository } from './repositories/OrderRepository.js';
import { InMemoryPetRepository, type PetRepository } from './repositories/PetRepository.js';
import { InMemoryUserRepository, type UserRepository } from './repositories/UserRepository.js';
import { authRouter } from './routes/auth.js';
import { itemsRouter } from './routes/items.js';
import { ordersRouter } from './routes/orders.js';
import { petsRouter } from './routes/pets.js';
import { healthRouter } from './routes/health.js';
import { CatalogService } from './services/CatalogService.js';
import { OrderService } from './services/OrderService.js';
import { PetService } from './services/PetService.js';
import { AuthService } from './services/AuthService.js';
import { TokenService } from './services/TokenService.js';

export const API_PREFIX = '/api/v1';

export interface AppDependencies {
  userRepository: UserRepository;
  itemRepository: ItemRepository;
  petRepository: PetRepository;
  orderRepository: OrderRepository;
}

export function createApp(config: Config, deps: Partial<AppDependencies> = {}): Express {
  const userRepository = deps.userRepository ?? new InMemoryUserRepository();
  const itemRepository = deps.itemRepository ?? new InMemoryItemRepository();
  const petRepository = deps.petRepository ?? new InMemoryPetRepository();
  const orderRepository = deps.orderRepository ?? new InMemoryOrderRepository();
  const tokenService = new TokenService(config.jwtSecret);
  const authService = new AuthService(userRepository, tokenService, config.bcryptCost, config.maxUsers);
  const authenticate = createAuthenticate(tokenService, userRepository);
  const optionalAuthenticate = createOptionalAuthenticate(tokenService, userRepository);
  const catalogService = new CatalogService(itemRepository, userRepository);

  const app = express();
  app.disable('x-powered-by');
  // Sin esto, detrás de un proxy req.ip es la IP del proxy y el límite de login se comparte entre todos.
  app.set('trust proxy', config.trustProxy);

  app.use(helmet());
  app.use(
    cors({
      // Solo los orígenes listados; las peticiones sin Origin (curl, server a server) no necesitan CORS.
      origin: (origin, callback) => {
        callback(null, origin !== undefined && config.corsOrigins.includes(origin) ? origin : false);
      },
    }),
  );
  app.use(express.json({ limit: '100kb' }));

  const api = express.Router();
  api.use(healthRouter());
  api.use('/auth', authRouter(createAuthController(authService, createLoginLimiter(), createRegisterLimiter()), authenticate));
  api.use('/items', optionalAuthenticate, itemsRouter(createItemController(catalogService), authenticate));
  api.use('/pets', petsRouter(createPetController(new PetService(petRepository)), authenticate));
  api.use('/orders', ordersRouter(createOrderController(new OrderService(orderRepository, itemRepository)), authenticate));
  app.use(API_PREFIX, api);

  app.use(notFoundHandler);
  app.use(createErrorHandler());
  return app;
}
