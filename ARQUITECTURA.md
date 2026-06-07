# 🏛️ Arquitectura y decisiones técnicas — Hotel Aurora

Este documento explica **el porqué** de cada decisión del proyecto. Sirve para estudiar
antes de la sustentación y como evidencia de que el código se entiende (no es "vibe coding").

---

## 1. El dominio: datos maestros vs. transaccionales

El profesor pide modelar **datos maestros** (entidades base que se configuran) y **datos
transaccionales** (operaciones sobre esas entidades).

| Tipo | Entidad | Por qué |
|------|---------|---------|
| Maestro | `Habitacion` | Catálogo del hotel; se da de alta/baja, cambia precio y estado |
| Maestro | `Cliente` | Registro de huéspedes |
| Transaccional | `Reserva` | Operación que relaciona un cliente con una habitación en un rango de fechas; cambia de estado (check-in/out) |

Archivo: [`prisma/schema.prisma`](prisma/schema.prisma)

---

## 2. Stack y justificación de cada pieza

> Regla que nos puso el profe: **sin librerías innecesarias**. Cada dependencia tiene un motivo.

| Dependencia | Para qué la usamos |
|-------------|--------------------|
| `next` / `react` / `react-dom` | Framework (App Router) — exigido |
| `@prisma/client` + `prisma` | ORM tipado: definir el modelo y consultar Postgres sin SQL a mano |
| `tailwindcss` | Estilos utilitarios |
| `clsx` + `tailwind-merge` | Helper `cn()` para combinar clases condicionales sin conflictos (`src/lib/utils.ts`) |
| `lucide-react` | Íconos SVG |

**No usamos** ninguna librería de UI pesada, de estado global, ni de fechas: las fechas se
manejan con `Intl`/`Date` nativos y el estado con React. (Quitamos `framer-motion` y
`date-fns` porque no se usaban.)

---

## 3. Modelo de datos

```
Cliente 1 ─── N Reserva N ─── 1 Habitacion
Usuario (personal del hotel, con rol PERSONAL | ADMIN)
```

- **Habitacion.estado**: `DISPONIBLE | OCUPADA | MANTENIMIENTO`
- **Reserva.estado**: `CONFIRMADA | EN_CURSO | FINALIZADA | CANCELADA`
- Una reserva guarda `noches`, `total`, `codigo` y marcas de tiempo `checkInAt` / `checkOutAt`.

---

## 4. Decisiones clave (el "porqué")

### 4.1 Server Actions en vez de API REST
Las mutaciones (crear reserva, check-in, CRUD) son **Server Actions** (`"use server"`), no
endpoints REST manuales. Ventajas: menos código repetido, llamadas type-safe desde el
formulario, y `revalidatePath()` refresca la vista tras la mutación.
Archivos: [`src/app/actions/`](src/app/actions/)

### 4.2 Server Components por defecto, Client Components solo donde hace falta
Casi todo renderiza en el **servidor** (más rápido, sin JS innecesario). Marcamos
`"use client"` **solo** donde hay interactividad de navegador:
- `search-bar.tsx` (estado de fechas)
- `booking-form.tsx` (cálculo de total en vivo)
- `modal.tsx`, `*-form.tsx` (formularios CRUD), `sidebar.tsx`, `submit-button.tsx`

### 4.3 Disponibilidad y anti doble-booking ⭐
La parte con más lógica de negocio. Dos rangos `[entrada, salida)` se solapan si:
```
entradaExistente < salidaPedida  &&  salidaExistente > entradaPedida
```
Una **salida que coincide con la entrada** de otra reserva NO se solapa (el huésped sale
en la mañana, el siguiente entra en la tarde). Además, la disponibilidad se **re-verifica
dentro de `crearReservaAction`**, no solo en el buscador, para evitar condiciones de carrera.
Archivos: [`src/lib/availability.ts`](src/lib/availability.ts), [`src/app/actions/reservas.ts`](src/app/actions/reservas.ts)

### 4.4 La reserva es una máquina de estados
- **Check-in:** `CONFIRMADA → EN_CURSO` y la habitación `→ OCUPADA`.
- **Check-out:** `EN_CURSO → FINALIZADA` y la habitación `→ DISPONIBLE`.
- **Cancelar:** `→ CANCELADA` (libera la habitación si estaba en curso).
Solo se permiten las transiciones válidas (se valida el estado actual antes de cambiarlo).

### 4.5 El total se calcula en el servidor (seguridad)
El precio total **no** se confía al cliente: se recalcula `noches × precioNoche` dentro de
la Server Action. Si el front enviara un total manipulado, se ignora.

### 4.6 Autenticación
- Contraseñas: **`scrypt` con salt** (nunca en texto plano) y comparación con
  `timingSafeEqual` (evita ataques de tiempo).
- Sesión: cookie **firmada con HMAC-SHA256**. Si alguien altera el `userId`, la firma no
  coincide y la sesión se rechaza. Cookie `httpOnly`.
Archivo: [`src/lib/auth.ts`](src/lib/auth.ts)

### 4.7 Roles y autorización
Dos roles: **ADMIN** (gerencia) y **PERSONAL** (recepción).
- Solo ADMIN crea/elimina habitaciones y elimina clientes.
- La restricción se aplica **en el servidor** (en las Server Actions, la seguridad real) y
  además se refleja en la UI (ocultar botones).
Archivos: `src/app/actions/habitaciones.ts`, `src/app/actions/clientes.ts`

---

## 5. Estructura del proyecto

```
src/
├── app/
│   ├── (público): page, habitaciones, confirmacion, mis-reservas, login
│   ├── panel/ (protegido): dashboard, reservas, habitaciones, clientes
│   └── actions/ (Server Actions: auth, reservas, habitaciones, clientes)
├── components/ (UI reutilizable + componentes de dominio)
└── lib/ (db, auth, availability, utils, constants)
prisma/ (schema + seed)
```

---

## 6. Despliegue
- **Render** (web service Node) conectado al repo, con auto-deploy.
- Base de datos **PostgreSQL**; Prisma con `prisma db push`.
- Variables: `DATABASE_URL`, `SESSION_SECRET`.
