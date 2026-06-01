# AGENTS.md — WoW Explorer (Next.js)

> Sitio personal de World of Warcraft. Stack: Next.js + Prisma + SQLite + Tailwind.
> Repo: github.com/oldmanu78/wowexplorador | Sitio: oldmanu78.github.io/wowexplorador

## 📁 Estructura

```
src/
├── app/
│   ├── layout.tsx                # Layout raíz: Header Horda + Footer + fuentes
│   ├── page.tsx                  # Dashboard semanal (afijos, evento, token, boss, ranking)
│   ├── globals.css               # Tailwind + tema Horda + clases custom
│   ├── personajes/
│   │   ├── page.tsx              # Galería de personajes (SSG)
│   │   └── [slug]/
│   │       └── page.tsx          # Página individual de personaje (SSG, 7 tabs)
│   └── rutas/
│       └── page.tsx              # Mazmorras + rutas M+ (SSG)
├── components/
│   ├── ui/                       # Sistema de diseño: Card, Badge, Tabs, ProgressBar
│   ├── layout/                   # Header.tsx (Horde crest), Footer.tsx
│   ├── characters/               # Paneles: Stats, Monedas, Gear, Dungeon, Runs, Raid, Notes
│   ├── weekly/                   # Afijos, Evento, Token, Boss, Noticias, Invasiones, Ranking
│   └── routes/                   # DungeonTabs, RouteCard, DungeonHero
├── lib/
│   ├── db.ts                     # Cliente Prisma singleton
│   ├── utils.ts                  # SC(), getClassColor(), formatGold(), etc.
│   └── constants.ts              # Clases de WoW, colores, roles, dungeons
└── generated/prisma/             # Prisma client (auto-generado, no tocar)

prisma/
├── schema.prisma                 # 8 modelos: User, Character, WeeklySnapshot, Dungeon, Route, News, Invasion, MythicRun
└── wow.db                        # SQLite (generado por pipeline)

scripts/
├── actualizar_datos.py           # Pipeline Python: APIs → SQLite
├── seed.ts                       # Seed de datos (opcional)
└── validate.py                   # Validador de estructura de datos

public/
├── horde-crest.svg               # SVG del emblema de la Horda
└── images/                       # Imágenes estáticas

.github/workflows/
└── deploy.yml                    # CI/CD: fetch data + build + deploy a Pages
```

## 🏗 Stack

- **Next.js 16** (App Router, `output: 'export'` para GitHub Pages)
- **TypeScript** estricto
- **Tailwind v4** con tema Horda custom
- **Prisma + SQLite** (SQLite ahora, PostgreSQL después — solo cambiar provider)
- **Python 3.x** (stdlib, sin dependencias externas) para pipeline de datos
- **GitHub Actions** para CI/CD semanal

## 🔑 Arquitectura

### Data Flow
```
GitHub Actions (cron semanal martes 15:00 UTC)
  ↓
actualizar_datos.py
  ├── Raider.io API → perfiles, scores, runs, raid gear
  ├── Blizzard API OAuth → token price + stats personaje
  │   └── fallback: Armory Blizzard scrape
  ├── Cálculo por fecha → world boss, evento semanal
  └── Escribe a SQLite (prisma/wow.db)
  ↓
Next.js build (SSG)
  ├── Prisma lee SQLite en build time
  ├── getStaticProps / generateStaticParams
  └── out/ → HTML estático
  ↓
GitHub Pages (rama gh-pages)
```

### Frontend Data Loading
- **Server Components**: La mayoría de los componentes leen datos de SQLite via Prisma en build time
- **Client Components**: Solo para interactividad del usuario:
  - `MonedasPanel`: edición de monedas con localStorage
  - `NotesPanel`: notas por dungeon con localStorage
  - `CountdownTimer`: cuenta regresiva al reset semanal

### Estados de UI
Cada componente maneja 3 estados:
1. **Loading**: skeleton/spinner mientras se cargan datos (en cliente)
2. **Success**: datos renderizados normalmente
3. **Error/Empty**: mensaje descriptivo si no hay datos

## 🎨 Tema Horda

### Colores (Tailwind v4 @theme)
```css
--color-horda-bg: #0a0a0a;
--color-horda-surface: #1a1a1a;
--color-horda-border: #2a1a1a;
--color-horda-gold: #F8B700;
--color-horda-red: #8B0000;
--color-horda-red-bright: #C41E3A;
--color-horda-text: #ccd0e0;
--color-horda-muted: #6b7280;
```

### Fuentes
- `Cinzel` (Google Font): títulos, serif con estilo épico
- `Exo 2` (Google Font): cuerpo de texto, sans-serif
- Cargadas via `next/font` en layout.tsx

### Layout
- Header fijo con Horde crest SVG + navegación
- Footer con créditos y links
- Background oscuro con watermark sutil de la Horda

## 👤 Personajes Trackeados

| Nombre | Clase/Spec | Rol | Slug |
|---|---|---|---|
| Kreathor | Death Knight Blood | TANK | kreathor |
| Muchufaza | Monk Brewmaster | TANK | muchufaza |
| Czernobög | Druid Guardian | TANK | czernobog |
| Oldkreeper | Shaman Elemental | DPS | oldkreeper |
| Redguardïan | Paladin Retribution | DPS | redguardian |
| Krëeper | Warrior Protection | TANK | kreeper |
| Nösferätü | Demon Hunter Vengeance | TANK | nosferatu |

Reino: Quel'Thalas (US)

## 🗺️ Mazmorras Midnight S1

### Nuevas
- Algeth'ar Academy (AA) — 4 jefes — 35 min
- Maisara Caverns (MC) — 4 jefes — 33 min
- Nexus-Point Xenas (NPX) — 4 jefes — 35 min
- Windrunner Spire (WRS) — 4 jefes — 34 min

### Clásicas
- Magister's Terrace (MT) — 4 jefes — 32 min
- Pit of Saron (POS) — 3 jefes — 30 min
- Seat of the Triumvirate (SEAT) — 4 jefes — 32 min
- Skyreach (SKY) — 4 jefes — 28 min

## 📝 Tabs de Personaje (7, unificadas)

| # | Nombre | Componente | Tipo | Descripción |
|---|---|---|---|---|
| 1 | Stats | `StatsPanel` | Server | Score M+, ilvl, stats secundarias |
| 2 | Monedas | `MonedasPanel` | Cliente | Valorstones, crests, gold (localStorage) |
| 3 | Gear & BiS | `GearPanel` | Server | 17 slots BiS con wowhead links |
| 4 | Mazmorras | `DungeonPanel` | Server | Scores por dungeon con colores |
| 5 | M+ Runs | `RunsPanel` | Server | Últimas carreras M+ |
| 6 | Raid | `RaidPanel` | Server | Progreso de raid Normal/Heroic/Mythic |
| 7 | Notas | `NotesPanel` | Cliente | Notas editables por dungeon |

## 🌐 APIs

- **Raider.io** (sin auth, User-Agent requerido): perfiles completos, scores, affixes
- **Blizzard API OAuth** (`BLIZZARD_CLIENT_ID` + `BLIZZARD_CLIENT_SECRET`): token price + stats
- **Armory Blizzard scrape** (sin auth): fallback para stats

## ⚙️ Comandos

```bash
npm run dev          # Desarrollo con HMR
npm run build        # Build estático → out/
npm run lint         # ESLint
npm run seed         # Seed datos a SQLite

python scripts/actualizar_datos.py   # Fetch datos → SQLite
python scripts/validate.py           # Validar datos
```

## 🚨 Notas Técnicas

- **Raider.io gear.stats NO existe**: Usar Blizzard API o Armory scrape para stats secundarias
- **Raider.io active_spec_name**: Está en raíz del JSON, NO en datos.spec.name
- **Clave raid S1**: `tier-mn-1`, season: `season-mn-1`
- **World boss rotación**: 4 semanas: Lu'ashal → Cragpine → Thorm'belan → Predaxas
- **Reset semanal**: NA, martes 15:00 UTC
- **Para migrar a PostgreSQL**: Cambiar `provider: "sqlite"` → `"postgresql"` en schema.prisma + DATABASE_URL en .env
- **Auditoría 2026-05-28 aplicada**: ESLint queda limpio, `npm audit` queda sin vulnerabilidades moderadas, Stats lee el JSON real de Armory, Gear se alimenta desde Raider.io, las imágenes pasan por `NEXT_PUBLIC_BASE_PATH` y el pipeline escribe primero `prisma/wow.tmp.db` antes de reemplazar `prisma/wow.db`.
- **Modernización 2026-06-01 aplicada**: CI/CD ahora ejecuta `npm run lint`, `npm run validate` y `npm audit --audit-level=moderate` antes del build; `Tabs` incluye roles ARIA, navegación por teclado y focus visible; se quitaron emojis estructurales de roles/ranking/monedas/rutas en favor de texto y swatches; colores de score/rol se centralizan en `constants.ts`/`utils.ts`; se eliminó código muerto duplicado en `obtener_stats_armory`.
- **Build local**: si `.next` queda bloqueado por permisos de Windows, verificar en una copia limpia o usando un workspace sin `.next`; `.next/` está ignorado y no afecta GitHub Actions.
