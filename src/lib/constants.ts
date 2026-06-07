export const TIPOS_HABITACION = ["INDIVIDUAL", "DOBLE", "SUITE", "DELUXE"] as const;

export const ESTADOS_HABITACION = ["DISPONIBLE", "OCUPADA", "MANTENIMIENTO"] as const;

export const ESTADOS_RESERVA = [
  "CONFIRMADA",
  "EN_CURSO",
  "FINALIZADA",
  "CANCELADA",
] as const;

export const TIPO_LABEL: Record<string, string> = {
  INDIVIDUAL: "Individual",
  DOBLE: "Doble",
  SUITE: "Suite",
  DELUXE: "Deluxe",
};

export const ESTADO_HAB_LABEL: Record<string, string> = {
  DISPONIBLE: "Disponible",
  OCUPADA: "Ocupada",
  MANTENIMIENTO: "Mantenimiento",
};

export const ESTADO_RES_LABEL: Record<string, string> = {
  CONFIRMADA: "Confirmada",
  EN_CURSO: "En curso",
  FINALIZADA: "Finalizada",
  CANCELADA: "Cancelada",
};
