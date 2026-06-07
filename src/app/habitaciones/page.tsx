import { BedDouble, SearchX } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SearchBar } from "@/components/search-bar";
import { RoomCard } from "@/components/room-card";
import { EmptyState } from "@/components/ui/empty-state";
import { db } from "@/lib/db";
import { habitacionesDisponibles } from "@/lib/availability";
import { formatFecha, nightsBetween } from "@/lib/utils";

export const dynamic = "force-dynamic";

function parse(value?: string): Date | null {
  if (!value) return null;
  const d = new Date(`${value}T12:00:00`);
  return isNaN(d.getTime()) ? null : d;
}

export default async function HabitacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ entrada?: string; salida?: string; huespedes?: string }>;
}) {
  const sp = await searchParams;
  const entrada = parse(sp.entrada);
  const salida = parse(sp.salida);
  const huespedes = Number(sp.huespedes ?? 2) || 2;

  const buscando = !!(entrada && salida && salida > entrada);

  const habitaciones = buscando
    ? await habitacionesDisponibles(entrada!, salida!, huespedes)
    : await db.habitacion.findMany({
        where: { estado: { not: "MANTENIMIENTO" } },
        orderBy: { precioNoche: "asc" },
      });

  const query = buscando
    ? new URLSearchParams({
        entrada: sp.entrada!,
        salida: sp.salida!,
        huespedes: String(huespedes),
      }).toString()
    : "";

  const noches = buscando ? nightsBetween(entrada!, salida!) : 0;

  return (
    <>
      <Navbar />

      <section className="border-b border-night-100 bg-white/70">
        <div className="container-app py-10">
          <h1 className="text-3xl font-bold text-night-900 sm:text-4xl">
            {buscando ? "Habitaciones disponibles" : "Nuestras habitaciones"}
          </h1>
          <p className="mt-2 text-night-500">
            {buscando
              ? `${formatFecha(entrada!)} → ${formatFecha(salida!)} · ${noches} ${
                  noches === 1 ? "noche" : "noches"
                } · ${huespedes} ${huespedes === 1 ? "huésped" : "huéspedes"}`
              : "Explora todas nuestras opciones o busca por fechas para ver disponibilidad."}
          </p>
          <div className="mt-6 max-w-3xl">
            <SearchBar
              variant="inline"
              defaultEntrada={sp.entrada}
              defaultSalida={sp.salida}
              defaultHuespedes={huespedes}
            />
          </div>
        </div>
      </section>

      <section className="container-app py-12">
        {habitaciones.length > 0 ? (
          <>
            <p className="mb-6 text-sm font-medium text-night-500">
              {habitaciones.length}{" "}
              {habitaciones.length === 1
                ? "habitación encontrada"
                : "habitaciones encontradas"}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {habitaciones.map((room) => (
                <RoomCard key={room.id} room={room} query={query} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            icon={<SearchX className="h-7 w-7" />}
            title="No hay habitaciones disponibles"
            description={
              buscando
                ? "No encontramos habitaciones libres para esas fechas y número de huéspedes. Prueba con otro rango."
                : "Aún no hay habitaciones cargadas."
            }
          />
        )}
      </section>

      <Footer />
    </>
  );
}
