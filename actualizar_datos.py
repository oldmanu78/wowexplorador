import os
import urllib.request
import urllib.parse
import json
import base64

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

def obtener_datos_wow():
    print("Iniciando la búsqueda de datos en Azeroth...")
    
    # 1. Obtener Afijos (Raider.io)
    texto_afijos = "Datos no disponibles"
    try:
        url_raider = "https://raider.io/api/v1/mythic-plus/affixes?region=us&locale=es"
        req = urllib.request.Request(url_raider, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            datos_raider = json.loads(response.read().decode())
            texto_afijos = " - ".join([afijo['name'] for afijo in datos_raider['affix_details']])
    except Exception as e:
        print(f"Error con afijos: {e}")

    # 2. Conectar a Blizzard para el Precio de la Ficha (Token)
    client_id = os.environ.get("BLIZZARD_CLIENT_ID")
    client_secret = os.environ.get("BLIZZARD_CLIENT_SECRET")
    precio_ficha_oro = "Buscando..."

    if client_id and client_secret:
        pase_blizzard = obtener_token_blizzard(client_id, client_secret)
        if pase_blizzard:
            try:
                # CORRECCIÓN: La URL ya no lleva el pase pegado al final
                url_ficha = "https://us.api.blizzard.com/data/wow/token/index?namespace=dynamic-us&locale=es_MX"
                
                # CORRECCIÓN: Ahora el pase viaja escondido de forma segura en las cabeceras
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

    # 3. Empaquetar todo
    datos_para_web = {
        "afijos": texto_afijos,
        "evento": "Buscando en el calendario... (Próximamente)",
        "ficha": precio_ficha_oro,
        "jefe": "Aurostor (Ejemplo temporal)"
    }
    
    with open('datos.json', 'w', encoding='utf-8') as archivo:
        json.dump(datos_para_web, archivo, ensure_ascii=False, indent=4)
        print("¡Datos de WoW guardados con éxito!")

if __name__ == "__main__":
    obtener_datos_wow()
