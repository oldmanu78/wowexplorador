// Funciones utilitarias para WoW Explorer
// Colores de score, formateo, clases CSS condicionales

import { DUNGEONS, SCORE_TIERS } from "./constants";
import type { RaiderIoProfile } from "./wow-types";

// Retorna el color HTML correspondiente al score M+
// Basado en los thresholds: 3000+, 2000+, 1500+, 1000+, 0+
export function getScoreColor(score: number): string {
  for (const tier of SCORE_TIERS) {
    if (score >= tier.min) return tier.color;
  }
  return "#ffffff";
}

export function getScoreDisplayColor(score: number, emptyColor = "#6b7280"): string {
  return score > 0 ? getScoreColor(score) : emptyColor;
}

// Retorna la clase CSS para el color de score (usado con Tailwind)
export function getScoreColorClass(score: number): string {
  if (score >= 3000) return "text-score-elite";
  if (score >= 2000) return "text-score-epic";
  if (score >= 1500) return "text-score-rare";
  if (score >= 1000) return "text-score-uncommon";
  return "text-score-common";
}

// Formatea números con separadores de miles (ej: 284739 → "284.739")
export function formatNumber(num: number): string {
  return num.toLocaleString("es-CL");
}

// Formatea oro de WoW: valor en cobres → "284.739g"
export function formatGold(copper: number): string {
  const gold = Math.floor(copper / 10000);
  return `${formatNumber(gold)}g`;
}

// Formatea fecha ISO a DD/MM/YYYY
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Obtiene el nombre del dungeon a partir del slug
export function getDungeonName(slug: string): string {
  const names: Record<string, string> = {
    "algethar-academy": "Algeth'ar Academy",
    "maisara-caverns": "Maisara Caverns",
    "nexus-point-xenas": "Nexus-Point Xenas",
    "windrunner-spire": "Windrunner Spire",
    "magisters-terrace": "Magister's Terrace",
    "pit-of-saron": "Pit of Saron",
    "seat-of-the-triumvirate": "Seat of the Triumvirate",
    skyreach: "Skyreach",
  };
  return names[slug] || slug;
}

export function slugifyDungeonName(name: string): string {
  const normalized = name
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return DUNGEONS.find(
    (dungeon) => dungeon.slug === normalized || dungeon.name.toLowerCase() === name.toLowerCase()
  )?.slug || normalized;
}

export function getRioDungeonSlug(dungeon: string | { slug?: string; name?: string } | undefined): string {
  if (!dungeon) return "";
  if (typeof dungeon === "string") return slugifyDungeonName(dungeon);
  return dungeon.slug || (dungeon.name ? slugifyDungeonName(dungeon.name) : "");
}

// Calcula el próximo reset semanal (martes 15:00 UTC)
// Usado para el contador regresivo
export function nextReset(): Date {
  const now = new Date();
  const day = now.getUTCDay();
  const daysUntilTuesday = (2 - day + 7) % 7;
  const next = new Date(now);
  next.setUTCDate(now.getUTCDate() + daysUntilTuesday);
  next.setUTCHours(15, 0, 0, 0);
  if (next <= now) {
    next.setUTCDate(next.getUTCDate() + 7);
  }
  return next;
}

// Merge condicional de clases CSS (utilidad tipo clsx)
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Parsea el JSON de rioData de forma segura
// Retorna null si el JSON es inválido o vacío
export function safeJsonParse<T>(str: string | null | undefined): T | null {
  if (!str) return null;
  try {
    return JSON.parse(str) as T;
  } catch {
    return null;
  }
}

// Obtiene el score M+ total desde el perfil de Raider.io
export function getRioScore(rioData: string | null): number {
  const rio = safeJsonParse<RaiderIoProfile>(rioData);
  if (!rio) return 0;
  const scores = rio?.mythic_plus_scores_by_season;
  if (!scores || !scores[0]?.scores?.all) return 0;
  return scores[0].scores.all;
}

// Obtiene el item level equipado desde Raider.io
export function getRioIlvl(rioData: string | null): number {
  const rio = safeJsonParse<RaiderIoProfile>(rioData);
  return rio?.gear?.item_level_equipped || 0;
}

export function withBasePath(path: string | null | undefined): string {
  if (!path) return "";
  if (!path.startsWith("/")) return path;
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;
}
