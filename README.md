# 🏨 Hotel Aurora — Sistema de Reservas

Aplicación web completa de **reservas de hotel** desarrollada para el proyecto final de
**Ingeniería Web (2026-1) — Universidad de Antioquia**.

Los clientes pueden buscar disponibilidad de habitaciones y reservar; el personal del
hotel gestiona habitaciones, clientes y reservas, incluyendo el flujo de **check-in /
check-out**.

---

## ✨ Características

### Para el cliente (sitio público)
- 🔎 **Búsqueda de disponibilidad** por fechas y número de huéspedes (sin doble-booking).
- 🛏️ Catálogo de habitaciones con detalle, fotos, servicios y precios.
- 📝 **Reserva en línea** con cálculo de total en vivo y confirmación con código.
- 📋 Consulta de **"Mis reservas"** por correo y cancelación de reservas futuras.

### Para el personal (panel de administración)
- 📊 **Dashboard** con KPIs: ocupación, check-ins/check-outs del día e ingresos.
- 🛏️ **CRUD de habitaciones** (datos maestros) + cambio rápido de estado.
- 👤 **CRUD de clientes** (datos maestros).
- ✅ **Gestión de reservas** (datos transaccionales) con **check-in** y **check-out**.
- 🔐 Acceso protegido con login por roles.

---

## 🧱 Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | **Next.js 15** (App Router) + React 19 + TypeScript |
| Estilos | **Tailwind CSS** + diseño propio (paleta "hotel elegante") |
| Iconos | lucide-react |
| Base de datos | **PostgreSQL** + **Prisma ORM** |
| Lógica de servidor | **Server Actions** (sin API REST manual) |
| Auth | Sesión por cookie firmada (HMAC) + scrypt |

### Modelo de datos
- **Datos maestros:** `Habitacion`, `Cliente`
- **Datos transaccionales:** `Reserva` (con `check-in` / `check-out`)
- **Usuarios:** personal del hotel (login)

---

## 🚀 Cómo ejecutar el proyecto

```bash
# 1. Instalar dependencias
npm install

# 2. Crear la base de datos y cargar datos de ejemplo
npm run setup        # = prisma db push + seed

# 3. Levantar el servidor de desarrollo
npm run dev
```

Abre <http://localhost:3000>.

### 👤 Credenciales de demostración (panel)
Dos roles con permisos distintos (contraseña `aurora2026` para ambos):

| Rol | Correo | Permisos |
|-----|--------|----------|
| **Administrador** | `admin@aurora.com` | Todo: incluye crear/eliminar habitaciones y eliminar clientes |
| **Recepción** | `personal@aurora.com` | Operación diaria: reservas, check-in/out, registrar/editar clientes y cambiar estado de habitaciones |

### Scripts útiles
| Comando | Acción |
|---------|--------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación de producción |
| `npm run db:seed` | Recargar datos de ejemplo |
| `npm run db:reset` | Reiniciar la base de datos desde cero |

---

## 🗺️ Rutas principales

| Ruta | Descripción |
|------|-------------|
| `/` | Landing + buscador |
| `/habitaciones` | Disponibilidad / catálogo |
| `/habitaciones/[id]` | Detalle + reserva |
| `/confirmacion/[codigo]` | Confirmación de reserva |
| `/mis-reservas` | Consulta por correo |
| `/login` | Acceso del personal |
| `/panel` | Dashboard |
| `/panel/reservas` | Gestión + check-in/out |
| `/panel/habitaciones` | CRUD de habitaciones |
| `/panel/clientes` | CRUD de clientes |

---

## ☁️ Despliegue

La aplicación usa **PostgreSQL** y está desplegada en **Vercel** y en **Render**, ambas
apuntando a la misma base de datos Postgres.

### Variables de entorno (en ambas plataformas)
| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Cadena de conexión Postgres (Neon u otra) |
| `SESSION_SECRET` | Secreto aleatorio para firmar la cookie de sesión |

### Vercel
1. Importar el repo en Vercel (framework Next.js, autodetectado).
2. Definir `DATABASE_URL` y `SESSION_SECRET` en *Environment Variables*.
3. Deploy. El `build` ejecuta `prisma generate && next build`.

### Render
1. *New +* → *Blueprint* → conectar este repo (Render lee `render.yaml`).
2. Pegar la `DATABASE_URL` (la misma que Vercel). `SESSION_SECRET` se genera solo.
3. Deploy.

### Preparar la base de datos (una sola vez)
```bash
DATABASE_URL="postgresql://..." npm run setup   # crea tablas + datos de ejemplo
```

---

## 📚 Documentación de diseño

Artefactos que muestran la planeación y las decisiones de construcción:

| Documento | Contenido |
|-----------|-----------|
| [`docs/PLANEACION.md`](docs/PLANEACION.md) | Visión, alcance, requisitos, historias de usuario (MoSCoW), sprints |
| [`docs/MODELO_DATOS.md`](docs/MODELO_DATOS.md) | Diagrama ER + justificación maestros/transaccionales |
| [`docs/DECISIONES.md`](docs/DECISIONES.md) | Registro de decisiones técnicas (ADR) con alternativas y porqué |
| [`docs/DIAGRAMAS.md`](docs/DIAGRAMAS.md) | Flujo de reserva, máquina de estados, arquitectura, matriz de roles |
| [`ARQUITECTURA.md`](ARQUITECTURA.md) | Explicación técnica del código |
| [`GUION_SUSTENTACION.md`](GUION_SUSTENTACION.md) | Guion de demo + banco de preguntas |

## 👥 Equipo

Proyecto académico — Ingeniería Web 2026-1, Universidad de Antioquia.
Tema: **Sistema de Reservas de Hotel**.
