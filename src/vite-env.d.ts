/// <reference types="vite/client" />

// Variables de entorno del frontend (docs: .env.example). Siempre string | undefined:
// pueden faltar o venir vacías.
interface ImportMetaEnv {
  readonly VITE_API_URL: string | undefined;
  readonly VITE_ENABLE_GUEST: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
