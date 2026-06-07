import { cookies } from "next/headers";
import { scryptSync, randomBytes, timingSafeEqual, createHmac } from "crypto";
import { db } from "@/lib/db";

const COOKIE = "aurora_session";
const SECRET = process.env.SESSION_SECRET ?? "dev-secret";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashBuf = Buffer.from(hash, "hex");
  const test = scryptSync(password, salt, 64);
  return hashBuf.length === test.length && timingSafeEqual(hashBuf, test);
}

function sign(value: string): string {
  const mac = createHmac("sha256", SECRET).update(value).digest("hex");
  return `${value}.${mac}`;
}

function unsign(signed: string): string | null {
  const idx = signed.lastIndexOf(".");
  if (idx < 0) return null;
  const value = signed.slice(0, idx);
  const mac = signed.slice(idx + 1);
  const expected = createHmac("sha256", SECRET).update(value).digest("hex");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return value;
}

export async function crearSesion(userId: string) {
  const store = await cookies();
  store.set(COOKIE, sign(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function cerrarSesion() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getUsuarioActual() {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return null;
  const userId = unsign(raw);
  if (!userId) return null;
  return db.usuario.findUnique({
    where: { id: userId },
    select: { id: true, email: true, nombre: true, rol: true },
  });
}
