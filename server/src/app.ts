import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import type { Config } from './config/env.js';
import { createErrorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { healthRouter } from './routes/health.js';

export const API_PREFIX = '/api/v1';

export function createApp(config: Config): Express {
  const app = express();
  app.disable('x-powered-by');

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
  app.use(API_PREFIX, api);

  app.use(notFoundHandler);
  app.use(createErrorHandler());
  return app;
}
