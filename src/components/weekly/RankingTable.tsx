// Tabla de ranking M+ por rol (Tank/DPS/Healer) con tabs
// Muestra top 5 por cada rol
'use client';

import { useState } from "react";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

// Datos de un personaje en el ranking
interface RankingEntry {
  name: string;
  class: string;
  score: number;
  spec: string;
}

interface RankingTableProps {
  tank: RankingEntry[];
  dps: RankingEntry[];
  healer: RankingEntry[];
}

// Roles disponibles para el filtro
const ROLES = [
  { key: "tank", label: "Tanque", color: "#4488ff" },
  { key: "dps", label: "DPS", color: "#ff4444" },
  { key: "healer", label: "Sanador", color: "#44cc88" },
];

export default function RankingTable({ tank, dps, healer }: RankingTableProps) {
  // Estado del rol activo
  const [activeRole, setActiveRole] = useState("tank");

  // Datos del rol activo
  const dataMap: Record<string, RankingEntry[]> = { tank, dps, healer };
  const entries = dataMap[activeRole] || [];

  return (
    <Card>
      <CardHeader>
        <h3 className="font-cinzel text-horda-gold text-sm tracking-wide mb-3">
          RANKING M+
        </h3>
        {/* Tabs de filtro por rol */}
        <div className="flex gap-1">
          {ROLES.map((role) => (
            <button
              key={role.key}
              onClick={() => setActiveRole(role.key)}
              className={cn(
                "px-3 py-1.5 text-xs rounded font-exo transition-all",
                activeRole === role.key
                  ? "text-white font-medium"
                  : "text-horda-muted hover:text-horda-text bg-transparent"
              )}
              style={{
                backgroundColor: activeRole === role.key ? role.color : "transparent",
                border: `1px solid ${activeRole === role.key ? role.color : "#333"}`,
              }}
            >
              {role.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-2">
          {entries.length === 0 && (
            <p className="text-horda-muted text-sm">Sin datos de ranking</p>
          )}
          {entries.map((entry, i) => (
            <div
              key={entry.name}
              className={cn(
                "flex items-center justify-between py-2 px-3 rounded",
                "bg-horda-bg border border-horda-border"
              )}
            >
              {/* Posición + nombre */}
              <div className="flex items-center gap-3">
                {/* Medalla para top 3, número para el resto */}
                <span className="text-lg w-6 text-center">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                </span>
                <div>
                  <p className="text-horda-text text-sm font-exo">{entry.name}</p>
                  <p className="text-xs text-horda-muted">{entry.spec}</p>
                </div>
              </div>
              {/* Score + clase */}
              <div className="flex items-center gap-2">
                <Badge color={entry.class ? undefined : undefined} variant="outline" size="sm">
                  {entry.class}
                </Badge>
                <span className="font-bold text-sm font-exo" style={{
                  color: entry.score >= 2000 ? "#a335ee" : entry.score >= 1500 ? "#0070dd" : "#ffffff"
                }}>
                  {entry.score.toLocaleString("es-CL")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
