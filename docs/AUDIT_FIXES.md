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
