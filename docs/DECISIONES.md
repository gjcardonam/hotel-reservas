# 🧭 Registro de decisiones técnicas (ADR)

Cada decisión importante de construcción, con el **contexto**, las **opciones que
consideramos** y el **porqué** elegimos una. Esto demuestra que las decisiones fueron
pensadas, no automáticas.

> Formato: Decisión · Contexto · Opciones · Elección · Consecuencias.

---

### ADR-01 — Framework: Next.js (App Router)
- **Contexto:** la materia exige Next.js/React.
- **Opciones:** Pages Router vs App Router.
- **Elección:** App Router con Server Components.
- **Consecuencias:** menos JavaScript en el cliente; usamos Server Actions para mutaciones.

### ADR-02 — Mutaciones con Server Actions, no API REST manual
- **Contexto:** crear reservas, check-in/out y CRUD necesitan escribir en la BD.
- **Opciones:** (a) rutas `app/api/*` REST + fetch; (b) Server Actions.
- **Elección:** Server Actions (`"use server"`).
- **Por qué:** menos código repetido, llamadas type-safe desde el formulario y
  `revalidatePath` para refrescar la vista. No necesitábamos una API pública.
- **Consecuencias:** la lógica vive junto a las páginas; más simple de mantener.

### ADR-03 — Base de datos: PostgreSQL + Prisma (antes SQLite)
- **Contexto:** primero usamos SQLite por simplicidad local; al desplegar, el hosting
  serverless no persiste archivos.
- **Opciones:** seguir con SQLite vs migrar a Postgres.
- **Elección:** PostgreSQL con Prisma como ORM.
- **Por qué:** persistencia real en producción y un modelo tipado.
- **Consecuencias:** cambio de `provider` en el schema; misma API de Prisma.

### ADR-04 — Autenticación propia (cookie firmada + scrypt), no una librería externa
- **Contexto:** solo el personal entra al panel; necesidad simple de login con roles.
- **Opciones:** NextAuth/Auth.js vs solución propia mínima.
- **Elección:** sesión propia: contraseña con **scrypt+salt**, cookie **firmada con HMAC**.
- **Por qué:** evitar una dependencia grande para un caso simple (alineado con "sin librerías
  innecesarias") y entender de verdad cómo funciona una sesión.
- **Consecuencias:** menos dependencias; nosotros controlamos el flujo.

### ADR-05 — Anti doble-booking con re-verificación en la acción
- **Contexto:** dos clientes podrían intentar la misma habitación casi al tiempo.
- **Opciones:** confiar solo en el filtro del buscador vs re-verificar al confirmar.
- **Elección:** re-verificar la disponibilidad **dentro de `crearReservaAction`** antes de
  insertar.
- **Por qué:** el buscador puede quedar desactualizado; la verdad se valida al escribir.
- **Consecuencias:** integridad garantizada (RNF1).

### ADR-06 — Server Components por defecto; Client Components solo si hay interacción
- **Contexto:** queremos UI rápida sin JS de más.
- **Elección:** `"use client"` solo en buscador, formularios, modales y sidebar.
- **Consecuencias:** menor bundle; el resto renderiza en el servidor.

### ADR-07 — Roles ADMIN vs PERSONAL aplicados en el servidor
- **Contexto:** no todo el personal debe poder borrar el catálogo.
- **Opciones:** ocultar botones en la UI vs validar también en el servidor.
- **Elección:** validar en las Server Actions (seguridad real) **y** ocultar en la UI (UX).
- **Por qué:** ocultar en la UI no es seguridad; un usuario podría invocar la acción igual.
- **Consecuencias:** control de acceso confiable.

### ADR-08 — El total se calcula en el servidor
- **Contexto:** el precio no debe poder manipularse desde el navegador.
- **Elección:** recalcular `noches × precioNoche` en la acción; ignorar cualquier total del cliente.
- **Consecuencias:** integridad del cobro (RNF2).

### ADR-09 — Estilos con Tailwind + helper `cn()`, sin librería de componentes
- **Contexto:** queríamos una UI cuidada sin dependencias pesadas.
- **Elección:** Tailwind + componentes propios; `clsx`+`tailwind-merge` para combinar clases.
- **Consecuencias:** control total del diseño; dependencias mínimas.
