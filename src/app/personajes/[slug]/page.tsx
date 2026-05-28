// Página individual de personaje — /personajes/[slug]
// Genera páginas estáticas para cada personaje (SSG con generateStaticParams)
// 7 tabs: Stats, Monedas, Gear, Mazmorras, M+ Runs, Raid, Notas
import { prisma } from "@/lib/db";
import { CHARACTER_TABS } from "@/lib/constants";
import { safeJsonParse } from "@/lib/utils";
import type { RaiderIoProfile, RioRun } from "@/lib/wow-types";
import Link from "next/link";
import Tabs from "@/components/ui/Tabs";
import HeroSection from "@/components/characters/HeroSection";
import StatsPanel from "@/components/characters/StatsPanel";
import MonedasPanel from "@/components/characters/MonedasPanel";
import GearPanel from "@/components/characters/GearPanel";
import DungeonPanel from "@/components/characters/DungeonPanel";
import RunsPanel from "@/components/characters/RunsPanel";
import RaidPanel from "@/components/characters/RaidPanel";
import NotesPanel from "@/components/characters/NotesPanel";

// Genera rutas estáticas para todos los personajes activos
export async function generateStaticParams() {
  const characters = await prisma.character.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return characters.map((c) => ({ slug: c.slug }));
}

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Consulta el personaje por slug
  const character = await prisma.character.findUnique({
    where: { slug },
  });

  // 404 si no existe
  if (!character) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-cinzel text-2xl text-horda-gold mb-4">Personaje no encontrado</h1>
        <p className="text-horda-muted font-exo">El personaje &quot;{slug}&quot; no existe.</p>
        <Link href="/personajes" className="text-horda-gold hover:underline font-exo mt-4 inline-block">
          Volver a personajes
        </Link>
      </div>
    );
  }

  // Parse datos de Raider.io
  const rio = safeJsonParse<RaiderIoProfile>(character.rioData);

  // Scores por dungeon desde las best runs
  const bestRunsRaw = rio?.mythic_plus_best_runs || [];
  const dungeonScores = bestRunsRaw.map((run) => ({
    slug: typeof run.dungeon === "string" ? run.dungeon : run.dungeon?.slug || "",
    score: run.mythic_rating || 0,
    level: run.mythic_level || 0,
  }));

  // Carreras recientes
  const recentRunsRaw = rio?.mythic_plus_recent_runs || [];
  const toRunPanelData = (run: RioRun, isBest: boolean) => ({
    dungeonSlug: typeof run.dungeon === "string" ? run.dungeon : run.dungeon?.slug || "",
    score: run.mythic_rating || 0,
    level: run.mythic_level || 0,
    completedAt: run.completed_at || new Date().toISOString(),
    isBest,
  });
  const recentRuns = recentRunsRaw.map((run) => toRunPanelData(run, false));

  // Mejores carreras
  const bestRuns = bestRunsRaw.map((run) => toRunPanelData(run, true));

  const gearItems = Object.entries(rio?.gear?.items || {}).map(([slot, item]) => ({
    slot,
    item: item.name || "Objeto desconocido",
    icon: item.icon || "?",
    wowheadId: item.item_id,
    source: item.item_level ? `ilvl ${item.item_level}` : "Raider.io",
    prio: "B",
    isTier: Boolean(item.tier),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero section con info básica */}
      <HeroSection
        name={character.name}
        className={character.class}
        spec={character.spec}
        role={character.role}
        rioData={character.rioData}
        slug={character.slug}
      />

      {/* Sistema de 7 tabs con scroll horizontal */}
      {/* Cada panel se identifica por data-tab="tabId" */}
      <Tabs
        tabs={CHARACTER_TABS}
        defaultTab="stats"
        className="bg-horda-surface rounded-lg border border-horda-border p-2 md:p-4"
      >
        <div data-tab="stats" key="stats">
          <StatsPanel rioData={character.rioData} armory={character.armory} />
        </div>

        <div data-tab="monedas" key="monedas">
          <MonedasPanel slug={character.slug} />
        </div>

        <div data-tab="gear" key="gear">
          <GearPanel gear={gearItems} />
        </div>

        <div data-tab="dungeons" key="dungeons">
          <DungeonPanel scores={dungeonScores} />
        </div>

        <div data-tab="runs" key="runs">
          <RunsPanel bestRuns={bestRuns} recentRuns={recentRuns} />
        </div>

        <div data-tab="raid" key="raid">
          <RaidPanel rioData={character.rioData} />
        </div>

        <div data-tab="notes" key="notes">
          <NotesPanel slug={character.slug} />
        </div>
      </Tabs>
    </div>
  );
}
