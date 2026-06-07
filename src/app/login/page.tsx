import Link from "next/link";
import { redirect } from "next/navigation";
import { Hotel, ArrowLeft, KeyRound } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { getUsuarioActual } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const usuario = await getUsuarioActual();
  if (usuario) redirect("/panel");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Panel visual */}
      <div className="relative hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=80"
          alt="Hotel Aurora"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-night-950/70" />
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500 text-night-950">
              <Hotel className="h-5 w-5" />
            </span>
            <span className="font-serif text-xl font-bold">Hotel Aurora</span>
          </Link>
          <div>
            <h2 className="font-serif text-3xl font-bold leading-snug">
              Panel de administración
            </h2>
            <p className="mt-3 max-w-sm text-night-200">
              Gestiona habitaciones, clientes, reservas y el flujo de check-in /
              check-out desde un solo lugar.
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center bg-sand-50 px-6 py-12">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-night-500 transition hover:text-night-900"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al sitio
          </Link>

          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-night-900 text-gold-400">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-night-900">Acceso del personal</h1>
          <p className="mt-1.5 text-sm text-night-500">
            Ingresa con tus credenciales para administrar el hotel.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>

          <div className="mt-8 rounded-xl border border-night-100 bg-white p-4 text-sm">
            <p className="font-medium text-night-700">Credenciales de demostración</p>
            <p className="mt-1 text-night-500">
              Correo: <code className="text-night-800">personal@aurora.com</code>
              <br />
              Contraseña: <code className="text-night-800">aurora2026</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
