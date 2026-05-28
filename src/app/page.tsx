// Dashboard semanal — página principal de WoW Explorer
// Muestra afijos, evento, token, world boss, ranking, noticias e invasiones
// Todos los datos se cargan desde SQLite en build time (SSG)
import { prisma } from "@/lib/db";
import { formatNumber, formatGold } from "@/lib/utils";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import AffixDisplay from "@/components/weekly/AffixDisplay";
import EventCard from "@/components/weekly/EventCard";
import WorldBossCard from "@/components/weekly/WorldBossCard";
import TokenPrice from "@/components/weekly/TokenPrice";
import NewsFeed from "@/components/weekly/NewsFeed";
import InvasionList from "@/components/weekly/InvasionList";
import RankingTable from "@/components/weekly/RankingTable";

export default async function HomePage() {
  // Consultas a SQLite en build time
  // weekly: último snapshot semanal
  const weekly = await prisma.weeklySnapshot.findFirst({
    orderBy: { weekStart: "desc" },
  });

  // noticias: todas ordenadas por fecha descendente
  const news = await prisma.news.findMany({
    orderBy: { date: "desc" },
  });

  // invasiones: todas
  const invasions = await prisma.invasion.findMany();

  // characters activos para ranking
  const characters = await prisma.character.findMany({
    where: { isActive: true },
  });

  // Construyo el ranking a partir de los personajes activos
  const rankingData = {
    tank: characters
      .filter((c) => c.role === "TANK")
      .map((c) => ({
        name: c.name,
        class: c.class,
        spec: c.spec,
        score: extractScore(c.rioData),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5),
    dps: characters
      .filter((c) => c.role === "DPS")
      .map((c) => ({
        name: c.name,
        class: c.class,
        spec: c.spec,
        score: extractScore(c.rioData),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5),
    healer: characters
      .filter((c) => c.role === "HEALER")
      .map((c) => ({
        name: c.name,
        class: c.class,
        spec: c.spec,
        score: extractScore(c.rioData),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Fondo decorativo: Horde crest watermark */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='50,5 65,35 95,35 70,55 80,90 50,70 20,90 30,55 5,35 35,35' fill='%23F8B700'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Layout de 2 columnas (70/30) que colapsa a 1 en mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 relative z-10">
        {/* Columna principal */}
        <div className="space-y-6">
          {/* Título de la semana */}
          <h2 className="font-cinzel text-2xl text-horda-gold tracking-wider">
            PANEL SEMANAL
          </h2>

          {/* Sección de afijos con Card */}
          <Card>
            <CardHeader>
              <h3 className="font-cinzel text-horda-gold text-sm tracking-wide">AFIJOS M+</h3>
            </CardHeader>
            <CardBody>
              <AffixDisplay affixes={weekly?.affixes || ""} />
            </CardBody>
          </Card>

          {/* Grid de cards pequeñas: Evento + Token + World Boss */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EventCard event={weekly?.event || ""} />
            <TokenPrice price={weekly?.tokenPrice || "Buscando..."} />
            <WorldBossCard boss={weekly?.worldBoss || ""} />
          </div>

          {/* Ranking M+ */}
          <RankingTable
            tank={rankingData.tank}
            dps={rankingData.dps}
            healer={rankingData.healer}
          />
        </div>

        {/* Sidebar — Noticias + Invasiones */}
        <div className="space-y-6">
          <h2 className="font-cinzel text-2xl text-horda-gold tracking-wider">
            ACTUALIDAD
          </h2>

          <NewsFeed
            news={news.map((n) => ({
              id: n.id,
              title: n.title,
              link: n.link,
              date: n.date,
              source: n.source,
            }))}
          />

          <InvasionList
            invasions={invasions.map((i) => ({
              id: i.id,
              zone: i.zone,
              npcs: i.npcs,
              reward: i.reward,
            }))}
          />

          {/* Última actualización */}
          {weekly && (
            <p className="text-xs text-horda-muted text-center">
              Última actualización: {weekly.weekStart.toLocaleDateString("es-CL")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Extrae el score M+ total del JSON de Raider.io
function extractScore(rioData: string | null): number {
  if (!rioData) return 0;
  try {
    const rio = JSON.parse(rioData);
    return rio?.mythic_plus_scores_by_season?.[0]?.scores?.all || 0;
  } catch {
    return 0;
  }
}
