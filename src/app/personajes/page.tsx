import { prisma } from "@/lib/db";
import CharacterCard from "@/components/characters/CharacterCard";

export default async function PersonajesPage() {
  const characters = await prisma.character.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <section className="relative py-12 border-b border-[rgba(240,195,90,0.14)]">
        <div className="max-w-[1180px] mx-auto px-4">
          <p className="text-gold text-[0.74rem] font-black tracking-[0.18em] uppercase mb-2">
            Roster de guerra
          </p>
          <h1 className="font-cinzel text-[clamp(2rem,5vw,3.7rem)] leading-[0.95] uppercase text-bone">
            Personajes
          </h1>
          <p className="text-muted text-sm font-inter mt-3">
            Quel&apos;Thalas (US) — {characters.length} personajes trackeados
          </p>
        </div>
      </section>

      <section className="max-w-[1180px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {characters.map((char) => (
            <CharacterCard
              key={char.id}
              slug={char.slug}
              name={char.name}
              className={char.class}
              spec={char.spec}
              role={char.role}
              rioData={char.rioData}
            />
          ))}
        </div>

        {characters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted font-inter">
              No hay personajes trackeados. Espera al pipeline semanal.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
