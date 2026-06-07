import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Calendar, BedDouble, User, Hash, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { buttonClass } from "@/components/ui/button";
import { db } from "@/lib/db";
import { TIPO_LABEL } from "@/lib/constants";
import { formatCOP, formatFechaLarga } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ConfirmacionPage({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  const reserva = await db.reserva.findUnique({
    where: { codigo },
    include: { cliente: true, habitacion: true },
  });
  if (!reserva) notFound();

  return (
    <>
      <Navbar />
      <div className="container-app py-16">
        <div className="mx-auto max-w-2xl">
          <div className="animate-fade-in text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" strokeWidth={1.5} />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-night-900 sm:text-4xl">
              ¡Reserva confirmada!
            </h1>
            <p className="mt-3 text-night-500">
              Hemos enviado los detalles a{" "}
              <span className="font-medium text-night-700">{reserva.cliente.email}</span>.
              Guarda tu código de reserva.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-night-100 bg-white shadow-soft">
            <div className="flex items-center justify-between bg-night-900 px-6 py-5">
              <div className="flex items-center gap-2 text-night-200">
                <Hash className="h-4 w-4 text-gold-400" />
                <span className="text-sm">Código de reserva</span>
              </div>
              <span className="font-serif text-2xl font-bold tracking-wider text-gold-400">
                {reserva.codigo}
              </span>
            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2">
              <Dato icon={<BedDouble className="h-4 w-4" />} label="Habitación">
                {TIPO_LABEL[reserva.habitacion.tipo]} · N° {reserva.habitacion.numero}
              </Dato>
              <Dato icon={<User className="h-4 w-4" />} label="Huésped">
                {reserva.cliente.nombre}
              </Dato>
              <Dato icon={<Calendar className="h-4 w-4" />} label="Entrada">
                {formatFechaLarga(reserva.fechaEntrada)}
              </Dato>
              <Dato icon={<Calendar className="h-4 w-4" />} label="Salida">
                {formatFechaLarga(reserva.fechaSalida)}
              </Dato>
            </div>

            <div className="flex items-center justify-between border-t border-night-100 bg-night-50 px-6 py-5">
              <div className="text-sm text-night-500">
                {reserva.noches} {reserva.noches === 1 ? "noche" : "noches"} ·{" "}
                {reserva.huespedes} {reserva.huespedes === 1 ? "huésped" : "huéspedes"}
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-night-400">Total</p>
                <p className="font-serif text-2xl font-bold text-night-900">
                  {formatCOP(reserva.total)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={`/mis-reservas?email=${encodeURIComponent(reserva.cliente.email)}`}
              className={buttonClass("dark", "md")}
            >
              Ver mis reservas <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/" className={buttonClass("outline", "md")}>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function Dato({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-night-50 text-night-500">
        {icon}
      </span>
      <div>
        <p className="text-xs uppercase tracking-wide text-night-400">{label}</p>
        <p className="mt-0.5 font-medium text-night-800">{children}</p>
      </div>
    </div>
  );
}
