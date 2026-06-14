import { prisma } from "@/lib/db";
import { safeJsonParse } from "@/lib/utils";
import type { RaiderIoProfile } from "@/lib/wow-types";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import AffixDisplay from "@/components/weekly/AffixDisplay";
import EventCard from "@/components/weekly/EventCard";
import WorldBossCard from "@/components/weekly/WorldBossCard";
import TokenPrice from "@/components/weekly/TokenPrice";
import NewsFeed from "@/components/weekly/NewsFeed";
import InvasionList from "@/components/weekly/InvasionList";
import RankingTable from "@/components/weekly/RankingTable";
import Image from "next/image";
import { withBasePath } from "@/lib/utils";

export default async function HomePage() {
  const weekly = await prisma.weeklySnapshot.findFirst({
    orderBy: { weekStart: "desc" },
  });

  const news = await prisma.news.findMany({
    orderBy: { date: "desc" },
  });

  const invasions = await prisma.invasion.findMany();

  const characters = await prisma.character.findMany({
    where: { isActive: true },
  });

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

  const totalScore = characters.reduce((sum, c) => sum + extractScore(c.rioData), 0);
  const avgIlvl = characters.reduce((sum, c) => {
    const rio = safeJsonParse<RaiderIoProfile>(c.rioData);
    return sum + (rio?.gear?.item_level_equipped || 0);
  }, 0) / (characters.length || 1);

  return (
    <>
      <section className="relative min-h-[420px] grid items-center py-18 overflow-hidden border-b border-[rgba(240,195,90,0.14)]">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,5,4,0.98)_0%,rgba(7,5,4,0.72)_39%,rgba(7,5,4,0.1)_72%),radial-gradient(circle_at_78%_38%,rgba(240,90,40,0.32),transparent_21rem),radial-gradient(circle_at_78%_54%,rgba(195,38,32,0.28),transparent_28rem)] z-[1]" />

        <div className="absolute right-0 bottom-0 w-[500px] h-[500px] pointer-events-none opacity-20 hidden lg:block" aria-hidden="true">
          <Image
            src={withBasePath("/horde-crest.svg")}
            alt=""
            fill
            className="object-contain drop-shadow-[0_0_60px_rgba(195,38,32,0.5)]"
          />
        </div>

        <div className="relative z-[2] max-w-[1180px] mx-auto px-4 w-full">
          <p className="inline-flex items-center gap-2.5 text-gold text-[0.8rem] font-black tracking-[0.18em] uppercase mb-4">
            <span className="w-8 h-px bg-gold" />
            Nueva temporada de guerra
            <span className="w-8 h-px bg-gold" />
          </p>
          <h1 className="font-cinzel text-bone text-[clamp(2.4rem,8vw,5rem)] leading-[0.86] tracking-[0.02em] uppercase" style={{ textShadow: "0 10px 36px rgba(0,0,0,0.75)" }}>
            Panel <span className="block text-gold" style={{ textShadow: "0 0 26px rgba(240,90,40,0.5)" }}>Semanal</span>
          </h1>
          <p className="w-[min(590px,100%)] mt-5 text-muted text-[clamp(1rem,2vw,1.22rem)] leading-[1.65]">
            Afijos, evento, token, world boss y ranking de tu warband en Quel&apos;Thalas US.
            Datos actualizados cada semana via pipeline automatizado.
          </p>
        </div>
      </section>

      <section className="relative z-[3] -mt-6 max-w-[1180px] mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 border border-[rgba(240,195,90,0.28)] rounded-lg bg-[linear-gradient(180deg,rgba(25,16,13,0.96),rgba(9,6,5,0.96))] shadow-[0_24px_80px_rgba(0,0,0,0.55)] overflow-hidden">
          <MetricItem icon="members" value={String(characters.length)} label="Personajes" />
          <MetricItem icon="score" value={totalScore > 0 ? `${(totalScore / 1000).toFixed(1)}K` : "0"} label="Score Total" />
          <MetricItem icon="ilvl" value={avgIlvl > 0 ? avgIlvl.toFixed(0) : "—"} label="iLvl Promedio" />
          <MetricItem icon="dungeons" value="8" label="Mazmorras S1" />
        </div>
      </section>

      <section className="max-w-[1180px] mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          <div className="space-y-6">
            <SectionEyebrow>Campana destacada</SectionEyebrow>

            <Card>
              <CardHeader>
                <h3 className="font-cinzel text-gold text-sm tracking-wide uppercase">Afijos M+</h3>
              </CardHeader>
              <CardBody>
                <AffixDisplay affixes={weekly?.affixes || ""} />
              </CardBody>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <EventCard event={weekly?.event || ""} />
              <TokenPrice price={weekly?.tokenPrice || "Buscando..."} />
              <WorldBossCard boss={weekly?.worldBoss || ""} />
            </div>

            <div className="border-t border-[rgba(240,195,90,0.16)] pt-6 mt-6 bg-[linear-gradient(90deg,rgba(7,5,4,0.92),rgba(58,13,11,0.56),rgba(7,5,4,0.92))] rounded-lg p-6">
              <RankingTable
                tank={rankingData.tank}
                dps={rankingData.dps}
                healer={rankingData.healer}
              />
            </div>
          </div>

          <div className="space-y-6">
            <SectionEyebrow>Actualidad</SectionEyebrow>

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

            {weekly && (
              <p className="text-xs text-muted text-center font-inter">
                Ultima actualizacion: {weekly.weekStart.toLocaleDateString("es-CL")}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function extractScore(rioData: string | null): number {
  const rio = safeJsonParse<RaiderIoProfile>(rioData);
  return rio?.mythic_plus_scores_by_season?.[0]?.scores?.all || 0;
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-gold text-[0.74rem] font-black tracking-[0.18em] uppercase mb-4">
      {children}
    </p>
  );
}

function MetricItem({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="grid grid-cols-[42px_1fr] gap-3 items-center min-h-[96px] p-4 border-r border-[rgba(240,195,90,0.18)] last:border-r-0 md:last:border-r-0 max-md:border-r-0 max-md:border-b last:max-md:border-b-0">
      <MetricIcon type={icon} />
      <div>
        <strong className="block text-gold font-cinzel text-[1.55rem] leading-none">{value}</strong>
        <span className="text-muted text-[0.76rem] font-extrabold tracking-[0.08em] uppercase">{label}</span>
      </div>
    </div>
  );
}

function MetricIcon({ type }: { type: string }) {
  const iconClass = "w-[38px] h-[38px] text-gold";

  switch (type) {
    case "members":
      return <svg className={iconClass} viewBox="0 0 48 48" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="3" d="M9 38c2-7 8-11 15-11s13 4 15 11M16 16a8 8 0 1 0 16 0 8 8 0 0 0-16 0Z" /></svg>;
    case "score":
      return <svg className={iconClass} viewBox="0 0 48 48" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="3" d="M24 5l6 14h15l-12 9 5 15-14-10-14 10 5-15L7 19h15z" /></svg>;
    case "ilvl":
      return <svg className={iconClass} viewBox="0 0 48 48" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="3" d="M24 5v38M12 15l12-8 12 8M12 33l12 8 12-8M10 24h28" /></svg>;
    case "dungeons":
      return <svg className={iconClass} viewBox="0 0 48 48" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="3" d="M8 25h32M13 16v18M35 16v18M5 19v12M43 19v12" /></svg>;
    default:
      return null;
  }
}
