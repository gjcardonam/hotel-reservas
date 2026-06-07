# 📐 Diagramas — Hotel Aurora

Diagramas de diseño que muestran cómo pensamos el flujo y la arquitectura antes y durante
la construcción. (GitHub los renderiza automáticamente.)

---

## 1. Flujo de una reserva (cliente)

```mermaid
flowchart TD
    A[Cliente elige fechas y huéspedes] --> B[habitacionesDisponibles]
    B -->|excluye solapes y mantenimiento| C[Lista de habitaciones libres]
    C --> D[Elige habitación y llena sus datos]
    D --> E[crearReservaAction en el servidor]
    E --> F{¿Sigue disponible?}
    F -->|No| G[Error: ya fue reservada]
    F -->|Sí| H[Busca o crea el Cliente por email]
    H --> I[Crea Reserva CONFIRMADA con total calculado en servidor]
    I --> J[Redirige a confirmación con código AUR-xxxx]
```

---

## 2. Ciclo de vida de la reserva (máquina de estados)

```mermaid
stateDiagram-v2
    [*] --> CONFIRMADA: crear reserva
    CONFIRMADA --> EN_CURSO: check-in / habitación → OCUPADA
    EN_CURSO --> FINALIZADA: check-out / habitación → DISPONIBLE
    CONFIRMADA --> CANCELADA: cancelar
    EN_CURSO --> CANCELADA: cancelar / libera habitación
    FINALIZADA --> [*]
    CANCELADA --> [*]
```

Las transiciones se validan: solo se hace check-in a una reserva `CONFIRMADA` y check-out a
una `EN_CURSO`. Implementado en `src/app/actions/reservas.ts`.

---

## 3. Arquitectura por capas

```mermaid
flowchart LR
    subgraph Cliente_Navegador
      UI[Componentes React]
    end
    subgraph Servidor_Next
      RSC[Server Components / páginas]
      SA[Server Actions]
    end
    subgraph Datos
      P[(Prisma)]
      DB[(PostgreSQL)]
    end
    UI -->|navegación| RSC
    UI -->|formularios| SA
    RSC --> P
    SA --> P
    P --> DB
```

- **Server Components/páginas** leen datos (consultas Prisma).
- **Server Actions** escriben (crear/actualizar/eliminar) y revalidan la vista.
- **Prisma** traduce a SQL sobre **PostgreSQL**.

---

## 4. Matriz de roles y permisos

| Acción | Cliente | Recepción (PERSONAL) | Administrador (ADMIN) |
|--------|:------:|:--------------------:|:---------------------:|
| Buscar y reservar (sitio público) | ✅ | ✅ | ✅ |
| Entrar al panel | ❌ | ✅ | ✅ |
| Check-in / check-out / cancelar | ❌ | ✅ | ✅ |
| Registrar/editar clientes | ❌ | ✅ | ✅ |
| Cambiar estado de habitación | ❌ | ✅ | ✅ |
| **Crear / eliminar habitaciones** | ❌ | ❌ | ✅ |
| **Eliminar clientes** | ❌ | ❌ | ✅ |

La restricción de las dos últimas filas se aplica **en el servidor** (Server Actions) y
además se oculta en la interfaz.
