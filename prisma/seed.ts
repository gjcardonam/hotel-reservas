import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "crypto";

const db = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setHours(15, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

function codigo(n: number): string {
  return `AUR-${String(n).padStart(4, "0")}`;
}

function noches(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

async function main() {
  console.log("🌱 Limpiando base de datos...");
  await db.reserva.deleteMany();
  await db.habitacion.deleteMany();
  await db.cliente.deleteMany();
  await db.usuario.deleteMany();

  console.log("👤 Creando usuarios del personal...");
  await db.usuario.createMany({
    data: [
      {
        email: "personal@aurora.com",
        nombre: "Recepción Aurora",
        passwordHash: hashPassword("aurora2026"),
        rol: "PERSONAL",
      },
      {
        email: "admin@aurora.com",
        nombre: "Gerencia Aurora",
        passwordHash: hashPassword("aurora2026"),
        rol: "ADMIN",
      },
    ],
  });

  console.log("🛏️  Creando habitaciones...");
  const habitacionesData = [
    {
      numero: "101",
      tipo: "INDIVIDUAL",
      descripcion:
        "Acogedora habitación individual con luz natural, escritorio de trabajo y vista al jardín interior. Ideal para viajeros de negocios.",
      precioNoche: 180000,
      capacidad: 1,
      fotoUrl:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
      servicios: "WiFi,TV,Escritorio,Aire acondicionado",
      estado: "DISPONIBLE",
    },
    {
      numero: "102",
      tipo: "INDIVIDUAL",
      descripcion:
        "Habitación individual minimalista con cama queen y rincón de lectura. Tranquila y luminosa.",
      precioNoche: 195000,
      capacidad: 1,
      fotoUrl:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      servicios: "WiFi,TV,Cafetera,Escritorio",
      estado: "DISPONIBLE",
    },
    {
      numero: "201",
      tipo: "DOBLE",
      descripcion:
        "Espaciosa habitación doble con dos camas individuales, perfecta para amigos o colegas. Baño privado renovado.",
      precioNoche: 280000,
      capacidad: 2,
      fotoUrl:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      servicios: "WiFi,TV,Minibar,Aire acondicionado,Caja fuerte",
      estado: "DISPONIBLE",
    },
    {
      numero: "202",
      tipo: "DOBLE",
      descripcion:
        "Habitación doble con cama king y zona de estar. Decoración cálida y amplios ventanales.",
      precioNoche: 310000,
      capacidad: 2,
      fotoUrl:
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
      servicios: "WiFi,TV,Minibar,Cafetera,Balcón",
      estado: "OCUPADA",
    },
    {
      numero: "301",
      tipo: "SUITE",
      descripcion:
        "Suite junior con sala independiente, sofá-cama y escritorio ejecutivo. Vista panorámica a la ciudad.",
      precioNoche: 450000,
      capacidad: 3,
      fotoUrl:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      servicios: "WiFi,TV,Minibar,Aire acondicionado,Caja fuerte,Balcón,Escritorio",
      estado: "DISPONIBLE",
    },
    {
      numero: "302",
      tipo: "SUITE",
      descripcion:
        "Suite familiar con dos ambientes, ideal para una estadía cómoda en familia. Amplio baño con bañera.",
      precioNoche: 480000,
      capacidad: 4,
      fotoUrl:
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
      servicios: "WiFi,TV,Minibar,Aire acondicionado,Cafetera,Balcón",
      estado: "DISPONIBLE",
    },
    {
      numero: "401",
      tipo: "DELUXE",
      descripcion:
        "Suite Deluxe de lujo con jacuzzi privado, cama king premium y vista al mar. La joya del Hotel Aurora.",
      precioNoche: 720000,
      capacidad: 2,
      fotoUrl:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      servicios:
        "WiFi,TV,Minibar,Aire acondicionado,Caja fuerte,Jacuzzi,Vista al mar,Balcón",
      estado: "DISPONIBLE",
    },
    {
      numero: "402",
      tipo: "DELUXE",
      descripcion:
        "Penthouse Deluxe con terraza privada, sala de estar y comedor. Experiencia de máxima exclusividad.",
      precioNoche: 850000,
      capacidad: 4,
      fotoUrl:
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
      servicios:
        "WiFi,TV,Minibar,Aire acondicionado,Caja fuerte,Jacuzzi,Vista al mar,Balcón,Cafetera",
      estado: "MANTENIMIENTO",
    },
  ];

  const habitaciones: { id: string; precioNoche: number; numero: string }[] = [];
  for (const h of habitacionesData) {
    const creada = await db.habitacion.create({ data: h });
    habitaciones.push(creada);
  }

  console.log("🧳 Creando clientes...");
  const clientesData = [
    { nombre: "María Fernanda Restrepo", email: "maria.restrepo@email.com", telefono: "300 412 8890", documento: "1037645210", pais: "Colombia" },
    { nombre: "Carlos Andrés Mejía", email: "carlos.mejia@email.com", telefono: "311 556 2031", documento: "71998452", pais: "Colombia" },
    { nombre: "Laura Gómez Vélez", email: "laura.gomez@email.com", telefono: "320 778 1145", documento: "1152456789", pais: "Colombia" },
    { nombre: "James Wilson", email: "james.wilson@email.com", telefono: "+1 415 220 9981", documento: "P4567812", pais: "Estados Unidos" },
    { nombre: "Sofía Ramírez Torres", email: "sofia.ramirez@email.com", telefono: "315 330 7766", documento: "1020998877", pais: "Colombia" },
    { nombre: "Andrés Felipe Tabares", email: "andres.tabares@email.com", telefono: "301 889 4412", documento: "1019887766", pais: "Colombia" },
  ];
  const clientes: { id: string; nombre: string }[] = [];
  for (const c of clientesData) {
    clientes.push(await db.cliente.create({ data: c }));
  }

  console.log("📅 Creando reservas...");
  const hoy = new Date();
  const H = (i: number) => habitaciones[i];
  const C = (i: number) => clientes[i];

  type ResInput = {
    habIdx: number;
    cliIdx: number;
    entrada: Date;
    salida: Date;
    huespedes: number;
    estado: string;
    checkIn?: Date | null;
    checkOut?: Date | null;
  };

  const reservas: ResInput[] = [
    // En curso (huésped ya hizo check-in) -> habitación 202 OCUPADA
    { habIdx: 3, cliIdx: 1, entrada: addDays(hoy, -1), salida: addDays(hoy, 2), huespedes: 2, estado: "EN_CURSO", checkIn: addDays(hoy, -1) },
    // Llega HOY (lista para check-in en el panel)
    { habIdx: 4, cliIdx: 0, entrada: addDays(hoy, 0), salida: addDays(hoy, 3), huespedes: 2, estado: "CONFIRMADA" },
    // Llega mañana
    { habIdx: 6, cliIdx: 3, entrada: addDays(hoy, 1), salida: addDays(hoy, 5), huespedes: 2, estado: "CONFIRMADA" },
    // Próxima semana
    { habIdx: 2, cliIdx: 2, entrada: addDays(hoy, 6), salida: addDays(hoy, 9), huespedes: 2, estado: "CONFIRMADA" },
    { habIdx: 0, cliIdx: 4, entrada: addDays(hoy, 8), salida: addDays(hoy, 10), huespedes: 1, estado: "CONFIRMADA" },
    // Finalizada (estadía pasada)
    { habIdx: 5, cliIdx: 5, entrada: addDays(hoy, -7), salida: addDays(hoy, -3), huespedes: 3, estado: "FINALIZADA", checkIn: addDays(hoy, -7), checkOut: addDays(hoy, -3) },
    // Cancelada
    { habIdx: 1, cliIdx: 2, entrada: addDays(hoy, 4), salida: addDays(hoy, 6), huespedes: 1, estado: "CANCELADA" },
  ];

  let n = 1;
  for (const r of reservas) {
    const hab = H(r.habIdx);
    const cli = C(r.cliIdx);
    const noc = noches(r.entrada, r.salida);
    await db.reserva.create({
      data: {
        codigo: codigo(n++),
        clienteId: cli.id,
        habitacionId: hab.id,
        fechaEntrada: r.entrada,
        fechaSalida: r.salida,
        huespedes: r.huespedes,
        noches: noc,
        total: noc * hab.precioNoche,
        estado: r.estado,
        checkInAt: r.checkIn ?? null,
        checkOutAt: r.checkOut ?? null,
      },
    });
  }

  console.log("✅ Seed completado:");
  console.log(`   ${habitaciones.length} habitaciones, ${clientes.length} clientes, ${reservas.length} reservas`);
  console.log("   Login personal: personal@aurora.com / aurora2026");
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
