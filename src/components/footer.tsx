import Link from "next/link";
import { Hotel, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-night-100 bg-night-950 text-night-200">
      <div className="container-app grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-500 text-night-950">
              <Hotel className="h-5 w-5" />
            </span>
            <span className="font-serif text-lg font-bold text-white">
              Hotel Aurora
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-night-300">
            Una experiencia de hospitalidad donde cada detalle está pensado para
            tu descanso.
          </p>
        </div>

        <div>
          <h4 className="font-serif text-sm font-semibold text-white">
            Navegación
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-night-300">
            <li><Link className="hover:text-gold-400" href="/">Inicio</Link></li>
            <li><Link className="hover:text-gold-400" href="/habitaciones">Habitaciones</Link></li>
            <li><Link className="hover:text-gold-400" href="/mis-reservas">Mis reservas</Link></li>
            <li><Link className="hover:text-gold-400" href="/panel">Acceso personal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-sm font-semibold text-white">Contacto</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-night-300">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold-500" /> Cra. 45 #10-20, Medellín</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold-500" /> +57 604 444 5566</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold-500" /> reservas@aurora.com</li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-sm font-semibold text-white">Horarios</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-night-300">
            <li>Check-in: 3:00 p. m.</li>
            <li>Check-out: 12:00 m.</li>
            <li>Recepción 24/7</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-night-800/60">
        <div className="container-app flex flex-col items-center justify-between gap-2 py-6 text-xs text-night-400 sm:flex-row">
          <p>© 2026 Hotel Aurora · Proyecto académico — Ingeniería Web, UdeA</p>
          <p>Hecho con Next.js · Tailwind · Prisma</p>
        </div>
      </div>
    </footer>
  );
}
