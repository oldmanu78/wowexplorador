import Card, { CardBody, CardHeader } from "@/components/ui/Card";

interface GearSlot {
  slot: string;
  item: string;
  icon: string;
  wowheadId?: number;
  source: string;
  prio: string;
  isTier?: boolean;
}

interface GearPanelProps {
  gear: GearSlot[];
}

const PRIO_COLORS: Record<string, string> = {
  SSS: "#ff8000",
  SS: "#a335ee",
  S: "#0070dd",
  A: "#1eff00",
  B: "#ffffff",
};

export default function GearPanel({ gear }: GearPanelProps) {
  const tierItems = gear.filter((g) => g.isTier);
  const bisItems = gear.filter((g) => !g.isTier);

  return (
    <div className="space-y-6">
      {tierItems.length > 0 && (
        <Card>
          <CardHeader>
            <p className="text-gold text-[0.74rem] font-black tracking-[0.18em] uppercase">Tier Set</p>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {tierItems.map((g) => (
                <GearSlotCard key={g.slot} gear={g} />
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {bisItems.length > 0 && (
        <Card>
          <CardHeader>
            <p className="text-gold text-[0.74rem] font-black tracking-[0.18em] uppercase">M+ Best in Slot</p>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {bisItems.map((g) => (
                <GearSlotCard key={g.slot} gear={g} />
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {gear.length === 0 && (
        <Card>
          <CardBody>
            <p className="text-muted text-sm font-inter text-center">
              Datos de equipo no disponibles.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

function GearSlotCard({ gear }: { gear: GearSlot }) {
  return (
    <div className="bg-[rgba(7,5,4,0.52)] rounded border border-[rgba(240,195,90,0.2)] p-3">
      <p className="text-muted text-xs font-inter font-bold mb-1 uppercase tracking-wide">
        {gear.slot}
      </p>
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded bg-surface-strong flex items-center justify-center text-xs border border-[rgba(240,195,90,0.2)] shrink-0"
          style={{ borderColor: PRIO_COLORS[gear.prio] || "#2c2420" }}
        >
          {gear.icon}
        </div>
        <div className="min-w-0">
          {gear.wowheadId ? (
            <a
              href={`https://www.wowhead.com/item=${gear.wowheadId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-bone text-xs font-inter hover:text-gold transition-colors block truncate"
            >
              {gear.item}
            </a>
          ) : (
            <p className="text-bone text-xs font-inter truncate">{gear.item}</p>
          )}
          <p className="text-muted text-[10px] font-inter">{gear.source}</p>
        </div>
      </div>
      <span
        className="inline-block text-[10px] font-bold font-inter mt-1.5 px-1.5 py-0.5 rounded"
        style={{
          color: PRIO_COLORS[gear.prio] || "#fff",
          backgroundColor: `${PRIO_COLORS[gear.prio] || "#fff"}22`,
        }}
      >
        {gear.prio}
      </span>
    </div>
  );
}
