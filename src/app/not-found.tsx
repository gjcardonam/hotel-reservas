import Link from "next/link";
import { Hotel, ArrowLeft } from "lucide-react";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sand-50 px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-night-900 text-gold-400">
        <Hotel className="h-7 w-7" />
      </span>
      <p className="mt-6 font-serif text-6xl font-bold text-night-900">404</p>
      <h1 className="mt-2 text-xl font-semibold text-night-800">
        Página no encontrada
      </h1>
      <p className="mt-2 max-w-sm text-night-500">
        Lo sentimos, la página que buscas no existe o fue movida.
      </p>
      <Link href="/" className={buttonClass("dark", "md", "mt-6")}>
        <ArrowLeft className="h-4 w-4" /> Volver al inicio
      </Link>
    </div>
  );
}
