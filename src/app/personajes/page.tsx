// Galería de personajes — página /personajes
// Muestra cards de todos los personajes activos con su info de Raider.io
import { prisma } from "@/lib/db";
import CharacterCard from "@/components/characters/CharacterCard";

export default async function PersonajesPage() {
  // Consulta todos los personajes activos desde SQLite
  const characters = await prisma.character.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6 border-b border-horda-border/80 pb-5">
        <p className="text-xs uppercase tracking-[0.22em] text-horda-muted font-exo mb-2">
          Roster de guerra
        </p>
        <h1 className="font-cinzel text-2xl md:text-3xl text-horda-gold tracking-[0.14em]">
          PERSONAJES
        </h1>
        <p className="text-horda-muted text-sm font-exo mt-2">
          Quel&apos;Thalas (US) — {characters.length} personajes trackeados
        </p>
      </div>

      {/* Grid de personajes: responsive, 1 col en mobile, 3-4 en desktop */}
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

      {/* Mensaje si no hay personajes */}
      {characters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-horda-muted font-exo">
            No hay personajes trackeados. Espera al pipeline semanal.
          </p>
        </div>
      )}
    </div>
  );
}
