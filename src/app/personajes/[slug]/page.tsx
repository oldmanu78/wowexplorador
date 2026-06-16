import { prisma } from "@/lib/db";
import { CHARACTER_TABS } from "@/lib/constants";
import { getRioDungeonSlug, safeJsonParse } from "@/lib/utils";
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

  const character = await prisma.character.findUnique({
    where: { slug },
  });

  if (!character) {
    return (
      <div className="max-w-[1180px] mx-auto px-4 py-20 text-center">
        <h1 className="font-cinzel text-2xl text-gold mb-4">Personaje no encontrado</h1>
        <p className="text-muted font-inter">El personaje &quot;{slug}&quot; no existe.</p>
        <Link href="/personajes" className="text-gold hover:underline font-inter mt-4 inline-block">
          Volver a personajes
        </Link>
      </div>
    );
  }

  const rio = safeJsonParse<RaiderIoProfile>(character.rioData);

  const bestRunsRaw = rio?.mythic_plus_best_runs || [];
  const dungeonScores = bestRunsRaw.map((run) => ({
    slug: getRioDungeonSlug(run.dungeon),
    score: run.score ?? run.mythic_rating ?? 0,
    level: run.mythic_level || 0,
  }));

  const recentRunsRaw = rio?.mythic_plus_recent_runs || [];
  const toRunPanelData = (run: RioRun, isBest: boolean) => ({
    dungeonSlug: getRioDungeonSlug(run.dungeon),
    score: run.score ?? run.mythic_rating ?? 0,
    level: run.mythic_level || 0,
    completedAt: run.completed_at || new Date().toISOString(),
    isBest,
  });
  const recentRuns = recentRunsRaw.map((run) => toRunPanelData(run, false));
  const bestRuns = bestRunsRaw.map((run) => toRunPanelData(run, true));

  const gearItems = Object.entries(rio?.gear?.items || {}).map(([slot, item]) => ({
    slot,
    item: item.name || "Objeto desconocido",
    icon: item.icon || "?",
    wowheadId: item.item_id,
    itemLevel: item.item_level || 0,
    quality: item.item_quality,
    gems: item.gems_detail || [],
    enchants: item.enchants_detail || [],
    source: "Raider.io",
    isTier: Boolean(item.tier),
  }));

  return (
    <div className="max-w-[1180px] mx-auto px-4 py-8">
      <HeroSection
        name={character.name}
        className={character.class}
        spec={character.spec}
        role={character.role}
        rioData={character.rioData}
        slug={character.slug}
      />

      <Tabs
        tabs={CHARACTER_TABS}
        defaultTab="stats"
      >
        <div data-tab="stats" key="stats">
          <StatsPanel rioData={character.rioData} armory={character.armory} />
        </div>

        <div data-tab="monedas" key="monedas">
          <MonedasPanel slug={character.slug} armory={character.armory} />
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
