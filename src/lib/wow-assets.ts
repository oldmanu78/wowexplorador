export const CLASS_ICON_URLS: Record<string, string> = {
  "Death Knight": "https://wow.zamimg.com/images/wow/icons/large/classicon_deathknight.jpg",
  "Demon Hunter": "https://wow.zamimg.com/images/wow/icons/large/classicon_demonhunter.jpg",
  Druid: "https://wow.zamimg.com/images/wow/icons/large/classicon_druid.jpg",
  Evoker: "https://wow.zamimg.com/images/wow/icons/large/classicon_evoker.jpg",
  Hunter: "https://wow.zamimg.com/images/wow/icons/large/classicon_hunter.jpg",
  Mage: "https://wow.zamimg.com/images/wow/icons/large/classicon_mage.jpg",
  Monk: "https://wow.zamimg.com/images/wow/icons/large/classicon_monk.jpg",
  Paladin: "https://wow.zamimg.com/images/wow/icons/large/classicon_paladin.jpg",
  Priest: "https://wow.zamimg.com/images/wow/icons/large/classicon_priest.jpg",
  Rogue: "https://wow.zamimg.com/images/wow/icons/large/classicon_rogue.jpg",
  Shaman: "https://wow.zamimg.com/images/wow/icons/large/classicon_shaman.jpg",
  Warlock: "https://wow.zamimg.com/images/wow/icons/large/classicon_warlock.jpg",
  Warrior: "https://wow.zamimg.com/images/wow/icons/large/classicon_warrior.jpg",
};

export const RACE_ICON_URLS: Record<string, string> = {
  "Blood Elf": "https://wow.zamimg.com/images/wow/icons/large/achievement_character_bloodelf_male.jpg",
  Dracthyr: "https://wow.zamimg.com/images/wow/icons/large/classicon_evoker.jpg",
  Goblin: "https://wow.zamimg.com/images/wow/icons/large/race_goblin_male.jpg",
  Orc: "https://wow.zamimg.com/images/wow/icons/large/achievement_character_orc_male.jpg",
  Pandaren: "https://wow.zamimg.com/images/wow/icons/large/race_pandaren_male.jpg",
  Tauren: "https://wow.zamimg.com/images/wow/icons/large/achievement_character_tauren_male.jpg",
  Troll: "https://wow.zamimg.com/images/wow/icons/large/achievement_character_troll_male.jpg",
  Undead: "https://wow.zamimg.com/images/wow/icons/large/achievement_character_undead_male.jpg",
  "Zandalari Troll": "https://wow.zamimg.com/images/wow/icons/large/achievement_character_troll_male.jpg",
};

export function getRaceIconUrl(race: string | null | undefined): string | null {
  if (!race) return null;
  return RACE_ICON_URLS[race] || null;
}

export function getClassIconUrl(className: string): string | null {
  return CLASS_ICON_URLS[className] || null;
}
