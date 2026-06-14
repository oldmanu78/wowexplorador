'use client';

import { useState } from "react";
import { CardBody, CardHeader } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { ROLE_COLORS } from "@/lib/constants";
import { cn, getScoreColor } from "@/lib/utils";

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

const ROLES = [
  { key: "tank", label: "Tanque", color: ROLE_COLORS.TANK },
  { key: "dps", label: "DPS", color: ROLE_COLORS.DPS },
  { key: "healer", label: "Sanador", color: ROLE_COLORS.HEALER },
];

export default function RankingTable({ tank, dps, healer }: RankingTableProps) {
  const [activeRole, setActiveRole] = useState("tank");

  const dataMap: Record<string, RankingEntry[]> = { tank, dps, healer };
  const entries = dataMap[activeRole] || [];

  return (
    <div>
      <CardHeader>
        <p className="text-gold text-[0.74rem] font-black tracking-[0.18em] uppercase mb-3">
          Ranking M+
        </p>
        <div className="flex gap-2">
          {ROLES.map((role) => (
            <button
              key={role.key}
              onClick={() => setActiveRole(role.key)}
              className={cn(
                "px-3 py-1.5 text-xs rounded font-inter font-bold transition-all",
                activeRole === role.key
                  ? "text-[#180c07] font-medium"
                  : "text-muted hover:text-bone bg-transparent"
              )}
              style={{
                backgroundColor: activeRole === role.key ? role.color : "transparent",
                border: `1px solid ${activeRole === role.key ? role.color : "rgba(240,195,90,0.2)"}`,
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
            <p className="text-muted text-sm">Sin datos de ranking</p>
          )}
          {entries.map((entry, i) => (
            <div
              key={entry.name}
              className={cn(
                "flex items-center justify-between py-3 px-4 rounded",
                "bg-[rgba(7,5,4,0.52)] border border-[rgba(240,195,90,0.2)]"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold font-cinzel",
                    i < 3 ? "border-gold text-gold bg-[rgba(240,195,90,0.1)]" : "border-[rgba(240,195,90,0.2)] text-muted"
                  )}
                  aria-label={`Posicion ${i + 1}`}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="text-bone text-sm font-inter">{entry.name}</p>
                  <p className="text-xs text-muted">{entry.spec}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" size="sm">
                  {entry.class}
                </Badge>
                <span className="font-bold text-sm font-inter" style={{ color: getScoreColor(entry.score) }}>
                  {entry.score.toLocaleString("es-CL")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </div>
  );
}
