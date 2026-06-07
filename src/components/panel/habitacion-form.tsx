"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, AlertCircle, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button, buttonClass } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/field";
import {
  crearHabitacionAction,
  actualizarHabitacionAction,
  type CrudState,
} from "@/app/actions/habitaciones";
import { TIPOS_HABITACION, ESTADOS_HABITACION, TIPO_LABEL, ESTADO_HAB_LABEL } from "@/lib/constants";

type Habitacion = {
  id: string;
  numero: string;
  tipo: string;
  descripcion: string;
  precioNoche: number;
  capacidad: number;
  estado: string;
  fotoUrl: string;
  servicios: string;
};

export function HabitacionForm({ habitacion }: { habitacion?: Habitacion }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const editando = !!habitacion;
  const action = editando ? actualizarHabitacionAction : crearHabitacionAction;
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
          <Plus className="h-4 w-4" /> Nueva habitación
        </Button>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editando ? `Editar habitación ${habitacion.numero}` : "Nueva habitación"}
        description="Completa la información de la habitación."
      >
        <form action={formAction} className="space-y-4">
          {editando && <input type="hidden" name="id" value={habitacion.id} />}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="numero">Número</Label>
              <Input id="numero" name="numero" defaultValue={habitacion?.numero} placeholder="301" required />
            </div>
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select id="tipo" name="tipo" defaultValue={habitacion?.tipo ?? "DOBLE"}>
                {TIPOS_HABITACION.map((t) => (
                  <option key={t} value={t}>{TIPO_LABEL[t]}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="precioNoche">Precio/noche</Label>
              <Input id="precioNoche" name="precioNoche" type="number" min={0} defaultValue={habitacion?.precioNoche} placeholder="280000" required />
            </div>
            <div>
              <Label htmlFor="capacidad">Capacidad</Label>
              <Input id="capacidad" name="capacidad" type="number" min={1} max={10} defaultValue={habitacion?.capacidad ?? 2} required />
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select id="estado" name="estado" defaultValue={habitacion?.estado ?? "DISPONIBLE"}>
                {ESTADOS_HABITACION.map((e) => (
                  <option key={e} value={e}>{ESTADO_HAB_LABEL[e]}</option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="fotoUrl">URL de la foto</Label>
            <Input id="fotoUrl" name="fotoUrl" defaultValue={habitacion?.fotoUrl} placeholder="https://images.unsplash.com/..." />
          </div>

          <div>
            <Label htmlFor="servicios">Servicios (separados por coma)</Label>
            <Input id="servicios" name="servicios" defaultValue={habitacion?.servicios} placeholder="WiFi,TV,Minibar" />
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea id="descripcion" name="descripcion" defaultValue={habitacion?.descripcion} placeholder="Describe la habitación…" required />
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
              ) : editando ? "Guardar cambios" : "Crear habitación"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
