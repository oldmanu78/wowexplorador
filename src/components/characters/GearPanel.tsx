// Tab 3: Gear & BiS del personaje
// Muestra los 17 slots de equipo con sus items BiS, wowhead links y prioridad
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
  gear: GearSlot[]; // Datos de gear desde SQLite (BiS data)
}

// Colores de prioridad
const PRIO_COLORS: Record<string, string> = {
  SSS: "#ff8000",
  SS: "#a335ee",
  S: "#0070dd",
  A: "#1eff00",
  B: "#ffffff",
};

export default function GearPanel({ gear }: GearPanelProps) {
  // Separa en tier set y M+ BiS
  const tierItems = gear.filter((g) => g.isTier);
  const bisItems = gear.filter((g) => !g.isTier);

  return (
    <div className="space-y-6">
      {/* Tier Set */}
      {tierItems.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="font-cinzel text-horda-gold text-sm tracking-wide">TIER SET</h3>
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

      {/* M+ BiS */}
      {bisItems.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="font-cinzel text-horda-gold text-sm tracking-wide">
              M+ BEST IN SLOT
            </h3>
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

      {/* Sin datos */}
      {gear.length === 0 && (
        <Card>
          <CardBody>
            <p className="text-horda-muted text-sm font-exo text-center">
              Datos de equipo no disponibles.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

// Card individual para un slot de gear
function GearSlotCard({ gear }: { gear: GearSlot }) {
  return (
    <div className="bg-horda-bg rounded border border-horda-border p-3">
      {/* Slot name */}
      <p className="text-horda-muted text-xs font-exo mb-1 uppercase tracking-wide">
        {gear.slot}
      </p>
      {/* Icono + nombre del item */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded bg-horda-surface flex items-center justify-center text-xs border border-horda-border shrink-0"
          style={{ borderColor: PRIO_COLORS[gear.prio] || "#333" }}
        >
          {gear.icon}
        </div>
        <div className="min-w-0">
          {/* Si tiene wowheadId, crea link con tooltip */}
          {gear.wowheadId ? (
            <a
              href={`https://www.wowhead.com/item=${gear.wowheadId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-horda-text text-xs font-exo hover:text-horda-gold transition-colors block truncate"
            >
              {gear.item}
            </a>
          ) : (
            <p className="text-horda-text text-xs font-exo truncate">{gear.item}</p>
          )}
          {/* Fuente del item */}
          <p className="text-horda-muted text-[10px] font-exo">{gear.source}</p>
        </div>
      </div>
      {/* Prioridad */}
      <span
        className="inline-block text-[10px] font-bold font-exo mt-1.5 px-1.5 py-0.5 rounded"
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
