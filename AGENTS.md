# AGENTS.md — WoW Explorador

> Sitio estático personal de World of Warcraft. Desplegado en GitHub Pages.
> Repo: github.com/oldmanu78/wowexplorador | Sitio: oldmanu78.github.io/wowexplorador

## 📁 Estructura

```
wowexplorador-temp/
├── index.html               ← Panel semanal (afijos, evento, token, world boss)
├── personajes.html          ← Cards de 7 personajes (datos en vivo Raider.io)
├── rutas.html               ← 8 mazmorras con tabs + rutas curadas + sección dinámica
├── kreathor.html            ← Perfil principal — 13 tabs completas (Blood DK)
├── muchufaza.html           ← Template genérico (Monk Brewmaster Tank)
├── czernobog.html           ← Template genérico (Druid Guardian Tank)
├── oldkreeper.html          ← Template genérico (Shaman Elemental DPS)
├── redguardian.html         ← Template genérico (Paladin Retribution DPS)
├── kreeper.html             ← Template genérico (Warrior Protection Tank)
├── nosferatu.html           ← Template genérico (DH Vengeance Tank)
├── datos.json               ← Datos semanales generados por Python
├── actualizar_datos.py      ← Script de actualización semanal (GH Actions)
├── gen_chars.py             ← Generador de páginas de personajes secundarios
├── .github/workflows/
│   └── actualizador.yml     ← Cron semanal que ejecuta actualizar_datos.py
└── AGENTS.md                ← Este archivo
```

## 🏗 Arquitectura

**Stack**: HTML/CSS/JS puro + Python + GitHub Pages + GitHub Actions

No hay framework, bundler, ni servidor. Cada archivo HTML es completamente autónomo (CSS + JS inline).

```
GitHub Actions (cron semanal, martes ~14:00 UTC)
   ↓
actualizar_datos.py
   ├── Raider.io API          → afijos M+, evento semanal
   ├── Blizzard API           → precio del Token (requiere secrets)
   ├── obtener_rutas_midnight() → rutas hardcodeadas (Keystone.guru es SPA)
   └── obtener_jefe_de_mundo()  → rotación calculada por fecha
   ↓
escribe datos.json
   ↓
commit + push → GitHub Pages deploy

Frontend (10 HTML independientes):
   ├── index.html       → fetch('datos.json') — panel semanal estático
   ├── personajes.html  → 7× fetch(Raider.io) — datos en vivo al cargar
   ├── rutas.html       → datos hardcodeados en JS + fetch('datos.json') para rutas populares
   └── kreathor.html    → fetch(Raider.io) — 13 tabs interactivas con localStorage
       └── 6 chars HTML → mismo patrón que kreathor.html pero con clase/spec propia
```

## 🔑 Convenciones de código

### HTML
- Cada página es **completamente autónoma** (CSS + JS inline)
- No hay archivos `.css` ni `.js` externos
- Google Fonts se carga por separado en cada página
- Idioma: `lang="es"`, charset UTF-8

### CSS
- **No minificado** en `index.html`, `personajes.html`, `rutas.html`
- **Minificado** en `kreathor.html` y templates de `gen_chars.py`
- Paleta consistente: fondo `#07080f`/`#0e0f1a`, texto `#ccd0e0`, acentos `#F8B700`
- Fuentes: `Cinzel` (títulos) + `Exo 2` (cuerpo) en páginas detalladas
- Responsive: `@media (max-width: 700px)` en todas las páginas

### JavaScript
- **Sin frameworks** — vanilla JS puro
- **Sin modules** — scripts inline con funciones globales (`ST`, `SG`, etc.)
- **localStorage** para persistencia: checklist, crests, notas, rotación
- Fetch a Raider.io API con `Promise.allSettled` para tolerancia a fallos
- Contador regresivo: reset semanal NA (martes 15:00 UTC)

### Python
- Solo librería estándar (`urllib`, `json`, `datetime`, `base64`, `os`)
- No usa `requests`, `httpx`, ni dependencias externas
- Compatible con Python 3.x (sin type hints)

## 🌐 APIs externas

| API | Páginas | Autenticación | Notas |
|---|---|---|---|
| **Raider.io** | `personajes.html`, `kreathor.html`, 6 chars | Sin auth | Pública, campos: `mythic_plus_scores_by_season:current,gear,raid_progression,class,thumbnail_url,mythic_plus_recent_runs,mythic_plus_best_runs:current` |
| **Blizzard** | `actualizar_datos.py` | `BLIZZARD_CLIENT_ID` + `BLIZZARD_CLIENT_SECRET` | Solo funciona en GH Actions (secrets). Token OAuth2, expira en 24h |
| **Keystone.guru** | `rutas.html`, `actualizar_datos.py` | N/A | **SPA, no scrapeable**. Rutas hardcodeadas manualmente |

### ⚠️ Raider.io — campos importantes
- `active_spec_name` — spec activo (en raíz del JSON)
- `datos.spec?.name` — **NO existe**, causa bug si se usa
- `mythic_plus_scores_by_season[0].scores.all` — score global
- `gear.item_level_equipped` — ilvl equipado
- `raid_progression['tier-mn-1']` — progreso raid Midnight S1

## 🎨 Diseño

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
| Kreathor | Death Knight Blood | TANK | `kreathor.html` | Principal, 13 tabs completas |
| Muchufaza | Monk Brewmaster | TANK | `muchufaza.html` | Template genérico |
| Czernobög | Druid Guardian | TANK | `czernobog.html` | Template genérico |
| Oldkreeper | Shaman Elemental | DPS | `oldkreeper.html` | Template genérico |
| Redguardïan | Paladin Retribution | DPS | `redguardian.html` | Template genérico |
| Krëeper | Warrior Protection | TANK | `kreeper.html` | Template genérico |
| Nösferätü | Demon Hunter Vengeance | TANK | `nosferatu.html` | Template genérico |

> ⚠️ Personajes con caracteres especiales usan URL-encoding en fetches a Raider.io

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
- Ejecuta `actualizar_datos.py`
- Hace commit + push de `datos.json`
- Secrets: `BLIZZARD_CLIENT_ID`, `BLIZZARD_CLIENT_SECRET`

### Dev local
```bash
cd wowexplorador-temp/
python actualizar_datos.py       # genera datos.json (Blizzard falla sin secrets)
python gen_chars.py              # regenera páginas de 6 personajes secundarios
python -m http.server 8080       # → http://localhost:8080
```

## 💾 localStorage — Keys y estructura

### Checklist
- `{px}_w_{YYYY-MM-DD}` — tareas semanales (dict {id: bool})
- `{px}_d_{YYYY-MM-DD}` — tareas diarias (dict {id: bool})
- `{px}` = prefijo de 2 letras del personaje (ej: `mu`, `cz`, `ok`, `rg`, `kp`, `ns`, `kr`)

### Crests
- `{px}_crests_{YYYY-MM-DD}` — crests semanales (dict {id: count})
- `{px}_crests_hist` — historial (array de 8 semanas máx)

### Notas
- `{px}_note_{dungeon_id}` — notas por mazmorra (string)

### Reset semanal
- Se calcula: próximo martes 15:00 UTC
- Keys se rotan automáticamente usando la fecha del reset

## 🚨 Bugs conocidos

| Bug | Causa | Estado |
|---|---|---|
| `datos.spec?.name` undefined | API retorna `active_spec_name` en raíz | ✅ Fixeado (2026-04-28) |
| Progreso raid "Sin datos" | Claves `voidspire/dreamrift/march` no existen en S1 | ✅ Fixeado → `tier-mn-1` |
| Thumbnails rotos en rutas | Keystone.guru bloquea hotlink | ✅ Fixeado → placeholders 🗺️ |

## 🔧 Deuda técnica

1. **JS duplicado** — `gen_chars.py` genera 6 páginas con ~200 líneas de JS idéntico a `kreathor.html`. No hay archivo JS compartido porque el sitio es estático sin build step.
2. **Rutas duplicadas** — las rutas de Keystone.guru están hardcodeadas en `actualizar_datos.py` Y en `rutas.html`. Mantener sincronizadas manualmente.
3. **Sin tests** — no hay validación del script Python ni del formato de `datos.json`.
4. **Sin CSS compartido** — cada página carga Google Fonts por separado (~2 requests extra).
5. **Sin SPA** — 10 archivos HTML independientes, navegación recarga completa.

## 📝 Flujo de trabajo para modificaciones

### Agregar nueva mazmorra
1. `rutas.html`: agregar entrada en `const DUNGEONS[]`
2. `actualizar_datos.py`: agregar entradas en `obtener_rutas_midnight()`
3. Si usa notes/checklist: agregar en `DNGS_IO` y `DNGS_LIST` en las páginas de personajes

### Cambiar personaje principal (kreathor.html)
- Las tabs están hardcodeadas en el HTML
- Los datos de BiS, encantamientos, talentos, rotación están inline
- Actualizar links de Wowhead cuando cambie el tier

### Regenerar páginas de personajes secundarios
```bash
python gen_chars.py
```
Esto regenera los 6 archivos desde el template. Cualquier cambio manual se pierde.

### Modificar página de personaje secundario
- Editar directamente el archivo HTML si es cambio puntual
- Si el cambio debe persistir tras regeneración, modificar `gen_chars.py`
- La función `gen(c)` en `gen_chars.py` genera el HTML completo

### Actualizar datos manualmente
```bash
python actualizar_datos.py
# Verifica datos.json generado
git add datos.json && git commit -m "update datos" && git push
```
