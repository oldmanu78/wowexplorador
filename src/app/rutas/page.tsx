// Página de rutas M+ — /rutas
// Muestra las 8 mazmorras de Midnight S1 con sus rutas desde SQLite
import { prisma } from "@/lib/db";
import DungeonTabs from "@/components/routes/DungeonTabs";

export default async function RutasPage() {
  // Consulta todas las mazmorras con sus rutas desde SQLite
  const dungeons = await prisma.dungeon.findMany({
    include: {
      routes: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6 border-b border-horda-border/80 pb-5">
        <p className="text-xs uppercase tracking-[0.22em] text-horda-muted font-exo mb-2">
          Cartografía Mythic+
        </p>
        <h1 className="font-cinzel text-2xl md:text-3xl text-horda-gold tracking-[0.14em]">
          RUTAS M+ — MIDNIGHT S1
        </h1>
        <p className="text-horda-muted text-sm font-exo mt-2">
          Selecciona una mazmorra para ver sus rutas recomendadas de Keystone.guru
        </p>
      </div>

      {/* Componente cliente con tabs y búsqueda */}
      <DungeonTabs dungeons={dungeons.map((d) => ({
        ...d,
        routes: d.routes.map((r) => ({
          ...r,
          id: r.id,
          dungeonId: r.dungeonId,
          name: r.name,
          url: r.url,
          type: r.type,
          desc: r.desc,
          thumb: r.thumb,
        })),
      }))} />
    </div>
  );
}
