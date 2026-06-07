import { Trash2, Users, Wrench, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { HabitacionForm } from "@/components/panel/habitacion-form";
import { db } from "@/lib/db";
import {
  eliminarHabitacionAction,
  cambiarEstadoHabitacionAction,
} from "@/app/actions/habitaciones";
import { TIPO_LABEL, ESTADO_HAB_LABEL } from "@/lib/constants";
import { formatCOP } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PanelHabitacionesPage() {
  const habitaciones = await db.habitacion.findMany({
    orderBy: { numero: "asc" },
    include: { _count: { select: { reservas: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-night-900 sm:text-3xl">Habitaciones</h1>
          <p className="mt-1 text-night-500">
            {habitaciones.length} habitaciones · datos maestros del hotel.
          </p>
        </div>
        <HabitacionForm />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {habitaciones.map((h) => (
          <div
            key={h.id}
            className="overflow-hidden rounded-2xl border border-night-100 bg-white shadow-soft"
          >
            <div className="relative aspect-[16/10]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={h.fotoUrl} alt="" className="h-full w-full object-cover" />
              <div className="absolute left-3 top-3">
                <Badge estado={h.estado}>{ESTADO_HAB_LABEL[h.estado]}</Badge>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-night-900">
                    N° {h.numero} · {TIPO_LABEL[h.tipo]}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-night-500">
                    <Users className="h-4 w-4" /> {h.capacidad} pers. ·{" "}
                    {formatCOP(h.precioNoche)}/noche
                  </p>
                </div>
                <div className="flex items-center">
                  <HabitacionForm habitacion={h} />
                  <form action={eliminarHabitacionAction}>
                    <input type="hidden" name="id" value={h.id} />
                    <SubmitButton
                      size="sm"
                      variant="ghost"
                      className="h-9 w-9 p-0 text-rose-500 hover:bg-rose-50"
                      confirm="¿Eliminar esta habitación? Se borrarán sus reservas asociadas. (No se permite si tiene reservas activas.)"
                      pendingText=""
                    >
                      <Trash2 className="h-4 w-4" />
                    </SubmitButton>
                  </form>
                </div>
              </div>

              {/* Cambio rápido de estado */}
              <div className="mt-4 flex gap-2 border-t border-night-100 pt-4">
                {h.estado !== "DISPONIBLE" && (
                  <form action={cambiarEstadoHabitacionAction} className="flex-1">
                    <input type="hidden" name="id" value={h.id} />
                    <input type="hidden" name="estado" value="DISPONIBLE" />
                    <SubmitButton size="sm" variant="outline" className="w-full" pendingText="…">
                      <CheckCircle2 className="h-4 w-4" /> Liberar
                    </SubmitButton>
                  </form>
                )}
                {h.estado !== "MANTENIMIENTO" && (
                  <form action={cambiarEstadoHabitacionAction} className="flex-1">
                    <input type="hidden" name="id" value={h.id} />
                    <input type="hidden" name="estado" value="MANTENIMIENTO" />
                    <SubmitButton size="sm" variant="outline" className="w-full" pendingText="…">
                      <Wrench className="h-4 w-4" /> Mantenimiento
                    </SubmitButton>
                  </form>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
