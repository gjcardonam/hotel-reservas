import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Users, ChevronLeft, BedDouble, Star } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { BookingForm } from "@/components/booking-form";
import { db } from "@/lib/db";
import { TIPO_LABEL } from "@/lib/constants";
import { formatCOP } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HabitacionDetallePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ entrada?: string; salida?: string; huespedes?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const room = await db.habitacion.findUnique({ where: { id } });
  if (!room) notFound();

  const servicios = room.servicios.split(",").filter(Boolean);

  return (
    <>
      <Navbar />

      <div className="container-app py-8">
        <Link
          href="/habitaciones"
          className="inline-flex items-center gap-1 text-sm font-medium text-night-500 transition hover:text-night-900"
        >
          <ChevronLeft className="h-4 w-4" /> Volver a habitaciones
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          {/* Columna izquierda: info */}
          <div>
            <div className="overflow-hidden rounded-3xl shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={room.fotoUrl}
                alt={`Habitación ${room.numero}`}
                className="aspect-[16/10] w-full object-cover"
              />
            </div>

            <div className="mt-7">
              <div className="flex flex-wrap items-center gap-3">
                <Badge>
                  <BedDouble className="h-3 w-3" /> {TIPO_LABEL[room.tipo]}
                </Badge>
                <Badge estado={room.estado}>
                  {room.estado === "DISPONIBLE" ? "Disponible" : room.estado}
                </Badge>
                <span className="flex items-center gap-1 text-sm text-night-500">
                  <Star className="h-4 w-4 fill-gold-400 text-gold-400" /> 4.9 · Excelente
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-bold text-night-900 sm:text-4xl">
                Habitación {TIPO_LABEL[room.tipo]} · {room.numero}
              </h1>

              <div className="mt-3 flex items-center gap-2 text-night-500">
                <Users className="h-5 w-5" />
                Capacidad para {room.capacidad}{" "}
                {room.capacidad === 1 ? "persona" : "personas"}
              </div>

              <p className="mt-6 text-pretty leading-relaxed text-night-600">
                {room.descripcion}
              </p>

              <h2 className="mt-9 text-xl font-semibold text-night-900">
                Servicios incluidos
              </h2>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {servicios.map((s) => (
                  <li key={s} className="flex items-center gap-2.5 text-night-700">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Columna derecha: reserva (sticky) */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <div className="mb-5 flex items-baseline justify-between">
                <div>
                  <span className="font-serif text-3xl font-bold text-night-900">
                    {formatCOP(room.precioNoche)}
                  </span>
                  <span className="text-night-400"> / noche</span>
                </div>
              </div>

              {room.estado === "MANTENIMIENTO" ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                  Esta habitación está temporalmente en mantenimiento y no admite
                  reservas.
                </div>
              ) : (
                <BookingForm
                  habitacionId={room.id}
                  precioNoche={room.precioNoche}
                  capacidad={room.capacidad}
                  defaultEntrada={sp.entrada}
                  defaultSalida={sp.salida}
                  defaultHuespedes={Number(sp.huespedes ?? 1) || 1}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
