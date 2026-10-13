# KunaPet — Servidor (API)

Backend Express 5 + TypeScript con autenticación JWT y roles (`client`, `provider`, `admin`). El contrato completo está en [`../docs/api-contract.md`](../docs/api-contract.md).

> Estado: fase base. Solo existen `GET /api/v1/health`, `POST /auth/register`, `POST /auth/login` y `GET /auth/me`. Los datos viven **en memoria** y se pierden al reiniciar.

## Requisitos

- Node.js **>= 22.12** (ver `.nvmrc` en la raíz del repo).
- npm 10+.

## Variables de entorno

Copia `.env.example` a `.env` y complétalo. `.env` está ignorado por git; nunca lo subas.

| Variable | Obligatoria | Descripción |
|---|---|---|
| `JWT_SECRET` | Sí | Mínimo 32 caracteres. Si falta o es corto, el servidor **no arranca**. |
| `BCRYPT_COST` | No | Costo de bcrypt (4–15). Por defecto 10. |
| `CORS_ORIGINS` | No | Orígenes permitidos separados por comas (p. ej. el de Vite). Vacío = ninguno. |
| `PORT` | No | Puerto HTTP. Por defecto 3000. |

Para generar un secreto localmente:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Arranca con recarga (`tsx watch`). |
| `npm run build` | Compila a `dist/`. |
| `npm start` | Ejecuta `dist/index.js`. |
| `npm run lint` | ESLint + typescript-eslint. |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm test` | Vitest + Supertest. |

## Estructura

```
server/
├── src/
│   ├── app.ts            # createApp(config, deps): arma Express sin escuchar el puerto
│   ├── index.ts          # lee el entorno y hace listen()
│   ├── config/env.ts     # validación de variables con zod
│   ├── errors/           # AppError y subclases + parseOrThrow (zod → 400)
│   ├── middleware/       # auth (authenticate, requireRole), errorHandler, loginRateLimiter
│   ├── routes/           # rutas → controladores
│   ├── controllers/      # validan la entrada y llaman al servicio
│   ├── services/         # lógica (AuthService, TokenService)
│   ├── repositories/     # interfaces + implementación en memoria
│   └── types/
└── test/                 # pruebas sobre createApp()
```

Capas: `routes → controllers → services → repositories`. Los repositorios son interfaces; hoy se implementan en memoria para poder cambiarlos por una base de datos sin tocar el resto.

## Probar con curl

```bash
cd server
npm ci
cp .env.example .env      # edita JWT_SECRET (32+ caracteres) y CORS_ORIGINS
set -a; . ./.env; set +a  # carga las variables en la sesión
npm run dev
```

En otra terminal:

```bash
# Registro (201). El rol solo puede ser client o provider.
curl -s -X POST http://localhost:3000/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Camila Rodríguez","email":"camila@kunapet.com","password":"UnaClaveLarga123","role":"client"}'

# Login (200): devuelve { user, token, expiresIn }
curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"camila@kunapet.com","password":"UnaClaveLarga123"}'

# Perfil, con el token recibido
curl -s http://localhost:3000/api/v1/auth/me -H "Authorization: Bearer <token>"
```

## Decisiones de seguridad

- **JWT**: HS256 fijado al firmar y al verificar (evita `alg: none` y confusión de algoritmos), expira en 1 h, payload `{ sub, role }`.
- **`authenticate` recarga al usuario** del repositorio en cada petición: un usuario eliminado deja de entrar aunque su token siga vigente, y el rol efectivo es el del repositorio, no el del token.
- **Contraseñas**: bcryptjs (JS puro), costo configurable, 8–72 caracteres y como máximo 72 **bytes** (bcrypt trunca ahí).
- **Login**: email inexistente y contraseña errónea dan la misma respuesta; para el email inexistente se compara contra un hash ficticio para igualar tiempos. Límite de 10 intentos por IP+email cada 15 minutos (429).
- **Registro**: solo `client` y `provider`; `admin` se rechaza siempre. Email en minúsculas y único.
- **Errores**: formato uniforme `{ error: { code, message, details? } }`; sin stack traces ni mensajes internos.
- **Cabeceras y entrada**: helmet, CORS solo para `CORS_ORIGINS`, body máximo 100 kb.
- **Registros**: no se escriben contraseñas, tokens ni el header `Authorization`.
- Las respuestas de usuario nunca incluyen el hash.

Límites conocidos: el limitador y los datos están en memoria (no sirven con varias instancias); el token no se puede revocar antes de expirar; no hay refresh tokens ni logout en servidor; detrás de un proxy hay que configurar `trust proxy` para que la IP sea la real.

## Compatibilidad de dependencias

typescript-eslint 8.x declara `typescript <6.1.0`, por lo que se fija TypeScript `~6.0.3` aunque exista la 7.x. No se usó `--force` ni `--legacy-peer-deps`.

## Siguiente fase

Catálogo (`/items`), mascotas (`/pets`) y pedidos (`/orders`) según el contrato, repositorios persistentes y CI (lint, typecheck, test, build).
