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
| `SEED_DEMO_DATA` | No | `true` carga datos de ejemplo al arrancar (ver abajo). Por defecto no. |
| `DEMO_MODE` | No | `true` siembra **solo el catálogo** (12 items bajo un proveedor demo). Válido también en producción; ideal para la demo pública. |
| `MAX_USERS` | No | Tope total de usuarios (1000 por defecto). Al alcanzarlo, `POST /auth/register` responde 503. |
| `NODE_ENV` | No | `development` por defecto. Con `production` el seed no se ejecuta aunque `SEED_DEMO_DATA=true`. |
| `TRUST_PROXY` | No | Saltos de proxy de confianza (0 por defecto). Pon `1` detrás de Render, Vercel o nginx; con `0` se ignora `X-Forwarded-For`. |
| `PORT` | No | Puerto HTTP. Por defecto 3000. |

`npm run dev` carga `.env` solo en desarrollo (`--env-file-if-exists`); con `npm start` (producción) las variables deben venir del entorno.

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
npm run dev               # en desarrollo Node carga .env automáticamente
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

## Datos de ejemplo (opcional)

Con `SEED_DEMO_DATA=true` (y `NODE_ENV` distinto de `production`) el arranque crea un admin, dos proveedores y un cliente, 12 items (productos y servicios en soles) y 2 mascotas del cliente. Las **contraseñas son aleatorias, distintas en cada arranque y se imprimen una sola vez** en la consola; no hay contraseñas fijas en el código. Como los datos están en memoria, desaparecen al reiniciar.

```bash
SEED_DEMO_DATA=true npm run dev
```

### Modo demo público (`DEMO_MODE=true`)

Pensado para desplegar una demo abierta. Al arrancar siembra únicamente el catálogo (los mismos 12 items) bajo un proveedor demo. La contraseña de ese proveedor se genera al azar, **no se imprime ni se registra** y no se conserva: nadie puede iniciar sesión con él. No se crea admin ni cliente; cada visitante se registra solo. A diferencia de `SEED_DEMO_DATA`, funciona con `NODE_ENV=production`. Si ambas variables están activas fuera de producción solo corre el seed completo (no se siembra dos veces).

## Probar el catálogo, mascotas y pedidos

```bash
API=http://localhost:3000/api/v1
# Login del cliente con la contraseña impresa por el seed
TOKEN=$(curl -s -X POST $API/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"cliente@demo.kunapet.test","password":"<la-impresa>"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).token')

curl -s "$API/items?type=service&q=bano&limit=5"                      # público, sin tildes
curl -s -X POST $API/orders -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"items":[{"itemId":"<id-de-un-item>","quantity":2}],"paymentMethod":"yape"}'
curl -s $API/pets -H "Authorization: Bearer $TOKEN"
```

## Decisiones de seguridad

- **JWT**: HS256 fijado al firmar y al verificar (evita `alg: none` y confusión de algoritmos), expira en 1 h, payload `{ sub, role }`.
- **`authenticate` recarga al usuario** del repositorio en cada petición: un usuario eliminado deja de entrar aunque su token siga vigente, y el rol efectivo es el del repositorio, no el del token.
- **Contraseñas**: bcryptjs (JS puro), costo configurable, 8–72 caracteres y como máximo 72 **bytes** (bcrypt trunca ahí).
- **Login**: email inexistente y contraseña errónea dan la misma respuesta; para el email inexistente se compara contra un hash ficticio para igualar tiempos. Límite de 10 intentos por IP+email cada 15 minutos (429).
- **Registro**: máximo 10 registros por IP cada hora (429) y tope total `MAX_USERS` (503), para proteger la memoria de una demo pública.
- **Registro**: solo `client` y `provider`; `admin` se rechaza siempre. Email en minúsculas y único.
- **Errores**: formato uniforme `{ error: { code, message, details? } }`; sin stack traces ni mensajes internos.
- **Cabeceras y entrada**: helmet, CORS solo para `CORS_ORIGINS`, body máximo 100 kb.
- **Registros**: no se escriben contraseñas, tokens ni el header `Authorization`.
- Las respuestas de usuario nunca incluyen el hash.

Límites conocidos: el limitador y los datos están en memoria (no sirven con varias instancias); el token no se puede revocar antes de expirar; no hay refresh tokens ni logout en servidor; detrás de un proxy hay que poner `TRUST_PROXY=1` (o los saltos que correspondan); si no, `req.ip` es la IP del proxy y el límite de login se comparte entre todos los usuarios.

## Compatibilidad de dependencias

typescript-eslint 8.x declara `typescript <6.1.0`, por lo que se fija TypeScript `~6.0.3` aunque exista la 7.x. No se usó `--force` ni `--legacy-peer-deps`.

## Siguiente fase

Catálogo (`/items`), mascotas (`/pets`) y pedidos (`/orders`) según el contrato, repositorios persistentes y CI (lint, typecheck, test, build).
