# AGENTS.md — WoW Explorador

> Sitio estático personal de World of Warcraft. Desplegado en GitHub Pages.
> Repo: github.com/oldmanu78/wowexplorador | Sitio: oldmanu78.github.io/wowexplorador

## 📁 Estructura

```
wowexplorador-temp/
├── index.html               ← Panel semanal (afijos, evento, token, world boss, invasiones, noticias, ranking)
├── personajes.html          ← Cards de 7 personajes (datos desde datos.json)
├── rutas.html               ← 8 mazmorras con tabs + rutas desde datos.json
├── kreathor.html            ← Perfil principal — 14 tabs (Blood DK)
├── muchufaza.html           ← Template genérico (Monk Brewmaster Tank)
├── czernobog.html           ← Template genérico (Druid Guardian Tank)
├── oldkreeper.html          ← Template genérico (Shaman Elemental DPS)
├── redguardian.html         ← Template genérico (Paladin Retribution DPS)
├── kreeper.html             ← Template genérico (Warrior Protection Tank)
├── nosferatu.html           ← Template genérico (DH Vengeance Tank)
├── datos.json               ← Fuente ÚNICA de datos — generado por Python
├── actualizar_datos.py      ← Script de actualización semanal (GH Actions)
├── gen_chars.py             ← Generador de páginas de personajes secundarios
├── validate.py              ← Validador de datos.json + scripts + HTML
├── js/
│   └── character-common.js  ← JS compartido entre las 7 páginas de personajes
├── css/
│   └── fonts.css            ← Fuentes compartidas (Cinzel + Exo 2 + Nunito)
├── .github/workflows/
│   └── actualizador.yml     ← Cron semanal + workflow_dispatch
├── .gitignore               ← Ignora __pycache__
└── AGENTS.md                ← Este archivo
```

## 🏗 Arquitectura

**Stack**: HTML/CSS/JS puro + Python + GitHub Pages + GitHub Actions

No hay framework, bundler, ni servidor. Cada archivo HTML es completamente autónomo (CSS + JS inline, con shared.js externo para funciones comunes de personajes).

### Pipeline de datos (NUEVO — mayo 2026)

```
GitHub Actions (cron semanal, martes ~14:00 UTC O workflow_dispatch)
   ↓
actualizar_datos.py
   ├── Raider.io API (con User-Agent)   → afijos M+, perfiles completos de 7 personajes
   ├── Armory Blizzard (scrape)         → stats detallados de 7 personajes (sin OAuth)
   ├── Blizzard API (OAuth2)            → precio del Token (usa secrets)
   ├── obtener_evento_semana()          → rotación calculada por fecha
   ├── obtener_jefe_de_mundo()          → rotación calculada por fecha
   ├── obtener_rutas_midnight()         → rutas hardcodeadas actualizadas con tipo/desc/thumb
   ├── NOTICIAS_DEFAULT                 → lista estática, edición manual
   ├── INVASIONES_DEFAULT               → lista estática, edición manual
   └── RANKING_DEFAULT                  → personajes trackeados con roles correctos
   ↓
   personajes_data: {
     "Kreathor": {
       "rio": { <perfil Raider.io> },        → M+ scores, runs, raid, gear
       "blizzard": {
         "stats": { ilvl, items, stats: { strength, stamina, crit, haste, mastery, ... } },
         "monedas": {}  (pendiente de API)
       }
     },
     ... (7 personajes)
   }
   ↓
escribe datos.json (con personajes_data)
   ↓
commit + push → GitHub Pages deploy

Frontend (10 HTML independientes):
   ├── index.html             → fetch('datos.json') — layout 2 columnas
   ├── personajes.html        → fetch('datos.json') — 7 personajes con datos de Raider.io
   ├── rutas.html             → fetch('datos.json') — mazmorras desde datos.json
   └── 7 páginas de chars     → fetch('datos.json') + localStorage para monedas/notas
```

**IMPORTANTE**: El frontend NUNCA hace fetch directo a Raider.io. Todos los datos vienen de `datos.json` generado por Python.

## 🔑 Convenciones de código

### HTML
- Cada página usa `css/fonts.css` para Google Fonts (ya no carga @import directo)
- `kreathor.html`: CSS minificado inline
- 6 chars: CSS minificado inline (generado por `gen_chars.py`)
- `index.html`, `personajes.html`, `rutas.html`: CSS no minificado
- Las páginas de personajes cargan `js/character-common.js` para funciones compartidas
- Variables de personaje se pasan como `window.CHAR_PX`, `window.CHAR_NAME`, `window.CHAR_URL`, `window.CHAR_SPEC`
- Idioma: `lang="es"`, charset UTF-8

### CSS
- Paleta: fondo `#07080f`/`#0e0f1a`, texto `#ccd0e0`, acentos `#F8B700` (gold)
- Fuentes: `Cinzel` (títulos) + `Exo 2` (cuerpo) en páginas detalladas + `Nunito` (rutas)
- Responsive: `@media (max-width: 700px)` en todas las páginas

### JavaScript (js/character-common.js)
- Vanilla JS puro, sin frameworks, sin modules
- Funciones globales: `ST(id)`, `SC(s)`, `nextReset()`, `tick()`, `renderHero()`, `renderStats()`, `renderMonedas()`, `renderMP()`, `renderRaid()`, `renderDG()`, `calcU()`
- Checklist removido (mayo 2026)
- Stats se cargan desde `datos.json` (personajes_data.blizzard.stats) o fallback a Raider.io
- Monedas: tracker editable con localStorage, precarga desde Blizzard si disponible
- Contador regresivo: reset semanal NA (martes 15:00 UTC)
- Toda inicialización envuelta en try-catch para no bloquear loadData()
- Datos de Raider.io vienen del rio en datos.json, no de fetch en vivo

### Python
- Solo librería estándar (`urllib`, `json`, `datetime`, `base64`, `os`, `re`)
- Compatible con Python 3.x (sin type hints)
- `actualizar_datos.py`: usa Raider.io + Armory scrape + Blizzard API
- `gen_chars.py`: genera 6 páginas HTML desde template

## 🌐 APIs externas

| API | Dónde | Autenticación | Notas |
|---|---|---|---|
| **Raider.io** | `actualizar_datos.py` | Sin auth | User-Agent: Mozilla/5.0 requerido. Perfiles completos de 7 chars |
| **Armory Blizzard** | `actualizar_datos.py` | Sin auth | Scrapea `characterProfileInitialState` del HTML (server-side rendered) |
| **Blizzard API** | `actualizar_datos.py` | `BLIZZARD_CLIENT_ID` + `BLIZZARD_CLIENT_SECRET` | Solo token price. Stats via Armory en vez de API |
| **Keystone.guru** | `actualizar_datos.py` | N/A | Rutas hardcodeadas manualmente |

### ⚠️ Raider.io — campos importantes
- `active_spec_name` — spec activo (en raíz del JSON)
- `datos.spec?.name` — **NO existe**
- `mythic_plus_scores_by_season[0].scores.all` — score global
- `gear.item_level_equipped` — ilvl equipado
- `raid_progression['tier-mn-1']` — progreso raid Midnight S1
- `gear.stats` — **NO existe** en Raider.io (usar Armory para stats secundarios)

### ⚠️ Armory Blizzard — estructura de datos
- `window.characterProfileInitialState.character.stats` es un **dict** con keys: `basic`, `groups`, `overview`
- `groups` es un array de objetos con propiedad `stats[]` (cada stat tiene `slug`, `value`)
- `gear` tiene slots como keys directas: `head`, `shoulder`, `chest`, `weapon`, etc.
- `overview` contiene health y otros stats rápidos
- `itemLevelEquipped` a veces es null para personajes inactivos

## 🎨 Diseño

### Layout index.html
- Fondo oscuro + símbolo de la Horda en SVG inline
- 2 columnas (`grid-template-columns: 2fr 1fr`, colapsa a 1 col en móvil ≤900px)

### Paleta por clase de WoW
```
Death Knight: #C41E3A    Demon Hunter: #A330C9    Druid: #FF7C0A
Evoker: #33937F          Hunter: #AAD372          Mage: #3FC7EB
Monk: #00FF98            Paladin: #F48CBA         Priest: #FFFFFF
Rogue: #FFF468           Shaman: #0070DD          Warlock: #8788EE
Warrior: #C69B3A
```

### Score M+ colores
| Score | Color |
|---|---|
| ≥3000 | `#ff8000` |
| ≥2000 | `#a335ee` |
| ≥1500 | `#0070dd` |
| ≥1000 | `#1eff00` |
| >0 | `#ffffff` |

### Roles
- TANK: `#4488ff` | HEALER: `#44cc88` | DPS: `#ff4444`

## 👤 Personajes (Quel'Thalas · US)

| Nombre | Clase/Spec | Rol | Página | Notas |
|---|---|---|---|---|
| Kreathor | Death Knight Blood | TANK | `kreathor.html` | Principal, 14 tabs |
| Muchufaza | Monk Brewmaster | TANK | `muchufaza.html` | 11 tabs |
| Czernobög | Druid Guardian | TANK | `czernobog.html` | 11 tabs |
| Oldkreeper | Shaman Elemental | DPS | `oldkreeper.html` | 11 tabs |
| Redguardïan | Paladin Retribution | DPS | `redguardian.html` | 11 tabs |
| Krëeper | Warrior Protection | TANK | `kreeper.html` | 11 tabs |
| Nösferätü | Demon Hunter Vengeance | TANK | `nosferatu.html` | 11 tabs |

## 🗺️ Mazmorras Midnight S1

### Nuevas
- Algeth'ar Academy (AA) — Thaldraszus — 4 jefes — 35 min
- Maisara Caverns (MC) — Harandar — 4 jefes — 33 min
- Nexus-Point Xenas (NPX) — Voidstorm — 4 jefes — 35 min
- Windrunner Spire (WRS) — Eversong Woods — 4 jefes — 34 min

### Clásicas
- Magister's Terrace (MT) — Quel'Danas — 4 jefes — 32 min
- Pit of Saron (POS) — Icecrown — 3 jefes — 30 min
- Seat of the Triumvirate (SEAT) — Argus — 4 jefes — 32 min
- Skyreach (SKY) — Spires of Arak — 4 jefes — 28 min

### World Bosses (rotación semanal)
Semana 1: Lu'ashal → Semana 2: Cragpine → Semana 3: Thorm'belan → Semana 4: Predaxas
Temporada comenzó: martes 17 de marzo 2026, 15:00 UTC

### Raid Midnight S1
- Clave API: `tier-mn-1` (9 jefes)
- Season: `season-mn-1`

## ⚙️ GitHub Actions

Workflow: `.github/workflows/actualizador.yml`
- Ejecuta cada martes ~14:00 UTC (antes del reset de 15:00 UTC)
- También soporta `workflow_dispatch` para ejecución manual
- Ejecuta `python actualizar_datos.py`
- Hace commit + push de `datos.json`
- Secrets: `BLIZZARD_CLIENT_ID`, `BLIZZARD_CLIENT_SECRET`
- Variables de entorno: `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` (para compatibilidad)

## 💾 datos.json — Estructura completa

```json
{
  "afijos":        "Nombre1 - Nombre2 - Nombre3 - Nombre4",
  "evento":        "Timewalking: X | Bonus: Y",
  "ficha":         "123.456",
  "jefe":          "Nombre (Zona)",
  "rutas":         { "dungeon-slug": [{"nombre": "...", "url": "...", "tipo": "pug|high", "desc": "...", "thumb": null|"url"}] },
  "mazmorras":     { "dungeon-slug": { "nombre": "...", "tipo": "nueva|clasica", "sigla": "...", "jefes": N, ... } },
  "personajes":    [{ "nombre": "...", "urlNombre": "...", "pagina": "..." }],
  "noticias":      [{ "titulo": "...", "link": "...", "fecha": "DD/MM/YYYY", "fuente": "..." }],
  "invasiones":    [{ "zona": "...", "npcs": N, "recompensa": "..." }],
  "ranking_mas":   { "tank": [...], "dps": [...], "healer": [] },
  "personajes_data": {
    "Kreathor": {
      "rio": { <perfil Raider.io completo> },
      "blizzard": {
        "stats": { "ilvl": N, "items": {...}, "stats": {"strength": N, "stamina": N, "crit": N, "haste": N, ...} },
        "monedas": {}  (pendiente)
      }
    }
  },
  "actualizado": "D/M/YYYY"
}
```

### Notas
- `personajes_data` se genera en GH Actions (Raider.io + Armory). Sin secrets de Blizzard, `blizzard` tendrá pocos datos.
- `datos.json` es la **única fuente** para el frontend — no hay fetch en vivo a Raider.io desde el navegador.
- `validate.py` verifica la estructura completa de datos.json.

## 💾 localStorage — Keys y estructura

### Monedas (NUEVO — mayo 2026)
- `{px}_monedas` — dict con {valorstones: N, whelp: N, drake: N, wyrm: N, aspect: N, gold: N}
- Se precarga desde Blizzard API si no hay datos guardados localmente

### Crests
- `{px}_crests_{YYYY-MM-DD}` — crests semanales (dict {id: count})
- `{px}_crests_hist` — historial (array de 8 semanas máx)

### Notas
- `{px}_note_{dungeon_id}` — notas por mazmorra (string)

### Reset semanal
- Se calcula: próximo martes 15:00 UTC
- Keys se rotan automáticamente usando la fecha del reset

## 🚨 Bugs conocidos / historial

| Bug | Causa | Estado |
|---|---|---|
| `datos.spec?.name` undefined | API retorna `active_spec_name` en raíz | ✅ Fixeado |
| Progreso raid "Sin datos" | Claves incorrectas para S1 | ✅ Fixeado → `tier-mn-1` |
| Thumbnails rotos en rutas | Keystone.guru bloquea hotlink | ✅ Fixeado → placeholders |
| RSS Wowhead → 404 | URL del RSS cambió | ✅ Fixeado → datos estáticos |
| Ranking endpoint Raider.io | Endpoint cambió | ✅ Fixeado → ranking manual |
| `rankingData` duplicado en JS | Bloque repetido | ✅ Fixeado |
| Noticias hardcodeadas sobreescribían fetch | Orden de carga | ✅ Fixeado |
| Invasiones hardcodeadas en JS | No venían de datos.json | ✅ Fixeado |
| Roles incorrectos en ranking | Kreathor en DPS | ✅ Fixeado |
| `evento` = texto de afijos | Usaba Raider.io title | ✅ Fixeado → rotación por fecha |
| `cambiarRanking` usaba `event.target` | Inestable | ✅ Fixeado → parámetro btn |
| **Personajes no cargaban** (mayo 2026) | `const CHAR_PX` no accesible desde `window` | ✅ Fixeado → `window.CHAR_PX='kr'` |
| **Stats tab vacío** (mayo 2026) | Raider.io no tiene `gear.stats` | ✅ Fixeado → Armory Blizzard scrape |
| **tick() crasheaba** (mayo 2026) | `#countdown` eliminado con Checklist | ✅ Fixeado → guard null |
| **loadData() bloqueada** (mayo 2026) | Error en init paralizaba el script | ✅ Fixeado → try-catch por init |
| **JS duplicado** en 7 páginas | Código repetido | ✅ Fixeado → js/character-common.js |
| **Rutas duplicadas** | DUNGEONS array en HTML + Python | ✅ Fixeado → solo desde datos.json |
| **Sin tests** | Sin validación | ✅ Fixeado → validate.py |
| **CSS Google Fonts duplicado** | @import en cada página | ✅ Fixeado → css/fonts.css |
| **README vacío** | Sin documentación | ✅ Fixeado → README.md completo |
| **URL con espacio** | `"wow/ tier-sets"` | ✅ Fixeado |
| **Blizzard API stats fallaba** | URL encoding incorrecta | ✅ Fixeado → Armory scrape |
| **Personajes secundarios cargaban Kreathor** | `N` siempre `'Kreathor'` | ✅ Fixeado → window.CHAR_NAME |
| **GH Actions Node.js 20 deprecated** | Acciones antiguas | ✅ Fixeado → FORCE_NODE24 env |

## 🔧 Pendiente / Por mejorar

1. **Monedas desde Armory**: Las currencies no están en `characterProfileInitialState`. Pendiente encontrar endpoint público. Por ahora el tracker manual con localStorage funciona.
2. **ilvl=0 para personajes inactivos**: Oldkreeper, Redguardian, Nosferatu tienen ilvl 0 porque su gear no es parseable. El frontend muestra ilvl desde Raider.io como fallback.
3. **GH Actions Node.js 20 warning**: Solo informativo. Desaparecerá cuando `actions/checkout@v5` y `actions/setup-python@v6` estén disponibles.
4. **Segunda spec de personajes**: Datos de gear BiS listos por clase, falta toggle de spec en el frontend.
5. **Encantamientos, Builds, Rotación, Talentos**: Son placeholders "Próximamente" en las páginas generadas. Solo Kreathor tiene contenido completo.

## 📝 Tabs de personajes (orden actual)

**kreathor.html (14 tabs):**
Stats → Monedas → Gear & BiS → Encantamientos → Builds → Rotación → Mazmorras → Talentos → M+ Runs → Raid → Notas → Semana → Crests → Upgrades

**6 chars (11 tabs):**
Stats → Monedas → Gear & BiS → Encantamientos → Builds → Rotación → Mazmorras → Talentos → M+ Runs → Raid → Notas

## 📝 Flujo de trabajo para modificaciones

### Agregar nueva mazmorra
1. `actualizar_datos.py`: agregar en `DUNGEONS_METADATA` + `obtener_rutas_midnight()`
2. `datos.json` se regenerará automáticamente
3. `rutas.html` lo leerá de datos.json

### Cambiar personaje principal (kreathor.html)
- Las tabs están hardcodeadas en el HTML
- Los datos de BiS, encantamientos, talentos, rotación están inline
- Actualizar links de Wowhead cuando cambie el tier

### Regenerar páginas de personajes secundarios
```bash
python gen_chars.py
```

### Modificar función JS compartida
- Editar `js/character-common.js`
- Afecta a las 7 páginas de personajes

### Actualizar datos manualmente
```bash
python actualizar_datos.py    # genera datos.json (Raider.io + Armory)
python gen_chars.py           # regenera 6 chars si cambió el template
python validate.py             # valida todo
git add -A && git commit -m "..." && git push
```

### Disparar GH Actions manualmente
```
GitHub → Actions → Actualizador Semanal → Run workflow
```
Esto genera datos.json con Raider.io + Armory + Blizzard API (token price).
