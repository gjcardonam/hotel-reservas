import Link from "next/link";
import { Hotel, LayoutDashboard, CalendarCheck } from "lucide-react";
import { buttonClass } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-night-100/80 bg-sand-50/85 backdrop-blur-md">
      <nav className="container-app flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-night-900 text-gold-400">
            <Hotel className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-lg font-bold text-night-900">
              Aurora
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold-600">
              Hotel & Suites
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-night-600 transition hover:bg-night-100 hover:text-night-900"
          >
            Inicio
          </Link>
          <Link
            href="/habitaciones"
            className="rounded-lg px-3 py-2 text-sm font-medium text-night-600 transition hover:bg-night-100 hover:text-night-900"
          >
            Habitaciones
          </Link>
          <Link
            href="/mis-reservas"
            className="rounded-lg px-3 py-2 text-sm font-medium text-night-600 transition hover:bg-night-100 hover:text-night-900"
          >
            Mis reservas
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/mis-reservas"
            className={buttonClass("ghost", "sm", "md:hidden")}
            aria-label="Mis reservas"
          >
            <CalendarCheck className="h-4 w-4" />
          </Link>
          <Link href="/panel" className={buttonClass("dark", "sm")}>
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Acceso personal</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
