# 📋 Planeación del proyecto — Hotel Aurora

Documento de planeación previo y durante la construcción. Define **qué** se construye,
**para quién**, con qué **prioridad** y **cómo** nos organizamos.

---

## 1. Visión del producto
Un sistema de reservas para el **Hotel Aurora** donde los **clientes** consultan
disponibilidad y reservan en línea, y el **personal** administra habitaciones, clientes y
reservas, incluyendo el flujo operativo de **check-in / check-out**.

## 2. Alcance

**Dentro del alcance**
- Búsqueda de disponibilidad por fechas y nº de huéspedes.
- Reserva en línea con confirmación.
- Gestión (CRUD) de habitaciones y clientes — *datos maestros*.
- Gestión de reservas y check-in / check-out — *datos transaccionales*.
- Panel con autenticación y roles. Dashboard operativo.

**Fuera del alcance** (decisión consciente para acotar el proyecto)
- Pasarela de pago real.
- Notificaciones por correo/SMS.
- Tarifas dinámicas por temporada, descuentos o cupones.
- App móvil nativa.

## 3. Actores
| Actor | Descripción |
|-------|-------------|
| **Cliente** | Visitante del sitio público; busca y reserva. No requiere login. |
| **Recepción (PERSONAL)** | Operación diaria: reservas, check-in/out, clientes. |
| **Administrador (ADMIN)** | Todo lo anterior + alta/baja de habitaciones y clientes. |

## 4. Requisitos funcionales (RF)
- **RF1** Buscar habitaciones disponibles por rango de fechas y huéspedes.
- **RF2** Ver el detalle de una habitación (fotos, servicios, precio, capacidad).
- **RF3** Crear una reserva y recibir un código de confirmación.
- **RF4** Consultar mis reservas por correo y cancelar una futura.
- **RF5** Autenticar al personal y proteger el panel.
- **RF6** CRUD de habitaciones (solo ADMIN crea/elimina).
- **RF7** CRUD de clientes (solo ADMIN elimina).
- **RF8** Listar y filtrar reservas; hacer check-in y check-out.
- **RF9** Dashboard con ocupación, llegadas/salidas del día e ingresos.

## 5. Requisitos no funcionales (RNF)
- **RNF1 Integridad:** nunca permitir doble reserva de una habitación en fechas solapadas.
- **RNF2 Seguridad:** contraseñas con hash; sesión firmada; el precio se calcula en servidor.
- **RNF3 Usabilidad:** responsive, estados de carga/vacío/error, mensajes claros.
- **RNF4 Mantenibilidad:** código limpio, sin librerías innecesarias.
- **RNF5 Disponibilidad:** desplegado y accesible vía link en vivo.

## 6. Historias de usuario (con criterios de aceptación y prioridad MoSCoW)

| # | Como… | quiero… | para… | Prioridad | Criterio de aceptación |
|---|-------|---------|-------|-----------|------------------------|
| HU-01 | cliente | buscar por fechas | ver qué hay libre | **Must** | Solo aparecen habitaciones sin reserva solapada en ese rango |
| HU-02 | cliente | ver detalle de una habitación | decidir | **Must** | Muestra precio, capacidad, servicios y fotos |
| HU-03 | cliente | reservar | asegurar mi estadía | **Must** | No deja reservar fechas ya ocupadas; entrega un código |
| HU-04 | cliente | ver/cancelar mis reservas | gestionarlas | **Should** | Busca por correo; cancela solo reservas futuras |
| HU-05 | recepción | hacer check-in/out | operar el hotel | **Must** | Cambia estado de reserva y de la habitación |
| HU-06 | recepción | ver un dashboard | controlar el día | **Must** | Ocupación %, llegadas/salidas de hoy, ingresos |
| HU-07 | admin | administrar habitaciones | mantener el catálogo | **Must** | CRUD; no permite borrar con reservas activas |
| HU-08 | admin | administrar clientes | mantener el registro | **Should** | CRUD; borrado solo sin reservas |
| HU-09 | cliente | filtrar/ordenar | encontrar más rápido | **Could** | (Mejora futura) |

## 7. Plan de trabajo (sprints)
| Sprint | Objetivo | Entregable |
|--------|----------|------------|
| 1 | Cimientos | Scaffold, modelo de datos, diseño visual |
| 2 | Maestros | CRUD habitaciones y clientes + datos de ejemplo |
| 3 | Núcleo | Búsqueda de disponibilidad + reserva + confirmación |
| 4 | Operación | Check-in/out, dashboard, roles |
| 5 | Cierre | Pulido, responsive, despliegue, documentación |

## 8. Reparto del equipo
| Integrante | Responsabilidad principal |
|------------|---------------------------|
| **Gabriel** | UI/UX, componentes, despliegue, flujo del cliente |
| **Andrés David** | Modelo de datos, Server Actions, lógica de disponibilidad |
| **Mariana** | Panel, roles, dashboard, check-in/out |
