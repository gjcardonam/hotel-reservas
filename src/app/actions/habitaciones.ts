"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getUsuarioActual } from "@/lib/auth";

export type CrudState = { ok?: boolean; error?: string };

async function esAdmin(): Promise<boolean> {
  const u = await getUsuarioActual();
  return u?.rol === "ADMIN";
}

function leerHabitacion(formData: FormData) {
  return {
    numero: String(formData.get("numero") ?? "").trim(),
    tipo: String(formData.get("tipo") ?? "DOBLE"),
    descripcion: String(formData.get("descripcion") ?? "").trim(),
    precioNoche: Number(formData.get("precioNoche") ?? 0),
    capacidad: Number(formData.get("capacidad") ?? 1),
    estado: String(formData.get("estado") ?? "DISPONIBLE"),
    fotoUrl: String(formData.get("fotoUrl") ?? "").trim(),
    servicios: String(formData.get("servicios") ?? "").trim(),
  };
}

function validar(data: ReturnType<typeof leerHabitacion>): string | null {
  if (!data.numero) return "El número de habitación es obligatorio.";
  if (!data.descripcion) return "Agrega una descripción.";
  if (!data.precioNoche || data.precioNoche <= 0) return "El precio por noche debe ser mayor a 0.";
  if (!data.capacidad || data.capacidad < 1) return "La capacidad debe ser al menos 1.";
  return null;
}

const FOTO_DEFAULT =
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80";

export async function crearHabitacionAction(
  _prev: CrudState,
  formData: FormData
): Promise<CrudState> {
  if (!(await esAdmin()))
    return { error: "Solo un administrador puede crear habitaciones." };
  const data = leerHabitacion(formData);
  const error = validar(data);
  if (error) return { error };

  try {
    await db.habitacion.create({
      data: { ...data, fotoUrl: data.fotoUrl || FOTO_DEFAULT },
    });
  } catch {
    return { error: `Ya existe una habitación con el número ${data.numero}.` };
  }
  revalidatePath("/panel/habitaciones");
  revalidatePath("/panel");
  return { ok: true };
}

export async function actualizarHabitacionAction(
  _prev: CrudState,
  formData: FormData
): Promise<CrudState> {
  const id = String(formData.get("id") ?? "");
  const data = leerHabitacion(formData);
  const error = validar(data);
  if (error) return { error };

  try {
    await db.habitacion.update({
      where: { id },
      data: { ...data, fotoUrl: data.fotoUrl || FOTO_DEFAULT },
    });
  } catch {
    return { error: `No se pudo actualizar. ¿El número ${data.numero} ya está en uso?` };
  }
  revalidatePath("/panel/habitaciones");
  revalidatePath("/panel");
  return { ok: true };
}

export async function eliminarHabitacionAction(formData: FormData) {
  if (!(await esAdmin())) return; // solo administración
  const id = String(formData.get("id") ?? "");
  const reservasActivas = await db.reserva.count({
    where: { habitacionId: id, estado: { in: ["CONFIRMADA", "EN_CURSO"] } },
  });
  if (reservasActivas > 0) return; // protegida: tiene reservas activas
  try {
    await db.reserva.deleteMany({ where: { habitacionId: id } });
    await db.habitacion.delete({ where: { id } });
  } catch {
    /* noop */
  }
  revalidatePath("/panel/habitaciones");
  revalidatePath("/panel");
}

export async function cambiarEstadoHabitacionAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const estado = String(formData.get("estado") ?? "");
  if (!["DISPONIBLE", "OCUPADA", "MANTENIMIENTO"].includes(estado)) return;
  await db.habitacion.update({ where: { id }, data: { estado } });
  revalidatePath("/panel/habitaciones");
  revalidatePath("/panel");
}
