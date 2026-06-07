"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifyPassword, crearSesion, cerrarSesion } from "@/lib/auth";

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Ingresa tu correo y contraseña." };
  }

  const usuario = await db.usuario.findUnique({ where: { email } });
  if (!usuario || !verifyPassword(password, usuario.passwordHash)) {
    return { error: "Credenciales incorrectas. Verifica tus datos." };
  }

  await crearSesion(usuario.id);
  redirect("/panel");
}

export async function logoutAction() {
  await cerrarSesion();
  redirect("/login");
}
