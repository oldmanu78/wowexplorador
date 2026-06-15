import { cn } from "@/lib/utils";

interface DungeonMapPreviewProps {
  sigla: string;
  name: string;
  type: string;
  routeType?: string;
  className?: string;
}

export default function DungeonMapPreview({
  sigla,
  name,
  type,
  routeType = "dungeon",
  className,
}: DungeonMapPreviewProps) {
  const isNew = type === "nueva";
  const isHigh = routeType === "high";
  const accent = isHigh ? "#f05a28" : isNew ? "#00c8ff" : "#a78bfa";
  const routePath = isHigh
    ? "M34 150 C68 96 107 130 128 78 S200 58 228 112 S286 134 318 70"
    : "M30 74 C66 98 76 148 118 142 S174 72 211 116 S264 180 326 142";

  return (
    <div
      className={cn(
        "relative isolate flex h-full min-h-56 w-full items-center justify-center overflow-hidden bg-bg",
        className
      )}
      aria-label={`Mapa visual de ${name}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_24%,rgba(240,195,90,0.16),transparent_16rem),radial-gradient(circle_at_76%_76%,rgba(143,21,19,0.34),transparent_18rem)]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 360 220" aria-hidden="true">
        <defs>
          <pattern id={`grid-${sigla}-${routeType}`} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0H0v28" fill="none" stroke="rgba(240,195,90,.1)" strokeWidth="1" />
          </pattern>
          <filter id={`route-glow-${sigla}-${routeType}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={accent} floodOpacity=".72" />
          </filter>
        </defs>
        <rect width="360" height="220" fill={`url(#grid-${sigla}-${routeType})`} />
        <path d="M43 177 88 45 154 87 216 34 316 176Z" fill="rgba(25,16,13,.78)" stroke="rgba(240,195,90,.22)" strokeWidth="2" />
        <path d="M84 159 116 102 163 131 208 82 263 139" fill="none" stroke="rgba(243,231,208,.12)" strokeWidth="18" strokeLinecap="round" />
        <path d={routePath} fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" filter={`url(#route-glow-${sigla}-${routeType})`} />
        <circle cx="30" cy={isHigh ? "156" : "74"} r="8" fill="#f0c35a" />
        <circle cx={isHigh ? "318" : "326"} cy={isHigh ? "70" : "142"} r="8" fill={accent} />
      </svg>
      <div className="relative z-[1] rounded border border-[rgba(240,195,90,0.22)] bg-black/45 px-4 py-3 text-center backdrop-blur-sm">
        <span className="block font-cinzel text-3xl font-bold tracking-[0.18em]" style={{ color: accent }}>
          {sigla}
        </span>
        <span className="mt-1 block text-[0.65rem] font-black uppercase tracking-[0.18em] text-muted">
          {isHigh ? "High Key" : routeType === "pug" ? "PUG Route" : "Dungeon Map"}
        </span>
      </div>
    </div>
  );
}
