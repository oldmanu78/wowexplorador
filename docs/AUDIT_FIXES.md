# Correcciones de Auditoria

Fecha: 2026-05-28

## Resumen

Se corrigieron los hallazgos principales de la auditoria del proyecto WoW Explorador:

- errores de ESLint por `any` y navegación interna con `<a>`;
- stats de Armory no visibles por desalineación entre pipeline y componente;
- Gear tab vacío aunque Raider.io entregaba equipo;
- rutas de imágenes incompatibles con GitHub Pages `basePath`;
- pipeline SQLite con riesgo de base parcial;
- vulnerabilidades moderadas reportadas por `npm audit`;
- documentación inicial genérica de Next.js.

## Cambios técnicos

### TypeScript y datos de Raider.io

Se agregó `src/lib/wow-types.ts` con tipos compartidos para:

- `RaiderIoProfile`
- `RioRun`
- `RioGearItem`
- `RaidProgression`
- `ArmoryStats`

Los componentes ahora parsean JSON externo con tipos explícitos en vez de `Record<string, any>`.

### Stats y Gear

`StatsPanel` ahora lee el formato real guardado por el pipeline:

```json
{
  "strength": { "type": "WHOLE", "value": 1812 },
  "haste": { "type": "PERCENTAGE", "value": 27.14 },
  "ilvl": 278
}
```

La página de personaje transforma `rio.gear.items` a datos de `GearPanel`, por lo que el tab `Gear & BiS` ya no queda forzado a `gear={[]}`.

### GitHub Pages y assets

Se agregó `withBasePath()` para convertir rutas como `/images/algethar.jpg` en `/wowexplorador/images/algethar.jpg` durante el render estático.

### Pipeline Python

`scripts/actualizar_datos.py` ahora:

- reintenta llamadas HTTP 429/5xx con backoff simple;
- usa el parámetro `region` en la URL de Armory;
- escribe en `prisma/wow.tmp.db`;
- reemplaza `prisma/wow.db` solo si todo terminó correctamente.

### Dependencias

Se agregaron overrides en `package.json` para resolver vulnerabilidades transitivas:

- `postcss`
- `@hono/node-server`

`npm audit --audit-level=moderate` queda en cero vulnerabilidades.

## Verificación

Comandos ejecutados correctamente:

```bash
npm run lint
python -m py_compile scripts\actualizar_datos.py scripts\validate.py
npm run validate
npm audit --audit-level=moderate
```

Build verificado en copia limpia:

```bash
npm ci
npm run build
```

Resultado del build:

- compilación correcta;
- TypeScript correcto;
- 13 páginas estáticas generadas;
- rutas SSG para los 7 personajes.

## Nota de entorno local

El directorio `.next` del workspace original quedó con archivos generados bloqueados por permisos de Windows y no pudo eliminarse sin privilegios de administrador. No forma parte del repo ni afecta CI, porque `.next/` está ignorado y el build pasó en una copia limpia.

---

Fecha: 2026-06-15

## Auditoría de Branding, Mapas y Personajes

Se registran las correcciones posteriores al rediseño Horda-UNO y a la revisión solicitada de la página.

### Branding Horda

Problema detectado:

- El sitio usaba un símbolo tipo estrella junto a "WoW Explorador" que no correspondía al emblema de la Horda.
- El símbolo se repetía en varias zonas del frontend.

Corrección aplicada:

- Se reemplazó el arte por la silueta correcta entregada por el usuario.
- Se generó `public/images/horde-emblem-mask.png`.
- Se creó `src/components/ui/HordeEmblem.tsx` para aplicar color y tamaño desde el sistema visual.
- Header, footer y hero principal reutilizan el mismo componente.
- Se eliminó `public/horde-crest.svg` para evitar duplicidad.

### Mapas y rutas

Problemas detectados:

- Los mapas tenían placeholders genéricos y no comunicaban bien la ruta.
- Algunas cards de ruta mostraban texto "MAP" en vez de una vista visual útil.
- El pipeline tenía URLs de Keystone Guru ficticias tipo `/route/aa-pug-1`.

Corrección aplicada:

- Se agregó `src/components/routes/DungeonMapPreview.tsx`.
- `DungeonHero` y `RouteCard` usan una previsualización generada por mazmorra.
- `DungeonTabs` recibió ajustes de búsqueda, labels y transiciones.
- `scripts/actualizar_datos.py` ahora escribe URLs de listados reales por dungeon.
- Para Nexus-Point Xenas se dejó la URL `nexuspoint-xenas`, que coincide con Keystone Guru.

### Iconos de clases y razas

Corrección aplicada:

- Se revisó el frontend nuevo en `D:\Projects\FRONTEND\UNO`.
- Se extrajeron referencias de iconos de clase y raza desde Wowhead.
- Se agregó `src/lib/wow-assets.ts`.
- Se agregó `src/components/ui/WowIcon.tsx`.
- `CharacterCard` y `HeroSection` muestran iconos de clase/raza cuando existen datos suficientes.
- `next.config.ts` permite imágenes remotas desde `wow.zamimg.com`.

### Panel de personaje

Problemas detectados:

- La sección `Gear & BiS` no se entendía.
- `StatsPanel` no mostraba el porcentaje de cada stat porcentual.
- `MonedasPanel` solo permitía valores manuales y no mostraba tokens/monedas actuales del personaje.

Corrección aplicada:

- `StatsPanel` muestra stats porcentuales como `valor (porcentaje%)`.
- `GearPanel` fue reorganizado como equipo actual: slot, icono, nombre, ilvl, calidad, tier, gemas y encantamientos.
- La página de personaje pasa datos completos de Raider.io hacia `GearPanel`.
- `MonedasPanel` muestra `armory.currencies` cuando el pipeline obtiene monedas reales y conserva localStorage para seguimiento manual.
- `scripts/actualizar_datos.py` consulta Blizzard Character Currency cuando hay OAuth.
- `src/lib/wow-types.ts` documenta los nuevos campos de gear, raza, facción y monedas.

### Verificación

Comandos ejecutados correctamente:

```bash
npm run lint
npx tsc --noEmit
python -m py_compile scripts\actualizar_datos.py scripts\validate.py
npm run validate
npm audit --audit-level=moderate
```

### Limitación local

La verificación visual automatizada con `agent-browser` no quedó disponible en este entorno porque el CLI no pudo mantener abierta la conexión CDP. El build local completo también puede fallar por bloqueo de `.next` en Windows o por descarga de Google Fonts bajo sandbox. La verificación confiable para publicación queda en GitHub Actions, que construye desde un workspace limpio.
