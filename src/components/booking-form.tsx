"use client";

import { useActionState, useState } from "react";
import { CalendarDays, Users, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { crearReservaAction, type ReservaState } from "@/app/actions/reservas";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import { formatCOP, nightsBetween } from "@/lib/utils";

function iso(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export function BookingForm({
  habitacionId,
  precioNoche,
  capacidad,
  defaultEntrada,
  defaultSalida,
  defaultHuespedes = 1,
}: {
  habitacionId: string;
  precioNoche: number;
  capacidad: number;
  defaultEntrada?: string;
  defaultSalida?: string;
  defaultHuespedes?: number;
}) {
  const [state, formAction, isPending] = useActionState<ReservaState, FormData>(
    crearReservaAction,
    {}
  );
  const [entrada, setEntrada] = useState(defaultEntrada ?? iso(0));
  const [salida, setSalida] = useState(defaultSalida ?? iso(1));
  const [huespedes, setHuespedes] = useState(
    String(Math.min(defaultHuespedes, capacidad))
  );

  const noches = nightsBetween(
    new Date(`${entrada}T12:00:00`),
    new Date(`${salida}T12:00:00`)
  );
  const total = noches * precioNoche;

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="habitacionId" value={habitacionId} />

      {/* Fechas */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="entrada">Entrada</Label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-night-400" />
            <Input
              id="entrada"
              type="date"
              name="entrada"
              min={iso(0)}
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
              className="pl-9"
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="salida">Salida</Label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-night-400" />
            <Input
              id="salida"
              type="date"
              name="salida"
              min={entrada}
              value={salida}
              onChange={(e) => setSalida(e.target.value)}
              className="pl-9"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="huespedes">Huéspedes</Label>
        <div className="relative">
          <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-night-400" />
          <select
            id="huespedes"
            name="huespedes"
            value={huespedes}
            onChange={(e) => setHuespedes(e.target.value)}
            className="input-base cursor-pointer pl-9"
          >
            {Array.from({ length: capacidad }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "huésped" : "huéspedes"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-px bg-night-100" />

      {/* Datos del huésped */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-night-700">Tus datos</p>
        <div>
          <Label htmlFor="nombre">Nombre completo</Label>
          <Input id="nombre" name="nombre" placeholder="Ej: Gabriel Cardona" required />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="email">Correo</Label>
            <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
          </div>
          <div>
            <Label htmlFor="telefono">Teléfono</Label>
            <Input id="telefono" name="telefono" placeholder="300 000 0000" required />
          </div>
        </div>
        <div>
          <Label htmlFor="documento">Documento</Label>
          <Input id="documento" name="documento" placeholder="N° de identificación" required />
        </div>
      </div>

      {/* Resumen de precio */}
      <div className="rounded-xl bg-night-50 p-4">
        <div className="flex items-center justify-between text-sm text-night-600">
          <span>
            {formatCOP(precioNoche)} × {noches} {noches === 1 ? "noche" : "noches"}
          </span>
          <span>{formatCOP(total)}</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-night-200 pt-3">
          <span className="font-semibold text-night-900">Total</span>
          <span className="font-serif text-2xl font-bold text-night-900">
            {formatCOP(total)}
          </span>
        </div>
      </div>

      {state.error && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isPending || noches < 1}>
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Procesando…
          </>
        ) : (
          <>Confirmar reserva · {formatCOP(total)}</>
        )}
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-xs text-night-400">
        <ShieldCheck className="h-3.5 w-3.5" /> Confirmación inmediata · Sin costos ocultos
      </p>
    </form>
  );
}
