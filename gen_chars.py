#!/usr/bin/env python3
"""Genera páginas individuales para los 6 personajes secundarios."""
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

def hex_to_rgb(h):
    h = h.lstrip('#')
    return f"{int(h[0:2],16)},{int(h[2:4],16)},{int(h[4:6],16)}"

CHARS = [
    {'name':'Muchufaza',   'url':'Muchufaza',               'file':'muchufaza',   'cls':'Monk',         'spec':'Brewmaster',  'role':'TANK','color':'#00FF98','px':'mu'},
    {'name':'Czernobög',   'url':'Czernob%C3%B6g',           'file':'czernobog',   'cls':'Druid',        'spec':'Guardian',    'role':'TANK','color':'#FF7C0A','px':'cz'},
    {'name':'Oldkreeper',  'url':'Oldkreeper',               'file':'oldkreeper',  'cls':'Shaman',       'spec':'Elemental',   'role':'DPS', 'color':'#0070DD','px':'ok'},
    {'name':'Redguardïan', 'url':'Redguard%C3%AFan',         'file':'redguardian', 'cls':'Paladin',      'spec':'Retribution', 'role':'DPS', 'color':'#F48CBA','px':'rg'},
    {'name':'Krëeper',     'url':'Kr%C3%ABeper',              'file':'kreeper',     'cls':'Warrior',      'spec':'Protection',  'role':'TANK','color':'#C69B3A','px':'kp'},
    {'name':'Nösferätü',   'url':'N%C3%B6sfer%C3%A4t%C3%BC', 'file':'nosferatu',   'cls':'Demon Hunter', 'spec':'Vengeance',   'role':'TANK','color':'#A330C9','px':'ns'},
]

ROLE_EMOJI = {'TANK':'&#128737;', 'DPS':'&#9876;', 'HEALER':'&#10010;'}
ROLE_TEXT  = {'TANK':'Tanque',    'DPS':'DPS',     'HEALER':'Sanador'}

GEAR_SLOTS = [
    ('weapon_2h', 'Arma 2H'),
    ('weapon_1h', 'Arma 1H'),
    ('offhand', 'Offhand'),
    ('head', 'Casco'),
    ('shoulder', 'Hombros'),
    ('chest', 'Pecho'),
    ('hands', 'Guantes'),
    ('legs', 'Piernas'),
    ('cloak', 'Capa'),
    ('wrist', 'Mu\u00f1ecas'),
    ('waist', 'Cintur\u00f3n'),
    ('feet', 'Botas'),
    ('ring1', 'Anillo 1'),
    ('ring2', 'Anillo 2'),
    ('neck', 'Cuello'),
    ('trinket1', 'Trinket 1'),
    ('trinket2', 'Trinket 2'),
]

PRIO_COLORS = {'SSS':'#ff8000','SS':'#a335ee','S':'#0070dd','A':'#1eff00','B':'#ffffff'}

GEAR_DATA = {
    'Muchufaza': {
        'stats': 'Haste > Crit > Vers > Mastery',
        'top_dungeon': 'Skyreach',
        'tier_name': 'Vestment of the Ten Thunders (Monk Tier)',
        'slots': {
            'weapon_2h': {'nombre': 'Blood Knight\'s Warblade', 'icono': 'inv_sword_2h_questbloodelf_b_01', 'wowhead': 237846, 'fuente': 'Crafteado', 'prio': 'SS'},
            'head': {'nombre': 'Crown of the Ten Thunders', 'icono': 'inv_helm_leather_raidmonkmidnight_d_01', 'wowhead': 249967, 'fuente': 'Raid Midnight T1', 'prio': 'SSS', 'tier': True},
            'shoulder': {'nombre': 'Mantle of the Ten Thunders', 'icono': 'inv_shoulder_leather_raidmonkmidnight_d_01', 'wowhead': 249968, 'fuente': 'Raid Midnight T1', 'prio': 'SSS', 'tier': True},
            'chest': {'nombre': 'Robe of the Ten Thunders', 'icono': 'inv_chest_leather_raidmonkmidnight_d_01', 'wowhead': 249969, 'fuente': 'Raid Midnight T1', 'prio': 'SSS', 'tier': True},
            'hands': {'nombre': 'Handwraps of the Ten Thunders', 'icono': 'inv_gloves_leather_raidmonkmidnight_d_01', 'wowhead': 249970, 'fuente': 'Raid Midnight T1', 'prio': 'S', 'tier': True},
            'legs': {'nombre': 'Leggings of the Ten Thunders', 'icono': 'inv_pants_leather_raidmonkmidnight_d_01', 'wowhead': 249971, 'fuente': 'Raid Midnight T1', 'prio': 'SSS', 'tier': True},
            'cloak': {'nombre': 'Adherent\'s Silken Shroud', 'icono': 'inv_cape_cloth_questbloodelf_b_01', 'wowhead': 232355, 'fuente': 'Crafteado', 'prio': 'S'},
            'wrist': {'nombre': 'Spellbreaker\'s Bracers', 'icono': 'inv_plate_questbloodelf_b_01_bracer', 'wowhead': 232340, 'fuente': 'Crafteado', 'prio': 'S'},
            'waist': {'nombre': 'Girdle of the Ancient Pit', 'icono': 'inv_belt_plate_icecrown_d_01', 'wowhead': 232348, 'fuente': 'POS', 'prio': 'A'},
            'feet': {'nombre': 'Surefoot Moccasins', 'icono': 'inv_boots_leather_dungeonharronir_c_01', 'wowhead': 249972, 'fuente': 'MC', 'prio': 'A'},
            'ring1': {'nombre': 'Platinum Star Band', 'icono': 'inv_10_dungeonjewelry_explorer_ring_1_color1', 'wowhead': 238010, 'fuente': 'AA', 'prio': 'SS'},
            'ring2': {'nombre': 'Occlusion of Void', 'icono': 'inv_12_trinket_devouring_host_currency1_bronze', 'wowhead': 238020, 'fuente': 'NPX', 'prio': 'SS'},
            'neck': {'nombre': 'Barbed Ymirheim Choker', 'icono': 'inv_jewelry_necklace_22', 'wowhead': 238090, 'fuente': 'Crafteado', 'prio': 'S'},
            'trinket1': {'nombre': 'Algeth\'ar Puzzle Box', 'icono': 'inv_misc_enggizmos_18', 'wowhead': 238050, 'fuente': 'AA', 'prio': 'SSS'},
            'trinket2': {'nombre': 'Heart of Wind', 'icono': 'inv_10_jewelcrafting3_soulcage_air', 'wowhead': 238040, 'fuente': 'WRS', 'prio': 'SS'},
        }
    },
    'Czernob\u00f6g': {
        'stats': 'Haste > Mastery > Vers > Crit',
        'top_dungeon': 'Windrunner Spire',
        'tier_name': 'Wildstalker\'s Aspect (Druid Tier)',
        'slots': {
            'weapon_2h': {'nombre': 'Bloomforged Greataxe', 'icono': 'inv_axe_2h_dungeonharronir_c_01', 'wowhead': 237960, 'fuente': 'Crafteado', 'prio': 'SS'},
            'head': {'nombre': 'Wildstalker\'s Aspect Helm', 'icono': 'inv_helm_leather_raiddruidmidnight_d_01', 'wowhead': 249973, 'fuente': 'Raid Midnight T1', 'prio': 'SSS', 'tier': True},
            'shoulder': {'nombre': 'Wildstalker\'s Aspect Spaulders', 'icono': 'inv_shoulder_leather_raiddruidmidnight_d_01', 'wowhead': 249974, 'fuente': 'Raid Midnight T1', 'prio': 'SSS', 'tier': True},
            'chest': {'nombre': 'Wildstalker\'s Aspect Tunic', 'icono': 'inv_chest_leather_raiddruidmidnight_d_01', 'wowhead': 249975, 'fuente': 'Raid Midnight T1', 'prio': 'SSS', 'tier': True},
            'hands': {'nombre': 'Wildstalker\'s Aspect Grips', 'icono': 'inv_gloves_leather_raiddruidmidnight_d_01', 'wowhead': 249976, 'fuente': 'Raid Midnight T1', 'prio': 'S', 'tier': True},
            'legs': {'nombre': 'Wildstalker\'s Aspect Leggings', 'icono': 'inv_pants_leather_raiddruidmidnight_d_01', 'wowhead': 249977, 'fuente': 'Raid Midnight T1', 'prio': 'SSS', 'tier': True},
            'cloak': {'nombre': 'Adherent\'s Silken Shroud', 'icono': 'inv_cape_cloth_questbloodelf_b_01', 'wowhead': 232355, 'fuente': 'Crafteado', 'prio': 'S'},
            'wrist': {'nombre': 'Spellbreaker\'s Bracers', 'icono': 'inv_plate_questbloodelf_b_01_bracer', 'wowhead': 232340, 'fuente': 'Crafteado', 'prio': 'S'},
            'waist': {'nombre': 'Spellbreaker\'s Girdle', 'icono': 'inv_belt_plate_questbloodelf_b_01', 'wowhead': 232345, 'fuente': 'Crafteado', 'prio': 'A'},
            'feet': {'nombre': 'Oathsworn Stompers', 'icono': 'inv_boots_plate_dungeon_c_01', 'wowhead': 232362, 'fuente': 'MT', 'prio': 'A'},
            'ring1': {'nombre': 'Occlusion of Void', 'icono': 'inv_12_trinket_devouring_host_currency1_bronze', 'wowhead': 238020, 'fuente': 'NPX', 'prio': 'SS'},
            'ring2': {'nombre': 'Omission of Light', 'icono': 'inv_12_trinket_devouring_host_currency1_silver', 'wowhead': 238030, 'fuente': 'NPX', 'prio': 'SS'},
            'neck': {'nombre': 'Loa Worshiper\'s Band', 'icono': 'inv_12_profession_jewelcrafting_ring3_silver', 'wowhead': 232380, 'fuente': 'Crafteado', 'prio': 'S'},
            'trinket1': {'nombre': 'Heart of Wind', 'icono': 'inv_10_jewelcrafting3_soulcage_air', 'wowhead': 238040, 'fuente': 'WRS', 'prio': 'SSS'},
            'trinket2': {'nombre': 'Algeth\'ar Puzzle Box', 'icono': 'inv_misc_enggizmos_18', 'wowhead': 238050, 'fuente': 'AA', 'prio': 'SS'},
        }
    },
    'Oldkreeper': {
        'stats': 'Haste > Mastery > Crit > Vers',
        'top_dungeon': 'Nexus-Point Xenas',
        'tier_name': 'Primal Core (Elemental Tier)',
        'slots': {
            'weapon_1h': {'nombre': 'Excavating Cudgel', 'icono': 'inv_mace_1h_dungeonharronir_c_02', 'wowhead': 237940, 'fuente': 'MC', 'prio': 'SS'},
            'offhand': {'nombre': 'Ward of the Spellbreaker', 'icono': 'inv_shield_1h_dungeonharronir_c_01', 'wowhead': 237950, 'fuente': 'MC', 'prio': 'S'},
            'head': {'nombre': 'Crown of the Primal Core', 'icono': 'inv_helm_mail_raidelementalmidnight_d_01', 'wowhead': 249978, 'fuente': 'Raid Midnight T1', 'prio': 'SSS', 'tier': True},
            'shoulder': {'nombre': 'Mantle of the Primal Core', 'icono': 'inv_shoulder_mail_raidelementalmidnight_d_01', 'wowhead': 249979, 'fuente': 'Raid Midnight T1', 'prio': 'SSS', 'tier': True},
            'chest': {'nombre': 'Robe of the Primal Core', 'icono': 'inv_chest_mail_raidelementalmidnight_d_01', 'wowhead': 249980, 'fuente': 'Raid Midnight T1', 'prio': 'SSS', 'tier': True},
            'hands': {'nombre': 'Gloves of the Primal Core', 'icono': 'inv_gloves_mail_raidelementalmidnight_d_01', 'wowhead': 249981, 'fuente': 'Raid Midnight T1', 'prio': 'S', 'tier': True},
            'legs': {'nombre': 'Leggings of the Primal Core', 'icono': 'inv_pants_mail_raidelementalmidnight_d_01', 'wowhead': 249982, 'fuente': 'Raid Midnight T1', 'prio': 'SSS', 'tier': True},
            'cloak': {'nombre': 'Adherent\'s Silken Shroud', 'icono': 'inv_cape_cloth_questbloodelf_b_01', 'wowhead': 232355, 'fuente': 'Crafteado', 'prio': 'S'},
            'wrist': {'nombre': 'Spellbreaker\'s Bracers', 'icono': 'inv_plate_questbloodelf_b_01_bracer', 'wowhead': 232340, 'fuente': 'Crafteado', 'prio': 'S'},
            'waist': {'nombre': 'Girdle of the Ancient Pit', 'icono': 'inv_belt_plate_icecrown_d_01', 'wowhead': 232348, 'fuente': 'POS', 'prio': 'A'},
            'feet': {'nombre': 'Oathsworn Stompers', 'icono': 'inv_boots_plate_dungeon_c_01', 'wowhead': 232362, 'fuente': 'MT', 'prio': 'A'},
            'ring1': {'nombre': 'Platinum Star Band', 'icono': 'inv_10_dungeonjewelry_explorer_ring_1_color1', 'wowhead': 238010, 'fuente': 'AA', 'prio': 'SS'},
            'ring2': {'nombre': 'Occlusion of Void', 'icono': 'inv_12_trinket_devouring_host_currency1_bronze', 'wowhead': 238020, 'fuente': 'NPX', 'prio': 'SS'},
            'neck': {'nombre': 'Barbed Ymirheim Choker', 'icono': 'inv_jewelry_necklace_22', 'wowhead': 238090, 'fuente': 'Crafteado', 'prio': 'S'},
            'trinket1': {'nombre': 'Emberwing Feather', 'icono': 'inv_icon_feather06a', 'wowhead': 238060, 'fuente': 'WRS', 'prio': 'SSS'},
            'trinket2': {'nombre': 'Gaze of the Alnseer', 'icono': 'inv_12_trinket_raid_dreamrift_gazeofthealnseer', 'wowhead': 238070, 'fuente': 'Raid Midnight T1', 'prio': 'SS'},
        }
    },
    'Redguard\u00efan': {
        'stats': 'Haste > Vers > Crit > Mastery',
        'top_dungeon': 'Algeth\'ar Academy',
        'tier_name': 'Luminant Verdict (Retribution Tier)',
        'slots': {
            'weapon_2h': {'nombre': 'Blood Knight\'s Warblade', 'icono': 'inv_sword_2h_questbloodelf_b_01', 'wowhead': 237846, 'fuente': 'Crafteado', 'prio': 'SS'},
            'head': {'nombre': 'Crown of the Luminant Verdict', 'icono': 'inv_helm_plate_raidpaladinmidnight_d_01', 'wowhead': 249983, 'fuente': 'Raid Midnight T1', 'prio': 'SSS', 'tier': True},
            'shoulder': {'nombre': 'Mantle of the Luminant Verdict', 'icono': 'inv_shoulder_plate_raidpaladinmidnight_d_01', 'wowhead': 249984, 'fuente': 'Raid Midnight T1', 'prio': 'SSS', 'tier': True},
            'chest': {'nombre': 'Chestguard of the Luminant Verdict', 'icono': 'inv_chest_plate_raidpaladinmidnight_d_01', 'wowhead': 249985, 'fuente': 'Raid Midnight T1', 'prio': 'SSS', 'tier': True},
            'hands': {'nombre': 'Gauntlets of the Luminant Verdict', 'icono': 'inv_gloves_plate_raidpaladinmidnight_d_01', 'wowhead': 249986, 'fuente': 'Raid Midnight T1', 'prio': 'S', 'tier': True},
            'legs': {'nombre': 'Legguards of the Luminant Verdict', 'icono': 'inv_pants_plate_raidpaladinmidnight_d_01', 'wowhead': 249987, 'fuente': 'Raid Midnight T1', 'prio': 'SSS', 'tier': True},
            'cloak': {'nombre': 'Adherent\'s Silken Shroud', 'icono': 'inv_cape_cloth_questbloodelf_b_01', 'wowhead': 232355, 'fuente': 'Crafteado', 'prio': 'S'},
            'wrist': {'nombre': 'Spellbreaker\'s Bracers', 'icono': 'inv_plate_questbloodelf_b_01_bracer', 'wowhead': 232340, 'fuente': 'Crafteado', 'prio': 'S'},
            'waist': {'nombre': 'Spellbreaker\'s Girdle', 'icono': 'inv_belt_plate_questbloodelf_b_01', 'wowhead': 232345, 'fuente': 'Crafteado', 'prio': 'A'},
            'feet': {'nombre': 'Oathsworn Stompers', 'icono': 'inv_boots_plate_dungeon_c_01', 'wowhead': 232362, 'fuente': 'MT', 'prio': 'A'},
            'ring1': {'nombre': 'Occlusion of Void', 'icono': 'inv_12_trinket_devouring_host_currency1_bronze', 'wowhead': 238020, 'fuente': 'NPX', 'prio': 'SS'},
            'ring2': {'nombre': 'Omission of Light', 'icono': 'inv_12_trinket_devouring_host_currency1_silver', 'wowhead': 238030, 'fuente': 'NPX', 'prio': 'SS'},
            'neck': {'nombre': 'Barbed Ymirheim Choker', 'icono': 'inv_jewelry_necklace_22', 'wowhead': 238090, 'fuente': 'Crafteado', 'prio': 'S'},
            'trinket1': {'nombre': 'Algeth\'ar Puzzle Box', 'icono': 'inv_misc_enggizmos_18', 'wowhead': 238050, 'fuente': 'AA', 'prio': 'SSS'},
            'trinket2': {'nombre': 'Solarflare Prism', 'icono': 'inv_enchant_shardbrilliantlarge', 'wowhead': 238080, 'fuente': 'POS', 'prio': 'SS'},
        }
    },
    'Kr\u00ebeper': {
        'stats': 'Haste > Vers > Mastery > Crit',
        'top_dungeon': 'Algeth\'ar Academy',
        'tier_name': 'Eternal Guardian (Protection Tier)',
        'slots': {
            'weapon_2h': {'nombre': 'Blood Knight\'s Warblade', 'icono': 'inv_sword_2h_questbloodelf_b_01', 'wowhead': 237846, 'fuente': 'Crafteado', 'prio': 'SS'},
            'head': {'nombre': 'Helm of the Eternal Guardian', 'icono': 'inv_helm_plate_raidwarriormidnight_d_01', 'wowhead': 249988, 'fuente': 'Raid Midnight T1', 'prio': 'SSS', 'tier': True},
            'shoulder': {'nombre': 'Pauldrons of the Eternal Guardian', 'icono': 'inv_shoulder_plate_raidwarriormidnight_d_01', 'wowhead': 249989, 'fuente': 'Raid Midnight T1', 'prio': 'SSS', 'tier': True},
            'chest': {'nombre': 'Chestguard of the Eternal Guardian', 'icono': 'inv_chest_plate_raidwarriormidnight_d_01', 'wowhead': 249990, 'fuente': 'Raid Midnight T1', 'prio': 'SSS', 'tier': True},
            'hands': {'nombre': 'Gauntlets of the Eternal Guardian', 'icono': 'inv_gloves_plate_raidwarriormidnight_d_01', 'wowhead': 249991, 'fuente': 'Raid Midnight T1', 'prio': 'S', 'tier': True},
            'legs': {'nombre': 'Legguards of the Eternal Guardian', 'icono': 'inv_pants_plate_raidwarriormidnight_d_01', 'wowhead': 249992, 'fuente': 'Raid Midnight T1', 'prio': 'SSS', 'tier': True},
            'cloak': {'nombre': 'Adherent\'s Silken Shroud', 'icono': 'inv_cape_cloth_questbloodelf_b_01', 'wowhead': 232355, 'fuente': 'Crafteado', 'prio': 'S'},
            'wrist': {'nombre': 'Spellbreaker\'s Bracers', 'icono': 'inv_plate_questbloodelf_b_01_bracer', 'wowhead': 232340, 'fuente': 'Crafteado', 'prio': 'S'},
            'waist': {'nombre': 'Spellbreaker\'s Girdle', 'icono': 'inv_belt_plate_questbloodelf_b_01', 'wowhead': 232345, 'fuente': 'Crafteado', 'prio': 'A'},
            'feet': {'nombre': 'Oathsworn Stompers', 'icono': 'inv_boots_plate_dungeon_c_01', 'wowhead': 232362, 'fuente': 'MT', 'prio': 'A'},
            'ring1': {'nombre': 'Occlusion of Void', 'icono': 'inv_12_trinket_devouring_host_currency1_bronze', 'wowhead': 238020, 'fuente': 'NPX', 'prio': 'SS'},
            'ring2': {'nombre': 'Omission of Light', 'icono': 'inv_12_trinket_devouring_host_currency1_silver', 'wowhead': 238030, 'fuente': 'NPX', 'prio': 'SS'},
            'neck': {'nombre': 'Loa Worshiper\'s Band', 'icono': 'inv_12_profession_jewelcrafting_ring3_silver', 'wowhead': 232380, 'fuente': 'Crafteado', 'prio': 'S'},
            'trinket1': {'nombre': 'Algeth\'ar Puzzle Box', 'icono': 'inv_misc_enggizmos_18', 'wowhead': 238050, 'fuente': 'AA', 'prio': 'SSS'},
            'trinket2': {'nombre': 'Heart of Wind', 'icono': 'inv_10_jewelcrafting3_soulcage_air', 'wowhead': 238040, 'fuente': 'WRS', 'prio': 'SS'},
        }
    },
    'N\u00f6sfer\u00e4t\u00fc': {
        'stats': 'Haste > Mastery > Vers > Crit',
        'top_dungeon': 'Algeth\'ar Academy',
        'tier_name': 'Darkweaver (Vengeance Tier)',
        'slots': {
            'weapon_2h': {'nombre': 'Blood Knight\'s Warblade', 'icono': 'inv_sword_2h_questbloodelf_b_01', 'wowhead': 237846, 'fuente': 'Crafteado', 'prio': 'SS'},
            'head': {'nombre': 'Helm of the Darkweaver', 'icono': 'inv_helm_leather_raitdhmidnight_d_01', 'wowhead': 249993, 'fuente': 'Raid Midnight T1', 'prio': 'SSS', 'tier': True},
            'shoulder': {'nombre': 'Pauldrons of the Darkweaver', 'icono': 'inv_shoulder_leather_raitdhmidnight_d_01', 'wowhead': 249994, 'fuente': 'Raid Midnight T1', 'prio': 'SSS', 'tier': True},
            'chest': {'nombre': 'Chestguard of the Darkweaver', 'icono': 'inv_chest_leather_raitdhmidnight_d_01', 'wowhead': 249995, 'fuente': 'Raid Midnight T1', 'prio': 'SSS', 'tier': True},
            'hands': {'nombre': 'Gauntlets of the Darkweaver', 'icono': 'inv_gloves_leather_raitdhmidnight_d_01', 'wowhead': 249996, 'fuente': 'Raid Midnight T1', 'prio': 'S', 'tier': True},
            'legs': {'nombre': 'Legguards of the Darkweaver', 'icono': 'inv_pants_leather_raitdhmidnight_d_01', 'wowhead': 249997, 'fuente': 'Raid Midnight T1', 'prio': 'SSS', 'tier': True},
            'cloak': {'nombre': 'Adherent\'s Silken Shroud', 'icono': 'inv_cape_cloth_questbloodelf_b_01', 'wowhead': 232355, 'fuente': 'Crafteado', 'prio': 'S'},
            'wrist': {'nombre': 'Spellbreaker\'s Bracers', 'icono': 'inv_plate_questbloodelf_b_01_bracer', 'wowhead': 232340, 'fuente': 'Crafteado', 'prio': 'S'},
            'waist': {'nombre': 'Spellbreaker\'s Girdle', 'icono': 'inv_belt_plate_questbloodelf_b_01', 'wowhead': 232345, 'fuente': 'Crafteado', 'prio': 'A'},
            'feet': {'nombre': 'Oathsworn Stompers', 'icono': 'inv_boots_plate_dungeon_c_01', 'wowhead': 232362, 'fuente': 'MT', 'prio': 'A'},
            'ring1': {'nombre': 'Occlusion of Void', 'icono': 'inv_12_trinket_devouring_host_currency1_bronze', 'wowhead': 238020, 'fuente': 'NPX', 'prio': 'SS'},
            'ring2': {'nombre': 'Omission of Light', 'icono': 'inv_12_trinket_devouring_host_currency1_silver', 'wowhead': 238030, 'fuente': 'NPX', 'prio': 'SS'},
            'neck': {'nombre': 'Barbed Ymirheim Choker', 'icono': 'inv_jewelry_necklace_22', 'wowhead': 238090, 'fuente': 'Crafteado', 'prio': 'S'},
            'trinket1': {'nombre': 'Heart of Wind', 'icono': 'inv_10_jewelcrafting3_soulcage_air', 'wowhead': 238040, 'fuente': 'WRS', 'prio': 'SSS'},
            'trinket2': {'nombre': 'Solarflare Prism', 'icono': 'inv_enchant_shardbrilliantlarge', 'wowhead': 238080, 'fuente': 'POS', 'prio': 'SS'},
        }
    },
}

def gen(c):
    col  = c['color']
    rgb  = hex_to_rgb(col)
    name = c['name']
    url  = c['url']
    cls  = c['cls']
    spec = c['spec']
    px   = c['px']
    re   = ROLE_EMOJI[c['role']]
    rt   = ROLE_TEXT[c['role']]

    gd = GEAR_DATA.get(name)
    if gd:
        tier_items = []
        mplus_items = []
        dungeon_counts = {}
        for key, sname in GEAR_SLOTS:
            item = gd['slots'].get(key)
            if not item:
                continue
            icon_url = f'https://assets.rpglogs.com/img/warcraft/abilities/{item["icono"]}.jpg'
            wh_url = f'https://www.wowhead.com/item={item["wowhead"]}'
            prio_color = PRIO_COLORS.get(item['prio'], '#ffffff')
            entry = f'''<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--b1)">
  <img src="{icon_url}" style="width:28px;height:28px;border-radius:4px;border:1px solid var(--b2);background:var(--bg3)" alt="{sname}">
  <div style="flex:1;min-width:0">
    <div style="font-size:.8em;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><a href="{wh_url}" target="_blank">{item["nombre"]}</a></div>
    <div style="font-size:.68em;color:var(--muted)">{sname}</div>
  </div>
  <span style="font-size:.7em;color:{prio_color};font-weight:600">{item["prio"]}</span>
</div>'''
            if item.get('tier'):
                tier_items.append(entry)
            else:
                mplus_items.append(entry)
                src = item["fuente"]
                if 'Raid' not in src and 'Crafteado' not in src:
                    dungeon_counts[src] = dungeon_counts.get(src, 0) + 1
        tier_html = '\n    '.join(tier_items) if tier_items else '<div style="font-size:.78em;color:var(--muted);padding:8px 0">Sin datos de tier.</div>'
        mplus_html = '\n    '.join(mplus_items) if mplus_items else '<div style="font-size:.78em;color:var(--muted);padding:8px 0">Sin datos de M+ BiS.</div>'
        sorted_dngs = sorted(dungeon_counts.items(), key=lambda x: -x[1])
        mx = sorted_dngs[0][1] if sorted_dngs else 1
        dng_rows = ''
        for src, count in sorted_dngs:
            pct = round(count / mx * 100)
            dng_rows += f'''<div class="dungeon-rank-row">
  <span class="dungeon-rank-name">{src}</span>
  <div class="dungeon-rank-bar"><div class="dungeon-rank-fill" style="width:{pct}%;background:var(--ac)"></div></div>
  <span class="dungeon-rank-count">{count} pieza{"s" if count > 1 else ""}</span>
</div>'''
        gear_section = f'''<div class="gear-bis-grid" style="margin-bottom:18px">
  <div class="tier-set-card" style="border-left:3px solid var(--ac);background:var(--bg2);border:1px solid var(--b1);border-radius:8px;padding:14px">
    <h4 class="gear-section-title">&#127991; Tier Set</h4>
    {tier_html}
  </div>
  <div class="mplus-card" style="border-left:3px solid #5ab4ff;background:var(--bg2);border:1px solid var(--b1);border-radius:8px;padding:14px">
    <h4 class="gear-section-title">&#9876; M+ BiS</h4>
    {mplus_html}
  </div>
</div>
<div class="card">
  <h4 class="gear-section-title">&#128200; Dungeon Ranking by BiS</h4>
  {dng_rows if dng_rows else '<p style="color:var(--muted);font-size:.78em">Sin datos de mazmorras.</p>'}
</div>
<div class="two-col" style="margin-top:18px">
  <div class="card"><h3>&#128202; Prioridad de Stats</h3><p style="font-size:.9em;color:var(--gold);font-family:\'Cinzel\',serif">{gd["stats"]}</p></div>
  <div class="card"><h3>&#127758; Mejor Mazmorra</h3><p style="font-size:.9em;color:var(--gold);font-family:\'Cinzel\',serif">{gd["top_dungeon"]}</p><p style="font-size:.72em;color:var(--muted);margin-top:3px">Dungeon con m&aacute;s items BiS</p></div>
</div>'''
    else:
        gear_section = '<p style="color:var(--muted);font-size:.83em;padding:14px 0">Sin datos de gear disponibles.</p>'

    return f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{name} — {spec} {cls}</title>
<link rel="stylesheet" href="css/fonts.css">
<style>
:root{{--ac:{col};--gold:#F8B700;--bg:#07080f;--bg2:#0e0f1a;--bg3:#141525;--b1:#1e2035;--b2:#2a2b45;--text:#ccd0e0;--muted:#6a6e8a;--green:#2ecc71;--blue:#5ab4ff;--purp:#c084f5;--ora:#e67e22}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{background:var(--bg);color:var(--text);font-family:'Exo 2',sans-serif;min-height:100vh}}
a{{color:var(--gold);text-decoration:none}}a:hover{{text-decoration:underline}}
.topnav{{background:rgba(7,8,15,.92);border-bottom:1px solid var(--b2);padding:10px 24px;display:flex;gap:12px;flex-wrap:wrap;position:sticky;top:0;z-index:50;backdrop-filter:blur(8px)}}
.topnav a{{font-size:.8em;font-family:'Cinzel',serif;color:var(--muted);border:1px solid var(--b2);padding:5px 12px;border-radius:4px;transition:all .2s}}
.topnav a:hover{{color:var(--gold);border-color:var(--gold);text-decoration:none}}
.hero{{position:relative;overflow:hidden;background:linear-gradient(135deg,#07080f,#0e0f1a 40%,#141525);border-bottom:2px solid var(--ac);padding:36px 30px 28px}}
.hero::before{{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 600px 300px at 80% 50%,rgba({rgb},.10),transparent 70%);pointer-events:none}}
.hero-inner{{max-width:1100px;margin:0 auto;display:flex;align-items:center;gap:24px;position:relative}}
.char-portrait{{width:100px;height:100px;border-radius:50%;border:3px solid var(--ac);box-shadow:0 0 24px rgba({rgb},.5);object-fit:cover;background:#0e0f1a;flex-shrink:0}}
.char-ph{{width:100px;height:100px;border-radius:50%;border:3px solid var(--ac);box-shadow:0 0 24px rgba({rgb},.4);background:linear-gradient(135deg,#0e0f1a,#1a1a2e);display:flex;align-items:center;justify-content:center;font-size:2.5em;flex-shrink:0}}
.hero-info{{flex:1}}
.char-name{{font-family:'Cinzel',serif;font-size:2.2em;font-weight:700;color:var(--ac);text-shadow:0 0 30px rgba({rgb},.6);line-height:1;margin-bottom:6px}}
.char-meta{{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:14px}}
.bspec{{background:rgba({rgb},.2);border:1px solid rgba({rgb},.5);color:var(--ac);font-size:.76em;font-weight:600;padding:3px 10px;border-radius:4px}}
.brole{{background:rgba(26,120,194,.2);border:1px solid rgba(26,120,194,.4);color:var(--blue);font-size:.76em;padding:3px 10px;border-radius:4px}}
.brealm{{color:var(--muted);font-size:.78em}}
.hero-stats{{display:flex;gap:22px;flex-wrap:wrap}}
.hstat{{text-align:center}}
.hstat-val{{font-family:'Cinzel',serif;font-size:1.5em;font-weight:600;color:#fff;display:block}}
.hstat-label{{font-size:.66em;color:var(--muted);text-transform:uppercase;letter-spacing:1px}}
.hero-links{{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}}
.hl{{font-size:.76em;font-weight:500;padding:5px 12px;border-radius:4px;border:1px solid;transition:all .2s}}
.hl-rio{{border-color:rgba(248,183,0,.5);color:var(--gold)}}.hl-rio:hover{{background:rgba(248,183,0,.1);text-decoration:none}}
.hl-ext{{border-color:var(--b2);color:var(--muted)}}.hl-ext:hover{{color:var(--text);border-color:#444;text-decoration:none}}
.tabs{{display:flex;border-bottom:1px solid var(--b2);background:var(--bg2);padding:0 20px;overflow-x:auto;scrollbar-width:thin}}
.tab-btn{{background:none;border:none;border-bottom:3px solid transparent;color:var(--muted);font-family:'Cinzel',serif;font-size:.72em;font-weight:600;padding:12px 13px;cursor:pointer;white-space:nowrap;transition:all .2s;letter-spacing:.4px}}
.tab-btn:hover{{color:var(--text)}}.tab-btn.active{{color:var(--ac);border-bottom-color:var(--ac)}}
.main{{max-width:1100px;margin:0 auto;padding:22px}}
.tab-panel{{display:none}}.tab-panel.active{{display:block}}
.stitle{{font-family:'Cinzel',serif;font-size:.74em;letter-spacing:2px;color:var(--muted);text-transform:uppercase;margin-bottom:12px;padding-bottom:7px;border-bottom:1px solid var(--b1);display:flex;align-items:center;gap:8px}}
.acc{{color:var(--ac)}}
.card{{background:var(--bg2);border:1px solid var(--b1);border-radius:8px;padding:16px}}
.card h3{{font-family:'Cinzel',serif;font-size:.78em;color:var(--muted);letter-spacing:1px;margin-bottom:12px;text-transform:uppercase}}
.two-col{{display:grid;grid-template-columns:1fr 1fr;gap:18px}}
@media(max-width:700px){{.two-col{{grid-template-columns:1fr}}}}
.check-item{{display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid var(--b1);cursor:pointer;user-select:none;transition:opacity .15s}}
.check-item:last-child{{border-bottom:none}}.check-item.done{{opacity:.42}}
.check-box{{width:19px;height:19px;border-radius:4px;border:2px solid var(--b2);flex-shrink:0;margin-top:1px;display:flex;align-items:center;justify-content:center;font-size:.78em;transition:all .15s}}
.check-item.done .check-box{{background:var(--ac);border-color:var(--ac);color:#000}}
.check-lbl{{flex:1}}.check-lbl-t{{font-size:.86em;font-weight:500}}
.check-item.done .check-lbl-t{{text-decoration:line-through;color:var(--muted)}}
.check-lbl-s{{font-size:.7em;color:var(--muted);margin-top:2px}}
.ctag{{font-size:.66em;padding:2px 7px;border-radius:3px;flex-shrink:0;align-self:flex-start}}
.tw{{background:rgba(248,183,0,.12);color:var(--gold);border:1px solid rgba(248,183,0,.25)}}
.td{{background:rgba(46,204,113,.12);color:var(--green);border:1px solid rgba(46,204,113,.25)}}
.tv{{background:rgba(155,77,202,.15);color:var(--purp);border:1px solid rgba(155,77,202,.3)}}
.prow{{display:flex;align-items:center;gap:10px;margin-bottom:9px}}.prow:last-child{{margin-bottom:0}}
.plbl{{font-size:.78em;width:115px;flex-shrink:0}}
.pbg{{flex:1;height:7px;background:var(--b2);border-radius:3px;overflow:hidden}}
.pf{{height:100%;border-radius:3px;transition:width .3s}}
.ppct{{font-size:.7em;color:var(--muted);width:36px;text-align:right}}
.rbar{{background:var(--bg2);border:1px solid var(--b2);border-radius:8px;padding:12px 18px;margin-bottom:18px;display:flex;align-items:center;gap:16px;flex-wrap:wrap}}
.rlabel{{font-size:.68em;color:var(--muted);text-transform:uppercase;letter-spacing:1px}}
.rcd{{font-family:'Cinzel',serif;font-size:1.3em;color:var(--gold);margin-top:2px}}
.rg{{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:10px}}
.rc{{background:var(--bg2);border:1px solid var(--b1);border-radius:6px;padding:11px 13px;display:flex;align-items:center;gap:11px}}
.rkey{{width:42px;height:42px;border-radius:6px;background:var(--bg3);border:1px solid var(--b2);display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0}}
.rkl{{font-family:'Cinzel',serif;font-size:1.05em;font-weight:700;color:#fff}}
.rks{{font-size:.62em;color:var(--muted)}}
.ri{{flex:1;min-width:0}}
.rdn{{font-size:.85em;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
.rm{{font-size:.7em;color:var(--muted);margin-top:2px}}
.rsc{{font-family:'Cinzel',serif;font-size:1.05em;font-weight:600}}
.t-yes{{color:var(--green)}}.t-no{{color:#e74c3c}}
.rb{{margin-bottom:18px}}
.rbn{{font-family:'Cinzel',serif;font-size:.88em;color:var(--text);margin-bottom:9px;display:flex;align-items:center;gap:9px}}
.dr{{display:flex;align-items:center;gap:9px;margin-bottom:5px}}
.dl{{font-size:.7em;width:58px;flex-shrink:0}}
.dbg{{flex:1;height:7px;background:var(--b2);border-radius:3px;overflow:hidden}}
.dbf{{height:100%;border-radius:3px}}
.dk2{{font-size:.72em;color:var(--muted);width:36px;text-align:right}}
.dg-grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px;margin-bottom:20px}}
.dg-card{{background:var(--bg2);border:1px solid var(--b1);border-radius:8px;padding:13px 15px}}
.dg-card.has{{border-left:3px solid var(--ac)}}.dg-card.no{{border-left:3px solid var(--b2);opacity:.65}}
.dg-name{{font-size:.85em;font-weight:500;margin-bottom:5px}}
.dg-key{{font-family:'Cinzel',serif;font-size:1.7em;font-weight:700;line-height:1}}
.dg-bbg{{height:4px;background:var(--b1);border-radius:2px;margin-top:7px;overflow:hidden}}
.dg-bfill{{height:100%;border-radius:2px}}
.dg-pts{{font-size:.7em;color:var(--muted);margin-top:3px;text-align:right}}
.ucal label{{font-size:.73em;color:var(--muted);display:block;margin-bottom:4px;margin-top:11px}}
.ucal label:first-of-type{{margin-top:0}}
.ucal select{{width:100%;background:var(--bg3);border:1px solid var(--b2);color:var(--text);padding:8px;border-radius:4px;font-size:.83em;font-family:'Exo 2',sans-serif}}
.ucal-btn{{width:100%;margin-top:14px;background:rgba({rgb},.2);border:1px solid rgba({rgb},.5);color:var(--ac);padding:9px;border-radius:5px;cursor:pointer;font-family:'Cinzel',serif;font-size:.82em;letter-spacing:1px}}
.ur{{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--b1);font-size:.82em}}
.ur:last-child{{border-bottom:none}}.ur .lbl{{color:var(--muted)}}
.cg{{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px}}
.cc{{background:var(--bg2);border:1px solid var(--b1);border-radius:6px;padding:12px}}
.crest-input-row{{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--b1)}}
.crest-input-row:last-child{{border-bottom:none}}
.crest-color{{width:12px;height:12px;border-radius:3px;flex-shrink:0}}
.crest-name{{font-size:.85em;font-weight:500;width:140px;flex-shrink:0}}
.crest-num{{width:70px;background:var(--bg3);border:1px solid var(--b2);color:var(--text);font-family:'Cinzel',serif;font-size:1em;text-align:center;padding:5px 8px;border-radius:4px}}
.crest-limit{{font-size:.72em;color:var(--muted);width:80px}}
.crest-pbar{{flex:1;height:8px;background:var(--b2);border-radius:4px;overflow:hidden}}
.crest-pfill{{height:100%;border-radius:4px;transition:width .3s}}
.crest-pct{{font-size:.7em;color:var(--muted);width:38px;text-align:right}}
.timeline{{display:flex;flex-direction:column;gap:0;position:relative}}
.timeline::before{{content:'';position:absolute;left:90px;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,var(--ac),rgba({rgb},.1));pointer-events:none}}
.tl-day{{display:flex;gap:0;position:relative;margin-bottom:0}}
.tl-day-label{{width:90px;font-family:'Cinzel',serif;font-size:.72em;color:var(--muted);text-align:right;padding:12px 14px 12px 0;flex-shrink:0;line-height:1.3}}
.tl-day-label.reset{{color:var(--gold)}}
.tl-dot{{width:14px;height:14px;border-radius:50%;border:2px solid var(--ac);background:var(--bg);flex-shrink:0;margin-top:14px;position:relative;z-index:1}}
.tl-dot.reset-dot{{background:var(--gold);border-color:var(--gold);box-shadow:0 0 8px rgba(248,183,0,.5)}}
.tl-dot.today-dot{{background:var(--ac);border-color:var(--ac);box-shadow:0 0 8px rgba({rgb},.5)}}
.tl-content{{flex:1;padding:8px 0 8px 16px}}
.tl-tasks{{display:flex;flex-direction:column;gap:4px}}
.tl-task{{display:flex;align-items:center;gap:7px;font-size:.8em;padding:4px 8px;border-radius:4px;background:var(--bg2);border:1px solid var(--b1)}}
.tl-task.done{{opacity:.45}}.tl-task.done .tl-task-name{{text-decoration:line-through}}
.tl-task-dot{{width:7px;height:7px;border-radius:50%;flex-shrink:0}}
.tl-task-name{{flex:1}}
.dng-selector{{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px;margin-bottom:18px}}
.dng-btn{{background:var(--bg3);border:1px solid var(--b2);color:var(--muted);font-size:.78em;padding:8px 10px;border-radius:5px;cursor:pointer;text-align:left;transition:all .2s;font-family:'Exo 2',sans-serif}}
.dng-btn:hover{{border-color:var(--ac);color:var(--text)}}
.dng-btn.selected{{border-color:var(--ac);color:var(--gold);background:rgba({rgb},.08)}}
.note-area{{width:100%;background:var(--bg3);border:1px solid var(--b2);color:var(--text);font-family:'Exo 2',sans-serif;font-size:.83em;padding:12px;border-radius:6px;resize:vertical;min-height:160px;line-height:1.6}}
.note-area:focus{{outline:none;border-color:var(--ac)}}
.lp{{display:flex;align-items:center;gap:9px;color:var(--muted);font-size:.83em;padding:18px 0}}
.pd{{width:7px;height:7px;border-radius:50%;background:var(--ac);animation:pulse 1.4s ease-in-out infinite}}
.pd:nth-child(2){{animation-delay:.2s}}.pd:nth-child(3){{animation-delay:.4s}}
@keyframes pulse{{0%,80%,100%{{opacity:.2}}40%{{opacity:1}}}}
.err{{color:#e74c3c;font-size:.83em;padding:12px 0}}
.gt{{width:100%;border-collapse:collapse;font-size:.8em}}.gt thead th{{text-align:left;padding:7px 9px;color:var(--muted);font-size:.72em;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid var(--b2)}}.gt tbody tr{{border-bottom:1px solid var(--b1)}}.gt tbody tr:hover{{background:rgba(255,255,255,.025)}}.gt td{{padding:8px 9px;vertical-align:middle}}.sn{{color:var(--muted);font-size:.72em;margin-top:1px}}.in a{{color:#d8d0ff}}.in a:hover{{color:#fff}}.tb{{display:inline-block;background:rgba({rgb},.2);border:1px solid rgba({rgb},.4);color:var(--ac);font-size:.65em;padding:1px 5px;border-radius:3px;margin-left:3px;vertical-align:middle}}.tbox{{background:rgba({rgb},.08);border:1px solid rgba({rgb},.25);border-radius:6px;padding:13px 15px;margin-bottom:14px}}.tbox h4{{font-size:.8em;color:var(--ac);margin-bottom:7px;font-family:'Cinzel',serif}}.tbox p{{font-size:.78em;color:var(--muted);line-height:1.6;margin-bottom:3px}}
.gear-bis-grid{{display:grid;grid-template-columns:1fr 1fr;gap:20px}}@media(max-width:700px){{.gear-bis-grid{{grid-template-columns:1fr}}}}
.gear-section-title{{font-family:'Cinzel',serif;font-size:.74em;letter-spacing:2px;color:var(--ac);text-transform:uppercase;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid var(--b1);display:flex;align-items:center;gap:8px}}
.dungeon-rank-row{{display:flex;align-items:center;gap:10px;margin-bottom:6px}}
.dungeon-rank-bar{{flex:1;height:8px;background:var(--b2);border-radius:4px;overflow:hidden}}
.dungeon-rank-fill{{height:100%;border-radius:4px;transition:width .3s}}
.dungeon-rank-name{{font-size:.8em;width:140px;flex-shrink:0}}
.dungeon-rank-count{{font-size:.75em;color:var(--muted);width:60px;text-align:right}}
</style>
</head>
<body>

<div class="topnav">
  <a href="index.html">&#9876; Panel Semanal</a>
  <a href="personajes.html">&#128100; Personajes</a>
  <a href="rutas.html">&#128506; Rutas M+</a>
  <a href="kreathor.html">&#128128; Kreathor</a>
</div>

<div class="hero">
  <div class="hero-inner">
    <div class="char-ph" id="portrait">&#128100;</div>
    <div class="hero-info">
      <div class="char-name">{name}</div>
      <div class="char-meta">
        <span class="bspec">{spec} {cls}</span>
        <span class="brole">{re} {rt}</span>
        <span class="brealm">Quel'Thalas &middot; US</span>
      </div>
      <div class="hero-stats" id="heroStats">
        <div class="lp"><span class="pd"></span><span class="pd"></span><span class="pd"></span><span>Conectando con Azeroth...</span></div>
      </div>
      <div class="hero-links" id="heroLinks"></div>
    </div>
  </div>
</div>

<div class="tabs">
  <button class="tab-btn active" onclick="ST('stats')">&#128202; Stats</button>
  <button class="tab-btn" onclick="ST('monedas')">&#128176; Monedas</button>
  <button class="tab-btn" onclick="ST('gear')">&#9876; Gear &amp; BiS</button>
  <button class="tab-btn" onclick="ST('enchants')">&#10024; Encantamientos</button>
  <button class="tab-btn" onclick="ST('builds')">&#9878; Builds</button>
  <button class="tab-btn" onclick="ST('rotation')">&#9881; Rotaci&oacute;n</button>
  <button class="tab-btn" onclick="ST('dungeons')">&#128505; Mazmorras</button>
  <button class="tab-btn" onclick="ST('talents')">&#11088; Talentos</button>
  <button class="tab-btn" onclick="ST('mplus')">&#128202; M+ Runs</button>
  <button class="tab-btn" onclick="ST('raid')">&#127984; Raid</button>
  <button class="tab-btn" onclick="ST('notas')">&#128221; Notas</button>
</div>

<div class="main">

<div class="tab-panel active" id="tab-stats">
  <div class="stitle"><span class="acc">&#128202;</span> Stats en vivo <span style="font-size:.85em">(Raider.io)</span></div>
  <div id="statsContent"><div class="lp"><span class="pd"></span><span class="pd"></span><span class="pd"></span><span>Cargando stats...</span></div></div>
</div>

<div class="tab-panel" id="tab-monedas">
  <div class="stitle"><span class="acc">&#128176;</span> Monedas y Crests &mdash; Semana actual</div>
  <div class="card" id="monedasContent"><div class="lp"><span class="pd"></span><span class="pd"></span><span class="pd"></span><span>Cargando...</span></div></div>
</div>

<div class="tab-panel" id="tab-gear">
  <div class="stitle"><span class="acc">&#9876;</span> Gear BiS &mdash; Midnight S1</div>
{gear_section}
</div>

<div class="tab-panel" id="tab-enchants">
  <div class="stitle"><span class="acc">&#10024;</span> Encantamientos &mdash; {name}</div>
  <div class="card" style="text-align:center;padding:32px">
    <p style="font-size:.9em;color:var(--muted)">Los datos de encantamientos no est&aacute;n disponibles para este personaje.</p>
  </div>
</div>

<div class="tab-panel" id="tab-builds">
  <div class="stitle"><span class="acc">&#9878;</span> Builds &mdash; {spec} {cls}</div>
  <div class="card" style="text-align:center;padding:32px">
    <p style="font-size:.9em;color:var(--muted)">Pr&oacute;ximamente: comparador de builds para {name}.</p>
  </div>
</div>

<div class="tab-panel" id="tab-rotation">
  <div class="stitle"><span class="acc">&#9881;</span> Rotaci&oacute;n &mdash; {spec}</div>
  <div class="card" style="text-align:center;padding:32px">
    <p style="font-size:.9em;color:var(--muted)">Pr&oacute;ximamente: simulador de rotaci&oacute;n para {name}.</p>
  </div>
</div>

<div class="tab-panel" id="tab-dungeons">
  <div class="stitle"><span class="acc">&#10022;</span> Score por Mazmorra <span style="font-size:.85em">(en vivo &middot; Raider.io)</span></div>
  <div id="dgContent"><div class="lp"><span class="pd"></span><span class="pd"></span><span class="pd"></span><span>Cargando...</span></div></div>
</div>

<div class="tab-panel" id="tab-talents">
  <div class="stitle"><span class="acc">&#11088;</span> Talentos &mdash; {spec}</div>
  <div class="card" style="text-align:center;padding:32px">
    <p style="font-size:.9em;color:var(--muted)">Pr&oacute;ximamente: talentos detallados para {name}.</p>
  </div>
</div>

<div class="tab-panel" id="tab-mplus">
  <div class="stitle"><span class="acc">&#128202;</span> Actividad Mythic+ <span style="font-size:.85em">(en vivo &middot; Raider.io)</span></div>
  <div id="mpContent"><div class="lp"><span class="pd"></span><span class="pd"></span><span class="pd"></span><span>Cargando...</span></div></div>
</div>

<div class="tab-panel" id="tab-raid">
  <div class="stitle"><span class="acc">&#127984;</span> Progreso de Raid <span style="font-size:.85em">(en vivo &middot; Raider.io)</span></div>
  <div id="raidContent"><div class="lp"><span class="pd"></span><span class="pd"></span><span class="pd"></span><span>Cargando...</span></div></div>
</div>

<div class="tab-panel" id="tab-notas">
  <div class="stitle"><span class="acc">&#128221;</span> Notas por Mazmorra</div>
  <p style="font-size:.78em;color:var(--muted);margin-bottom:14px">Selecciona una mazmorra y escribe tus notas. Se guardan en el navegador.</p>
  <div class="dng-selector" id="dngSelector"></div>
  <div id="noteEditor" style="display:none">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;flex-wrap:wrap;gap:8px">
      <div style="font-family:'Cinzel',serif;font-size:.9em;color:var(--gold)" id="noteTitle"></div>
      <div style="display:flex;gap:6px;align-items:center">
        <button onclick="clearNote()" style="background:var(--bg3);border:1px solid var(--b2);color:var(--muted);font-size:.72em;padding:4px 10px;border-radius:3px;cursor:pointer">&#128465; Borrar</button>
        <button onclick="saveNote()" style="background:rgba({rgb},.15);border:1px solid rgba({rgb},.4);color:var(--ac);font-size:.72em;padding:4px 12px;border-radius:3px;cursor:pointer;font-family:'Cinzel',serif">GUARDAR</button>
        <span style="font-size:.7em;opacity:0;transition:opacity .3s" id="noteSaved">&#10003; Guardado</span>
      </div>
    </div>
    <textarea class="note-area" id="noteTextarea" placeholder="Escribe tus notas aquí..."></textarea>
  </div>
  <div id="noteEmpty" style="color:var(--muted);font-size:.83em;padding:14px 0">Selecciona una mazmorra para empezar.</div>
</div>

</div>
<script>window.CHAR_PX='{px}';window.CHAR_NAME='{name}';window.CHAR_URL='{url}';window.CHAR_SPEC='{spec}';</script>
<script src="js/character-common.js"></script>
</body>
</html>"""

for char in CHARS:
    html = gen(char)
    fname = char['file'] + '.html'
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"OK: {fname}")
