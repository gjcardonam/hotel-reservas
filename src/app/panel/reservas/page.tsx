import { CalendarCheck, LogIn, LogOut, BedDouble, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { EmptyState } from "@/components/ui/empty-state";
import { db } from "@/lib/db";
import {
  checkInAction,
  checkOutAction,
  cancelarReservaAction,
} from "@/app/actions/reservas";
import { TIPO_LABEL, ESTADO_RES_LABEL, ESTADOS_RESERVA } from "@/lib/constants";
import { formatCOP, formatFecha } from "@/lib/utils";

export const dynamic = "force-dynamic";

const FILTROS = [
  { key: "TODAS", label: "Todas" },
  ...ESTADOS_RESERVA.map((e) => ({ key: e, label: ESTADO_RES_LABEL[e] })),
];

export default async function PanelReservasPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;
  const filtro = estado && estado !== "TODAS" ? estado : undefined;

  const reservas = await db.reserva.findMany({
    where: filtro ? { estado: filtro } : {},
    include: { cliente: true, habitacion: true },
    orderBy: [{ estado: "asc" }, { fechaEntrada: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-night-900 sm:text-3xl">Reservas</h1>
        <p className="mt-1 text-night-500">
          Administra las reservas y gestiona el check-in / check-out.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {FILTROS.map((f) => {
          const active = (estado ?? "TODAS") === f.key;
          return (
            <a
              key={f.key}
              href={`/panel/reservas?estado=${f.key}`}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-night-900 text-white"
                  : "bg-white text-night-600 ring-1 ring-night-200 hover:bg-night-50"
              }`}
            >
              {f.label}
            </a>
          );
        })}
      </div>

      {reservas.length === 0 ? (
        <EmptyState
          icon={<CalendarCheck className="h-7 w-7" />}
          title="No hay reservas"
          description="No se encontraron reservas para este filtro."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-night-100 bg-white shadow-soft">
          <div className="hidden grid-cols-[1.4fr_1.2fr_1fr_0.8fr_auto] gap-4 border-b border-night-100 bg-night-50/60 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-night-400 lg:grid">
            <span>Huésped</span>
            <span>Habitación</span>
            <span>Estadía</span>
            <span>Total</span>
            <span className="text-right">Acciones</span>
          </div>
          <ul className="divide-y divide-night-100">
            {reservas.map((r) => (
              <li
                key={r.id}
                className="grid grid-cols-1 gap-4 px-6 py-4 lg:grid-cols-[1.4fr_1.2fr_1fr_0.8fr_auto] lg:items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-night-900">
                      {r.cliente.nombre}
                    </span>
                    <Badge estado={r.estado}>{ESTADO_RES_LABEL[r.estado]}</Badge>
                  </div>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-night-400">
                    <Mail className="h-3 w-3" /> {r.cliente.email} · {r.codigo}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-night-700">
                  <BedDouble className="h-4 w-4 text-night-400" />
                  {TIPO_LABEL[r.habitacion.tipo]} · N° {r.habitacion.numero}
                </div>

                <div className="text-sm text-night-600">
                  {formatFecha(r.fechaEntrada)} → {formatFecha(r.fechaSalida)}
                  <span className="block text-xs text-night-400">
                    {r.noches} {r.noches === 1 ? "noche" : "noches"} · {r.huespedes}{" "}
                    huésp.
                  </span>
                </div>

                <div className="font-semibold text-night-900">
                  {formatCOP(r.total)}
                </div>

                <div className="flex justify-start gap-2 lg:justify-end">
                  {r.estado === "CONFIRMADA" && (
                    <>
                      <form action={checkInAction}>
                        <input type="hidden" name="id" value={r.id} />
                        <SubmitButton size="sm" pendingText="…">
                          <LogIn className="h-4 w-4" /> Check-in
                        </SubmitButton>
                      </form>
                      <form action={cancelarReservaAction}>
                        <input type="hidden" name="id" value={r.id} />
                        <SubmitButton
                          size="sm"
                          variant="ghost"
                          className="text-rose-600 hover:bg-rose-50"
                          confirm="¿Cancelar esta reserva?"
                          pendingText="…"
                        >
                          Cancelar
                        </SubmitButton>
                      </form>
                    </>
                  )}
                  {r.estado === "EN_CURSO" && (
                    <form action={checkOutAction}>
                      <input type="hidden" name="id" value={r.id} />
                      <SubmitButton size="sm" variant="dark" pendingText="…">
                        <LogOut className="h-4 w-4" /> Check-out
                      </SubmitButton>
                    </form>
                  )}
                  {(r.estado === "FINALIZADA" || r.estado === "CANCELADA") && (
                    <span className="text-xs text-night-400">Sin acciones</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
