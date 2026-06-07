import Link from "next/link";
import { Users, ArrowRight, BedDouble } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { formatCOP } from "@/lib/utils";
import { TIPO_LABEL } from "@/lib/constants";

type Room = {
  id: string;
  numero: string;
  tipo: string;
  descripcion: string;
  precioNoche: number;
  capacidad: number;
  fotoUrl: string;
  servicios: string;
};

export function RoomCard({ room, query }: { room: Room; query?: string }) {
  const href = `/habitaciones/${room.id}${query ? `?${query}` : ""}`;
  const servicios = room.servicios.split(",").slice(0, 3);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-night-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={room.fotoUrl}
          alt={`Habitación ${room.numero} — ${TIPO_LABEL[room.tipo]}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <Badge className="bg-white/90 text-night-800 ring-white/40 backdrop-blur">
            <BedDouble className="h-3 w-3" /> {TIPO_LABEL[room.tipo]}
          </Badge>
          <span className="rounded-full bg-night-900/80 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur">
            Hab. {room.numero}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5 text-sm text-night-500">
          <Users className="h-4 w-4" />
          Hasta {room.capacidad} {room.capacidad === 1 ? "persona" : "personas"}
        </div>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-night-600">
          {room.descripcion}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {servicios.map((s) => (
            <span
              key={s}
              className="rounded-md bg-night-50 px-2 py-0.5 text-[11px] font-medium text-night-500"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-end justify-between border-t border-night-100 pt-4">
          <div>
            <span className="font-serif text-2xl font-bold text-night-900">
              {formatCOP(room.precioNoche)}
            </span>
            <span className="text-sm text-night-400"> / noche</span>
          </div>
          <Link href={href} className={buttonClass("dark", "sm")}>
            Reservar <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
