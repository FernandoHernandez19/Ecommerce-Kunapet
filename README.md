# KunaPet 🐾 | E-commerce para Mascotas

¡Bienvenido a KunaPet! Este proyecto es un e-commerce moderno desarrollado desde cero, diseñado específicamente para ofrecer una experiencia de usuario fluida, rápida y completamente responsiva en la compra de productos para mascotas.

## 🚀  Migración 
Como parte de mi crecimiento profesional y buscando alineamiento con los estándares actuales de la industria, este proyecto pasó por un proceso de refactorización profunda:
*   **De Legacy a Moderno:** Migrado exitosamente de *Create React App (CRA)* a **Vite**, reduciendo los tiempos de recarga en desarrollo a milisegundos y optimizando el bundle de producción.
*   **Evolución de Estilos:** Reemplacé *Bootstrap* por **Tailwind CSS**, adoptando un enfoque de clases utilitarias que elimina el CSS redundante y permite un diseño *Mobile-First* 100% personalizado.

## 🛠️ Stack Tecnológico
*   **Frontend:** React (Hooks, Zustand (auth, carrito, mascotas), Estado actual: frontend completo con datos mock en src/data y src/services)
*   **Backend:** Node.js + Express 5 + TypeScript, con JWT y roles (ver la sección [Backend](#-backend))
*   **Estilos:** Tailwind CSS (Diseño Responsivo & Custom UI)
*   **Herramienta de Construcción:** Vite
*   **Control de Versiones:** Git & GitHub (Siguiendo la convención de Git Commits)

## ✨ Características Principales
*   **Diseño Mobile-First:** Interfaz optimizada para una navegación perfecta en dispositivos móviles y de escritorio.
*   **Catálogo Dinámico:** Visualización limpia de productos con maquetación moderna.
*   **Arquitectura Limpia:** Separación estricta entre componentes de interfaz (UI) y lógica de negocio.

## 🔧 Instalación Local

Si deseas ejecutar este proyecto en tu entorno local, sigue estos pasos:

1. Clonar el repositorio e instalar dependencias (Node 22, ver `.nvmrc`):
```bash
git clone https://github.com/FernandoHernandez19/Ecommerce-Kunapet.git
cd Ecommerce-Kunapet
npm ci
```

2. Levantar el frontend:
```bash
cp .env.example .env.local   # opcional: define VITE_API_URL si la API no está en localhost:3000
npm run dev
npm test                     # pruebas del frontend (Vitest + Testing Library, sin red real)
npm run typecheck            # verificación de tipos (tsc --noEmit)
npm run lint                 # ESLint (TypeScript, hooks de React y accesibilidad); lint:fix corrige lo automático
```

## 🧩 Backend

El backend vive en [`server/`](server/) y expone una API REST bajo `/api/v1`.

**Qué hay hoy**
*   Autenticación con JWT (HS256, 1 h) y roles `client`, `provider` y `admin`.
*   Catálogo de productos y servicios con filtros, búsqueda y paginación; el proveedor gestiona solo los suyos.
*   Mascotas y pedidos del cliente, con autorización por propietario. El servidor calcula los totales (envío y comisión) y nunca confía en precios enviados por el cliente.
*   Datos en memoria detrás de interfaces de repositorio, y datos de ejemplo opcionales para desarrollo.

### Qué parte del frontend usa la API

| Pantalla | Estado |
|---|---|
| Registro, login, sesión (`/auth/*`) | ✅ API real |
| Marketplace y detalle de item (`/items`) | ✅ API real: filtros, búsqueda y «Cargar más» en el servidor |
| Carrito y checkout (`POST /orders`) | ✅ API real: se envía solo `itemId`, `quantity` y `paymentMethod`; los importes de la pantalla de éxito son los del servidor (los del carrito son una *estimación*) |
| Mis pedidos y detalle (`/orders`) | ✅ API real |
| Mis mascotas y alta de mascota (`/pets`) | ✅ API real (sin vacunas ni historial: «Aún no hay vacunas registradas») |
| Gestión de servicios del proveedor (`/items`) | ✅ API real: crear, editar, activar/desactivar y acciones masivas con `PATCH` secuenciales (máx. 20) |
| Reservas, mensajes, notificaciones, reseñas, direcciones y métodos de pago, actividad reciente y métricas del panel del proveedor | 🟡 **Datos de ejemplo**: la API todavía no los ofrece y la interfaz lo rotula «Datos de ejemplo» (ver `src/data/mockData.ts` y [`docs/api-contract.md`](docs/api-contract.md) §7.1) |

Una capa de **adaptadores** (`src/api/adapters.ts`, funciones puras con pruebas) traduce entre el contrato (céntimos, fechas ISO, enums en inglés) y la forma que esperan los componentes.

**Cómo correrlo**
```bash
cd server
npm ci
cp .env.example .env   # define JWT_SECRET (32+ caracteres)
npm run dev
```
Guía completa en [`server/README.md`](server/README.md). El contrato de la API (la fuente de verdad) está en [`docs/api-contract.md`](docs/api-contract.md).

**Correr todo en local**
```bash
# Terminal 1 — API con el catálogo de ejemplo (los usuarios se registran solos)
cd server && npm ci
cp .env.example .env     # define JWT_SECRET (32+ caracteres) y CORS_ORIGINS=http://localhost:5173
DEMO_MODE=true npm run dev

# Terminal 2 — frontend
npm ci && npm run dev    # http://localhost:5173
```

**CI:** el workflow [`ci.yml`](.github/workflows/ci.yml) corre en cada pull request y en cada push a `main`, con dos jobs: *frontend* (`npm ci`, `npm run lint`, `npm run typecheck`, `npm test` y `npm run build`) y *server* (lint, typecheck, test y build).

**Próximos pasos**
*   Base de datos real (reemplazando los repositorios en memoria).
*   Pagos reales y transiciones de estado de los pedidos (hoy nacen `pending_payment`).
*   Reservas con fecha, mensajes, notificaciones, reseñas, direcciones y reclamos.
*   Cookies `httpOnly` en lugar de `localStorage` para el token.

## 🟦 TypeScript y calidad del frontend

Todo el frontend está en **TypeScript** (`.ts`/`.tsx`; solo los archivos de configuración de Vite/Vitest/Tailwind/ESLint siguen siendo `.js`). `tsconfig.json` activa `strict` y además `noUncheckedIndexedAccess`, `noImplicitOverride` y `noFallthroughCasesInSwitch`; ya no hay `allowJs`. El alias `@/*` → `src/*` está disponible en tsconfig, Vite y Vitest.

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # ESLint 9 (config plana en eslint.config.js)
npm run lint:fix    # aplica las correcciones automáticas
```

Convenciones del código tipado:
*   Las props se declaran con `interface`/`type` explícitos (sin `React.FC`, sin `any`, sin `@ts-ignore`).
*   Los eventos de formulario llevan su tipo (`ChangeEvent<HTMLInputElement>`, `FormEvent<HTMLFormElement>`…) y cada formulario tiene su propio tipo de estado.
*   Los estados de carga son uniones discriminadas (`{ status: 'loading' } | { status: 'error' } | { status: 'success' }`), por ejemplo en `useApiResource` y el catálogo.
*   Los datos de ejemplo (`src/data/mockData.ts`) tienen tipos propios; los de la API se derivan de los esquemas zod.

**ESLint** combina `typescript-eslint` (recomendado), `react-hooks` (`rules-of-hooks` como error, `exhaustive-deps` como aviso), `react-refresh`, `jsx-a11y` (recomendado) y reglas propias: `no-explicit-any` es error y `no-console` avisa (solo se permite `console.error`). El CI ejecuta lint, typecheck, test y build.

**Pruebas de interfaz.** Los componentes críticos (login, carrito, checkout, asistente de mascotas, marketplace, gestión de servicios) se prueban con Testing Library consultando por **rol y texto accesible** —nunca por clases— y con `fetch` simulado (jamás la red real).

**Validación en la frontera de red.** Lo que llega del servidor no se asume correcto: las respuestas de auth, items, mascotas y pedidos se parsean con esquemas **zod** (`src/api/schemas.ts`) y los tipos de datos se derivan con `z.infer`, de modo que validación y tipos tienen **una sola fuente**. Si la respuesta no cumple el contrato, el cliente lanza `ApiError` con `code: "invalid_response"` y un mensaje amigable (nunca se incluyen los datos recibidos). Lo mismo aplica a lo que se guarda en `localStorage` (sesión y carrito se validan al rehidratar).

**Sesión al cargar.** `GET /auth/me` solo cierra la sesión guardada si responde **401**; ante un error de red, un timeout o un 5xx se conserva y la pantalla de verificación muestra «Reintentar» (y el aviso de servidor despertando si tarda).

## ⚙️ Variables de entorno

Nunca se versionan valores reales: copia los `.env.example` y complétalos.

**Frontend** (`.env.local` en la raíz; solo las variables `VITE_` llegan al navegador, así que **no pongas secretos**):

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base de la API, sin barra final. Por defecto `http://localhost:3000/api/v1`. |
| `VITE_ENABLE_GUEST` | `true` muestra en el login los botones «Entrar como cliente/proveedor de prueba» (solo demo). |

**Backend** (`server/.env`; detalle en [`server/README.md`](server/README.md)):

| Variable | Descripción |
|---|---|
| `JWT_SECRET` | Obligatoria, 32+ caracteres. Sin ella el servidor no arranca. |
| `CORS_ORIGINS` | Orígenes del frontend permitidos, separados por comas. |
| `BCRYPT_COST` | Costo de bcrypt (10 por defecto). |
| `DEMO_MODE` | `true` siembra solo el catálogo de ejemplo; válido también en producción. |
| `SEED_DEMO_DATA` | `true` carga usuarios, catálogo y mascotas de ejemplo (nunca en producción). |
| `MAX_USERS` | Tope total de usuarios (1000 por defecto); al alcanzarlo, el registro responde 503. |
| `TRUST_PROXY` | Saltos de proxy de confianza (`1` en Render). |
| `NODE_ENV`, `PORT` | Entorno y puerto. |

## 🚀 Despliegue (demo pública)

Backend en **Render** (plan gratuito) y frontend en **Vercel**. El orden importa porque cada lado necesita la URL del otro:

1. **Render primero.** *New → Blueprint* y elige este repositorio: [`render.yaml`](render.yaml) crea el servicio `kunapet-api` (carpeta `server`, Node 22, `DEMO_MODE=true`, `TRUST_PROXY=1`) y **genera `JWT_SECRET` automáticamente**. Render pedirá el valor de `CORS_ORIGINS`: déjalo vacío por ahora. Cuando termine el despliegue anota la URL, p. ej. `https://kunapet-api.onrender.com`, y comprueba `https://…/api/v1/health`.
2. **Vercel después.** *Add New → Project*, importa el repositorio, *Framework Preset*: **Vite**. En *Environment Variables* define `VITE_API_URL=https://kunapet-api.onrender.com/api/v1` y, si quieres los botones de invitado, `VITE_ENABLE_GUEST=true`. [`vercel.json`](vercel.json) reescribe todas las rutas a `index.html` (SPA). Despliega y anota la URL, p. ej. `https://tu-app.vercel.app`.
3. **CORS en Render.** En el servicio → *Environment* → `CORS_ORIGINS=https://tu-app.vercel.app` (sin barra final; varias URLs separadas por comas) y guarda: Render redespliega solo. Si cambias después `VITE_API_URL` en Vercel, haz *Redeploy* (Vite incrusta las variables al compilar).

**Límites del plan gratuito**
*   El servicio **se duerme** tras ~15 minutos sin tráfico y tarda hasta un minuto en despertar: la primera petición es lenta. La interfaz lo avisa («El servidor gratuito se está despertando…»).
*   Los datos están **en memoria**: al dormirse, reiniciar o redesplegar se pierden los usuarios registrados y se vuelve a sembrar el catálogo. Es una demo, no un producto.
*   El registro está limitado (10 por IP y hora, `MAX_USERS` en total) para proteger la memoria.

## 🔐 Seguridad: el token en `localStorage`

En esta fase el JWT se guarda en `localStorage` (clave `kunapet-auth`) para simplificar la demo. **Riesgo:** cualquier script que se ejecute en la página (XSS: una dependencia comprometida, HTML inyectado) puede leerlo y suplantar al usuario durante la hora que dura el token. Mitigaciones actuales: el frontend no usa `dangerouslySetInnerHTML` con datos de la API, no registra tokens ni contraseñas y el token expira en 1 hora. **La alternativa más segura son cookies `httpOnly` + `Secure` + `SameSite`** (el JavaScript no puede leerlas), a cambio de manejar CSRF y la configuración de dominios; queda como mejora antes de un uso real.
