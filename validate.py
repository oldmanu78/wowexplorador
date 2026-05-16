#!/usr/bin/env python3
"""Valida la integridad de datos.json y los scripts Python del proyecto."""
import json
import os
import sys
import traceback

BASE = os.path.dirname(os.path.abspath(__file__))
ERRORS = []

def err(msg):
    ERRORS.append(msg)
    print("  FAIL: " + msg)

def ok(msg):
    print("  OK: " + msg)

def check(cond, msg):
    if cond:
        ok(msg)
    else:
        err(msg)

# ── 1. Validar datos.json ─────────────────────────────────
def validate_datos_json():
    path = os.path.join(BASE, "datos.json")
    check(os.path.exists(path), "datos.json existe")

    try:
        with open(path, "r", encoding="utf-8") as f:
            d = json.load(f)
    except Exception as e:
        err("datos.json no es JSON valido: " + str(e))
        return

    # Campos raíz requeridos
    required_root = ["afijos", "evento", "ficha", "jefe", "rutas", "mazmorras",
                     "personajes", "noticias", "invasiones", "ranking_mas", "actualizado"]
    for key in required_root:
        check(key in d, "datos.json tiene campo '" + key + "'")

    if "afijos" in d:
        check(isinstance(d["afijos"], str) and len(d["afijos"]) > 0, "afijos: string no vacio")

    if "evento" in d:
        check(isinstance(d["evento"], str) and len(d["evento"]) > 0, "evento: string no vacio")

    if "jefe" in d:
        check(isinstance(d["jefe"], str) and len(d["jefe"]) > 0, "jefe: string no vacio")

    if "actualizado" in d:
        val = d["actualizado"]
        check(isinstance(val, str) and len(val) > 0, "actualizado: string no vacio")

    # Mazmorras
    if "mazmorras" in d:
        m = d["mazmorras"]
        check(isinstance(m, dict), "mazmorras: dict")
        dungeon_ids = [
            "algethar-academy", "maisara-caverns", "nexuspoint-xenas", "windrunner-spire",
            "magisters-terrace", "pit-of-saron", "seat-of-the-triumvirate", "skyreach"
        ]
        for did in dungeon_ids:
            check(did in m, "mazmorras contiene '" + did + "'")
            if did in m:
                dm = m[did]
                for field in ["nombre", "tipo", "sigla", "jefes", "timer", "zona", "img", "desc", "guia_method", "guia_icy"]:
                    check(field in dm, "mazmorras." + did + " tiene campo '" + field + "'")
                if "tipo" in dm:
                    check(dm["tipo"] in ("nueva", "clasica"), "mazmorras." + did + ".tipo es nueva|clasica")
                if "jefes" in dm:
                    check(isinstance(dm["jefes"], int) and dm["jefes"] > 0, "mazmorras." + did + ".jefes es int positivo")

    # Rutas
    if "rutas" in d:
        rd = d["rutas"]
        check(isinstance(rd, dict), "rutas: dict")
        if "mazmorras" in d:
            for did in d["mazmorras"]:
                check(did in rd, "rutas tiene entrada para '" + did + "'")
                if did in rd:
                    routes = rd[did]
                    check(isinstance(routes, list) and len(routes) > 0, "rutas." + did + ": lista no vacia")
                    for i, r in enumerate(routes):
                        for field in ["nombre", "url", "tipo", "desc"]:
                            check(field in r, "rutas." + did + "[" + str(i) + "] tiene '" + field + "'")
                        if "tipo" in r:
                            check(r["tipo"] in ("pug", "high"), "rutas." + did + "[" + str(i) + "].tipo es pug|high")
                        if "url" in r:
                            check(r["url"].startswith("http"), "rutas." + did + "[" + str(i) + "].url empieza con http")

    # Personajes
    if "personajes" in d:
        pj = d["personajes"]
        check(isinstance(pj, list), "personajes: list")
        check(len(pj) == 7, "personajes: 7 personajes")
        expected = ["Kreathor", "Muchufaza", "Czernobög", "Oldkreeper", "Redguardïan", "Krëeper", "Nösferätü"]
        names = [p.get("nombre", "") for p in pj]
        for exp in expected:
            check(exp in names, "personajes incluye '" + exp + "'")
        for p in pj:
            for field in ["nombre", "urlNombre", "pagina"]:
                check(field in p, "personaje '" + p.get("nombre", "?") + "' tiene campo '" + field + "'")

    # Noticias
    if "noticias" in d:
        n = d["noticias"]
        check(isinstance(n, list) and len(n) >= 1, "noticias: lista con al menos 1 entrada")
        for item in n:
            for field in ["titulo", "link", "fecha", "fuente"]:
                check(field in item, "noticia tiene campo '" + field + "'")

    # Invasiones
    if "invasiones" in d:
        inv = d["invasiones"]
        check(isinstance(inv, list) and len(inv) >= 1, "invasiones: lista con al menos 1 entrada")
        for item in inv:
            for field in ["zona", "npcs", "recompensa"]:
                check(field in item, "invasion tiene campo '" + field + "'")
            if "npcs" in item:
                check(isinstance(item["npcs"], int) and item["npcs"] > 0, "npcs es int positivo")

    # Ranking
    if "ranking_mas" in d:
        rk = d["ranking_mas"]
        check(isinstance(rk, dict), "ranking_mas: dict")
        for role in ["tank", "dps", "healer"]:
            check(role in rk, "ranking_mas tiene '" + role + "'")
            if role in rk:
                check(isinstance(rk[role], list), "ranking_mas." + role + ": list")
                for item in rk[role]:
                    for field in ["nombre", "clase", "score"]:
                        check(field in item, "ranking." + role + " item tiene '" + field + "'")
                    if "score" in item:
                        check(isinstance(item["score"], (int, float)), "score es numero")


# ── 2. Validar scripts Python ─────────────────────────────
def validate_python():
    scripts = ["actualizar_datos.py", "gen_chars.py"]
    for script in scripts:
        path = os.path.join(BASE, script)
        check(os.path.exists(path), script + " existe")
        if os.path.exists(path):
            try:
                compile(open(path, "r", encoding="utf-8").read(), script, "exec")
                ok(script + " compila sin errores")
            except SyntaxError as e:
                err(script + " error de sintaxis: " + str(e))

    # Verificar que solo usan libreria estandar
    for script in scripts:
        path = os.path.join(BASE, script)
        if not os.path.exists(path):
            continue
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        # Extraer imports
        imports = []
        for line in content.split("\n"):
            line = line.strip()
            if line.startswith("import ") and not line.startswith("import " + os.path.basename(BASE)):
                parts = line.split()
                if len(parts) >= 2:
                    imports.append(parts[1].split(".")[0])
            elif line.startswith("from "):
                parts = line.split()
                if len(parts) >= 2:
                    imports.append(parts[1].split(".")[0])
        # Libreria estandar permitida
        stdlib = {"os", "urllib", "json", "datetime", "base64", "sys", "re", "math", "copy", "collections", "io", "textwrap", "typing", "functools", "itertools", "pathlib", "shutil", "subprocess", "tempfile", "time", "random", "statistics", "string", "zoneinfo"}
        for imp in imports:
            check(imp in stdlib, script + " usa solo stdlib (" + imp + ")")


# ── 3. Validar HTML generados ─────────────────────────────
def validate_html():
    # Verificar que todas las paginas HTML existen
    pages = ["index.html", "personajes.html", "rutas.html", "kreathor.html",
             "muchufaza.html", "czernobog.html", "oldkreeper.html",
             "redguardian.html", "kreeper.html", "nosferatu.html"]
    for page in pages:
        path = os.path.join(BASE, page)
        check(os.path.exists(path), page + " existe")
        if os.path.exists(path):
            size = os.path.getsize(path)
            check(size > 1000, page + " tamaño > 1000 bytes (" + str(size) + ")")

    # Verificar que kreathor y generados referencian shared.js
    for page in ["kreathor.html", "muchufaza.html", "czernobog.html", "oldkreeper.html",
                 "redguardian.html", "kreeper.html", "nosferatu.html"]:
        path = os.path.join(BASE, page)
        if os.path.exists(path):
            content = open(path, "r", encoding="utf-8").read()
            check("character-common.js" in content, page + " referencia js/character-common.js")

    # Verificar existencias de shared.js
    shared_path = os.path.join(BASE, "js", "character-common.js")
    check(os.path.exists(shared_path), "js/character-common.js existe")


# ── Ejecutar ──────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 50)
    print("VALIDACION DEL PROYECTO WOW EXPLORADOR")
    print("=" * 50)
    print()
    print("[ datos.json ]")
    validate_datos_json()
    print()
    print("[ Scripts Python ]")
    validate_python()
    print()
    print("[ Paginas HTML ]")
    validate_html()
    print()
    print("=" * 50)
    total = len(ERRORS)
    if total == 0:
        print("RESULTADO: TODO OK - " + str(total) + " errores")
        sys.exit(0)
    else:
        print("RESULTADO: " + str(total) + " error(es) encontrados")
        sys.exit(1)
