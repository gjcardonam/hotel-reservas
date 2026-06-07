"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  BedDouble,
  Users,
  Hotel,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/actions/auth";

const links = [
  { href: "/panel", label: "Dashboard", icon: LayoutDashboard },
  { href: "/panel/reservas", label: "Reservas", icon: CalendarCheck },
  { href: "/panel/habitaciones", label: "Habitaciones", icon: BedDouble },
  { href: "/panel/clientes", label: "Clientes", icon: Users },
];

export function Sidebar({ nombre }: { nombre: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col gap-6 p-5">
      <Link href="/panel" className="flex items-center gap-2.5 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-500 text-night-950">
          <Hotel className="h-5 w-5" />
        </span>
        <span className="flex flex-col leading-none">
          <span className="font-serif text-lg font-bold text-white">Aurora</span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-night-300">
            Administración
          </span>
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map((l) => {
          const active =
            l.href === "/panel"
              ? pathname === "/panel"
              : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-white/10 text-white"
                  : "text-night-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <l.icon className="h-[18px] w-[18px]" />
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 pt-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-night-300 transition hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-[18px] w-[18px]" />
          Ver sitio público
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-night-300 transition hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Cerrar sesión
          </button>
        </form>
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500/20 text-xs font-bold text-gold-300">
            {nombre.slice(0, 2).toUpperCase()}
          </span>
          <div className="leading-tight">
            <p className="text-sm font-medium text-white">{nombre}</p>
            <p className="text-xs text-night-400">Conectado</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
