# WoW Explorador

Panel semanal de World of Warcraft para la hermandad. Datos de Mythic+, afijos, token, rutas y seguimiento de 7 personajes en Quel'Thalas (US).

**Sitio:** https://oldmanu78.github.io/wowexplorador

## Stack

HTML/CSS/JS puro + Python + GitHub Pages + GitHub Actions. Sin frameworks, sin bundlers.

## Estructura

| Archivo | Función |
|---|---|
| `index.html` | Panel semanal (afijos, evento, token, jefe, invasiones, noticias, ranking M+) |
| `personajes.html` | Cards de 7 personajes con datos en vivo de Raider.io |
| `rutas.html` | 8 mazmorras Midnight S1 con tabs, rutas curadas y guías |
| `kreathor.html` | Perfil Blood DK con 13 tabs (checklist, crests, gear, rotación, notas, etc.) |
| 6 × `*.html` | Perfiles secundarios (Muchufaza, Czernobög, Oldkreeper, Redguardïan, Krëeper, Nösferätü) |
| `actualizar_datos.py` | Script semanal que obtiene datos de Raider.io y Blizzard API |
| `gen_chars.py` | Generador de páginas de personajes secundarios |
| `validate.py` | Valida integridad de datos.json, Python y HTML |
| `datos.json` | Datos semanales (afijos, rutas, ranking, etc.) |
| `js/character-common.js` | JS compartido entre páginas de personajes |
| `css/fonts.css` | Fuentes compartidas (Cinzel, Exo 2, Nunito) |
| `.github/workflows/actualizador.yml` | Cron semanal (martes 15:00 UTC) |

## Uso local

```bash
python actualizar_datos.py    # genera datos.json
python gen_chars.py           # regenera páginas secundarias
python validate.py             # valida todo
python -m http.server 8080    # servidor local
```

## APIs

- **Raider.io** — datos de personajes y afijos (pública)
- **Blizzard API** — precio del Token (requiere secrets de GH Actions)
- **Keystone.guru** — rutas de mazmorras (hardcodeadas manualmente)

## Personajes

| Nombre | Clase | Rol |
|---|---|---|
| Kreathor | Death Knight Blood | Tanque |
| Muchufaza | Monk Brewmaster | Tanque |
| Czernobög | Druid Guardian | Tanque |
| Oldkreeper | Shaman Elemental | DPS |
| Redguardïan | Paladin Retribution | DPS |
| Krëeper | Warrior Protection | Tanque |
| Nösferätü | Demon Hunter Vengeance | Tanque |

## Licencia

Proyecto personal no afiliado con Blizzard Entertainment.
