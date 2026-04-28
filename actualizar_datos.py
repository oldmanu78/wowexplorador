import os
import urllib.request
import urllib.parse
import json
import base64
from datetime import datetime, timezone, timedelta

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
    Obtiene el evento semanal (Timewalking, PvP, etc.) desde Raider.io
    """
    try:
        url = "https://raider.io/api/v1/mythic-plus/affixes?region=us&locale=es"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            datos = json.loads(response.read().decode())
            # Raider.io a veces incluye el evento semanal en el campo 'title'
            if 'title' in datos:
                return datos['title']
    except Exception as e:
        print(f"Error al obtener evento desde Raider.io: {e}")

    # Plan B: Calcular el evento semanal por rotación conocida de Midnight S1
    # Blizzard rota los eventos cada semana. Los principales en Midnight S1:
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

def obtener_rutas_midnight():
    """
    Rutas curadas de Midnight S1 (Keystone.guru no tiene API pública — es SPA).
    Lista las 3 más populares por mazmorra según investigación manual.
    Actualizar esta lista cuando cambien las rutas top de la temporada.
    """
    return {
        "algethar-academy": [
            {"nombre": "Skandar Tank – AA PUG (+10/+15)",
             "url": "https://keystone.guru/route/algethar-academy/hfTNdOk/skandar-tank-algethar-academy-10-15"},
            {"nombre": "Yoda Easy",
             "url": "https://keystone.guru/route/algethar-academy/chOOM8t/yoda-easy"},
            {"nombre": "Quick N' Easy",
             "url": "https://keystone.guru/route/algethar-academy/5gYIKGp/algethar-academy-quick-n-easy"},
        ],
        "maisara-caverns": [
            {"nombre": "PUG-Friendly – Raider.IO Weekly Route",
             "url": "https://keystone.guru/route/maisara-caverns/R8zRnBU/pug-friendly-raiderios-weekly-route"},
            {"nombre": "Skandar Tank – MC (+10/+15)",
             "url": "https://keystone.guru/route/maisara-caverns/qxBj04s/skandar-tank-maisara-caverns-10-15"},
            {"nombre": "Yoda Easy – MC",
             "url": "https://keystone.guru/route/maisara-caverns/ScwLdyU/yoda-easy"},
        ],
        "nexuspoint-xenas": [
            {"nombre": "PUG-Friendly – Raider.IO Weekly Route",
             "url": "https://keystone.guru/route/nexuspoint-xenas/AaWjJpg/nexus-point-xenas"},
            {"nombre": "MTV Nexus Point",
             "url": "https://keystone.guru/route/nexuspoint-xenas/koYRI0k/mtv-nexus-point"},
            {"nombre": "First Week Nexus Point",
             "url": "https://keystone.guru/route/nexuspoint-xenas/prYL2lp/first-week-nexus-point"},
        ],
        "windrunner-spire": [
            {"nombre": "Skandar Tank – WRS PUG (+10/+15)",
             "url": "https://keystone.guru/route/windrunner-spire/t7VR0ZC/skandar-tank-windrunner-spire-10-15"},
            {"nombre": "Windrunner Spire – Crassix",
             "url": "https://keystone.guru/route/windrunner-spire/tJU6X4O/windrunner-spire"},
            {"nombre": "WRS Route #1 – Goebles",
             "url": "https://keystone.guru/route/windrunner-spire/ENtNmAC/windrunner-spire-route-1"},
        ],
        "magisters-terrace": [
            {"nombre": "PUG-Friendly – Raider.IO Weekly Route",
             "url": "https://keystone.guru/route/magisters-terrace/ozpSk7R/pug-friendly-raiderios-weekly-route"},
            {"nombre": "Skandar Tank – MT (+10/+15)",
             "url": "https://keystone.guru/route/magisters-terrace/FBwOW7Q/skandar-tank-magisters-terrace-10-15"},
            {"nombre": "Expert – Raider.IO Weekly Route",
             "url": "https://keystone.guru/route/magisters-terrace/i9BZnYH/expert-raiderios-weekly-route"},
        ],
        "pit-of-saron": [
            {"nombre": "PUG-Friendly – Raider.IO Weekly Route",
             "url": "https://keystone.guru/route/pit-of-saron/uQ1ba0I/pug-friendly-raiderios-weekly-route"},
            {"nombre": "Skandar Tank – POS (+10/+15)",
             "url": "https://keystone.guru/route/pit-of-saron/cL3zwJR/skandar-tank-pit-of-saron-10-15"},
            {"nombre": "Tactyks PUG Friendly – POS",
             "url": "https://keystone.guru/route/pit-of-saron/22RypSt/tactyks-pug-friendly"},
        ],
        "seat-of-the-triumvirate": [
            {"nombre": "PUG-Friendly – Raider.IO Weekly Route",
             "url": "https://keystone.guru/route/seat-of-the-triumvirate/Tf03QDk/pug-friendly-raiderios-weekly-route"},
            {"nombre": "SEAT Route #1 – Goebles",
             "url": "https://keystone.guru/route/seat-of-the-triumvirate/H8c0Cl9/seat-of-the-triumvirate-route-1"},
            {"nombre": "WG Seat v1 – WinningWarcraft",
             "url": "https://keystone.guru/route/seat-of-the-triumvirate/i4s9c2Y/wg-seat-v1"},
        ],
        "skyreach": [
            {"nombre": "PUG-Friendly – Raider.IO Weekly Route",
             "url": "https://keystone.guru/route/skyreach/kqeL79Y/pug-friendly-raiderios-weekly-route"},
            {"nombre": "Skandar Tank – SKY (+10/+15)",
             "url": "https://keystone.guru/route/skyreach/UHZwjor/skandar-tank-skyreach-10-15"},
            {"nombre": "Skyreach – Crassix",
             "url": "https://keystone.guru/route/skyreach/8x9K2p1/skyreach-crassix"},
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

    # 3. Jefe de Mundo (calculado por rotación)
    jefe_activo = obtener_jefe_de_mundo()

    # 4. Evento de la Semana
    evento_semana = obtener_evento_semana()

    # 5. Rutas populares (curadas manualmente — Keystone.guru es SPA sin API)
    rutas_populares = obtener_rutas_midnight()

    # 6. Empaquetar todo
    ahora_cl = datetime.now(timezone(timedelta(hours=-4)))  # Chile verano UTC-4
    datos_para_web = {
        "afijos": texto_afijos,
        "evento": evento_semana,
        "ficha": precio_ficha_oro,
        "jefe": jefe_activo,
        "rutas": rutas_populares,
        "actualizado": f"{ahora_cl.day}/{ahora_cl.month}/{ahora_cl.year}"
    }

    with open('datos.json', 'w', encoding='utf-8') as archivo:
        json.dump(datos_para_web, archivo, ensure_ascii=False, indent=4)
    print("¡Datos de WoW guardados con éxito!")
    print(json.dumps(datos_para_web, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    obtener_datos_wow()
