import Link from "next/link";
import {
  Wifi,
  Waves,
  UtensilsCrossed,
  Dumbbell,
  Sparkles,
  ConciergeBell,
  ArrowRight,
  Star,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SearchBar } from "@/components/search-bar";
import { RoomCard } from "@/components/room-card";
import { buttonClass } from "@/components/ui/button";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const amenidades = [
  { icon: Wifi, title: "WiFi de alta velocidad", desc: "Conexión en todo el hotel" },
  { icon: Waves, title: "Piscina & Spa", desc: "Relájate y desconéctate" },
  { icon: UtensilsCrossed, title: "Restaurante gourmet", desc: "Cocina de autor" },
  { icon: Dumbbell, title: "Gimnasio 24/7", desc: "Equipos de última generación" },
  { icon: ConciergeBell, title: "Conserjería", desc: "Atención personalizada" },
  { icon: Sparkles, title: "Limpieza diaria", desc: "Confort impecable" },
];

export default async function HomePage() {
  const destacadas = await db.habitacion.findMany({
    where: { estado: { not: "MANTENIMIENTO" } },
    orderBy: { precioNoche: "asc" },
    take: 6,
  });

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80"
            alt="Hotel Aurora"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-night-950/80 via-night-950/55 to-night-950/85" />
        </div>

        <div className="container-app flex min-h-[640px] flex-col items-center justify-center py-24 text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gold-200 backdrop-blur">
            <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" /> Hotel 5 estrellas · Medellín
          </span>
          <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight text-white sm:text-6xl">
            Tu descanso perfecto comienza en{" "}
            <span className="text-gold-400">Aurora</span>
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base text-night-100/90 sm:text-lg">
            Habitaciones diseñadas para tu comodidad. Reserva en segundos y vive
            una experiencia inolvidable.
          </p>

          <div className="mt-10 w-full max-w-3xl animate-fade-in">
            <SearchBar variant="hero" />
          </div>
        </div>
      </section>

      {/* HABITACIONES DESTACADAS */}
      <section className="container-app py-20">
        <div className="flex flex-col items-end justify-between gap-4 sm:flex-row">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">
              Nuestras habitaciones
            </p>
            <h2 className="mt-2 text-3xl font-bold text-night-900 sm:text-4xl">
              Espacios pensados para ti
            </h2>
          </div>
          <Link href="/habitaciones" className={buttonClass("outline", "md")}>
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destacadas.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>

      {/* AMENIDADES */}
      <section className="border-y border-night-100 bg-white/70">
        <div className="container-app py-20">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">
              Todo incluido
            </p>
            <h2 className="mt-2 text-3xl font-bold text-night-900 sm:text-4xl">
              Una estadía sin preocupaciones
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {amenidades.map((a) => (
              <div
                key={a.title}
                className="flex items-start gap-4 rounded-2xl border border-night-100 bg-white p-6 shadow-soft transition hover:shadow-lift"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-night-900 text-gold-400">
                  <a.icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-night-900">
                    {a.title}
                  </h3>
                  <p className="mt-1 text-sm text-night-500">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-app py-20">
        <div className="relative overflow-hidden rounded-3xl bg-night-900 px-8 py-16 text-center shadow-lift sm:px-16">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-500/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-night-400/20 blur-3xl" />
          <h2 className="relative text-3xl font-bold text-white sm:text-4xl">
            ¿Listo para tu próxima escapada?
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-night-200">
            Reserva ahora y asegura la mejor tarifa. Sin costos ocultos,
            confirmación inmediata.
          </p>
          <div className="relative mt-8">
            <Link href="/habitaciones" className={buttonClass("primary", "lg")}>
              Reservar ahora <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
