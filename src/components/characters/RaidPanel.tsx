// Tab 6: Progreso de raid
// Muestra el progreso del personaje en la raid Midnight S1 (Normal/Heroic/Mythic)
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import { safeJsonParse } from "@/lib/utils";

interface RaidPanelProps {
  rioData: string | null; // Perfil de Raider.io con raid_progression
}

// Total de jefes en Midnight S1 (tier-mn-1)
const TOTAL_BOSSES = 9;

interface RaidProgression {
  summary: string;
  total_bosses: number;
  normal_bosses_killed: number;
  heroic_bosses_killed: number;
  mythic_bosses_killed: number;
}

export default function RaidPanel({ rioData }: RaidPanelProps) {
  const rio = safeJsonParse<Record<string, any>>(rioData);
  const raidProg = rio?.raid_progression?.["tier-mn-1"] as RaidProgression | undefined;

  // Si no hay datos de raid
  if (!raidProg || !raidProg.total_bosses) {
    return (
      <Card>
        <CardBody>
          <p className="text-horda-muted text-sm font-exo text-center">
            Datos de raid no disponibles.
          </p>
        </CardBody>
      </Card>
    );
  }

  const difficulties = [
    { label: "Normal", killed: raidProg.normal_bosses_killed || 0, color: "bg-blue-500" },
    { label: "Heroico", killed: raidProg.heroic_bosses_killed || 0, color: "bg-purple-500" },
    { label: "Mítico", killed: raidProg.mythic_bosses_killed || 0, color: "bg-orange-500" },
  ];

  return (
    <Card>
      <CardHeader>
        <h3 className="font-cinzel text-horda-gold text-sm tracking-wide">
          PROGRESO RAID — MIDNIGHT S1
        </h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {/* Barras de progreso por dificultad */}
          {difficulties.map((diff) => (
            <ProgressBar
              key={diff.label}
              label={diff.label}
              value={diff.killed}
              max={TOTAL_BOSSES}
              color={diff.color}
              height="md"
            />
          ))}

          {/* Resumen textual */}
          <p className="text-xs text-horda-muted text-center font-exo pt-2 border-t border-horda-border">
            {raidProg.summary || "Sin resumen disponible"}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
