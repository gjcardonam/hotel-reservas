export const TIPOS_HABITACION = ["INDIVIDUAL", "DOBLE", "SUITE", "DELUXE"] as const;
export type TipoHabitacion = (typeof TIPOS_HABITACION)[number];

export const ESTADOS_HABITACION = ["DISPONIBLE", "OCUPADA", "MANTENIMIENTO"] as const;
export type EstadoHabitacion = (typeof ESTADOS_HABITACION)[number];

export const ESTADOS_RESERVA = [
  "CONFIRMADA",
  "EN_CURSO",
  "FINALIZADA",
  "CANCELADA",
] as const;
export type EstadoReserva = (typeof ESTADOS_RESERVA)[number];

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

export const SERVICIOS_DISPONIBLES = [
  "WiFi",
  "TV",
  "Minibar",
  "Aire acondicionado",
  "Caja fuerte",
  "Jacuzzi",
  "Balcón",
  "Vista al mar",
  "Escritorio",
  "Cafetera",
] as const;
