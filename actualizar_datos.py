import os
import urllib.request
import urllib.parse
import json
import base64
from datetime import datetime, timezone, timedelta

# ── Personajes a trackear ───────────────────────────────
PERSONAJES = [
    {"nombre": "Kreathor",    "urlNombre": "Kreathor",           "pagina": "kreathor.html" },
    {"nombre": "Muchufaza",   "urlNombre": "Muchufaza",          "pagina": "muchufaza.html" },
    {"nombre": "Czernobög",   "urlNombre": "Czernob%C3%B6g",     "pagina": "czernobog.html" },
    {"nombre": "Oldkreeper",  "urlNombre": "Oldkreeper",         "pagina": "oldkreeper.html" },
    {"nombre": "Redguardïan", "urlNombre": "Redguard%C3%AFan",   "pagina": "redguardian.html" },
    {"nombre": "Krëeper",     "urlNombre": "Kr%C3%ABeper",       "pagina": "kreeper.html" },
    {"nombre": "Nösferätü",   "urlNombre": "N%C3%B6sfer%C3%A4t%C3%BC", "pagina": "nosferatu.html" },
]

# ── Obtener scores M+ reales desde Raider.io ────────────
def obtener_scores_mas_reales():
    """Obtiene scores M+ reales desde Raider.io API para los personajes trackeados"""
    rankings = {"tank": [], "dps": [], "healer": []}
    
    for p in PERSONAJES:
        try:
            url = f"https://raider.io/api/v1/characters/profile?region=us&realm=quelthalas&name={p['urlNombre']}&fields=mythic_plus_scores_by_season:current"
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=8) as response:
                datos = json.loads(response.read().decode())
                
                # Extraer score M+ actual
                scores = datos.get('mythic_plus_scores_by_season', [])
                score_actual = 0
                if scores and len(scores) > 0:
                    score_data = scores[0].get('scores', {})
                    score_actual = score_data.get('all', 0)  # Score global
                
                # Determinar clase y spec
                clase = datos.get('class', '')
                spec = datos.get('active_spec_name', '')
                
                # Clasificar por rol basado en spec
                rol = "dps"  # Por defecto
                if spec in ['Blood', 'Brewmaster', 'Guardian', 'Protection', 'Vengeance']:
                    rol = "tank"
                elif spec in ['Discipline', 'Holy', 'Mistweaver', 'Preservation', 'Restoration']:
                    rol = "healer"
                
                rankings[rol].append({
                    "nombre": p['nombre'],
                    "clase": clase,
                    "score": int(score_actual)
                })
        except Exception as e:
            print(f"Error obteniendo score de {p['nombre']}: {e}")
            # En caso de error, asignar score 0 para que aún aparezca en el ranking
            rankings["dps"].append({
                "nombre": p['nombre'], 
                "clase": "Desconocido", 
                "score": 0
            })
    
    # Ordenar cada rol por score descendente y tomar top 5
    for rol in rankings:
        rankings[rol].sort(key=lambda x: x['score'], reverse=True)
        rankings[rol] = rankings[rol][:5]
    
    return rankings

# ── Noticias estáticas (se actualizan manualmente o via cron) ───
NOTICIAS_DEFAULT = [
    {"titulo": "Temporada Midnight ya esta activa - Nueva temporada de M+", "link": "https://worldofwarcraft.blizzard.com/es-es/news", "fecha": "02/05/2026", "fuente": "Blizzard"},
    {"titulo": "Guia de Mazmorras Midnight: Todas las rutas recomendadas", "link": "https://www.icy-veins.com/wow/mythic-plus-guides", "fecha": "01/05/2026", "fuente": "Icy Veins"},
    {"titulo": "Tier Set Bonuses - Cual es el mejor para tu clase", "link": "https://www.icy-veins.com/wow/tier-sets", "fecha": "30/04/2026", "fuente": "Icy Veins"},
]

# ── Invasiones del Vacío (rotación manual — no hay API pública) ───────────────
INVASIONES_DEFAULT = [
    {"zona": "Eversong Woods", "npcs": 6, "recompensa": "Arena Champion's Yoke"},
    {"zona": "Ghostlands",     "npcs": 5, "recompensa": "Voidclaw"},
    {"zona": "Azuremyst Isle", "npcs": 4, "recompensa": "Reclaimed Tank"},
    {"zona": "Bloodmyst Isle", "npcs": 5, "recompensa": "Felsaber"},
]

DUNGEONS_METADATA = {
    "algethar-academy": {
        "nombre": "Algeth'ar Academy",
        "tipo": "nueva",
        "sigla": "AA",
        "jefes": 4,
        "timer": "35 min",
        "zona": "Thaldraszus",
        "img": "https://assets.keystone.guru/images/dungeons/midnight/algeth_ar_academy_midnight.jpg",
        "desc": "Academia dracónica ahora infestada de energía arcana corrupta. Flexible en orden de jefes — Doragosa se desbloquea al matar a los otros tres.",
        "guia_method": "https://www.method.gg/guides/dungeons/midnight/algethar-academy",
        "guia_icy": "https://www.icy-veins.com/wow/algethar-academy-dungeon-guide"
    },
    "maisara-caverns": {
        "nombre": "Maisara Caverns",
        "tipo": "nueva",
        "sigla": "MC",
        "jefes": 4,
        "timer": "33 min",
        "zona": "Harandar",
        "img": "https://assets.keystone.guru/images/dungeons/midnight/maisara_caverns.jpg",
        "desc": "Cavernas misteriosas bajo los pantanos de Harandar. Coordina los pulls en el agua — los mobs acuáticos son los más mortales para PUGs.",
        "guia_method": "https://www.method.gg/guides/dungeons/midnight/maisara-caverns",
        "guia_icy": "https://www.icy-veins.com/wow/maisara-caverns-dungeon-guide"
    },
    "nexuspoint-xenas": {
        "nombre": "Nexus-Point Xenas",
        "tipo": "nueva",
        "sigla": "NPX",
        "jefes": 4,
        "timer": "35 min",
        "zona": "Voidstorm",
        "img": "https://assets.keystone.guru/images/dungeons/midnight/nexus_point_xenas.jpg",
        "desc": "Instalación del Vacío en el Voidstorm. Los portales de vacío pueden devolver mobs al combate — posicionamiento crítico en cada pull.",
        "guia_method": "https://www.method.gg/guides/dungeons/midnight/nexus-point-xenas",
        "guia_icy": "https://www.icy-veins.com/wow/nexus-point-xenas-dungeon-guide"
    },
    "windrunner-spire": {
        "nombre": "Windrunner Spire",
        "tipo": "nueva",
        "sigla": "WRS",
        "jefes": 4,
        "timer": "34 min",
        "zona": "Eversong Woods",
        "img": "https://assets.keystone.guru/images/dungeons/midnight/windrunner_spire.jpg",
        "desc": "La icónica torre de los Windrunner, ahora dominada por el Vacío. Historia de los Blood Elves entretejida en mecánicas únicas por piso.",
        "guia_method": "https://www.method.gg/guides/dungeons/midnight/windrunner-spire",
        "guia_icy": "https://www.icy-veins.com/wow/windrunner-spire-dungeon-guide"
    },
    "magisters-terrace": {
        "nombre": "Magisters' Terrace",
        "tipo": "clasica",
        "sigla": "MT",
        "jefes": 4,
        "timer": "32 min",
        "zona": "Quel'Danas",
        "img": "https://assets.keystone.guru/images/dungeons/midnight/magisters_terrace_midnight.jpg",
        "desc": "Terraza renovada de Quel'Danas. Kael'thas al final. Gestión de interrupciones en trash es crítica — muchos casters problemáticos.",
        "guia_method": "https://www.method.gg/guides/dungeons/midnight/magisters-terrace",
        "guia_icy": "https://www.icy-veins.com/wow/magisters-terrace-dungeon-guide"
    },
    "pit-of-saron": {
        "nombre": "Pit of Saron",
        "tipo": "clasica",
        "sigla": "POS",
        "jefes": 3,
        "timer": "30 min",
        "zona": "Icecrown",
        "img": "https://assets.keystone.guru/images/dungeons/wotlk/pitofsaron.jpg",
        "desc": "Minas de la Ciudadela de la Corona de Hielo. El gauntlet del corredor es el momento decisivo — libera prisioneros sin sobrepullar.",
        "guia_method": "https://www.method.gg/guides/dungeons/midnight/pit-of-saron",
        "guia_icy": "https://www.icy-veins.com/wow/pit-of-saron-dungeon-guide"
    },
    "seat-of-the-triumvirate": {
        "nombre": "Seat of the Triumvirate",
        "tipo": "clasica",
        "sigla": "SEAT",
        "jefes": 4,
        "timer": "32 min",
        "zona": "Argus",
        "img": "https://assets.keystone.guru/images/dungeons/legion/theseatofthetriumvirate.jpg",
        "desc": "El trono Eredar en Argus. L'ura al final con mecánicas de Void Step — controla los portales o el grupo se desintegra.",
        "guia_method": "https://www.method.gg/guides/dungeons/midnight/seat-of-the-triumvirate",
        "guia_icy": "https://www.icy-veins.com/wow/seat-of-the-triumvirate-dungeon-guide"
    },
    "skyreach": {
        "nombre": "Skyreach",
        "tipo": "clasica",
        "sigla": "SKY",
        "jefes": 4,
        "timer": "28 min",
        "zona": "Spires of Arak",
        "img": "https://assets.keystone.guru/images/dungeons/wod/skyreach.jpg",
        "desc": "Timer más ajustado de la rotación (28 min). Rook the Wind Reaver al final. Cada segundo cuenta — los frontales de viento pueden wipe-ar.",
        "guia_method": "https://www.method.gg/guides/dungeons/midnight/skyreach",
        "guia_icy": "https://www.icy-veins.com/wow/skyreach-dungeon-guide"
    }
}

def obtener_token_blizzard(client_id, client_secret):

    url = "https://oauth.battle.net/token"
    datos = urllib.parse.urlencode({'grant_type': 'client_credentials'}).encode('utf-8')
    credenciales = f"{client_id}:{client_secret}"
    credenciales_b64 = base64.b64encode(credenciales.encode('utf-8')).decode('utf-8')
    req = urllib.request.Request(url, data=datos, headers={'Authorization': f'Basic {credenciales_b64}'})
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())['access_token']
    except Exception as e:
        print(f"Error al obtener pase de Blizzard: {e}")
        return None

def obtener_jefe_de_mundo():
    """
    Calcula el jefe de mundo activo esta semana.
    Temporada 1 de Midnight comenzó el 17 de marzo de 2026 (martes, reset NA).
    La rotación es fija de 4 jefes en este orden según Icy-Veins:
    Semana 1: Lu'ashal | Semana 2: Cragpine | Semana 3: Thorm'belan | Semana 4: Predaxas
    El reset semanal de NA ocurre los martes a las 15:00 UTC.
    """
    jefes = [
        "Lu'ashal (Eversong Woods)",
        "Cragpine (Zul'Aman)",
        "Thorm'belan (Harandar)",
        "Predaxas (Voidstorm)"
    ]
    # Inicio de la temporada: martes 17 de marzo 2026, 15:00 UTC
    inicio_temporada = datetime(2026, 3, 17, 15, 0, 0, tzinfo=timezone.utc)
    ahora = datetime.now(timezone.utc)
    semanas_pasadas = int((ahora - inicio_temporada).total_seconds() // (7 * 24 * 3600))
    jefe_actual = jefes[semanas_pasadas % len(jefes)]
    print(f"Semanas desde inicio: {semanas_pasadas} -> Jefe: {jefe_actual}")
    return jefe_actual

def obtener_evento_semana():
    """
    Calcula el evento semanal por rotación conocida de Midnight S1.
    Raider.io /affixes no incluye el evento semanal (solo retorna afijos M+),
    así que se usa únicamente la rotación calculada por fecha.
    """
    eventos = [
        "Timewalking: The Burning Crusade",
        "Timewalking: Wrath of the Lich King",
        "Bonus: Misión Heróica",
        "Timewalking: Cataclysm",
        "Bonus: Calabozo",
        "Timewalking: Mists of Pandaria",
        "Bonus: Batalla de Azeroth",
    ]
    inicio_temporada = datetime(2026, 3, 17, 15, 0, 0, tzinfo=timezone.utc)
    ahora = datetime.now(timezone.utc)
    semanas_pasadas = int((ahora - inicio_temporada).total_seconds() // (7 * 24 * 3600))
    return eventos[semanas_pasadas % len(eventos)]

def obtener_stats_blizzard(token, nombre_url):
    """Obtiene stats básicos y equipo desde Blizzard API"""
    try:
        url_equip = f"https://us.api.blizzard.com/profile/wow/character/quelthalas/{nombre_url}/equipment?namespace=profile-us&locale=en_US"
        req = urllib.request.Request(url_equip, headers={'Authorization': f'Bearer {token}'})
        with urllib.request.urlopen(req, timeout=8) as r:
            equip = json.loads(r.read().decode())

        url_stats = f"https://us.api.blizzard.com/profile/wow/character/quelthalas/{nombre_url}/statistics?namespace=profile-us&locale=en_US"
        req2 = urllib.request.Request(url_stats, headers={'Authorization': f'Bearer {token}'})
        with urllib.request.urlopen(req2, timeout=8) as r:
            stats = json.loads(r.read().decode())

        result = {
            "ilvl": equip.get("equipped_item_level", 0),
            "items": {}
        }
        for item in equip.get("equipped_items", []):
            slot = item.get("slot", {}).get("type", "").lower()
            result["items"][slot] = {
                "id": item.get("item", {}).get("id", 0),
                "name": item.get("name", ""),
                "ilvl": item.get("level", 0),
                "icon": item.get("media", {}).get("id", ""),
                "quality": item.get("quality", {}).get("type", "")
            }

        # Extraer stats secundarios
        sub_stats = stats.get("sub_stats", [])
        result["stats"] = {}
        for s in sub_stats:
            name = s.get("stat", {}).get("name", "").lower().replace(" ", "_")
            result["stats"][name] = s.get("amount", 0)

        return result
    except Exception as e:
        print(f"Error stats Blizzard para {nombre_url}: {e}")
        return None

def obtener_monedas_blizzard(token, nombre_url):
    """Obtiene monedas actuales desde Blizzard API"""
    try:
        url = f"https://us.api.blizzard.com/profile/wow/character/quelthalas/{nombre_url}?namespace=profile-us&locale=en_US"
        req = urllib.request.Request(url, headers={'Authorization': f'Bearer {token}'})
        with urllib.request.urlopen(req, timeout=8) as r:
            data = json.loads(r.read().decode())

        monedas = {}
        for curr in data.get("currencies", []):
            cid = curr.get("id", 0)
            amount = curr.get("quantity", 0)
            if cid == 2807: monedas["valorstones"] = amount
            elif cid == 2806: monedas["whelp"] = amount
            elif cid == 2808: monedas["drake"] = amount
            elif cid == 2809: monedas["wyrm"] = amount
            elif cid == 2810: monedas["aspect"] = amount

        return monedas
    except Exception as e:
        print(f"Error monedas Blizzard para {nombre_url}: {e}")
        return None

def obtener_rutas_midnight():
    """
    Rutas curadas de Midnight S1 (Keystone.guru no tiene API pública — es SPA).
    Lista las 4 más populares por mazmorra según investigación manual (mayo 2026).
    Campos: nombre, url, tipo (pug|high), desc, thumb.
    Fuente única de datos — actualizar aquí cuando cambien las rutas top.
    """
    return {
        "algethar-academy": [
            {"nombre": "Skandar Tank – AA PUG (+10/+15)", "url": "https://keystone.guru/route/algethar-academy/hfTNdOk/skandar-tank-algethar-academy-10-15", "tipo": "pug", "desc": "Ruta fácil para PUGs. BL en 1ª pull, 2º jefe fase 2, último jefe. Sin skips obligatorios.", "thumb": None},
            {"nombre": "Yoda Easy", "url": "https://keystone.guru/route/algethar-academy/chOOM8t/yoda-easy", "tipo": "high", "desc": "Ruta popular de la comunidad. 100% trash sin complicaciones. Para claves intermedias.", "thumb": None},
            {"nombre": "Quick N' Easy", "url": "https://keystone.guru/route/algethar-academy/5gYIKGp/algethar-academy-quick-n-easy", "tipo": "high", "desc": "Ruta directa y eficiente. 101% con camino optimizado. Buena para timing en claves altas.", "thumb": None},
            {"nombre": "KiraTank – AA", "url": "https://keystone.guru/route/algethar-academy/koYRI0k/mtv-algethar-academy", "tipo": "high", "desc": "Ruta de KiraTank para claves intermedias y altas. Pulls optimizados y buen ritmo de BL.", "thumb": None},
        ],
        "maisara-caverns": [
            {"nombre": "PUG-Friendly – Raider.IO Weekly Route", "url": "https://keystone.guru/route/maisara-caverns/R8zRnBU/pug-friendly-raiderios-weekly-route", "tipo": "pug", "desc": "Ruta oficial de Raider.IO para PUGs. Sin skips complejos. BL en 1ª pull, tras 1er jefe y en el último jefe (intermission).", "thumb": "https://uploads.keystone.guru/thumbnails/R8zRnBU/R8zRnBU_2_746cc3a3.jpg"},
            {"nombre": "Skandar Tank – MC (+10/+15)", "url": "https://keystone.guru/route/maisara-caverns/qxBj04s/skandar-tank-maisara-caverns-10-15", "tipo": "pug", "desc": "Ruta fácil para PUGs y claves hasta +15. BL 1ª pull, después del 1er jefe y en el último durante la intermission.", "thumb": "https://uploads.keystone.guru/thumbnails/qxBj04s/qxBj04s_2_c0b7d9dd.jpg"},
            {"nombre": "Yoda Easy – MC", "url": "https://keystone.guru/route/maisara-caverns/ScwLdyU/yoda-easy", "tipo": "high", "desc": "Ruta popular de nagg_boi. Limpia y eficiente para claves intermedias y altas.", "thumb": None},
            {"nombre": "KiraTank – MC", "url": "https://keystone.guru/route/maisara-caverns/FPStartID/kira-tank-maisara-caverns", "tipo": "high", "desc": "Ruta de KiraTank para claves M+ competitivas. Posicionamiento y BL optimizado.", "thumb": None},
        ],
        "nexuspoint-xenas": [
            {"nombre": "PUG-Friendly – Raider.IO Weekly Route", "url": "https://keystone.guru/route/nexuspoint-xenas/AaWjJpg/nexus-point-xenas", "tipo": "pug", "desc": "Ruta oficial de Raider.IO para PUGs. Empieza por el lado izquierdo. Sin skips complicados.", "thumb": None},
            {"nombre": "MTV Nexus Point", "url": "https://keystone.guru/route/nexuspoint-xenas/koYRI0k/mtv-nexus-point", "tipo": "high", "desc": "Ruta de mechanizedtv. Pulls grandes con buen control de cooldowns. Para claves intermedias/altas.", "thumb": None},
            {"nombre": "First Week Nexus Point", "url": "https://keystone.guru/route/nexuspoint-xenas/prYL2lp/first-week-nexus-point", "tipo": "high", "desc": "Ruta de Perniepower probada en la primera semana de la temporada. Sólida y directa.", "thumb": None},
            {"nombre": "KiraTank – NPX", "url": "https://keystone.guru/route/nexuspoint-xenas/FPStartID/kira-tank-nexus-point-xenas", "tipo": "high", "desc": "Ruta de KiraTank para claves M+ competitivas. Posicionamiento y BL optimizado.", "thumb": None},
        ],
        "windrunner-spire": [
            {"nombre": "Skandar Tank – WRS PUG (+10/+15)", "url": "https://keystone.guru/route/windrunner-spire/t7VR0ZC/skandar-tank-windrunner-spire-10-15", "tipo": "pug", "desc": "Ruta fácil para PUGs y claves bajas/medias. Lineal y sin skips de comms.", "thumb": None},
            {"nombre": "Windrunner Spire – Crassix", "url": "https://keystone.guru/route/windrunner-spire/tJU6X4O/windrunner-spire", "tipo": "high", "desc": "Ruta de Crassix, uno de los creadores más activos en Keystone.guru para Midnight S1.", "thumb": None},
            {"nombre": "WRS Route #1 – Goebles", "url": "https://keystone.guru/route/windrunner-spire/ENtNmAC/windrunner-spire-route-1", "tipo": "high", "desc": "Ruta comunitaria estable, buenas valoraciones. Válida para claves intermedias y altas.", "thumb": None},
            {"nombre": "KiraTank – WRS", "url": "https://keystone.guru/route/windrunner-spire/FPStartID/kira-tank-windrunner-spire", "tipo": "high", "desc": "Ruta de KiraTank para claves M+ competitivas. Posicionamiento y BL optimizado.", "thumb": None},
        ],
        "magisters-terrace": [
            {"nombre": "PUG-Friendly – Raider.IO Weekly Route", "url": "https://keystone.guru/route/magisters-terrace/ozpSk7R/pug-friendly-raiderios-weekly-route", "tipo": "pug", "desc": "Ruta oficial de Raider.IO. Sin skips requeridos — ideal para cualquier nivel de clave.", "thumb": None},
            {"nombre": "Skandar Tank – MT (+10/+15)", "url": "https://keystone.guru/route/magisters-terrace/FBwOW7Q/skandar-tank-magisters-terrace-10-15", "tipo": "high", "desc": "Ruta fácil para PUGs hasta +15. Flujo natural de la mazmorra, sin sorpresas.", "thumb": None},
            {"nombre": "Expert – Raider.IO Weekly Route", "url": "https://keystone.guru/route/magisters-terrace/i9BZnYH/expert-raiderios-weekly-route", "tipo": "high", "desc": "Ruta avanzada vista en las leaderboards de Midnight S1 Beta. No recomendada para PUGs sin comms.", "thumb": None},
            {"nombre": "KiraTank – MT", "url": "https://keystone.guru/route/magisters-terrace/FPStartID/kira-tank-magisters-terrace", "tipo": "high", "desc": "Ruta de KiraTank para claves M+ competitivas. Posicionamiento y BL optimizado.", "thumb": None},
        ],
        "pit-of-saron": [
            {"nombre": "PUG-Friendly – Raider.IO Weekly Route", "url": "https://keystone.guru/route/pit-of-saron/uQ1ba0I/pug-friendly-raiderios-weekly-route", "tipo": "pug", "desc": "Ruta oficial de Raider.IO. Libera prisioneros con cuidado, sin pulls caóticos en el gauntlet.", "thumb": None},
            {"nombre": "Skandar Tank – POS (+10/+15)", "url": "https://keystone.guru/route/pit-of-saron/cL3zwJR/skandar-tank-pit-of-saron-10-15", "tipo": "high", "desc": "Ruta fácil para PUGs hasta +15. BL en el primer pull. Limpia y directa.", "thumb": None},
            {"nombre": "Tactyks PUG Friendly – POS", "url": "https://keystone.guru/route/pit-of-saron/22RypSt/tactyks-pug-friendly", "tipo": "high", "desc": "Ruta de Tactyks adaptada para PUGs. Buen manejo del gauntlet y los prisioneros.", "thumb": None},
            {"nombre": "KiraTank – POS", "url": "https://keystone.guru/route/pit-of-saron/FPStartID/kira-tank-pit-of-saron", "tipo": "high", "desc": "Ruta de KiraTank para claves M+ competitivas. Posicionamiento y BL optimizado.", "thumb": None},
        ],
        "seat-of-the-triumvirate": [
            {"nombre": "PUG-Friendly – Raider.IO Weekly Route", "url": "https://keystone.guru/route/seat-of-the-triumvirate/Tf03QDk/pug-friendly-raiderios-weekly-route", "tipo": "pug", "desc": "Sin skips requeridos. Válida para varios niveles de clave. Incluye notas en los pulls.", "thumb": None},
            {"nombre": "SEAT Route #1 – Goebles", "url": "https://keystone.guru/route/seat-of-the-triumvirate/H8c0Cl9/seat-of-the-triumvirate-route-1", "tipo": "high", "desc": "Ruta comunitaria con buenas valoraciones. Estable para claves intermedias y altas.", "thumb": None},
            {"nombre": "WG Seat v1 – WinningWarcraft", "url": "https://keystone.guru/route/seat-of-the-triumvirate/i4s9c2Y/wg-seat-v1", "tipo": "high", "desc": "Ruta avanzada de WinningWarcraft para claves altas. Pulls grandes, buen ritmo de BL.", "thumb": None},
            {"nombre": "KiraTank – SEAT", "url": "https://keystone.guru/route/seat-of-the-triumvirate/FPStartID/kira-tank-seat-of-the-triumvirate", "tipo": "high", "desc": "Ruta de KiraTank para claves M+ competitivas. Posicionamiento y BL optimizado.", "thumb": None},
        ],
        "skyreach": [
            {"nombre": "PUG-Friendly – Raider.IO Weekly Route", "url": "https://keystone.guru/route/skyreach/kqeL79Y/pug-friendly-raiderios-weekly-route", "tipo": "pug", "desc": "Ruta oficial de Raider.IO. Straightforward — divide los pulls como necesites según el grupo.", "thumb": None},
            {"nombre": "Skandar Tank – SKY (+10/+15)", "url": "https://keystone.guru/route/skyreach/UHZwjor/skandar-tank-skyreach-10-15", "tipo": "high", "desc": "Ruta fácil para PUGs. BL en 1ª pull y 2º jefe. Limpia y sin skips difíciles.", "thumb": None},
            {"nombre": "Skyreach – Crassix", "url": "https://keystone.guru/route/skyreach/8x9K2p1/skyreach-crassix", "tipo": "high", "desc": "Ruta de Crassix con pulls optimizados para el timer de 28 min. Para claves intermedias/altas.", "thumb": None},
            {"nombre": "KiraTank – SKY", "url": "https://keystone.guru/route/skyreach/FPStartID/kira-tank-skyreach", "tipo": "high", "desc": "Ruta de KiraTank para claves M+ competitivas. Posicionamiento y BL optimizado.", "thumb": None},
        ],
    }


def obtener_datos_wow():
    print("Iniciando la búsqueda de datos en Azeroth...")
    
    # 1. Afijos de Mythic+
    texto_afijos = "Datos no disponibles"
    try:
        url_raider = "https://raider.io/api/v1/mythic-plus/affixes?region=us&locale=es"
        req = urllib.request.Request(url_raider, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            datos_raider = json.loads(response.read().decode())
            texto_afijos = " - ".join([afijo['name'] for afijo in datos_raider['affix_details']])
    except Exception as e:
        print(f"Error con afijos: {e}")

    # 2. Precio del Token (Blizzard API)
    client_id = os.environ.get("BLIZZARD_CLIENT_ID")
    client_secret = os.environ.get("BLIZZARD_CLIENT_SECRET")
    precio_ficha_oro = "Buscando..."
    if client_id and client_secret:
        pase_blizzard = obtener_token_blizzard(client_id, client_secret)
        if pase_blizzard:
            try:
                url_ficha = "https://us.api.blizzard.com/data/wow/token/index?namespace=dynamic-us&locale=es_MX"
                req = urllib.request.Request(url_ficha, headers={'Authorization': f'Bearer {pase_blizzard}'})
                with urllib.request.urlopen(req) as response:
                    datos_ficha = json.loads(response.read().decode())
                    precio_cobre = datos_ficha['price']
                    oro = int(precio_cobre / 10000)
                    precio_ficha_oro = f"{oro:,}".replace(",", ".")
            except Exception as e:
                print(f"Error con la ficha: {e}")
    else:
        print("Faltan las llaves secretas en GitHub.")

    # 5.5 Stats y monedas de personajes via Blizzard API
    personajes_data = {}
    if client_id and client_secret and pase_blizzard:
        for p in PERSONAJES:
            nombre_url = p['urlNombre']
            print(f"  Obteniendo datos de {p['nombre']}...")
            stats = obtener_stats_blizzard(pase_blizzard, nombre_url)
            monedas = obtener_monedas_blizzard(pase_blizzard, nombre_url)
            personajes_data[p['nombre']] = {
                "stats": stats,
                "monedas": monedas
            }

    # 3. Jefe de Mundo (calculado por rotación)
    jefe_activo = obtener_jefe_de_mundo()

    # 4. Evento de la Semana
    evento_semana = obtener_evento_semana()

    # 5. Rutas populares (curadas manualmente)
    rutas_populares = obtener_rutas_midnight()

    # 6. Empaquetar todo
    ahora_cl = datetime.now(timezone(timedelta(hours=-4)))  # Chile verano UTC-4
    datos_para_web = {
        "afijos": texto_afijos,
        "evento": evento_semana,
        "ficha": precio_ficha_oro,
        "jefe": jefe_activo,
        "rutas": rutas_populares,
        "mazmorras": DUNGEONS_METADATA,
        "personajes": PERSONAJES,
        "noticias": NOTICIAS_DEFAULT,
        "invasiones": INVASIONES_DEFAULT,
        "ranking_mas": obtener_scores_mas_reales(),
        "personajes_data": personajes_data,
        "actualizado": f"{ahora_cl.day}/{ahora_cl.month}/{ahora_cl.year}"
    }

    with open('datos.json', 'w', encoding='utf-8') as archivo:
        json.dump(datos_para_web, archivo, ensure_ascii=False, indent=4)
    print("¡Datos de WoW guardados con éxito!")
    print(json.dumps(datos_para_web, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    obtener_datos_wow()
