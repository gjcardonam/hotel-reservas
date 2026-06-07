"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, CalendarDays, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function isoToday(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export function SearchBar({
  defaultEntrada,
  defaultSalida,
  defaultHuespedes = 2,
  variant = "hero",
}: {
  defaultEntrada?: string;
  defaultSalida?: string;
  defaultHuespedes?: number;
  variant?: "hero" | "inline";
}) {
  const router = useRouter();
  const [entrada, setEntrada] = useState(defaultEntrada ?? isoToday(0));
  const [salida, setSalida] = useState(defaultSalida ?? isoToday(1));
  const [huespedes, setHuespedes] = useState(String(defaultHuespedes));
  const [error, setError] = useState<string | null>(null);

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    if (salida <= entrada) {
      setError("La salida debe ser posterior a la entrada.");
      return;
    }
    setError(null);
    const params = new URLSearchParams({ entrada, salida, huespedes });
    router.push(`/habitaciones?${params.toString()}`);
  }

  return (
    <form
      onSubmit={buscar}
      className={cn(
        "w-full rounded-2xl border border-night-100 bg-white/95 p-3 shadow-lift backdrop-blur",
        variant === "hero" ? "sm:p-4" : ""
      )}
    >
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto_auto] md:items-end">
        <Campo icon={<CalendarDays className="h-4 w-4" />} label="Entrada">
          <input
            type="date"
            value={entrada}
            min={isoToday(0)}
            onChange={(e) => setEntrada(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-night-900 outline-none"
          />
        </Campo>
        <Campo icon={<CalendarDays className="h-4 w-4" />} label="Salida">
          <input
            type="date"
            value={salida}
            min={entrada}
            onChange={(e) => setSalida(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-night-900 outline-none"
          />
        </Campo>
        <Campo icon={<Users className="h-4 w-4" />} label="Huéspedes">
          <select
            value={huespedes}
            onChange={(e) => setHuespedes(e.target.value)}
            className="w-full cursor-pointer bg-transparent text-sm font-medium text-night-900 outline-none"
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "huésped" : "huéspedes"}
              </option>
            ))}
          </select>
        </Campo>
        <Button type="submit" size="lg" className="h-[58px] md:w-auto">
          <Search className="h-4 w-4" />
          Buscar
        </Button>
      </div>
      {error && <p className="mt-2 px-1 text-sm text-rose-600">{error}</p>}
    </form>
  );
}

function Campo({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex h-[58px] cursor-pointer flex-col justify-center rounded-xl border border-night-200 bg-white px-4 transition focus-within:border-night-400 focus-within:ring-4 focus-within:ring-night-100">
      <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-night-400">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}
