import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import type { Config } from './config/env.js';
import { createAuthController } from './controllers/authController.js';
import { createErrorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { createAuthenticate } from './middleware/auth.js';
import { LoginRateLimiter } from './middleware/loginRateLimiter.js';
import { InMemoryUserRepository, type UserRepository } from './repositories/UserRepository.js';
import { authRouter } from './routes/auth.js';
import { healthRouter } from './routes/health.js';
import { AuthService } from './services/AuthService.js';
import { TokenService } from './services/TokenService.js';

export const API_PREFIX = '/api/v1';

export interface AppDependencies {
  userRepository: UserRepository;
}

export function createApp(config: Config, deps: Partial<AppDependencies> = {}): Express {
  const userRepository = deps.userRepository ?? new InMemoryUserRepository();
  const tokenService = new TokenService(config.jwtSecret);
  const authService = new AuthService(userRepository, tokenService, config.bcryptCost);
  const authenticate = createAuthenticate(tokenService, userRepository);

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
  api.use('/auth', authRouter(createAuthController(authService, new LoginRateLimiter()), authenticate));
  app.use(API_PREFIX, api);

  app.use(notFoundHandler);
  app.use(createErrorHandler());
  return app;
}
