import { prisma } from "@/lib/db";
import DungeonTabs from "@/components/routes/DungeonTabs";

export default async function RutasPage() {
  const dungeons = await prisma.dungeon.findMany({
    include: {
      routes: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <section className="relative py-12 border-b border-[rgba(240,195,90,0.14)]">
        <div className="max-w-[1180px] mx-auto px-4">
          <p className="text-gold text-[0.74rem] font-black tracking-[0.18em] uppercase mb-2">
            Cartografia Mythic+
          </p>
          <h1 className="font-cinzel text-[clamp(2rem,5vw,3.7rem)] leading-[0.95] uppercase text-bone">
            Rutas M+ — Midnight S1
          </h1>
          <p className="text-muted text-sm font-inter mt-3">
            Selecciona una mazmorra para ver sus rutas recomendadas de Keystone.guru
          </p>
        </div>
      </section>

      <section className="max-w-[1180px] mx-auto px-4 py-12">
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
      </section>
    </>
  );
}
