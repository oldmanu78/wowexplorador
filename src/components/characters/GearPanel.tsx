import Image from "next/image";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";

interface GearDetail {
  id?: number;
  name?: string;
  icon?: string;
}

interface GearSlot {
  slot: string;
  item: string;
  icon: string;
  wowheadId?: number;
  itemLevel: number;
  quality?: number;
  source: string;
  gems: GearDetail[];
  enchants: GearDetail[];
  isTier?: boolean;
}

interface GearPanelProps {
  gear: GearSlot[];
}

const SLOT_LABELS: Record<string, string> = {
  head: "Cabeza",
  neck: "Cuello",
  shoulder: "Hombros",
  back: "Capa",
  chest: "Pecho",
  wrist: "Muñecas",
  hands: "Manos",
  hand: "Manos",
  waist: "Cintura",
  legs: "Piernas",
  leg: "Piernas",
  feet: "Pies",
  finger1: "Anillo 1",
  finger2: "Anillo 2",
  trinket1: "Abalorio 1",
  trinket2: "Abalorio 2",
  mainhand: "Arma principal",
  offhand: "Mano izquierda",
  weapon: "Arma",
};

const SLOT_ORDER = [
  "head", "neck", "shoulder", "back", "chest", "wrist", "hands", "hand",
  "waist", "legs", "leg", "feet", "finger1", "finger2", "trinket1",
  "trinket2", "mainhand", "offhand", "weapon",
];

const QUALITY_COLORS: Record<number, string> = {
  2: "#1eff00",
  3: "#0070dd",
  4: "#a335ee",
  5: "#ff8000",
};

export default function GearPanel({ gear }: GearPanelProps) {
  const sortedGear = [...gear].sort((a, b) => slotRank(a.slot) - slotRank(b.slot));
  const tierItems = sortedGear.filter((g) => g.isTier);
  const averageIlvl = sortedGear.length
    ? sortedGear.reduce((sum, item) => sum + (item.itemLevel || 0), 0) / sortedGear.length
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-gold text-[0.74rem] font-black tracking-[0.18em] uppercase">
                Equipo actual
              </p>
              <p className="mt-1 text-xs text-muted">
                Datos reales desde Raider.io. No es una lista BiS teórica.
              </p>
            </div>
            <div className="text-right text-xs text-muted">
              <span className="block font-cinzel text-2xl text-gold">
                {averageIlvl > 0 ? averageIlvl.toFixed(0) : "—"}
              </span>
              iLvl promedio
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {sortedGear.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {sortedGear.map((item) => (
                <GearSlotCard key={item.slot} gear={item} />
              ))}
            </div>
          ) : (
            <p className="text-muted text-sm font-inter text-center">
              Datos de equipo no disponibles.
            </p>
          )}
        </CardBody>
      </Card>

      {tierItems.length > 0 && (
        <Card>
          <CardHeader>
            <p className="text-gold text-[0.74rem] font-black tracking-[0.18em] uppercase">
              Piezas de tier detectadas
            </p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {tierItems.map((item) => (
                <a
                  key={`tier-${item.slot}`}
                  href={item.wowheadId ? `https://www.wowhead.com/item=${item.wowheadId}` : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-[rgba(240,195,90,0.24)] bg-[rgba(7,5,4,0.52)] px-3 py-2 text-xs text-bone hover:border-gold hover:text-gold"
                >
                  {slotLabel(item.slot)} · {item.itemLevel || "?"}
                </a>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

function GearSlotCard({ gear }: { gear: GearSlot }) {
  const qualityColor = gear.quality ? QUALITY_COLORS[gear.quality] : undefined;
  const iconUrl = gear.icon && gear.icon !== "?"
    ? `https://wow.zamimg.com/images/wow/icons/large/${gear.icon}.jpg`
    : null;

  return (
    <article className="rounded border border-[rgba(240,195,90,0.2)] bg-[rgba(7,5,4,0.52)] p-3">
      <div className="flex gap-3">
        <div
          className="relative h-12 w-12 shrink-0 overflow-hidden rounded border bg-surface-strong"
          style={{ borderColor: qualityColor || "rgba(240,195,90,0.24)" }}
        >
          {iconUrl ? (
            <Image src={iconUrl} alt="" fill sizes="48px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-gold">?</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-muted">
                {slotLabel(gear.slot)}
              </p>
              {gear.wowheadId ? (
                <a
                  href={`https://www.wowhead.com/item=${gear.wowheadId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 block truncate text-sm font-bold text-bone hover:text-gold"
                  style={{ color: qualityColor }}
                >
                  {gear.item}
                </a>
              ) : (
                <p className="mt-0.5 truncate text-sm font-bold text-bone">{gear.item}</p>
              )}
            </div>
            <span className="shrink-0 rounded border border-[rgba(240,195,90,0.2)] px-2 py-1 text-xs font-bold text-gold">
              {gear.itemLevel ? `ilvl ${gear.itemLevel}` : "Sin ilvl"}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {gear.isTier && <GearPill color="#f0c35a">Tier</GearPill>}
            {gear.enchants.map((enchant) => (
              <GearPill key={`enchant-${enchant.id || enchant.name}`} color="#44cc88">
                {enchant.name || "Encantamiento"}
              </GearPill>
            ))}
            {gear.gems.map((gem) => (
              <GearPill key={`gem-${gem.id || gem.name}`} color="#a335ee">
                {gem.name || "Gema"}
              </GearPill>
            ))}
            {!gear.isTier && gear.enchants.length === 0 && gear.gems.length === 0 && (
              <span className="text-xs text-muted">Sin gemas ni encantamientos registrados</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function GearPill({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      className="rounded px-2 py-0.5 text-[0.68rem] font-bold"
      style={{ color, backgroundColor: `${color}1f` }}
    >
      {children}
    </span>
  );
}

function slotLabel(slot: string): string {
  return SLOT_LABELS[slot] || slot;
}

function slotRank(slot: string): number {
  const index = SLOT_ORDER.indexOf(slot);
  return index === -1 ? 999 : index;
}
