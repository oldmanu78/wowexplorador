// Constantes de World of Warcraft para WoW Explorer
// Colores, clases, roles, mazmorras y configuraciones

// Colores de clase WoW (hex) para badges y estilos
export const CLASS_COLORS: Record<string, string> = {
  "Death Knight": "#C41E3A",
  "Demon Hunter": "#A330C9",
  Druid: "#FF7C0A",
  Evoker: "#33937F",
  Hunter: "#AAD372",
  Mage: "#3FC7EB",
  Monk: "#00FF98",
  Paladin: "#F48CBA",
  Priest: "#FFFFFF",
  Rogue: "#FFF468",
  Shaman: "#0070DD",
  Warlock: "#8788EE",
  Warrior: "#C69B3A",
};

// Colores de rol M+
export const ROLE_COLORS: Record<string, string> = {
  TANK: "#4488ff",
  HEALER: "#44cc88",
  DPS: "#ff4444",
};

// Texto de roles en español
export const ROLE_TEXT: Record<string, string> = {
  TANK: "Tanque",
  HEALER: "Sanador",
  DPS: "DPS",
};

// Emojis por rol
export const ROLE_EMOJI: Record<string, string> = {
  TANK: "🛡️",
  HEALER: "💚",
  DPS: "⚔️",
};

// Mazmorras de Midnight S1 con metadatos
export interface DungeonMeta {
  slug: string;
  name: string;
  sigla: string;
  type: "nueva" | "clasica";
  jefes: number;
  zona: string;
  timer: string;
}

export const DUNGEONS: DungeonMeta[] = [
  { slug: "algethar-academy", name: "Algeth'ar Academy", sigla: "AA", type: "nueva", jefes: 4, zona: "Thaldraszus", timer: "35 min" },
  { slug: "maisara-caverns", name: "Maisara Caverns", sigla: "MC", type: "nueva", jefes: 4, zona: "Harandar", timer: "33 min" },
  { slug: "nexus-point-xenas", name: "Nexus-Point Xenas", sigla: "NPX", type: "nueva", jefes: 4, zona: "Voidstorm", timer: "35 min" },
  { slug: "windrunner-spire", name: "Windrunner Spire", sigla: "WRS", type: "nueva", jefes: 4, zona: "Eversong Woods", timer: "34 min" },
  { slug: "magisters-terrace", name: "Magister's Terrace", sigla: "MT", type: "clasica", jefes: 4, zona: "Quel'Danas", timer: "32 min" },
  { slug: "pit-of-saron", name: "Pit of Saron", sigla: "POS", type: "clasica", jefes: 3, zona: "Icecrown", timer: "30 min" },
  { slug: "seat-of-the-triumvirate", name: "Seat of the Triumvirate", sigla: "SEAT", type: "clasica", jefes: 4, zona: "Argus", timer: "32 min" },
  { slug: "skyreach", name: "Skyreach", sigla: "SKY", type: "clasica", jefes: 4, zona: "Spires of Arak", timer: "28 min" },
];

// Umbrales de score M+ con sus colores (de mayor a menor)
export const SCORE_TIERS = [
  { min: 3000, color: "#ff8000", label: "Elite" },
  { min: 2000, color: "#a335ee", label: "Épico" },
  { min: 1500, color: "#0070dd", label: "Raro" },
  { min: 1000, color: "#1eff00", label: "Poco común" },
  { min: 0, color: "#ffffff", label: "Normal" },
];

// Personajes trackeados (configuración estática para fase 1)
// En fase 2 (multiusuario), esto se lee de la base de datos
export const TRACKED_CHARACTERS = [
  { name: "Kreathor", slug: "kreathor", className: "Death Knight", spec: "Blood", role: "TANK" },
  { name: "Muchufaza", slug: "muchufaza", className: "Monk", spec: "Brewmaster", role: "TANK" },
  { name: "Czernobög", slug: "czernobog", className: "Druid", spec: "Guardian", role: "TANK" },
  { name: "Oldkreeper", slug: "oldkreeper", className: "Shaman", spec: "Elemental", role: "DPS" },
  { name: "Redguardïan", slug: "redguardian", className: "Paladin", spec: "Retribution", role: "DPS" },
  { name: "Krëeper", slug: "kreeper", className: "Warrior", spec: "Protection", role: "TANK" },
  { name: "Nösferätü", slug: "nosferatu", className: "Demon Hunter", spec: "Vengeance", role: "TANK" },
];

// Nombres de los tabs de personaje (orden y configuración)
export const CHARACTER_TABS = [
  { id: "stats", label: "Stats" },
  { id: "monedas", label: "Monedas" },
  { id: "gear", label: "Gear & BiS" },
  { id: "dungeons", label: "Mazmorras" },
  { id: "runs", label: "M+ Runs" },
  { id: "raid", label: "Raid" },
  { id: "notes", label: "Notas" },
];
