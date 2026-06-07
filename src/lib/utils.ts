import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/** Noches entre dos fechas (ignora la hora). */
export function nightsBetween(entrada: Date, salida: Date): number {
  const a = Date.UTC(entrada.getFullYear(), entrada.getMonth(), entrada.getDate());
  const b = Date.UTC(salida.getFullYear(), salida.getMonth(), salida.getDate());
  return Math.max(0, Math.round((b - a) / MS_PER_DAY));
}

export function formatFecha(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatFechaLarga(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** YYYY-MM-DD para inputs date, en zona local. */
export function toDateInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function generarCodigo(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `AUR-${s}`;
}
