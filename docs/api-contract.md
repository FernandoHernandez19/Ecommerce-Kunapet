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
| 422 | `unprocessable_entity` | La petición es válida pero no se puede procesar (p. ej. pedir un item inactivo). |
| 429 | `rate_limited` | Demasiados intentos (login) o registros desde una misma IP. |
| 503 | `service_unavailable` | El registro está cerrado por capacidad (se alcanzó `MAX_USERS`). |
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
- Errores: `400 validation_error`, `409 conflict` (email ya registrado, sin distinguir mayúsculas), `429 rate_limited` (más de 10 registros por IP en una hora), `503 service_unavailable` (tope de usuarios alcanzado; mensaje `"El registro no está disponible por ahora."`).

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
- `q` busca en `title` y `description`, sin distinguir mayúsculas ni tildes. `category` compara sin mayúsculas ni tildes. Orden: más recientes primero.
- `200`: lista paginada de `Item`. Solo se listan los `isActive: true`; **si la petición trae el token de un `provider`, además se incluyen sus propios items inactivos** (ver cambios en §8). Un token inválido en este endpoint público se trata como anónimo.
- Errores: `400` (incluye `minPriceCents > maxPriceCents`).

### GET /items/:id
- Rol: público. `200`: `{ "data": Item }`. Errores: `404` (inexistente, o inactivo y de otro proveedor).

### POST /items
- Rol: `provider`. Body: `{ type, title, description, category, priceCents, durationMinutes?, stock?, imageUrl?, location?, targetPets? }`. `durationMinutes` es obligatorio si `type=service` (y `stock` no se admite); `stock` es obligatorio si `type=product` (y `durationMinutes` no se admite). `priceCents` entero ≥ 1. Los campos desconocidos se rechazan (400).
- `201`: `{ "data": Item }` con `providerId` = usuario autenticado. Errores: `400`, `401`, `403`.

### PATCH /items/:id
- Rol: `provider` dueño. Body: cualquier subconjunto (al menos un campo) de los campos de creación, excepto `type`, más `isActive`. Los campos desconocidos se rechazan (400). `200`: `{ "data": Item }`. Errores: `400`, `401`, `403`, `404` (inexistente o ajeno).

### DELETE /items/:id
- Rol: `provider` dueño. **Desactiva** el item (`isActive: false`), no lo borra; es idempotente. `204` sin cuerpo. Errores: `401`, `403`, `404`.

### GET /pets · POST /pets
- Rol: `client`. `GET` lista solo las mascotas propias (paginada). `POST` body: `{ name, species, breed?, gender?, birthDate?, weightGrams?, notes?, photoUrl? }` → `201 { "data": Pet }`. Límites: `name` 1–60, `breed` ≤ 60, `notes` ≤ 500, `weightGrams` 1–200000, `birthDate` fecha real `YYYY-MM-DD` no futura. Campos desconocidos → 400. Errores: `400`, `401`, `403`.

### GET /pets/:id · PATCH /pets/:id · DELETE /pets/:id
- Rol: `client` dueño. `PATCH` acepta un subconjunto de los campos de creación. `200 { "data": Pet }` / `204`. Errores: `400`, `401`, `403`, `404` (inexistente o ajena).

### POST /orders
- Rol: `client`. Body:
  ```json
  { "items": [ { "itemId": "b7e1c8a2-…", "quantity": 2 } ], "paymentMethod": "yape" }
  ```
  - `items`: de 1 a 20 líneas, sin repetir `itemId`; `quantity` entero 1–20; `paymentMethod`: `card` | `yape` | `transfer`.
  - **El servidor no acepta precios ni totales**: el body es estricto y cualquier campo desconocido (`price`, `total`, `shippingCents`…) responde 400. El precio unitario y el título se toman del catálogo en ese instante y se guardan como copia en el pedido. Calcula: `subtotalCents` = Σ precio × cantidad; `shippingCents` = 1500 solo si hay al menos un ítem `type=product`, si no 0; `platformFeeCents` = 250 si el subtotal es > 0; `totalCents` = suma de los tres.
- `201`: `{ "data": Order }`. Errores: `400` (body inválido, cantidad fuera de 1–20, campos desconocidos), `401`, `403` (provider/admin), `404` (item inexistente), `422` (item inactivo).

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
| `priceCents` | entero ≥ 1 | céntimos; no se aceptan decimales ni 0 |
| `currency` | `"PEN"` | |
| `stock` | entero \| null | solo productos |
| `durationMinutes` | entero \| null | solo servicios |
| `location`, `imageUrl` | string \| null | |
| `targetPets` | string[] | `dog`, `cat`, `bird`, `exotic` |
| `isActive` | boolean | |
| `createdAt`, `updatedAt` | string (ISO) | |
| `provider` | `{ id, name, avatarUrl }` | **Solo en `GET /items` y `GET /items/:id`** (público). Nunca incluye email ni teléfono. |

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
| `status` | `pending_payment`\|`confirmed`\|`preparing`\|`shipping`\|`delivered`\|`cancelled` | nace `pending_payment`; en esta fase no hay transiciones ni pago real |
| `paymentMethod` | `card`\|`yape`\|`transfer` | |
| `items[]` | `{ itemId, title, type, unitPriceCents, quantity, lineTotalCents }` | instantánea del precio al comprar |
| `subtotalCents`, `shippingCents`, `platformFeeCents`, `totalCents` | entero | |
| `currency` | `"PEN"` | |
| `createdAt`, `updatedAt` | string (ISO) | |

```json
{ "id": "9a8b7c6d-5e4f-4a3b-9c2d-1e0f9a8b7c6d", "clientId": "5f0c3b1e-9a1d-4a53-8f1e-2c3d4e5f6a7b", "status": "pending_payment", "paymentMethod": "yape", "items": [ { "itemId": "b7e1c8a2-1f3d-4c55-9a10-7d2e3f4a5b6c", "title": "Alimento NutriCan 15kg", "type": "product", "unitPriceCents": 14550, "quantity": 2, "lineTotalCents": 29100 } ], "subtotalCents": 29100, "shippingCents": 1500, "platformFeeCents": 250, "totalCents": 30850, "currency": "PEN", "createdAt": "2025-06-29T14:00:00.000Z", "updatedAt": "2025-06-29T14:00:00.000Z" }
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

### 7.1 Estado tras conectar el frontend (catálogo, mascotas, pedidos y proveedor)

Resueltas: 1, 2, 3, 4, 5 (el carrito solo *estima*; el total válido lo devuelve `POST /orders`), 6, 7 y 11. La capa `src/api/adapters.js` traduce entre este contrato y la forma que esperan las pantallas.

Brechas que **siguen abiertas** (la API no las ofrece; la interfaz muestra un estado vacío o la etiqueta «Datos de ejemplo», nunca datos inventados):

| Área | Qué falta | Cómo se ve hoy |
|---|---|---|
| Reseñas y calificaciones | No hay endpoints ni campos (`rating`, `reviewCount`) | Sin estrellas ni conteos; «Aún no hay reseñas». «Mis Reseñas» usa datos de ejemplo. |
| Vacunas e historial de la mascota | No existen en `Pet` | «Aún no hay vacunas registradas». El wizard ya no pide vacunas; alergias y necesidades van dentro de `notes` (máx. 500). |
| Direcciones y métodos de pago guardados | No existen | El paso de envío del checkout y «Configuración» muestran datos de ejemplo; la dirección **no** se envía con el pedido. |
| Reservas con fecha y horario | `POST /orders` no recibe fecha ni mascota por línea | Los servicios se compran sin fecha («La reserva con fecha llega en una próxima versión»). «Mis Reservas» y la actividad del panel usan datos de ejemplo. |
| Mensajes y notificaciones | No existen | Datos de ejemplo. |
| Filtros del catálogo | `GET /items` no filtra por tipo de mascota, distrito, disponibilidad ni calificación, ni ordena por precio | El marketplace ofrece solo tipo, categoría, búsqueda y rango de precio; el orden por precio se aplica a los resultados ya cargados. |
| Items del proveedor | No hay filtro `mine` / `providerId` en `GET /items` | La pantalla de servicios pagina el catálogo (≤ 5 páginas de 100) y filtra por `provider.id`. |
| Acciones masivas | No hay endpoints masivos | Se hacen con `PATCH`/`DELETE` individuales y secuenciales (máx. 20) con reporte de errores parciales. |
| Productos del proveedor | La UI de «Gestión de Servicios» solo crea y edita `type=service` | Los productos se pueden crear por API, pero no desde la interfaz. |
| Imágenes | No hay subida de archivos (`imageUrl` / `photoUrl` son URLs) | Sin foto de mascota ni imagen de servicio propia; se muestra un marcador. |
| Panel del proveedor | Ventas, agenda, stock y pedidos recibidos no existen | Solo «Servicios activos» es real; el resto lleva la etiqueta «Datos de ejemplo». |
| Stock y pago | El stock no se descuenta y no hay cobro | El pedido nace `pending_payment`: «Pago pendiente (demo sin cobro real)». |

## 8. Cambios respecto a la primera versión del contrato

Decisiones tomadas al implementar la fase de dominio (P3-B). Cada punto indica dónde se reflejó arriba.

| # | Cambio | Motivo |
|---|---|---|
| 1 | Los items inactivos son visibles para su proveedor en `GET /items` y `GET /items/:id` (antes: nunca). | El proveedor necesita ver y reactivar lo que desactivó (`DELETE` desactiva). |
| 2 | `priceCents` es un entero ≥ 1 (antes ≥ 0). | Un item gratis no tiene sentido y evita comisión sobre subtotal 0. |
| 3 | `DELETE /items/:id` desactiva en vez de borrar; `PATCH` no permite cambiar `type`. | Los pedidos conservan una copia del título y precio, pero el historial del proveedor no debe perder el item. |
| 4 | Nuevo código `unprocessable_entity` (422). | Distingue "item inexistente" (404) de "item inactivo" (422) al crear un pedido. |
| 5 | `Order.status` inicial es `pending_payment` (antes `pending`). | Deja claro que falta el pago, que no existe todavía. |
| 6 | `POST /orders` rechaza (400) campos desconocidos en vez de ignorarlos, admite máximo 20 líneas y no repite `itemId`. | Un precio enviado es una señal de cliente manipulado o desactualizado; mejor fallar que ignorar en silencio. |
| 7 | El stock no se valida ni se descuenta en esta fase (antes: "sin stock → 400"). | Sin pago ni transiciones de estado no hay forma correcta de reservar stock. Queda para la fase de pagos. |
| 8 | Nuevo código de error `service_unavailable` (503). | El registro público se cierra cuando se alcanza el tope de usuarios (`MAX_USERS`, 1000 por defecto). |
| 9 | `POST /auth/register` responde 429 tras 10 registros por IP en una hora. | Proteger la memoria limitada de la demo pública. |
| 10 | Se añade `DEMO_MODE`: siembra solo el catálogo bajo un proveedor demo sin contraseña conocida. | Demo pública sin cuentas con credenciales publicadas. |
| 11 | `GET /items` y `GET /items/:id` incluyen `provider: { id, name, avatarUrl }`. | El catálogo necesita mostrar quién vende. Se expone solo lo público: nunca email ni teléfono. |
