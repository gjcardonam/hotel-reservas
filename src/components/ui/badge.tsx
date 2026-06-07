import { cn } from "@/lib/utils";

const ESTADO_STYLES: Record<string, string> = {
  // Habitaciones
  DISPONIBLE: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  OCUPADA: "bg-rose-50 text-rose-700 ring-rose-600/20",
  MANTENIMIENTO: "bg-amber-50 text-amber-700 ring-amber-600/20",
  // Reservas
  CONFIRMADA: "bg-sky-50 text-sky-700 ring-sky-600/20",
  EN_CURSO: "bg-violet-50 text-violet-700 ring-violet-600/20",
  FINALIZADA: "bg-night-100 text-night-600 ring-night-600/20",
  CANCELADA: "bg-rose-50 text-rose-600 ring-rose-600/20",
};

export function Badge({
  children,
  estado,
  className,
}: {
  children: React.ReactNode;
  estado?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        estado ? ESTADO_STYLES[estado] : "bg-night-100 text-night-700 ring-night-600/20",
        className
      )}
    >
      {estado && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            estado === "DISPONIBLE" && "bg-emerald-500",
            estado === "OCUPADA" && "bg-rose-500",
            estado === "MANTENIMIENTO" && "bg-amber-500",
            estado === "CONFIRMADA" && "bg-sky-500",
            estado === "EN_CURSO" && "bg-violet-500",
            estado === "FINALIZADA" && "bg-night-400",
            estado === "CANCELADA" && "bg-rose-400"
          )}
        />
      )}
      {children}
    </span>
  );
}
