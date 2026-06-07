import { Trash2, Mail, Phone, IdCard, MapPin } from "lucide-react";
import { SubmitButton } from "@/components/ui/submit-button";
import { Badge } from "@/components/ui/badge";
import { ClienteForm } from "@/components/panel/cliente-form";
import { db } from "@/lib/db";
import { getUsuarioActual } from "@/lib/auth";
import { eliminarClienteAction } from "@/app/actions/clientes";

export const dynamic = "force-dynamic";

export default async function PanelClientesPage() {
  const [clientes, usuario] = await Promise.all([
    db.cliente.findMany({
      orderBy: { nombre: "asc" },
      include: { _count: { select: { reservas: true } } },
    }),
    getUsuarioActual(),
  ]);
  const esAdmin = usuario?.rol === "ADMIN";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-night-900 sm:text-3xl">Clientes</h1>
          <p className="mt-1 text-night-500">
            {clientes.length} clientes registrados · datos maestros.
          </p>
        </div>
        <ClienteForm />
      </div>

      <div className="overflow-hidden rounded-2xl border border-night-100 bg-white shadow-soft">
        <div className="hidden grid-cols-[1.4fr_1.6fr_1fr_0.6fr_auto] gap-4 border-b border-night-100 bg-night-50/60 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-night-400 md:grid">
          <span>Cliente</span>
          <span>Contacto</span>
          <span>Documento</span>
          <span>Reservas</span>
          <span className="text-right">Acciones</span>
        </div>
        <ul className="divide-y divide-night-100">
          {clientes.map((c) => (
            <li
              key={c.id}
              className="grid grid-cols-1 gap-3 px-6 py-4 md:grid-cols-[1.4fr_1.6fr_1fr_0.6fr_auto] md:items-center"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-night-900 text-sm font-bold text-gold-300">
                  {c.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </span>
                <div>
                  <p className="font-medium text-night-900">{c.nombre}</p>
                  <p className="flex items-center gap-1 text-xs text-night-400">
                    <MapPin className="h-3 w-3" /> {c.pais}
                  </p>
                </div>
              </div>

              <div className="space-y-0.5 text-sm text-night-600">
                <p className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-night-400" /> {c.email}
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-night-400" /> {c.telefono}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-night-600">
                <IdCard className="h-4 w-4 text-night-400" /> {c.documento}
              </div>

              <div>
                <Badge>{c._count.reservas} reservas</Badge>
              </div>

              <div className="flex justify-start gap-1 md:justify-end">
                <ClienteForm cliente={c} />
                {esAdmin && (
                  <form action={eliminarClienteAction}>
                    <input type="hidden" name="id" value={c.id} />
                    <SubmitButton
                      size="sm"
                      variant="ghost"
                      className="h-9 w-9 p-0 text-rose-500 hover:bg-rose-50"
                      confirm="¿Eliminar este cliente? (No se permite si tiene reservas)."
                      pendingText=""
                    >
                      <Trash2 className="h-4 w-4" />
                    </SubmitButton>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
