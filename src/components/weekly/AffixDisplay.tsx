// Muestra los afijos de la semana con dots de colores
// Los afijos vienen como string separado por " - " desde SQLite

interface AffixDisplayProps {
  affixes: string; // Ej: "Fortificado - Reforzado - Tiránico - Xal'atath"
}

// Paleta de colores para cada afijo conocido
const affixColors: Record<string, string> = {
  Fortificado: "#ff4444",
  Reforzado: "#ff8844",
  Tiránico: "#ffaa00",
  "Sangre Sangrante": "#cc0000",
  Explosivo: "#ff6600",
  "Volátil Cargado": "#ffaa00",
  Espinas: "#88cc00",
  "Atormentador": "#aa44ff",
  "Orgulloso": "#ff88ff",
  "Inquietante": "#88ff88",
  "Opresivo": "#8888ff",
  Huracanado: "#00ccff",
  "Xal'atath": "#aa00ff",
};

export default function AffixDisplay({ affixes }: AffixDisplayProps) {
  // Separa el string de afijos en un array
  const affixList = affixes.split(" - ").filter(Boolean);

  if (affixList.length === 0) {
    return <p className="text-horda-muted">Sin datos de afijos</p>;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {affixList.map((affix, i) => (
        <div key={i} className="flex items-center gap-2">
          {/* Dot de color según el afijo */}
          <span
            className="w-3 h-3 rounded-full inline-block"
            style={{ backgroundColor: affixColors[affix] || "#F8B700" }}
          />
          {/* Nombre del afijo */}
          <span className="text-horda-text text-sm font-exo">{affix}</span>
        </div>
      ))}
    </div>
  );
}
