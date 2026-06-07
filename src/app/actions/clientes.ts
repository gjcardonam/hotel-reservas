"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getUsuarioActual } from "@/lib/auth";
import type { CrudState } from "./habitaciones";

function leerCliente(formData: FormData) {
  return {
    nombre: String(formData.get("nombre") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    telefono: String(formData.get("telefono") ?? "").trim(),
    documento: String(formData.get("documento") ?? "").trim(),
    pais: String(formData.get("pais") ?? "Colombia").trim(),
  };
}

function validar(d: ReturnType<typeof leerCliente>): string | null {
  if (!d.nombre) return "El nombre es obligatorio.";
  if (!d.email || !d.email.includes("@")) return "Ingresa un correo válido.";
  if (!d.telefono) return "El teléfono es obligatorio.";
  if (!d.documento) return "El documento es obligatorio.";
  return null;
}

export async function crearClienteAction(
  _prev: CrudState,
  formData: FormData
): Promise<CrudState> {
  const data = leerCliente(formData);
  const error = validar(data);
  if (error) return { error };
  try {
    await db.cliente.create({ data });
  } catch {
    return { error: `Ya existe un cliente con el correo ${data.email}.` };
  }
  revalidatePath("/panel/clientes");
  return { ok: true };
}

export async function actualizarClienteAction(
  _prev: CrudState,
  formData: FormData
): Promise<CrudState> {
  const id = String(formData.get("id") ?? "");
  const data = leerCliente(formData);
  const error = validar(data);
  if (error) return { error };
  try {
    await db.cliente.update({ where: { id }, data });
  } catch {
    return { error: `No se pudo actualizar. ¿El correo ${data.email} ya está en uso?` };
  }
  revalidatePath("/panel/clientes");
  return { ok: true };
}

export async function eliminarClienteAction(formData: FormData) {
  const u = await getUsuarioActual();
  if (u?.rol !== "ADMIN") return; // solo administración
  const id = String(formData.get("id") ?? "");
  const reservas = await db.reserva.count({ where: { clienteId: id } });
  if (reservas > 0) return; // protegido: tiene historial de reservas
  try {
    await db.cliente.delete({ where: { id } });
  } catch {
    /* noop */
  }
  revalidatePath("/panel/clientes");
}
