"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { habitacionDisponible } from "@/lib/availability";
import { nightsBetween, generarCodigo } from "@/lib/utils";

function parseFecha(value: string): Date {
  return new Date(`${value}T12:00:00`);
}

export type ReservaState = { error?: string };

export async function crearReservaAction(
  _prev: ReservaState,
  formData: FormData
): Promise<ReservaState> {
  const habitacionId = String(formData.get("habitacionId") ?? "");
  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const telefono = String(formData.get("telefono") ?? "").trim();
  const documento = String(formData.get("documento") ?? "").trim();
  const entradaStr = String(formData.get("entrada") ?? "");
  const salidaStr = String(formData.get("salida") ?? "");
  const huespedes = Number(formData.get("huespedes") ?? 1);

  if (!nombre || !email || !telefono || !documento) {
    return { error: "Completa todos tus datos de contacto." };
  }
  if (!entradaStr || !salidaStr) {
    return { error: "Selecciona las fechas de entrada y salida." };
  }

  const entrada = parseFecha(entradaStr);
  const salida = parseFecha(salidaStr);
  const noches = nightsBetween(entrada, salida);
  if (noches < 1) {
    return { error: "La salida debe ser al menos un día después de la entrada." };
  }

  const habitacion = await db.habitacion.findUnique({ where: { id: habitacionId } });
  if (!habitacion) return { error: "La habitación no existe." };
  if (habitacion.capacidad < huespedes) {
    return { error: "La habitación no admite ese número de huéspedes." };
  }

  const libre = await habitacionDisponible(habitacionId, entrada, salida);
  if (!libre) {
    return {
      error: "Lo sentimos, la habitación ya fue reservada para esas fechas. Prueba con otras.",
    };
  }

  // Cliente: buscar por email o crear (dato maestro)
  let cliente = await db.cliente.findUnique({ where: { email } });
  if (!cliente) {
    cliente = await db.cliente.create({
      data: { nombre, email, telefono, documento },
    });
  }

  const reserva = await db.reserva.create({
    data: {
      codigo: generarCodigo(),
      clienteId: cliente.id,
      habitacionId,
      fechaEntrada: entrada,
      fechaSalida: salida,
      huespedes,
      noches,
      total: noches * habitacion.precioNoche,
      estado: "CONFIRMADA",
    },
  });

  revalidatePath("/habitaciones");
  revalidatePath("/panel");
  redirect(`/confirmacion/${reserva.codigo}`);
}

export async function cancelarReservaAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const reserva = await db.reserva.findUnique({ where: { id } });
  if (!reserva || reserva.estado === "FINALIZADA") return;

  await db.reserva.update({ where: { id }, data: { estado: "CANCELADA" } });
  if (reserva.estado === "EN_CURSO") {
    await db.habitacion.update({
      where: { id: reserva.habitacionId },
      data: { estado: "DISPONIBLE" },
    });
  }
  revalidatePath("/panel");
  revalidatePath("/mis-reservas");
}

export async function checkInAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const reserva = await db.reserva.findUnique({ where: { id } });
  if (!reserva || reserva.estado !== "CONFIRMADA") return;

  await db.reserva.update({
    where: { id },
    data: { estado: "EN_CURSO", checkInAt: new Date() },
  });
  await db.habitacion.update({
    where: { id: reserva.habitacionId },
    data: { estado: "OCUPADA" },
  });
  revalidatePath("/panel");
  revalidatePath("/panel/reservas");
  revalidatePath("/panel/habitaciones");
}

export async function checkOutAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const reserva = await db.reserva.findUnique({ where: { id } });
  if (!reserva || reserva.estado !== "EN_CURSO") return;

  await db.reserva.update({
    where: { id },
    data: { estado: "FINALIZADA", checkOutAt: new Date() },
  });
  await db.habitacion.update({
    where: { id: reserva.habitacionId },
    data: { estado: "DISPONIBLE" },
  });
  revalidatePath("/panel");
  revalidatePath("/panel/reservas");
  revalidatePath("/panel/habitaciones");
}
