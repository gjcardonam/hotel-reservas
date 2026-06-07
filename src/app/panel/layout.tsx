import { redirect } from "next/navigation";
import { getUsuarioActual } from "@/lib/auth";
import { Sidebar } from "@/components/panel/sidebar";

export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const usuario = await getUsuarioActual();
  if (!usuario) redirect("/login");

  return (
    <div className="flex min-h-screen bg-sand-50">
      <div className="sticky top-0 hidden h-screen w-64 shrink-0 bg-night-950 lg:block">
        <Sidebar nombre={usuario.nombre} rol={usuario.rol} />
      </div>
      <main className="min-w-0 flex-1">
        {/* Topbar móvil */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-night-100 bg-sand-50/90 px-5 py-3 backdrop-blur lg:hidden">
          <span className="font-serif text-lg font-bold text-night-900">
            Aurora · Admin
          </span>
        </div>
        <div className="p-5 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
