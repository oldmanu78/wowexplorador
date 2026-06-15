# WoW Explorador

Sitio personal de World of Warcraft para seguimiento semanal de Mythic+, personajes de Quel'Thalas US y rutas de mazmorras. La app genera HTML estático con Next.js y lee una base SQLite producida por el pipeline Python.

## Diseño

Tema **Horda-UNO**: paleta cálida atmosférica con fondos negro cálido (#070504), acentos en rojo sangre, brasa y dorado. Tipografía Cinzel (títulos épicos) + Inter (cuerpo). Background con gradientes radiales atmosféricos y grid sutil dorado.

El emblema de la Horda se renderiza con `HordeEmblem` usando la máscara PNG `public/images/horde-emblem-mask.png`, derivada de la silueta correcta entregada por el usuario. Ya no se usa `public/horde-crest.svg`.

## Stack

- Next.js 16 App Router con `output: "export"`
- TypeScript estricto
- Tailwind CSS v4 con tema Horda-UNO
- Prisma v7 + `@prisma/adapter-better-sqlite3`
- SQLite en `prisma/wow.db`
- Python 3 stdlib para ingesta de Raider.io, Blizzard API y Armory
- GitHub Actions para build y despliegue a GitHub Pages

## Registro de Correcciones

### 2026-06-15: branding Horda

- Se reemplazó el símbolo incorrecto tipo estrella por la silueta real de la Horda.
- Se agregó `src/components/ui/HordeEmblem.tsx` para adaptar el color del emblema al frontend mediante máscara CSS.
- Se actualizó el header, footer y hero principal para reutilizar el mismo emblema.

### 2026-06-15: mapas e iconos WoW

- Se incorporaron iconos de clase y raza desde la maqueta nueva ubicada en `D:\Projects\FRONTEND\UNO`.
- Se agregaron `src/lib/wow-assets.ts` y `src/components/ui/WowIcon.tsx`.
- La galería y el hero de personaje ahora muestran iconos visuales de clase/raza cuando existe la información.
- Se reemplazaron placeholders de mapas por `DungeonMapPreview`, una vista generada consistente para heroes de mazmorra y cards de ruta.
- Se corrigieron URLs de Keystone Guru en el pipeline para evitar rutas falsas tipo `/route/aa-pug-1`.

### 2026-06-15: paneles de personaje

- `StatsPanel` muestra porcentaje entre paréntesis para estadísticas porcentuales.
- `GearPanel` fue reorganizado como equipo actual: icono, slot, ilvl, calidad, tier, gemas y encantamientos.
- `MonedasPanel` ahora puede mostrar monedas/tokens actuales desde `armory.currencies` y conserva el seguimiento manual con `localStorage`.
- `scripts/actualizar_datos.py` consulta el endpoint de monedas de Blizzard cuando hay OAuth y deja fallback defensivo desde Armory.

## Comandos

```bash
npm run dev
npm run lint
npm run validate
npm run build
npm run seed
```

`npm run seed` ejecuta `scripts/actualizar_datos.py` y luego `prisma generate`.

## Pipeline de datos

```bash
python scripts/actualizar_datos.py
```

El script:

- obtiene afijos y perfiles desde Raider.io;
- usa Blizzard OAuth para el precio del token cuando hay secrets;
- usa Blizzard API para stats y monedas/tokens de personaje cuando hay secrets;
- consulta Armory como fallback de estadísticas;
- escribe primero en `prisma/wow.tmp.db`;
- reemplaza `prisma/wow.db` solo cuando toda la ingesta terminó correctamente.

Variables opcionales:

```bash
BLIZZARD_CLIENT_ID
BLIZZARD_CLIENT_SECRET
```

## Despliegue

El workflow `.github/workflows/deploy.yml` corre en:

- push a `main`;
- cron semanal martes 15:00 UTC;
- ejecución manual desde GitHub.

La publicación usa GitHub Pages Actions con artifact `out/`. El sitio vive bajo `/wowexplorador`, por eso `next.config.ts` define `basePath`, `assetPrefix` y `NEXT_PUBLIC_BASE_PATH`.

## Verificación actual

Última verificación local:

```bash
npm run lint
npx tsc --noEmit
python -m py_compile scripts\actualizar_datos.py scripts\validate.py
npm run validate
npm audit --audit-level=moderate
```

Nota: el build local completo puede fallar en este equipo por bloqueo de permisos de Windows sobre `.next` o por descarga de Google Fonts bajo sandbox. GitHub Actions no depende del directorio `.next` local y ejecuta el build desde un workspace limpio.
