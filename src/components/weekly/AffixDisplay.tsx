interface AffixDisplayProps {
  affixes: string;
}

const affixColors: Record<string, string> = {
  Fortificado: "#c32620",
  Reforzado: "#f05a28",
  Tiránico: "#f0c35a",
  "Sangre Sangrante": "#8f1513",
  Explosivo: "#f05a28",
  "Volátil Cargado": "#f0c35a",
  Espinas: "#aad372",
  "Atormentador": "#a330c9",
  "Orgulloso": "#f48cba",
  "Inquietante": "#44cc88",
  "Opresivo": "#4488ff",
  Huracanado: "#3fc7eb",
  "Xal'atath": "#8788ee",
};

export default function AffixDisplay({ affixes }: AffixDisplayProps) {
  const affixList = affixes.split(" - ").filter(Boolean);

  if (affixList.length === 0) {
    return <p className="text-muted">Sin datos de afijos</p>;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {affixList.map((affix, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-2 rounded border border-[rgba(240,195,90,0.2)] bg-[rgba(7,5,4,0.52)]">
          <span
            className="w-3 h-3 rounded-full inline-block shadow-[0_0_8px_currentColor]"
            style={{ backgroundColor: affixColors[affix] || "#f0c35a", color: affixColors[affix] || "#f0c35a" }}
          />
          <span className="text-bone text-sm font-inter font-medium">{affix}</span>
        </div>
      ))}
    </div>
  );
}
