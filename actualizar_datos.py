import urllib.request
import json

def obtener_datos_wow():
    print("Iniciando la búsqueda de datos en Azeroth...")
    
    # 1. Obtenemos los Afijos Reales (vía Raider.io)
    texto_afijos = "Datos no disponibles"
    try:
        url = "https://raider.io/api/v1/mythic-plus/affixes?region=us&locale=es"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            datos = json.loads(response.read().decode())
            nombres = [afijo['name'] for afijo in datos['affix_details']]
            texto_afijos = " - ".join(nombres)
    except Exception as e:
        print(f"Error con los afijos: {e}")

    # 2. Empaquetamos todo para la web
    # Nota: Ficha, Evento y Jefe están simulados temporalmente
    datos_para_web = {
        "afijos": texto_afijos,
        "evento": "Paseo en el Tiempo: TBC (Ejemplo)",
        "ficha": "315.500", 
        "jefe": "Aurostor el Hibernante (Ejemplo)"
    }
    
    # Creamos el archivo que leerá tu página
    with open('datos.json', 'w', encoding='utf-8') as archivo:
        json.dump(datos_para_web, archivo, ensure_ascii=False, indent=4)
        
    print("¡Archivo datos.json actualizado con éxito!")

if __name__ == "__main__":
    obtener_datos_wow()
