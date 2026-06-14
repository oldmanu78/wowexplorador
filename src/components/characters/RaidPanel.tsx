import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import { safeJsonParse } from "@/lib/utils";
import type { RaiderIoProfile } from "@/lib/wow-types";

interface RaidPanelProps {
  rioData: string | null;
}

const TOTAL_BOSSES = 9;

export default function RaidPanel({ rioData }: RaidPanelProps) {
  const rio = safeJsonParse<RaiderIoProfile>(rioData);
  const raidProg = rio?.raid_progression?.["tier-mn-1"];

  if (!raidProg || !raidProg.total_bosses) {
    return (
      <Card>
        <CardBody>
          <p className="text-muted text-sm font-inter text-center">
            Datos de raid no disponibles.
          </p>
        </CardBody>
      </Card>
    );
  }

  const difficulties = [
    { label: "Normal", killed: raidProg.normal_bosses_killed || 0, color: "bg-blue-500" },
    { label: "Heroico", killed: raidProg.heroic_bosses_killed || 0, color: "bg-purple-500" },
    { label: "Mitico", killed: raidProg.mythic_bosses_killed || 0, color: "bg-orange-500" },
  ];

  return (
    <Card>
      <CardHeader>
        <p className="text-gold text-[0.74rem] font-black tracking-[0.18em] uppercase">
          Progreso Raid — Midnight S1
        </p>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
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

          <p className="text-xs text-muted text-center font-inter pt-2 border-t border-[rgba(240,195,90,0.16)]">
            {raidProg.summary || "Sin resumen disponible"}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
