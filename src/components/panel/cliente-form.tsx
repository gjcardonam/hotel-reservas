"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, AlertCircle, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button, buttonClass } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import {
  crearClienteAction,
  actualizarClienteAction,
} from "@/app/actions/clientes";
import type { CrudState } from "@/app/actions/habitaciones";

type Cliente = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  documento: string;
  pais: string;
};

export function ClienteForm({ cliente }: { cliente?: Cliente }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const editando = !!cliente;
  const action = editando ? actualizarClienteAction : crearClienteAction;
  const [state, formAction, isPending] = useActionState<CrudState, FormData>(
    action,
    {}
  );

  useEffect(() => {
    if (state.ok) {
      setOpen(false);
      router.refresh();
    }
  }, [state.ok, router]);

  return (
    <>
      {editando ? (
        <button
          onClick={() => setOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-night-500 transition hover:bg-night-100 hover:text-night-900"
          aria-label="Editar"
        >
          <Pencil className="h-4 w-4" />
        </button>
      ) : (
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Nuevo cliente
        </Button>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editando ? "Editar cliente" : "Nuevo cliente"}
        description="Datos del huésped."
      >
        <form action={formAction} className="space-y-4">
          {editando && <input type="hidden" name="id" value={cliente.id} />}

          <div>
            <Label htmlFor="nombre">Nombre completo</Label>
            <Input id="nombre" name="nombre" defaultValue={cliente?.nombre} placeholder="María Restrepo" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Correo</Label>
              <Input id="email" name="email" type="email" defaultValue={cliente?.email} placeholder="maria@email.com" required />
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" name="telefono" defaultValue={cliente?.telefono} placeholder="300 000 0000" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="documento">Documento</Label>
              <Input id="documento" name="documento" defaultValue={cliente?.documento} placeholder="1037645210" required />
            </div>
            <div>
              <Label htmlFor="pais">País</Label>
              <Input id="pais" name="pais" defaultValue={cliente?.pais ?? "Colombia"} placeholder="Colombia" />
            </div>
          </div>

          {state.error && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className={buttonClass("outline", "md")}>
              Cancelar
            </button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Guardando…</>
              ) : editando ? "Guardar cambios" : "Crear cliente"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
