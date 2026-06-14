import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import { DUNGEONS } from "@/lib/constants";
import { getScoreDisplayColor } from "@/lib/utils";

interface DungeonScore {
  slug: string;
  score: number;
  level?: number;
}

interface DungeonPanelProps {
  scores: DungeonScore[];
}

export default function DungeonPanel({ scores }: DungeonPanelProps) {
  const scoreMap = new Map(scores.map((s) => [s.slug, s]));

  return (
    <Card>
      <CardHeader>
        <p className="text-gold text-[0.74rem] font-black tracking-[0.18em] uppercase">
          Scores por Mazmorra
        </p>
      </CardHeader>
      <CardBody>
        <div className="space-y-2">
          {DUNGEONS.map((dungeon) => {
            const data = scoreMap.get(dungeon.slug);
            const score = data?.score || 0;

            return (
              <div
                key={dungeon.slug}
                className="flex items-center justify-between py-3 px-4 bg-[rgba(7,5,4,0.52)] rounded border border-[rgba(240,195,90,0.2)]"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full inline-block shrink-0"
                    style={{
                      backgroundColor: dungeon.type === "nueva" ? "#00c8ff" : "#a78bfa",
                    }}
                  />
                  <span className="text-bone text-sm font-inter">
                    {dungeon.name}
                  </span>
                  <span className="text-muted text-xs font-inter">{dungeon.sigla}</span>
                </div>

                <div className="flex items-center gap-3">
                  {data?.level && (
                    <span className="text-xs text-muted font-inter">
                      +{data.level}
                    </span>
                  )}
                  <span
                    className="font-bold text-sm font-inter"
                    style={{ color: getScoreDisplayColor(score) }}
                  >
                    {score > 0 ? score.toLocaleString("es-CL") : "—"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {scores.length === 0 && (
          <p className="text-muted text-sm font-inter text-center mt-4">
            Sin datos de carreras M+ esta semana.
          </p>
        )}
      </CardBody>
    </Card>
  );
}
