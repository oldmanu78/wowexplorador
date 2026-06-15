# PLAN: WoW Explorer — Next.js + SQLite + Horda

## Visión General

Migración del sitio estático WoW Explorer (HTML/CSS/JS puro + Python + GitHub Pages) a una arquitectura moderna con **Next.js**, **Prisma + SQLite**, **Tailwind CSS** y tema visual de la **Horda de World of Warcraft**. Preparado desde el inicio para **multiusuario** y futura migración a servidor con PostgreSQL.

## Stack Tecnológico

| Capa | Tecnología | Propósito |
|---|---|---|
| Framework | Next.js 16 (App Router) | SSG + futuro SSR/ISR |
| Lenguaje | TypeScript estricto | Tipado seguro, mantenible |
| CSS | Tailwind v4 | Tema Horda custom, rápido de iterar |
| Base de datos | SQLite (fase 1) → PostgreSQL (fase 2) | File-based ahora, server después |
| ORM | Prisma | Abstracción de base de datos, migraciones |
| Pipeline datos | Python 3.x (stdlib) | Fetch de APIs de WoW |
| Interactividad | React Server Components + Client Components | Mínimo JS en cliente |
| Despliegue | GitHub Actions → GitHub Pages | $0 hasta migrar a servidor |

## Estructura de Archivos

```
wowexplorador/
├── src/
│   ├── app/
│   │   ├── layout.tsx              → Root layout (Header Horda, Footer, fuentes)
│   │   ├── page.tsx                → Dashboard semanal (página principal)
│   │   ├── globals.css             → Tailwind + tema Horda
│   │   ├── personajes/
│   │   │   ├── page.tsx            → Galería de todos los personajes
│   │   │   └── [slug]/
│   │   │       └── page.tsx        → Página individual de personaje (SSG)
│   │   └── rutas/
│   │       └── page.tsx            → Mazmorras y rutas M+
│   ├── components/
│   │   ├── ui/                     → Sistema de diseño base
│   │   │   ├── Card.tsx            → Contenedor con bordes Horda
│   │   │   ├── Badge.tsx           → Etiquetas de clase/rol/score
│   │   │   ├── Tabs.tsx            → Sistema de pestañas horizontal
│   │   │   ├── ProgressBar.tsx     → Barras de progreso (raid, crests)
│   │   │   └── ScoreDisplay.tsx    → Score M+ con color por rango
│   │   ├── layout/                 → Componentes de layout
│   │   │   ├── Header.tsx          → Header con Horde crest + nav
│   │   │   └── Footer.tsx          → Footer con créditos
│   │   ├── characters/            → Paneles de personaje (7 tabs)
│   │   │   ├── CharacterCard.tsx   → Card para galería
│   │   │   ├── HeroSection.tsx     → Cabecera del personaje
│   │   │   ├── StatsPanel.tsx      → Tab 1: Estadísticas
│   │   │   ├── MonedasPanel.tsx    → Tab 2: Monedas (cliente + localStorage)
│   │   │   ├── GearPanel.tsx       → Tab 3: Gear & BiS
│   │   │   ├── DungeonPanel.tsx    → Tab 4: Scores por mazmorra
│   │   │   ├── RunsPanel.tsx       → Tab 5: Últimas carreras M+
│   │   │   ├── RaidPanel.tsx       → Tab 6: Progreso de raid
│   │   │   └── NotesPanel.tsx      → Tab 7: Notas (cliente + localStorage)
│   │   ├── weekly/                 → Componentes del dashboard
│   │   │   ├── AffixDisplay.tsx    → Afijos de la semana
│   │   │   ├── EventCard.tsx       → Evento semanal
│   │   │   ├── WorldBossCard.tsx   → Jefe del mundo
│   │   │   ├── TokenPrice.tsx      → Precio del token
│   │   │   ├── NewsFeed.tsx        → Noticias de WoW
│   │   │   ├── InvasionList.tsx    → Invasiones activas
│   │   │   └── RankingTable.tsx    → Ranking M+ (Tank/DPS/Healer)
│   │   └── routes/                 → Componentes de rutas
│   │       ├── DungeonTabs.tsx     → Tabs de mazmorras
│   │       ├── RouteCard.tsx       → Card de ruta individual
│   │       └── DungeonHero.tsx     → Hero de mazmorra con info
│   ├── lib/
│   │   ├── db.ts                   → Cliente Prisma singleton
│   │   ├── utils.ts                → Funciones helper (colores, formateo)
│   │   └── constants.ts            → Constantes de WoW
│   └── generated/prisma/           → Generado por Prisma (no editar)
├── prisma/
│   ├── schema.prisma               → Modelos de base de datos
│   └── wow.db                      → Base de datos SQLite (generada)
├── scripts/
│   ├── actualizar_datos.py         → Pipeline: APIs → SQLite
│   ├── seed.ts                     → Seed de datos iniciales
│   └── validate.py                 → Validador de datos
├── public/
│   └── images/
│       └── horde-emblem-mask.png   → Máscara del símbolo de la Horda
│   └── images/                     → Imágenes estáticas
├── .github/workflows/
│   └── deploy.yml                  → CI/CD: fetch data → build → deploy
├── PLAN.md                         → Este archivo
├── AGENTS.md                       → Documentación del proyecto
├── next.config.ts                  → Configuración de Next.js
├── tailwind.config.ts              → Tema personalizado Horda
├── package.json                    → Dependencias
└── tsconfig.json                   → Configuración TypeScript
```

## Esquema de Base de Datos (Prisma)

### Modelos

```
User (1) ────< Character (N) ────< MythicRun (N)
                                    └── Dungeon (1)

WeeklySnapshot (1 por semana)

Dungeon (1) ────< Route (N)

News (independiente)
Invasion (independiente)
```

### Relaciones clave

- **User → Character**: Un usuario puede tener múltiples personajes
- **Character → MythicRun**: Un personaje tiene muchas carreras M+
- **Dungeon → Route**: Una mazmorra tiene múltiples rutas
- **MythicRun → Dungeon**: Cada carrera referencia una mazmorra

### Diseño multiusuario

El schema soporta múltiples usuarios desde el inicio. Cada personaje pertenece a un usuario. En fase 1 (estático), los usuarios se configuran en `tracked_users.json`. En fase 2 (servidor), los usuarios se registran y gestionan sus personajes via API.

## Pipeline de Datos

```
Python (GH Actions, semanal):
  1. Lee tracked_users.json
  2. Para cada personaje:
     a. Raider.io API → perfil completo (scores, runs, raid, gear)
     b. Blizzard API OAuth → token price
     c. Blizzard API → stats (fallback: Armory scrape)
  3. Calcula world boss + evento semanal (por fecha)
  4. Escribe todo a SQLite (prisma/wow.db)

Next.js (build time):
  1. Prisma lee SQLite
  2. getStaticProps/generateStaticParams pre-renderiza todas las páginas
  3. next build → out/ (HTML estático)

Deploy:
  1. GitHub Actions hace commit de SQLite
  2. Build de Next.js
  3. Push a gh-pages
```

## Diseño Visual: Tema Horda-UNO

### Paleta de colores

| Token | Color | Uso |
|---|---|---|
| `bg` | `#070504` | Fondo principal (negro cálido) |
| `bg-2` | `#120807` | Fondo secundario |
| `surface` | `rgba(21,14,12,0.84)` | Cards, paneles (semi-transparente) |
| `surface-strong` | `#19100d` | Superficie opaca |
| `iron` | `#2c2420` | Hierro oscuro |
| `blood` | `#8f1513` | Rojo sangre profundo |
| `blood-2` | `#c32620` | Rojo sangre brillante |
| `ember` | `#f05a28` | Naranja brasa |
| `brass` | `#c49445` | Bronce/latón |
| `gold` | `#f0c35a` | Acentos, hover, títulos |
| `bone` | `#f3e7d0` | Texto principal (blanco cálido) |
| `muted` | `#bcae96` | Texto secundario |
| `line` | `rgba(240,195,90,0.28)` | Borde dorado |

### Elementos visuales

- **Header**: Sticky con backdrop blur (16px), emblema Horda por máscara PNG + navegación uppercase
- **Background**: Gradientes radiales atmosféricos rojo/naranja + grid sutil dorado (46px, 3.5% opacidad)
- **Cards**: Bordes dorados, hover con lift (-translate-y-0.5), sombras profundas con glow
- **Tabs**: Scroll horizontal, active con subrayado gold, focus visible dorado
- **Score M+**: Naranja ≥3k, morado ≥2k, azul ≥1.5k, verde ≥1k, blanco >0
- **Roles**: Tank `#4488ff`, Healer `#44cc88`, DPS `#ff4444`
- **Badges de clase**: Color específico de cada clase de WoW

### Tipografía
- **Cinzel** (serif): Títulos, estilo épico/fantasía (weights 700/800/900)
- **Inter** (sans-serif): Cuerpo de texto, moderno y legible (weights 400-800)
- Fluid sizing con `clamp()` para responsive perfecto

## Tabs de Personaje (7 unificadas para todos)

| # | Tab | Tipo | Datos |
|---|---|---|---|
| 1 | Stats | Server | Score M+, ilvl, stats secundarias (Blizzard API → fallback Armory) |
| 2 | Monedas | Cliente | Valorstones, crests, gold — localStorage con precarga |
| 3 | Gear & BiS | Server | 17 slots con BiS, wowhead links, prioridad, tier set |
| 4 | Mazmorras | Server | Scores por dungeon, timer, color por rango |
| 5 | M+ Runs | Server | Últimas carreras con nivel, dungeon, score |
| 6 | Raid | Server | Progreso Normal/Heroic/Mythic, jefes derrotados |
| 7 | Notas | Cliente | Notas editables por dungeon (localStorage) |

## Fases de Implementación

### Fase 1 — MVP Estático (actual)
- [x] Schema Prisma + SQLite
- [x] Proyecto Next.js configurado
- [x] Tailwind tema Horda-UNO (rediseño 2026-06-14)
- [x] Dashboard semanal con Hero + MetricsBar
- [x] Galería de personajes
- [x] Página individual con 7 tabs
- [x] Página de rutas
- [x] Pipeline Python → SQLite
- [x] CI/CD GitHub Pages
- [x] Auditoría técnica aplicada: lint limpio, audit limpio, stats/gear visibles, pipeline atómico

### Fase 2 — Multiusuario
- [ ] tracked_users.json configurable
- [ ] Build genera páginas para N usuarios
- [ ] Cada usuario tiene su dashboard

### Fase 3 — Servidor (VPS/Railway/Vercel)
- [ ] PostgreSQL en vez de SQLite
- [ ] API routes de Next.js
- [ ] Autenticación (NextAuth)
- [ ] Registro de usuarios
- [ ] Gestión dinámica de personajes

### Fase 4 — Features Avanzadas
- [ ] Historial de scores por temporada
- [ ] Gráficas de progreso
- [ ] Comparativas entre personajes
- [ ] Achievements

## Colores de Clase de WoW

| Clase | Color |
|---|---|
| Death Knight | `#C41E3A` |
| Demon Hunter | `#A330C9` |
| Druid | `#FF7C0A` |
| Evoker | `#33937F` |
| Hunter | `#AAD372` |
| Mage | `#3FC7EB` |
| Monk | `#00FF98` |
| Paladin | `#F48CBA` |
| Priest | `#FFFFFF` |
| Rogue | `#FFF468` |
| Shaman | `#0070DD` |
| Warlock | `#8788EE` |
| Warrior | `#C69B3A` |

## Scoring M+ — Colores por Rango

| Score Mínimo | Color |
|---|---|
| 3000 | `#ff8000` (naranja) |
| 2000 | `#a335ee` (morado) |
| 1500 | `#0070dd` (azul) |
| 1000 | `#1eff00` (verde) |
| 0 | `#ffffff` (blanco) |

## APIs Externas

| API | Auth | Endpoint | Uso |
|---|---|---|---|
| Raider.io | User-Agent | `/api/v1/characters/profile` | Perfiles, scores, runs, raid |
| Raider.io | User-Agent | `/api/v1/mythic-plus/affixes` | Afijos semanales |
| Blizzard OAuth | Client ID + Secret | `POST /oauth/token` | Token de acceso |
| Blizzard API | Bearer token | `/data/wow/token/index` | Precio del token |
| Blizzard API | Bearer token | `/profile/wow/character/.../status` | Stats de personaje |
| Armory (scrape) | User-Agent | HTML scrape | Fallback para stats |

## Convenciones de Código

### TypeScript
- Nombres de archivos: PascalCase para componentes, camelCase para utilities
- Interfaces con prefijo `I` (ej: `ICharacter`)
- Props de componentes con tipo exportado (ej: `CardProps`)
- Server Components por defecto, Client Components solo cuando hay interactividad

### CSS/Tailwind
- Tema Horda-UNO via `@theme` en globals.css (paleta cálida atmosférica)
- Componentes usan clases Tailwind, no CSS modules
- Clases utilitarias con `cn()` para merge condicional
- Gradientes radiales para profundidad atmosférica
- Hover effects con transiciones suaves (180ms)
- Focus visible dorado para accesibilidad

### Python (pipeline)
- Solo stdlib (sin imports externos)
- Funciones con nombres en español (ej: `obtener_perfiles_raiderio`)
- Errores con try/except y fallback graceful

## Despliegue

### GitHub Actions (deploy.yml)

```yaml
Triggers:
  - push a main
  - schedule: martes 15:00 UTC
  - workflow_dispatch

Jobs:
  1. Setup Python + Node.js
  2. Ejecutar actualizar_datos.py (con secrets de Blizzard)
  3. npx prisma generate + db push
  4. npm run build (next build → out/)
  5. Deploy a GitHub Pages (rama gh-pages)
```

### GitHub Pages Config
- Base path: `/wowexplorador`
- Rama: `gh-pages`
- CNAME: (opcional, dominio personalizado)
