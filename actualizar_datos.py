import urllib.request
import json

def obtener_datos_wow():
    # Esta es la dirección secreta donde Raider.io guarda los afijos
    url = "https://raider.io/api/v1/mythic-plus/affixes?region=us&locale=es"
    
    try:
        # Hacemos la petición fingiendo ser un navegador para que no nos bloqueen
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            datos_raiderio = json.loads(response.read().decode())
            
        # Extraemos solo los nombres de los afijos
        nombres_afijos = [afijo['name'] for afijo in datos_raiderio['affix_details']]
        texto_afijos = " - ".join(nombres_afijos)
        
        # Preparamos el paquete de datos para tu página web
        datos_para_web = {
            "afijos": texto_afijos,
            "evento": "Buscando eventos de calendario... (Próximamente)"
        }
        
        # Creamos un archivo llamado datos.json con la información
        with open('datos.json', 'w', encoding='utf-8') as archivo:
            json.dump(datos_para_web, archivo, ensure_ascii=False, indent=4)
            
        print("¡Éxito! El robot consiguió los afijos:", texto_afijos)
        
    except Exception as e:
        print(f"Hubo un error al buscar los datos: {e}")

# Esta línea es la que enciende al robot
if __name__ == "__main__":
    obtener_datos_wow()
