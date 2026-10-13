# Contrato de la API de KunaPet

Versión del contrato: **v1** · Estado: borrador para revisión.

Este documento define la API REST que consumirá el frontend. Se escribió leyendo `src/data/mockData.js`, `src/services/*`, `src/store/*`, `ProtectedRoute.jsx` y `App.jsx`. El contrato va primero; el código lo implementa por fases.

- **Fase actual (implementada en `/server`)**: `GET /health`, `POST /auth/register`, `POST /auth/login`, `GET /auth/me`.
- **Fase siguiente (solo definida aquí)**: catálogo (`/items`), mascotas (`/pets`) y pedidos (`/orders`).

## 1. Convenciones

| Tema | Regla |
|---|---|
| Prefijo | Todas las rutas cuelgan de `/api/v1`. |
| Formato | JSON (`Content-Type: application/json`). Body máximo: 100 kb. |
| Ids | Strings UUID v4 generados por el servidor (`crypto.randomUUID()`). |
| Fechas | ISO 8601 en UTC, p. ej. `2025-06-29T14:00:00.000Z`. Las fechas sin hora (`birthDate`) usan `YYYY-MM-DD`. |
| Dinero | Enteros en céntimos de sol: `priceCents: 3500` = S/ 35.00. Siempre acompañado de `currency: "PEN"`. Nunca decimales. |
| Estados | En inglés y minúsculas (`pending`, `completed`, …). |
| Idioma | Los mensajes de error están en español; los códigos (`code`) en inglés. |
| Paginación | Query `page` (≥ 1, por defecto 1) y `limit` (1–100, por defecto 20). |

### 1.1 Respuesta de listas

```json
{ "data": [ ], "meta": { "page": 1, "limit": 20, "total": 134 } }
```

### 1.2 Formato de errores

Todos los errores usan la misma forma. Nunca incluyen stack traces ni mensajes internos.

```json
{ "error": { "code": "validation_error", "message": "Datos inválidos.", "details": [ { "path": "email", "message": "Correo inválido." } ] } }
```

| HTTP | `code` | Cuándo |
|---|---|---|
| 400 | `validation_error` | Body, query o parámetros inválidos. `details` lista los campos. |
| 401 | `unauthorized` | Falta el token, es inválido/expirado, o las credenciales son incorrectas. |
| 403 | `forbidden` | Autenticado pero sin el rol requerido. |
| 404 | `not_found` | Ruta o recurso inexistente (o ajeno, ver §2.3). |
| 409 | `conflict` | Conflicto de unicidad (p. ej. email ya registrado). |
| 429 | `rate_limited` | Demasiados intentos (login). |
| 500 | `internal_error` | Error inesperado; mensaje genérico. |

## 2. Autenticación y permisos

### 2.1 Bearer JWT

Tras el login el cliente envía `Authorization: Bearer <token>` en cada petición protegida.

- Algoritmo **HS256** (fijado al firmar y al verificar), expiración **1 hora**, payload `{ sub: <userId>, role }`.
- En cada petición el servidor recarga al usuario desde el repositorio; si ya no existe responde 401. El rol que manda es el del repositorio, no el del token.
- Header ausente, malformado, token inválido, expirado o con otro algoritmo → siempre el mismo 401 `unauthorized`.

### 2.2 Matriz de permisos por rol

Leyenda: ✅ permitido · ❌ 403 · 🌐 público (sin token) · 👤 solo recursos propios.

| Endpoint | Anónimo | client | provider | admin |
|---|---|---|---|---|
| `GET /health` | 🌐 | ✅ | ✅ | ✅ |
| `POST /auth/register` | 🌐 | – | – | – |
| `POST /auth/login` | 🌐 | – | – | – |
| `GET /auth/me` | 401 | ✅ | ✅ | ✅ |
| `GET /items`, `GET /items/:id` | 🌐 | ✅ | ✅ | ✅ |
| `POST /items` | 401 | ❌ | ✅ | ❌ |
| `PATCH /items/:id`, `DELETE /items/:id` | 401 | ❌ | 👤 | ❌ |
| `/pets` (todos) | 401 | 👤 | ❌ | ❌ |
| `POST /orders` | 401 | ✅ | ❌ | ❌ |
| `GET /orders`, `GET /orders/:id` | 401 | 👤 | ❌ | ❌ |

Esto replica los `allowedRoles` de `App.jsx` (mascotas y checkout solo `client`; gestión de servicios solo `provider`). El rol `admin` queda sin endpoints de dominio en v1 (las colas de reclamos son una fase futura).

### 2.3 Propiedad de recursos

Un recurso ajeno responde **404** (no 403), para no revelar que existe. Aplica a `/pets/:id`, `/orders/:id` y a `PATCH/DELETE /items/:id` de otro proveedor.

## 3. Endpoints — fase actual

### GET /health
- Rol: público. Respuesta `200`: `{ "status": "ok" }`.

### POST /auth/register
- Rol: público.
- Body:
  ```json
  { "name": "Camila Rodríguez", "email": "camila@kunapet.com", "password": "UnaClaveLarga123", "role": "client", "phone": "+51 999 123 456" }
  ```
  - `name`: 2–100 caracteres. `email`: válido, se normaliza a minúsculas, único. `password`: **8–72** caracteres (bcrypt trunca a 72 bytes). `role`: solo `client` o `provider` (por defecto `client`; `admin` se rechaza). `phone`: opcional.
- `201`: `{ "user": User }` (nunca incluye el hash).
- Errores: `400 validation_error`, `409 conflict` (email ya registrado, sin distinguir mayúsculas).

### POST /auth/login
- Rol: público.
- Body: `{ "email": "camila@kunapet.com", "password": "UnaClaveLarga123" }`
- `200`: `{ "user": User, "token": "<jwt>", "expiresIn": 3600 }` (`expiresIn` en segundos).
- Errores: `400 validation_error`; `401 unauthorized` con **el mismo mensaje** (`"Correo o contraseña incorrectos."`) para email inexistente y contraseña errónea; `429 rate_limited` tras 10 intentos por IP+email en 15 minutos.

### GET /auth/me
- Rol: cualquier usuario autenticado. Header `Authorization: Bearer <token>`.
- `200`: `{ "user": User }`. Errores: `401 unauthorized`.

## 4. Endpoints — fase siguiente (solo definidos)

### GET /items
- Rol: público. Query: `type` (`product`|`service`), `category`, `q` (texto en título/descripción), `minPriceCents`, `maxPriceCents`, `page`, `limit`.
- `200`: lista paginada de `Item` (solo `isActive: true`). Errores: `400`.

### GET /items/:id
- Rol: público. `200`: `{ "data": Item }`. Errores: `404`.

### POST /items
- Rol: `provider`. Body: `{ type, title, description, category, priceCents, durationMinutes?, stock?, imageUrl?, location?, targetPets? }`. `durationMinutes` es obligatorio si `type=service`; `stock` si `type=product`.
- `201`: `{ "data": Item }` con `providerId` = usuario autenticado. Errores: `400`, `401`, `403`.

### PATCH /items/:id
- Rol: `provider` dueño. Body: cualquier subconjunto de los campos de creación más `isActive`. `200`: `{ "data": Item }`. Errores: `400`, `401`, `403`, `404` (inexistente o ajeno).

### DELETE /items/:id
- Rol: `provider` dueño. `204` sin cuerpo. Errores: `401`, `403`, `404`.

### GET /pets · POST /pets
- Rol: `client`. `GET` lista solo las mascotas propias (paginada). `POST` body: `{ name, species, breed?, gender?, birthDate?, weightGrams?, notes?, photoUrl? }` → `201 { "data": Pet }`. Errores: `400`, `401`, `403`.

### GET /pets/:id · PATCH /pets/:id · DELETE /pets/:id
- Rol: `client` dueño. `PATCH` acepta un subconjunto de los campos de creación. `200 { "data": Pet }` / `204`. Errores: `400`, `401`, `403`, `404` (inexistente o ajena).

### POST /orders
- Rol: `client`. Body:
  ```json
  { "items": [ { "itemId": "b7e1c8a2-…", "quantity": 2 } ], "paymentMethod": "yape" }
  ```
  - `items`: 1 o más; `quantity` entero 1–20; `paymentMethod`: `card` | `yape` | `transfer`.
  - **El servidor ignora cualquier precio enviado** y lo toma del catálogo. Calcula: `subtotalCents` = Σ precio × cantidad; `shippingCents` = 1500 solo si hay al menos un ítem `type=product`, si no 0; `platformFeeCents` = 250; `totalCents` = suma de los tres.
- `201`: `{ "data": Order }`. Errores: `400` (incluye ítems inexistentes/inactivos o sin stock), `401`, `403`.

### GET /orders · GET /orders/:id
- Rol: `client`, solo propios. `GET /orders` paginada, más recientes primero. Errores: `401`, `403`, `404` (ajeno o inexistente).

## 5. Esquemas

### User
| Campo | Tipo | Notas |
|---|---|---|
| `id` | string (UUID) | |
| `name` | string | |
| `email` | string | minúsculas |
| `role` | `client`\|`provider`\|`admin` | |
| `phone` | string \| null | |
| `avatarUrl` | string \| null | |
| `createdAt` | string (ISO) | |

```json
{ "id": "5f0c3b1e-9a1d-4a53-8f1e-2c3d4e5f6a7b", "name": "Camila Rodríguez", "email": "camila@kunapet.com", "role": "client", "phone": "+51 999 123 456", "avatarUrl": null, "createdAt": "2025-06-29T14:00:00.000Z" }
```

### Item (productos y servicios)
| Campo | Tipo | Notas |
|---|---|---|
| `id`, `providerId` | string (UUID) | |
| `type` | `product`\|`service` | |
| `title`, `description`, `category` | string | |
| `priceCents` | entero ≥ 0 | |
| `currency` | `"PEN"` | |
| `stock` | entero \| null | solo productos |
| `durationMinutes` | entero \| null | solo servicios |
| `location`, `imageUrl` | string \| null | |
| `targetPets` | string[] | `dog`, `cat`, `bird`, `exotic` |
| `isActive` | boolean | |
| `createdAt`, `updatedAt` | string (ISO) | |

```json
{ "id": "b7e1c8a2-1f3d-4c55-9a10-7d2e3f4a5b6c", "providerId": "5f0c3b1e-9a1d-4a53-8f1e-2c3d4e5f6a7b", "type": "service", "title": "Baño y Corte de Pelo Completo", "description": "Grooming integral.", "category": "grooming", "priceCents": 4500, "currency": "PEN", "stock": null, "durationMinutes": 90, "location": "San Borja, Lima", "imageUrl": null, "targetPets": ["dog", "cat"], "isActive": true, "createdAt": "2025-06-01T10:00:00.000Z", "updatedAt": "2025-06-01T10:00:00.000Z" }
```

### Pet
| Campo | Tipo | Notas |
|---|---|---|
| `id`, `ownerId` | string (UUID) | |
| `name` | string | |
| `species` | `dog`\|`cat`\|`bird`\|`exotic`\|`other` | |
| `breed`, `gender` | string \| null | `gender`: `female`\|`male`\|`unknown` |
| `birthDate` | `YYYY-MM-DD` \| null | la edad se calcula, no se guarda |
| `weightGrams` | entero \| null | |
| `notes`, `photoUrl` | string \| null | |
| `createdAt`, `updatedAt` | string (ISO) | |

```json
{ "id": "0d9e8f7a-6b5c-4d3e-8a2b-1c0d9e8f7a6b", "ownerId": "5f0c3b1e-9a1d-4a53-8f1e-2c3d4e5f6a7b", "name": "Luna", "species": "dog", "breed": "Golden Retriever", "gender": "female", "birthDate": "2022-03-15", "weightGrams": 28000, "notes": "Alergia al trigo.", "photoUrl": null, "createdAt": "2025-01-10T10:00:00.000Z", "updatedAt": "2025-01-10T10:00:00.000Z" }
```

### Order
| Campo | Tipo | Notas |
|---|---|---|
| `id`, `clientId` | string (UUID) | |
| `status` | `pending`\|`confirmed`\|`preparing`\|`shipping`\|`delivered`\|`cancelled` | nace `pending` |
| `paymentMethod` | `card`\|`yape`\|`transfer` | |
| `items[]` | `{ itemId, title, type, unitPriceCents, quantity, lineTotalCents }` | instantánea del precio al comprar |
| `subtotalCents`, `shippingCents`, `platformFeeCents`, `totalCents` | entero | |
| `currency` | `"PEN"` | |
| `createdAt`, `updatedAt` | string (ISO) | |

```json
{ "id": "9a8b7c6d-5e4f-4a3b-9c2d-1e0f9a8b7c6d", "clientId": "5f0c3b1e-9a1d-4a53-8f1e-2c3d4e5f6a7b", "status": "pending", "paymentMethod": "yape", "items": [ { "itemId": "b7e1c8a2-1f3d-4c55-9a10-7d2e3f4a5b6c", "title": "Alimento NutriCan 15kg", "type": "product", "unitPriceCents": 14550, "quantity": 2, "lineTotalCents": 29100 } ], "subtotalCents": 29100, "shippingCents": 1500, "platformFeeCents": 250, "totalCents": 30850, "currency": "PEN", "createdAt": "2025-06-29T14:00:00.000Z", "updatedAt": "2025-06-29T14:00:00.000Z" }
```

## 6. Mapa del frontend → API

| Frontend hoy | Ejemplo | API |
|---|---|---|
| Edad de mascota | `species: 'dog'`, `age: 2` | `species: "dog"`, `birthDate: "2022-03-15"` (edad calculada en el cliente) |
| Especie en `petService` | `type: 'Perro'` | `species: "dog"` (enum en inglés) |
| Género | `'Hembra'`/`'Macho'` | `female`/`male`/`unknown` |
| Precio | `'S/ 35'`, `price: 25.00`, `basePrice: 145.5` | `priceCents: 3500`, `2500`, `14550` + `currency: "PEN"` |
| Fecha | `'Hoy, 29 Jun 2025'`, `'28 Jun 2025'` | `2025-06-29T14:00:00.000Z` (ISO UTC) |
| Estado de pedido | `'shipping'`, `trackingStep: 2` | `status: "shipping"`; `trackingStep` se deriva del estado |
| Estado en historial | `'COMPLETADO'`, `'in_progress'` | `completed`, `in_progress` (minúsculas, inglés) |
| Ids | `'p1'`, `'srv-1'`, `'usr-001'`, `'ord-2025-001'` | UUID |
| Rol | `'client'`/`'provider'`/`'admin'` | se mantiene |
| Producto y servicio | `mockMarketplaceItems` y `MOCK_SERVICES_DB` | un solo `Item` con `type` |
| `priceLabel` (`'Desde'`, `'Costo Fijo'`) | texto de UI | no va en la API; es presentación |
| `serviceFee` por ítem | 5.0, 3.0… | reemplazado por comisión fija de pedido: `platformFeeCents: 250` |
| Envío | `SHIPPING_FEE = 15.00` | `shippingCents: 1500` solo con productos |
| Token | `mock-jwt-…` | JWT HS256 real, `expiresIn: 3600` |
| Categoría | `'Servicio • Grooming'`, `'Paseos'` | `category: "grooming"` (slug) + `type: "service"` |
| Imagen | `image`, `avatarUrl`, `photo` | `imageUrl`, `avatarUrl`, `photoUrl` |

**Aún no cubierto por la API**: reservas (`mockReservations`), reclamos (`/claims-queue`), mensajes/chats, reseñas (`mockMyReviews`), direcciones, métodos de pago guardados, notificaciones, vacunas e historial de servicios de la mascota, actualización de perfil (`updateProfile`), logout/invalidación de token, carga de imágenes, panel de administración, verificación de proveedor.

## 7. Brechas conocidas del frontend

1. `useAuthStore.login` **ignora `authService`**: fabrica el usuario y el token en el propio store, con el rol decidido por el email, y siempre usa el id `usr-001`. Debe llamar a `POST /auth/login`.
2. `authService` acepta contraseñas universales de demo (`demo123456`, `123456`, `password`) y no hay registro real; los formularios de registro no llaman a ningún servicio.
3. Hay **dos modelos de mascota** incompatibles: `mockPets`/`usePetsStore` (`species`, `age` numérico, `birthdate`, `vaccines[]`) y `petService` (`type: 'Perro'`, `age: '2 años'`, `weight`, `ownerId`). La API adopta uno solo (`species` + `birthDate`).
4. **Hay dos modelos de ítem** (`mockMarketplaceItems` con `price` decimal y `MOCK_SERVICES_DB`) y los precios son números decimales o strings (`'S/ 35'`): riesgo de errores de redondeo; la API usa céntimos enteros.
5. **Los totales se calculan en el cliente** (`useCartTotals`) con precios guardados en `localStorage`; el usuario puede manipularlos. La API recalcula todo en el servidor. Además, la comisión del cliente (2.50) y el `serviceFee` por ítem del mock no coinciden.
6. El carrito identifica ítems por `id` + `type` con ids numéricos en string (`'1'`, `'3'`) que no existirán como UUID.
7. El token se persiste en `localStorage` (`kunapet-auth`) y `isAuthenticated` se persiste junto con él: no se revalida con `GET /auth/me` ni se maneja la expiración (1 h) ni el 401.
8. `ProtectedRoute` solo controla la navegación; es una comodidad de UX, no seguridad. La autorización real vive en la API (`requireRole` y propiedad del recurso).
9. `updateProfile` del store solo cambia el estado local, sin persistir en el servidor.
10. Las fechas y los estados son texto de presentación (`'Hoy, 14:00'`, `'COMPLETADO'`), mezclando idiomas y mayúsculas.
11. `usePetsStore` inicializa con `mockPets` y calcula la edad restando años (sin considerar mes/día).
12. Las rutas de `admin` (`/claims-queue`, `/claims/:id`) no tienen modelo de datos en el frontend ni en esta API.
