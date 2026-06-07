import Link from "next/link";
import {
  TrendingUp,
  LogIn,
  LogOut,
  BedDouble,
  DollarSign,
  CalendarCheck,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { db } from "@/lib/db";
import { TIPO_LABEL } from "@/lib/constants";
import { formatCOP, formatFecha } from "@/lib/utils";

export const dynamic = "force-dynamic";

function rangoHoy() {
  const inicio = new Date();
  inicio.setHours(0, 0, 0, 0);
  const fin = new Date();
  fin.setHours(23, 59, 59, 999);
  return { inicio, fin };
}

export default async function DashboardPage() {
  const { inicio, fin } = rangoHoy();

  const [
    habitaciones,
    reservasActivas,
    checkInsHoy,
    checkOutsHoy,
    ingresosAgg,
    proximas,
  ] = await Promise.all([
    db.habitacion.findMany(),
    db.reserva.count({ where: { estado: { in: ["CONFIRMADA", "EN_CURSO"] } } }),
    db.reserva.findMany({
      where: { estado: "CONFIRMADA", fechaEntrada: { gte: inicio, lte: fin } },
      include: { cliente: true, habitacion: true },
    }),
    db.reserva.findMany({
      where: { estado: "EN_CURSO", fechaSalida: { gte: inicio, lte: fin } },
      include: { cliente: true, habitacion: true },
    }),
    db.reserva.aggregate({
      _sum: { total: true },
      where: { estado: { not: "CANCELADA" } },
    }),
    db.reserva.findMany({
      where: { estado: "CONFIRMADA", fechaEntrada: { gte: inicio } },
      include: { cliente: true, habitacion: true },
      orderBy: { fechaEntrada: "asc" },
      take: 5,
    }),
  ]);

  const total = habitaciones.length;
  const ocupadas = habitaciones.filter((h) => h.estado === "OCUPADA").length;
  const disponibles = habitaciones.filter((h) => h.estado === "DISPONIBLE").length;
  const mantenimiento = habitaciones.filter((h) => h.estado === "MANTENIMIENTO").length;
  const ocupacion = total > 0 ? Math.round((ocupadas / total) * 100) : 0;
  const ingresos = ingresosAgg._sum.total ?? 0;

  const stats = [
    {
      label: "Ocupación",
      value: `${ocupacion}%`,
      sub: `${ocupadas} de ${total} habitaciones`,
      icon: TrendingUp,
      tint: "bg-violet-50 text-violet-600",
    },
    {
      label: "Check-ins hoy",
      value: checkInsHoy.length,
      sub: "Llegadas programadas",
      icon: LogIn,
      tint: "bg-sky-50 text-sky-600",
    },
    {
      label: "Check-outs hoy",
      value: checkOutsHoy.length,
      sub: "Salidas programadas",
      icon: LogOut,
      tint: "bg-amber-50 text-amber-600",
    },
    {
      label: "Ingresos",
      value: formatCOP(ingresos),
      sub: "Reservas no canceladas",
      icon: DollarSign,
      tint: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-night-900 sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-night-500">Resumen operativo del Hotel Aurora.</p>
        </div>
        <Link href="/panel/reservas" className={buttonClass("dark", "md")}>
          <CalendarCheck className="h-4 w-4" /> Gestionar reservas
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center justify-between">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.tint}`}>
                <s.icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 font-serif text-2xl font-bold text-night-900">
              {s.value}
            </p>
            <p className="text-sm font-medium text-night-700">{s.label}</p>
            <p className="text-xs text-night-400">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Estado de habitaciones */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-night-900">
            Estado de habitaciones
          </h2>
          <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-night-100">
            {disponibles > 0 && (
              <div
                className="bg-emerald-400"
                style={{ width: `${(disponibles / total) * 100}%` }}
              />
            )}
            {ocupadas > 0 && (
              <div
                className="bg-rose-400"
                style={{ width: `${(ocupadas / total) * 100}%` }}
              />
            )}
            {mantenimiento > 0 && (
              <div
                className="bg-amber-400"
                style={{ width: `${(mantenimiento / total) * 100}%` }}
              />
            )}
          </div>
          <ul className="mt-5 space-y-3">
            <LeyendaItem color="bg-emerald-400" label="Disponibles" valor={disponibles} />
            <LeyendaItem color="bg-rose-400" label="Ocupadas" valor={ocupadas} />
            <LeyendaItem color="bg-amber-400" label="Mantenimiento" valor={mantenimiento} />
          </ul>
        </div>

        {/* Próximas llegadas */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-night-900">Próximas llegadas</h2>
            <Link
              href="/panel/reservas"
              className="inline-flex items-center gap-1 text-sm font-medium text-gold-600 hover:text-gold-700"
            >
              Ver todas <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {proximas.length === 0 ? (
            <EmptyState
              className="mt-4 py-8"
              icon={<CalendarCheck className="h-6 w-6" />}
              title="Sin llegadas próximas"
            />
          ) : (
            <ul className="mt-4 divide-y divide-night-100">
              {proximas.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-night-50 text-night-500">
                      <BedDouble className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-medium text-night-800">{r.cliente.nombre}</p>
                      <p className="text-xs text-night-400">
                        {TIPO_LABEL[r.habitacion.tipo]} · N° {r.habitacion.numero}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-night-700">
                      {formatFecha(r.fechaEntrada)}
                    </p>
                    <Badge estado={r.estado}>{r.estado}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function LeyendaItem({
  color,
  label,
  valor,
}: {
  color: string;
  label: string;
  valor: number;
}) {
  return (
    <li className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm text-night-600">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
        {label}
      </span>
      <span className="font-semibold text-night-900">{valor}</span>
    </li>
  );
}
