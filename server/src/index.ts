import { createApp } from './app.js';
import { ConfigError, loadConfig } from './config/env.js';

try {
  const config = loadConfig();
  createApp(config).listen(config.port, () => {
    console.log(`KunaPet API escuchando en el puerto ${config.port}`);
  });
} catch (err) {
  if (err instanceof ConfigError) {
    console.error(err.message);
  } else {
    console.error('No se pudo iniciar el servidor.');
  }
  process.exit(1);
}
