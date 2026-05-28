// Tab 4: Scores por mazmorra
// Muestra el score de cada dungeon M+ con colores por rango
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import { getDungeonName } from "@/lib/utils";
import { DUNGEONS } from "@/lib/constants";

interface DungeonScore {
  slug: string;       // Slug de la mazmorra
  score: number;      // Score M+ en esa mazmorra
  level?: number;     // Nivel de la clave
}

interface DungeonPanelProps {
  scores: DungeonScore[];
}

export default function DungeonPanel({ scores }: DungeonPanelProps) {
  // Mapa de scores por slug para acceso rápido
  const scoreMap = new Map(scores.map((s) => [s.slug, s]));

  return (
    <Card>
      <CardHeader>
        <h3 className="font-cinzel text-horda-gold text-sm tracking-wide">
          SCORES POR MAZMORRA
        </h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-2">
          {DUNGEONS.map((dungeon) => {
            const data = scoreMap.get(dungeon.slug);
            const score = data?.score || 0;

            // Color según el rango del score
            const color = score >= 3000 ? "#ff8000" :
              score >= 2000 ? "#a335ee" :
              score >= 1500 ? "#0070dd" :
              score >= 1000 ? "#1eff00" :
              score > 0 ? "#ffffff" : "#6b7280";

            return (
              <div
                key={dungeon.slug}
                className="flex items-center justify-between py-2 px-3 bg-horda-bg rounded border border-horda-border"
              >
                {/* Nombre + sigla */}
                <div className="flex items-center gap-2">
                  {/* Dot de tipo (nueva = cyan, clásica = purple) */}
                  <span
                    className="w-2 h-2 rounded-full inline-block shrink-0"
                    style={{
                      backgroundColor: dungeon.type === "nueva" ? "#00c8ff" : "#a78bfa",
                    }}
                  />
                  <span className="text-horda-text text-sm font-exo">
                    {dungeon.name}
                  </span>
                  <span className="text-horda-muted text-xs font-exo">
                    {dungeon.sigla}
                  </span>
                </div>

                {/* Score + level */}
                <div className="flex items-center gap-3">
                  {data?.level && (
                    <span className="text-xs text-horda-muted font-exo">
                      +{data.level}
                    </span>
                  )}
                  <span
                    className="font-bold text-sm font-exo"
                    style={{ color }}
                  >
                    {score > 0 ? score.toLocaleString("es-CL") : "—"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sin datos */}
        {scores.length === 0 && (
          <p className="text-horda-muted text-sm font-exo text-center mt-4">
            Sin datos de carreras M+ esta semana.
          </p>
        )}
      </CardBody>
    </Card>
  );
}
