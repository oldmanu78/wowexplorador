export type RioDungeon = string | { slug?: string; name?: string };

export interface RioRun {
  dungeon?: RioDungeon;
  short_name?: string;
  mythic_rating?: number;
  score?: number;
  mythic_level?: number;
  completed_at?: string;
}

export interface RioGearItem {
  item_id?: number;
  item_level?: number;
  icon?: string;
  name?: string;
  item_quality?: number;
  tier?: string;
  gems_detail?: { id?: number; name?: string; icon?: string }[];
  enchants_detail?: { id?: number; name?: string; icon?: string }[];
}

export interface RaiderIoProfile {
  race?: string;
  faction?: string;
  active_spec_name?: string;
  mythic_plus_scores_by_season?: { scores?: { all?: number } }[];
  mythic_plus_recent_runs?: RioRun[];
  mythic_plus_best_runs?: RioRun[];
  raid_progression?: Record<string, RaidProgression>;
  gear?: {
    item_level_equipped?: number;
    items?: Record<string, RioGearItem>;
  };
}

export interface RaidProgression {
  summary?: string;
  total_bosses?: number;
  normal_bosses_killed?: number;
  heroic_bosses_killed?: number;
  mythic_bosses_killed?: number;
}

export interface ArmoryStatValue {
  type?: string;
  value?: number;
}

export interface ArmoryStats {
  ilvl?: number;
  currencies?: ArmoryCurrency[];
  items?: Record<string, unknown>;
  strength?: ArmoryStatValue;
  agility?: ArmoryStatValue;
  intellect?: ArmoryStatValue;
  stamina?: ArmoryStatValue;
  crit?: ArmoryStatValue;
  haste?: ArmoryStatValue;
  mastery?: ArmoryStatValue;
  versatility?: ArmoryStatValue;
  leech?: ArmoryStatValue;
  speed?: ArmoryStatValue;
  avoidance?: ArmoryStatValue;
}

export interface ArmoryCurrency {
  id?: number;
  name: string;
  quantity?: number;
  maxQuantity?: number;
  icon?: string;
}
