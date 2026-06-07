import { db } from "@/lib/db";

/** Estados de reserva que bloquean una habitación en un rango de fechas. */
const ESTADOS_BLOQUEANTES = ["CONFIRMADA", "EN_CURSO"];

/**
 * Regla de solape: dos rangos [a1,a2) y [b1,b2) chocan si  a1 < b2  &&  b1 < a2.
 * Una salida que coincide con la entrada de otra reserva NO se solapa
 * (el huésped sale en la mañana, el siguiente entra en la tarde).
 *
 * ¿La habitación tiene alguna reserva activa que choque con el rango pedido?
 */
export async function habitacionDisponible(
  habitacionId: string,
  entrada: Date,
  salida: Date,
  excluirReservaId?: string
): Promise<boolean> {
  const choques = await db.reserva.findMany({
    where: {
      habitacionId,
      estado: { in: ESTADOS_BLOQUEANTES },
      ...(excluirReservaId ? { id: { not: excluirReservaId } } : {}),
      // Solape a nivel de query: entrada < salidaPedida && salida > entradaPedida
      fechaEntrada: { lt: salida },
      fechaSalida: { gt: entrada },
    },
    select: { id: true },
  });
  return choques.length === 0;
}

/** Habitaciones libres en el rango (excluye las en mantenimiento). */
export async function habitacionesDisponibles(
  entrada: Date,
  salida: Date,
  huespedes = 1
) {
  const habitaciones = await db.habitacion.findMany({
    where: {
      estado: { not: "MANTENIMIENTO" },
      capacidad: { gte: huespedes },
    },
    orderBy: { precioNoche: "asc" },
  });

  const reservasActivas = await db.reserva.findMany({
    where: {
      estado: { in: ESTADOS_BLOQUEANTES },
      fechaEntrada: { lt: salida },
      fechaSalida: { gt: entrada },
    },
    select: { habitacionId: true },
  });

  const ocupadas = new Set(reservasActivas.map((r) => r.habitacionId));
  return habitaciones.filter((h) => !ocupadas.has(h.id));
}
