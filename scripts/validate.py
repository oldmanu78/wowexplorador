"""
Validador de datos para WoW Explorer
Verifica la integridad de la base de datos SQLite y los archivos del proyecto
"""

import json
import os
import sqlite3
import sys
from pathlib import Path

# Ruta base del proyecto
BASE_DIR = Path(__file__).parent.parent
DB_PATH = BASE_DIR / "prisma" / "wow.db"

ERRORS = []


def check(condition, message):
    """Acumula errores si la condición es falsa."""
    if not condition:
        ERRORS.append(message)
        print(f"  [ERR] {message}")
    else:
        print(f"  [+] {message}")


def validate_database():
    """Valida que la base de datos exista y tenga las tablas correctas."""
    print("\n[DB] Base de datos SQLite:")

    check(DB_PATH.exists(), f"Archivo {DB_PATH} existe")

    if not DB_PATH.exists():
        return

    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()

    # Tablas requeridas
    required_tables = [
        "User", "Character", "WeeklySnapshot",
        "Dungeon", "Route", "News", "Invasion", "MythicRun"
    ]

    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    existing_tables = {row[0] for row in cursor.fetchall()}

    for table in required_tables:
        check(table in existing_tables, f"Tabla {table} existe")

    # Verifica datos en tablas principales
    for table in ["Character", "Dungeon", "WeeklySnapshot"]:
        if table in existing_tables:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            check(count > 0, f"  {table}: {count} registros")

    # Verifica personajes esperados
    if "Character" in existing_tables:
        expected = ["Kreathor", "Muchufaza", "Czernobög", "Oldkreeper",
                     "Redguardïan", "Krëeper", "Nösferätü"]
        cursor.execute("SELECT name FROM Character")
        names = {row[0] for row in cursor.fetchall()}
        for name in expected:
            check(name in names, f"Personaje {name} existe")

    # Verifica mazmorras esperadas
    if "Dungeon" in existing_tables:
        expected_slugs = [
            "algethar-academy", "maisara-caverns", "nexus-point-xenas",
            "windrunner-spire", "magisters-terrace", "pit-of-saron",
            "seat-of-the-triumvirate", "skyreach"
        ]
        cursor.execute("SELECT slug FROM Dungeon")
        slugs = {row[0] for row in cursor.fetchall()}
        for slug in expected_slugs:
            check(slug in slugs, f"Mazmorra {slug} existe")

    conn.close()


def validate_project_files():
    """Valida que los archivos esenciales del proyecto existan."""
    print("\n[FILES] Archivos del proyecto:")

    required_files = [
        "next.config.ts",
        "package.json",
        "tsconfig.json",
        "src/app/layout.tsx",
        "src/app/page.tsx",
        "src/app/globals.css",
        "src/app/personajes/page.tsx",
        "src/app/personajes/[slug]/page.tsx",
        "src/app/rutas/page.tsx",
        "src/lib/db.ts",
        "src/lib/utils.ts",
        "src/lib/constants.ts",
        "prisma/schema.prisma",
        "scripts/actualizar_datos.py",
    ]

    for filepath in required_files:
        full_path = BASE_DIR / filepath
        check(full_path.exists(), f"Archivo {filepath} existe")

    # Verifica componentes esenciales
    required_components = [
        "components/ui/Card.tsx",
        "components/ui/Badge.tsx",
        "components/ui/Tabs.tsx",
        "components/ui/ProgressBar.tsx",
        "components/ui/ScoreDisplay.tsx",
        "components/layout/Header.tsx",
        "components/layout/Footer.tsx",
        "components/characters/HeroSection.tsx",
        "components/characters/StatsPanel.tsx",
        "components/characters/MonedasPanel.tsx",
        "components/characters/GearPanel.tsx",
        "components/characters/DungeonPanel.tsx",
        "components/characters/RunsPanel.tsx",
        "components/characters/RaidPanel.tsx",
        "components/characters/NotesPanel.tsx",
        "components/characters/CharacterCard.tsx",
        "components/weekly/AffixDisplay.tsx",
        "components/weekly/EventCard.tsx",
        "components/weekly/WorldBossCard.tsx",
        "components/weekly/TokenPrice.tsx",
        "components/weekly/NewsFeed.tsx",
        "components/weekly/InvasionList.tsx",
        "components/weekly/RankingTable.tsx",
        "components/routes/DungeonHero.tsx",
        "components/routes/RouteCard.tsx",
        "components/routes/DungeonTabs.tsx",
    ]

    for comp in required_components:
        full_path = BASE_DIR / "src" / comp
        check(full_path.exists(), f"Componente {comp} existe")


def validate_python_script():
    """Valida que el script de Python tenga sintaxis correcta."""
    print("\n[PYTHON] Script Python:")
    py_path = BASE_DIR / "scripts" / "actualizar_datos.py"
    if py_path.exists():
        try:
            compile(py_path.read_text(encoding="utf-8"), "actualizar_datos.py", "exec")
            check(True, "actualizar_datos.py — sintaxis correcta")
        except SyntaxError as e:
            check(False, f"actualizar_datos.py — error de sintaxis: {e}")
    else:
        check(False, "actualizar_datos.py existe")


def validate_documentation():
    """Valida que los archivos de documentación existan."""
    print("\n[DOCS] Documentacion:")
    check((BASE_DIR / "PLAN.md").exists(), "PLAN.md existe")
    check((BASE_DIR / "AGENTS.md").exists(), "AGENTS.md existe")


def main():
    """Ejecuta todas las validaciones."""
    print("=" * 50)
    print("WoW Explorer — Validador")
    print("=" * 50)

    validate_database()
    validate_project_files()
    validate_python_script()
    validate_documentation()

    print("\n" + "=" * 50)
    if ERRORS:
        print(f"[FAIL] {len(ERRORS)} error(es) encontrados")
        sys.exit(1)
    else:
        print("[OK] TODO OK — todas las validaciones pasaron")
        sys.exit(0)


if __name__ == "__main__":
    main()
