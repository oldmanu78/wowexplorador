# WoW Explorador

Sitio personal de World of Warcraft para seguimiento semanal de Mythic+, personajes de Quel'Thalas US y rutas de mazmorras. La app genera HTML estático con Next.js y lee una base SQLite producida por el pipeline Python.

## Diseño

Tema **Horda-UNO**: paleta cálida atmosférica con fondos negro cálido (#070504), acentos en rojo sangre, brasa y dorado. Tipografía Cinzel (títulos épicos) + Inter (cuerpo). Background con gradientes radiales atmosféricos y grid sutil dorado.

## Stack

- Next.js 16 App Router con `output: "export"`
- TypeScript estricto
- Tailwind CSS v4 con tema Horda-UNO
- Prisma v7 + `@prisma/adapter-better-sqlite3`
- SQLite en `prisma/wow.db`
- Python 3 stdlib para ingesta de Raider.io, Blizzard API y Armory
- GitHub Actions para build y despliegue a GitHub Pages

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
npm run validate
npm audit --audit-level=moderate
```

Build verificado en una copia limpia del repo porque el directorio generado `.next` del workspace original quedó bloqueado por permisos de Windows:

```bash
npm ci
npm run build
```

Resultado: build correcto, 13 páginas estáticas generadas.
