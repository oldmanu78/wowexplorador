"""
Pipeline de datos para WoW Explorer
Escrito en Python stdlib — sin dependencias externas
Lee datos de Raider.io, Blizzard API y Armory, y escribe a SQLite

Ejecución: python scripts/actualizar_datos.py
Requiere variables de entorno: BLIZZARD_CLIENT_ID, BLIZZARD_CLIENT_SECRET (opcional)
"""

import json
import os
import re
import sqlite3
import urllib.parse
import urllib.request
import urllib.error
import base64
import time
from datetime import datetime, timezone
from pathlib import Path

# ─── Configuración ───────────────────────────────────────────────────

# Ruta a la base de datos SQLite (relativa a este script)
DB_PATH = Path(__file__).parent.parent / "prisma" / "wow.db"

# Personajes trackeados (nombre, realm, región)
CHARACTERS = [
    {"name": "Kreathor",    "realm": "quelthalas", "region": "us", "slug": "kreathor"},
    {"name": "Muchufaza",   "realm": "quelthalas", "region": "us", "slug": "muchufaza"},
    {"name": "Czernobög",   "realm": "quelthalas", "region": "us", "slug": "czernobog"},
    {"name": "Oldkreeper",  "realm": "quelthalas", "region": "us", "slug": "oldkreeper"},
    {"name": "Redguardïan", "realm": "quelthalas", "region": "us", "slug": "redguardian"},
    {"name": "Krëeper",     "realm": "quelthalas", "region": "us", "slug": "kreeper"},
    {"name": "Nösferätü",   "realm": "quelthalas", "region": "us", "slug": "nosferatu"},
]

# Configuración de personajes (clase, spec, rol)
CHARACTER_CONFIG = {
    "Kreathor":    {"class": "Death Knight",   "spec": "Blood",        "role": "TANK"},
    "Muchufaza":   {"class": "Monk",           "spec": "Brewmaster",   "role": "TANK"},
    "Czernobög":   {"class": "Druid",          "spec": "Guardian",     "role": "TANK"},
    "Oldkreeper":  {"class": "Shaman",         "spec": "Elemental",    "role": "DPS"},
    "Redguardïan": {"class": "Paladin",        "spec": "Retribution",  "role": "DPS"},
    "Krëeper":     {"class": "Warrior",        "spec": "Protection",   "role": "TANK"},
    "Nösferätü":   {"class": "Demon Hunter",   "spec": "Vengeance",    "role": "TANK"},
}

# Mazmorras de Midnight S1
DUNGEONS = [
    {"id": "aa",  "slug": "algethar-academy",     "name": "Algeth'ar Academy",     "type": "nueva",   "sigla": "AA",  "jefes": 4, "zona": "Thaldraszus",     "timer": "35 min"},
    {"id": "mc",  "slug": "maisara-caverns",      "name": "Maisara Caverns",       "type": "nueva",   "sigla": "MC",  "jefes": 4, "zona": "Harandar",        "timer": "33 min"},
    {"id": "npx", "slug": "nexus-point-xenas",    "name": "Nexus-Point Xenas",     "type": "nueva",   "sigla": "NPX", "jefes": 4, "zona": "Voidstorm",       "timer": "35 min"},
    {"id": "wrs", "slug": "windrunner-spire",     "name": "Windrunner Spire",      "type": "nueva",   "sigla": "WRS", "jefes": 4, "zona": "Eversong Woods",  "timer": "34 min"},
    {"id": "mt",  "slug": "magisters-terrace",    "name": "Magister's Terrace",    "type": "clasica", "sigla": "MT",  "jefes": 4, "zona": "Quel'Danas",       "timer": "32 min"},
    {"id": "pos", "slug": "pit-of-saron",         "name": "Pit of Saron",          "type": "clasica", "sigla": "POS", "jefes": 3, "zona": "Icecrown",         "timer": "30 min"},
    {"id": "seat","slug": "seat-of-the-triumvirate","name": "Seat of the Triumvirate","type": "clasica","sigla":"SEAT","jefes":4, "zona": "Argus",           "timer": "32 min"},
    {"id": "sky", "slug": "skyreach",             "name": "Skyreach",              "type": "clasica", "sigla": "SKY", "jefes": 4, "zona": "Spires of Arak",  "timer": "28 min"},
]

DUNGEON_DESCRIPTIONS = {
    "algethar-academy": "Una academia de vuelo dracthyr donde los aventureros deben enfrentarse a poderosos dragones y sus alumnos en Thaldraszus.",
    "maisara-caverns": "Profundas cavernas en Harandar, hogar de antiguos secretos y criaturas olvidadas.",
    "nexus-point-xenas": "Un puesto avanzado del Vacío en la Tormenta de Vacío, lleno de aberrantes energías oscuras.",
    "windrunner-spire": "La legendaria torre de la familia Windrunner en los Bosques de Eversong, ahora tomada por fuerzas hostiles.",
    "magisters-terrace": "La terraza de los Magisters en Quel'Danas, custodiada por los seguidores de Kael'thas.",
    "pit-of-saron": "Las mazmorras de la Ciudadela de la Corona de Hielo, donde los prisioneros eran sometidos a experimentos.",
    "seat-of-the-triumvirate": "El lugar de descanso de los tres líderes eredar en Argus, lleno de la energía del Vacío.",
    "skyreach": "Una fortaleza voladora de los Arakkoa en las Espiras de Arak, gobernada por el alto sacerdote.",
}

DUNGEON_IMAGES = {
    "algethar-academy": "/images/algethar.jpg",
    "maisara-caverns": "/images/maisara.jpg",
    "nexus-point-xenas": "/images/nexus.jpg",
    "windrunner-spire": "/images/windrunner.jpg",
    "magisters-terrace": "/images/magisters.jpg",
    "pit-of-saron": "/images/pit.jpg",
    "seat-of-the-triumvirate": "/images/seat.jpg",
    "skyreach": "/images/skyreach.jpg",
}

# Noticias estáticas (se actualizan manualmente)
NOTICIAS = [
    {"title": "Midnight S1 — Nueva temporada de Mythic+ disponible", "link": "https://www.wowhead.com", "date": "17/03/2026", "source": "Wowhead"},
    {"title": "Parche 11.1 — Notas del parche", "link": "https://worldofwarcraft.blizzard.com", "date": "10/03/2026", "source": "Blizzard"},
    {"title": "Guía de clases Midnight — Mejores specs para M+", "link": "https://www.icy-veins.com", "date": "05/03/2026", "source": "Icy-Veins"},
]

# Invasiones estáticas
INVASIONES = [
    {"zone": "Valle de Alterac", "npcs": 3, "reward": "Fragmento de Éter"},
    {"zone": "Tierras Fantasma", "npcs": 3, "reward": "Fragmento de Éter"},
    {"zone": "Tanaris", "npcs": 3, "reward": "Fragmento de Éter"},
]


def fetch_json(url, headers=None, retries=3):
    """
    Fetch JSON de una URL con manejo de errores.
    Retorna el JSON parseado o None si falla.
    """
    request_headers = headers or {"User-Agent": "Mozilla/5.0 (compatible; WoWExplorador/1.0)"}
    for attempt in range(retries):
        req = urllib.request.Request(url, headers=request_headers)
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            retryable = e.code in (429, 500, 502, 503, 504)
            if not retryable or attempt == retries - 1:
                print(f"  [!] Error fetching {url}: {e}")
                return None
        except (urllib.error.URLError, json.JSONDecodeError, TimeoutError) as e:
            if attempt == retries - 1:
                print(f"  [!] Error fetching {url}: {e}")
                return None
        time.sleep(2 ** attempt)
    return None


def get_blizzard_token(client_id, client_secret):
    """
    Obtiene un token de acceso OAuth2 de Blizzard.
    Requiere BLIZZARD_CLIENT_ID y BLIZZARD_CLIENT_SECRET.
    Retorna el token string o None si falla.
    """
    if not client_id or not client_secret:
        print("  [!] BLIZZARD_CLIENT_ID/SECRET no configurados")
        return None

    auth = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    data = b"grant_type=client_credentials"
    req = urllib.request.Request(
        "https://oauth.battle.net/token",
        data=data,
        headers={
            "Authorization": f"Basic {auth}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            token_data = json.loads(resp.read().decode("utf-8"))
            return token_data.get("access_token")
    except Exception as e:
        print(f"  [!] Error getting Blizzard token: {e}")
        return None


def obtener_perfil_raiderio(name, realm, region):
    """
    Obtiene el perfil completo de Raider.io para un personaje.
    Incluye: scores, gear, raid progression, runs recientes y mejores.
    URL-encodea el nombre del personaje para manejar caracteres especiales.
    """
    fields = "mythic_plus_scores_by_season:current,gear,raid_progression,mythic_plus_recent_runs,mythic_plus_best_runs:current"
    encoded_name = urllib.parse.quote(name, safe="")
    url = f"https://raider.io/api/v1/characters/profile?region={region}&realm={realm}&name={encoded_name}&fields={fields}"
    data = fetch_json(url)
    if data:
        print(f"  [+] {name}: score={data.get('mythic_plus_scores_by_season', [{}])[0].get('scores', {}).get('all', '?')}")
    else:
        print(f"  [-] {name}: sin datos")
    return data


def obtener_afijos_raiderio():
    """
    Obtiene los afijos semanales de Raider.io.
    """
    url = "https://raider.io/api/v1/mythic-plus/affixes?region=us&locale=es"
    data = fetch_json(url)
    if data:
        affixes = data.get("affix_details", [])
        return " - ".join(a.get("name", "?") for a in affixes)
    return ""


def obtener_token_price(token):
    """
    Obtiene el precio del Token de WoW desde la API oficial de Blizzard.
    Requiere un token de acceso OAuth2 válido.
    """
    url = "https://us.api.blizzard.com/data/wow/token/index?namespace=dynamic-us&locale=es_MX"
    data = fetch_json(url, headers={"Authorization": f"Bearer {token}"})
    if data and "price" in data:
        gold = data["price"] // 10000
        return f"{gold:,}".replace(",", ".")
    return "Buscando..."


def obtener_stats_armory(name, realm="quelthalas", region="us"):
    """
    Scrapea stats detallados desde Armory Blizzard.
    Extrae el JSON de characterProfileInitialState del HTML.
    Retorna stats parseados o None si falla (fallback graceful).
    """
    encoded_name = urllib.parse.quote(name, safe="")
    url = f"https://worldofwarcraft.blizzard.com/en-us/character/{region}/{realm}/{encoded_name}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            html = resp.read().decode("utf-8", errors="replace")
    except Exception as e:
        print(f"  [!] Error fetching Armory for {name}: {e}")
        return None

    # Extrae el JSON de estado inicial del personaje
    match = re.search(r"characterProfileInitialState\s*=\s*({.+?});", html, re.DOTALL)
    if not match:
        print(f"  [!] No characterProfileInitialState found for {name}")
        return None

    try:
        data = json.loads(match.group(1))
    except json.JSONDecodeError as e:
        print(f"  [!] Error parsing Armory JSON for {name}: {e}")
        return None

    try:
        # La estructura puede variar: busca character en diferentes niveles
        char = data.get("character", data)
        if not isinstance(char, dict):
            char = data

        stats_data = char.get("stats", {})
        if not isinstance(stats_data, dict):
            stats_data = {}

        # Mapa de stats slugs a nombres normalizados
        SLUG_MAP = {
            "strength": "strength", "agility": "agility", "intellect": "intellect",
            "stamina": "stamina", "crit": "crit", "criticalstrike": "crit",
            "haste": "haste", "mastery": "mastery", "versatility": "versatility",
            "leech": "leech", "speed": "speed", "avoidance": "avoidance",
        }

        result = {}

        # Stats desde overview (health, etc.) — puede ser dict o list
        overview = stats_data.get("overview", {})
        if isinstance(overview, dict) and overview.get("health"):
            result["health"] = overview["health"]

        # Stats desde groups (stats secundarias)
        groups = stats_data.get("groups", [])
        if isinstance(groups, list):
            for group in groups:
                if not isinstance(group, dict):
                    continue
                for stat in group.get("stats", []):
                    if not isinstance(stat, dict):
                        continue
                    slug = stat.get("slug", "").lower()
                    normalized = SLUG_MAP.get(slug)
                    if normalized:
                        result[normalized] = stat.get("value", 0)

        # Item level desde gear
        gear_data = char.get("gear", {})
        if isinstance(gear_data, dict):
            ilvl = gear_data.get("itemLevelEquipped")
            if ilvl and isinstance(ilvl, (int, float)):
                result["ilvl"] = int(ilvl)
            else:
                # Calcula ilvl promedio desde los slots de gear
                slots = ["head", "neck", "shoulder", "back", "chest", "wrist",
                         "hand", "waist", "leg", "feet", "finger1", "finger2",
                         "trinket1", "trinket2", "weapon"]
                total_ilvl = 0
                count = 0
                for slot in slots:
                    item = gear_data.get(slot, {})
                    if isinstance(item, dict):
                        # item.get("level") puede ser dict (como {value: N}) o número directo
                        lvl = item.get("level", 0)
                        if isinstance(lvl, dict):
                            lvl = lvl.get("value", 0) or next(iter(lvl.values()), 0)
                        try:
                            lvl = int(lvl)
                            if lvl > 0:
                                total_ilvl += lvl
                                count += 1
                        except (ValueError, TypeError):
                            pass
                if count > 0:
                    result["ilvl"] = total_ilvl // count

        print(f"  [+] {name}: stats obtenidas (ilvl={result.get('ilvl', '?')})")
        return result

    except Exception as e:
        print(f"  [!] Error parsing Armory data for {name}: {e}")
        return None


def obtener_jefe_mundo():
    """
    Calcula el jefe del mundo por rotación semanal.
    Temporada comenzó 17 de marzo 2026. Rotación de 4 jefes.
    """
    JEFES = [
        "Lu'ashal (Eversong Woods)",
        "Cragpine (Hillsbrad Foothills)",
        "Thorm'belan (Tanaris)",
        "Predaxas (Badlands)",
    ]
    START = datetime(2026, 3, 17, 15, 0, tzinfo=timezone.utc)
    weeks_since = max(0, (datetime.now(timezone.utc) - START).days // 7)
    return JEFES[weeks_since % 4]


def obtener_evento_semana():
    """
    Calcula el evento semanal por rotación.
    Ciclo de 7 semanas: 4 Timewalking + 3 Bonus.
    """
    EVENTOS = [
        "Timewalking: Wrath of the Lich King",
        "Timewalking: Cataclysm",
        "Timewalking: Mists of Pandaria",
        "Timewalking: The Burning Crusade",
        "Bonus: Battlegrounds",
        "Bonus: Arena Skirmish",
        "Bonus: World Quests",
    ]
    START = datetime(2026, 3, 17, 15, 0, tzinfo=timezone.utc)
    weeks_since = max(0, (datetime.now(timezone.utc) - START).days // 7)
    return EVENTOS[weeks_since % 7]


def obtener_rutas_midnight():
    """
    Rutas hardcodeadas de Keystone.guru para Midnight S1.
    4 rutas por mazmorra (2 pug, 2 high).
    """
    return {
        "algethar-academy": [
            {"name": "Ruta Segura AA", "url": "https://keystone.guru/route/aa-pug-1", "type": "pug", "desc": "Ruta segura para grupos públicos", "thumb": None},
            {"name": "Ruta Óptima AA", "url": "https://keystone.guru/route/aa-high-1", "type": "high", "desc": "Ruta optimizada para high keys", "thumb": None},
        ],
        "maisara-caverns": [
            {"name": "Ruta Segura MC", "url": "https://keystone.guru/route/mc-pug-1", "type": "pug", "desc": "Ruta segura para grupos públicos", "thumb": None},
            {"name": "Ruta Óptima MC", "url": "https://keystone.guru/route/mc-high-1", "type": "high", "desc": "Ruta optimizada para high keys", "thumb": None},
        ],
        "nexus-point-xenas": [
            {"name": "Ruta Segura NPX", "url": "https://keystone.guru/route/npx-pug-1", "type": "pug", "desc": "Ruta segura para grupos públicos", "thumb": None},
            {"name": "Ruta Óptima NPX", "url": "https://keystone.guru/route/npx-high-1", "type": "high", "desc": "Ruta optimizada para high keys", "thumb": None},
        ],
        "windrunner-spire": [
            {"name": "Ruta Segura WRS", "url": "https://keystone.guru/route/wrs-pug-1", "type": "pug", "desc": "Ruta segura para grupos públicos", "thumb": None},
            {"name": "Ruta Óptima WRS", "url": "https://keystone.guru/route/wrs-high-1", "type": "high", "desc": "Ruta optimizada para high keys", "thumb": None},
        ],
        "magisters-terrace": [
            {"name": "Ruta Segura MT", "url": "https://keystone.guru/route/mt-pug-1", "type": "pug", "desc": "Ruta segura para grupos públicos", "thumb": None},
            {"name": "Ruta Óptima MT", "url": "https://keystone.guru/route/mt-high-1", "type": "high", "desc": "Ruta optimizada para high keys", "thumb": None},
        ],
        "pit-of-saron": [
            {"name": "Ruta Segura POS", "url": "https://keystone.guru/route/pos-pug-1", "type": "pug", "desc": "Ruta segura para grupos públicos", "thumb": None},
            {"name": "Ruta Óptima POS", "url": "https://keystone.guru/route/pos-high-1", "type": "high", "desc": "Ruta optimizada para high keys", "thumb": None},
        ],
        "seat-of-the-triumvirate": [
            {"name": "Ruta Segura SEAT", "url": "https://keystone.guru/route/seat-pug-1", "type": "pug", "desc": "Ruta segura para grupos públicos", "thumb": None},
            {"name": "Ruta Óptima SEAT", "url": "https://keystone.guru/route/seat-high-1", "type": "high", "desc": "Ruta optimizada para high keys", "thumb": None},
        ],
        "skyreach": [
            {"name": "Ruta Segura SKY", "url": "https://keystone.guru/route/sky-pug-1", "type": "pug", "desc": "Ruta segura para grupos públicos", "thumb": None},
            {"name": "Ruta Óptima SKY", "url": "https://keystone.guru/route/sky-high-1", "type": "high", "desc": "Ruta optimizada para high keys", "thumb": None},
        ],
    }


def init_db(conn):
    """
    Inicializa la base de datos SQLite con el schema.
    Crea las tablas si no existen.
    """
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS User (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            createdAt TEXT DEFAULT (datetime('now'))
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Character (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            realm TEXT DEFAULT 'Quel''Thalas',
            region TEXT DEFAULT 'us',
            class TEXT NOT NULL,
            spec TEXT NOT NULL,
            role TEXT NOT NULL,
            userId TEXT,
            rioData TEXT,
            armory TEXT,
            isActive INTEGER DEFAULT 1,
            createdAt TEXT DEFAULT (datetime('now')),
            updatedAt TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (userId) REFERENCES User(id)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS WeeklySnapshot (
            id TEXT PRIMARY KEY,
            weekStart TEXT NOT NULL,
            affixes TEXT NOT NULL,
            event TEXT NOT NULL,
            tokenPrice TEXT,
            worldBoss TEXT NOT NULL,
            createdAt TEXT DEFAULT (datetime('now'))
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Dungeon (
            id TEXT PRIMARY KEY,
            slug TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            sigla TEXT NOT NULL,
            jefes INTEGER NOT NULL,
            zona TEXT NOT NULL,
            timer TEXT NOT NULL,
            desc TEXT DEFAULT '',
            img TEXT DEFAULT ''
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Route (
            id TEXT PRIMARY KEY,
            dungeonId TEXT NOT NULL,
            name TEXT NOT NULL,
            url TEXT NOT NULL,
            type TEXT NOT NULL,
            desc TEXT DEFAULT '',
            thumb TEXT,
            FOREIGN KEY (dungeonId) REFERENCES Dungeon(id)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS News (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            link TEXT NOT NULL,
            date TEXT NOT NULL,
            source TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Invasion (
            id TEXT PRIMARY KEY,
            zone TEXT NOT NULL,
            npcs INTEGER NOT NULL,
            reward TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS MythicRun (
            id TEXT PRIMARY KEY,
            characterId TEXT NOT NULL,
            dungeonSlug TEXT NOT NULL,
            score REAL NOT NULL DEFAULT 0,
            level INTEGER NOT NULL DEFAULT 0,
            completedAt TEXT NOT NULL,
            isBest INTEGER DEFAULT 0,
            weekStart TEXT,
            FOREIGN KEY (characterId) REFERENCES Character(id)
        )
    """)

    conn.commit()


def save_character(conn, character, rio_data, armory_data, user_id):
    """
    Guarda o actualiza un personaje en la base de datos.
    """
    cursor = conn.cursor()
    config = CHARACTER_CONFIG[character["name"]]

    cursor.execute("""
        INSERT OR REPLACE INTO Character (id, name, slug, realm, region, class, spec, role, userId, rioData, armory, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    """, (
        character["slug"],
        character["name"],
        character["slug"],
        character["realm"].capitalize(),
        character["region"],
        config["class"],
        config["spec"],
        config["role"],
        user_id,
        json.dumps(rio_data) if rio_data else None,
        json.dumps(armory_data) if armory_data else None,
    ))


def save_weekly_snapshot(conn, affixes, event, token_price, world_boss):
    """
    Guarda el snapshot semanal con afijos, evento, token y world boss.
    """
    cursor = conn.cursor()
    week_start = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    # Limpia snapshots anteriores (solo guardamos el último)
    cursor.execute("DELETE FROM WeeklySnapshot")

    cursor.execute("""
        INSERT INTO WeeklySnapshot (id, weekStart, affixes, event, tokenPrice, worldBoss)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        f"week-{week_start}",
        week_start,
        affixes,
        event,
        token_price,
        world_boss,
    ))


def save_dungeons_and_routes(conn, routes_data):
    """
    Guarda las mazmorras y sus rutas en la base de datos.
    """
    cursor = conn.cursor()

    # Limpia datos anteriores
    cursor.execute("DELETE FROM Route")
    cursor.execute("DELETE FROM Dungeon")

    for d in DUNGEONS:
        cursor.execute("""
            INSERT INTO Dungeon (id, slug, name, type, sigla, jefes, zona, timer, desc, img)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            d["id"],
            d["slug"],
            d["name"],
            d["type"],
            d["sigla"],
            d["jefes"],
            d["zona"],
            d["timer"],
            DUNGEON_DESCRIPTIONS.get(d["slug"], ""),
            DUNGEON_IMAGES.get(d["slug"], ""),
        ))

        # Guarda rutas para esta mazmorra
        dungeon_routes = routes_data.get(d["slug"], [])
        for i, route in enumerate(dungeon_routes):
            cursor.execute("""
                INSERT INTO Route (id, dungeonId, name, url, type, desc, thumb)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                f"{d['id']}-route-{i}",
                d["id"],
                route["name"],
                route["url"],
                route["type"],
                route["desc"],
                route.get("thumb"),
            ))


def extract_dungeon_slug(dungeon_field):
    """
    Extrae el slug de la mazmorra desde el campo 'dungeon' de Raider.io.
    Puede ser un string (slug directo) o un dict con campo 'slug'.
    """
    if isinstance(dungeon_field, dict):
        return dungeon_field.get("slug", "")
    return str(dungeon_field) if dungeon_field else ""


def save_mythic_runs(conn, character_slug, rio_data):
    """
    Guarda las carreras M+ (best runs y recent runs) desde Raider.io.
    """
    if not rio_data:
        return

    cursor = conn.cursor()
    week_start = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    # Limpia carreras anteriores de este personaje
    cursor.execute("DELETE FROM MythicRun WHERE characterId = ?", (character_slug,))

    # Best runs
    best_runs = rio_data.get("mythic_plus_best_runs", [])
    for i, run in enumerate(best_runs):
        dungeon_slug = extract_dungeon_slug(run.get("dungeon", ""))
        cursor.execute("""
            INSERT INTO MythicRun (id, characterId, dungeonSlug, score, level, completedAt, isBest, weekStart)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            f"{character_slug}-best-{i}",
            character_slug,
            dungeon_slug,
            run.get("mythic_rating", 0),
            run.get("mythic_level", 0),
            run.get("completed_at", datetime.now(timezone.utc).isoformat()),
            1,
            week_start,
        ))

    # Recent runs
    recent_runs = rio_data.get("mythic_plus_recent_runs", [])
    for i, run in enumerate(recent_runs):
        dungeon_slug = extract_dungeon_slug(run.get("dungeon", ""))
        cursor.execute("""
            INSERT INTO MythicRun (id, characterId, dungeonSlug, score, level, completedAt, isBest, weekStart)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            f"{character_slug}-recent-{i}",
            character_slug,
            dungeon_slug,
            run.get("mythic_rating", 0),
            run.get("mythic_level", 0),
            run.get("completed_at", datetime.now(timezone.utc).isoformat()),
            0,
            week_start,
        ))


def save_news(conn):
    """
    Guarda las noticias estáticas en la base de datos.
    """
    cursor = conn.cursor()
    cursor.execute("DELETE FROM News")
    for i, noticia in enumerate(NOTICIAS):
        cursor.execute("""
            INSERT INTO News (id, title, link, date, source)
            VALUES (?, ?, ?, ?, ?)
        """, (
            f"news-{i}",
            noticia["title"],
            noticia["link"],
            noticia["date"],
            noticia["source"],
        ))


def save_invasions(conn):
    """
    Guarda las invasiones estáticas en la base de datos.
    """
    cursor = conn.cursor()
    cursor.execute("DELETE FROM Invasion")
    for i, invasion in enumerate(INVASIONES):
        cursor.execute("""
            INSERT INTO Invasion (id, zone, npcs, reward)
            VALUES (?, ?, ?, ?)
        """, (
            f"inv-{i}",
            invasion["zone"],
            invasion["npcs"],
            invasion["reward"],
        ))


def main():
    """Función principal del pipeline de datos."""
    print("=" * 50)
    print("WoW Explorer — Pipeline de Datos")
    print(f"Inicio: {datetime.now(timezone.utc).isoformat()}")
    print("=" * 50)

    # Se escribe en una base temporal y se reemplaza al final para evitar
    # dejar prisma/wow.db en estado parcial si el proceso se interrumpe.
    tmp_db_path = DB_PATH.with_suffix(".tmp.db")
    if tmp_db_path.exists():
        tmp_db_path.unlink()

    conn = sqlite3.connect(str(tmp_db_path))
    conn_closed = False

    try:
        init_db(conn)

        # Obtiene credenciales de Blizzard desde variables de entorno
        client_id = os.environ.get("BLIZZARD_CLIENT_ID")
        client_secret = os.environ.get("BLIZZARD_CLIENT_SECRET")

        # 1. Obtiene afijos semanales
        print("\n[AFIJOS] Afijos semanales...")
        affixes = obtener_afijos_raiderio()
        print(f"  -> {affixes}")

        # 2. Obtiene token de Blizzard
        print("\n[TOKEN] Token Blizzard...")
        token = get_blizzard_token(client_id, client_secret)

        # 3. Obtiene precio del token
        print("\n[TOKEN] Precio del Token...")
        token_price = obtener_token_price(token) if token else "Buscando..."
        print(f"  -> {token_price}")

        # 4. Calcula evento y jefe del mundo
        event = obtener_evento_semana()
        world_boss = obtener_jefe_mundo()
        print(f"\n[EVENTO] Evento: {event}")
        print(f"[BOSS] Jefe del mundo: {world_boss}")

        # 5. Guarda snapshot semanal
        save_weekly_snapshot(conn, affixes, event, token_price, world_boss)

        # 6. Guarda usuario por defecto
        cursor = conn.cursor()
        cursor.execute("INSERT OR IGNORE INTO User (id, username, slug) VALUES (?, ?, ?)",
                       ("default", "oldmanu78", "oldmanu78"))

        # 7. Obtiene perfiles de Raider.io y stats de Armory para cada personaje
        print("\n[CHARS] Personajes...")
        for char in CHARACTERS:
            print(f"\n  {char['name']}:")
            rio = obtener_perfil_raiderio(char["name"], char["realm"], char["region"])
            armory = obtener_stats_armory(char["name"], char["realm"], char["region"])
            save_character(conn, char, rio, armory, "default")

            # Guarda carreras M+
            if rio:
                save_mythic_runs(conn, char["slug"], rio)

        # 8. Guarda mazmorras y rutas
        print("\n[DUNGEONS] Mazmorras y rutas...")
        rutas = obtener_rutas_midnight()
        save_dungeons_and_routes(conn, rutas)

        # 9. Guarda noticias e invasiones
        print("\n[NEWS] Noticias e invasiones...")
        save_news(conn)
        save_invasions(conn)

        # Commit final, cierre y reemplazo atómico de la base publicada
        conn.commit()
        conn.close()
        conn_closed = True
        tmp_db_path.replace(DB_PATH)
    except Exception:
        if not conn_closed:
            conn.rollback()
            conn.close()
        if tmp_db_path.exists():
            tmp_db_path.unlink()
        raise

    print("\n" + "=" * 50)
    print(f"[OK] Pipeline completado — {datetime.now(timezone.utc).isoformat()}")
    print(f"[DB] Base de datos: {DB_PATH}")
    print("=" * 50)


if __name__ == "__main__":
    main()
