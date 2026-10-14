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
npm run dev
```

## 🧩 Backend

El backend vive en [`server/`](server/) y expone una API REST bajo `/api/v1`.

**Qué hay hoy**
*   Autenticación con JWT (HS256, 1 h) y roles `client`, `provider` y `admin`.
*   Catálogo de productos y servicios con filtros, búsqueda y paginación; el proveedor gestiona solo los suyos.
*   Mascotas y pedidos del cliente, con autorización por propietario. El servidor calcula los totales (envío y comisión) y nunca confía en precios enviados por el cliente.
*   Datos en memoria detrás de interfaces de repositorio, y datos de ejemplo opcionales para desarrollo.

**Cómo correrlo**
```bash
cd server
npm ci
cp .env.example .env   # define JWT_SECRET (32+ caracteres)
npm run dev
```
Guía completa en [`server/README.md`](server/README.md). El contrato de la API (la fuente de verdad) está en [`docs/api-contract.md`](docs/api-contract.md).

**CI:** el workflow [`ci.yml`](.github/workflows/ci.yml) corre en cada pull request y en cada push a `main`, con dos jobs: *frontend* (`npm ci` y `npm run build`) y *server* (lint, typecheck, test y build).

**Próximos pasos**
*   Conectar el frontend a la API (reemplazar `src/services` y los stores simulados).
*   Migrar el frontend a TypeScript.
*   Base de datos real (reemplazando los repositorios en memoria).
*   Pagos y estados de pedido.
*   Reservas y reclamos.
