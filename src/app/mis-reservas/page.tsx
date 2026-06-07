import { Search, CalendarSearch, BedDouble, Calendar, XCircle } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { EmptyState } from "@/components/ui/empty-state";
import { db } from "@/lib/db";
import { cancelarReservaAction } from "@/app/actions/reservas";
import { TIPO_LABEL, ESTADO_RES_LABEL } from "@/lib/constants";
import { formatCOP, formatFecha } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MisReservasPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  const buscado = email?.trim().toLowerCase();

  const reservas = buscado
    ? await db.reserva.findMany({
        where: { cliente: { email: buscado } },
        include: { habitacion: true },
        orderBy: { fechaEntrada: "desc" },
      })
    : [];

  return (
    <>
      <Navbar />
      <section className="border-b border-night-100 bg-white/70">
        <div className="container-app py-12">
          <h1 className="text-3xl font-bold text-night-900 sm:text-4xl">
            Mis reservas
          </h1>
          <p className="mt-2 text-night-500">
            Ingresa el correo con el que reservaste para ver el estado de tus
            estadías.
          </p>
          <form method="get" className="mt-6 flex max-w-md gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-night-400" />
              <Input
                name="email"
                type="email"
                placeholder="tu@email.com"
                defaultValue={buscado ?? ""}
                className="pl-9"
                required
              />
            </div>
            <Button type="submit">Buscar</Button>
          </form>
        </div>
      </section>

      <section className="container-app py-12">
        {!buscado ? (
          <EmptyState
            icon={<CalendarSearch className="h-7 w-7" />}
            title="Consulta tus reservas"
            description="Escribe tu correo arriba para encontrar todas tus reservas en el Hotel Aurora."
          />
        ) : reservas.length === 0 ? (
          <EmptyState
            icon={<CalendarSearch className="h-7 w-7" />}
            title="Sin reservas"
            description={`No encontramos reservas asociadas a ${buscado}.`}
          />
        ) : (
          <div className="space-y-4">
            {reservas.map((r) => {
              const cancelable =
                r.estado === "CONFIRMADA" && r.fechaEntrada > new Date();
              return (
                <div
                  key={r.id}
                  className="flex flex-col gap-4 rounded-2xl border border-night-100 bg-white p-5 shadow-soft sm:flex-row sm:items-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.habitacion.fotoUrl}
                    alt=""
                    className="h-24 w-full rounded-xl object-cover sm:w-32"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge estado={r.estado}>{ESTADO_RES_LABEL[r.estado]}</Badge>
                      <span className="text-xs text-night-400">{r.codigo}</span>
                    </div>
                    <h3 className="mt-1.5 flex items-center gap-1.5 text-lg font-semibold text-night-900">
                      <BedDouble className="h-4 w-4 text-night-400" />
                      {TIPO_LABEL[r.habitacion.tipo]} · N° {r.habitacion.numero}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-night-500">
                      <Calendar className="h-4 w-4" />
                      {formatFecha(r.fechaEntrada)} → {formatFecha(r.fechaSalida)} ·{" "}
                      {r.noches} {r.noches === 1 ? "noche" : "noches"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <span className="font-serif text-xl font-bold text-night-900">
                      {formatCOP(r.total)}
                    </span>
                    {cancelable && (
                      <form action={cancelarReservaAction}>
                        <input type="hidden" name="id" value={r.id} />
                        <SubmitButton
                          variant="ghost"
                          size="sm"
                          className="text-rose-600 hover:bg-rose-50"
                          confirm="¿Seguro que deseas cancelar esta reserva?"
                          pendingText="Cancelando…"
                        >
                          <XCircle className="h-4 w-4" /> Cancelar
                        </SubmitButton>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}
