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
      <h1 className="font-cinzel text-2xl text-horda-gold tracking-wider mb-2">
        RUTAS M+ — MIDNIGHT S1
      </h1>
      <p className="text-horda-muted text-sm font-exo mb-6">
        Selecciona una mazmorra para ver sus rutas recomendadas de Keystone.guru
      </p>

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
