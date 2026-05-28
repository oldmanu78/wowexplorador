// Script de seed para poblar la base de datos SQLite
// Ejecutar después de actualizar_datos.py para cargar datos iniciales
// Uso: npx tsx scripts/seed.ts
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || "file:./prisma/wow.db",
});

async function main() {
  console.log("Seeding database...");

  // Crea el usuario por defecto
  const user = await prisma.user.upsert({
    where: { slug: "oldmanu78" },
    update: {},
    create: {
      username: "oldmanu78",
      slug: "oldmanu78",
    },
  });
  console.log(`  [+] User: ${user.username}`);

  // Crea dungeon metadata si no existen
  const dungeons = [
    { id: "aa", slug: "algethar-academy", name: "Algeth'ar Academy", type: "nueva", sigla: "AA", jefes: 4, zona: "Thaldraszus", timer: "35 min", desc: "Una academia de vuelo dracthyr.", img: "/images/algethar.jpg" },
    { id: "mc", slug: "maisara-caverns", name: "Maisara Caverns", type: "nueva", sigla: "MC", jefes: 4, zona: "Harandar", timer: "33 min", desc: "Profundas cavernas en Harandar.", img: "/images/maisara.jpg" },
    { id: "npx", slug: "nexus-point-xenas", name: "Nexus-Point Xenas", type: "nueva", sigla: "NPX", jefes: 4, zona: "Voidstorm", timer: "35 min", desc: "Puesto avanzado del Vacio.", img: "/images/nexus.jpg" },
    { id: "wrs", slug: "windrunner-spire", name: "Windrunner Spire", type: "nueva", sigla: "WRS", jefes: 4, zona: "Eversong Woods", timer: "34 min", desc: "Torre de los Windrunner.", img: "/images/windrunner.jpg" },
    { id: "mt", slug: "magisters-terrace", name: "Magister's Terrace", type: "clasica", sigla: "MT", jefes: 4, zona: "Quel'Danas", timer: "32 min", desc: "Terraza de los Magisters.", img: "/images/magisters.jpg" },
    { id: "pos", slug: "pit-of-saron", name: "Pit of Saron", type: "clasica", sigla: "POS", jefes: 3, zona: "Icecrown", timer: "30 min", desc: "Mazmorras de ICC.", img: "/images/pit.jpg" },
    { id: "seat", slug: "seat-of-the-triumvirate", name: "Seat of the Triumvirate", type: "clasica", sigla: "SEAT", jefes: 4, zona: "Argus", timer: "32 min", desc: "Trono de los Eredar.", img: "/images/seat.jpg" },
    { id: "sky", slug: "skyreach", name: "Skyreach", type: "clasica", sigla: "SKY", jefes: 4, zona: "Spires of Arak", timer: "28 min", desc: "Fortaleza Arakkoa.", img: "/images/skyreach.jpg" },
  ];

  for (const d of dungeons) {
    await prisma.dungeon.upsert({
      where: { slug: d.slug },
      update: d,
      create: d,
    });
  }
  console.log(`  [+] ${dungeons.length} dungeons seeded`);

  // Crea noticias por defecto
  const newsItems = [
    { title: "Midnight S1 — Nueva temporada de Mythic+ disponible", link: "https://www.wowhead.com", date: "17/03/2026", source: "Wowhead" },
    { title: "Parche 11.1 — Notas del parche", link: "https://worldofwarcraft.blizzard.com", date: "10/03/2026", source: "Blizzard" },
    { title: "Guia de clases Midnight — Mejores specs para M+", link: "https://www.icy-veins.com", date: "05/03/2026", source: "Icy-Veins" },
  ];

  for (const news of newsItems) {
    await prisma.news.create({ data: news });
  }
  console.log(`  [+] ${newsItems.length} news seeded`);

  // Crea invasiones por defecto
  const invasions = [
    { zone: "Valle de Alterac", npcs: 3, reward: "Fragmento de Eter" },
    { zone: "Tierras Fantasma", npcs: 3, reward: "Fragmento de Eter" },
    { zone: "Tanaris", npcs: 3, reward: "Fragmento de Eter" },
  ];

  for (const inv of invasions) {
    await prisma.invasion.create({ data: inv });
  }
  console.log(`  [+] ${invasions.length} invasions seeded`);

  console.log("\nSeed completado!");
}

main()
  .catch((e) => {
    console.error("Error durante seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
